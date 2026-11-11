// 跨设备同步：进度与页内代码存在一个私有 GitHub Gist 里。
// 每次同步都是「拉取 → 按每道题的最后修改时间合并 → 有差异才写回」，所以两台设备各改各的题不会互相覆盖。
// token 与 gist id 只存在这台设备的 localStorage（prep.sync）里。
(() => {
  const CFG = "prep.sync", API = "https://api.github.com";
  const FILE_P = "prep-progress.json", FILE_C = "prep-code.json", DESC = "prep 进度同步";
  const CODE = "prep.code.", CODET = "prep.codet.";
  let cfg = null; try { cfg = JSON.parse(localStorage.getItem(CFG)); } catch {}
  let busy = false, again = false, timer = null, last = 0, state = cfg ? "idle" : "off", note = "";

  const btn = document.getElementById("sync");
  const canon = (v) => (v && typeof v === "object" ? "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}" : JSON.stringify(v));
  const tP = (e) => e.t || (e.d ? Date.parse(e.d + "T00:00:00") : 0);   // 旧数据没有时间戳，用日期顶替
  const tC = (e) => e.t || 0;
  const obj = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {});
  function merge(local, remote, t) {                // 每个键取较新的一份，一样新时留本地的
    const out = {};
    for (const k in remote) if (remote[k] && typeof remote[k] === "object") out[k] = remote[k];
    for (const k in local) if (!(k in out) || t(local[k]) >= t(out[k])) out[k] = local[k];
    return out;
  }
  function readCode() {
    const out = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith(CODE)) out[k.slice(CODE.length)] = { c: localStorage.getItem(k), t: +localStorage.getItem(CODET + k.slice(CODE.length)) || 1 };
    }
    return out;
  }

  async function api(path, opt = {}, token = cfg.token) {
    const r = await fetch(API + path, { ...opt, cache: "no-store", headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", ...(opt.body ? { "Content-Type": "application/json" } : {}) } });
    if (!r.ok) throw Object.assign(new Error("HTTP " + r.status), { status: r.status });
    return r.json();
  }
  const explain = (e) => (e.status === 401 ? "token 无效或已过期" : e.status === 403 ? "token 没有 gist 权限，或触发了 GitHub 的频率限制" : e.status === 404 ? "找不到同步用的 gist（可能被删了，或 token 没有 gist 权限）" : e.status ? "GitHub 返回 " + e.status : "连不上 GitHub（离线？）");
  const content = (f) => { if (!f) return {}; if (f.truncated) throw new Error("gist 文件过大"); try { return obj(JSON.parse(f.content)); } catch { return {}; } };

  function set(s, text = "") {
    state = s; note = text;
    btn.textContent = { off: "同步", idle: "已同步", busy: "同步中…", err: "同步失败" }[s];
    btn.className = "sync-" + s;
    btn.title = s === "idle" && last ? "上次同步 " + new Date(last).toLocaleTimeString() : text;
    paint();
  }

  async function sync() {
    if (!cfg) return;
    if (busy) { again = true; return; }
    busy = true; clearTimeout(timer); set("busy");
    try {
      const g = await api("/gists/" + cfg.gist);
      const rp = content(g.files[FILE_P]), rc = content(g.files[FILE_C]);
      const lp = P, lc = readCode();                // 请求返回之后再读本地，等待期间的改动也算进去
      const mp = merge(lp, rp, tP), mc = merge(lc, rc, tC);
      const pChanged = canon(mp) !== canon(lp);
      const codeIds = Object.keys(mc).filter((k) => !lc[k] || canon(lc[k]) !== canon(mc[k]));
      if (pChanged) { P = mp; localStorage.setItem(KEY, JSON.stringify(P)); }
      codeIds.forEach((k) => { localStorage.setItem(CODE + k, mc[k].c); localStorage.setItem(CODET + k, mc[k].t); });
      if (pChanged || codeIds.length) window.onSynced && window.onSynced(pChanged, codeIds.map(Number));
      const files = {};
      if (canon(mp) !== canon(rp)) files[FILE_P] = { content: JSON.stringify(mp, null, 1) };
      if (canon(mc) !== canon(rc)) files[FILE_C] = { content: JSON.stringify(mc, null, 1) };
      if (Object.keys(files).length) await api("/gists/" + cfg.gist, { method: "PATCH", body: JSON.stringify({ files }) });
      last = Date.now(); set("idle");
    } catch (e) { set("err", e.status === undefined && e.message === "gist 文件过大" ? e.message : explain(e)); }
    busy = false;
    if (again) { again = false; changed(500); }
  }
  function changed(delay = 2000) {                  // 本地有改动：停手一小会儿后同步
    if (!cfg) return;
    clearTimeout(timer); timer = setTimeout(sync, delay);
  }

  async function connect(token) {                   // 用同一个 token 的设备会找到同一个 gist；没有就建一个私有的
    let gist = null;
    for (let page = 1; page <= 5 && !gist; page++) {
      const list = await api(`/gists?per_page=100&page=${page}`, {}, token);
      gist = (list.find((g) => g.files && g.files[FILE_P]) || {}).id || null;
      if (list.length < 100) break;
    }
    if (!gist) gist = (await api("/gists", { method: "POST", body: JSON.stringify({ description: DESC, public: false, files: { [FILE_P]: { content: "{}" } } }) }, token)).id;
    cfg = { token, gist };
    localStorage.setItem(CFG, JSON.stringify(cfg));
    await sync();
  }
  function disconnect() {
    cfg = null; clearTimeout(timer);
    try { localStorage.removeItem(CFG); } catch {}
    set("off");
  }

  // —— 设置面板 ——
  const dlg = document.createElement("dialog");
  dlg.id = "syncdlg";
  document.body.appendChild(dlg);
  function paint() {
    if (!dlg.open) return;
    dlg.innerHTML = cfg ? `<h3>跨设备同步</h3>
      <p>${state === "busy" ? "同步中…" : state === "err" ? `<span class="bad">同步失败：${note}</span>` : last ? "已同步，上次 " + new Date(last).toLocaleTimeString() : "已开启"}</p>
      <p class="muted">进度和页内代码存在你的私有 gist 里：<a href="https://gist.github.com/${cfg.gist}" target="_blank" rel="noopener">${cfg.gist.slice(0, 8)}…</a>。打开页面、切回这个标签页、改动之后都会自动同步。</p>
      <div class="row"><button data-a="now" class="primary">立即同步</button><button data-a="off">在这台设备上关闭</button><span class="grow"></span><button data-a="close">关闭</button></div>`
      : `<h3>跨设备同步</h3>
      <p class="muted">进度和页内代码会存到你 GitHub 账号下的一个私有 gist。每台设备填一次 token，之后自动同步。</p>
      <p class="muted">1. <a href="https://github.com/settings/tokens/new?scopes=gist&description=prep-sync" target="_blank" rel="noopener">创建一个 token</a>，权限只勾 <code>gist</code>。<br>2. 粘贴到下面。它只保存在这台设备的浏览器里，别在公用电脑上填。</p>
      <input id="synctoken" type="password" placeholder="ghp_…" autocomplete="off" spellcheck="false" />
      <p class="bad" id="syncerr">${note}</p>
      <div class="row"><button data-a="on" class="primary">开启同步</button><span class="grow"></span><button data-a="close">关闭</button></div>`;
  }
  dlg.addEventListener("click", async (e) => {
    const box = dlg.getBoundingClientRect();         // 点到面板外
    if (e.target === dlg && (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom)) return dlg.close();
    const a = e.target.dataset && e.target.dataset.a;
    if (a === "close") dlg.close();
    if (a === "now") sync();
    if (a === "off" && confirm("这台设备不再同步。本地进度和 gist 里的数据都会保留。")) disconnect();
    if (a === "on") {
      const token = dlg.querySelector("#synctoken").value.trim(), err = dlg.querySelector("#syncerr");
      if (!token) return;
      e.target.disabled = true; err.textContent = "连接中…";
      try { await connect(token); } catch (x) { e.target.disabled = false; err.textContent = explain(x); }
    }
  });
  btn.onclick = () => { dlg.showModal(); paint(); };

  window.Sync = { changed };
  document.addEventListener("visibilitychange", () => { if (!document.hidden && Date.now() - last > 15000) sync(); });
  window.addEventListener("online", sync);
  set(state);
  sync();
})();
