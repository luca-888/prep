// node build.mjs
// 读 narration.md 排每句的起点。每句的时长取“按字数的估算（约 4.6 字/秒）”与“配音实测时长（assets/vo/vo.json，有则用）”中较长的一个，
// 句间停 0.45 s，`# +N` 追加 N 秒画面时间。画面动画按估算时长设计，所以每句的时间只会比估算长，不会短。生成：
//   assets/beats.js            window.BEATS = { s01: { B: [每句开始], E: [每句结束], dur }, ... }
//   compositions/captions.html 逐句字幕（长句按标点拆成几条）
//   index.html                 各幕的起止
//   index.html 里的逐句 <audio>（有配音时）
// 改稿后先 `python3 ../_kit/vo.py .` 重录改过的句子，再运行本脚本。
import { existsSync, readFileSync, writeFileSync } from "node:fs";
const VO = existsSync("assets/vo/vo.json") ? JSON.parse(readFileSync("assets/vo/vo.json", "utf8")).scenes : null;

const RATE = 4.6, GAP = 0.45, LEAD = 0.6, TAIL = 0.7, MAXCAP = 24;
const units = (s) => {
  let n = 0;
  for (const m of s.matchAll(/[一-鿿]|[A-Za-z]+|\d/g)) n += /[A-Za-z]/.test(m[0]) ? Math.max(1, m[0].length * 0.42) : 1;
  return n;
};

const scenes = [];
let cur = null;
for (const raw of readFileSync("narration.md", "utf8").split("\n")) {
  const line = raw.trim();
  if (line.startsWith("## ")) { const id = line.slice(3).trim(); cur = /^s\d+/.test(id) ? { id, lines: [] } : null; if (cur) scenes.push(cur); continue; }
  if (!cur || !line) continue;
  const hold = line.match(/^#\s*\+([\d.]+)/);
  if (hold) { cur.lines[cur.lines.length - 1].hold = +hold[1]; continue; }
  if (line.startsWith("#")) continue;
  cur.lines.push({ text: line, hold: 0 });
}

const r2 = (x) => Math.round(x * 100) / 100;
const beats = {}, caps = [], audio = [];
let T = 0;
const hosts = [];
for (const sc of scenes) {
  let t = LEAD;
  const B = [], E = [];
  sc.lines.forEach((ln, i) => {
    const est = Math.max(2.2, units(ln.text) / RATE);
    const rec = VO && VO[sc.id] && VO[sc.id][i];
    if (rec && rec.text !== ln.text) throw new Error(`${sc.id} 第 ${i + 1} 句与录音不一致，先重跑 vo.py`);
    const speak = rec ? rec.dur : est;   // 字幕跟着人声
    B.push(r2(t));
    if (rec) audio.push(`      <audio id="vo-${sc.id}-${i}" class="clip" src="${rec.file}" data-start="${(T + t - rec.head).toFixed(2)}" data-duration="${rec.len}" data-track-index="${3 + (i % 2)}" data-volume="1"></audio>`);
    // 字幕：按标点拆开，再合并到每条不超过 MAXCAP 字
    const parts = ln.text.split(/(?<=[，；：。])/).filter(Boolean);
    const groups = [];
    for (const p of parts) {
      const last = groups[groups.length - 1];
      if (last && units(last + p) <= MAXCAP) groups[groups.length - 1] = last + p; else groups.push(p);
    }
    const total = groups.reduce((a, g) => a + units(g), 0);
    let ct = t;
    groups.forEach((g, j) => {
      const d = (speak * units(g)) / total + (j === groups.length - 1 ? GAP * 0.5 : 0);
      caps.push({ id: `cap-${sc.id}-${i}-${j}`, start: r2(T + ct), dur: r2(d), text: g.replace(/[，；：。]$/, "") });
      ct += d;
    });
    t += Math.max(speak, est) + GAP + ln.hold;
    E.push(r2(t));
  });
  const dur = r2(t - GAP + TAIL);
  beats[sc.id] = { B, E, dur };
  hosts.push({ id: sc.id, start: r2(T), dur });
  T = r2(T + dur);
}

writeFileSync("assets/beats.js", `// 由 build.mjs 生成\nwindow.BEATS = ${JSON.stringify(beats)};\n`);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
writeFileSync("compositions/captions.html", `<template>
  <style>
    #root { position: absolute; inset: 0; }
  </style>
  <!-- 由 build.mjs 生成：改 narration.md 后重跑 -->
  <div id="root" data-composition-id="captions" data-width="1920" data-height="1080" data-layout-allow-caption-zone>
${caps.map((c) => `    <div id="${c.id}" class="clip kit-sub" data-start="${c.start.toFixed(2)}" data-duration="${c.dur.toFixed(2)}" data-track-index="1"><span>${esc(c.text)}</span></div>`).join("\n")}
  </div>
  <script>
    window.__timelines = window.__timelines || {};
    window.__timelines["captions"] = gsap.timeline({ paused: true }).set({}, {}, ${T});
  </script>
</template>
`);

writeFileSync("index.html", `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="assets/vendor/gsap.min.js"></script>
    <link rel="stylesheet" href="assets/brand.css" />
    <script src="assets/beats.js"></script>
    <script src="assets/kit/ll.js"></script>
  </head>
  <body>
    <!-- 由 build.mjs 生成：各幕时长来自 narration.md -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="${T}" data-width="1920" data-height="1080">
${hosts.map((h) => `      <div id="${h.id}" data-composition-id="${h.id}" data-composition-src="compositions/${h.id}.html" data-start="${h.start.toFixed(2)}" data-duration="${h.dur}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>`).join("\n")}
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="${T}" data-track-index="2" data-track-kind="captions" style="z-index:100" data-width="1920" data-height="1080"></div>
${audio.join("\n")}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);

for (const sc of scenes) {
  const b = beats[sc.id];
  console.log(`${sc.id}  ${b.dur}s`);
  sc.lines.forEach((ln, i) => console.log(`  [${i}] ${b.B[i].toFixed(2)} +${(b.E[i] - b.B[i]).toFixed(2)}  ${ln.text}`));
}
console.log(`total ${T}s = ${Math.floor(T / 60)}:${String(Math.round(T % 60)).padStart(2, "0")}`);
