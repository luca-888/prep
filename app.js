// 无构建的单页站：hash 路由，进度存 localStorage。
const app = document.getElementById("app");
const KEY = "prep.progress.v1";
const STEPS = [1, 3, 7, 14];                       // 第 n 次复习距上一次的天数
const LABEL = { none: "未做", done: "做过", review: "需复习", solid: "熟练" };
const today = () => new Date().toLocaleDateString("sv");   // 本地日期 YYYY-MM-DD
const addDays = (d, n) => { const x = new Date(d + "T00:00:00"); x.setDate(x.getDate() + n); return x.toLocaleDateString("sv"); };

let P = {};
try { P = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { P = {}; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch {} };
const stat = (id) => (P[id] && P[id].s) || "none";
const dueOf = (id) => (stat(id) === "review" ? addDays(P[id].d, STEPS[Math.min(P[id].n || 0, STEPS.length - 1)]) : null);
function setStat(id, s) {
  if (s === "none") delete P[id];
  else P[id] = { s, d: today(), n: 0 };
  save();
}
function reviewed(id) {                            // 复习了一次：进入下一个间隔，走完全部间隔后记为熟练
  const n = (P[id].n || 0) + 1;
  P[id] = n >= STEPS.length ? { s: "solid", d: today(), n: 0 } : { s: "review", d: today(), n };
  save();
}

const TOPICS = window.TOPICS;
const ALL = TOPICS.flatMap((t) => (t.groups || []).flatMap((g) => g.problems.map(([id, title, slug, diff, note]) => ({ id, title, slug, diff, note, topic: t, group: g.name }))));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const count = (ps) => { const c = { none: 0, done: 0, review: 0, solid: 0 }; ps.forEach((p) => c[stat(p.id)]++); return c; };

const seg = (id) => `<span class="seg" data-id="${id}">${Object.keys(LABEL).map((s) => `<button data-s="${s}" class="${stat(id) === s ? "on" : ""}">${LABEL[s]}</button>`).join("")}</span>`;
const row = (p, withTopic) => `<tr>
  <td class="num">${p.id}</td>
  <td><a href="https://leetcode.com/problems/${p.slug}/" target="_blank" rel="noopener">${esc(p.title)}</a> <span class="diff ${p.diff}">${p.diff}</span>${window.PROBLEMS[p.id] ? `<a class="do" href="#/p/${p.id}">页内做</a>` : ""}${withTopic ? `<div class="note">${esc(p.topic.title)} · ${esc(p.group)}</div>` : ""}</td>
  <td class="note">${esc(p.note)}</td>
  <td class="st">${seg(p.id)}${dueOf(p.id) ? `<span class="due">${dueOf(p.id).slice(5)} 复习</span>` : ""}</td>
</tr>`;
const table = (body) => `<table class="plist"><thead><tr><th>#</th><th>题目</th><th>要点</th><th>进度</th></tr></thead><tbody>${body}</tbody></table>`;

async function md(path) {
  const r = await fetch(path);
  if (!r.ok) return `<p class="empty">还没有写：${path}</p>`;
  return marked.parse(await r.text());
}
const highlight = () => app.querySelectorAll("pre code").forEach((el) => hljs.highlightElement(el));

// —— 总览 ——
function home() {
  const c = count(ALL), t = today();
  const due = ALL.filter((p) => dueOf(p.id) && dueOf(p.id) <= t).sort((a, b) => dueOf(a.id).localeCompare(dueOf(b.id)));
  const card = (tp) => {
    if (!tp.groups) return `<div class="card todo"><b>${esc(tp.title)}</b><div class="meta"><span>未开始</span></div></div>`;
    const ps = ALL.filter((p) => p.topic === tp), k = count(ps), w = (n) => `style="width:${(n / ps.length) * 100}%"`;
    return `<a class="card" href="#/t/${tp.slug}"><b>${esc(tp.title)}</b>
      <div class="meta"><span>${k.done + k.review + k.solid} / ${ps.length} 题</span><span>${tp.video ? "视频 · " : ""}cheatsheet</span></div>
      <div class="bar"><i class="solid" ${w(k.solid)}></i><i class="done" ${w(k.done)}></i><i class="review" ${w(k.review)}></i></div></a>`;
  };
  app.innerHTML = `
    <div class="stats">
      <div><b>${c.done + c.review + c.solid} / ${ALL.length}</b><span>做过的题</span></div>
      <div><b>${c.solid}</b><span>熟练</span></div>
      <div><b>${c.review}</b><span>复习中</span></div>
      <div><b>${due.length}</b><span>今日待复习</span></div>
    </div>
    <h2>今日待复习</h2>
    ${due.length ? `<table class="plist"><tbody>${due.map((p) => `<tr>
      <td class="num">${p.id}</td>
      <td><a href="https://leetcode.com/problems/${p.slug}/" target="_blank" rel="noopener">${esc(p.title)}</a> <span class="diff ${p.diff}">${p.diff}</span></td>
      <td class="note"><a href="#/t/${p.topic.slug}">${esc(p.topic.title)}</a> · ${esc(p.group)}</td>
      <td class="st"><button data-reviewed="${p.id}">已复习（第 ${(P[p.id].n || 0) + 1} / ${STEPS.length} 次）</button></td></tr>`).join("")}</tbody></table>`
      : `<p class="empty">没有到期的题。把一道题标为“需复习”后，它会在 ${STEPS.join("、")} 天后依次回到这里，四次之后记为熟练。</p>`}
    <h2>算法</h2><div class="cards">${TOPICS.filter((x) => x.kind === "algo").map(card).join("")}</div>
    <h2>系统设计</h2><div class="cards">${TOPICS.filter((x) => x.kind === "sd").map(card).join("")}</div>`;
}

// —— 类型页 ——
async function topic(slug) {
  const tp = TOPICS.find((x) => x.slug === slug);
  if (!tp || !tp.groups) { app.innerHTML = `<p class="empty">这个类型还没有内容。</p>`; return; }
  const cheat = await md(`topics/${slug}/cheatsheet.md`);
  const go = (id, name) => `<a href="javascript:void 0" data-go="${id}">${name}</a>`;
  app.innerHTML = `<h1>${esc(tp.title)}</h1>
    <div class="toc">${go("sec-cheat", "Cheatsheet")}${go("sec-problems", "题目")}</div>
    ${tp.video ? `<details class="video"><summary>视频讲解</summary><video src="${tp.video}" controls preload="metadata"></video></details>` : ""}
    <section id="sec-cheat" class="md"><h2 class="first">Cheatsheet</h2>${cheat}</section>
    <section id="sec-problems"><h2>题目</h2>${table(tp.groups.map((g) => `<tr class="grp"><td colspan="4">${esc(g.name)}</td></tr>` + ALL.filter((p) => p.topic === tp && p.group === g.name).map((p) => row(p)).join("")).join(""))}</section>`;
  highlight();
}

// —— 全部题目 ——
const F = { topic: "", diff: "", stat: "" };
function problems() {
  const opt = (v, name, cur) => `<option value="${v}" ${cur === v ? "selected" : ""}>${name}</option>`;
  const list = ALL.filter((p) => (!F.topic || p.topic.slug === F.topic) && (!F.diff || p.diff === F.diff) && (!F.stat || stat(p.id) === F.stat));
  app.innerHTML = `<h1>题目</h1>
    <div class="filters">
      <select data-f="topic">${opt("", "全部类型", F.topic)}${TOPICS.filter((t) => t.groups).map((t) => opt(t.slug, t.title, F.topic)).join("")}</select>
      <select data-f="diff">${opt("", "全部难度", F.diff)}${["Easy", "Medium", "Hard"].map((d) => opt(d, d, F.diff)).join("")}</select>
      <select data-f="stat">${opt("", "全部进度", F.stat)}${Object.keys(LABEL).map((s) => opt(s, LABEL[s], F.stat)).join("")}</select>
      <span class="muted">${list.length} 题</span>
    </div>
    ${table(list.map((p) => row(p, true)).join(""))}`;
}

// —— Cheatsheet 汇总 ——
async function cheatsheet() {
  const ts = TOPICS.filter((t) => t.groups);
  const parts = await Promise.all(ts.map((t) => md(`topics/${t.slug}/cheatsheet.md`)));
  app.innerHTML = `<h1>Cheatsheet</h1><div class="toc"><a href="javascript:print()">打印</a></div>` +
    ts.map((t, i) => `<section class="md"><h2>${esc(t.title)}</h2>${parts[i]}</section>`).join("");
  highlight();
}

// —— 页内做题 ——
// Python 在 Worker 里的 Pyodide 中运行；超时就终止 Worker 再建一个。
const TIMEOUT = 5000;
let W = null, Wready = false, job = null, seq = 0;
function worker() {
  if (W) return W;
  W = new Worker("runner.js?v=2"); Wready = false;
  W.onmessage = (e) => {
    if (e.data.ready) { Wready = true; if (job) arm(); return; }
    if (e.data.fatal) return finish({ error: "Python 运行环境加载失败：" + e.data.fatal });
    if (job && e.data.id === job.id) finish(JSON.parse(e.data.res));
  };
  W.onerror = (e) => { W = null; finish({ error: "Python 运行环境加载失败（需要联网）：" + (e.message || "") }); };
  return W;
}
function arm() {
  job.onstart();
  job.timer = setTimeout(() => { W.terminate(); W = null; finish({ error: `超时（${TIMEOUT / 1000} 秒）：多半是死循环；链表题也可能是接成了环。` }); worker(); }, TIMEOUT);
}
function finish(res) { if (!job) return; clearTimeout(job.timer); const j = job; job = null; j.done(res); }
function runCode(code, spec, onstart, done) {
  if (job) return;
  job = { id: ++seq, onstart, done, timer: null };
  worker().postMessage({ id: job.id, code, spec: JSON.stringify(spec) });
  if (Wready) arm();
}
const markSeg = (el) => el.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x.dataset.s === stat(+el.dataset.id)));
const J = (v) => JSON.stringify(v);

