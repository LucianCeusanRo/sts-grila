/* Teste psihologice / aptitudini – generatoare procedurale (SVG). Fiecare item: {t, seed, lv, q, stim, opts[], ans, expl, mem?, keys[]}.
   Răspunsul corect se calculează din construcție; keys[] = descrierea canonică a fiecărei variante (folosită la verificare: toate diferite). */
(function (root) {
  "use strict";
  function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function ri(R, n) { return Math.floor(R() * n); }
  function pick(R, a) { return a[ri(R, a.length)]; }
  function shuf(R, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = ri(R, i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function f1(x) { return Math.round(x * 10) / 10; }
  /* amestecă variantele: primește [corect, d1, d2...] cu chei; întoarce {opts, keys, ans} */
  function mix(R, list) { var idx = shuf(R, list.map(function (_, i) { return i; })); return { opts: idx.map(function (i) { return list[i][0]; }), keys: idx.map(function (i) { return list[i][1]; }), why: idx.map(function (i) { return list[i][2] || ""; }), ans: idx.indexOf(0) }; }
  function svg(w, h, body, cls) { return '<svg class="' + (cls || "apsv") + '" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" role="img">' + body + "</svg>"; }

  /* ---------- 1. Avion văzut de sus: rotit sau oglindit ---------- */
  function planeTop(mirror, ang, s) {
    s = s || 1;
    var b = '<path d="M0,-34 C4,-30 5,-20 5,-8 L36,6 L36,12 L5,6 L4,22 L14,30 L14,34 L0,31 L-14,34 L-14,30 L-4,22 L-5,6 L-36,12 L-36,6 L-5,-8 C-5,-20 -4,-30 0,-34Z" fill="#cbd5e1" stroke="#0f172a" stroke-width="1.6"/>' +
      '<path d="M0,-28 C2,-25 2.6,-20 2.4,-16 L-2.4,-16 C-2.6,-20 -2,-25 0,-28Z" fill="#1d4ed8"/>' + /* cabina */
      '<rect x="-31" y="5" width="8" height="5" fill="#dc2626" transform="rotate(25 -27 7)"/>' + /* dungă roșie pe aripa stângă */
      '<circle cx="22" cy="6" r="3.2" fill="#0f172a"/>' + /* rezervor sub aripa dreaptă */
      '<path d="M4,24 L12,31" stroke="#16a34a" stroke-width="3"/>'; /* ampenaj dreapta verde */
    return '<g transform="rotate(' + ang + ")" + (mirror ? " scale(-1,1)" : "") + " scale(" + s + ')">' + b + "</g>";
  }
  function genRot2(seed, lv) {
    var R = rng(seed), ref = ri(R, 360), oddMirror = lv >= 3 ? R() < 0.5 : true; /* lv mic: unul singur e „același”; lv mare: alege și „intrusul oglindit” */
    var step = lv <= 1 ? 90 : lv <= 2 ? 45 : lv <= 3 ? 30 : 15;
    var pool = []; for (var k = 0; k < 360 / step; k++) pool.push((ref + k * step) % 360);
    var a0 = pick(R, pool.slice(1)), rest = shuf(R, pool.filter(function (a) { return a !== a0; })).slice(0, 3), angs = [a0].concat(rest);
    var cell = function (m, a) { return svg(96, 96, '<g transform="translate(48,48)">' + planeTop(m, a, 1.15) + "</g>"); };
    var list, q, expl;
    if (oddMirror) {
      /* întrebarea: care avion e ACELAȘI (doar rotit)? ceilalți sunt oglindiți */
      var WM = "oglindit: după ce îl rotești cu botul în sus, dunga roșie ajunge pe aripa dreaptă (la model e pe stânga)"; list = [[cell(false, angs[0]), "r" + angs[0]], [cell(true, angs[1]), "m" + angs[1], WM], [cell(true, angs[2]), "m" + angs[2], WM], [cell(true, angs[3]), "m" + angs[3], WM]];
      q = "Care avion este ACELAȘI cu modelul, doar rotit (nu oglindit)?";
      expl = "Varianta corectă e modelul rotit cu " + ((angs[0] - ref + 360) % 360) + "°. Uită-te la semne: dunga roșie e pe aripa STÂNGĂ, rezervorul negru pe aripa DREAPTĂ (privind spre bot). La celelalte trei semnele sunt inversate = avion oglindit (nu se poate obține prin rotire).";
    } else {
      var WR = "e doar rotit: cu botul în sus, dunga roșie e tot pe aripa stângă, ca la model"; list = [[cell(true, angs[0]), "m" + angs[0]], [cell(false, angs[1]), "r" + angs[1], WR], [cell(false, angs[2]), "r" + angs[2], WR], [cell(false, angs[3]), "r" + angs[3], WR]];
      q = "Care avion este OGLINDIT față de model (nu poate fi obținut prin rotire)?";
      expl = "Rotește în minte fiecare avion până are botul în sus, ca modelul. La cel corect dunga roșie ajunge pe aripa DREAPTĂ și rezervorul pe STÂNGA – deci e imaginea în oglindă. Ceilalți trei sunt doar rotiți.";
    }
    var m = mix(R, list);
    return { t: "rot2", q: q, stim: '<div class="apref"><small>Model</small>' + svg(110, 110, '<g transform="translate(55,55)">' + planeTop(false, ref, 1.3) + "</g>") + "</div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, expl: expl, chk: { ref: ref, mirror: m.keys.map(function (k) { return k[0] === "m"; }), oddMirror: oddMirror } };
  }

  /* ---------- 2. Avion: orizont artificial + busolă (tip AFOQT Instrument Comprehension) ---------- */
  var HD = ["N", "NE", "E", "SE", "S", "SV", "V", "NV"], HDN = ["nord", "nord-est", "est", "sud-est", "sud", "sud-vest", "vest", "nord-vest"];
  function v3(a, b, c) { return [a, b, c]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function mul(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  /* model în coordonate corp: [f (înainte), r (dreapta), u (sus)] */
  var PM = (function () {
    var P = [], w = 0.32;
    function q(pts, c1, c2) { P.push({ p: pts, c: [c1, c2 || c1] }); }
    var fz = [[3, 0], [2.4, w], [-3, w], [-3.2, 0]];
    /* fuzelaj: 4 laturi ale unei cutii subțiri */
    var xs = [2.6, -3.2];
    q([[xs[0], -w, w], [xs[1], -w, w], [xs[1], w, w], [xs[0], w, w]], "#e2e8f0");
    q([[xs[0], -w, -w], [xs[1], -w, -w], [xs[1], w, -w], [xs[0], w, -w]], "#94a3b8");
    q([[xs[0], w, -w], [xs[1], w, -w], [xs[1], w, w], [xs[0], w, w]], "#cbd5e1");
    q([[xs[0], -w, -w], [xs[1], -w, -w], [xs[1], -w, w], [xs[0], -w, w]], "#cbd5e1");
    /* bot roșu (piramidă) și motor negru (capăt spate) */
    var n = [3.6, 0, 0];
    q([n, [xs[0], -w, w], [xs[0], w, w]], "#dc2626"); q([n, [xs[0], w, w], [xs[0], w, -w]], "#dc2626"); q([n, [xs[0], w, -w], [xs[0], -w, -w]], "#b91c1c"); q([n, [xs[0], -w, -w], [xs[0], -w, w]], "#dc2626");
    q([[xs[1], -w, -w], [xs[1], w, -w], [xs[1], w, w], [xs[1], -w, w]], "#0f172a");
    /* cabină */
    q([[2.2, -0.22, w + 0.01], [1.2, -0.22, w + 0.01], [1.2, 0.22, w + 0.01], [2.2, 0.22, w + 0.01]], "#1d4ed8");
    /* aripi (sus deschis, jos închis) */
    q([[0.9, 0, 0], [-0.4, 4.2, 0], [-1.2, 4.2, 0], [-1.0, 0, 0]], "#f1f5f9", "#475569");
    q([[0.9, 0, 0], [-0.4, -4.2, 0], [-1.2, -4.2, 0], [-1.0, 0, 0]], "#f1f5f9", "#475569");
    /* stabilizator orizontal */
    q([[-2.5, 0, 0], [-2.9, 1.6, 0], [-3.2, 1.6, 0], [-3.1, 0, 0]], "#f1f5f9", "#475569");
    q([[-2.5, 0, 0], [-2.9, -1.6, 0], [-3.2, -1.6, 0], [-3.1, 0, 0]], "#f1f5f9", "#475569");
    /* derivă (portocalie) */
    q([[-2.2, 0, w], [-3.0, 0, 1.9], [-3.35, 0, 1.9], [-3.2, 0, w]], "#f97316", "#ea580c");
    return P;
  })();
  function planeView(hdg, pitch, bank, size) {
    var ps = hdg * Math.PI / 180, th = pitch * Math.PI / 180, ph = bank * Math.PI / 180;
    var F = [Math.sin(ps) * Math.cos(th), Math.cos(ps) * Math.cos(th), Math.sin(th)];
    var R0 = [Math.cos(ps), -Math.sin(ps), 0];
    var U0 = cross(R0, F);
    /* corecție: dacă th≠0, R0 nu e perfect perpendicular pe F – e (pentru că R0 e orizontal, F are componenta verticală) ok: R0·F = 0 */
    var Rv = add(mul(R0, Math.cos(ph)), mul(U0, -Math.sin(ph))), Uv = add(mul(U0, Math.cos(ph)), mul(R0, Math.sin(ph)));
    var el = 12 * Math.PI / 180, D = 40, cam = [0, -D * Math.cos(el), D * Math.sin(el)];
    var cr = [1, 0, 0], cf = [0, Math.cos(el), -Math.sin(el)], cu = [0, Math.sin(el), Math.cos(el)], fl = 300;
    function W(p) { return add(add(mul(F, p[0]), mul(Rv, p[1])), mul(Uv, p[2])); }
    var polys = PM.map(function (pl) {
      var w = pl.p.map(W), rel = w.map(function (p) { return add(p, mul(cam, -1)); });
      var zc = rel.map(function (r) { return dot(r, cf); }), z = zc.reduce(function (a, b) { return a + b; }, 0) / zc.length;
      var nrm = cross(add(w[1], mul(w[0], -1)), add(w[2], mul(w[0], -1)));
      var cen = w.reduce(function (a, b) { return add(a, mul(b, 1 / w.length)); }, [0, 0, 0]);
      var face = dot(nrm, add(cam, mul(cen, -1))) > 0;
      var pts = rel.map(function (r, i) { var s = fl / zc[i]; return f1(dot(r, cr) * s) + "," + f1(-dot(r, cu) * s); }).join(" ");
      return { z: z, s: '<polygon points="' + pts + '" fill="' + (face ? pl.c[0] : pl.c[1]) + '" stroke="#0f172a" stroke-width="0.6" stroke-linejoin="round"/>' };
    }).sort(function (a, b) { return b.z - a.z; });
    var sz = size || 120;
    return svg(sz, sz * 0.8, '<rect width="' + sz + '" height="' + f1(sz * 0.8) + '" fill="#e0f2fe" rx="8"/><g transform="translate(' + sz / 2 + "," + f1(sz * 0.42) + ") scale(" + f1(sz / 120) + ')">' + polys.map(function (p) { return p.s; }).join("") + "</g>");
  }
  function horizonDial(pitch, bank) {
    var k = 1.6, b = '<defs><clipPath id="hcl"><circle r="46"/></clipPath></defs><g clip-path="url(#hcl)"><g transform="rotate(' + (-bank) + ") translate(0," + f1(pitch * k) + ')"><rect x="-120" y="-120" width="240" height="120" fill="#38bdf8"/><rect x="-120" y="0" width="240" height="120" fill="#a16207"/><line x1="-120" y1="0" x2="120" y2="0" stroke="#fff" stroke-width="3"/>' +
      [-20, -10, 10, 20].map(function (p) { return '<line x1="-' + (p % 20 ? 8 : 14) + '" y1="' + f1(-p * k) + '" x2="' + (p % 20 ? 8 : 14) + '" y2="' + f1(-p * k) + '" stroke="#fff" stroke-width="1.2"/>'; }).join("") +
      '<path d="M0,' + f1(-41 - pitch * k) + " l-5,8 l10,0z" + '" fill="#fff"/></g></g>' +
      [-60, -45, -30, 0, 30, 45, 60].map(function (a) { return '<line x1="0" y1="-46" x2="0" y2="' + (a % 30 ? -41 : -38) + '" stroke="#0f172a" stroke-width="2" transform="rotate(' + a + ')"/>'; }).join("") +
      '<circle r="46" fill="none" stroke="#0f172a" stroke-width="3"/><path d="M-26,0 L-9,0 L0,7 L9,0 L26,0" fill="none" stroke="#facc15" stroke-width="3.5" stroke-linejoin="round"/><circle r="2.5" fill="#facc15"/>';
    return svg(110, 110, '<g transform="translate(55,55)">' + b + "</g>");
  }
  function compassDial(hdg) {
    var b = '<circle r="46" fill="#0f172a"/><circle r="46" fill="none" stroke="#64748b" stroke-width="2"/>' + HD.map(function (d, i) { var a = i * 45 * Math.PI / 180; return '<text x="' + f1(Math.sin(a) * 36) + '" y="' + f1(-Math.cos(a) * 36 + 4) + '" fill="#fff" font-size="' + (i % 2 ? 8 : 11) + '" font-weight="700" text-anchor="middle">' + d + "</text>"; }).join("") +
      '<g transform="rotate(' + hdg + ')"><path d="M0,-26 L6,-12 L2,-12 L2,22 L-2,22 L-2,-12 L-6,-12Z" fill="#facc15"/></g>';
    return svg(110, 110, '<g transform="translate(55,55)">' + b + "</g>");
  }
  function genAtt(seed, lv) {
    var R = rng(seed), banks = lv <= 2 ? [-45, 0, 45] : [-45, -30, 0, 30, 45], pits = [-20, 0, 20];
    var c = { h: ri(R, 8) * 45, p: pick(R, pits), b: pick(R, banks) };
    var key = function (o) { return o.h + "|" + o.p + "|" + (o.b > 0 ? 1 : o.b < 0 ? -1 : 0); };
    var cand = [];
    function push(o) { if (key(o) !== key(c) && cand.every(function (x) { return key(x) !== key(o); })) cand.push(o); }
    var mirH = (360 - c.h) % 360, backH = (c.h + 180) % 360;
    var tries = [
      { h: c.h, p: c.p, b: c.b ? -c.b : 45 }, { h: mirH, p: c.p, b: c.b }, { h: c.h, p: c.p ? -c.p : 20, b: c.b }, { h: backH, p: c.p, b: c.b },
      { h: (c.h + 45) % 360, p: c.p, b: c.b }, { h: mirH, p: c.p, b: -c.b }, { h: c.h, p: c.p ? 0 : -20, b: c.b }, { h: c.h, p: c.p, b: c.b ? 0 : -45 }
    ];
    if (lv >= 4) tries = shuf(R, tries.slice(0, 4)).concat(tries.slice(4)); else tries = shuf(R, tries);
    tries.forEach(push);
    var ds = cand.slice(0, 3);
    var desc = function (o) { return (o.p > 0 ? "urcă" : o.p < 0 ? "coboară" : "zbor orizontal") + ", " + (o.b > 0 ? "înclinat dreapta" : o.b < 0 ? "înclinat stânga" : "aripi drepte") + ", spre " + HDN[o.h / 45]; };
    var whyA = function (o) { var w = []; if (Math.sign(o.b) !== Math.sign(c.b)) w.push(o.b > 0 ? "e înclinat spre dreapta" : o.b < 0 ? "e înclinat spre stânga" : "are aripile drepte"); if (o.p !== c.p) w.push(o.p > 0 ? "urcă" : o.p < 0 ? "coboară" : "zboară orizontal"); if (o.h !== c.h) w.push("zboară spre " + HDN[o.h / 45]); return "acest avion " + w.join(", ") + " – instrumentele arată: " + desc(c); };
    var m = mix(R, [[planeView(c.h, c.p, c.b, 150), key(c)]].concat(ds.map(function (o) { return [planeView(o.h, o.p, o.b, 150), key(o), whyA(o)]; })));
    return { t: "att", q: "Care avion zboară exact cum arată cele două instrumente? (Te uiți spre NORD, estul e în dreapta ta.)", stim: '<div class="apdials"><div><small>Orizont artificial</small>' + horizonDial(c.p, c.b) + '</div><div><small>Busolă</small>' + compassDial(c.h) + "</div></div>",
      opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, expl: "Instrumentele arată: " + desc(c) + ". Cum citești: dacă avionașul galben e DEASUPRA liniei orizontului → urcă; dedesubt → coboară. Linia orizontului se înclină invers față de avion: avion înclinat DREAPTA → orizontul coboară în STÂNGA (și indicatorul alb de sus e la stânga lui zero). Busola: N = avionul se îndepărtează de tine (îi vezi coada/motorul negru), S = vine spre tine (vezi botul roșu), E = botul spre dreapta, V = botul spre stânga.",
      chk: { c: c, opt: m.keys } };
  }

  /* ---------- 3. Atenție cu siluete de avioane: câte avioane au direcția X ---------- */
  function planeTiny(a) { return '<g transform="rotate(' + a + ')"><path d="M0,-9 L2,-3 L9,1 L9,3 L2,2 L1.5,6 L4,8 L4,9 L0,8 L-4,9 L-4,8 L-1.5,6 L-2,2 L-9,3 L-9,1 L-2,-3Z" fill="#0f172a"/></g>'; }
  function genAtp(seed, lv) {
    var R = rng(seed), cols = lv <= 2 ? 6 : 8, rows = lv <= 2 ? 5 : lv <= 4 ? 7 : 8, dirs = lv <= 1 ? [0, 90, 180, 270] : [0, 45, 90, 135, 180, 225, 270, 315];
    var tgt = pick(R, dirs), grid = [], cnt = 0;
    for (var i = 0; i < cols * rows; i++) { var a = R() < 0.22 ? tgt : pick(R, dirs); if (lv >= 4 && a !== tgt && R() < 0.3) a = (tgt + pick(R, [45, -45, 180]) + 360) % 360; grid.push(a); if (a === tgt) cnt++; }
    var cs = 30, b = "";
    grid.forEach(function (a, i) { b += '<g transform="translate(' + (15 + (i % cols) * cs) + "," + (15 + Math.floor(i / cols) * cs) + ')">' + planeTiny(a) + "</g>"; });
    var off = shuf(R, [-3, -2, -1, 1, 2, 3]).filter(function (d) { return cnt + d >= 0; }).slice(0, 3);
    var m = mix(R, [[String(cnt), String(cnt)]].concat(off.map(function (d) { return [String(cnt + d), String(cnt + d)]; })));
    return { t: "atp", q: "Câte avioane zboară în aceeași direcție ca modelul?", stim: '<div class="apref"><small>Model</small>' + svg(44, 44, '<g transform="translate(22,22) scale(1.6)">' + planeTiny(tgt) + "</g>") + "</div>" + svg(cols * cs, rows * cs, b, "apsv apgrid"),
      opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, expl: "Sunt " + cnt + " avioane cu botul în aceeași direcție ca modelul. Metodă: parcurge rând cu rând, de la stânga la dreapta, și numără doar botul (vârful ascuțit), nu aripile.", chk: { grid: grid, tgt: tgt, cnt: cnt } };
  }

  /* ---------- voxeli izometrici (comun: rotație 3D + numărare cuburi) ---------- */
  function iso(x, y, z, s) { return [f1((y - x) * 0.866 * s), f1(((x + y) * 0.5 - z) * s)]; }
  function vox(cells, s, ox, oy, shade) {
    var set = {}; cells.forEach(function (c) { set[c.join(",")] = 1; });
    var has = function (x, y, z) { return !!set[x + "," + y + "," + z]; };
    var sorted = cells.slice().sort(function (a, b) { return (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]) || a[2] - b[2]; });
    var col = shade || ["#f8fafc", "#94a3b8", "#cbd5e1"], out = "";
    function P(pts) { return pts.map(function (p) { var q = iso(p[0], p[1], p[2], s); return (q[0] + ox) + "," + (q[1] + oy); }).join(" "); }
    sorted.forEach(function (c) {
      var x = c[0], y = c[1], z = c[2];
      if (!has(x, y, z + 1)) out += '<polygon points="' + P([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]]) + '" fill="' + col[0] + '"/>';
      if (!has(x + 1, y, z)) out += '<polygon points="' + P([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]]) + '" fill="' + col[1] + '"/>';
      if (!has(x, y + 1, z)) out += '<polygon points="' + P([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]]) + '" fill="' + col[2] + '"/>';
    });
    return '<g stroke="#0f172a" stroke-width="1" stroke-linejoin="round">' + out + "</g>";
  }
  function voxFit(cells, W, H) {
    var xs = [], ys = [];
    cells.forEach(function (c) { [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]].forEach(function (d) { var p = iso(c[0] + d[0], c[1] + d[1], c[2] + d[2], 1); xs.push(p[0]); ys.push(p[1]); }); });
    var mnx = Math.min.apply(0, xs), mxx = Math.max.apply(0, xs), mny = Math.min.apply(0, ys), mxy = Math.max.apply(0, ys);
    var s = Math.min((W - 8) / (mxx - mnx || 1), (H - 8) / (mxy - mny || 1));
    return svg(W, H, vox(cells, s, f1(W / 2 - (mnx + mxx) / 2 * s), f1(H / 2 - (mny + mxy) / 2 * s)));
  }
  /* 24 rotații (matrici întregi) */
  var ROTS = (function () {
    var out = [], seen = {};
    function m(a, b) { return [0, 1, 2].map(function (i) { return [0, 1, 2].map(function (j) { return a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j]; }); }); }
    var X = [[1, 0, 0], [0, 0, -1], [0, 1, 0]], Y = [[0, 0, 1], [0, 1, 0], [-1, 0, 0]], q = [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]];
    while (q.length) { var r = q.shift(), k = JSON.stringify(r); if (seen[k]) continue; seen[k] = 1; out.push(r); q.push(m(X, r), m(Y, r)); }
    return out;
  })();
  function rot(c, M) { return c.map(function (p) { return [0, 1, 2].map(function (i) { return M[i][0] * p[0] + M[i][1] * p[1] + M[i][2] * p[2]; }); }); }
  function norm(c) { var mn = [0, 1, 2].map(function (i) { return Math.min.apply(0, c.map(function (p) { return p[i]; })); }); return c.map(function (p) { return [p[0] - mn[0], p[1] - mn[1], p[2] - mn[2]]; }).map(function (p) { return p.join(","); }).sort().join(";"); }
  function canon(c) { return ROTS.map(function (M) { return norm(rot(c, M)); }).sort()[0]; }
  function mirrorC(c) { return c.map(function (p) { return [-p[0], p[1], p[2]]; }); }
  function polyChain(R, n) {
    for (var tries = 0; tries < 200; tries++) {
      var dirs = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]], c = [[0, 0, 0]], set = { "0,0,0": 1 }, prev = null, ok = true;
      var segs = [], left = n - 1;
      while (left > 0) { var L = Math.min(left, 1 + ri(R, 3)); segs.push(L); left -= L; }
      if (segs.length < 3) continue;
      for (var s = 0; s < segs.length && ok; s++) {
        var opts = dirs.filter(function (d) { return !prev || (d[0] * prev[0] + d[1] * prev[1] + d[2] * prev[2] === 0); }), d = pick(R, opts); prev = d;
        for (var k = 0; k < segs[s]; k++) { var l = c[c.length - 1], p = [l[0] + d[0], l[1] + d[1], l[2] + d[2]], kk = p.join(","); if (set[kk]) { ok = false; break; } set[kk] = 1; c.push(p); }
      }
      if (!ok) continue;
      if (canon(c) === canon(mirrorC(c))) continue; /* trebuie să fie chiral */
      /* toate cuburile vizibile măcar parțial în proiecția izometrică (evită forme ambigue) */
      return c;
    }
    return null;
  }
  function genRot3(seed, lv) {
    var R = rng(seed), n = lv <= 1 ? 6 : lv <= 3 ? 8 : 10, S = null;
    while (!S) S = polyChain(R, n);
    var cs = canon(S), cm = canon(mirrorC(S));
    var good = rot(S, pick(R, ROTS.slice(1))), opts = [[voxFit(good, 130, 120), "same"]], used = {};
    var mrots = shuf(R, ROTS);
    for (var i = 0; opts.length < 3 && i < mrots.length; i++) { var mm = rot(mirrorC(S), mrots[i]), k = norm(mm); if (used[k]) continue; used[k] = 1; opts.push([voxFit(mm, 130, 120), "mirror" + i, "este modelul în OGLINDĂ – oricum l-ai roti, un braț ajunge în partea cealaltă"]); }
    /* al 4-lea: altă formă (un cub mutat) – la nivel mare tot oglindă */
    var other = null;
    if (lv < 4) { for (var t = 0; t < 50 && !other; t++) { var c2 = S.slice(0, S.length - 1), last = S[S.length - 2], d = pick(R, [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]), p = [last[0] + d[0], last[1] + d[1], last[2] + d[2]]; if (c2.some(function (q) { return q.join() === p.join(); })) continue; c2.push(p); var cc = canon(c2); if (cc !== cs && cc !== cm) other = c2; } }
    if (other) opts.push([voxFit(rot(other, pick(R, ROTS)), 130, 120), "other", "e alt corp: ultimul cub e mutat (numără cuburile din ultimul braț)"]); else { var mm2 = rot(mirrorC(S), mrots[mrots.length - 1]); opts.push([voxFit(mm2, 130, 120), "mirrorX", "este modelul în OGLINDĂ"]); }
    var m = mix(R, opts);
    return { t: "rot3", q: "Care corp este ACELAȘI cu modelul, doar rotit în spațiu?", stim: '<div class="apref"><small>Model</small>' + voxFit(S, 170, 150) + "</div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans,
      expl: "Varianta corectă este modelul întors în spațiu. Celelalte sunt imaginea lui în oglindă (ca mâna stângă față de dreapta – nu se suprapun oricum le-ai roti)" + (other ? " sau o formă cu un cub mutat" : "") + ". Truc: urmărește brațele în ordine (câte cuburi are fiecare braț și în ce parte cotește următorul).",
      chk: { S: S, good: good, isSame: m.keys.map(function (k) { return k === "same"; }) } };
  }

  function topsVisible(hm, N) {
    function occ(x, y, z) { return x >= 0 && y >= 0 && x < N && y < N && z >= 0 && z < hm[x][y]; }
    for (var x = 0; x < N; x++) for (var y = 0; y < N; y++) { var H = hm[x][y]; if (!H) continue; var vis = 0;
      [[0.5, 0.5], [0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]].forEach(function (o) { var px = x + o[0], py = y + o[1], hit = false; for (var t = 0.02; t < 12; t += 0.04) { if (occ(Math.floor(px + t), Math.floor(py + t), Math.floor(H + t))) { hit = true; break; } } if (!hit) vis++; });
      if (vis < 3) return false; }
    return true;
  }
  /* ---------- 4. Numărarea cuburilor (inclusiv ascunse) ---------- */
  function genCnt(seed, lv) {
    var R = rng(seed), N = lv <= 1 ? 3 : lv <= 3 ? 4 : 5, Hm = lv <= 1 ? 3 : lv <= 3 ? 4 : 5, h, cells, total, tries = 0;
    function occ(hm, x, y, z) { return x >= 0 && y >= 0 && x < N && y < N && z >= 0 && z < hm[x][y]; }
    function visible(hm) { /* fiecare coloană nenulă: vârful e vizibil (eșantionare cu raze spre privitor (1,1,1)) */
      for (var x = 0; x < N; x++) for (var y = 0; y < N; y++) { var H = hm[x][y]; if (!H) continue; var vis = 0;
        [[0.5, 0.5], [0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]].forEach(function (o) { var px = x + o[0], py = y + o[1], hit = false; for (var t = 0.02; t < 12; t += 0.04) { if (occ(hm, Math.floor(px + t), Math.floor(py + t), Math.floor(H + t))) { hit = true; break; } } if (!hit) vis++; });
        if (vis < 3) return false; }
      return true;
    }
    do {
      h = []; for (var x = 0; x < N; x++) { h.push([]); for (var y = 0; y < N; y++) h[x].push(0); }
      for (x = 0; x < N; x++) for (y = 0; y < N; y++) {
        var mx = lv <= 2 ? Math.min(x ? h[x - 1][y] : Hm, y ? h[x][y - 1] : Hm) : Hm; /* niveluri mici: „scară” (înapoi mai înalt) */
        h[x][y] = R() < 0.18 ? 0 : 1 + ri(R, mx);
        if (h[x][y] > mx) h[x][y] = mx;
      }
      tries++;
    } while ((!visible(h) || h.every(function (r) { return r.every(function (v) { return !v; }); })) && tries < 300);
    cells = []; total = 0;
    for (x = 0; x < N; x++) for (y = 0; y < N; y++) for (var z = 0; z < h[x][y]; z++) { cells.push([x, y, z]); total++; }
    var mode = lv >= 3 && R() < 0.4 ? "miss" : "count", maxH = Math.max.apply(0, h.map(function (r) { return Math.max.apply(0, r); }));
    var ans = mode === "miss" ? N * N * maxH - total : total;
    var off = shuf(R, [-4, -3, -2, -1, 1, 2, 3, 4]).filter(function (d) { return ans + d >= 0; }).slice(0, 3);
    var m = mix(R, [[String(ans), String(ans)]].concat(off.map(function (d) { return [String(ans + d), String(ans + d)]; })));
    var plate = (function () { var s = 100; return ""; })();
    return { t: "cnt", q: mode === "miss" ? "Câte cuburi trebuie ADĂUGATE ca să obții un bloc plin de " + N + "×" + N + "×" + maxH + "? (Fiecare cub stă pe podea sau pe alt cub.)" : "Câte cuburi are construcția? Numără și cuburile ascunse (fiecare cub stă pe podea sau pe alt cub).",
      stim: voxFit(cells, 300, 240), opts: m.opts, keys: m.keys, why: m.why, ans: m.ans,
      expl: "Numeri pe coloane: înălțimile sunt " + h.map(function (r) { return r.join(" "); }).join(" | ") + " → total " + total + " cuburi." + (mode === "miss" ? " Blocul plin are " + N + "×" + N + "×" + maxH + " = " + (N * N * maxH) + ", deci lipsesc " + ans + "." : "") + " Metodă: pentru fiecare coloană numără câte cuburi are în înălțime (cele ascunse sunt sub cele văzute), apoi adună.",
      chk: { h: h, total: total, mode: mode, N: N, maxH: maxH } };
  }

  /* ---------- 5. Desfășurata cubului ---------- */
  var SYM = ["dot", "ring", "plus", "cross", "sq", "dia"], SYC = ["#ef4444", "#2563eb", "#16a34a", "#f59e0b", "#7c3aed", "#0891b2"];
  function symSvg(k, col) { /* desenat în pătratul [0,1] */
    var st = 'stroke="' + col + '" stroke-width="0.11" fill="none" stroke-linecap="round"';
    return { dot: '<circle cx=".5" cy=".5" r=".2" fill="' + col + '"/>', ring: '<circle cx=".5" cy=".5" r=".24" ' + st + "/>", plus: '<path d="M.5 .22V.78M.22 .5H.78" ' + st + "/>", cross: '<path d="M.28 .28L.72 .72M.72 .28L.28 .72" ' + st + "/>", sq: '<rect x=".3" y=".3" width=".4" height=".4" fill="' + col + '"/>', dia: '<path d="M.5 .22L.78 .5L.5 .78L.22 .5Z" fill="' + col + '"/>' }[k];
  }
  var DIRS = { "+x": [1, 0, 0], "-x": [-1, 0, 0], "+y": [0, 1, 0], "-y": [0, -1, 0], "+z": [0, 0, 1], "-z": [0, 0, -1] };
  function fold(cells) { /* rostogolirea zarului pe desfășurată; întoarce direcția 3D (oglindită pe z → fața tipărită spre exterior) pentru fiecare celulă */
    var key = function (c) { return c[0] + "," + c[1]; }, set = {}; cells.forEach(function (c) { set[key(c)] = 1; });
    var res = {}, st0 = { B: "-z", T: "+z", N: "+y", S: "-y", E: "+x", W: "-x" }, q = [[cells[0], st0]];
    res[key(cells[0])] = st0.B;
    while (q.length) { var it = q.shift(), c = it[0], s = it[1];
      [[1, 0, "E"], [-1, 0, "W"], [0, -1, "N"], [0, 1, "S"]].forEach(function (mv) { var n = [c[0] + mv[0], c[1] + mv[1]], k = key(n); if (!set[k] || res[k]) return; var o = s, ns;
        if (mv[2] === "E") ns = { B: o.E, W: o.B, T: o.W, E: o.T, N: o.N, S: o.S }; else if (mv[2] === "W") ns = { B: o.W, E: o.B, T: o.E, W: o.T, N: o.N, S: o.S };
        else if (mv[2] === "N") ns = { B: o.N, S: o.B, T: o.S, N: o.T, E: o.E, W: o.W }; else ns = { B: o.S, N: o.B, T: o.N, S: o.T, E: o.E, W: o.W };
        res[k] = ns.B; q.push([n, ns]); }); }
    var out = cells.map(function (c) { var d = DIRS[res[key(c)]]; return [d[0], d[1], -d[2]]; });
    return out;
  }
  function randNet(R) {
    for (var t = 0; t < 500; t++) {
      var cells = [[0, 0]], set = { "0,0": 1 };
      while (cells.length < 6) { var c = pick(R, cells), d = pick(R, [[1, 0], [-1, 0], [0, 1], [0, -1]]), n = [c[0] + d[0], c[1] + d[1]], k = n.join(","); if (set[k]) continue; set[k] = 1; cells.push(n); }
      var mnx = Math.min.apply(0, cells.map(function (c) { return c[0]; })), mny = Math.min.apply(0, cells.map(function (c) { return c[1]; }));
      cells = cells.map(function (c) { return [c[0] - mnx, c[1] - mny]; });
      var W = 1 + Math.max.apply(0, cells.map(function (c) { return c[0]; })), H = 1 + Math.max.apply(0, cells.map(function (c) { return c[1]; }));
      if (W > 5 || H > 5) continue;
      var dirs = fold(cells), ks = dirs.map(function (d) { return d.join(); });
      if (ks.filter(function (k, i) { return ks.indexOf(k) === i; }).length === 6) return { cells: cells, dirs: dirs, W: W, H: H };
    }
  }
  function det3(a, b, c) { return dot(a, cross(b, c)); }
  function viewValid(dirOf, T, L, Rr) { var a = dirOf[T], b = dirOf[L], c = dirOf[Rr]; return dot(a, b) === 0 && dot(b, c) === 0 && dot(a, c) === 0 && det3(a, b, c) === 1; }
  function cubeSvg(T, L, Rr, colored) {
    var s = 34, ox = 50, oy = 46;
    /* fața de sus: vârfuri iso(0,0,1),(1,0,1),(1,1,1),(0,1,1); stânga = fața +x; dreapta = fața +y */
    function face(o, u, v, sym) { /* o + a*u + b*v ; a,b în [0,1] */
      var m = [u[0], u[1], v[0], v[1], o[0], o[1]].map(f1).join(",");
      return '<g transform="matrix(' + m + ')"><path d="M0 0H1V1H0Z" fill="#fff" stroke="#0f172a" stroke-width="' + f1(2 / s * 10) / 10 + '"/>' + symSvg(SYM[sym], colored ? SYC[sym] : "#0f172a") + "</g>";
    }
    function P(x, y, z) { var p = iso(x, y, z, s); return [p[0] + ox, p[1] + oy]; }
    function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
    var t0 = P(0, 0, 1), top = face(t0, sub(P(1, 0, 1), t0), sub(P(0, 1, 1), t0), T);
    var l0 = P(1, 0, 1), left = face(l0, sub(P(1, 1, 1), l0), sub(P(1, 0, 0), l0), L);
    var r0 = P(0, 1, 1), right = face(r0, sub(P(1, 1, 1), r0), sub(P(0, 1, 0), r0), Rr);
    return svg(100, 100, top + left + right);
  }
  function genNet(seed, lv) {
    var R = rng(seed), net = randNet(R), syms = shuf(R, [0, 1, 2, 3, 4, 5]), colored = lv <= 2;
    var dirOf = {}; net.cells.forEach(function (c, i) { dirOf[syms[i]] = net.dirs[i]; });
    var cs = 40, nb = net.cells.map(function (c, i) { return '<g transform="translate(' + (4 + c[0] * cs) + "," + (4 + c[1] * cs) + ") scale(" + cs + ')"><path d="M0 0H1V1H0Z" fill="#fff" stroke="#0f172a" stroke-width=".04"/>' + symSvg(SYM[syms[i]], colored ? SYC[syms[i]] : "#0f172a") + "</g>"; }).join("");
    var netSvg = svg(net.W * cs + 8, net.H * cs + 8, nb);
    var NM = { dot: "punctul", ring: "cercul gol", plus: "plusul", cross: "X-ul", sq: "pătratul plin", dia: "rombul" }, NMG = { dot: "punctului", ring: "cercului gol", plus: "plusului", cross: "X-ului", sq: "pătratului plin", dia: "rombului" };
    var opp = function (k) { var d = dirOf[k]; for (var j = 0; j < 6; j++) if (dot(dirOf[j], d) === -1) return j; };
    if (lv <= 1 || (lv <= 3 && R() < 0.35)) {
      var a = ri(R, 6), o = opp(a), others = shuf(R, [0, 1, 2, 3, 4, 5].filter(function (j) { return j !== a && j !== o; })).slice(0, 3);
      var icon = function (j) { return svg(40, 40, '<g transform="scale(40)"><path d="M0 0H1V1H0Z" fill="#fff" stroke="#0f172a" stroke-width=".04"/>' + symSvg(SYM[j], colored ? SYC[j] : "#0f172a") + "</g>"); };
      var m = mix(R, [[icon(o), "s" + o]].concat(others.map(function (j) { return [icon(j), "s" + j, NM[SYM[j]] + " ajunge VECIN cu " + NM[SYM[a]] + " (au o muchie comună după pliere), deci nu poate fi opus"]; })));
      return { t: "net", q: "După ce pliezi desfășurata într-un cub, ce simbol ajunge pe fața OPUSĂ celei cu simbolul de mai jos?", stim: netSvg + '<div class="apref"><small>Fața dată</small>' + icon(a) + "</div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans,
        expl: "Opus " + NMG[SYM[a]] + " este " + NM[SYM[o]] + ". Regula rapidă: pe un rând de 3 pătrate în linie, primul și al treilea sunt opuse; două pătrate care se ating NU pot fi opuse.", chk: { dirOf: dirOf, kind: "opp", a: a, ans: o } };
    }
    /* care cub se poate obține: 1 valid, 3 imposibile */
    var corners = [];
    [0, 1, 2, 3, 4, 5].forEach(function (T) { [0, 1, 2, 3, 4, 5].forEach(function (L) { [0, 1, 2, 3, 4, 5].forEach(function (Rr) { if (T !== L && L !== Rr && T !== Rr && viewValid(dirOf, T, L, Rr)) corners.push([T, L, Rr]); }); }); });
    var good = pick(R, corners), bad = [], keyv = function (v) { return v.join("-"); }, seen = {}; seen[keyv(good)] = 1;
    function addBad(v) { if (!seen[keyv(v)] && !viewValid(dirOf, v[0], v[1], v[2]) && v[0] !== v[1] && v[1] !== v[2] && v[0] !== v[2]) { seen[keyv(v)] = 1; bad.push(v); } }
    var mir = shuf(R, corners).map(function (c) { return [c[0], c[2], c[1]]; }); /* oglindite: ordinea inversată */
    if (lv >= 4) { addBad([good[0], good[2], good[1]]); mir.forEach(function (v) { if (bad.length < 3) addBad(v); }); }
    else { addBad([good[0], good[2], good[1]]); for (var t2 = 0; t2 < 40 && bad.length < 2; t2++) { var v = good.slice(); v[ri(R, 3)] = opp(v[ri(R, 3)]); addBad(v); } mir.forEach(function (v) { if (bad.length < 3) addBad(v); }); }
    var whyC = function (v) { for (var i = 0; i < 3; i++) for (var j = i + 1; j < 3; j++) if (dot(dirOf[v[i]], dirOf[v[j]]) === -1) return "arată împreună " + NM[SYM[v[i]]] + " și " + NM[SYM[v[j]]] + ", care sunt fețe OPUSE – nu se văd niciodată deodată"; return "fețele sunt vecine, dar în ordine de OGLINDĂ: în jurul colțului ar trebui să fie invers"; };
    var m2 = mix(R, [[cubeSvg(good[0], good[1], good[2], colored), keyv(good)]].concat(bad.slice(0, 3).map(function (v) { return [cubeSvg(v[0], v[1], v[2], colored), keyv(v), whyC(v)]; })));
    return { t: "net", q: "Care cub se poate obține prin plierea desfășuratei (simbolurile spre exterior)?", stim: netSvg, opts: m2.opts, keys: m2.keys, why: m2.why, ans: m2.ans,
      expl: "Pași: 1) elimină cuburile pe care apar împreună două fețe OPUSE (ele nu se văd niciodată deodată). 2) La cele rămase verifică ordinea: pe cubul corect, mergând în sensul acelor de ceasornic sus → dreapta → stânga, simbolurile au aceeași ordine ca în jurul colțului comun din desfășurată; la cele greșite ordinea e în oglindă. Corect: sus " + NM[SYM[good[0]]] + ", stânga " + NM[SYM[good[1]]] + ", dreapta " + NM[SYM[good[2]]] + ".",
      chk: { dirOf: dirOf, kind: "cube", views: m2.keys } };
  }

  /* ---------- 6. Șiruri de numere și litere ---------- */
  var AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function genSer(seed, lv) {
    var R = rng(seed), kinds = lv <= 1 ? ["ar", "geo", "let"] : lv <= 2 ? ["ar", "geo", "alt", "let", "d2"] : lv <= 3 ? ["alt", "d2", "fib", "mx", "let2", "sq"] : ["d2", "fib", "mx", "let2", "alt2", "sq", "mxa"];
    var k = pick(R, kinds), s = [], ans, rule, isL = false, n = 6;
    if (k === "ar") { var a = 2 + ri(R, 20), d = (R() < 0.3 ? -1 : 1) * (2 + ri(R, 9)); if (d < 0) a += -d * n; for (var i = 0; i < n; i++) s.push(a + d * i); rule = "se adună " + d + " la fiecare pas"; }
    else if (k === "geo") { var a2 = 1 + ri(R, 4), q = 2 + ri(R, 2); n = 5; for (i = 0; i < n; i++) s.push(a2 * Math.pow(q, i)); rule = "fiecare termen se înmulțește cu " + q; }
    else if (k === "alt") { var x = 2 + ri(R, 10), y = 20 + ri(R, 20), dx = 2 + ri(R, 5), dy = -(1 + ri(R, 4)); n = 7; for (i = 0; i < n; i++) s.push(i % 2 ? y + dy * ((i - 1) / 2) : x + dx * (i / 2)); rule = "două șiruri intercalate: pozițiile impare cresc cu " + dx + ", pozițiile pare scad cu " + (-dy); }
    else if (k === "alt2") { var x2 = 1 + ri(R, 5), y2 = 3 + ri(R, 6), m2 = 2, dy2 = 3 + ri(R, 4); n = 7; for (i = 0; i < n; i++) s.push(i % 2 ? y2 + dy2 * ((i - 1) / 2) : x2 * Math.pow(m2, i / 2)); rule = "două șiruri intercalate: pe pozițiile impare ×2, pe cele pare +" + dy2; }
    else if (k === "d2") { var a3 = 1 + ri(R, 10), d0 = 1 + ri(R, 4), dd = 1 + ri(R, 3); n = 6; var cur = a3, dif = d0; for (i = 0; i < n; i++) { s.push(cur); cur += dif; dif += dd; } rule = "diferențele cresc cu " + dd + " (" + d0 + ", " + (d0 + dd) + ", " + (d0 + 2 * dd) + "…)"; }
    else if (k === "fib") { var u = 1 + ri(R, 5), v = 1 + ri(R, 6); n = 7; s = [u, v]; for (i = 2; i < n; i++) s.push(s[i - 1] + s[i - 2]); rule = "fiecare termen = suma celor doi dinainte"; }
    else if (k === "mx") { var m3 = 2 + ri(R, 2), b3 = pick(R, [-1, 1, 2, -2, 3]), a4 = (b3 < 0 ? 3 : 1) + ri(R, 4); n = 6; s = [a4]; for (i = 1; i < n; i++) s.push(s[i - 1] * m3 + b3); rule = "×" + m3 + " apoi " + (b3 > 0 ? "+" : "−") + Math.abs(b3) + " la fiecare pas"; }
    else if (k === "mxa") { var a5 = 4 + ri(R, 5); n = 6; s = [a5]; for (i = 1; i < n; i++) s.push(i % 2 ? s[i - 1] * 2 : s[i - 1] - 3); rule = "alternativ ×2, −3"; }
    else if (k === "sq") { var o5 = ri(R, 4), add5 = pick(R, [0, 1, -1, 2]); n = 6; for (i = 1; i <= n; i++) s.push((i + o5) * (i + o5) + add5); rule = "pătrate perfecte " + (add5 ? (add5 > 0 ? "+" : "−") + Math.abs(add5) : "") + " (" + (1 + o5) + "², " + (2 + o5) + "², …)"; }
    else if (k === "let") { isL = true; var st = ri(R, 8), stp = 2 + ri(R, 3); n = 6; for (i = 0; i < n; i++) s.push(st + stp * i); rule = "se sare peste " + (stp - 1) + " litere (pas " + stp + ")"; }
    else { isL = true; var st2 = ri(R, 5), p1 = 1 + ri(R, 2); n = 6; var c2 = st2; for (i = 0; i < n; i++) { s.push(c2); c2 += p1 + i; } rule = "pașii cresc: +" + p1 + ", +" + (p1 + 1) + ", +" + (p1 + 2) + "…"; }
    if (isL && s[s.length - 1] >= 23) return genSer(seed + 7919, lv);
    ans = s.pop();
    var fmt = function (v) { return isL ? AB[v] : String(v); };
    var cand = isL ? [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3].filter(function (v) { return v >= 0 && v < 26; }) : [ans + 1, ans - 1, ans + 2, ans - 2, ans + (s[s.length - 1] - s[s.length - 2]), Math.round(ans * 1.1) + 1, ans + 10, ans - 10].filter(function (v) { return v >= 0 || s.some(function (z) { return z < 0; }); });
    var ds = [], seen = {}; seen[ans] = 1; shuf(R, cand).forEach(function (v) { if (!seen[v] && ds.length < 3) { seen[v] = 1; ds.push(v); } });
    var m = mix(R, [[fmt(ans), fmt(ans)]].concat(ds.map(function (v) { return [fmt(v), fmt(v)]; })));
    return { t: "ser", q: isL ? "Ce literă urmează? (alfabetul fără diacritice: A B C … Z)" : "Ce număr urmează în șir?", stim: '<div class="apser">' + s.map(fmt).join(" , ") + " , <b>?</b></div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, expl: "Regula: " + rule + ". Deci urmează " + fmt(ans) + ".", chk: { s: s, ans: ans, k: k, isL: isL } };
  }

  /* ---------- 7. Matrice tip Raven 3×3 ---------- */
  var SH = ["circle", "square", "tri", "dia"], FI = ["none", "#94a3b8", "#0f172a"];
  function shp(t, x, y, r, fill, rotA) {
    var st = ' fill="' + (fill === "none" ? "#fff" : fill) + '" stroke="#0f172a" stroke-width="2"';
    var g = t === "circle" ? '<circle cx="0" cy="0" r="' + r + '"' + st + "/>" : t === "square" ? '<rect x="' + -r + '" y="' + -r + '" width="' + 2 * r + '" height="' + 2 * r + '"' + st + "/>" : t === "tri" ? '<path d="M0,' + -r + " L" + f1(r * 0.95) + "," + f1(r * 0.75) + " L" + f1(-r * 0.95) + "," + f1(r * 0.75) + 'Z"' + st + "/>" : '<path d="M0,' + -r + " L" + r + ",0 L0," + r + " L" + -r + ',0Z"' + st + "/>";
    return '<g transform="translate(' + x + "," + y + ") rotate(" + (rotA || 0) + ')">' + g + "</g>";
  }
  function cellSvg(c, sz) {
    sz = sz || 74; var pos = { 1: [[0.5, 0.5]], 2: [[0.3, 0.5], [0.7, 0.5]], 3: [[0.5, 0.27], [0.27, 0.72], [0.73, 0.72]], 4: [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]] }[c.n];
    var r = c.n === 1 ? sz * 0.26 : c.n === 2 ? sz * 0.17 : sz * 0.14, b = '<rect width="' + sz + '" height="' + sz + '" fill="#fff" stroke="#cbd5e1"/>';
    pos.forEach(function (p) { b += shp(SH[c.s], f1(p[0] * sz), f1(p[1] * sz), f1(r), FI[c.f], c.r * 45); });
    if (c.l) b += '<line x1="' + f1(sz * 0.1) + '" y1="' + f1(sz * 0.9) + '" x2="' + f1(sz * 0.9) + '" y2="' + f1(sz * 0.1) + '" stroke="#dc2626" stroke-width="2.5" transform="rotate(' + (c.l - 1) * 90 + " " + sz / 2 + " " + sz / 2 + ')"/>';
    return b;
  }
  function genMat(seed, lv) {
    var R = rng(seed), attrs = ["s", "n", "f"].concat(lv >= 3 ? ["l"] : []).concat(lv >= 5 ? ["r"] : []);
    var vals = { s: shuf(R, [0, 1, 2, 3]).slice(0, 3), n: [1, 2, 3], f: shuf(R, [0, 1, 2]), l: shuf(R, [0, 1, 2]), r: [0, 1, 2] };
    var rules = {}, M = [];
    attrs.forEach(function (a) { var opts = lv <= 1 ? ["row", "const", "prog"] : lv <= 2 ? ["row", "latin", "prog"] : ["latin", "latin2", "prog", "row"]; if (a !== "n" && a !== "r") opts = opts.filter(function (o) { return o !== "prog"; }); rules[a] = pick(R, opts); });
    if (!attrs.some(function (a) { return rules[a] === "latin" || rules[a] === "latin2" || rules[a] === "prog"; })) rules.s = "latin";
    for (var r = 0; r < 3; r++) { M.push([]); for (var c = 0; c < 3; c++) { var cell = { s: 0, n: 1, f: 0, l: 0, r: 0 };
      attrs.forEach(function (a) { var v = vals[a], ru = rules[a]; cell[a] = ru === "const" ? v[0] : ru === "row" ? v[r] : ru === "latin" ? v[(c + r) % 3] : ru === "latin2" ? v[(c + 2 * r) % 3] : v[c]; });
      M[r].push(cell); } }
    var ans = M[2][2], key = function (c) { return [c.s, c.n, c.f, c.l, c.r].join(""); };
    var pool = {}; attrs.forEach(function (a) { pool[a] = a === "s" ? [0, 1, 2, 3] : a === "n" ? [1, 2, 3, 4] : a === "f" ? [0, 1, 2] : a === "l" ? [0, 1, 2] : [0, 1, 2]; });
    function chg(c, a) { var o = {}; for (var k in c) o[k] = c[k]; var alt = pool[a].filter(function (v) { return v !== c[a]; }); o[a] = pick(R, alt); return o; }
    var decoy = chg(ans, pick(R, attrs)), ds = [], seen = {}; seen[key(ans)] = 1;
    function addD(o) { if (!seen[key(o)]) { seen[key(o)] = 1; ds.push(o); } }
    addD(decoy);
    for (var t = 0; t < 200 && ds.length < 5; t++) addD(chg(R() < 0.5 ? ans : decoy, pick(R, attrs)));
    var gb = "";
    for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) gb += '<g transform="translate(' + (c * 78 + 2) + "," + (r * 78 + 2) + ')">' + (r === 2 && c === 2 ? '<rect width="74" height="74" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="4 3"/><text x="37" y="47" font-size="28" text-anchor="middle" fill="#64748b">?</text>' : cellSvg(M[r][c])) + "</g>";
    var RN0 = { s: "forma", n: "numărul de figuri", f: "umplerea", l: "linia roșie", r: "rotația" };
    var whyM = function (o) { return "greșit la: " + ["s", "n", "f", "l", "r"].filter(function (a) { return o[a] !== ans[a]; }).map(function (a) { return RN0[a]; }).join(", "); };
    var m = mix(R, [[svg(78, 78, '<g transform="translate(2,2)">' + cellSvg(ans) + "</g>"), key(ans)]].concat(ds.map(function (o) { return [svg(78, 78, '<g transform="translate(2,2)">' + cellSvg(o) + "</g>"), key(o), whyM(o)]; })));
    var RN = { s: "forma", n: "numărul de figuri", f: "umplerea", l: "linia roșie", r: "rotația" }, RR = { const: "e la fel peste tot", row: "e la fel pe fiecare rând (se schimbă de la un rând la altul)", latin: "fiecare valoare apare o singură dată pe rând și pe coloană", latin2: "fiecare valoare apare o singură dată pe rând și pe coloană (în diagonală inversă)", prog: "crește de la stânga la dreapta (1, 2, 3)" };
    return { t: "mat", q: "Ce figură completează matricea? (Caută regula pe rânduri și pe coloane.)", stim: svg(236, 236, gb), opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 3,
      expl: "Reguli: " + attrs.map(function (a) { return RN[a] + " – " + RR[rules[a]]; }).join("; ") + ". Verifică fiecare atribut separat: doar varianta corectă respectă toate regulile.", chk: { M: M, rules: rules, attrs: attrs } };
  }

  /* ---------- 8. Atenție concentrată (tip Bourdon / „d cu două liniuțe”) – variantă de număr ---------- */
  var LET = ["b", "d", "p", "q"];
  function bourCell(l, k) { /* k: liniuțe 1..3, sus/jos */ var up = k & 1 ? 1 : 0, dn = k & 2 ? 1 : 0, s = '<text x="15" y="21" font-size="20" text-anchor="middle" font-family="Arial" fill="#0f172a">' + l + "</text>"; if (up) s += '<line x1="15" y1="2" x2="15" y2="6" stroke="#0f172a" stroke-width="1.6"/>'; if (k === 3 || k === 5) s += '<line x1="11" y1="2" x2="11" y2="6" stroke="#0f172a" stroke-width="1.6"/>'; if (dn) s += '<line x1="15" y1="25" x2="15" y2="29" stroke="#0f172a" stroke-width="1.6"/>'; return s; }
  function bourGrid(R, cols, rows, lv) { var g = []; for (var i = 0; i < cols * rows; i++) { var l = lv <= 1 ? pick(R, ["d", "b"]) : pick(R, LET), k = pick(R, [1, 2, 3]); g.push([l, k]); } return g; }
  function bourMatch(c) { return c[0] === "d" && c[1] === 3; }
  function genBou(seed, lv) {
    var R = rng(seed), cols = lv <= 2 ? 8 : 10, rows = lv <= 2 ? 5 : lv <= 4 ? 7 : 9, g = bourGrid(R, cols, rows, lv), cnt = g.filter(bourMatch).length, b = "";
    g.forEach(function (c, i) { b += '<g transform="translate(' + (i % cols) * 30 + "," + Math.floor(i / cols) * 32 + ')">' + bourCell(c[0], c[1]) + "</g>"; });
    var off = shuf(R, [-3, -2, -1, 1, 2, 3]).filter(function (d) { return cnt + d >= 0; }).slice(0, 3);
    var m = mix(R, [[String(cnt), String(cnt)]].concat(off.map(function (d) { return [String(cnt + d), String(cnt + d)]; })));
    return { t: "bou", q: "Câte litere „d” cu O liniuță SUS și una JOS sunt în tabel? (Literele b, p, q și „d” cu alte liniuțe nu se numără.)", stim: '<div class="apref"><small>Ținta</small>' + svg(30, 32, bourCell("d", 3)) + "</div>" + svg(cols * 30, rows * 32, b, "apsv apgrid"),
      opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, expl: "Sunt " + cnt + " ținte. Capcanele: „b” e oglinda lui „d”, „p” și „q” sunt întoarse; „d” cu liniuță doar sus sau doar jos nu se numără. Parcurge rând cu rând și bifează din ochi.", chk: { g: g, cnt: cnt } };
  }

  /* ---------- 9. Memorie: grilă de poziții / șir de cifre ---------- */
  function gridSvg(on, N, sz) { var c = sz / N, b = ""; for (var i = 0; i < N * N; i++) b += '<rect x="' + f1((i % N) * c + 1) + '" y="' + f1(Math.floor(i / N) * c + 1) + '" width="' + f1(c - 2) + '" height="' + f1(c - 2) + '" rx="4" fill="' + (on.indexOf(i) >= 0 ? "#1e7b34" : "#e2e8f0") + '"/>'; return svg(sz, sz, b); }
  function genMem(seed, lv) {
    var R = rng(seed);
    if (R() < 0.5) {
      var N = lv <= 2 ? 4 : 5, k = 3 + lv + (lv >= 4 ? 1 : 0), cells = shuf(R, Array.apply(null, Array(N * N)).map(function (_, i) { return i; })), on = cells.slice(0, k).sort(function (a, b) { return a - b; });
      var ds = [], seen = {}; seen[on.join()] = 1;
      for (var t = 0; t < 100 && ds.length < 3; t++) { var o = on.slice(), j = ri(R, o.length), free = cells.filter(function (c) { return o.indexOf(c) < 0; }); o[j] = pick(R, free); if (lv >= 4 && R() < 0.5) { var j2 = ri(R, o.length); o[j2] = pick(R, cells.filter(function (c) { return o.indexOf(c) < 0; })); } o.sort(function (a, b) { return a - b; }); if (!seen[o.join()]) { seen[o.join()] = 1; ds.push(o); } }
      var m = mix(R, [[gridSvg(on, N, 110), on.join()]].concat(ds.map(function (o) { var d = o.filter(function (x) { return on.indexOf(x) < 0; }).length; return [gridSvg(o, N, 110), o.join(), d + (d === 1 ? " pătrat e mutat" : " pătrate sunt mutate") + " față de grila arătată"]; })));
      return { t: "mem", q: "Care grilă este EXACT cea pe care ai văzut-o?", mem: { html: '<p class="small muted">Memorează pozițiile verzi.</p>' + gridSvg(on, N, 220), ms: Math.max(1500, 4200 - lv * 500) }, stim: "", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans,
        expl: "Grila avea " + k + " pătrate verzi. Truc: grupează-le în forme (o linie, un L, o diagonală) – ții minte 2–3 forme mai ușor decât " + k + " puncte separate.", chk: { on: on } };
    }
    var L = 4 + lv, dig = []; for (var i = 0; i < L; i++) dig.push(ri(R, 10));
    var mode = lv >= 3 && R() < 0.5 ? "pos" : "seq";
    if (mode === "pos") {
      var p = ri(R, L), ans = dig[p], cand = shuf(R, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (d) { return d !== ans; })).slice(0, 3);
      var m2 = mix(R, [[String(ans), String(ans)]].concat(cand.map(function (d) { return [String(d), String(d)]; })));
      return { t: "mem", q: "Ce cifră era pe poziția " + (p + 1) + " (numărând de la stânga)?", mem: { html: '<p class="small muted">Memorează cifrele, în ordine.</p><div class="apser big">' + dig.join(" ") + "</div>", ms: 1200 + L * 450 }, stim: "", opts: m2.opts, keys: m2.keys, why: m2.why, ans: m2.ans, expl: "Șirul era " + dig.join(" ") + ", deci pe poziția " + (p + 1) + " era " + ans + ". Truc: împarte șirul în grupe de câte 3 (ca la numerele de telefon).", chk: { dig: dig, p: p } };
    }
    var ds2 = [], seen2 = {}; seen2[dig.join("")] = 1;
    for (t = 0; t < 100 && ds2.length < 3; t++) { var o2 = dig.slice(); if (R() < 0.5) { var a = ri(R, L - 1); var tmp = o2[a]; o2[a] = o2[a + 1]; o2[a + 1] = tmp; } else { var b2 = ri(R, L); o2[b2] = (o2[b2] + 1 + ri(R, 8)) % 10; } if (!seen2[o2.join("")]) { seen2[o2.join("")] = 1; ds2.push(o2); } }
    var m3 = mix(R, [[dig.join(" "), dig.join("")]].concat(ds2.map(function (o) { var pos = []; o.forEach(function (d, i) { if (d !== dig[i]) pos.push(i + 1); }); return [o.join(" "), o.join(""), "diferă la poziția " + pos.join(" și ")]; })));
    return { t: "mem", q: "Care era șirul de cifre?", mem: { html: '<p class="small muted">Memorează cifrele, în ordine.</p><div class="apser big">' + dig.join(" ") + "</div>", ms: 1200 + L * 450 }, stim: "", opts: m3.opts, keys: m3.keys, why: m3.why, ans: m3.ans, expl: "Șirul era " + dig.join(" ") + ". Variantele greșite au două cifre inversate sau o cifră schimbată. Truc: grupe de câte 3 și repetă-le în gând.", chk: { dig: dig } };
  }

  /* ---------- 10. Calcul rapid ---------- */
  function genAri(seed, lv) {
    var R = rng(seed), k = pick(R, lv <= 1 ? ["add", "mul"] : lv <= 3 ? ["mul", "pct", "mix", "div"] : ["pct", "mix", "frac", "mul2", "div"]), q, ans, ex;
    if (k === "add") { var a = 20 + ri(R, 80), b = 20 + ri(R, 80), c = 5 + ri(R, 40); ans = a + b - c; q = a + " + " + b + " − " + c; ex = a + " + " + b + " = " + (a + b) + ", apoi − " + c; }
    else if (k === "mul") { var x = 6 + ri(R, 14), y = 3 + ri(R, 7); ans = x * y; q = x + " × " + y; ex = x + "×" + y + " = " + (x * 10) + "×" + y + "/10 … sau descompune: (" + (x - x % 10) + "+" + (x % 10) + ")×" + y; }
    else if (k === "mul2") { var x2 = 12 + ri(R, 38), y2 = 11 + ri(R, 14); ans = x2 * y2; q = x2 + " × " + y2; ex = x2 + "×" + y2 + " = " + x2 + "×" + (y2 - y2 % 10) + " + " + x2 + "×" + (y2 % 10) + " = " + x2 * (y2 - y2 % 10) + " + " + x2 * (y2 % 10); }
    else if (k === "pct") { var p = pick(R, [5, 10, 15, 20, 25, 30, 40, 75]), base = pick(R, [40, 60, 80, 120, 160, 200, 240, 360, 480]); ans = p * base / 100; if (ans % 1) return genAri(seed + 101, lv); q = p + "% din " + base; ex = "10% din " + base + " = " + base / 10 + "; " + p + "% = " + f1(p / 10) + " × " + base / 10 + " = " + ans; }
    else if (k === "div") { var d = 3 + ri(R, 9), r2 = 12 + ri(R, 30); ans = r2; q = d * r2 + " : " + d; var tz = r2 - r2 % 10, uz = r2 % 10; ex = uz ? "descompune: " + d * r2 + " = " + d * tz + " + " + d * uz + "; " + d * tz + " : " + d + " = " + tz + ", " + d * uz + " : " + d + " = " + uz + "; " + tz + " + " + uz + " = " + r2 + " (verificare: " + d + " × " + r2 + " = " + d * r2 + ")" : d * r2 + " : " + d + " = " + r2 + " (verificare: " + d + " × " + r2 + " = " + d * r2 + ")"; }
    else if (k === "frac") { var den = pick(R, [3, 4, 5, 6, 8]), num = 1 + ri(R, den - 1), tot = den * (4 + ri(R, 20)); ans = tot / den * num; q = num + "/" + den + " din " + tot; ex = tot + " : " + den + " = " + tot / den + ", × " + num + " = " + ans; }
    else { var a3 = 3 + ri(R, 9), b3 = 2 + ri(R, 8), c3 = 10 + ri(R, 30); ans = a3 * b3 + c3; q = a3 + " × " + b3 + " + " + c3; ex = "întâi înmulțirea: " + a3 * b3 + ", apoi + " + c3; }
    var cand = [ans + 1, ans - 1, ans + 10, ans - 10, ans + 2, ans - 2, Math.round(ans * 1.1), ans + 5].filter(function (v) { return v >= 0 && v !== ans; }), ds = [], seen = {};
    shuf(R, cand).forEach(function (v) { if (!seen[v] && ds.length < 3) { seen[v] = 1; ds.push(v); } });
    var m = mix(R, [[String(ans), String(ans)]].concat(ds.map(function (v) { return [String(v), String(v)]; })));
    return { t: "ari", q: "Calculează în minte:", stim: '<div class="apser">' + q + " = <b>?</b></div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, expl: "Rezultat: " + ans + ". " + ex + ".", chk: { ans: ans } };
  }

  /* ================= tipuri suplimentare (modelate pe formatele din materialele candidatului) ================= */
  /* ---------- Săgețile de atenție (A.N.P) ---------- */
  function genArr(seed, lv) {
    var R = rng(seed), L = lv <= 1 ? 7 : lv <= 2 ? 9 : lv <= 3 ? 11 : lv <= 4 ? 13 : 15, base = R() < 0.5 ? ">" : "<", odd = R() < 0.75, pos = ri(R, L), row = [];
    for (var i = 0; i < L; i++) row.push(base);
    if (odd) row[pos] = base === ">" ? "<" : ">";
    var ans = odd ? (row[pos] === "<" ? "S" : "D") : "N";
    var lab = { S: "S – săgeata diferită arată spre STÂNGA", D: "D – săgeata diferită arată spre DREAPTA", N: "Nimic – toate sunt la fel" };
    var wA = { S: odd ? "săgeata diferită arată spre dreapta, nu spre stânga" : "nu există nicio săgeată diferită", D: odd ? "săgeata diferită arată spre stânga, nu spre dreapta" : "nu există nicio săgeată diferită", N: "există o săgeată diferită (nr. " + (pos + 1) + ")" };
    var m = mix(R, [[lab[ans], ans]].concat(["S", "D", "N"].filter(function (k) { return k !== ans; }).map(function (k) { return [lab[k], k, wA[k]]; })));
    return { t: "arr", q: "Este o săgeată diferită de celelalte? Dacă da, încotro arată ea?", stim: '<div class="aparr">' + row.map(function (c) { return "<span>" + (c === ">" ? "&gt;" : "&lt;") + "</span>"; }).join("") + "</div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 1,
      expl: odd ? "Săgeata nr. " + (pos + 1) + " arată spre " + (ans === "S" ? "stânga (<)" : "dreapta (>)") + ", celelalte spre " + (base === ">" ? "dreapta" : "stânga") + ". Răspunsul e direcția săgeții DIFERITE, nu a majorității." : "Toate săgețile arată în aceeași parte, deci nu marchezi nimic.", chk: { row: row.join(""), ans: ans } };
  }
  /* ---------- Proba PON: fețe identice (3 / 2 / 0) ---------- */
  function face(f) { /* f: [cap 0..2, ochi 0..2, gură 0..2, urechi 0/1, sprâncene 0/1] */
    var head = f[0] === 0 ? '<circle cx="30" cy="30" r="22"/>' : f[0] === 1 ? '<rect x="9" y="9" width="42" height="42" rx="3"/>' : '<path d="M30,6 L54,52 L6,52Z"/>';
    var ey = f[0] === 2 ? 34 : 25, eyes = f[1] === 0 ? '<circle cx="22" cy="' + ey + '" r="2.6" fill="#0f172a"/><circle cx="38" cy="' + ey + '" r="2.6" fill="#0f172a"/>' : f[1] === 1 ? '<path d="M18,' + ey + ' h8 M34,' + ey + ' h8"/>' : '<circle cx="22" cy="' + ey + '" r="3" fill="#fff"/><circle cx="38" cy="' + ey + '" r="3" fill="#fff"/>';
    var my = f[0] === 2 ? 45 : 39, mouth = f[2] === 0 ? '<path d="M22,' + my + " Q30," + (my + 6) + " 38," + my + '"/>' : f[2] === 1 ? '<path d="M22,' + (my + 2) + ' h16"/>' : '<path d="M22,' + (my + 4) + " Q30," + (my - 2) + " 38," + (my + 4) + '"/>';
    var ears = f[3] ? (f[0] === 2 ? '<path d="M13,40 l-6,-4 M47,40 l6,-4"/>' : '<path d="M8,30 l-5,0 M52,30 l5,0"/>') : "";
    var brows = f[4] ? '<path d="M18,' + (ey - 6) + " l8,2 M42," + (ey - 6) + ' l-8,2"/>' : "";
    return '<g fill="#fff" stroke="#0f172a" stroke-width="2" stroke-linecap="round">' + head + ears + "</g>" + '<g fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round">' + eyes + mouth + brows + "</g>";
  }
  function genPon(seed, lv) {
    var R = rng(seed), nAttr = lv <= 1 ? 3 : 5, want = pick(R, [3, 2, 0]);
    function rf() { return [ri(R, 3), ri(R, 3), ri(R, 3), nAttr > 3 ? ri(R, 2) : 0, nAttr > 3 ? ri(R, 2) : 0]; }
    function tweak(f) { var g = f.slice(), a = ri(R, nAttr); g[a] = a < 3 ? (g[a] + 1 + ri(R, 2)) % 3 : 1 - g[a]; return g; }
    var a = rf(), fs;
    if (want === 3) fs = [a, a.slice(), a.slice()];
    else if (want === 2) { var b = lv >= 3 ? tweak(a) : rf(); while (b.join() === a.join()) b = tweak(a); fs = shuf(R, [a, a.slice(), b]); }
    else { var b2 = lv >= 3 ? tweak(a) : rf(), c = lv >= 3 ? tweak(a) : rf(); var tries = 0; while ((b2.join() === a.join() || c.join() === a.join() || c.join() === b2.join()) && tries++ < 50) { b2 = tweak(a); c = tweak(b2); } fs = [a, b2, c]; }
    var ks = fs.map(function (f) { return f.join(); }), same = ks[0] === ks[1] && ks[1] === ks[2] ? 3 : (ks[0] === ks[1] || ks[1] === ks[2] || ks[0] === ks[2]) ? 2 : 0;
    var m = mix(R, [[String(same), String(same)]].concat(["3", "2", "0"].filter(function (k) { return k !== String(same); }).map(function (k) { return [k, k, k === "3" ? "nu sunt toate trei la fel" : k === "2" ? (same === 3 ? "sunt toate trei identice" : "nu există două identice") : "există figuri identice"]; })));
    return { t: "pon", q: "Câte figuri sunt IDENTICE pe rând? (3 = toate, 2 = două, 0 = niciuna)", stim: svg(200, 64, fs.map(function (f, i) { return '<g transform="translate(' + (i * 70) + ',2)">' + face(f) + "</g>"; }).join("")), opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 3,
      expl: "Compară pe rând: forma capului, ochii, gura" + (nAttr > 3 ? ", urechile și sprâncenele" : "") + ". Aici: " + (same === 3 ? "toate trei sunt la fel" : same === 2 ? "două sunt identice, a treia diferă" : "toate trei diferă între ele") + ".", chk: { fs: fs, same: same } };
  }
  /* ---------- Vederea de sus / din față a unui corp din cuburi ---------- */
  function gridView(cells, N, sz) { var c = sz / N, b = '<rect width="' + sz + '" height="' + sz + '" fill="#fff" stroke="#94a3b8"/>'; for (var r = 0; r < N; r++) for (var q = 0; q < N; q++) b += '<rect x="' + f1(q * c + 1) + '" y="' + f1(r * c + 1) + '" width="' + f1(c - 2) + '" height="' + f1(c - 2) + '" fill="' + (cells[r * N + q] ? "#334155" : "#f1f5f9") + '"/>'; return svg(sz, sz, b); }
  function genTop(seed, lv) {
    var R = rng(seed), N = lv <= 2 ? 3 : 4, h, tries = 0, hm = lv <= 2 ? 2 : 3;
    var view = lv >= 3 && R() < 0.5 ? "front" : "top";
    function img(h) { /* top: rând r = x (jos = față), coloană = y ; front: rând = înălțime (sus = mare), coloană = y */
      var a = [];
      if (view === "top") { for (var x = 0; x < N; x++) for (var y = 0; y < N; y++) a.push(h[x][y] > 0 ? 1 : 0); }
      else { for (var z = N - 1; z >= 0; z--) for (y = 0; y < N; y++) { var mx = 0; for (x = 0; x < N; x++) mx = Math.max(mx, h[x][y]); a.push(mx > z ? 1 : 0); } }
      return a;
    }
    function T(a, f) { var o = []; for (var r = 0; r < N; r++) for (var q = 0; q < N; q++) { var s = f(r, q); o.push(a[s[0] * N + s[1]]); } return o; }
    var ok = false, A;
    while (!ok && tries++ < 400) {
      h = []; for (var x = 0; x < N; x++) { h.push([]); for (var y = 0; y < N; y++) h[x].push(R() < 0.35 ? 0 : 1 + ri(R, hm)); }
      A = img(h); var k = A.join(""), mir = T(A, function (r, q) { return [r, N - 1 - q]; }).join(""), flp = T(A, function (r, q) { return [N - 1 - r, q]; }).join("");
      ok = k !== mir && k !== flp && A.some(function (v) { return v; }) && A.some(function (v) { return !v; });
      if (ok) { for (var q2 = 0; q2 < N && ok; q2++) { var rx = false, cy = false; for (var q3 = 0; q3 < N; q3++) { if (h[q2][q3]) rx = true; if (h[q3][q2]) cy = true; } ok = rx && cy; } }
      if (ok) ok = topsVisible(h, N);
    }
    var key = function (a) { return a.join(""); }, ds = [], seen = {}; seen[key(A)] = 1;
    function addD(a) { if (!seen[key(a)] && a.some(function (v) { return v; })) { seen[key(a)] = 1; ds.push(a); } }
    addD(T(A, function (r, q) { return [r, N - 1 - q]; }));
    var nM = ds.length;
    if (view === "top") addD(T(A, function (r, q) { return [N - 1 - q, r]; })); else addD(T(A, function (r, q) { return [N - 1 - r, q]; }));
    for (var t = 0; t < 60 && ds.length < 4; t++) { var b = A.slice(), i = ri(R, N * N); b[i] = 1 - b[i]; addD(b); }
    var cells = []; for (x = 0; x < N; x++) for (y = 0; y < N; y++) for (var z = 0; z < h[x][y]; z++) cells.push([x, y, z]);
    /* desen izometric cu săgeată spre fața +x (din față-stânga) */
    var W = 260, H = 220, iv = voxFit(cells.concat([]), W, H);
    var arrowNote = view === "top" ? "Privești DE SUS. În variante, latura de JOS a grilei este partea dinspre săgeată." : "Privești DIN DIRECȚIA SĂGEȚII (din față). În variante, sus = sus.";
    var arrow = '<div class="aparrow">' + svg(60, 40, '<path d="M4,4 L46,30" stroke="#dc2626" stroke-width="4"/><path d="M50,33 L36,30 L44,20Z" fill="#dc2626"/>') + "<small>săgeata arată fața din stânga-jos</small></div>";
    var m = mix(R, [[gridView(A, N, 84), key(A)]].concat(ds.slice(0, 4).map(function (a, i) { return [gridView(a, N, 84), key(a), i < nM ? "e imaginea în OGLINDĂ (stânga↔dreapta)" : i === nM && ds.length > nM && a.filter(function (v) { return v; }).length === A.filter(function (v) { return v; }).length ? "e desenul rotit/întors, nu văzut din direcția cerută" : "are un pătrat în plus sau în minus față de corp"]; })));
    return { t: "top", q: view === "top" ? "Cum arată corpul văzut DE SUS? (săgeata arată partea din față)" : "Cum arată corpul văzut DIN DIRECȚIA SĂGEȚII (din față)?", stim: '<div class="aptopw">' + arrow + iv + '</div><p class="small muted">' + arrowNote + "</p>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 3,
      expl: view === "top" ? "De sus vezi fiecare coloană care are cel puțin un cub, oricât de înaltă ar fi. Fața din stânga-jos (spre săgeată) ajunge jos în desen, fața din dreapta-jos ajunge în dreapta. Capcana: varianta oglindită (stânga↔dreapta)." : "Din față vezi, pentru fiecare coloană de la stânga la dreapta, cel mai înalt turn din șirul acela (cuburile din spate se ascund în spatele celor din față). Capcana: varianta oglindită. Truc: din față contează doar CEL MAI ÎNALT turn din fiecare șir – desenezi „silueta”, nu numeri cuburile.",
      chk: { h: h, view: view, N: N } };
  }
  /* ---------- Copierea figurii pe grila de puncte (interactiv) ---------- */
  function genDot(seed, lv) {
    var R = rng(seed), N = 5, len = lv <= 1 ? 3 : lv <= 2 ? 4 : lv <= 3 ? 5 : lv <= 4 ? 6 : 7, diag = lv >= 3, path, tries = 0;
    var D = [[1, 0], [-1, 0], [0, 1], [0, -1]].concat(diag ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : []);
    do { path = [[ri(R, N), ri(R, N)]]; var segs = {}; var okk = true;
      for (var i = 0; i < len; i++) { var c = path[path.length - 1], opts = D.map(function (d) { return [c[0] + d[0], c[1] + d[1]]; }).filter(function (p) { if (p[0] < 0 || p[1] < 0 || p[0] >= N || p[1] >= N) return false; var k = sk(c, p); return !segs[k]; }); if (!opts.length) { okk = false; break; } var p = pick(R, opts); segs[sk(c, p)] = 1; path.push(p); }
    } while ((!okk) && tries++ < 100);
    function sk(a, b) { var A2 = a[0] + "," + a[1], B2 = b[0] + "," + b[1]; return A2 < B2 ? A2 + "|" + B2 : B2 + "|" + A2; }
    var xs = path.map(function (p) { return p[0]; }), ys = path.map(function (p) { return p[1]; }), mnx = Math.min.apply(0, xs), mxx = Math.max.apply(0, xs), mny = Math.min.apply(0, ys), mxy = Math.max.apply(0, ys);
    /* punctul de start pe grila de răspuns: altă poziție, figura încape */
    var st0 = path[0], cand = [];
    for (var dx = -mnx; dx <= N - 1 - mxx; dx++) for (var dy = -mny; dy <= N - 1 - mxy; dy++) if (dx || dy) cand.push([dx, dy]);
    var off = cand.length ? pick(R, cand) : [0, 0];
    var target = {}; for (i = 1; i < path.length; i++) target[sk([path[i - 1][0] + off[0], path[i - 1][1] + off[1]], [path[i][0] + off[0], path[i][1] + off[1]])] = 1;
    var sp = 26, b = "";
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) b += '<circle cx="' + (12 + x * sp) + '" cy="' + (12 + y * sp) + '" r="3" fill="#64748b"/>';
    b += '<polyline points="' + path.map(function (p) { return (12 + p[0] * sp) + "," + (12 + p[1] * sp); }).join(" ") + '" fill="none" stroke="#1d4ed8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="' + (12 + st0[0] * sp) + '" cy="' + (12 + st0[1] * sp) + '" r="6" fill="#dc2626"/>';
    return { t: "dot", interactive: "dot", q: "Copiază figura pe grila de jos, pornind din punctul ROȘU. Atinge punctele unul după altul (linia merge din punct în punct, " + (diag ? "și pe diagonală" : "doar orizontal/vertical") + ").", stim: '<div class="apref"><small>Model</small>' + svg(24 + (N - 1) * sp, 24 + (N - 1) * sp, b) + "</div>",
      dot: { N: N, start: [st0[0] + off[0], st0[1] + off[1]], target: Object.keys(target).sort(), diag: diag }, opts: [], keys: [], ans: -1,
      expl: "Figura are " + len + " segmente. Truc: numără pentru fiecare segment „câte puncte și în ce direcție” (ex.: 2 la dreapta, 1 în jos), pornind din punctul roșu.", chk: { path: path, off: off } };
  }
  function dotCheck(it, segs) { var a = segs.slice().sort(), b = it.dot.target; return a.length === b.length && a.every(function (k, i) { return k === b[i]; }); }
  function dotKey(a, b) { var A2 = a[0] + "," + a[1], B2 = b[0] + "," + b[1]; return A2 < B2 ? A2 + "|" + B2 : B2 + "|" + A2; }
  /* ---------- Silogisme cu cuvinte inventate (verificate cu toate modelele Venn) ---------- */
  var NW = [["FLEEP", "SLOOP", "LOOPI"], ["BRIX", "TOMP", "KADU"], ["ZORF", "MIPA", "GLUN"], ["VASK", "NURO", "PIFT"], ["DREL", "OBAN", "SKEM"], ["TULB", "WEXI", "RANO"]];
  function holds(model, f) { /* model: 8 regiuni (bit0=A,bit1=B,bit2=C) nevide/vide; f: [tip, X, Y] */
    var X = f[1], Y = f[2], ex = function (pred) { for (var r = 0; r < 8; r++) if (model[r] && pred(r)) return true; return false; };
    var inX = function (r) { return (r >> X) & 1; }, inY = function (r) { return (r >> Y) & 1; };
    if (f[0] === "all") return !ex(function (r) { return inX(r) && !inY(r); });
    if (f[0] === "no") return !ex(function (r) { return inX(r) && inY(r); });
    if (f[0] === "some") return ex(function (r) { return inX(r) && inY(r); });
    return ex(function (r) { return inX(r) && !inY(r); }); /* someNot */
  }
  function sylEval(prem, concl) {
    var t = 0, f = 0;
    for (var mask = 0; mask < 256; mask++) { var model = []; for (var r = 0; r < 8; r++) model.push((mask >> r) & 1);
      var ne = [0, 1, 2].every(function (s) { for (var r2 = 0; r2 < 8; r2++) if (model[r2] && ((r2 >> s) & 1)) return true; return false; });
      if (!ne || !prem.every(function (p) { return holds(model, p); })) continue;
      if (holds(model, concl)) t++; else f++; }
    return t && !f ? "A" : f && !t ? "F" : t && f ? "P" : "X";
  }
  function sylTxt(f, W) { var X = W[f[1]], Y = W[f[2]]; return f[0] === "all" ? "Toți " + X + " sunt " + Y : f[0] === "no" ? "Niciun " + X + " nu este " + Y : f[0] === "some" ? "Unii " + X + " sunt " + Y : "Unii " + X + " nu sunt " + Y; }
  function genSyl(seed, lv) {
    var R = rng(seed), W = pick(R, NW), T = ["all", "no", "some", "someNot"], want = pick(R, ["A", "F", "P"]), prem, concl, res, tries = 0;
    do { prem = [[pick(R, lv <= 1 ? ["all", "no"] : T), 0, 1], [pick(R, lv <= 1 ? ["all", "no"] : T), 1, 2]]; if (R() < 0.5) prem[1] = [prem[1][0], 2, 1];
      concl = [pick(R, T), 0, 2]; if (R() < 0.3) concl = [concl[0], 2, 0]; res = sylEval(prem, concl); } while ((res !== want) && tries++ < 300);
    var lab = { A: "Adevărată (sigur)", F: "Falsă (sigur)", P: "Nu se poate ști (parțial adevărată)" };
    var wS = { A: "există un desen care respectă premisele și face concluzia falsă", F: "există un desen care respectă premisele și face concluzia adevărată", P: "toate desenele posibile dau același rezultat, deci se poate ști sigur" };
    var m = mix(R, [[lab[res], res]].concat(["A", "F", "P"].filter(function (k) { return k !== res; }).map(function (k) { return [lab[k], k, wS[k]]; })));
    return { t: "syl", q: "Dacă premisele sunt adevărate, concluzia este…", stim: '<div class="apsyl"><p>1. ' + sylTxt(prem[0], W) + ".</p><p>2. " + sylTxt(prem[1], W) + '.</p><p class="apc">Concluzie: ' + sylTxt(concl, W) + ".</p></div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 1,
      expl: "Cuvintele nu au sens – contează doar forma. Desenează 3 cercuri (" + W.join(", ") + "). " + (res === "A" ? "Orice desen care respectă premisele face concluzia adevărată." : res === "F" ? "Orice desen care respectă premisele face concluzia falsă." : "Se pot face desene care respectă premisele în care concluzia e adevărată, dar și desene în care e falsă – deci nu se poate ști.") + " (Presupunem că există cel puțin un " + W[0] + ", un " + W[1] + " și un " + W[2] + ".)", chk: { prem: prem, concl: concl, res: res } };
  }
  /* ---------- Șir cu doi termeni lipsă (1-7-2-9-3-11-?-?) ---------- */
  function genSer2(seed, lv) {
    var R = rng(seed), k = pick(R, lv <= 2 ? ["int", "int"] : ["int", "intm", "int3"]), s = [], a, b, d1, d2;
    if (k === "int") { a = 1 + ri(R, 6); b = 4 + ri(R, 10); d1 = 1 + ri(R, 3); d2 = 2 + ri(R, 4); for (var i = 0; i < 8; i++) s.push(i % 2 ? b + d2 * (i - 1) / 2 : a + d1 * i / 2); }
    else if (k === "intm") { a = 1 + ri(R, 3); b = 30 + ri(R, 20); d2 = 2 + ri(R, 4); for (i = 0; i < 8; i++) s.push(i % 2 ? b - d2 * (i - 1) / 2 : a * Math.pow(2, i / 2)); }
    else { a = 1 + ri(R, 5); b = 10 + ri(R, 5); var c = 20 + ri(R, 10); d1 = 1 + ri(R, 3); for (i = 0; i < 9; i++) s.push([a, b, c][i % 3] + d1 * Math.floor(i / 3) * (i % 3 + 1)); }
    var x = s[s.length - 2], y = s[s.length - 1], shown = s.slice(0, s.length - 2), key = x + "," + y;
    var cand = [[y, x], [x + 1, y], [x, y + 1], [x - 1, y - 1], [x + 2, y - 2], [x, y - 2]], ds = [], seen = {}; seen[key] = 1;
    shuf(R, cand).forEach(function (p) { var kk = p.join(","); if (!seen[kk] && ds.length < 3) { seen[kk] = 1; ds.push(p); } });
    var m = mix(R, [[x + " , " + y, key]].concat(ds.map(function (p) { return [p[0] + " , " + p[1], p.join(","), p[0] === y && p[1] === x ? "numerele corecte, dar în ordinea inversă" : "nu continuă " + (p[0] !== x && p[1] !== y ? "niciunul din șiruri" : p[0] !== x ? "primul șir" : "al doilea șir") + " corect"]; })));
    return { t: "ser2", q: "Care sunt ultimii doi termeni ai șirului?", stim: '<div class="apser">' + shown.join(" - ") + " - <b>?</b> - <b>?</b></div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 2,
      expl: (k === "int3" ? "Trei șiruri intercalate (din 3 în 3)." : "Două șiruri intercalate: pozițiile 1,3,5… și pozițiile 2,4,6….") + " Continuă fiecare șir separat: urmează " + x + " și " + y + "." + (k === "int3" ? " Truc: împarte șirul în TREI (pozițiile 1,4,7… / 2,5,8… / 3,6,9…) și continuă fiecare separat." : ""), chk: { s: s } };
  }
  /* ---------- Analogii figurale: A e pentru B ce e C pentru ? ---------- */
  function figSvg(f, sz) { /* f: {s formă, fl umplere, n puncte, r rotație 0..3, m oglindă} – formă asimetrică: steag */
    sz = sz || 70; var col = f.fl ? "#0f172a" : "#fff";
    var shapes = ['<path d="M-14,-16 L14,-16 L14,16 L-14,16Z"', '<circle r="16"', '<path d="M0,-18 L17,14 L-17,14Z"', '<path d="M0,-18 L18,0 L0,18 L-18,0Z"'];
    var body = shapes[f.s] + ' fill="' + col + '" stroke="#0f172a" stroke-width="2.5"/>' + '<path d="M0,-18 L0,-30 L12,-26 L0,-22" fill="#dc2626" stroke="#0f172a" stroke-width="1.5"/>';
    for (var i = 0; i < f.n; i++) body += '<circle cx="' + (-10 + i * 10) + '" cy="26" r="3.2" fill="#16a34a"/>';
    return svg(sz, sz, '<g transform="translate(' + sz / 2 + "," + sz / 2 + ") scale(" + f1(sz / 76) + ") rotate(" + f.r * 90 + ")" + (f.m ? " scale(-1,1)" : "") + '">' + body + "</g>");
  }
  function figKey(f) { var r = f.r % 4, m = f.m ? 1 : 0; return [f.s, f.fl, f.n, r, m].join(""); }
  var FT = {
    rot: { d: "se rotește cu 90° în sensul acelor de ceasornic", f: function (x) { return { s: x.s, fl: x.fl, n: x.n, r: (x.r + 1) % 4, m: x.m }; } },
    mir: { d: "se oglindește (stânga ↔ dreapta)", f: function (x) { return { s: x.s, fl: x.fl, n: x.n, r: (4 - x.r) % 4, m: 1 - x.m }; } },
    fill: { d: "își schimbă umplerea (alb ↔ negru)", f: function (x) { return { s: x.s, fl: 1 - x.fl, n: x.n, r: x.r, m: x.m }; } },
    dot: { d: "primește încă un punct verde", f: function (x) { return { s: x.s, fl: x.fl, n: x.n + 1, r: x.r, m: x.m }; } },
    rot2: { d: "se întoarce cu 180°", f: function (x) { return { s: x.s, fl: x.fl, n: x.n, r: (x.r + 2) % 4, m: x.m }; } }
  };
  function genFan(seed, lv) {
    var R = rng(seed), names = Object.keys(FT), k1 = pick(R, names), k2 = lv >= 3 ? pick(R, names.filter(function (k) { return k !== k1 && !(k === "rot2" && k1 === "rot") && !(k === "rot" && k1 === "rot2"); })) : null;
    function T(x) { var y = FT[k1].f(x); return k2 ? FT[k2].f(y) : y; }
    function rf() { return { s: ri(R, 4), fl: ri(R, 2), n: ri(R, 2), r: ri(R, 4), m: 0 }; }
    var A = rf(), C = rf(); while (C.s === A.s) C = rf();
    var B = T(A), D = T(C), ds = [], seen = {}; seen[figKey(D)] = 1;
    function addD(f) { if (f.n > 3) return; var k = figKey(f); if (!seen[k]) { seen[k] = 1; ds.push(f); } }
    var WHY = {}; function addW(f, w) { var k = figKey(f); if (!seen[k]) WHY[k] = w; addD(f); }
    names.forEach(function (k) { addW(FT[k].f(C), "C doar " + FT[k].d + " – nu e schimbarea de la A la B"); if (k2) addW(FT[k].f(FT[k1].f(C)), "prima schimbare e bună, dar a doua e greșită (aici figura " + FT[k].d + ")"); });
    addW(C, "e chiar C, nemodificat"); addW(B, "e B – figura greșită (trebuie pornit de la C)");
    ds = shuf(R, ds).slice(0, 3);
    var m = mix(R, [[figSvg(D), figKey(D)]].concat(ds.map(function (f) { return [figSvg(f), figKey(f), WHY[figKey(f)] || "altă schimbare decât A→B"]; })));
    return { t: "fan", q: "A este pentru B ceea ce este C pentru… ?", stim: '<div class="apfan"><div>' + figSvg(A, 64) + "<small>A</small></div><b>→</b><div>" + figSvg(B, 64) + "<small>B</small></div><b>::</b><div>" + figSvg(C, 64) + "<small>C</small></div><b>→</b><div class=\"apq\">?</div></div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans,
      expl: "De la A la B figura " + FT[k1].d + (k2 ? " și apoi " + FT[k2].d : "") + ". Aplici exact aceeași schimbare lui C. Urmărește steagul roșu: îți arată rotirea și oglindirea.", chk: { k1: k1, k2: k2, C: C, D: D } };
  }
  /* ---------- Pătratul magic (suma 15) ---------- */
  var LOSHU = (function () { var b = [[2, 7, 6], [9, 5, 1], [4, 3, 8]], out = [], g = b; for (var i = 0; i < 4; i++) { g = g[0].map(function (_, c) { return g.map(function (r) { return r[c]; }).reverse(); }); out.push(g); out.push(g.map(function (r) { return r.slice().reverse(); })); } return out; })();
  function genMag(seed, lv) {
    var R = rng(seed), M = pick(R, LOSHU), hide = lv <= 1 ? 1 : lv <= 3 ? 3 : 5, cells, ask, tries = 0;
    do { cells = shuf(R, [0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, hide); ask = cells[0];
      var matches = LOSHU.filter(function (S) { for (var i = 0; i < 9; i++) if (cells.indexOf(i) < 0 && S[Math.floor(i / 3)][i % 3] !== M[Math.floor(i / 3)][i % 3]) return false; return true; });
      var vals = matches.map(function (S) { return S[Math.floor(ask / 3)][ask % 3]; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    } while (vals.length !== 1 && tries++ < 100);
    var ans = M[Math.floor(ask / 3)][ask % 3], b = "";
    for (var i = 0; i < 9; i++) { var x = (i % 3) * 52, y = Math.floor(i / 3) * 52; b += '<rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="50" height="50" fill="' + (i === ask ? "#fef3c7" : "#fff") + '" stroke="#0f172a" stroke-width="2"/>' + '<text x="' + (x + 26) + '" y="' + (y + 34) + '" font-size="22" font-weight="700" text-anchor="middle" fill="#0f172a">' + (i === ask ? "?" : cells.indexOf(i) >= 0 ? "" : M[Math.floor(i / 3)][i % 3]) + "</text>"; }
    var cand = shuf(R, [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (v) { return v !== ans; })).slice(0, 3);
    var m = mix(R, [[String(ans), String(ans)]].concat(cand.map(function (v) { return [String(v), String(v)]; })));
    return { t: "mag", q: "Pătrat magic cu cifrele 1–9 (fiecare o singură dată): suma pe fiecare rând, coloană și diagonală este 15. Ce cifră vine în căsuța cu „?”" + (hide > 1 ? " (căsuțele goale ascund alte cifre)" : "") + "?", stim: svg(158, 158, b), opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 4,
      expl: "Pătratul complet: " + M.map(function (r) { return r.join(" "); }).join(" / ") + ". Reguli utile: în centru e mereu 5, în colțuri sunt cifrele pare (2, 4, 6, 8), iar perechile opuse față de centru dau 10.", chk: { M: M, cells: cells, ask: ask, ans: ans } };
  }
  /* ---------- Verbal: intrusul, analogii, anagrame (liste verificate) ---------- */
  var CAT = {
    "fructe": ["măr", "pară", "prună", "cireașă", "piersică", "caisă", "gutuie", "banană", "portocală", "lămâie"],
    "legume": ["morcov", "cartof", "ceapă", "varză", "castravete", "ardei", "dovlecel", "usturoi", "ridiche"],
    "mobilă": ["masă", "scaun", "dulap", "pat", "canapea", "fotoliu", "comodă", "taburet"],
    "instrumente muzicale": ["vioară", "pian", "chitară", "flaut", "trompetă", "tobă", "acordeon", "saxofon"],
    "unelte": ["ciocan", "clește", "șurubelniță", "fierăstrău", "daltă", "lopată", "sapă", "pilă"],
    "păsări": ["vrabie", "cioară", "barză", "rândunică", "vultur", "bufniță", "pițigoi", "cocor"],
    "pești": ["crap", "știucă", "păstrăv", "șalău", "biban", "plătică", "hering", "ton"],
    "metale": ["fier", "cupru", "aluminiu", "aur", "argint", "plumb", "zinc", "nichel"],
    "mijloace de transport": ["autobuz", "tren", "tramvai", "avion", "vapor", "bicicletă", "camion", "elicopter"],
    "unități de măsură": ["metru", "kilogram", "litru", "secundă", "amper", "volt", "watt", "ohm"]
  };
  function genOdd(seed, lv) {
    var R = rng(seed), ks = Object.keys(CAT), a = pick(R, ks), b = pick(R, ks.filter(function (k) { return k !== a; }));
    var four = shuf(R, CAT[a]).slice(0, lv <= 2 ? 3 : 4), odd = pick(R, CAT[b]);
    var list = [[odd, odd]].concat(four.map(function (w) { return [w, w, "„" + w + "” face parte tot din categoria „" + a + "”, ca majoritatea"]; })), m = mix(R, list);
    return { t: "odd", q: "Care cuvânt NU se potrivește cu celelalte?", stim: "", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 1, expl: "„" + odd + "” face parte din categoria „" + b + "”; toate celelalte sunt din categoria „" + a + "”.", chk: { a: a, b: b, odd: odd } };
  }
  var REL = [
    ["opuse", [["podea", "tavan"], ["zi", "noapte"], ["cald", "rece"], ["sus", "jos"], ["început", "sfârșit"], ["intrare", "ieșire"], ["alb", "negru"], ["plin", "gol"], ["pământ", "cer"], ["iarnă", "vară"], ["urcare", "coborâre"], ["prieten", "dușman"]]],
    ["parte – întreg", [["deget", "mână"], ["roată", "mașină"], ["pagină", "carte"], ["frunză", "copac"], ["cameră", "casă"], ["tastă", "tastatură"], ["petală", "floare"], ["vagon", "tren"], ["soldat", "pluton"], ["cărămidă", "zid"]]],
    ["meserie – unealtă", [["pictor", "pensulă"], ["croitor", "ac"], ["tâmplar", "rindea"], ["chirurg", "bisturiu"], ["pescar", "undiță"], ["fotograf", "aparat foto"], ["zidar", "mistrie"], ["electrician", "multimetru"]]],
    ["animal – pui", [["vacă", "vițel"], ["oaie", "miel"], ["cal", "mânz"], ["câine", "cățel"], ["capră", "ied"], ["porc", "purcel"], ["pisică", "pisoi"], ["urs", "ursuleț"]]],
    ["țară – capitală", [["Franța", "Paris"], ["Italia", "Roma"], ["Spania", "Madrid"], ["Germania", "Berlin"], ["Austria", "Viena"], ["Grecia", "Atena"], ["Bulgaria", "Sofia"], ["Ungaria", "Budapesta"], ["Polonia", "Varșovia"], ["Portugalia", "Lisabona"]]]
  ];
  function genWan(seed, lv) {
    var R = rng(seed), g = pick(R, REL), pr = shuf(R, g[1]), p1 = pr[0], p2 = pr[1];
    var ds = shuf(R, pr.slice(2).map(function (p) { return p[1]; })).slice(0, 2);
    var other = pick(R, REL.filter(function (x) { return x !== g; })), dd = pick(R, other[1]);
    ds.push(lv >= 3 ? p2[0] === dd[0] ? dd[1] : dd[1] : p1[1]);
    if (ds.indexOf(p1[1]) < 0 && lv < 3) ds[2] = p1[1];
    var seen = {}; seen[p2[1]] = 1; ds = ds.filter(function (w) { if (seen[w]) return false; seen[w] = 1; return true; });
    while (ds.length < 3) { var w = pick(R, pick(R, REL)[1])[1]; if (!seen[w]) { seen[w] = 1; ds.push(w); } }
    var m = mix(R, [[p2[1], p2[1]]].concat(ds.map(function (w) { return [w, w, "între „" + p2[0] + "” și „" + w + "” nu e relația „" + g[0] + "”"]; })));
    return { t: "wan", q: "Completează analogia:", stim: '<div class="apser">' + p1[0] + " : " + p1[1] + " = " + p2[0] + " : <b>?</b></div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 2,
      expl: "Relația este „" + g[0] + "”: " + p1[0] + " → " + p1[1] + ", la fel " + p2[0] + " → " + p2[1] + ". Spune relația cu voce tare, ca propoziție, folosind prima pereche („" + p1[0] + " → " + p1[1] + "”), apoi verifică aceeași propoziție pe a doua pereche.", chk: { rel: g[0], p1: p1, p2: p2 } };
  }
  var ANW = { "oraș din România": ["CLUJ", "ARAD", "ORADEA", "SIBIU", "CRAIOVA", "SUCEAVA", "TULCEA", "DEVA", "SLOBOZIA", "VASLUI", "GIURGIU", "TURDA", "LUGOJ", "MANGALIA", "ALEXANDRIA"], "capitală europeană": ["PARIS", "ROMA", "LONDRA", "MADRID", "VIENA", "BERLIN", "PRAGA", "SOFIA", "ATENA", "LISABONA", "OSLO", "DUBLIN", "BERNA", "RIGA"], "țară": ["ITALIA", "SPANIA", "GRECIA", "POLONIA", "OLANDA", "BELGIA", "SUEDIA", "NORVEGIA", "SERBIA", "BULGARIA", "UCRAINA", "CANADA", "EGIPT", "CHINA", "INDIA", "JAPONIA", "MAROC", "PERU"] };
  function srt(w) { return w.split("").sort().join(""); }
  function genAna(seed, lv) {
    var R = rng(seed), cat = pick(R, Object.keys(ANW)), pool = ANW[cat].filter(function (w) { return w.length >= (lv <= 2 ? 4 : 6); }), w = pick(R, pool.length ? pool : ANW[cat]), sc = w, t = 0;
    while ((sc === w || ANW[cat].some(function (x) { return x === sc; })) && t++ < 50) sc = shuf(R, w.split("")).join("");
    var ds = shuf(R, ANW[cat].filter(function (x) { return x !== w && srt(x) !== srt(w) && Math.abs(x.length - w.length) <= 2; })).slice(0, 3);
    var m = mix(R, [[w, w]].concat(ds.map(function (x) { return [x, x, "are alte litere decât " + sc.replace(/ /g, "") + (x.length !== w.length ? " (și " + x.length + " litere în loc de " + w.length + ")" : "")]; })));
    return { t: "ana", q: "Literele amestecate formează " + ({ "oraș din România": "numele unui oraș din România", "capitală europeană": "numele unei capitale europene", "țară": "numele unei țări" }[cat] || cat) + ". Care?", stim: '<div class="apser">' + sc.split("").join(" ") + "</div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 2, expl: sc + " → " + w + ". Truc: numără literele (" + w.length + ") și caută vocalele și literele rare; variantele greșite au alte litere.", chk: { w: w, sc: sc } };
  }
  /* ---------- Probleme cu „capcană” ---------- */
  function genPb(seed, lv) {
    var R = rng(seed), k = pick(R, ["rank", "posts", "saw", "pages"]), q, ans, ex;
    if (k === "rank") { var a = 5 + ri(R, 30), b = 5 + ri(R, 30); ans = a + b - 1; q = "Andrei este al " + a + "-lea cel mai bun și, în același timp, al " + b + "-lea cel mai slab elev din clasă. Câți elevi sunt în clasă?"; ex = a + " + " + b + " − 1 = " + ans + " (Andrei a fost numărat de două ori)"; }
    else if (k === "posts") { var d = pick(R, [2, 3, 4, 5, 10]), n = 3 + ri(R, 12); ans = n + 1; q = "Pe o latură de gard lungă de " + d * n + " m se pun stâlpi la fiecare " + d + " m, inclusiv la ambele capete. Câți stâlpi sunt?"; ex = d * n + " : " + d + " = " + n + " intervale, deci " + n + " + 1 = " + ans + " stâlpi"; }
    else if (k === "saw") { var p = 3 + ri(R, 8), mm = 2 + ri(R, 6); ans = (p - 1) * mm; q = "Ca să tai un buștean în " + p + " bucăți, fiecare tăietură durează " + mm + " minute. Cât durează în total?"; ex = p + " bucăți înseamnă " + (p - 1) + " tăieturi; " + (p - 1) + " × " + mm + " = " + ans + " minute"; }
    else { var s = 10 + ri(R, 50), e = s + 10 + ri(R, 60); ans = e - s + 1; q = "Citești o carte de la pagina " + s + " până la pagina " + e + ", inclusiv. Câte pagini ai citit?"; ex = e + " − " + s + " + 1 = " + ans; }
    var cand = [ans - 1, ans + 1, ans - 2, ans + 2].filter(function (v) { return v > 0; }), ds = shuf(R, cand).slice(0, 3);
    var m = mix(R, [[String(ans), String(ans)]].concat(ds.map(function (v) { return [String(v), String(v)]; })));
    return { t: "pb", q: q, stim: "", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 4, expl: ex + ". Capcana: „±1” – intervale vs. capete.", chk: { ans: ans, k: k } };
  }

  /* ================= tipuri suplimentare (2) ================= */
  function numOpts(R, ans, cand, fmt) { fmt = fmt || String; var ds = [], seen = {}; seen[ans] = 1; shuf(R, cand).forEach(function (v) { if (!seen[v] && ds.length < 3 && v >= 0) { seen[v] = 1; ds.push(v); } }); var k = 1; while (ds.length < 3) { if (!seen[ans + k]) { seen[ans + k] = 1; ds.push(ans + k); } k++; } return mix(R, [[fmt(ans), String(ans)]].concat(ds.map(function (v) { return [fmt(v), String(v)]; }))); }
  /* ---------- Plierea și perforarea hârtiei ---------- */
  var FOLDS = { L: "stânga peste dreapta", Rt: "dreapta peste stânga", T: "sus peste jos", B: "jos peste sus" };
  function unfold(holes, f) { /* întoarce găurile după desfacerea pliului f (grilă 4×4, [r,c]) */ var o = holes.slice(); holes.forEach(function (h) { o.push(f === "L" || f === "Rt" ? [h[0], 3 - h[1]] : [3 - h[0], h[1]]); }); return o; }
  function inRegion(h, folds) { /* după pliuri, hârtia ocupă regiunea rămasă */ return folds.every(function (f) { return f === "L" ? h[1] >= 2 : f === "Rt" ? h[1] <= 1 : f === "T" ? h[0] >= 2 : h[0] <= 1; }); }
  function paperSvg(holes, sz, region, foldMark) {
    var c = sz / 4, b = '<rect x="1" y="1" width="' + (sz - 2) + '" height="' + (sz - 2) + '" fill="#fff" stroke="#0f172a" stroke-width="2"/>';
    if (region) { [0, 1, 2, 3].forEach(function (r) { [0, 1, 2, 3].forEach(function (q) { if (!region([r, q])) b += '<rect x="' + (q * c + 1) + '" y="' + (r * c + 1) + '" width="' + c + '" height="' + c + '" fill="#e2e8f0"/>'; }); }); }
    if (foldMark) b += foldMark;
    holes.forEach(function (h) { b += '<circle cx="' + f1(h[1] * c + c / 2) + '" cy="' + f1(h[0] * c + c / 2) + '" r="' + f1(c * 0.22) + '" fill="#0f172a"/>'; });
    return svg(sz, sz, b);
  }
  function genFold(seed, lv) {
    var R = rng(seed), n = lv <= 2 ? 1 : 2, folds = [pick(R, ["L", "Rt", "T", "B"])];
    if (n === 2) folds.push(pick(R, folds[0] === "L" || folds[0] === "Rt" ? ["T", "B"] : ["L", "Rt"]));
    var cells = []; [0, 1, 2, 3].forEach(function (r) { [0, 1, 2, 3].forEach(function (q) { if (inRegion([r, q], folds)) cells.push([r, q]); }); });
    var np = lv >= 4 ? 2 : 1, punch = shuf(R, cells).slice(0, np), holes = punch.slice();
    for (var i = folds.length - 1; i >= 0; i--) holes = unfold(holes, folds[i]);
    var key = function (hs) { return hs.map(function (h) { return h.join(""); }).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort().join(","); };
    var ds = [], seen = {}; seen[key(holes)] = 1;
    function addD(hs, w) { var k = key(hs); if (!seen[k] && hs.length) { seen[k] = 1; ds.push([hs, w]); } }
    addD(punch, "e doar gaura dată, fără să desfaci hârtia (lipsesc găurile din oglindă)");
    var wrongAxis = punch.slice(); folds.slice().reverse().forEach(function (f) { wrongAxis = unfold(wrongAxis, f === "L" || f === "Rt" ? "T" : "L"); }); addD(wrongAxis, "găurile sunt oglindite față de linia greșită (pliul era pe cealaltă axă)");
    if (n === 2) { var one = punch.slice(); one = unfold(one, folds[1]); addD(one, "ai desfăcut doar un pliu – mai trebuie desfăcut și primul"); }
    var shifted = holes.map(function (h) { return [h[0], (h[1] + 1) % 4]; }); addD(shifted, "găurile sunt mutate cu o coloană – oglindirea se face exact față de linia pliului");
    var extra = holes.concat([[3 - holes[0][0], 3 - holes[0][1]]]); addD(extra, "are o gaură în plus (oglindire pe diagonală, care nu există aici)");
    var fs = 70, steps = folds.map(function (f, i) { var done = folds.slice(0, i); var line = f === "L" || f === "Rt" ? '<line x1="35" y1="0" x2="35" y2="70" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 3"/>' : '<line x1="0" y1="35" x2="70" y2="35" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 3"/>'; var arr = { L: '<path d="M12,35 Q35,12 56,35" fill="none" stroke="#dc2626" stroke-width="2"/><path d="M56,35 l-7,-2 l3,-6z" fill="#dc2626"/>', Rt: '<path d="M58,35 Q35,12 14,35" fill="none" stroke="#dc2626" stroke-width="2"/><path d="M14,35 l7,-2 l-3,-6z" fill="#dc2626"/>', T: '<path d="M35,12 Q58,35 35,58" fill="none" stroke="#dc2626" stroke-width="2"/><path d="M35,58 l-2,-7 l-6,3z" fill="#dc2626"/>', B: '<path d="M35,58 Q58,35 35,12" fill="none" stroke="#dc2626" stroke-width="2"/><path d="M35,12 l-2,7 l-6,-3z" fill="#dc2626"/>' }[f]; return '<div><small>' + (i + 1) + ". " + FOLDS[f] + "</small>" + paperSvg([], fs, function (h) { return inRegion(h, done); }, line + arr) + "</div>"; }).join("");
    steps += '<div><small>' + (folds.length + 1) + ". perforezi</small>" + paperSvg(punch, fs, function (h) { return inRegion(h, folds); }) + "</div>";
    var m = mix(R, [[paperSvg(holes, 84), key(holes)]].concat(shuf(R, ds).slice(0, 3).map(function (d) { return [paperSvg(d[0], 84), key(d[0]), d[1]]; })));
    return { t: "fold", q: "Hârtia pătrată se pliază și se perforează ca în pași. Cum arată după ce o desfaci complet?", stim: '<div class="apsteps">' + steps + "</div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans,
      expl: "Regula: fiecare pliu e o OGLINDĂ. Desfaci pliurile în ordine inversă (ultimul primul) și, la fiecare, copiezi toate găurile simetric față de linia pliului. " + np + (np === 1 ? " gaură perforată" : " găuri perforate") + ", dublate la fiecare din cele " + folds.length + (folds.length === 1 ? " pliu" : " pliuri") + " (" + np + " × " + Math.pow(2, folds.length) + ") = " + holes.length + " găuri la final. Truc: numărul de găuri se dublează la fiecare pliu – elimină întâi variantele cu alt număr de găuri.", chk: { folds: folds, punch: punch, holes: holes } };
  }
  /* ---------- Raționament mecanic: roți dințate, pârghii, scripeți ---------- */
  function gearSvg(ts, hl) { var x = 10, b = "", y = 60; ts.forEach(function (t, i) { var r = 8 + t * 0.9; x += r; var g = '<g transform="translate(' + f1(x) + "," + y + ')"><circle r="' + f1(r) + '" fill="' + (i === 0 || i === ts.length - 1 ? "#dbeafe" : "#f1f5f9") + '" stroke="#0f172a" stroke-width="2"/>'; for (var k = 0; k < 12; k++) g += '<rect x="-2" y="' + f1(-r - 4) + '" width="4" height="5" fill="#0f172a" transform="rotate(' + k * 30 + ')"/>'; g += '<text y="4" font-size="11" text-anchor="middle" font-weight="700">' + String.fromCharCode(65 + i) + "</text>" + (hl ? '<text y="' + f1(r + 16) + '" font-size="9" text-anchor="middle">' + t + " dinți</text>" : "") + "</g>"; b += g; x += r + 4; }); return svg(Math.max(200, Math.ceil(x + 10)), 125, b); }
  function genMech(seed, lv) {
    var R = rng(seed), k = pick(R, lv <= 1 ? ["dir", "lever"] : lv <= 3 ? ["dir", "ratio", "lever", "pulley"] : ["dir", "ratio", "idler", "lever", "pulley"]);
    if (k === "dir") { var n = 2 + ri(R, lv <= 2 ? 3 : 5), ts = []; for (var i = 0; i < n; i++) ts.push(pick(R, [10, 14, 18, 22])); var cw = R() < 0.5, last = (n % 2 === 1) === cw;
      var lab = function (c) { return c ? "în sensul acelor de ceasornic ↻" : "invers acelor de ceasornic ↺"; };
      var m = mix(R, [[lab(last), String(last)], [lab(!last), String(!last), "roțile vecine se învârt mereu în sens OPUS; cu " + n + " roți, ultima e pe poziție " + (n % 2 ? "impară → același sens cu prima" : "pară → sens opus primei")], ["nu se mișcă (se blochează)", "lock", "roțile puse în linie nu se blochează; doar 3 roți care se ating toate între ele (în triunghi) s-ar bloca"]]);
      return { t: "mech", q: "Roata A se învârte " + lab(cw) + ". Cum se învârte ultima roată (" + String.fromCharCode(64 + n) + ")?", stim: gearSvg(ts), opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 1, expl: "Regula: două roți dințate care se ating se învârt în sensuri opuse. Numără: A, B, C… – pozițiile impare (A, C, E) au același sens cu A, cele pare (B, D) sensul opus. " + String.fromCharCode(64 + n) + " e pe poziția " + n + ". Truc: mărimea roților NU schimbă sensul, doar viteza.", chk: { k: k, n: n, cw: cw, last: last } }; }
    if (k === "ratio" || k === "idler") { var ta = pick(R, [10, 12, 15, 20, 24]), tb = pick(R, [20, 30, 36, 40, 48, 60].filter(function (v) { return v !== ta; })), turns = pick(R, [2, 3, 4, 6, 8, 10, 12]); var ans = ta * turns / tb; if (ans % 1) return genMech(seed + 17, lv);
      var ts2 = k === "idler" ? [ta, pick(R, [16, 25, 50]), tb] : [ta, tb];
      var m2 = numOpts(R, ans, [turns, turns * tb / ta, ans * 2, ans + 1, Math.max(1, ans - 1)].filter(function (v) { return v % 1 === 0; }));
      m2.why = m2.opts.map(function (o, i) { if (i === m2.ans) return ""; var v = +o; return v === turns ? "ai presupus că face tot atâtea ture ca A – dar are alt număr de dinți" : v === turns * tb / ta ? "ai împărțit invers: roata MARE face MAI PUȚINE ture" : "calcul greșit: dinți trecuți = " + ta + " × " + turns + " = " + ta * turns + ", împărțit la " + tb; });
      return { t: "mech", q: "Roata A are " + ta + " dinți și face " + turns + " ture. Câte ture face roata " + (k === "idler" ? "C (ultima)" : "B") + " cu " + tb + " dinți?", stim: gearSvg(ts2, true), opts: m2.opts, keys: m2.keys, why: m2.why, ans: m2.ans, cols: 4,
        expl: "Regula: dinții care trec prin punctul de contact sunt aceiași pentru ambele roți. A trece " + ta + " × " + turns + " = " + ta * turns + " dinți; " + ta * turns + " : " + tb + " = " + ans + " ture." + (k === "idler" ? " Roata din mijloc (intermediară) NU contează pentru număr – ea schimbă doar sensul de rotație (capcana „idler”)." : "") + " Truc: roata mai mare se învârte mai încet.", chk: { k: k, ta: ta, tb: tb, turns: turns, ans: ans } }; }
    if (k === "lever") { var F1 = pick(R, [20, 30, 40, 50, 60, 80, 100]), d1 = pick(R, [1, 2, 3, 4]), d2 = pick(R, [1, 2, 3, 4, 5, 6].filter(function (v) { return v !== d1; })), F2 = F1 * d1 / d2; if (F2 % 1) return genMech(seed + 23, lv);
      var b = '<line x1="10" y1="60" x2="250" y2="60" stroke="#0f172a" stroke-width="5"/>', piv = 10 + 240 * d1 / (d1 + d2);
      b += '<path d="M' + f1(piv) + ',62 l-12,22 h24z" fill="#64748b"/><rect x="12" y="34" width="26" height="24" fill="#93c5fd" stroke="#0f172a"/><text x="25" y="50" font-size="10" text-anchor="middle">' + F1 + 'N</text><path d="M245,20 v32" stroke="#dc2626" stroke-width="3"/><path d="M245,56 l-5,-9 h10z" fill="#dc2626"/><text x="232" y="16" font-size="11">F = ?</text><text x="' + f1((10 + piv) / 2) + '" y="100" font-size="11" text-anchor="middle">' + d1 + ' m</text><text x="' + f1((piv + 250) / 2) + '" y="100" font-size="11" text-anchor="middle">' + d2 + " m</text>";
      var m3 = numOpts(R, F2, [F1, F1 * d2 / d1, F2 * 2, F2 + 10].filter(function (v) { return v % 1 === 0; }), function (v) { return v + " N"; });
      m3.why = m3.opts.map(function (o, i) { if (i === m3.ans) return ""; var v = parseFloat(o); return v === F1 ? "ar fi corect doar dacă brațele ar fi egale" : v === F1 * d2 / d1 ? "ai inversat brațele: brațul mai LUNG are nevoie de forță mai MICĂ" : "nu respectă F1·d1 = F2·d2 (" + F1 + "·" + d1 + " = " + F1 * d1 + ")"; });
      return { t: "mech", q: "Pârghia e în echilibru. Ce forță F trebuie apăsată la capătul din dreapta?", stim: svg(260, 110, b), opts: m3.opts, keys: m3.keys, why: m3.why, ans: m3.ans, cols: 4,
        expl: "Regula pârghiei: forța × brațul ei este la fel de ambele părți: " + F1 + " N × " + d1 + " m = F × " + d2 + " m → F = " + F1 * d1 + " : " + d2 + " = " + F2 + " N. Truc: brațul de 2 ori mai lung → forța de 2 ori mai mică.", chk: { k: k, F1: F1, d1: d1, d2: d2, F2: F2 } }; }
    var G = pick(R, [120, 240, 360, 480, 600]), nr = pick(R, [1, 2, 3, 4]), F = G / nr; if (F % 1) return genMech(seed + 29, lv);
    var pb = '<line x1="20" y1="8" x2="240" y2="8" stroke="#0f172a" stroke-width="4"/>'; for (var j = 0; j < nr; j++) pb += '<line x1="' + (70 + j * 30) + '" y1="8" x2="' + (70 + j * 30) + '" y2="70" stroke="#a16207" stroke-width="2.5"/>';
    pb += '<rect x="' + (60 + 0) + '" y="70" width="' + (nr * 30) + '" height="14" rx="4" fill="#94a3b8" stroke="#0f172a"/><rect x="' + (65 + nr * 15 - 25) + '" y="92" width="40" height="26" fill="#475569"/><text x="' + (65 + nr * 15 - 5) + '" y="110" fill="#fff" font-size="11" text-anchor="middle">' + G + 'N</text><line x1="' + (70 + nr * 30) + '" y1="70" x2="' + (90 + nr * 30) + '" y2="8" stroke="#dc2626" stroke-width="2"/><text x="' + (95 + nr * 30) + '" y="40" font-size="11" fill="#dc2626">trag → F?</text>';
    var m4 = numOpts(R, F, [G, G / (nr + 1), F * 2, G / Math.max(1, nr - 1)].filter(function (v) { return v % 1 === 0 && v !== F; }), function (v) { return v + " N"; });
    m4.why = m4.opts.map(function (o, i) { if (i === m4.ans) return ""; var v = parseFloat(o); return v === G ? "ar fi corect fără scripete mobil; aici greutatea e împărțită pe " + nr + " fire" : "ai numărat greșit firele care țin greutatea (sunt " + nr + ")"; });
    return { t: "mech", q: "Greutatea de " + G + " N atârnă de un sistem de scripeți susținut de " + nr + " fire (maro). Ce forță F trebuie (fără frecare)?", stim: svg(300, 125, pb), opts: m4.opts, keys: m4.keys, why: m4.why, ans: m4.ans, cols: 4,
      expl: "Regula scripeților: greutatea se împarte la numărul de fire care țin blocul mobil: " + G + " : " + nr + " = " + F + " N. Truc: câștigi la forță, dar tragi de " + nr + " ori mai multă sfoară.", chk: { k: "pulley", G: G, nr: nr, F: F } };
  }
  /* ---------- Atenție distributivă (tip Praga): tabel 10×10 numere mari și mici ---------- */
  function genPraga(seed, lv) {
    var R = rng(seed), nums = shuf(R, Array.apply(null, Array(100)).map(function (_, i) { return i + 1; })), big = nums.map(function () { return R() < 0.5; });
    var i = ri(R, 90), N = nums[i], kind = lv <= 2 ? "below" : pick(R, ["below", "size", "right"]);
    if (kind === "right" && i % 10 === 9) kind = "below";
    var b = ""; nums.forEach(function (v, j) { b += '<text x="' + ((j % 10) * 36 + 18) + '" y="' + (Math.floor(j / 10) * 30 + 21) + '" font-size="' + (big[j] ? 17 : 11) + '" font-weight="' + (big[j] ? 700 : 400) + '" text-anchor="middle" fill="#0f172a">' + v + "</text>"; });
    var grid = svg(360, 300, '<rect width="360" height="300" fill="#fff" stroke="#cbd5e1"/>' + b, "apsv apgrid");
    var m, q, ex;
    if (kind === "size") { var lab = big[i] ? "MARE" : "mic"; m = mix(R, [[lab, lab], [big[i] ? "mic" : "MARE", big[i] ? "mic" : "MARE", "uită-te din nou: numărul " + N + " este scris " + lab]]); q = "Găsește numărul " + N + ". Este scris cu cifre mari sau mici?"; ex = "Numărul " + N + " e pe rândul " + (Math.floor(i / 10) + 1) + ", coloana " + (i % 10 + 1) + ", scris " + lab + "."; }
    else { var j2 = kind === "below" ? i + 10 : i + 1, ans = nums[j2]; m = numOpts(R, ans, [nums[i - 10] || nums[i + 2], nums[i + 1], nums[i - 1] || nums[i + 11], nums[i + 9], nums[i + 11]].filter(function (v) { return v; })); m.why = m.opts.map(function (o, k2) { if (k2 === m.ans) return ""; var p = nums.indexOf(+o); return "„" + o + "” e pe rândul " + (Math.floor(p / 10) + 1) + ", coloana " + (p % 10 + 1) + " – nu e celula cerută"; }); q = "Găsește numărul " + N + ". Ce număr este " + (kind === "below" ? "imediat SUB el" : "imediat în DREAPTA lui") + "?"; ex = N + " e pe rândul " + (Math.floor(i / 10) + 1) + ", coloana " + (i % 10 + 1) + "; " + (kind === "below" ? "dedesubt" : "în dreapta") + " este " + ans + "."; }
    return { t: "praga", q: q, stim: grid, opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: kind === "size" ? 2 : 4, expl: ex + " Metodă: caută numărul pe rânduri, în zig-zag, și ține minte doar primele cifre (ex. „4…” pentru 47). Truc: nu te lăsa distras de mărimea scrisului – mărimea contează doar când ești întrebat de ea.", chk: { nums: nums, big: big, i: i, kind: kind } };
  }
  /* ---------- Kraepelin (variantă item) ---------- */
  function kraeRes(a, b) { return a <= b ? a + b : a - b; }
  function genKrae(seed, lv) {
    var R = rng(seed), L = 4 + lv, d = []; for (var i = 0; i < L; i++) d.push(1 + ri(R, 9));
    var p = ri(R, L - 1), a = d[p], b = d[p + 1], ans = kraeRes(a, b);
    var m = numOpts(R, ans, [a + b, Math.abs(a - b), a * b, ans + 1, ans - 1]);
    m.why = m.opts.map(function (o, k) { if (k === m.ans) return ""; var v = +o; return v === a + b && a > b ? a + " > " + b + ", deci se SCADE, nu se adună" : v === Math.abs(a - b) && a <= b ? a + " ≤ " + b + ", deci se ADUNĂ, nu se scade" : "calcul greșit pentru perechea " + a + " și " + b; });
    return { t: "krae", q: "Regula Kraepelin: dacă prima cifră e MAI MICĂ sau EGALĂ cu a doua, le ADUNI; dacă e mai mare, o SCAZI pe a doua din prima. Ce rezultat dă perechea marcată?", stim: '<div class="apser">' + d.map(function (x, k) { return k === p || k === p + 1 ? "<b class=\"aphl\">" + x + "</b>" : x; }).join(" ") + "</div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 4,
      expl: a + (a <= b ? " ≤ " : " > ") + b + " → " + (a <= b ? a + " + " + b : a + " − " + b) + " = " + ans + ". Truc: întâi compari (mic→mare = adun), abia apoi calculezi.", chk: { a: a, b: b, ans: ans } };
  }
  /* ---------- Codare: literă → cifră ---------- */
  function genCode(seed, lv) {
    var R = rng(seed), L = shuf(R, "ABCDEFGHKLMNPRST".split("")).slice(0, lv <= 2 ? 6 : 8), D = shuf(R, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, L.length), map = {}; L.forEach(function (l, i) { map[l] = D[i]; });
    var key = '<div class="apkey">' + L.map(function (l) { return "<span><b>" + l + "</b>" + map[l] + "</span>"; }).join("") + "</div>";
    if (lv >= 3 && R() < 0.5) { var a = pick(R, L), b = pick(R, L), c = pick(R, L); var ans = map[a] + map[b] * map[c];
      var m = numOpts(R, ans, [(map[a] + map[b]) * map[c], map[a] * map[b] + map[c], ans + 1, ans - 1]);
      m.why = m.opts.map(function (o, k) { if (k === m.ans) return ""; return +o === (map[a] + map[b]) * map[c] ? "ai adunat întâi – înmulțirea se face înaintea adunării" : "valorile literelor sau calculul nu se potrivesc cu cheia"; });
      return { t: "code", q: "Folosind cheia, calculează: " + a + " + " + b + " × " + c, stim: key, opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 4, expl: a + " = " + map[a] + ", " + b + " = " + map[b] + ", " + c + " = " + map[c] + "; întâi înmulțirea: " + map[b] + " × " + map[c] + " = " + map[b] * map[c] + ", apoi + " + map[a] + " = " + ans + ". Truc: scrie cifrele sub litere înainte să calculezi.", chk: { map: map, expr: [a, b, c], ans: ans } }; }
    var w = []; for (var i = 0; i < (lv <= 2 ? 4 : 5); i++) w.push(pick(R, L)); var code = w.map(function (l) { return map[l]; }).join("");
    var ds = [], seen = {}, wy = {}; seen[code] = 1;
    for (var t = 0; t < 60 && ds.length < 3; t++) { var c2 = code.split(""); if (R() < 0.5) { var j = ri(R, c2.length - 1), x = c2[j]; c2[j] = c2[j + 1]; c2[j + 1] = x; } else { var j2 = ri(R, c2.length); c2[j2] = String(pick(R, D)); } var s2 = c2.join(""); if (!seen[s2]) { seen[s2] = 1; ds.push(s2); var dif = []; for (var q = 0; q < s2.length; q++) if (s2[q] !== code[q]) dif.push(q + 1); wy[s2] = "greșit la poziția " + dif.join(" și ") + " (" + dif.map(function (q2) { return w[q2 - 1] + " = " + map[w[q2 - 1]]; }).join(", ") + ")"; } }
    var m2 = mix(R, [[code, code]].concat(ds.map(function (s3) { return [s3, s3, wy[s3]]; })));
    return { t: "code", q: "Folosind cheia, cum se scrie codul pentru „" + w.join("") + "”?", stim: key, opts: m2.opts, keys: m2.keys, why: m2.why, ans: m2.ans, cols: 2, expl: w.map(function (l) { return l + "=" + map[l]; }).join(", ") + " → " + code + ". Truc: verifică întâi prima și ultima cifră – elimini repede 2 variante.", chk: { map: map, w: w, code: code } };
  }
  /* ---------- Memorie (2): text instrucțiuni, listă de cuvinte, grilă de pictograme ---------- */
  var ICO = ["⭐", "🔑", "📞", "🚗", "🌙", "⚓", "🔔", "✈️", "🍎", "🎈", "🔒", "⚡"];
  var WL = { "unelte": ["ciocan", "clește", "daltă", "pilă", "sapă", "lopată", "rindea", "menghină"], "animale": ["lup", "vulpe", "urs", "cerb", "iepure", "bursuc", "jder", "râs"], "orașe": ["Arad", "Cluj", "Deva", "Sibiu", "Turda", "Lugoj", "Tulcea", "Vaslui"], "obiecte de birou": ["dosar", "capsator", "creion", "riglă", "agrafă", "radieră", "ștampilă", "biblioraft"] };
  var INS = [
    function (R) { var g = pick(R, ["A", "B", "C"]), h = pick(R, ["07:30", "08:15", "06:45"]), p = pick(R, ["poarta 2", "poarta 3", "poarta 1"]), c = pick(R, ["ecusonul", "legitimația", "ordinul de serviciu"]); return { t: "Echipa " + g + " intră în tura de pază la ora " + h + ", pe la " + p + ". Fiecare membru prezintă " + c + " la punctul de control.", qs: [["La ce oră intră echipa în tură?", h, ["07:30", "08:15", "06:45", "07:15"]], ["Pe la ce poartă intră echipa?", p, ["poarta 1", "poarta 2", "poarta 3", "poarta 4"]], ["Ce se prezintă la punctul de control?", c, ["ecusonul", "legitimația", "ordinul de serviciu", "permisul"]]] }; },
    function (R) { var n = pick(R, ["3", "4", "5"]), cam = pick(R, ["camera 12", "camera 21", "camera 14"]), col = pick(R, ["albastru", "galben", "verde"]); return { t: "Pentru intervenție se iau " + n + " role de cablu din " + cam + ". Cablul de rezervă se marchează cu bandă de culoare " + col + ".", qs: [["Câte role de cablu se iau?", n, ["3", "4", "5", "6"]], ["Din ce cameră se iau rolele?", cam, ["camera 12", "camera 21", "camera 14", "camera 41"]], ["Cu ce culoare se marchează cablul de rezervă?", col, ["albastru", "galben", "verde", "roșu"]]] }; }
  ];
  function genMem2(seed, lv) {
    var R = rng(seed), k = pick(R, ["ins", "words", "icons"]);
    if (k === "ins") { var I = pick(R, INS)(R), Q = pick(R, I.qs), ans = Q[1], ds = Q[2].filter(function (x) { return x !== ans; }).slice(0, 3);
      var m = mix(R, [[ans, ans]].concat(ds.map(function (x) { return [x, x, "în text scria „" + ans + "”"]; })));
      return { t: "mem2", q: Q[0], mem: { html: '<p class="small muted">Citește o singură dată și reține detaliile:</p><div class="apins">' + I.t + "</div>", ms: Math.max(I.t.replace(/<[^>]+>/g, " ").split(/\s+/).length * 300, 8000 - lv * 600) }, stim: "", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 2, expl: "Textul: „" + I.t + "”. Truc: la citire spune-ți în gând cuvintele-cheie: CINE, CÂND, UNDE, CE (cifre, ore, culori, numere de cameră).", chk: { ans: ans } }; }
    if (k === "words") { var cat = pick(R, Object.keys(WL)), n = 5 + lv, all = shuf(R, WL[cat]), shown = all.slice(0, Math.min(n, 6)), dec = all.slice(Math.min(n, 6)), askIn = R() < 0.5;
      var other = WL[pick(R, Object.keys(WL).filter(function (c) { return c !== cat; }))];
      if (askIn) { var ans2 = pick(R, shown), ds2 = dec.concat(shuf(R, other)).slice(0, 3); var m2 = mix(R, [[ans2, ans2]].concat(ds2.map(function (x) { return [x, x, dec.indexOf(x) >= 0 ? "e din aceeași categorie (capcană), dar NU era în listă" : "nu era în listă"]; })));
        return { t: "mem2", q: "Care dintre aceste cuvinte A FOST în listă?", mem: { html: '<p class="small muted">Memorează cuvintele:</p><div class="apins">' + shown.join(" · ") + "</div>", ms: 1500 + shown.length * 600 }, stim: "", opts: m2.opts, keys: m2.keys, why: m2.why, ans: m2.ans, cols: 2, expl: "Lista era: " + shown.join(", ") + ". Truc: leagă cuvintele într-o mică poveste – capcanele sunt cuvinte din aceeași categorie.", chk: { shown: shown, ans: ans2 } }; }
      var ans3 = dec.length ? dec[0] : pick(R, other), ds3 = shuf(R, shown).slice(0, 3); var m3 = mix(R, [[ans3, ans3]].concat(ds3.map(function (x) { return [x, x, "acesta ERA în listă"]; })));
      return { t: "mem2", q: "Care cuvânt NU a fost în listă?", mem: { html: '<p class="small muted">Memorează cuvintele:</p><div class="apins">' + shown.join(" · ") + "</div>", ms: 1500 + shown.length * 600 }, stim: "", opts: m3.opts, keys: m3.keys, why: m3.why, ans: m3.ans, cols: 2, expl: "Lista era: " + shown.join(", ") + "; „" + ans3 + "” nu era. Truc: numără cuvintele când le citești – ții minte mai bine.", chk: { shown: shown, ans: ans3 } }; }
    var ic = shuf(R, ICO).slice(0, 9), pos = ri(R, 9), PN = ["stânga-sus", "mijloc-sus", "dreapta-sus", "stânga-mijloc", "centru", "dreapta-mijloc", "stânga-jos", "mijloc-jos", "dreapta-jos"];
    var gh = '<div class="apicg">' + ic.map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div>", ans4 = ic[pos], ds4 = shuf(R, ic.filter(function (x) { return x !== ans4; })).slice(0, 2).concat([shuf(R, ICO.filter(function (x) { return ic.indexOf(x) < 0; }))[0]]);
    var m4 = mix(R, [[ans4, ans4]].concat(ds4.map(function (x) { return [x, x, ic.indexOf(x) >= 0 ? "era în grilă, dar în poziția " + PN[ic.indexOf(x)] : "nu era deloc în grilă"]; })));
    return { t: "mem2", q: "Ce pictogramă era în poziția " + PN[pos] + "?", mem: { html: '<p class="small muted">Memorează grila (5 secunde):</p>' + gh, ms: 5000 }, stim: "", opts: m4.opts, keys: m4.keys, why: m4.why, ans: m4.ans, cols: 4, expl: "În " + PN[pos] + " era " + ans4 + ". Truc: memorează pe rânduri, ca pe o propoziție („stea-cheie-telefon”).", chk: { ic: ic, pos: pos } };
  }
  /* ---------- Plasarea punctului ---------- */
  function shapeIn(s, x, y) { if (s.k === "c") return (x - s.x) * (x - s.x) + (y - s.y) * (y - s.y) <= s.r * s.r; if (s.k === "s") return Math.abs(x - s.x) <= s.r && Math.abs(y - s.y) <= s.r; var dx = Math.abs(x - s.x), top = s.y - s.r, bot = s.y + s.r * 0.8; return y >= top && y <= bot && dx <= (y - top) / (bot - top) * s.r * 0.95; }
  function shapeSvg(s, col) { if (s.k === "c") return '<circle cx="' + s.x + '" cy="' + s.y + '" r="' + s.r + '" fill="none" stroke="' + col + '" stroke-width="2.5"/>'; if (s.k === "s") return '<rect x="' + (s.x - s.r) + '" y="' + (s.y - s.r) + '" width="' + 2 * s.r + '" height="' + 2 * s.r + '" fill="none" stroke="' + col + '" stroke-width="2.5"/>'; return '<path d="M' + s.x + "," + (s.y - s.r) + " L" + f1(s.x + s.r * 0.95) + "," + f1(s.y + s.r * 0.8) + " L" + f1(s.x - s.r * 0.95) + "," + f1(s.y + s.r * 0.8) + 'Z" fill="none" stroke="' + col + '" stroke-width="2.5"/>'; }
  function regionArea(sh, want) { var n = 0; for (var x = 1; x < 100; x += 1) for (var y = 1; y < 100; y += 1) { if (sh.every(function (s, i) { return shapeIn(s, x, y) === want[i]; })) n++; } return n; }
  function randShapes(R) { return ["c", "s", "t"].map(function (k) { return { k: k, x: 25 + ri(R, 50), y: 25 + ri(R, 50), r: 16 + ri(R, 18) }; }); }
  function genDotp(seed, lv) {
    var R = rng(seed), model, want, tries = 0;
    do { model = randShapes(R); want = [R() < 0.6, R() < 0.5, R() < 0.5]; if (!want.some(Boolean)) want[0] = true; tries++; } while (regionArea(model, want) < 60 && tries < 200);
    var pt = null; for (var t = 0; t < 4000 && !pt; t++) { var x = 5 + R() * 90, y = 5 + R() * 90; if (model.every(function (s, i) { return shapeIn(s, x, y) === want[i]; })) { /* departe de margini */ var okk = true; for (var a = 0; a < 8 && okk; a++) { var xx = x + 2.5 * Math.cos(a), yy = y + 2.5 * Math.sin(a); if (!model.every(function (s, i) { return shapeIn(s, xx, yy) === want[i]; })) okk = false; } if (okk) pt = [x, y]; } }
    var good = null, bad = [];
    for (var u = 0; u < 3000 && (!good || bad.length < 3); u++) { var cfg = randShapes(R), ar = regionArea(cfg, want); if (ar >= 60 && !good) good = cfg; else if (ar === 0 && bad.length < 3) bad.push(cfg); }
    var COLS = ["#2563eb", "#16a34a", "#dc2626"], drawCfg = function (sh, p) { return svg(100, 100, '<rect width="100" height="100" fill="#fff" stroke="#cbd5e1"/>' + sh.map(function (s, i) { return shapeSvg(s, COLS[i]); }).join("") + (p ? '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="3.5" fill="#0f172a"/>' : "")); };
    var NMs = ["cerc", "pătrat", "triunghi"], NMg = ["cercului", "pătratului", "triunghiului"], cond = want.map(function (w, i) { return w ? "ÎN " + NMs[i] : "în afara " + NMg[i]; }).join(", ");
    var m = mix(R, [[drawCfg(good), "g"]].concat(bad.map(function (c, i) { return [drawCfg(c), "b" + i, "aici nu există niciun loc care să fie în același timp " + cond]; })));
    return { t: "dotp", q: "În model, punctul este: " + cond + ". În care casetă poți pune un punct exact în aceeași situație?", stim: '<div class="apref"><small>Model</small>' + drawCfg(model, pt) + "</div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans,
      expl: "Pași: 1) scrie condiția modelului: " + cond + ". 2) În fiecare casetă caută zona unde se suprapun exact figurile cerute și NU intră celelalte. Doar o casetă are o astfel de zonă. Truc: verifică întâi figura „în afara” căreia trebuie să fie punctul – elimină repede casetele unde ea acoperă toată zona comună.", chk: { want: want, good: good, bad: bad } };
  }
  /* ---------- Judecată situațională (scenarii originale) ---------- */
  var SJ = [
    ["Ești de serviciu la poarta unității. Un civil grăbit spune că e „prieten cu comandantul” și cere să intre fără legitimație.", ["Îl rogi politicos să aștepte, verifici la ofițerul de serviciu și aplici procedura de acces.", "Îl lași să intre, ca să nu superi comandantul.", "Îl refuzi brusc și închizi poarta fără explicații.", "Îl lași să intre dacă îți lasă telefonul ca garanție."], 0, 1, "Regula de acces e aceeași pentru toți. Rămâi politicos și ceri confirmare pe canalul oficial (ofițerul de serviciu)."],
    ["În tura de noapte observi că un coleg de post adoarme a doua oară.", ["Îl trezești, îi amintești de pericol și raportezi dacă situația se repetă, conform regulamentului.", "Îl lași să doarmă, e obosit.", "Faci o poză și o pui pe grupul plutonului.", "Pleci și tu de la post, oricum nu e nimeni."], 0, 3, "Misiunea (postul păzit) e prioritară; ajuți colegul, dar respecți obligația de a raporta."],
    ["Primești un ordin de la superiorul direct care contrazice o procedură de siguranță la echipamentele electrice.", ["Execuți, dar îi semnalezi respectuos riscul și ceri confirmare; dacă e un pericol clar, nu pui viața în pericol și raportezi pe cale ierarhică.", "Îl execuți fără să spui nimic.", "Refuzi în fața tuturor și îl critici.", "Te prefaci că n-ai auzit."], 0, 2, "Siguranța și legea au prioritate; semnalezi respectuos, pe cale ierarhică, nu în public."],
    ["La o intervenție la o antenă, un coleg nou vrea să urce fără ham pentru că „durează doar un minut”.", ["Îl oprești și îi explici că urcarea se face doar cu echipament de protecție; îl ajuți să se echipeze.", "Îl lași, e treaba lui.", "Urci tu în locul lui tot fără ham.", "Îl filmezi ca să râdeți apoi."], 0, 3, "Protecția muncii nu e negociabilă; ajuți colegul să lucreze corect."],
    ["Ai greșit o configurație și rețeaua unei clădiri a căzut 10 minute.", ["Raportezi imediat ce s-a întâmplat, refaci configurația și propui o verificare ca să nu se repete.", "Nu spui nimic și speri să nu afle nimeni.", "Dai vina pe un coleg.", "Ștergi jurnalele ca să nu se vadă."], 0, 3, "Onestitatea și raportarea rapidă reduc pagubele; ascunderea și ștergerea dovezilor sunt abateri grave."],
    ["Doi colegi se ceartă aprins în dormitor, aproape să se lovească.", ["Intervii calm, îi separi și anunți comandantul de grupă dacă nu se liniștesc.", "Te uiți și îi încurajezi.", "Iei partea prietenului tău.", "Pleci și filmezi de la distanță."], 0, 1, "Previi violența, rămâi neutru și folosești lanțul de comandă."],
    ["Găsești un document marcat „secret de serviciu” uitat pe o masă în sala de mese.", ["Îl iei, nu îl citești și îl predai imediat ofițerului de serviciu.", "Îl citești ca să vezi a cui e.", "Îl lași acolo.", "Îl fotografiezi și îl trimiți colegilor să întrebe."], 0, 3, "Informațiile clasificate se protejează și se predau imediat persoanei autorizate."],
    ["Ți se cere să termini o lucrare până la ora 16, dar îți dai seama că nu ai materialele necesare.", ["Anunți din timp superiorul, explici ce lipsește și propui o soluție (alt material, alt termen).", "Aștepți până la 16 și spui că n-ai putut.", "Faci lucrarea pe jumătate fără să spui.", "Iei materialele din alt depozit fără aprobare."], 0, 3, "Comunicarea din timp și soluțiile propuse sunt mai bune decât surprizele; nu iei bunuri fără aprobare."],
    ["Un civil sună la 112 dintr-o zonă unde stația TETRA a căzut, iar tu ești la dispecerat tehnic.", ["Aplici procedura de avarie: anunți echipa de intervenție, treci pe soluția de rezervă și ții evidența timpilor.", "Aștepți să-și revină singură stația.", "Închizi telefonul ca să nu fii deranjat.", "Pleci acasă, tura e aproape gata."], 0, 3, "Continuitatea comunicațiilor de urgență e misiunea; urmezi procedura și documentezi."],
    ["Un coleg îți cere parola ta de acces la sistem „doar pentru 5 minute”.", ["Refuzi politicos și îi spui să ceară acces propriu de la administrator.", "I-o dai, că e coleg.", "I-o scrii pe un bilet și îl lipești pe monitor.", "I-o dai, dar o schimbi peste o lună."], 0, 2, "Parola e personală; accesul se acordă oficial, nu prin împrumut."],
    ["La instrucție, comandantul explică o procedură și tu nu ai înțeles un pas.", ["Ceri lămuriri la momentul potrivit sau după instrucție.", "Taci și improvizezi la exercițiu.", "Îl întrerupi și spui că explică prost.", "Copiezi ce face colegul, chiar dacă e greșit."], 0, 2, "E mai bine să întrebi respectuos decât să greșești la execuție."],
    ["Observi că un echipament din camera tehnică scoate fum.", ["Întrerupi alimentarea dacă e sigur, anunți imediat și folosești stingătorul potrivit (CO2), conform instructajului.", "Arunci apă pe el.", "Închizi ușa și pleci fără să anunți.", "Îl filmezi mai întâi."], 0, 1, "La echipamente electrice nu se folosește apă; siguranța și alarmarea rapidă sunt primele."],
    ["Ai terminat tura, dar schimbul tău întârzie 20 de minute.", ["Rămâi la post până vine schimbul și anunți ofițerul de serviciu de întârziere.", "Pleci, tura ta s-a terminat.", "Lași cheile unui civil de la poartă.", "Închizi postul și pleci."], 0, 3, "Postul nu se părăsește până la predarea oficială."],
    ["Un superior îți face o observație corectă, dar pe un ton dur, în fața colegilor.", ["Accepți observația, corectezi greșeala și, dacă tonul te-a afectat, discuți calm mai târziu, între patru ochi.", "Îi răspunzi pe același ton.", "Te plângi colegilor că e nedrept.", "Refuzi să mai lucrezi azi."], 0, 1, "Separi conținutul (corect) de ton; discuția despre ton se face respectuos, în privat."],
    ["Primești de la un furnizor un cadou scump „pentru colaborare”.", ["Refuzi politicos și informezi superiorul, conform regulilor de integritate.", "Îl accepți, e doar un cadou.", "Îl accepți și nu spui nimănui.", "Ceri unul mai mare."], 0, 3, "Integritatea: nu se acceptă avantaje care pot influența deciziile."],
    ["Un coleg nou nu știe să mufeze un cablu RJ45 și se descurcă greu.", ["Îi arăți pas cu pas (T568B), îl lași să încerce și verificați împreună cu testerul.", "Îl lași să se descurce singur.", "Faci tu tot și îi spui că nu e bun de nimic.", "Râzi de el în fața echipei."], 0, 3, "Spiritul de echipă: ajuți și înveți colegul, cu respect."],
    ["În timpul unei misiuni, primești pe telefon personal un mesaj neimportant de la un prieten.", ["Îl ignori până la pauză și rămâi concentrat pe misiune.", "Răspunzi imediat, durează puțin.", "Îl suni înapoi în timpul misiunii.", "Îi trimiți poze de la misiune."], 0, 3, "Misiunea și securitatea au prioritate; nu distribui imagini din misiune."],
    ["Constați că un coleg trece în registru ore lucrate pe care nu le-a făcut.", ["Discuți cu el să corecteze; dacă nu o face, raportezi pe cale ierarhică.", "Faci și tu la fel.", "Îl ameninți că-l dai în vileag dacă nu-ți dă bani.", "Nu e treaba ta."], 0, 2, "Corectitudinea: dai șansa corectării, apoi raportezi; nu șantajezi."],
    ["La o deplasare în teren, vremea se strică brusc și echipa e udă și obosită.", ["Asiguri echipamentul, raportezi situația și propui o pauză la adăpost conform planului.", "Continuați fără pauză, orice ar fi.", "Pleci singur la adăpost.", "Abandonezi echipamentul ca să fugiți mai repede."], 0, 3, "Ai grijă de oameni și de echipament, raportezi și respecți planul."],
    ["Ești întrebat la interviu de ce vrei să fii subofițer la STS.", ["Răspunzi sincer și concret: îți plac telecomunicațiile, disciplina și vrei să ajuți la comunicațiile de urgență.", "Spui că vrei doar salariu sigur.", "Spui ce crezi că vrea să audă, fără să crezi.", "Refuzi să răspunzi."], 0, 3, "Sinceritatea și motivația concretă contează; răspunsurile „de complezență” se văd."]
  ];
  function genSjt(seed, lv) {
    var R = rng(seed), S = SJ[ri(R, SJ.length)], worst = lv >= 3 && R() < 0.4, ans = worst ? S[3] : S[2];
    var list = [[S[1][ans], "o" + ans]].concat(S[1].map(function (o, i) { return [o, "o" + i, i === S[2] ? "aceasta e cea mai BUNĂ reacție, nu cea mai proastă" : i === S[3] ? "aceasta e cea mai PROASTĂ reacție (încalcă regula, pune oamenii sau misiunea în pericol)" : worst ? "e greșită, dar mai puțin gravă decât varianta corectă" : "nu respectă regula sau nu rezolvă problema"]; }).filter(function (_, i) { return i !== ans; }));
    var m = mix(R, list);
    return { t: "sjt", q: (worst ? "Care este cea mai PROASTĂ reacție?" : "Care este cea mai BUNĂ reacție?"), stim: '<div class="apins">' + S[0] + "</div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 1,
      expl: "Cea mai bună: „" + S[1][S[2]] + "”. Cea mai proastă: „" + S[1][S[3]] + "”. Regula: " + S[4] + " Truc: verifică pe rând 1) regula/legea, 2) oamenii (siguranță, respect), 3) misiunea – răspunsul bun le respectă pe toate trei.", chk: { s: S[0], ans: ans } };
  }
  /* ---------- Ordonare logică (soluție unică, verificată prin forță brută) ---------- */
  var PPL = ["Ana", "Bogdan", "Cristi", "Dana", "Emil"];
  function perms(a) { if (a.length <= 1) return [a]; var o = []; a.forEach(function (x, i) { perms(a.slice(0, i).concat(a.slice(i + 1))).forEach(function (p) { o.push([x].concat(p)); }); }); return o; }
  function clueOk(c, p) { var a = p.indexOf(c[1]), b = c[2] != null && typeof c[2] === "string" ? p.indexOf(c[2]) : -1; if (c[0] === "left") return a < b; if (c[0] === "adj") return Math.abs(a - b) === 1; if (c[0] === "notadj") return Math.abs(a - b) > 1; if (c[0] === "pos") return a === c[2]; if (c[0] === "notpos") return a !== c[2]; if (c[0] === "end") return a === 0 || a === p.length - 1; return true; }
  var PGEN = { Ana: "Anei", Bogdan: "lui Bogdan", Cristi: "lui Cristi", Dana: "Danei", Emil: "lui Emil" };
  function clueTxt(c) { return c[0] === "left" ? c[1] + " stă undeva la stânga " + PGEN[c[2]] : c[0] === "adj" ? c[1] + " stă imediat lângă " + c[2] : c[0] === "notadj" ? c[1] + " NU stă lângă " + c[2] : c[0] === "pos" ? c[1] + " stă pe locul " + (c[2] + 1) : c[0] === "notpos" ? c[1] + " NU stă pe locul " + (c[2] + 1) : c[1] + " stă la una din margini"; }
  function genLog(seed, lv) {
    var R = rng(seed), n = lv <= 2 ? 4 : 5, P = PPL.slice(0, n), sol = shuf(R, P), all = perms(P), clues = [], cand = all, tries = 0;
    while (cand.length > 1 && tries++ < 200) { var t = pick(R, ["left", "adj", "notadj", "pos", "notpos", "end"]), a = pick(R, P), b = pick(R, P.filter(function (x) { return x !== a; })), c;
      if (t === "pos" || t === "notpos") c = [t, a, t === "pos" ? sol.indexOf(a) : pick(R, [0, 1, 2, 3, 4].slice(0, n).filter(function (i) { return i !== sol.indexOf(a); }))]; else if (t === "end") c = [t, a]; else c = [t, a, b];
      if (!clueOk(c, sol)) continue; var nc = cand.filter(function (p) { return clueOk(c, p); }); if (nc.length < cand.length) { clues.push(c); cand = nc; } }
    var given = clues.filter(function (c) { return c[0] === "pos"; }).map(function (c) { return c[2]; }), freeK = [0, 1, 2, 3, 4].slice(0, n).filter(function (i) { return given.indexOf(i) < 0; }), k = freeK.length ? pick(R, freeK) : ri(R, n), ans = sol[k], ds = shuf(R, P.filter(function (x) { return x !== ans; })).slice(0, 3);
    var m = mix(R, [[ans, ans]].concat(ds.map(function (x) { return [x, x, "dacă " + x + " ar fi pe locul " + (k + 1) + ", ar fi încălcată cel puțin o condiție (soluția unică are pe " + x + " pe locul " + (sol.indexOf(x) + 1) + ")"]; })));
    return { t: "log", q: n + " colegi stau pe un rând de scaune numerotate 1–" + n + " (de la stânga). Cine stă pe locul " + (k + 1) + "?", stim: '<div class="apins">' + clues.map(function (c, i) { return (i + 1) + ". " + clueTxt(c) + "."; }).join("<br>") + "</div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 2,
      expl: "Singura așezare care respectă toate condițiile: " + sol.map(function (x, i) { return (i + 1) + "–" + x; }).join(", ") + ". Metodă: desenează " + n + " căsuțe, pune întâi informațiile sigure („pe locul…”, „la margine”), apoi pe cele „imediat lângă”, iar la final „la stânga”. Truc: elimină – fiecare condiție taie din posibilități.", chk: { clues: clues, sol: sol, k: k, cand: cand.length } };
  }
  /* ---------- Extra: busolă cu viraje, unghiul acelor, original vs. copie ---------- */
  var CMP = ["N", "NE", "E", "SE", "S", "SV", "V", "NV"], CMPN = ["nord", "nord-est", "est", "sud-est", "sud", "sud-vest", "vest", "nord-vest"];
  function genCmp(seed, lv) {
    var R = rng(seed), h = ri(R, 4) * 2, steps = [], cur = h, n = 2 + lv;
    for (var i = 0; i < n; i++) { var t = pick(R, lv <= 2 ? [2, -2, 4] : [1, -1, 2, -2, 3, 4]); steps.push(t); cur = (cur + t + 8) % 8; }
    var tx = function (t) { return t === 4 ? "face stânga-împrejur (180°)" : (t > 0 ? "virează la dreapta " : "virează la stânga ") + Math.abs(t) * 45 + "°"; };
    var m = mix(R, [[CMPN[cur], String(cur)]].concat(shuf(R, [0, 1, 2, 3, 4, 5, 6, 7].filter(function (v) { return v !== cur; })).slice(0, 3).map(function (v) { return [CMPN[v], String(v), v === (8 - cur) % 8 ? "ai inversat dreapta cu stânga" : "un viraj a fost calculat greșit"]; })));
    return { t: "cmp", q: "Un soldat pornește spre " + CMPN[h] + ", apoi: " + steps.map(tx).join(", ") + ". Spre ce direcție privește la final?", stim: "", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 2, expl: "Pas cu pas: " + CMPN[h] + steps.map(function (t, i) { var c = h; for (var j = 0; j <= i; j++) c = (c + steps[j] + 8) % 8; return " → " + CMPN[c]; }).join("") + ". Regula: dreapta = în sensul acelor de ceasornic (N → E → S → V). Truc: 90° = un sfert de cerc; adună virajele (dreapta +, stânga −).", chk: { h: h, steps: steps, cur: cur } };
  }
  function genClk(seed, lv) {
    var R = rng(seed), H = 1 + ri(R, 12), M = lv <= 2 ? pick(R, [0, 30]) : pick(R, [0, 10, 15, 20, 30, 40, 45, 50]), ang = Math.abs(30 * (H % 12) + 0.5 * M - 6 * M); if (ang > 180) ang = 360 - ang; if (ang % 1) return genClk(seed + 3, lv);
    var naive = Math.abs(30 * (H % 12) - 6 * M); if (naive > 180) naive = 360 - naive;
    var m = numOpts(R, ang, [naive, 360 - ang, ang + 15, Math.abs(ang - 15), ang + 30].filter(function (v) { return v >= 0 && v <= 360; }), function (v) { return v + "°"; });
    m.why = m.opts.map(function (o, i) { if (i === m.ans) return ""; var v = parseFloat(o); return v === naive && naive !== ang ? "ai uitat că ora se mișcă și ea: " + M + " min mută ora cu " + M / 2 + "°" : v === 360 - ang ? "acesta e unghiul mare; se cere unghiul mic (≤ 180°)" : "calcul greșit"; });
    var hh = (H % 12) * 30 + M * 0.5, mm = M * 6;
    var cl = '<circle cx="50" cy="50" r="44" fill="#fff" stroke="#0f172a" stroke-width="3"/>' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (k) { return '<line x1="50" y1="9" x2="50" y2="' + (k % 3 ? 13 : 16) + '" stroke="#0f172a" stroke-width="2" transform="rotate(' + k * 30 + ' 50 50)"/>'; }).join("") + '<line x1="50" y1="50" x2="50" y2="26" stroke="#0f172a" stroke-width="4" stroke-linecap="round" transform="rotate(' + hh + ' 50 50)"/><line x1="50" y1="50" x2="50" y2="14" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" transform="rotate(' + mm + ' 50 50)"/>';
    return { t: "clk", q: "Ce unghi (cel mic) fac acele ceasului la ora " + H + ":" + (M < 10 ? "0" : "") + M + "?", stim: svg(100, 100, cl), opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 4, expl: "Minutarul: 6° pe minut → " + M * 6 + "°. Orarul: 30° pe oră + 0,5° pe minut → " + hh + "°. Diferența: " + Math.abs(hh - mm) + "°" + (Math.abs(hh - mm) > 180 ? ", unghiul mic = 360 − " + Math.abs(hh - mm) + " = " + ang + "°" : "") + ". Truc: orarul NU stă pe loc – la „și jumătate” e la mijloc între cifre.", chk: { H: H, M: M, ang: ang } };
  }
  function genCopy(seed, lv) {
    var R = rng(seed), L = 6 + lv * 2, al = lv <= 2 ? "0123456789" : "ABCDEFGHKLMNPRSTXZ0123456789", rows = 4, orig = [], copy = [], diff = 0, pD = 0.35;
    for (var r = 0; r < rows; r++) { var s = ""; for (var i = 0; i < L; i++) s += al[ri(R, al.length)]; orig.push(s); var c = s; if (R() < pD + lv * 0.08) { var j = ri(R, L), ch = al[ri(R, al.length)]; while (ch === s[j]) ch = al[ri(R, al.length)]; c = s.slice(0, j) + ch + s.slice(j + 1); diff++; } copy.push(c); }
    var m = numOpts(R, diff, [0, 1, 2, 3, 4].filter(function (v) { return v !== diff; }));
    m.why = m.opts.map(function (o, i) { return i === m.ans ? "" : "ai numărat " + o + ", dar " + (diff === 0 ? "niciun rând nu diferă" : diff === 1 ? "diferă un singur rând" : "diferă " + diff + " rânduri") + (+o > diff ? " – ai văzut diferențe care nu există" : " – ți-a scăpat o diferență"); });
    return { t: "copy", q: "Câte rânduri din COPIE diferă de ORIGINAL (măcar un caracter)?", stim: '<div class="apcopy"><div><small>Original</small>' + orig.map(function (s) { return "<code>" + s + "</code>"; }).join("") + "</div><div><small>Copie</small>" + copy.map(function (s) { return "<code>" + s + "</code>"; }).join("") + "</div></div>", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 5,
      expl: (function () { var d = orig.map(function (s, i) { return s === copy[i] ? null : (i + 1); }).filter(Boolean); return diff === 0 ? "Niciun rând nu diferă – copia e identică." : d.length === 1 ? "Diferă doar rândul al " + d[0] + "-lea (" + diff + " rând în total)." : "Diferă rândurile " + d.join(", ") + " (" + diff + " rânduri în total)."; })() + " Truc: compară pe bucăți de câte 3–4 caractere, nu tot rândul deodată.", chk: { orig: orig, copy: copy, diff: diff } };
  }


  /* ---------- Sinonime și antonime (verbal) ---------- */
  /* [cuvânt, sinonim, antonim, parte de vorbire, grup de sens] – grupurile apropiate nu se folosesc unul ca distractor pentru altul */
  var SYN = [
    ["rapid", "iute", "lent", "a", "viteza"], ["curajos", "viteaz", "laș", "a", "curaj"], ["vesel", "bucuros", "trist", "a", "bucurie"], ["bogat", "avut", "sărac", "a", "avere"],
    ["harnic", "silitor", "leneș", "a", "munca"], ["înalt", "ridicat", "scund", "a", "inaltime"], ["ud", "umed", "uscat", "a", "apa"], ["greu", "dificil", "ușor", "a", "efort"],
    ["vechi", "antic", "nou", "a", "timp"], ["corect", "exact", "greșit", "a", "corect"], ["liniștit", "calm", "agitat", "a", "calm"], ["prudent", "precaut", "imprudent", "a", "prudenta"],
    ["generos", "darnic", "zgârcit", "a", "darnicie"], ["sincer", "onest", "prefăcut", "a", "sinceritate"], ["util", "folositor", "inutil", "a", "util"], ["frumos", "arătos", "urât", "a", "frumusete"],
    ["clar", "limpede", "neclar", "a", "claritate"], ["modest", "umil", "îngâmfat", "a", "modestie"], ["sigur", "cert", "nesigur", "a", "certitudine"], ["vast", "întins", "restrâns", "a", "marime"],
    ["început", "debut", "sfârșit", "n", "inceput"], ["victorie", "biruință", "înfrângere", "n", "castig"], ["prieten", "amic", "dușman", "n", "prieten"], ["adevăr", "realitate", "minciună", "n", "adevar"],
    ["curaj", "bravură", "frică", "n", "curaj"], ["bucurie", "veselie", "tristețe", "n", "bucurie"], ["avantaj", "beneficiu", "dezavantaj", "n", "avantaj"], ["intrare", "acces", "ieșire", "n", "intrare"],
    ["lumină", "strălucire", "întuneric", "n", "lumina"], ["ordine", "disciplină", "dezordine", "n", "ordine"], ["răspuns", "replică", "întrebare", "n", "raspuns"], ["abundență", "belșug", "lipsă", "n", "avere"],
    ["a începe", "a demara", "a termina", "v", "inceput"], ["a urca", "a se sui", "a coborî", "v", "urcare"], ["a construi", "a clădi", "a demola", "v", "constructie"], ["a aproba", "a accepta", "a respinge", "v", "aprobare"],
    ["a ascunde", "a tăinui", "a dezvălui", "v", "ascundere"], ["a lăuda", "a elogia", "a critica", "v", "lauda"], ["a cumpăra", "a achiziționa", "a vinde", "v", "comert"], ["a aduna", "a strânge", "a risipi", "v", "adunare"],
    ["a uni", "a îmbina", "a despărți", "v", "unire"], ["a crește", "a spori", "a scădea", "v", "crestere"], ["a apăra", "a proteja", "a ataca", "v", "aparare"], ["a sosi", "a veni", "a pleca", "v", "deplasare"]
  ];
  function genSyn(seed, lv) {
    var R = rng(seed), pool = SYN.filter(function (e) { return lv <= 2 ? e[3] === "a" : true; }), e = pick(R, pool), anti = R() < 0.5, n = lv >= 4 ? 5 : 4;
    var ok = anti ? e[2] : e[1], trap = anti ? e[1] : e[2];
    var others = shuf(R, SYN.filter(function (x) { return x !== e && x[3] === e[3] && x[4] !== e[4]; })).slice(0, n - 2);
    var list = [[ok, ok], [trap, trap, "„" + trap + "” " + (anti ? "înseamnă ACELAȘI lucru ca „" + e[0] + "” (e sinonim), iar tu cauți opusul" : "înseamnă OPUSUL lui „" + e[0] + "” (e antonim), iar tu cauți același sens")]];
    others.forEach(function (x) { var w = anti ? x[2] : x[1]; list.push([w, w, anti ? "„" + w + "” nu e opusul lui „" + e[0] + "” – e opusul lui „" + x[0] + "”" : "„" + w + "” nu înseamnă „" + e[0] + "” – e sinonim cu „" + x[0] + "”"]); });
    var m = mix(R, list);
    return { t: "syn", q: "Care este " + (anti ? "ANTONIMUL (sensul opus)" : "SINONIMUL (același sens)") + " cuvântului „" + e[0] + "”?", stim: "", opts: m.opts, keys: m.keys, why: m.why, ans: m.ans, cols: 2,
      expl: "Sinonim = același sens, antonim = sens opus. „" + e[0] + "” = „" + e[1] + "” (sinonim); opusul lui este „" + e[2] + "”. Capcana: între variante e pus și " + (anti ? "sinonimul" : "antonimul") + ", ca să te încurce. Truc: pune cuvântul într-o propoziție scurtă și înlocuiește-l cu varianta aleasă – " + (anti ? "propoziția trebuie să spună exact invers." : "sensul trebuie să rămână același."), chk: { e: e, anti: anti } };
  }
  var GEN = { syn: genSyn, fold: genFold, mech: genMech, praga: genPraga, krae: genKrae, code: genCode, mem2: genMem2, dotp: genDotp, sjt: genSjt, log: genLog, cmp: genCmp, clk: genClk, copy: genCopy, arr: genArr, pon: genPon, top: genTop, dot: genDot, syl: genSyl, ser2: genSer2, fan: genFan, mag: genMag, odd: genOdd, wan: genWan, ana: genAna, pb: genPb, rot2: genRot2, att: genAtt, atp: genAtp, rot3: genRot3, cnt: genCnt, net: genNet, ser: genSer, mat: genMat, bou: genBou, mem: genMem, ari: genAri };
  var SECT = [
    ["✈️ Orientare spațială", [["att", "🛩️", "Avioane: instrumente de bord", "orizont artificial + busolă"], ["rot2", "✈️", "Avioane: rotit sau oglindit", "orientare 2D"], ["rot3", "🧊", "Rotație mentală 3D", "oglindă vs. rotire"], ["net", "🎲", "Desfășurata cubului", "fețe opuse, ce cub iese"], ["cnt", "🧱", "Numărarea cuburilor", "și cele ascunse"], ["top", "🔭", "Vedere de sus / din față", "corp din cuburi"], ["fold", "📄", "Plierea și perforarea hârtiei", "desfaci în minte"], ["dotp", "📍", "Plasarea punctului", "în / în afara figurilor"], ["cmp", "🧭", "Busolă și viraje", ""]]],
    ["⚙️ Raționament tehnic", [["mech", "⚙️", "Roți dințate, pârghii, scripeți", "sens, ture, forțe"], ["clk", "🕒", "Unghiul acelor ceasului", ""]]],
    ["🧩 Raționament", [["mat", "🔳", "Matrice (tip Raven)", "regula pe rânduri/coloane"], ["fan", "🔀", "Analogii figurale", "A→B ca C→?"], ["ser", "🔢", "Șiruri de numere și litere", ""], ["ser2", "🔢", "Șir cu doi termeni lipsă", "1-7-2-9-3-11-?-?"], ["syl", "🧠", "Silogisme (cuvinte inventate)", "adevărat / fals / nu se știe"], ["mag", "🔲", "Pătratul magic (15)", "perspicacitate"], ["pb", "💡", "Probleme cu capcană", "±1, stâlpi, clasament"], ["log", "🪑", "Ordonare logică", "cine stă unde"], ["sjt", "🎖️", "Judecată situațională", "scenarii de serviciu"]]],
    ["🔤 Verbal", [["wan", "🔗", "Analogii verbale", "podea : tavan = pământ : ?"], ["odd", "🚫", "Intrusul", "cuvântul care nu se potrivește"], ["ana", "🔤", "Anagrame", "orașe, capitale, țări"], ["syn", "🔁", "Sinonime și antonime", "același sens / sens opus"]]],
    ["🎯 Atenție și memorie", [["arr", "➡️", "Săgețile de atenție (A.N.P)", "> > < > → S / D / nimic"], ["pon", "🙂", "Proba PON (fețe)", "3 / 2 / 0 identice"], ["atp", "🛫", "Avioane: atenție", "aceeași direcție"], ["bou", "🔍", "Atenție concentrată", "„d” cu două liniuțe"], ["mem", "🧠", "Memorie de scurtă durată", "poziții și cifre"], ["ari", "➗", "Calcul rapid", ""], ["dot", "✏️", "Copierea figurii pe puncte", "atingi punctele"], ["praga", "🔢", "Atenție distributivă (Praga)", "tabel cu numere mari/mici"], ["krae", "➕", "Kraepelin (adun / scad)", ""], ["code", "🔐", "Codare literă → cifră", ""], ["mem2", "📝", "Memorie: text, cuvinte, pictograme", ""], ["copy", "📋", "Original vs. copie", ""]]]
  ];
  var TYPES = []; SECT.forEach(function (s) { s[1].forEach(function (t) { TYPES.push(t); }); });
  var TIP = { att: "„orizontul fuge invers” – avionul se înclină dreapta, linia coboară în stânga.", rot2: "pune degetul pe semnul roșu și rotește în minte foaia până botul e în sus; dacă semnul ajunge pe altă aripă, e oglindă.", net: "două pătrate lipite pe desfășurată NU pot fi opuse; peste unul în linie = opuse.", cnt: "numără pe coloane, de la spate spre față, și scrie înălțimile – apoi aduni.", top: "de sus contează doar UNDE e cel puțin un cub, nu cât de înalt e turnul.", mat: "verifică pe rând câte un singur lucru (forma, apoi numărul, apoi culoarea).", fan: "urmărește un detaliu mic (steagul) – el îți arată rotirea sau oglindirea.", ser: "scrie diferențele dintre termeni sub șir; dacă nu merg, încearcă din 2 în 2.", ser2: "împarte șirul în două (poziții impare / pare) și continuă fiecare separat.", syl: "desenează 3 cercuri și încearcă să „strici” concluzia; dacă nu poți, e adevărată.", mag: "5 în centru, colțurile pare, perechile opuse dau 10.", pb: "desenează: 3 bucăți = 2 tăieturi, 3 intervale = 4 stâlpi.", wan: "formulează relația într-o propoziție și aplic-o pe a doua pereche.", odd: "găsește categoria comună a majorității; intrusul e singurul din altă categorie.", arr: "nu citi toate săgețile – caută „ruptura” de ritm din ochi.", pon: "compară întâi forma capului, apoi ochii și gura – un singur detaliu diferit = altă figură.", atp: "numără doar botul (vârful), rând cu rând.", bou: "caută întâi toate „d”-urile, apoi verifică liniuțele.", ari: "rotunjește și corectează (ex. 19×6 = 20×6 − 6).", fold: "fiecare pliu dublează găurile; desfaci pliurile de la ultimul la primul, ca o oglindă.", mech: "roți vecine = sens opus; roata mare = mai puține ture; pârghie: forță × braț = forță × braț.", praga: "caută numărul în zig-zag pe rânduri și citește doar ce ți se cere (vecinul sau mărimea).", krae: "întâi compari (mic→mare = aduni, mare→mic = scazi), apoi calculezi.", code: "scrie cifra sub fiecare literă înainte să alegi; verifică prima și ultima cifră.", mem: "grupează: 3 cifre odată, sau forme (linie, L) pentru pătrate.", mem2: "spune-ți în gând cuvintele-cheie: cine, când, unde, câte.", dotp: "scrie condiția (în ce figuri DA, în ce figuri NU) și caută zona exactă în fiecare casetă.", sjt: "alege reacția care respectă 1) regula, 2) oamenii, 3) misiunea – și raportează pe cale ierarhică.", log: "desenează căsuțele; pune întâi informațiile sigure, apoi pe cele relative.", cmp: "dreapta = sensul acelor de ceasornic; adună virajele.", clk: "minutarul 6°/minut, orarul 30°/oră + 0,5°/minut.", copy: "compară bucăți de 3–4 caractere.", dot: "numără pentru fiecare segment câte puncte și în ce direcție, pornind din punctul roșu.", ana: "numără literele și caută literele rare.", syn: "pune cuvântul într-o propoziție și înlocuiește-l cu varianta." };
  function gen(t, seed, lv) { var it = GEN[t](seed >>> 0, Math.max(1, Math.min(5, lv | 0)));
    if (it.opts && it.opts.length && it.why) { var ca = it.opts[it.ans]; it.why = it.why.map(function (w, i) { if (i === it.ans || w) return w; var a = Number(ca), b = Number(it.opts[i]); if (isFinite(a) && isFinite(b) && it.opts[i] !== "" && ca !== "") { var d = b - a; return "e cu " + Math.abs(d) + " mai " + (d > 0 ? "mult" : "puțin") + " decât rezultatul corect (" + ca + ")"; } return "nu respectă regula: corect este " + ca; }); } if (!/Truc/.test(it.expl) && TIP[t]) it.expl += " Truc: " + TIP[t]; it.t = t; it.seed = seed >>> 0; it.lv = Math.max(1, Math.min(5, lv | 0)); return it; }
  /* tabel interactiv de barare (60 s) */
  function bourBoard(seed, lv) { var R = rng(seed), cols = 8, rows = lv <= 2 ? 8 : 10; return { cols: cols, rows: rows, g: bourGrid(R, cols, rows, Math.max(2, lv)), match: bourMatch, cell: function (c) { return svg(30, 32, bourCell(c[0], c[1])); } }; }
  var API = { TIP: TIP, gen: gen, TYPES: TYPES, SECT: SECT, dotCheck: dotCheck, dotKey: dotKey, bourBoard: bourBoard, _: { SYN: SYN, kraeRes: kraeRes, perms: perms, clueOk: clueOk, shapeIn: shapeIn, regionArea: regionArea, unfold: unfold, inRegion: inRegion, SJ: SJ, sylEval: sylEval, LOSHU: LOSHU, srt: srt, ANW: ANW, CAT: CAT, REL: REL, canon: canon, mirrorC: mirrorC, rot: rot, ROTS: ROTS, viewValid: viewValid, fold: fold, det3: det3, dot: dot } };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else root.APT = API;
})(this);
