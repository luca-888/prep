// 链表画面引擎：节点、箭头、指针标签都是“时间的函数”，由本幕时间线上的一个时钟补间驱动重画，
// 所以任意跳转到某一帧，画面都只取决于时间（箭头两端实时跟随节点位置）。
//   const L = LL(root, tl, DUR)
//   L.node(val, x, y, { kind: "node" | "dummy" | "none", o: 0|1 })   → .show(t) .hide(t) .move(x, y, t, d) .fill(color, t) .dim(v, t)
//   L.arrow(src, dst, { p: 0|1 })                                     → .draw(t) .retarget(dst, t, d, bend) .flash(color, t) .hide(t)
//   L.tag(text, color, node, { lvl: 0|1, side: 1|-1 })                → .show(t) .hide(t) .move(node, t, d)
//   L.code(lines, { x, y, w })                                        → .show(t) .line(i, t) .hl(i, t) .hlOff(t) .leave(t)
//   L.header(chip, title) / L.src(text) / L.key(text, y)              页眉、右上角题号、关键句
//   L.ft(el, from, to, t)                                             普通 DOM 补间
(function () {
  const C = {
    ink: [20, 20, 20], white: [255, 255, 255], paper: [241, 237, 228], gray: [138, 132, 116], line: [207, 200, 184],
    teal: [11, 125, 112], tealL: [176, 224, 216], hot: [196, 86, 29], hotL: [240, 190, 158], blue: [35, 80, 216], blueL: [169, 194, 238],
    red: [229, 50, 45], redL: [247, 200, 198], use: [47, 138, 87], purple: [106, 50, 214], grayL: [226, 221, 208],
  };
  const eases = {};
  const E = (n) => eases[n] || (eases[n] = gsap.parseEase(n));
  const res = (v, t) => (typeof v === "function" ? v(t) : v);
  const lerp = (a, b, k) => (Array.isArray(a) ? a.map((x, i) => x + (b[i] - x) * k) : a + (b - a) * k);
  const rgb = (c) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
  const col = (c) => (typeof c === "string" ? C[c] : c);

  function track(init) {
    const segs = [];
    let last = init;
    const T = {
      to(v, t, d = 0.6, e = "power2.inOut") {
        if (segs.length && t < segs[segs.length - 1].t0) console.warn("LL track: 段未按时间顺序添加", t);
        segs.push({ t0: t, t1: t + Math.max(d, 1e-4), v0: last, v1: v, e });
        last = v;
        return T;
      },
      at(t) {
        let s = null;
        for (const g of segs) { if (g.t0 <= t) s = g; else break; }
        if (!s) return res(init, t);
        const k = (t - s.t0) / (s.t1 - s.t0);
        if (k >= 1) return res(s.v1, t);
        return lerp(res(s.v0, t), res(s.v1, t), E(s.e)(k));
      },
    };
    return T;
  }

  const NS = "http://www.w3.org/2000/svg";
  const div = (p, css, html) => { const e = document.createElement("div"); e.style.cssText = css; if (html !== undefined) e.innerHTML = html; p.appendChild(e); return e; };

  window.LL = function (root, tl, DUR) {
    const items = [];
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width", 1920); svg.setAttribute("height", 1080);
    // 链表所在的画布整体放大 SCALE 倍（以顶边中点为原点）；各幕里节点、标签、箭头的坐标都是放大前的
    const SCALE = 1.2, ST = `transform:scale(${SCALE});transform-origin:960px 0`;
    svg.style.cssText = "position:absolute;left:0;top:0;overflow:visible;" + ST;
    root.appendChild(svg);
    const stage = div(root, "position:absolute;left:0;top:0;width:1920px;height:1080px;" + ST);
    const ui = div(root, "position:absolute;left:0;top:0;width:1920px;height:1080px");
    const ft = (el, a, b, t) => tl.fromTo(el, a, b, t);

    // ---------- 节点 ----------
    function node(val, x, y, o = {}) {
      const kind = o.kind || "node";
      const W = o.w || (kind === "none" ? 130 : 150), H = o.h || (kind === "none" ? 64 : 110);
      const base = "position:absolute;left:0;top:0;display:flex;align-items:center;justify-content:center;white-space:nowrap;font-family:var(--mono);will-change:transform;";
      const css = kind === "none"
        ? base + `width:${W}px;height:${H}px;font-size:36px;font-weight:700;color:var(--note)`
        : kind === "dummy"
          ? base + `width:${W}px;height:${H}px;border:4px dashed var(--gray);border-radius:4px;font-size:${o.fs || 32}px;font-weight:700;color:var(--ink2)`
          : base + `width:${W}px;height:${H}px;border:4px solid var(--ink);border-radius:4px;font-size:54px;font-weight:800;color:var(--ink)`;
      const el = div(stage, css, String(val));
      const N = {
        el, W, H, kind,
        x: track(x), y: track(y), o: track(o.o === undefined ? 0 : o.o), s: track(1),
        bg: track(kind === "node" ? C.white : C.paper), bd: track(kind === "node" ? C.ink : C.gray),
        box: (t) => [N.x.at(t), N.y.at(t), W / 2, H / 2],
        show(t, d = 0.45) { N.o.to(1, t, d, "power1.out"); N.s.to(0.82, t, 0); N.s.to(1, t + 0.001, d, "back.out(1.7)"); return N; },
        hide(t, d = 0.35) { N.o.to(0, t, d, "power2.in"); return N; },
        dim(v, t, d = 0.4) { N.o.to(v, t, d); return N; },
        move(nx, ny, t, d = 0.8, e = "power2.inOut") { if (nx !== null) N.x.to(nx, t, d, e); if (ny !== null) N.y.to(ny, t, d, e); return N; },
        fill(c, t, d = 0.3) { N.bg.to(col(c), t, d); return N; },
        border(c, t, d = 0.3) { N.bd.to(col(c), t, d); return N; },
        pulse(t, k = 1.14) { N.s.to(k, t, 0.22, "power2.out"); N.s.to(1, t + 0.22, 0.4, "power2.inOut"); return N; },
        render(t) {
          el.style.transform = `translate(${N.x.at(t) - W / 2}px,${N.y.at(t) - H / 2}px) scale(${N.s.at(t)})`;
          el.style.opacity = N.o.at(t);
          if (kind !== "none") { el.style.backgroundColor = rgb(N.bg.at(t)); el.style.borderColor = rgb(N.bd.at(t)); }
        },
      };
      items.push(N);
      return N;
    }

    // ---------- 箭头：从 src 盒边到 tip 盒边的二次曲线，bend 为向上拱起的高度 ----------
    function arrow(src, dst, o = {}) {
      const path = document.createElementNS(NS, "path");
      const head = document.createElementNS(NS, "polygon");
      path.setAttribute("fill", "none"); path.setAttribute("stroke-linecap", "round");
      svg.appendChild(path); svg.appendChild(head);
      const A = {
        src, tip: track(dst.box), bend: track(o.bend || 0), p: track(o.p === undefined ? 0 : o.p), o: track(1), c: track(C.ink), w: track(5),
        draw(t, d = 0.4) { A.p.to(1, t, d, "power2.out"); return A; },
        retarget(to, t, d = 0.8, bend) { A.tip.to(to.box, t, d); if (bend !== undefined) A.bend.to(bend, t, d); return A; },
        arc(b, t, d = 0.6) { A.bend.to(b, t, d); return A; },
        color(c, t, d = 0.25) { A.c.to(col(c), t, d); return A; },
        flash(c, t, hold = 0.55) { A.c.to(col(c), t, 0.18); A.w.to(8, t, 0.18); A.c.to(C.ink, t + hold, 0.3); A.w.to(5, t + hold, 0.3); return A; },
        hide(t, d = 0.3) { A.o.to(0, t, d); return A; },
        show(t, d = 0.3) { A.o.to(1, t, d); return A; },
        render(t) {
          const a = src.box(t), b = A.tip.at(t), p = A.p.at(t), op = A.o.at(t) * Math.min(1, src.o.at(t) * 1.5);
          const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
          if (p <= 0.001 || op <= 0.001 || len < 8) { path.style.opacity = 0; head.style.opacity = 0; return; }
          const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2 - 2 * A.bend.at(t);
          const edge = (bx, pad) => {
            const ux = cx - bx[0], uy = cy - bx[1];
            const k = Math.min((bx[2] + pad) / Math.max(Math.abs(ux), 1e-6), (bx[3] + pad) / Math.max(Math.abs(uy), 1e-6));
            return [bx[0] + ux * Math.min(k, 1), bx[1] + uy * Math.min(k, 1)];
          };
          const S = edge(a, 4), T = edge(b, 8);
          // 取曲线的前 p 段
          const q1 = [S[0] + (cx - S[0]) * p, S[1] + (cy - S[1]) * p];
          const m = [cx + (T[0] - cx) * p, cy + (T[1] - cy) * p];
          const q2 = [q1[0] + (m[0] - q1[0]) * p, q1[1] + (m[1] - q1[1]) * p];
          let ux = q2[0] - q1[0], uy = q2[1] - q1[1];
          const ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul;
          const HL = 24, HW = 12, w = A.w.at(t), c = rgb(A.c.at(t));
          const bx = q2[0] - ux * HL, by = q2[1] - uy * HL;
          path.setAttribute("d", `M ${S[0]} ${S[1]} Q ${q1[0]} ${q1[1]} ${bx} ${by}`);
          path.setAttribute("stroke", c); path.setAttribute("stroke-width", w);
          head.setAttribute("points", `${q2[0]},${q2[1]} ${bx - uy * HW},${by + ux * HW} ${bx + uy * HW},${by - ux * HW}`);
          head.setAttribute("fill", c);
          path.style.opacity = op; head.style.opacity = op;
        },
      };
      items.push(A);
      return A;
    }

    // ---------- 指针标签：贴在节点下方（side = 1）或上方（side = -1），lvl 为第几排 ----------
    const TAGC = { blue: "#2350d8", teal: "#0b7d70", hot: "#c4561d", ink: "#141414", purple: "#6a32d6", use: "#24704a" };
    function tag(text, color, at, o = {}) {
      const side = o.side || 1, c = TAGC[color] || color;
      const el = div(stage, "position:absolute;left:0;top:0;display:flex;flex-direction:column;align-items:center;will-change:transform");
      const tri = `width:0;height:0;border-left:11px solid transparent;border-right:11px solid transparent;`;
      const pill = `padding:3px 14px 5px;background:${c};color:#fff;font-family:var(--mono);font-size:32px;font-weight:700;border-radius:4px;white-space:nowrap;line-height:1.3`;
      if (side === 1) { div(el, tri + `border-bottom:12px solid ${c}`); div(el, pill, text); } else { div(el, pill, text); div(el, tri + `border-top:12px solid ${c}`); }
      const G = {
        el, at: track(at.box), o: track(0), lvl: track(o.lvl || 0),
        show(t, d = 0.35) { G.o.to(1, t, d, "power1.out"); return G; },
        hide(t, d = 0.3) { G.o.to(0, t, d, "power2.in"); return G; },
        move(to, t, d = 0.5, e = "power2.inOut") { G.at.to(to.box, t, d, e); return G; },
        level(l, t, d = 0.3) { G.lvl.to(l, t, d); return G; },
        x: (t) => G.at.at(t)[0],
        render(t) {
          const b = G.at.at(t), l = G.lvl.at(t);
          const y = side === 1 ? b[1] + b[3] + 12 + l * 66 : b[1] - b[3] - 12 - l * 66;
          el.style.transform = `translate(${b[0]}px,${y}px) translate(-50%,${side === 1 ? 0 : -100}%)`;
          el.style.opacity = G.o.at(t);
        },
      };
      items.push(G);
      return G;
    }

    // 自定义重画：fn(t)
    const custom = (fn) => { items.push({ render: fn }); };

    // ---------- 代码框 ----------
    function code(lines, o = {}) {
      const LH = 58, PAD = 22, w = o.w || 760, h = lines.length * LH + PAD * 2;
      const x = o.x === undefined ? (1920 - w) / 2 : o.x;
      const el = div(ui, `position:absolute;left:${x}px;top:${o.y}px;width:${w}px;height:${h}px;background:var(--panel);border-radius:4px`);
      const bar = div(el, `position:absolute;left:10px;top:${PAD}px;width:${w - 20}px;height:${LH}px;background:#c9d8f3;border-radius:3px`);
      const ls = lines.map((s, i) => div(el, `position:absolute;left:30px;top:${PAD + i * LH}px;height:${LH}px;line-height:${LH}px;font-family:var(--mono);font-size:38px;font-weight:600;color:var(--ink2);white-space:pre`, s.replace(/</g, "&lt;")));
      gsap.set([el, bar, ...ls], { opacity: 0 });
      let cur = 0, on = false;
      const K = {
        el, lines: ls, bar, h,
        show(t, d = 0.4) { ft(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: d, ease: "power2.out" }, t); return K; },
        line(i, t, d = 0.3) { [].concat(i).forEach((j) => ft(ls[j], { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: d, ease: "power2.out" }, t)); return K; },
        hl(i, t, d = 0.22) {
          if (!on) { tl.set(bar, { y: i * LH }, t); ft(bar, { opacity: 0 }, { opacity: 1, duration: 0.18 }, t); on = true; } else if (i !== cur) ft(bar, { y: cur * LH }, { y: i * LH, duration: d, ease: "power2.inOut" }, t);
          else { ft(bar, { opacity: 1 }, { opacity: 0.35, duration: 0.1 }, t); ft(bar, { opacity: 0.35 }, { opacity: 1, duration: 0.14 }, t + 0.1); }
          cur = i; return K;
        },
        hlOff(t) { if (on) ft(bar, { opacity: 1 }, { opacity: 0, duration: 0.2 }, t); on = false; return K; },
        leave(t, d = 0.3) { ft(el, { opacity: 1 }, { opacity: 0, duration: d, ease: "power2.in" }, t); return K; },
      };
      return K;
    }

    // ---------- 页眉、题号、关键句 ----------
    function header(chip, title, t = 0.05) {
      const h = div(ui, "position:absolute;left:96px;top:60px;display:flex;align-items:center;gap:22px;white-space:nowrap");
      const c = div(h, "padding:6px 18px 8px;background:var(--tealD);color:#fff;font-size:36px;font-weight:800;border-radius:3px", chip);
      const ti = div(h, "font-size:48px;font-weight:800;color:var(--ink)", title);
      if (t === 0) return h;
      gsap.set([c, ti], { opacity: 0 });
      ft(c, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.4, ease: "expo.out" }, t);
      ft(ti, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }, t + 0.12);
      return h;
    }
    function src(text, t) {
      const e = div(ui, "position:absolute;right:96px;top:66px;font-family:var(--mono);font-size:34px;font-weight:700;color:var(--note);white-space:nowrap", text);
      gsap.set(e, { opacity: 0 });
      ft(e, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, t);
      return e;
    }
    function key(html, y, t) {
      const e = div(ui, `position:absolute;left:0;top:${y}px;width:1920px;text-align:center;font-size:68px;font-weight:800;color:var(--ink);white-space:nowrap`, html);
      gsap.set(e, { opacity: 0 });
      ft(e, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, t);
      return e;
    }
    function label(html, x, y, css = "") {
      const e = div(stage, `position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-50%);font-size:34px;font-weight:700;color:var(--ink2);white-space:nowrap;${css}`, html);
      const inner = e; gsap.set(inner, { opacity: 0 });
      return {
        el: e,
        show(t, d = 0.35) { ft(e, { opacity: 0 }, { opacity: 1, duration: d, ease: "power1.out" }, t); return this; },
        hide(t, d = 0.3) { ft(e, { opacity: 1 }, { opacity: 0, duration: d, ease: "power2.in" }, t); return this; },
      };
    }

    // ---------- 时钟：每帧按时间重画 ----------
    const render = (t) => { for (const it of items) it.render(t); };
    const clock = { _t: 0, get t() { return this._t; }, set t(v) { this._t = v; render(v); } };
    function done() {
      tl.fromTo(clock, { t: 0 }, { t: DUR, duration: DUR, ease: "none", immediateRender: true }, 0);
      tl.set({}, {}, DUR);
      render(0);
    }

    return { node, arrow, tag, code, header, src, key, label, custom, ft, div, ui, stage, done, C, track, LH: 58, PAD: 22 };
  };
})();