const stmtOpen = () => { try { return localStorage.getItem("prep.stmt") !== "0"; } catch { return true; } };   // 记住题目是否收起
function problem(id) {
  const p = ALL.find((x) => x.id === id), spec = window.PROBLEMS[id];
  if (!p || !spec) { app.innerHTML = `<p class="empty">这道题还没有页内练习。</p>`; return; }
  const sib = ALL.filter((x) => x.topic === p.topic && window.PROBLEMS[x.id]), k = sib.indexOf(p);
  const nav = (q, text) => (q ? `<a href="#/p/${q.id}">${text}</a>` : `<span></span>`);
  const CK = "prep.code." + id;
  let saved = null; try { saved = localStorage.getItem(CK); } catch {}
  const initial = spec.starter;
  app.innerHTML = `<div class="ws">
    <div class="crumb"><a href="#/t/${p.topic.slug}">← ${esc(p.topic.title)}</a> · ${esc(p.group)}<span class="grow"></span>${nav(sib[k - 1], "← 上一题")}${nav(sib[k + 1], "下一题 →")}</div>
    <div class="ws-head"><h1>${p.id}. ${esc(p.title)}</h1><span class="diff ${p.diff}">${p.diff}</span><span class="grow"></span>${seg(p.id)}</div>
    <details class="stmt md" ${stmtOpen() ? "open" : ""}><summary>题目</summary>${marked.parse(spec.desc)}</details>
    <div class="ed-bar"><button id="run" class="primary">运行 ⌘↵</button><button id="copy">复制代码</button><button id="reset">重置</button><button id="hint">提示</button><span id="runstat" class="muted"></span><span class="grow"></span><a href="https://leetcode.com/problems/${p.slug}/" target="_blank" rel="noopener">在 LeetCode 打开 ↗</a></div>
    <textarea id="code"></textarea>
    <div id="result"><p class="empty">${spec.tests.length} 个用例。第一次运行要加载 Python，需要几秒。</p></div>
  </div>`;
  app.querySelector("details.stmt").addEventListener("toggle", (e) => { try { localStorage.setItem("prep.stmt", e.target.open ? "1" : "0"); } catch {} });
  const cm = CodeMirror.fromTextArea(document.getElementById("code"), {
    mode: "python", theme: "dracula", lineNumbers: true, lineWrapping: true, viewportMargin: Infinity, indentUnit: 4, tabSize: 4, matchBrackets: true, autoCloseBrackets: true,
    extraKeys: {
      Tab: (c) => (c.somethingSelected() ? c.indentSelection("add") : c.replaceSelection("    ", "end")),
      "Shift-Tab": (c) => c.indentSelection("subtract"),
      "Cmd-Enter": () => run(), "Ctrl-Enter": () => run(), "Cmd-/": "toggleComment", "Ctrl-/": "toggleComment",
    },
  });
  cm.setValue(saved ?? initial);
  cm.on("change", () => { try { localStorage.setItem(CK, cm.getValue()); } catch {} });
  const out = document.getElementById("result"), st = document.getElementById("runstat");
  const input = (t) => spec.params.map((n, i) => `${n} = ${J(t.args[i])}`).join("，");
  function show(r) {
    st.textContent = "";
    if (r.error) { out.innerHTML = `<div class="sum bad">运行失败</div><pre class="err">${esc(r.error)}</pre>${r.out ? `<pre class="stdout">${esc(r.out)}</pre>` : ""}`; return; }
    const pass = r.tests.filter((t) => t.ok).length, all = pass === r.tests.length;
    out.innerHTML = `<div class="sum ${all ? "good" : "bad"}">${pass} / ${r.tests.length} 通过</div>` + r.tests.map((t, i) => `<div class="case ${t.ok ? "ok" : "no"}">
      <div class="case-h">${t.ok ? "✓" : "✗"} 用例 ${i + 1}<code>${esc(input(spec.tests[i]))}</code></div>
      ${t.ok ? "" : `<table><tr><td>期望</td><td><code>${esc(J(t.expect))}</code></td></tr>${t.err ? "" : `<tr><td>输出</td><td><code>${esc(J(t.got))}</code></td></tr>`}</table>${t.err ? `<pre class="err">${esc(t.err)}</pre>` : ""}`}
      ${t.out ? `<pre class="stdout">${esc(t.out)}</pre>` : ""}</div>`).join("");
    if (all && stat(id) === "none") { setStat(id, "done"); markSeg(app.querySelector(".ws .seg")); }
  }
  function run() {
    if (job) return;
    st.textContent = Wready ? "运行中…" : "正在加载 Python…";
    runCode(cm.getValue(), spec, () => { st.textContent = "运行中…"; }, (r) => { if (document.body.contains(out)) show(r); });
  }
  document.getElementById("run").onclick = run;
  document.getElementById("copy").onclick = async () => { await navigator.clipboard.writeText(cm.getValue()); st.textContent = "已复制"; };
  document.getElementById("reset").onclick = () => { if (confirm("把代码恢复成起始代码？")) cm.setValue(initial); };
  document.getElementById("hint").onclick = () => { st.textContent = st.textContent === p.note ? "" : p.note; };
  worker();                                       // 进页面就开始加载 Python
}

