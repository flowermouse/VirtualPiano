// 钢琴音频引擎：优先使用 Salamander Grand Piano 采样（本地 samples/ 或 CDN），
// 采样未加载完成或加载失败时使用合成音色兜底。
(function () {
  const CDN = "https://tonejs.github.io/audio/salamander/";
  const PC = { C: 0, Ds: 3, Fs: 6, A: 9 };

  function sampleList() {
    const list = [{ name: "A0", midi: 21 }];
    for (let o = 1; o <= 7; o++) {
      for (const p of ["C", "Ds", "Fs", "A"]) list.push({ name: p + o, midi: 12 * (o + 1) + PC[p] });
    }
    list.push({ name: "C8", midi: 108 });
    return list;
  }

  class PianoAudio {
    constructor() {
      this.ctx = null;
      this.buffers = new Map(); // midi -> AudioBuffer
      this.voices = new Map(); // voice id -> voice
      this.byMidi = new Map(); // midi -> Set<voice>
      this.sustain = true;
      this.volume = 0.8;
      this.onProgress = null;
    }

    // 必须在用户手势（按键 / 点击）里调用
    ensure() {
      if (!this.ctx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new Ctx({ latencyHint: "interactive" });
        this.master = this.ctx.createGain();
        this.master.gain.value = this.volume;
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = -14;
        comp.ratio.value = 4;
        this.master.connect(comp).connect(this.ctx.destination);
        this.loadSamples();
      }
      if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
    }

    setVolume(v) {
      this.volume = v;
      if (this.master) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02);
    }

    async loadSamples() {
      const list = sampleList();
      let done = 0;
      const report = () => this.onProgress && this.onProgress(done, list.length, this.buffers.size);
      report();
      await Promise.all(
        list.map(async (s) => {
          for (const base of ["samples/", CDN]) {
            try {
              const res = await fetch(base + s.name + ".mp3");
              if (!res.ok) continue;
              const buf = await this.ctx.decodeAudioData(await res.arrayBuffer());
              this.buffers.set(s.midi, buf);
              break;
            } catch (e) {
              /* 尝试下一个来源 */
            }
          }
          done++;
          report();
        })
      );
    }

    nearestSample(midi) {
      let best = null;
      let bestDist = Infinity;
      for (const m of this.buffers.keys()) {
        const d = Math.abs(m - midi);
        if (d < bestDist) { best = m; bestDist = d; }
      }
      return bestDist <= 6 ? best : null;
    }

    noteOn(id, midi, velocity = 0.85) {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      // 同一个键重复触发：先放掉旧声音
      if (this.voices.has(id)) this.release(this.voices.get(id), 0.05);
      // 同一音高再次敲击：琴弦被重新击打，旧声音快速衰减
      for (const v of this.byMidi.get(midi) || []) this.release(v, 0.12);

      const gain = this.ctx.createGain();
      gain.connect(this.master);
      const voice = { id, midi, gain, nodes: [], held: true, released: false };

      const sm = this.nearestSample(midi);
      if (sm !== null) {
        const src = this.ctx.createBufferSource();
        src.buffer = this.buffers.get(sm);
        src.playbackRate.value = Math.pow(2, (midi - sm) / 12);
        gain.gain.setValueAtTime(velocity, t);
        src.connect(gain);
        src.start(t);
        src.onended = () => this.cleanup(voice);
        voice.nodes.push(src);
      } else {
        this.synth(voice, midi, velocity, t);
      }

      this.voices.set(id, voice);
      if (!this.byMidi.has(midi)) this.byMidi.set(midi, new Set());
      this.byMidi.get(midi).add(voice);
    }

    // 合成音色兜底：若干泛音 + 指数衰减，听起来像电钢琴
    synth(voice, midi, velocity, t) {
      const f = 440 * Math.pow(2, (midi - 69) / 12);
      const decay = Math.max(0.8, 3.2 - (midi - 36) * 0.035);
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(Math.min(12000, f * 8), t);
      filter.frequency.exponentialRampToValueAtTime(Math.max(400, f * 2), t + decay);
      filter.connect(voice.gain);
      const partials = [1, 0.45, 0.25, 0.12, 0.08, 0.04];
      partials.forEach((amp, i) => {
        const osc = this.ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = f * (i + 1) * (1 + i * 0.0006);
        const g = this.ctx.createGain();
        g.gain.value = amp * 0.35;
        osc.connect(g).connect(filter);
        osc.start(t);
        osc.stop(t + decay + 0.1);
        voice.nodes.push(osc);
      });
      voice.nodes[0].onended = () => this.cleanup(voice);
      voice.gain.gain.setValueAtTime(0.0001, t);
      voice.gain.gain.exponentialRampToValueAtTime(velocity, t + 0.006);
      voice.gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    }

    noteOff(id) {
      const v = this.voices.get(id);
      if (!v) return;
      v.held = false;
      this.voices.delete(id);
      if (!this.sustain) this.release(v, 0.18);
    }

    setSustain(on) {
      this.sustain = on;
      if (!on) {
        for (const set of this.byMidi.values()) {
          for (const v of set) if (!v.held) this.release(v, 0.18);
        }
      }
    }

    release(v, time) {
      if (v.released || !this.ctx) return;
      v.released = true;
      const t = this.ctx.currentTime;
      const g = v.gain.gain;
      if (g.cancelAndHoldAtTime) g.cancelAndHoldAtTime(t);
      else { g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); }
      g.setTargetAtTime(0, t, time / 3);
      for (const n of v.nodes) {
        try { n.stop(t + time * 2 + 0.05); } catch (e) { /* 已停止 */ }
      }
      if (this.voices.get(v.id) === v) this.voices.delete(v.id);
    }

    cleanup(v) {
      const set = this.byMidi.get(v.midi);
      if (set) set.delete(v);
      if (this.voices.get(v.id) === v) this.voices.delete(v.id);
      try { v.gain.disconnect(); } catch (e) { /* ignore */ }
    }

    stopAll() {
      for (const set of this.byMidi.values()) for (const v of set) this.release(v, 0.1);
    }
  }

  window.PianoAudio = PianoAudio;
})();
