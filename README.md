# VirtualPiano

用 Mac 键盘弹钢琴的网页程序，仿 [virtualpianosheet.com](https://virtualpianosheet.com) 的练习播放器。纯前端实现，不需要安装任何依赖。

## 启动

双击 `start.command`（会启动本地服务器并打开 http://localhost:8765），或者在终端运行：

```bash
python3 serve.py 8765
```

然后用浏览器打开 http://localhost:8765。`serve.py` 会禁用浏览器缓存，修改代码或曲库后刷新页面即可生效。

也可以直接用浏览器打开 `index.html`，这种方式下钢琴音色会从 CDN 加载。

> 如果按键没反应，请把输入法切换到英文。

## 键位

Mac 键盘 4 行 × 10 键，从左到右、从上到下依次升高半音，一个键对应一个琴键，不用按 Shift：

```
1 2 3 4 5 6 7 8 9 0
q w e r t y u i o p
a s d f g h j k l ;
z x c v b n m , . /
```

每首曲子会自动选择最合适的 40 键音域（显示在标题下方）。放不下的音会移一个八度，优先保住旋律，移动低音伴奏。

## 功能

- **跟弹练习**：乐谱随你的弹奏前进。弹对变绿，弹错显示红框，下一个要弹的音在琴键上高亮提示；点击乐谱中任意音符可从该处开始练
- **自动播放**：按曲速播放，可调速（0.25x – 2x）
- **其他控制**：移调、延音踏板、音量、回到上一行，可隐藏琴键上的按键字母
- **自定义乐谱**：粘贴标准 Virtual Piano 格式的乐谱（例如 virtualpianosheet.com 上 “Copy notes” 复制出来的），会自动换算成 40 键布局，保存在浏览器里

快捷键：`空格` 播放 / 暂停，`←` `→` 移调，`↑` `↓` 调速，`Esc` 重置。

## 内置曲目

| 曲目 | 版本 |
| --- | --- |
| Gravity Falls Main Title Theme | Easy / Intermediate |
| 生化危机 Resident Evil Main Title Theme | Easy / Intermediate |
| 加勒比海盗 He's a Pirate | Easy / Advanced |
| 命运交响曲 Symphony No. 5 | Easy / Intermediate |
| 孤勇者 — 陈奕迅 | 主旋律 |
| Golden — HUNTR/X（KPop Demon Hunters） | 主旋律 |
| 爱乐之城 Mia & Sebastian's Theme | Easy / Intermediate |
| 致爱丽丝 Für Elise | Easy / Intermediate |
| 欢乐颂 Ode to Joy | Easy / Intermediate |
| 小星星 Twinkle Twinkle Little Star | Easy / Intermediate |
| 两只老虎 Frère Jacques | Easy |
| 生日快乐 Happy Birthday | Easy / Intermediate |

## 乐谱格式

`songs.js` 里的乐谱使用通用的标准 Virtual Piano 记谱（61 键，C2 – C7，大写字母和 `!@$%^*(` 为黑键）：

| 写法 | 含义 |
| --- | --- |
| `a s d` | 依次弹奏 |
| `[asd]` | 同时按下（和弦） |
| `[a s d]` | 快速琶音 |
| `-` | 停顿一个单位 |
| `\|` | 停顿两个单位 |

每个音符或 `-` 占一个单位，`bpm` 按一个单位等于一个八分音符计算。

## 文件

| 文件 | 说明 |
| --- | --- |
| `index.html` / `style.css` | 页面与样式 |
| `app.js` | 键盘映射、乐谱解析、练习与自动播放逻辑 |
| `audio.js` | Web Audio 采样器 + 合成音色兜底 |
| `songs.js` | 内置曲库，往里加曲目即可 |
| `samples/` | 钢琴采样 |
| `serve.py` / `start.command` | 本地服务器 / 双击启动脚本 |

## 致谢与来源

- 钢琴音色：[Salamander Grand Piano](https://archive.org/details/SalamanderGrandPianoV3)（Alexander Holm，CC BY 3.0），采样文件取自 [Tone.js](https://github.com/Tonejs/audio)
- 乐谱：Gravity Falls、He's a Pirate、Mia & Sebastian's Theme、命运交响曲参考了 [virtualpianosheet.com](https://virtualpianosheet.com)；孤勇者参考了 [jianpu.space](https://jianpu.space) 的简谱；Golden 参考了 [flat.io](https://flat.io) 上的公开乐谱；Resident Evil 根据一份五线谱转写。各曲目版权归原作者所有，仅供个人练习使用
