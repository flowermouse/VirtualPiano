(function () {
  // ---------- 键位 ----------
  // 演奏布局：Mac 键盘 4 行 × 10 键，按半音顺序依次排列，无需 Shift
  const PLAY_KEYS = "1234567890qwertyuiopasdfghjkl;zxcvbnm,./";
  const PLAY_CODES = [
    "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0",
    "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP",
    "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon",
    "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash",
  ];
  const KEY_COUNT = PLAY_KEYS.length; // 40
  const CODE_TO_IDX = new Map(PLAY_CODES.map((c, i) => [c, i]));

  // 乐谱记谱：标准 Virtual Piano 61 键（C2 ~ C7），网上的乐谱都是这个格式
  const STD_KEYS = "1!2@34$5%6^78*9(0qQwWeErtTyYuiIoOpPasSdDfgGhHjJklLzZxcCvVbBnm";
  const STD_BASE = 36; // "1" = C2

  const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const WHITE_PCS = new Set([0, 2, 4, 5, 7, 9, 11]);
  const isWhite = (midi) => WHITE_PCS.has(((midi % 12) + 12) % 12);
  const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
  const DEFAULT_START = 48; // C3
  const LS_KEY = "vp.settings";
  const LS_SONGS = "vp.customSongs";

  const $ = (id) => document.getElementById(id);
  const els = {
    songSelect: $("songSelect"), addSong: $("addSongBtn"), editSong: $("editSongBtn"), deleteSong: $("deleteSongBtn"),
    title: $("songTitle"), meta: $("songMeta"), tabs: $("tabs"), sheet: $("sheet"), progress: $("progressBar"),
    transDown: $("transDown"), transUp: $("transUp"), transVal: $("transVal"), speedBtn: $("speedBtn"), speedVal: $("speedVal"),
    sustain: $("sustainToggle"), volume: $("volume"), reset: $("resetBtn"), stats: $("stats"),
    back: $("backBtn"), play: $("playBtn"), playIcon: $("playIcon"), pauseIcon: $("pauseIcon"),
    labelKeys: $("labelKeys"), piano: $("piano"), status: $("sampleStatus"),
    info: $("infoBtn"), infoDialog: $("infoDialog"), copy: $("copyBtn"),
    songDialog: $("songDialog"), songForm: $("songForm"), songDialogTitle: $("songDialogTitle"), songCancel: $("songCancel"),
    toast: $("toast"),
  };

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 无痕模式等 */ }
    },
  };

  const saved = store.get(LS_KEY, {});
  const state = {
    trans: saved.trans || 0,
    speedIdx: SPEEDS.indexOf(saved.speed) >= 0 ? SPEEDS.indexOf(saved.speed) : 3,
    sustain: saved.sustain !== false,
    volume: typeof saved.volume === "number" ? saved.volume : 0.8,
    showLabels: saved.showLabels !== false,
    songId: saved.songId,
    versionIdx: saved.versionIdx || 0,
    startMidi: DEFAULT_START, // 键盘最左边那个键（"1"）的音高
    song: null,
    steps: [],
    lineEls: [],
    cursor: 0,
    hits: new Set(),
    missed: new Set(),
    playing: false,
    playPos: 0,
    timers: new Set(),
    autoSeq: 0,
  };

  const audio = new window.PianoAudio();
  audio.sustain = state.sustain;
  audio.volume = state.volume;

  function saveSettings() {
    store.set(LS_KEY, {
      trans: state.trans, speed: SPEEDS[state.speedIdx], sustain: state.sustain, volume: state.volume,
      showLabels: state.showLabels, songId: state.song && state.song.id, versionIdx: state.versionIdx,
    });
  }

  const noteName = (midi) => NOTE_NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
  const keyMidi = (idx) => state.startMidi + idx;

  // 把任意音高映射到 40 键窗口内（超出音域的按八度折回）
  function midiToIdx(midi) {
    let m = midi;
    while (m < state.startMidi) m += 12;
    while (m > state.startMidi + KEY_COUNT - 1) m -= 12;
    return m - state.startMidi;
  }

  // 为一首曲子挑选最合适的 40 键音域：覆盖最多的音（旋律音权重更高），其次居中，优先从 C 开始
  // notes: [{ midi, weight }]
  function fitWindow(notes) {
    const midis = notes.map((n) => n.midi);
    if (!midis.length) return DEFAULT_START;
    const lo = Math.min(...midis);
    const hi = Math.max(...midis);
    let best = null;
    for (let s = 21; s + KEY_COUNT - 1 <= 108; s++) {
      if (!isWhite(s)) continue;
      const covered = notes.reduce((sum, n) => sum + (n.midi >= s && n.midi < s + KEY_COUNT ? n.weight : 0), 0);
      const offCenter = Math.abs(s + (KEY_COUNT - 1) / 2 - (lo + hi) / 2);
      const cand = { s, covered, score: offCenter - (s % 12 === 0 ? 3 : 0) };
      if (!best || cand.covered > best.covered || (cand.covered === best.covered && cand.score < best.score)) best = cand;
    }
    return best.s;
  }

  // ---------- 曲库 ----------
  let customSongs = store.get(LS_SONGS, []);
  const allSongs = () => [...window.BUILTIN_SONGS, ...customSongs];
  const isCustom = (song) => song && String(song.id).startsWith("custom-");

  function renderSongSelect() {
    const sel = els.songSelect;
    sel.innerHTML = "";
    const groups = [["内置曲目", window.BUILTIN_SONGS], ["我的乐谱", customSongs]];
    for (const [label, songs] of groups) {
      if (!songs.length) continue;
      const g = document.createElement("optgroup");
      g.label = label;
      for (const s of songs) {
        const o = document.createElement("option");
        o.value = s.id;
        o.textContent = s.title + (s.artist ? " — " + s.artist : "");
        g.appendChild(o);
      }
      sel.appendChild(g);
    }
    if (state.song) sel.value = state.song.id;
  }

  // ---------- 乐谱解析（输入为标准 Virtual Piano 记谱） ----------
  // 返回 lines: [[token]]，token: {type: note|chord|fast|rest|text, text, midis, units, gap}
  function parseSheet(text) {
    const lines = [];
    const toMidi = (c) => STD_BASE + STD_KEYS.indexOf(c);
    for (const raw of text.replace(/\r/g, "").split("\n")) {
      const tokens = [];
      let gap = false;
      let i = 0;
      while (i < raw.length) {
        const ch = raw[i];
        if (/\s/.test(ch)) { gap = true; i++; continue; }
        const push = (tok) => { tok.gap = gap && tokens.length > 0; tokens.push(tok); gap = false; };
        if (ch === "[") {
          const j = raw.indexOf("]", i + 1);
          if (j > i) {
            const inner = raw.slice(i + 1, j);
            const midis = [...inner].filter((c) => STD_KEYS.includes(c)).map(toMidi);
            const fast = /\S\s+\S/.test(inner);
            if (midis.length) push({ type: fast ? "fast" : "chord", text: raw.slice(i, j + 1), midis, units: 1 });
            else push({ type: "text", text: raw.slice(i, j + 1), units: 0 });
            i = j + 1;
            continue;
          }
        }
        if (ch === "-") push({ type: "rest", text: "-", units: 1 });
        else if (ch === "|") push({ type: "rest", text: "|", units: 2 });
        else if (STD_KEYS.includes(ch)) push({ type: "note", text: ch, midis: [toMidi(ch)], units: 1 });
        else push({ type: "text", text: ch, units: 0 });
        i++;
      }
      lines.push(tokens);
    }
    while (lines.length && !lines[lines.length - 1].length) lines.pop();
    return lines;
  }

  function renderSheet(text) {
    const lines = parseSheet(text);
    // 中央 C 以上视为旋律，权重更高：音域放不下时优先把低音伴奏移八度
    const weighted = lines.flat().flatMap((t) => (t.midis || []).map((midi) => ({ midi, weight: midi >= 60 ? 10 : 1 })));
    state.startMidi = fitWindow(weighted);

    const sheet = els.sheet;
    sheet.innerHTML = "";
    state.steps = [];
    state.lineEls = [];
    lines.forEach((tokens, li) => {
      const lineEl = document.createElement("div");
      lineEl.className = "line" + (tokens.length ? "" : " empty");
      state.lineEls.push(lineEl);
      for (const tok of tokens) {
        const el = document.createElement("span");
        el.className = "tok " + tok.type + (tok.gap ? " gap" : "");
        if (tok.midis) {
          // 换算成 40 键布局里的按键
          tok.keys = tok.midis.map(midiToIdx);
          const folded = tok.midis.filter((m, k) => keyMidi(tok.keys[k]) !== m);
          if (folded.length) {
            el.classList.add("folded");
            el.title = "超出音域，已移八度：" + folded.map(noteName).join(" ");
          }
          if (tok.type === "note") {
            el.textContent = PLAY_KEYS[tok.keys[0]];
          } else {
            tok.charEls = [];
            el.append("[");
            tok.uniqKeys = [...new Set(tok.keys)]; // 折回八度后可能和和弦里的其他音重合
            tok.uniqKeys.forEach((idx, k) => {
              if (k > 0 && tok.type === "fast") el.append(" ");
              const s = document.createElement("span");
              s.textContent = PLAY_KEYS[idx];
              tok.charEls.push({ idx, el: s });
              el.appendChild(s);
            });
            el.append("]");
          }
        } else {
          el.textContent = tok.text;
        }
        lineEl.appendChild(el);
        if (tok.type === "text") continue;
        tok.el = el;
        tok.line = li;
        tok.index = state.steps.length;
        tok.uniq = tok.keys ? [...new Set(tok.keys)] : [];
        el.dataset.step = tok.index;
        state.steps.push(tok);
      }
      sheet.appendChild(lineEl);
    });
    // 每个音符的持续时间 = 自身 + 紧随其后的停顿
    for (let i = state.steps.length - 1, rest = 0; i >= 0; i--) {
      const s = state.steps[i];
      if (s.type === "rest") rest += s.units;
      else { s.hold = s.units + rest; rest = 0; }
    }
    buildPiano();
  }

  const isPlayable = (s) => s && s.type !== "rest";
  function skipRests(i) {
    while (i < state.steps.length && !isPlayable(state.steps[i])) i++;
    return i;
  }

  // ---------- 视图更新 ----------
  let lastScrollLine = -1;
  function updateView() {
    const { steps, cursor, missed, hits } = state;
    for (const s of steps) {
      const i = s.index;
      const cls = s.el.classList;
      cls.toggle("done", i < cursor);
      cls.toggle("current", i === cursor);
      cls.toggle("miss", missed.has(i));
      if (s.charEls) for (const ce of s.charEls) ce.el.classList.toggle("hit", i === cursor && hits.has(ce.idx));
    }
    // 琴键提示
    for (const k of keyEls) k.classList.remove("hint");
    const cur = steps[cursor];
    if (!state.playing && isPlayable(cur)) {
      for (const idx of cur.uniq) if (!hits.has(idx)) keyEls[idx].classList.add("hint");
    }
    // 进度
    const total = steps.length || 1;
    els.progress.style.width = (Math.min(cursor, total) / total) * 100 + "%";
    const playable = steps.filter(isPlayable);
    const doneCount = playable.filter((s) => s.index < cursor).length;
    els.stats.textContent = `${doneCount}/${playable.length}` + (missed.size ? ` · 错 ${missed.size}` : "");
    scrollToCursor();
  }

  function scrollToCursor() {
    const s = state.steps[Math.min(state.cursor, state.steps.length - 1)];
    if (!s) return;
    if (s.line === lastScrollLine) return;
    lastScrollLine = s.line;
    const lineEl = state.lineEls[s.line];
    const prev = state.lineEls[s.line - 1];
    const top = (prev || lineEl).offsetTop - 8;
    els.sheet.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function setCursor(i) {
    state.cursor = skipRests(Math.max(0, i));
    state.hits.clear();
    lastScrollLine = -1;
    updateView();
  }

  // ---------- 歌曲加载 ----------
  function loadSong(id, versionIdx = 0) {
    stopPlayback();
    const song = allSongs().find((s) => s.id === id) || allSongs()[0];
    state.song = song;
    state.versionIdx = Math.min(versionIdx, song.versions.length - 1);
    els.songSelect.value = song.id;
    els.title.textContent = song.title;
    document.title = song.title + " · Virtual Piano";
    els.editSong.classList.toggle("hidden", !isCustom(song));
    els.deleteSong.classList.toggle("hidden", !isCustom(song));
    renderTabs();
    loadVersion(state.versionIdx);
  }

  function renderTabs() {
    els.tabs.innerHTML = "";
    state.song.versions.forEach((v, i) => {
      const b = document.createElement("button");
      b.textContent = v.difficulty;
      b.classList.toggle("active", i === state.versionIdx);
      b.addEventListener("click", () => loadVersion(i));
      els.tabs.appendChild(b);
    });
  }

  function loadVersion(i) {
    stopPlayback();
    for (const id of [...held.keys()]) releaseKey(id);
    state.versionIdx = i;
    [...els.tabs.children].forEach((b, j) => b.classList.toggle("active", i === j));
    const song = state.song;
    renderSheet(song.versions[i].sheet);
    const range = `音域 ${noteName(keyMidi(0))}–${noteName(keyMidi(KEY_COUNT - 1))}`;
    els.meta.textContent = [song.artist, `${song.bpm} BPM`, song.versions[i].difficulty, range].filter(Boolean).join(" · ");
    state.missed.clear();
    els.sheet.scrollTop = 0;
    setCursor(0);
    saveSettings();
  }

  // ---------- 钢琴键盘（只显示当前 40 键音域） ----------
  let keyEls = []; // idx -> element
  const activeCount = new Map();

  function buildPiano() {
    const piano = els.piano;
    piano.innerHTML = "";
    keyEls = [];
    activeCount.clear();
    // 最后一个键是黑键时，右侧留出半个键位，避免黑键露出边缘
    const tail = isWhite(keyMidi(KEY_COUNT - 1)) ? 0 : 0.4;
    const units = PLAY_KEYS.split("").filter((_, i) => isWhite(keyMidi(i))).length + tail;
    const blackW = (100 / units) * 0.62;
    let whites = 0;
    for (let i = 0; i < KEY_COUNT; i++) {
      const white = isWhite(keyMidi(i));
      const el = document.createElement("div");
      el.className = "key " + (white ? "white" : "black");
      el.dataset.idx = i;
      el.title = noteName(keyMidi(i));
      el.innerHTML = '<span class="lbl"></span>';
      if (white) whites++;
      else {
        el.style.left = `calc(${(whites / units) * 100}% - ${blackW / 2}%)`;
        el.style.width = blackW + "%";
      }
      piano.appendChild(el);
      keyEls.push(el);
    }
    if (tail) {
      const spacer = document.createElement("div");
      spacer.style.flex = String(tail);
      piano.appendChild(spacer);
    }
    updateLabels();
  }

  function updateLabels() {
    keyEls.forEach((el, i) => { el.firstChild.textContent = state.showLabels ? PLAY_KEYS[i] : ""; });
    els.labelKeys.classList.toggle("active", state.showLabels);
  }

  function keyActive(idx, on) {
    const el = keyEls[idx];
    if (!el) return;
    const n = Math.max(0, (activeCount.get(idx) || 0) + (on ? 1 : -1));
    activeCount.set(idx, n);
    el.classList.toggle("active", n > 0);
  }

  function flashWrong(idx) {
    const el = keyEls[idx];
    if (el) {
      el.classList.add("wrong");
      setTimeout(() => el.classList.remove("wrong"), 220);
    }
    const cur = state.steps[state.cursor];
    if (cur) {
      cur.el.classList.remove("wrong");
      void cur.el.offsetWidth; // 重新触发动画
      cur.el.classList.add("wrong");
      setTimeout(() => cur.el.classList.remove("wrong"), 260);
    }
  }

  // ---------- 演奏 ----------
  const held = new Map(); // input id -> key idx

  function playMidi(id, midi, velocity) {
    const m = midi + state.trans;
    if (m >= 21 && m <= 108) audio.noteOn(id, m, velocity);
  }

  function pressKey(idx, inputId) {
    audio.ensure();
    if (held.has(inputId)) releaseKey(inputId);
    playMidi(inputId, keyMidi(idx));
    held.set(inputId, idx);
    keyActive(idx, true);
    practiceInput(idx);
  }

  function releaseKey(inputId) {
    const idx = held.get(inputId);
    if (idx === undefined) return;
    held.delete(inputId);
    audio.noteOff(inputId);
    keyActive(idx, false);
  }

  function practiceInput(idx) {
    if (state.playing) return;
    const step = state.steps[state.cursor];
    if (!isPlayable(step)) return;
    if (step.uniq.includes(idx)) {
      state.hits.add(idx);
      if (step.uniq.every((k) => state.hits.has(k))) {
        state.cursor = skipRests(state.cursor + 1);
        state.hits.clear();
        if (state.cursor >= state.steps.length) {
          const m = state.missed.size;
          toast(m ? `完成！有 ${m} 处弹错过，再来一遍吧` : "完美！一个都没错 🎉");
        }
      }
    } else {
      state.missed.add(state.cursor);
      flashWrong(idx);
    }
    updateView();
  }

  // ---------- 自动播放 ----------
  const unitMs = () => 60000 / state.song.bpm / 2 / SPEEDS[state.speedIdx];

  function later(fn, ms) {
    const t = setTimeout(() => { state.timers.delete(t); fn(); }, ms);
    state.timers.add(t);
  }

  function startPlayback() {
    audio.ensure();
    if (state.cursor >= state.steps.length) { state.missed.clear(); state.cursor = 0; }
    state.playing = true;
    state.playPos = state.cursor;
    els.playIcon.classList.add("hidden");
    els.pauseIcon.classList.remove("hidden");
    tick();
  }

  function tick() {
    if (!state.playing) return;
    if (state.playPos >= state.steps.length) {
      stopPlayback();
      state.cursor = state.steps.length;
      updateView();
      toast("播放完毕");
      return;
    }
    const step = state.steps[state.playPos];
    state.cursor = state.playPos;
    state.hits.clear();
    updateView();
    const u = unitMs();
    if (isPlayable(step)) {
      const n = step.midis.length;
      step.midis.forEach((midi, k) => {
        const idx = step.keys[k];
        const delay = step.type === "fast" ? (k * u) / n : 0;
        const holdMs = step.hold * u * 0.95 - delay;
        const play = () => {
          const id = "auto:" + state.autoSeq++;
          playMidi(id, midi, 0.8); // 自动播放用原始音高，琴键上高亮折回后的位置
          keyActive(idx, true);
          later(() => { audio.noteOff(id); keyActive(idx, false); }, Math.max(60, holdMs));
        };
        delay ? later(play, delay) : play();
      });
    }
    state.playPos++;
    later(tick, step.units * u);
  }

  function stopPlayback() {
    if (!state.playing) return;
    state.playing = false;
    for (const t of state.timers) clearTimeout(t);
    state.timers.clear();
    // 松开自动播放按下的键
    keyEls.forEach((el, idx) => {
      const n = [...held.values()].filter((k) => k === idx).length;
      activeCount.set(idx, n);
      el.classList.toggle("active", n > 0);
    });
    for (const id of [...audio.voices.keys()]) if (id.startsWith("auto:")) audio.noteOff(id);
    els.playIcon.classList.remove("hidden");
    els.pauseIcon.classList.add("hidden");
    state.cursor = skipRests(state.playPos);
    updateView();
  }

  const togglePlay = () => (state.playing ? stopPlayback() : startPlayback());

  // ---------- 控件 ----------
  function setTrans(v) {
    state.trans = Math.max(-12, Math.min(12, v));
    els.transVal.textContent = state.trans > 0 ? "+" + state.trans : state.trans;
    saveSettings();
  }

  function setSpeed(idx) {
    state.speedIdx = Math.max(0, Math.min(SPEEDS.length - 1, idx));
    els.speedVal.textContent = SPEEDS[state.speedIdx] + "x";
    saveSettings();
  }

  function setSustain(on) {
    state.sustain = on;
    els.sustain.checked = on;
    audio.setSustain(on);
    saveSettings();
  }

  function reset() {
    stopPlayback();
    state.missed.clear();
    setCursor(0);
  }

  function backLine() {
    const wasPlaying = state.playing;
    stopPlayback();
    const steps = state.steps;
    if (!steps.length) return;
    const cur = steps[Math.min(state.cursor, steps.length - 1)];
    const lineStart = (line) => steps.find((s) => s.line === line && isPlayable(s));
    let target = lineStart(cur.line);
    if (state.cursor < steps.length && target && target.index >= state.cursor) {
      for (let l = cur.line - 1; l >= 0; l--) {
        const t = lineStart(l);
        if (t) { target = t; break; }
      }
    }
    setCursor(target ? target.index : 0);
    if (wasPlaying) startPlayback();
  }

  let toastTimer;
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

  // 复制当前显示的 40 键布局乐谱
  async function copySheet() {
    const text = state.lineEls
      .map((l) => [...l.children].map((t) => (t.classList.contains("gap") ? " " : "") + t.textContent).join(""))
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    toast("乐谱已复制");
  }

  // ---------- 自定义乐谱 ----------
  let editingId = null;
  function openSongDialog(song) {
    editingId = song ? song.id : null;
    els.songDialogTitle.textContent = song ? "编辑乐谱" : "添加乐谱";
    const f = els.songForm.elements;
    f.title.value = song ? song.title : "";
    f.artist.value = song ? song.artist || "" : "";
    f.difficulty.value = song ? song.versions[0].difficulty : "Custom";
    f.bpm.value = song ? song.bpm : 120;
    f.sheet.value = song ? song.versions[0].sheet : "";
    els.songDialog.showModal();
  }

  els.songForm.addEventListener("submit", () => {
    const f = els.songForm.elements;
    const song = {
      id: editingId || "custom-" + Date.now(),
      title: f.title.value.trim() || "未命名",
      artist: f.artist.value.trim(),
      bpm: Math.max(20, Math.min(400, Number(f.bpm.value) || 120)),
      versions: [{ difficulty: f.difficulty.value.trim() || "Custom", sheet: f.sheet.value }],
    };
    const idx = customSongs.findIndex((s) => s.id === song.id);
    if (idx >= 0) customSongs[idx] = song;
    else customSongs.push(song);
    store.set(LS_SONGS, customSongs);
    renderSongSelect();
    loadSong(song.id, 0);
    toast("已保存");
  });
  els.songCancel.addEventListener("click", () => els.songDialog.close());

  els.addSong.addEventListener("click", () => openSongDialog(null));
  els.editSong.addEventListener("click", () => openSongDialog(state.song));
  els.deleteSong.addEventListener("click", () => {
    if (!isCustom(state.song) || !confirm(`删除「${state.song.title}」？`)) return;
    customSongs = customSongs.filter((s) => s.id !== state.song.id);
    store.set(LS_SONGS, customSongs);
    renderSongSelect();
    loadSong(window.BUILTIN_SONGS[0].id, 0);
  });

  // ---------- 事件绑定 ----------
  els.songSelect.addEventListener("change", () => {
    loadSong(els.songSelect.value, 0);
    els.songSelect.blur();
  });
  els.transDown.addEventListener("click", () => setTrans(state.trans - 1));
  els.transUp.addEventListener("click", () => setTrans(state.trans + 1));
  els.speedBtn.addEventListener("click", () => setSpeed((state.speedIdx + 1) % SPEEDS.length));
  els.sustain.addEventListener("change", () => setSustain(els.sustain.checked));
  els.volume.addEventListener("input", () => {
    state.volume = els.volume.value / 100;
    audio.setVolume(state.volume);
    saveSettings();
  });
  els.reset.addEventListener("click", reset);
  els.back.addEventListener("click", backLine);
  els.play.addEventListener("click", togglePlay);
  els.labelKeys.addEventListener("click", () => { state.showLabels = !state.showLabels; updateLabels(); saveSettings(); });
  els.info.addEventListener("click", () => els.infoDialog.showModal());
  els.copy.addEventListener("click", copySheet);

  els.sheet.addEventListener("click", (e) => {
    const tok = e.target.closest(".tok[data-step]");
    if (!tok) return;
    const wasPlaying = state.playing;
    stopPlayback();
    setCursor(Number(tok.dataset.step));
    if (wasPlaying) startPlayback();
  });

  // 点击按钮后移除焦点，避免空格键再次触发按钮
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b && !b.closest("dialog")) b.blur();
  });

  // 鼠标 / 触控弹奏
  els.piano.addEventListener("pointerdown", (e) => {
    const key = e.target.closest(".key");
    if (!key) return;
    e.preventDefault();
    pressKey(Number(key.dataset.idx), "ptr" + e.pointerId);
  });
  els.piano.addEventListener("pointerover", (e) => {
    // 按住鼠标滑过琴键（滑奏）
    if (!e.buttons || !held.has("ptr" + e.pointerId)) return;
    const key = e.target.closest(".key");
    if (key && held.get("ptr" + e.pointerId) !== Number(key.dataset.idx)) pressKey(Number(key.dataset.idx), "ptr" + e.pointerId);
  });
  const pointerUp = (e) => releaseKey("ptr" + e.pointerId);
  window.addEventListener("pointerup", pointerUp);
  window.addEventListener("pointercancel", pointerUp);

  // 电脑键盘弹奏：用 event.code 识别物理按键，不受输入法 / Shift / 键盘布局影响
  const isTyping = (t) => t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
  const dialogOpen = () => els.infoDialog.open || els.songDialog.open;

  // 优先按物理键位识别；个别环境下 code 为空时退回按字符识别
  function keyIndex(e) {
    const idx = CODE_TO_IDX.get(e.code);
    if (idx !== undefined) return idx;
    const i = e.key && e.key.length === 1 ? PLAY_KEYS.indexOf(e.key.toLowerCase()) : -1;
    return i >= 0 ? i : undefined;
  }
  const inputIdOf = (e, idx) => (CODE_TO_IDX.has(e.code) ? e.code : "key:" + idx);

  document.addEventListener("keydown", (e) => {
    if (dialogOpen() || isTyping(e.target)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const idx = keyIndex(e);
    if (idx !== undefined) {
      e.preventDefault();
      if (!e.repeat) pressKey(idx, inputIdOf(e, idx));
      return;
    }
    switch (e.code) {
      case "Space": e.preventDefault(); if (!e.repeat) togglePlay(); break;
      case "ArrowLeft": e.preventDefault(); setTrans(state.trans - 1); break;
      case "ArrowRight": e.preventDefault(); setTrans(state.trans + 1); break;
      case "ArrowUp": e.preventDefault(); setSpeed(state.speedIdx + 1); break;
      case "ArrowDown": e.preventDefault(); setSpeed(state.speedIdx - 1); break;
      case "Escape": reset(); break;
    }
  });
  document.addEventListener("keyup", (e) => {
    const idx = keyIndex(e);
    if (idx !== undefined) releaseKey(inputIdOf(e, idx));
  });
  window.addEventListener("blur", () => { for (const id of [...held.keys()]) releaseKey(id); });

  // ---------- 采样加载状态 ----------
  audio.onProgress = (done, total, loaded) => {
    if (done < total) els.status.textContent = `音色加载中 ${done}/${total}`;
    else els.status.textContent = loaded ? "钢琴采样 ✓" : "合成音色（采样加载失败）";
  };

  // ---------- 初始化 ----------
  renderSongSelect();
  setTrans(state.trans);
  setSpeed(state.speedIdx);
  setSustain(state.sustain);
  els.volume.value = Math.round(state.volume * 100);
  loadSong(state.songId, state.versionIdx);
  // 提前创建音频上下文以便预加载采样；首次按键时会自动恢复播放
  try { audio.ensure(); } catch (e) { /* 等待用户操作 */ }
})();