function route() {
  const h = location.hash.replace(/^#\/?/, "");
  document.querySelectorAll(".top nav a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#/" + (/^[tp]\//.test(h) ? "" : h)));
  document.body.classList.toggle("wide", h.startsWith("p/"));
  window.scrollTo(0, 0);
  if (h.startsWith("t/")) return topic(h.slice(2));
  if (h.startsWith("p/")) return problem(+h.slice(2));
  if (h === "problems") return problems();
  if (h === "cheatsheet") return cheatsheet();
  home();
}
const rerender = () => { const y = window.scrollY; const r = route(); Promise.resolve(r).then(() => window.scrollTo(0, y)); };

app.addEventListener("click", (e) => {
  const b = e.target.closest(".seg button");
  if (b) {
    setStat(+b.parentNode.dataset.id, b.dataset.s);
    if (app.querySelector(".ws")) return markSeg(b.parentNode);   // 做题页不重绘，保住编辑器
    return rerender();
  }
  const r = e.target.closest("[data-reviewed]");
  if (r) { reviewed(+r.dataset.reviewed); return rerender(); }
  const g = e.target.closest("[data-go]");
  if (g) document.getElementById(g.dataset.go).scrollIntoView({ behavior: "smooth", block: "start" });
});
app.addEventListener("change", (e) => { const f = e.target.dataset.f; if (f) { F[f] = e.target.value; problems(); } });

document.getElementById("export").onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(P, null, 1)], { type: "application/json" }));
  a.download = `prep-progress-${today()}.json`;
  a.click();
};
const file = document.getElementById("file");
document.getElementById("import").onclick = () => file.click();
file.onchange = async () => {
  if (!file.files[0]) return;
  try {
    const data = JSON.parse(await file.files[0].text());
    if (!data || typeof data !== "object" || Array.isArray(data)) throw 0;
    if (!confirm(`导入 ${Object.keys(data).length} 道题的进度，覆盖当前的 ${Object.keys(P).length} 道？`)) return;
    P = data; save(); route();
  } catch { alert("这不是导出的进度文件。"); }
  file.value = "";
};

window.addEventListener("hashchange", route);
route();
