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
  <td><a href="https://leetcode.com/problems/${p.slug}/" target="_blank" rel="noopener">${esc(p.title)}</a> <span class="${p.diff}">${p.diff}</span>${withTopic ? `<div class="note">${esc(p.topic.title)} · ${esc(p.group)}</div>` : ""}</td>
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
      <div class="meta"><span>${k.done + k.review + k.solid} / ${ps.length} 题</span><span>${tp.video ? "视频 · " : ""}文章 · cheatsheet</span></div>
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
      <td><a href="https://leetcode.com/problems/${p.slug}/" target="_blank" rel="noopener">${esc(p.title)}</a> <span class="${p.diff}">${p.diff}</span></td>
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
  const [art, cheat] = await Promise.all([md(`topics/${slug}/article.md`), md(`topics/${slug}/cheatsheet.md`)]);
  const go = (id, name) => `<a href="javascript:void 0" data-go="${id}">${name}</a>`;
  app.innerHTML = `<h1>${esc(tp.title)}</h1>
    <div class="toc">${tp.video ? go("sec-video", "视频") : ""}${go("sec-article", "文章")}${go("sec-cheat", "Cheatsheet")}${go("sec-problems", "题目")}</div>
    ${tp.video ? `<section id="sec-video"><video src="${tp.video}" controls preload="metadata"></video></section>` : ""}
    <section id="sec-article" class="md">${art}</section>
    <section id="sec-cheat" class="md"><h2>Cheatsheet</h2>${cheat}</section>
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

function route() {
  const h = location.hash.replace(/^#\/?/, "");
  document.querySelectorAll(".top nav a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#/" + (h.startsWith("t/") ? "" : h)));
  window.scrollTo(0, 0);
  if (h.startsWith("t/")) return topic(h.slice(2));
  if (h === "problems") return problems();
  if (h === "cheatsheet") return cheatsheet();
  home();
}
const rerender = () => { const y = window.scrollY; const r = route(); Promise.resolve(r).then(() => window.scrollTo(0, y)); };

app.addEventListener("click", (e) => {
  const b = e.target.closest(".seg button");
  if (b) { setStat(+b.parentNode.dataset.id, b.dataset.s); return rerender(); }
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
