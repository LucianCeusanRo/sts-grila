/* STS – sala de examen 3D (Three.js r149, MIT – vezi vendor/LICENSE-three.txt).
   Grafică „realistă”: materiale PBR, lumină de soare prin ferestre cu umbre, hartă de mediu, texturi CC0 (Poly Haven),
   fotografii reale ale echipamentelor (Wikimedia Commons, CC BY / BY-SA – vezi Credite), oameni animați (Quaternius, CC0).
   Niveluri de calitate: high (PC), med (telefon), low (fără umbre / fără modele). */
(function () {
  "use strict";
  function supported() { try { var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; } }
  var TCACHE = {}, TL = null, SKY = null, ENV = {};
  function create(container, opts) {
    opts = opts || {}; var T = window.THREE, X = window.THREE_X || {}, dead = false, paused = false;
    var TIER = opts.tier || (opts.lowPower ? "med" : "high"); if (TIER !== "ultra" && TIER !== "high" && TIER !== "med" && TIER !== "low") TIER = "med";
    var UL = TIER === "ultra" && !!window.THREE_P, HI = TIER === "high" || UL, LO = TIER === "low", low = LO; if (TIER === "ultra" && !UL) TIER = "high";
    if (T.ColorManagement) T.ColorManagement.legacyMode = false;
    var R = new T.WebGLRenderer({ antialias: !LO, powerPreference: "high-performance" });
    var pr = Math.min(window.devicePixelRatio || 1, LO ? 1 : (opts.dprCap || (UL ? 2 : HI ? 1.75 : 1.5))); R.setPixelRatio(pr); R.outputEncoding = T.sRGBEncoding;
    R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.0;
    R.shadowMap.enabled = !LO; R.shadowMap.type = HI ? T.PCFSoftShadowMap : T.PCFShadowMap;
    var cv = R.domElement; cv.style.width = "100%"; cv.style.height = "100%"; cv.style.display = "block"; cv.style.touchAction = "none"; container.appendChild(cv);
    var LTOK = 0, S = new T.Scene(), LV = new T.Group(), NG = new T.Group(), LVN = "", ST = {}, LBL = {}, BND = [-4.2, 4.2, -5.7, 5.7], FY = null, TRIG = []; S.background = new T.Color("#cfd6dc"); S.fog = new T.Fog("#cfd6dc", 10, 22); S.add(NG);
    var cam = new T.PerspectiveCamera(62, 1, 0.05, 80); var P = { x: 0, z: 5.0, yaw: 0, pitch: -0.08, mf: 0, ms: 0 };
    var geos = [], mats = [], texs = [], solids = [], stObj = {}, leds = {}, anchors = {}, cables = {}, labels = {}, blinkers = {}, NPC = null, HEAD = null, BAR = null, BARSOLID = null, NPCS = [], NPCMAIN = null, PROXY = [];
    if (!TL) TL = new T.TextureLoader();
    /* ---------- materiale ---------- */
    function M(c, o) { o = o || {}; var m; if (LO) { var q = Object.assign({ color: c }, o); delete q.roughness; delete q.metalness; delete q.envMapIntensity; m = new T.MeshLambertMaterial(q); } else m = new T.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8, metalness: 0 }, o)); mats.push(m); return m; }
    var MC = {}; function mc(c) { return MC[c] || (MC[c] = M(c)); }
    function metal(c, r) { return M(c, { roughness: r == null ? 0.38 : r, metalness: 0.75 }); }
    /* texturi încărcate o singură dată (cache pe toată sesiunea); se pun pe material abia după încărcare (fără „negru” până atunci) */
    function getTex(url, srgb, cb) { if (UL && /^tex\/[a-z0-9_]+_(d|n)\.webp$/.test(url)) url = url.replace("tex/", "tex2k/"); var e = TCACHE[url]; if (!e) { e = TCACHE[url] = { t: null, ok: false, bad: false, w: [] }; TL.load(url, function (t) { t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = Math.min(UL ? 16 : 8, R.capabilities.getMaxAnisotropy()); if (srgb) t.encoding = T.sRGBEncoding; e.t = t; e.ok = true; e.w.splice(0).forEach(function (f) { f(t); }); }, undefined, function () { if (url.indexOf("tex2k/") === 0) { var w0 = e.w.splice(0); delete TCACHE[url]; UL = false; w0.forEach(function (f) { getTex(url.replace("tex2k/", "tex/"), srgb, f); }); UL = TIER === "ultra"; return; } e.bad = true; e.w.length = 0; }); } if (e.ok) cb(e.t); else if (!e.bad) e.w.push(cb); }
    function useTex(m, slot, url, srgb, tint) { getTex(url, srgb, function (t) { if (dead) return; m[slot] = t; if (tint && slot === "map") m.color.set(tint); m.needsUpdate = true; }); }
    function PM(name, o) { o = o || {}; var m = M(o.c0 || "#b8b4ab", { roughness: o.r != null ? o.r : 0.85, metalness: o.m || 0 }); useTex(m, "map", "tex/" + name + "_d.webp", true, o.tint || "#ffffff"); if (!LO && o.n !== false) { useTex(m, "normalMap", "tex/" + name + "_n.webp", false); if (m.normalScale) m.normalScale.set(o.ns || 0.7, o.ns || 0.7); } if (HI && o.rm) useTex(m, "roughnessMap", "tex/" + name + "_r.webp", false); return m; }
    function PH(file, o) { o = o || {}; var m = M(o.c0 || "#888888", Object.assign({ roughness: o.r != null ? o.r : 0.55, metalness: o.m || 0, transparent: false, alphaTest: o.alpha ? 0.5 : 0 }, o.x || {})); if (o.alpha) m.side = T.DoubleSide; useTex(m, "map", file, true, "#ffffff"); return m; }
    /* UV la scară reală (metri) pe cutii și plane: textura nu se întinde */
    function boxUV(g, w, h, d, tile) { var uv = g.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]]; for (var f = 0; f < 6; f++) for (var k = 0; k < 4; k++) { var i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / tile, uv.getY(i) * dims[f][1] / tile); } uv.needsUpdate = true; }
    function box(w, h, d, c, x, y, z, par, cast, tile) { var g = new T.BoxGeometry(w, h, d); if (tile) boxUV(g, w, h, d, tile); geos.push(g); var m = new T.Mesh(g, typeof c === "string" ? mc(c) : c); m.position.set(x, y, z); if (cast && !low) { m.castShadow = true; m.userData.cs = 1; } m.receiveShadow = !low; (par || LV).add(m); return m; }
    function cyl(r, h, c, x, y, z, par, seg, r2) { var g = new T.CylinderGeometry(r, r2 == null ? r : r2, h, seg || 12); geos.push(g); var m = new T.Mesh(g, typeof c === "string" ? mc(c) : c); m.position.set(x, y, z); (par || LV).add(m); return m; }
    function ctex(w, h, draw) { var c = document.createElement("canvas"); c.width = w; c.height = h; var x = c.getContext("2d"); draw(x, w, h); var t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = UL ? 16 : 4; texs.push(t); return t; }
    function solid(x0, z0, x1, z1) { solids.push([Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)]); }
    function label(id, x, y, z) { var t = ctex(512, 96, function (c, w, h) { c.fillStyle = "rgba(17,24,39,.78)"; c.beginPath(); if (c.roundRect) c.roundRect(4, 4, w - 8, h - 8, 26); else c.rect(4, 4, w - 8, h - 8); c.fill(); c.fillStyle = "#fff"; c.font = "600 34px -apple-system,Helvetica,Arial"; c.textAlign = "center"; c.textBaseline = "middle"; var s = LBL[id]; while (c.measureText(s).width > w - 30 && s.length > 4) s = s.slice(0, -2); c.fillText(s.length < LBL[id].length ? s + "…" : s, w / 2, h / 2 + 2); });
      var m = new T.SpriteMaterial({ map: t, depthTest: false, transparent: true, toneMapped: false }); mats.push(m); var sp = new T.Sprite(m); sp.scale.set(1.5, 0.28, 1); sp.position.set(x, y, z); sp.renderOrder = 5; LV.add(sp); labels[id] = sp; }
    function station(id, g) { g.userData.station = id; g.traverse(function (o) { o.userData.station = id; }); stObj[id] = g; LV.add(g); }
    function noise(c, w, h, n, a) { for (var k = 0; k < n; k++) { c.fillStyle = "rgba(" + (Math.random() < 0.5 ? "0,0,0," : "255,255,255,") + Math.random() * a + ")"; c.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); } }
    function plane(w, h, mat, x, y, z, rx, ry, tile) { var g = new T.PlaneGeometry(w, h); if (tile) { var uv = g.attributes.uv; for (var i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / tile, uv.getY(i) * h / tile); } geos.push(g); var m = new T.Mesh(g, mat); m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, 0); m.receiveShadow = !low; LV.add(m); return m; }
    function textTex(lines, w, h, bg, fg) { return ctex(w, h, function (c) { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg; c.textAlign = "center"; lines.forEach(function (l, i) { c.font = l[1]; c.fillText(l[0], w / 2, l[2]); }); }); }
    /* poză decupată (fundal transparent) culcată pe o masă: obiect real văzut de sus */
    function decal(file, w, h, x, y, z, rz, par) { var g = new T.PlaneGeometry(w, h); geos.push(g); var m = new T.Mesh(g, PH(file, { alpha: true, r: 0.5 })); m.rotation.set(-Math.PI / 2, 0, rz || 0); m.position.set(x, y, z); if (!low) { m.castShadow = true; m.userData.cs = 1; } m.receiveShadow = !low; (par || LV).add(m); return m; }
    /* ---------- lumini + mediu ---------- */
    var hemi = new T.HemisphereLight("#ffffff", "#8a8f7a", 0.5); S.add(hemi);
    var sun = new T.DirectionalLight("#fff1dc", 2.2); S.add(sun); S.add(sun.target);
    if (!LO) { sun.castShadow = true; sun.shadow.mapSize.set(UL ? 4096 : HI ? 2048 : 1024, UL ? 4096 : HI ? 2048 : 1024); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.025; if (HI) sun.shadow.radius = UL ? 4 : 3; }
    var PMG = null; try { if (!LO) PMG = new T.PMREMGenerator(R); } catch (e) { PMG = null; }
    function envRoom() { if (!PMG || !X.RoomEnvironment) return null; if (!ENV.room || ENV.roomR !== R) { try { var re = new X.RoomEnvironment(); ENV.room = PMG.fromScene(re, 0.04).texture; ENV.roomR = R; re.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); } catch (e) { ENV.room = null; } } return ENV.room; }
    function setSky(cb) { getTex("tex/sky.webp", true, function (t) { t.mapping = T.EquirectangularReflectionMapping; if (PMG && (!ENV.sky || ENV.skyR !== R)) { try { ENV.sky = PMG.fromEquirectangular(t).texture; ENV.skyR = R; } catch (e) { ENV.sky = null; } } cb(t); }); }
    function lights(kind, box) {
      var outd = kind === "out", tgt = box.c, ext = box.e;
      hemi.color.set(outd ? "#d6e6ff" : "#fff7ec"); hemi.groundColor.set(outd ? "#5f6b4c" : "#8b8273"); hemi.intensity = outd ? 0.55 : 0.32;
      sun.color.set("#fff0d8"); sun.intensity = outd ? 2.6 : 3.0; sun.target.position.set(tgt[0], 0, tgt[1]); var d = box.d; sun.position.set(tgt[0] + d[0], d[1], tgt[1] + d[2]); sun.target.updateMatrixWorld();
      if (!LO) { var sc = sun.shadow.camera; sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = 0.5; sc.far = 60; sc.updateProjectionMatrix(); }
      S.environment = outd ? (ENV.sky || null) : envRoom(); var lvTok = LVN;
      setSky(function (t) { if (dead || LVN !== lvTok) return; S.background = t; if (outd && ENV.sky) S.environment = ENV.sky; });
      if (!S.background || S.background.isColor) S.background = new T.Color(outd ? "#9cc3e6" : "#c8d4de");
      S.fog = outd ? new T.Fog("#c9dbea", 30, 90) : null;
    }
    /* perete cu goluri pentru ferestre (soarele intră doar prin ele) – de-a lungul axei z, la x fix */
    var GLASS = null, FRAME = null;
    function glassM() { if (!GLASS || mats.indexOf(GLASS) < 0) { GLASS = M("#a9c4d6", { transparent: true, opacity: 0.16, roughness: 0.04, metalness: 0.1, depthWrite: false }); } return GLASS; }
    function frameM() { if (!FRAME || mats.indexOf(FRAME) < 0) FRAME = M("#eceeef", { roughness: 0.35, metalness: 0.05 }); return FRAME; }
    function wallZ(xw, z0, z1, H, th, mat, wins, tile) { wins = (wins || []).slice().sort(function (a, b) { return a[0] - b[0]; }); var cur = z0;
      function seg(a, b, y0, y1) { if (b - a < 0.005 || y1 - y0 < 0.005) return; box(th, y1 - y0, b - a, mat, xw, (y0 + y1) / 2, (a + b) / 2, null, true, tile); }
      wins.forEach(function (wn) { var a = wn[0] - wn[1] / 2, b = wn[0] + wn[1] / 2; seg(cur, a, 0, H); seg(a, b, 0, wn[2]); seg(a, b, wn[3], H); cur = b; var fm = frameM(), s = xw > 0 ? -1 : 1;
        box(th + 0.04, 0.05, wn[1], fm, xw, wn[2] + 0.025, wn[0]); box(th + 0.04, 0.05, wn[1], fm, xw, wn[3] - 0.025, wn[0]); box(th + 0.04, wn[3] - wn[2], 0.05, fm, xw, (wn[2] + wn[3]) / 2, a + 0.025); box(th + 0.04, wn[3] - wn[2], 0.05, fm, xw, (wn[2] + wn[3]) / 2, b - 0.025); box(th + 0.04, wn[3] - wn[2], 0.04, fm, xw, (wn[2] + wn[3]) / 2, wn[0]);
        box(0.2, 0.03, wn[1] + 0.1, M("#e7e3dc", { roughness: 0.3 }), xw + s * 0.09, wn[2] - 0.01, wn[0], null, true);
        var gp = plane(wn[1] - 0.08, wn[3] - wn[2] - 0.08, glassM(), xw, (wn[2] + wn[3]) / 2, wn[0], 0, Math.PI / 2); gp.receiveShadow = false; gp.userData.glass = 1; });
      seg(cur, z1, 0, H); }
    function wallX(zw, x0, x1, H, th, mat, wins, tile) { wins = (wins || []).slice().sort(function (a, b) { return a[0] - b[0]; }); var cur = x0;
      function seg(a, b, y0, y1) { if (b - a < 0.005 || y1 - y0 < 0.005) return; box(b - a, y1 - y0, th, mat, (a + b) / 2, (y0 + y1) / 2, zw, null, true, tile); }
      wins.forEach(function (wn) { var a = wn[0] - wn[1] / 2, b = wn[0] + wn[1] / 2; seg(cur, a, 0, H); seg(a, b, 0, wn[2]); seg(a, b, wn[3], H); cur = b; var fm = frameM();
        box(wn[1], 0.05, th + 0.04, fm, wn[0], wn[2] + 0.025, zw); box(wn[1], 0.05, th + 0.04, fm, wn[0], wn[3] - 0.025, zw); box(0.05, wn[3] - wn[2], th + 0.04, fm, a + 0.025, (wn[2] + wn[3]) / 2, zw); box(0.05, wn[3] - wn[2], th + 0.04, fm, b - 0.025, (wn[2] + wn[3]) / 2, zw);
        var gp = plane(wn[1] - 0.08, wn[3] - wn[2] - 0.08, glassM(), wn[0], (wn[2] + wn[3]) / 2, zw, 0, 0); gp.receiveShadow = false; gp.userData.glass = 1; });
      seg(cur, x1, 0, H); }
    function ceilingLights(list, y) { var em = M("#ffffff", { emissive: "#fff6e6", emissiveIntensity: 1.6, roughness: 0.5 }), fr = M("#d9dbdd", { roughness: 0.5, metalness: 0.3 }); list.forEach(function (q) { box(q[2] || 1.2, 0.03, q[3] || 0.6, fr, q[0], y - 0.015, q[1]); var p = box((q[2] || 1.2) - 0.06, 0.012, (q[3] || 0.6) - 0.06, em, q[0], y - 0.035, q[1]); p.receiveShadow = false; }); }
    function skirting(pts, c) { var m = M(c || "#5f5a52", { roughness: 0.6 }); pts.forEach(function (q) { box(q[2], 0.1, q[3], m, q[0], 0.05, q[1]); }); }
    function door(w, h, wood, frameCol) { var g = new T.Group(), f = M(frameCol || "#efeeea", { roughness: 0.4 }); box(w, h, 0.05, wood, 0, h / 2, 0, g, true, 1); box(0.06, h + 0.06, 0.09, f, -w / 2 - 0.03, h / 2, 0, g); box(0.06, h + 0.06, 0.09, f, w / 2 + 0.03, h / 2, 0, g); box(w + 0.12, 0.06, 0.09, f, 0, h + 0.03, 0, g);
      var hm = metal("#c9ccd0", 0.25); box(0.12, 0.018, 0.03, hm, w / 2 - 0.12, 1.02, 0.05, g); box(0.12, 0.018, 0.03, hm, w / 2 - 0.12, 1.02, -0.05, g); box(0.035, 0.14, 0.012, hm, w / 2 - 0.08, 1.0, 0.032, g); return g; }
    function woodM() { return PM("wood_table_001", { c0: "#5a3a22", r: 0.55, ns: 0.4 }); }
    function lamM() { return PM("laminate_floor_02", { c0: "#c8a77c", r: 0.45, ns: 0.3 }); }
    function wallM(tint) { return PM("plastered_wall_04", { c0: tint || "#e7e2d6", tint: tint || "#efeae0", r: 0.92, ns: 0.5 }); }
    function ceilM() { return PM("ceiling_interior", { c0: "#ecebe6", tint: "#f4f2ee", r: 0.95, ns: 0.6 }); }
    function chair(par, x, z, ry) { var g = new T.Group(), fm = metal("#2f3338", 0.45), sm = M("#2b3442", { roughness: 0.7 }); box(0.42, 0.04, 0.4, sm, 0, 0.46, 0, g, true); box(0.42, 0.34, 0.03, sm, 0, 0.72, -0.2, g, true).rotation.x = -0.08; [[-0.19, -0.18], [0.19, -0.18], [-0.19, 0.18], [0.19, 0.18]].forEach(function (q) { cyl(0.012, 0.46, fm, q[0], 0.23, q[1], g, 8); }); cyl(0.012, 0.32, fm, -0.19, 0.6, -0.19, g, 8); cyl(0.012, 0.32, fm, 0.19, 0.6, -0.19, g, 8); g.position.set(x, 0, z); g.rotation.y = ry || 0; (par || LV).add(g); return g; }
    function table(par, x, z, w, d, top) { var g = new T.Group(), lm = metal("#3a3e44", 0.4); box(w, 0.035, d, top || lamM(), 0, 0.75, 0, g, true, 0.9); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) { box(0.035, 0.73, 0.035, lm, q[0] * (w / 2 - 0.05), 0.365, q[1] * (d / 2 - 0.05), g); }); box(w - 0.12, 0.06, 0.02, lm, 0, 0.69, -d / 2 + 0.05, g); g.position.set(x, 0, z); (par || LV).add(g); return g; }
    /* oameni de rezervă (procedural) – folosiți cât timp se încarcă modelele 3D, pe „grafică redusă” sau dacă modelele nu se pot încărca */
    function person(col, x, z, ry, cap, pants) { var g = new T.Group(), u = M(col, { roughness: 0.85 }), pm = M(pants || "#2f3a2a", { roughness: 0.85 }), sk = M("#d9a982", { roughness: 0.6 }), sh = M("#151515", { roughness: 0.4 });
      var tg = T.CapsuleGeometry ? new T.CapsuleGeometry(0.17, 0.36, 4, 10) : new T.CylinderGeometry(0.17, 0.15, 0.6, 10); geos.push(tg); var tor = new T.Mesh(tg, u); tor.position.set(0, 1.22, 0); tor.scale.set(1, 1, 0.68); if (!low) tor.castShadow = true; g.add(tor);
      [-0.09, 0.09].forEach(function (lx) { var lg = new T.CylinderGeometry(0.075, 0.06, 0.82, 10); geos.push(lg); var l = new T.Mesh(lg, pm); l.position.set(lx, 0.45, 0); if (!low) l.castShadow = true; g.add(l); box(0.11, 0.07, 0.24, sh, lx, 0.035, 0.03, g); });
      var arms = [-0.23, 0.23].map(function (ax) { var pv = new T.Group(); pv.position.set(ax, 1.45, 0); g.add(pv); var ag = new T.CylinderGeometry(0.05, 0.045, 0.56, 8); geos.push(ag); var a = new T.Mesh(ag, u); a.position.y = -0.28; pv.add(a); var hg = new T.SphereGeometry(0.045, 8, 6); geos.push(hg); var hd = new T.Mesh(hg, sk); hd.position.y = -0.58; pv.add(hd); return pv; });
      var h = new T.Group(); h.position.set(0, 1.64, 0); g.add(h); var nk = new T.CylinderGeometry(0.05, 0.055, 0.1, 8); geos.push(nk); var nkm = new T.Mesh(nk, sk); nkm.position.y = -0.08; h.add(nkm); var hg = new T.SphereGeometry(0.105, 16, 12); geos.push(hg); var hm = new T.Mesh(hg, sk); hm.scale.set(0.9, 1.08, 0.98); h.add(hm);
      var hair = new T.SphereGeometry(0.108, 14, 8, 0, Math.PI * 2, 0, 1.3); geos.push(hair); var hrm = new T.Mesh(hair, M("#3a2a1e", { roughness: 0.8 })); hrm.position.set(0, 0.012, -0.008); hrm.scale.set(0.92, 1.04, 1.0); h.add(hrm);
      box(0.018, 0.012, 0.008, "#1b1b1b", -0.036, 0.018, 0.098, h); box(0.018, 0.012, 0.008, "#1b1b1b", 0.036, 0.018, 0.098, h); box(0.016, 0.03, 0.02, sk, 0, -0.005, 0.105, h);
      if (cap) { cyl(0.112, 0.06, cap, 0, 0.09, 0, h, 16); cyl(0.12, 0.03, cap, 0, 0.13, 0, h, 16); box(0.15, 0.008, 0.07, "#151515", 0, 0.065, 0.11, h); }
      g.position.set(x, 0, z); g.rotation.y = ry || 0; g.userData.arms = arms; return { g: g, h: h }; }
    var OUT = { guard: { top: "#4b5535", bot: "#454d30", belt: "#2a2a1a", camo: 1, shoe: "#121212" }, exam: { top: "#4b5535", bot: "#454d30", belt: "#2a2a1a", camo: 1 }, recep: { top: "#2f3e55", bot: "#1f2633" } };
    var CIV = [{ top: "#e8edf3", bot: "#26303f" }, { top: "#3b4b63", bot: "#33415c" }, { top: "#7a2038", bot: "#2b3a55" }, { top: "#4a5b3c", bot: "#2a2f38" }, { top: "#d9d2c3", bot: "#3a3f4a" }, { top: "#1f2937", bot: "#4a5568" }, { top: "#8a6a4a", bot: "#2c3440" }, { top: "#5b6f8f", bot: "#2b2b2b" }];
    var NPCQ = [];
    function npc(spec) { NPCQ.push(spec); }
    /* ================= NIVEL: exteriorul unității ================= */
    function lvOut() {
      ST = { guard: [1.6, 6.2, 2.9, 6.2], barrier: [0, 7.4, 0, 6.2], door: [0, -2.2, 0, -3.6] };
      LBL = { guard: "Punct de control – arată legitimația", barrier: "Bariera", door: "Intrarea în clădire" };
      BND = [-9, 9, -3.4, 11]; FY = null; lights("out", { c: [0, 2], e: 16, d: [-14, 16, 11] });
      var gr = plane(60, 60, PM("leafy_grass", { c0: "#6d7f4e", tint: "#cdd8b0", r: 0.95, ns: 0.8 }), 0, 0, 0, -Math.PI / 2, 0, 2.2);
      plane(5, 22, PM("clean_asphalt", { c0: "#555a5e", r: 0.9, ns: 0.6 }), 0, 0.006, 6, -Math.PI / 2, 0, 3);
      plane(18, 1.6, PM("rectangular_paving", { c0: "#a39c8f", tint: "#e6e1d8", r: 0.85 }), 0, 0.008, -3.2, -Math.PI / 2, 0, 1.4);
      [-2.65, 2.65].forEach(function (x) { box(0.15, 0.12, 22, M("#b9b6ae", { roughness: 0.8 }), x, 0.06, 6, null, false, 1); });
      for (var lm = 0; lm < 6; lm++) box(0.12, 0.004, 1.2, M("#f4f4f0", { roughness: 0.6 }), 0, 0.009, 1 + lm * 2.2);
      /* clădirea */
      var fac = PM("white_plaster_02", { c0: "#d9d4c8", tint: "#ece7dc", r: 0.92, ns: 0.6 });
      box(16, 9, 6, fac, 0, 4.5, -7, null, true, 2.5); box(16.3, 0.3, 6.3, M("#8d939a", { roughness: 0.6, metalness: 0.4 }), 0, 9.05, -7, null, true);
      var gl = M("#1d2d3c", { roughness: 0.06, metalness: 0.85 }), fr = M("#d7dadd", { roughness: 0.35, metalness: 0.5 });
      for (var fl = 0; fl < 3; fl++) for (var wi = 0; wi < 7; wi++) { if (fl === 0 && (wi === 3)) continue; var wx = -6 + wi * 2, wy = 1.9 + fl * 2.6; box(1.6, 1.8, 0.06, gl, wx, wy, -3.97); box(1.7, 0.06, 0.1, fr, wx, wy + 0.92, -3.95); box(1.7, 0.06, 0.1, fr, wx, wy - 0.92, -3.95); box(0.06, 1.8, 0.1, fr, wx - 0.82, wy, -3.95); box(0.06, 1.8, 0.1, fr, wx + 0.82, wy, -3.95); box(0.05, 1.8, 0.08, fr, wx, wy, -3.95); box(1.8, 0.05, 0.25, M("#c9c5bd"), wx, wy - 0.98, -3.85); }
      box(3.6, 2.6, 0.06, M("#203a52", { roughness: 0.08, metalness: 0.8 }), 0, 1.3, -3.96); box(4.6, 0.22, 1.6, metal("#9aa0a6", 0.4), 0, 2.85, -3.3, null, true); [-2.1, 2.1].forEach(function (x) { cyl(0.06, 2.8, metal("#9aa0a6"), x, 1.4, -2.6); });
      box(0.06, 2.5, 0.1, fr, -0.9, 1.25, -3.92); box(0.06, 2.5, 0.1, fr, 0.9, 1.25, -3.92); box(0.06, 2.5, 0.1, fr, 0, 1.25, -3.92);
      var sg = textTex([["SERVICIUL DE TELECOMUNICAȚII SPECIALE", "700 44px Helvetica,Arial", 60], ["Centru de examinare – Bacău", "400 30px Helvetica,Arial", 105]], 1024, 128, "#1f2f46", "#ffffff"); plane(6, 0.75, M("#fff", { map: sg, roughness: 0.4 }), 0, 3.45, -3.93);
      /* pilon de antene (zăbrele) */
      var tw = new T.Group(), tm = metal("#b8bcc0", 0.5), H = 18, base = 1.1, topw = 0.35; for (var lg = 0; lg < 3; lg++) { var a = lg / 3 * Math.PI * 2, a2 = a; var p0 = new T.Vector3(Math.cos(a) * base, 0, Math.sin(a) * base), p1 = new T.Vector3(Math.cos(a2) * topw, H, Math.sin(a2) * topw); var ln = p1.clone().sub(p0), cg = new T.CylinderGeometry(0.045, 0.06, ln.length(), 6); geos.push(cg); var cm = new T.Mesh(cg, tm); cm.position.copy(p0.clone().add(p1).multiplyScalar(0.5)); cm.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), ln.normalize()); if (!low) cm.castShadow = true; tw.add(cm); }
      for (var lv2 = 1; lv2 < 12; lv2++) { var yy = lv2 * H / 12, r = base + (topw - base) * yy / H; var rg = new T.TorusGeometry(r, 0.018, 4, 3); geos.push(rg); var rm = new T.Mesh(rg, tm); rm.rotation.x = Math.PI / 2; rm.position.y = yy; tw.add(rm); }
      var am = M("#f1f3f4", { roughness: 0.5 }); for (var an = 0; an < 3; an++) { var aa = an / 3 * Math.PI * 2 + 0.5; box(0.28, 1.3, 0.1, am, Math.cos(aa) * 0.55, H - 1.2, Math.sin(aa) * 0.55, tw, true).rotation.y = -aa; }
      var dg2 = new T.SphereGeometry(0.45, 16, 8, 0, Math.PI * 2, 0, 1.0); geos.push(dg2); var dish = new T.Mesh(dg2, M("#e5e7eb", { roughness: 0.4, side: T.DoubleSide })); dish.position.set(0.5, H - 4, 0.4); dish.rotation.set(-Math.PI / 2 + 0.1, 0, -0.8); tw.add(dish); cyl(0.03, 3, tm, 0, H + 1.5, 0, tw, 6);
      tw.position.set(6.8, 9, -7.5); LV.add(tw);
      /* steaguri */
      [-1.4, 1.4].forEach(function (x, i) { cyl(0.045, 7, metal("#d1d5db", 0.3), x - 5, 3.5, -2.5, null, 10); var fg = ctex(192, 128, function (c) { (i ? ["#003399", "#003399", "#003399"] : ["#002b7f", "#fcd116", "#ce1126"]).forEach(function (col, k) { c.fillStyle = col; c.fillRect(k * 64, 0, 64, 128); }); if (i) { c.fillStyle = "#ffcc00"; for (var s = 0; s < 12; s++) { var a = s / 12 * Math.PI * 2; c.beginPath(); c.arc(96 + Math.cos(a) * 40, 64 + Math.sin(a) * 40, 5, 0, 7); c.fill(); } } });
        var fgg = new T.PlaneGeometry(1.2, 0.8, 12, 4); geos.push(fgg); var fpp = fgg.attributes.position; for (var q = 0; q < fpp.count; q++) fpp.setZ(q, Math.sin(fpp.getX(q) * 4) * 0.05 * (fpp.getX(q) + 0.6)); fgg.computeVertexNormals(); var fm2 = new T.Mesh(fgg, M("#fff", { map: fg, side: T.DoubleSide, roughness: 0.8 })); fm2.position.set(x - 5 + 0.62, 6.4, -2.5); if (!low) fm2.castShadow = true; LV.add(fm2); });
      /* gard */
      var fenT = ctex(256, 256, function (c) { c.clearRect(0, 0, 256, 256); c.strokeStyle = "#5b6470"; c.lineWidth = 5; for (var i = -256; i < 512; i += 32) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i + 256, 256); c.stroke(); c.beginPath(); c.moveTo(i + 256, 0); c.lineTo(i, 256); c.stroke(); } }); fenT.wrapS = fenT.wrapT = T.RepeatWrapping; fenT.repeat.set(6, 1.6);
      var fenM = M("#ffffff", { map: fenT, alphaTest: 0.4, transparent: false, side: T.DoubleSide, roughness: 0.5, metalness: 0.6 });
      [[-6, 6.6], [6, 6.6]].forEach(function (q) { var f = plane(q[1], 1.6, fenM, q[0], 0.85, 7.6, 0, 0); f.castShadow = !low; });
      for (var fx = -9; fx <= 9; fx += 1.5) if (Math.abs(fx) > 3) { cyl(0.035, 1.75, metal("#4b5563"), fx, 0.875, 7.6, null, 8); }
      box(6.6, 0.04, 0.04, metal("#4b5563"), -6, 1.65, 7.6); box(6.6, 0.04, 0.04, metal("#4b5563"), 6, 1.65, 7.6); solid(-9, 7.5, -2.6, 7.7); solid(2.6, 7.5, 9, 7.7);
      /* ghereta paznicului */
      var gb = new T.Group(), gw = PM("white_plaster_02", { c0: "#e5e7eb", tint: "#f3f1ec", r: 0.9 }), gsl = M("#a9c4d6", { transparent: true, opacity: 0.22, roughness: 0.05, depthWrite: false });
      box(0.08, 2.4, 1.8, gw, 0.86, 1.2, 0, gb, true, 1); box(1.8, 2.4, 0.08, gw, 0, 1.2, -0.86, gb, true, 1); box(1.8, 2.4, 0.08, gw, 0, 1.2, 0.86, gb, true, 1); box(0.08, 1.0, 1.8, gw, -0.86, 0.5, 0, gb, true, 1); box(0.08, 0.5, 1.8, gw, -0.86, 2.15, 0, gb, true, 1);
      box(0.03, 0.9, 1.64, gsl, -0.86, 1.45, 0, gb); box(0.45, 0.05, 1.5, M("#7c858f", { roughness: 0.4, metalness: 0.5 }), -1.02, 1.02, 0, gb, true); box(2.1, 0.16, 2.1, metal("#8d949b", 0.5), 0, 2.48, 0, gb, true); box(1.7, 0.02, 1.7, "#cbd5e1", 0, 0.01, 0, gb);
      box(0.6, 0.75, 0.5, lamM(), 0.4, 0.38, 0.4, gb, true); box(0.3, 0.22, 0.03, M("#111", { emissive: "#173a5e", emissiveIntensity: 0.6 }), 0.4, 0.88, 0.3, gb);
      var gtx = textTex([["POARTĂ – CONTROL ACCES", "700 40px Helvetica,Arial", 60]], 512, 96, "#7f1d1d", "#ffffff"); var gp = new T.Mesh(new T.PlaneGeometry(1.6, 0.3), M("#fff", { map: gtx, roughness: 0.5 })); geos.push(gp.geometry); gp.position.set(-0.91 - 0.01, 2.2, 0); gp.rotation.y = -Math.PI / 2; gb.add(gp);
      gb.position.set(3.4, 0, 6.2); station("guard", gb); solid(2.5, 5.3, 4.3, 7.1);
      var gd = person("#4b5535", 2.75, 6.2, -Math.PI / 2, "#3d4429", "#454d30"); LV.add(gd.g); NPC = gd.g; HEAD = gd.h; PROXY.push(gd.g);
      npc({ main: 1, x: 2.75, z: 6.2, ry: -Math.PI / 2, outfit: OUT.guard, hair: "Hair_Buzzed", cap: "#3d4429", look: 1 });
      npc({ x: -7.6, z: 9.6, path: [[-7.6, 9.6], [-3.6, 9.6], [-3.6, 8.9], [-7.6, 8.9]], anim: "walk", outfit: OUT.guard, hair: "Hair_Buzzed", cap: "#3d4429", speed: 1.0 });
      /* bariera */
      var br = new T.Group(); box(0.3, 1.0, 0.3, M("#e5b80b", { roughness: 0.5 }), -2.2, 0.5, 0, br, true); box(0.36, 0.06, 0.36, metal("#555"), -2.2, 0.03, 0, br); var arm = new T.Group(); arm.position.set(-2.2, 0.95, 0); br.add(arm);
      var bt = ctex(512, 32, function (c) { for (var i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#f4f4f4" : "#d01f1f"; c.fillRect(i * 64, 0, 64, 32); } }); box(4.4, 0.08, 0.08, M("#fff", { map: bt, roughness: 0.45 }), 2.225, 0, 0, arm, true); BAR = arm;
      br.position.set(0, 0, 6.0); station("barrier", br); BARSOLID = [-2.6, 5.9, 2.6, 6.1]; solids.push(BARSOLID);
      var dg = new T.Group(); box(1.6, 2.4, 0.08, M("#2a4560", { roughness: 0.1, metalness: 0.7 }), 0, 1.2, 0, dg); box(0.04, 0.5, 0.05, metal("#d0d3d6", 0.2), 0.6, 1.1, 0.07, dg); dg.position.set(0, 0, -3.92); station("door", dg);
      label("guard", 3.4, 2.9, 6.2); label("barrier", 0, 1.6, 6.0); label("door", 0, 3.0, -3.6);
      /* copaci */
      var bark = M("#5a4632", { roughness: 0.95 }), leafC = ["#3d5f2e", "#4a6b33", "#365428"];
      for (var tr = 0; tr < 8; tr++) { var tx = (tr % 2 ? -1 : 1) * (5 + (tr % 4) * 1.2), tz = 1 + tr * 1.1; cyl(0.1, 2.0, bark, tx, 1.0, tz, null, 8, 0.14).castShadow = !low;
        for (var bl = 0; bl < 4; bl++) { var ig = new T.IcosahedronGeometry(0.75 - bl * 0.08, 1); geos.push(ig); var lp = ig.attributes.position; for (var vi = 0; vi < lp.count; vi++) { var f = 1 + Math.sin(lp.getX(vi) * 7 + tr) * 0.08 + Math.cos(lp.getZ(vi) * 6) * 0.08; lp.setXYZ(vi, lp.getX(vi) * f, lp.getY(vi) * f, lp.getZ(vi) * f); } ig.computeVertexNormals(); var lf = new T.Mesh(ig, mc(leafC[(tr + bl) % 3])); lf.position.set(tx + Math.sin(bl * 2.1) * 0.35, 2.3 + bl * 0.45, tz + Math.cos(bl * 2.1) * 0.35); if (!low) lf.castShadow = true; LV.add(lf); }
        solid(tx - 0.2, tz - 0.2, tx + 0.2, tz + 0.2); }
    }
    /* ================= NIVEL: holul clădirii ================= */
    function lvHall() {
      ST = { desk: [2.2, 3.0, 3.4, 3.0], up: [0, -5.0, 0, -6.3] };
      LBL = { desk: "Recepție – registrul candidaților", up: "Etajul 1 – Sala de examen" };
      BND = [-3.7, 3.7, -6.2, 4.6]; lights("in", { c: [0, 0], e: 10, d: [-12, 11, 5] });
      FY = function (x, z) { if (z < -0.2 && z > -4.2) return Math.min(2.8, (-0.2 - z) / 4 * 2.8); if (z <= -4.2) return 2.8; return 0; };
      var mar = PM("marble_tiles", { c0: "#d2cdc3", tint: "#f2efe9", r: 0.35, ns: 0.4, rm: 1 });
      plane(8, 5, mar, 0, 0, 2.3, -Math.PI / 2, 0, 1.6);
      var wl = wallM("#ece6d8");
      box(8, 6, 0.1, wl, 0, 3, 4.85, null, true, 2); wallZ(-3.85, -6.4, 4.8, 6, 0.1, wl, [[2.3, 1.8, 0.9, 2.6], [-3.0, 1.6, 3.8, 5.4]], 2); box(0.1, 6, 11.2, wl, 3.85, 3, -0.8, null, true, 2); box(8, 6, 0.1, wl, 0, 3, -6.45, null, true, 2); box(8, 0.1, 11.2, ceilM(), 0, 6, -0.8, null, true, 2);
      skirting([[0, 4.79, 7.6, 0.03], [3.79, 2.3, 0.03, 5]]);
      var stepM = PM("marble_tiles", { c0: "#cfc9bf", tint: "#e9e5de", r: 0.35, ns: 0.3 }), rise = M("#bdb6a8", { roughness: 0.6 });
      for (var s = 0; s < 14; s++) { var y = (s + 1) * 0.2, z = -0.2 - s * 0.286; box(2.2, y, 0.29, rise, 0, y / 2, z - 0.143, null, true); box(2.24, 0.025, 0.31, stepM, 0, y + 0.012, z - 0.143, null, false, 1); }
      box(2.2, 0.2, 2.2, stepM, 0, 2.7, -5.3, null, true, 1);
      var rail = metal("#b8bdc2", 0.25); [-1.15, 1.15].forEach(function (x) { var r = box(0.05, 0.05, 4.9, rail, x, 1.95, -2.15); r.rotation.x = Math.atan2(2.8, 4.0); for (var pp = 0; pp < 6; pp++) { var zz = -0.3 - pp * 0.75, yy = Math.min(2.8, (-0.2 - zz) / 4 * 2.8); cyl(0.015, 0.95, rail, x, yy + 0.47, zz, null, 6); } });
      solids.push([-3.9, -6.5, -1.1, -0.2]); solids.push([1.1, -6.5, 3.9, -0.2]);
      box(2.7, 2.6, 0.1, wl, -2.5, 1.3, -0.25, null, true, 2); box(2.7, 2.6, 0.1, wl, 2.5, 1.3, -0.25, null, true, 2);
      var dsk = new T.Group(), wd = woodM(); box(0.6, 1.05, 2.0, wd, 0, 0.52, 0, dsk, true, 1); box(0.72, 0.04, 2.1, M("#e9e4da", { roughness: 0.3 }), 0, 1.07, 0, dsk, true); box(0.3, 0.02, 0.4, "#f8fafc", 0, 1.1, 0.3, dsk);
      box(0.05, 0.3, 0.45, M("#16181c", { roughness: 0.3 }), 0.25, 1.3, -0.4, dsk); box(0.01, 0.26, 0.41, M("#0d2a46", { emissive: "#1e4f80", emissiveIntensity: 0.7 }), 0.22, 1.3, -0.4, dsk);
      dsk.position.set(3.2, 0, 3.0); station("desk", dsk); solid(2.85, 1.9, 3.6, 4.1);
      var rc = person("#2f3e55", 3.6, 3.0, -Math.PI / 2, null, "#1f2633"); LV.add(rc.g); NPC = rc.g; HEAD = rc.h; PROXY.push(rc.g);
      npc({ main: 1, x: 3.62, z: 3.0, ry: -Math.PI / 2, sex: "f", outfit: OUT.recep, look: 1 });
      npc({ x: -2.7, z: 3.9, path: [[-2.7, 3.9], [-2.7, 0.6]], anim: "walk", outfit: CIV[1], speed: 0.95 });
      var dr = door(1.2, 2.2, woodM()); var dtx = textTex([["SALA 12 – PROBA TEORETICĂ", "700 36px Helvetica,Arial", 58]], 512, 90, "#183153", "#fff"); var dp = new T.Mesh(new T.PlaneGeometry(1.3, 0.23), M("#fff", { map: dtx, roughness: 0.4 })); geos.push(dp.geometry); dp.position.set(0, 2.5, 0.04); dr.add(dp); dr.position.set(0, 2.8, -6.38); station("up", dr);
      var ht = textTex([["↑ Etajul 1: Săli de examen", "600 40px Helvetica,Arial", 60]], 768, 96, "#14532d", "#fff"); plane(2.4, 0.3, M("#fff", { map: ht, roughness: 0.4 }), 0, 2.6, -0.19);
      var nb = ctex(512, 360, function (c, w, h) { c.fillStyle = "#b58b5a"; c.fillRect(0, 0, w, h); noise(c, w, h, 900, 0.12); [["#fff", 30, 30, 200, 140, "ANUNȚ – Concurs STS"], ["#fef3c7", 260, 40, 220, 120, "Program probe"], ["#e0f2fe", 40, 200, 180, 130, "Reguli examen"], ["#fff", 250, 190, 230, 140, "Legitimația + buletinul"]].forEach(function (p) { c.fillStyle = p[0]; c.fillRect(p[1], p[2], p[3], p[4]); c.fillStyle = "#1f2937"; c.font = "700 20px Helvetica,Arial"; c.fillText(p[5], p[1] + 10, p[2] + 30); c.font = "14px Helvetica,Arial"; for (var l = 0; l < 4; l++) c.fillRect(p[1] + 10, p[2] + 50 + l * 18, p[3] - 30 - (l % 2) * 30, 4); c.fillStyle = "#dc2626"; c.beginPath(); c.arc(p[1] + p[3] / 2, p[2] + 6, 5, 0, 7); c.fill(); }); });
      plane(1.4, 1.0, M("#fff", { map: nb, roughness: 0.8 }), 3.79, 1.6, 0.6, 0, -Math.PI / 2);
      cyl(0.08, 0.5, M("#c81e1e", { roughness: 0.35 }), 3.65, 0.25, -0.05, null, 12); var pot = cyl(0.22, 0.45, M("#6b4f3a", { roughness: 0.8 }), -3.3, 0.22, 4.2, null, 14, 0.17); var ib = new T.IcosahedronGeometry(0.45, 1); geos.push(ib); var plt = new T.Mesh(ib, mc("#3d6b35")); plt.position.set(-3.3, 0.95, 4.2); plt.scale.set(1, 1.3, 1); plt.castShadow = !low; LV.add(plt); solid(-3.55, 3.95, -3.05, 4.45);
      ceilingLights([[0, 2.3, 1.2, 0.6], [2.2, 3.4, 1.2, 0.6], [-2.2, 3.4, 1.2, 0.6]], 5.95);
      label("desk", 3.2, 2.0, 3.0); label("up", 0, 5.2, -6.0);
    }
    /* ================= NIVEL: sala 12 – proba teoretică ================= */
    function lvTheory() {
      ST = { mydesk: [-1.2, 1.3, -1.2, 0.6], examiner: [0, -2.6, 0, -3.8], door: [3.6, -3.4, 4.3, -3.4] };
      LBL = { mydesk: "Locul tău – începe proba teoretică", examiner: "Comisia (examinatorul)", door: "Ușa spre sala de practică" };
      BND = [-4.2, 4.2, -4.6, 4.6]; FY = null; lights("in", { c: [0, 0], e: 8, d: [-12, 9, 4] });
      plane(9, 9.6, PM("laminate_floor_02", { c0: "#b49a74", tint: "#e8dcc8", r: 0.5, ns: 0.4, rm: 1 }), 0, 0, 0, -Math.PI / 2, 0, 1.8);
      var wl = wallM("#e9e1cf"); box(9, 3, 0.1, wl, 0, 1.5, -4.85, null, true, 2); box(9, 3, 0.1, wl, 0, 1.5, 4.85, null, true, 2);
      wallZ(-4.55, -4.8, 4.8, 3, 0.1, wl, [[-2.5, 1.6, 0.9, 2.4], [0.1, 1.6, 0.9, 2.4], [2.7, 1.6, 0.9, 2.4]], 2); box(0.1, 3, 9.6, wl, 4.55, 1.5, 0, null, true, 2); box(9.2, 0.1, 9.8, ceilM(), 0, 3.05, 0, null, true, 2);
      skirting([[0, -4.79, 9, 0.03], [0, 4.79, 9, 0.03], [4.49, 0, 0.03, 9.6]]);
      box(4.2, 1.25, 0.04, M("#f5f6f4", { roughness: 0.25 }), 0, 1.75, -4.79); box(4.3, 0.05, 0.1, metal("#aeb3b8"), 0, 1.1, -4.75);
      var bt = textTex([["PROBA TEORETICĂ", "700 60px Helvetica,Arial", 80], ["18 întrebări grilă + teste psihologice · nota minimă 7", "400 30px Helvetica,Arial", 130]], 1024, 170, "#f8fafc", "#183153"); plane(3.4, 0.6, M("#fff", { map: bt, roughness: 0.3 }), 0, 1.95, -4.76);
      CLOCK = ctex(128, 128, function () {}); plane(0.42, 0.42, M("#fff", { map: CLOCK, roughness: 0.3 }), 2.6, 2.45, -4.79); drawClock();
      var k = 0; for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) { var x = -2.6 + c * 2.6, z = 0.3 + r * 1.6; var d = table(null, x, z, 1.0, 0.55); box(0.21, 0.002, 0.297, "#f8fafc", 0, 0.77, 0, d); chair(null, x, z + 0.5, Math.PI);
        solid(x - 0.55, z - 0.3, x + 0.55, z + 0.75); if (r > 0 || c !== 0) { var cand = person(CIV[k % CIV.length].top, x, z + 0.55, Math.PI, null, CIV[k % CIV.length].bot); cand.g.scale.set(1, 0.82, 1); LV.add(cand.g); PROXY.push(cand.g); npc({ x: x, z: z + 0.52, ry: Math.PI, anim: "sit", seatY: 0.48, sex: k % 3 === 1 ? "f" : "m", outfit: CIV[k % CIV.length], hair: k % 3 === 1 ? "Hair_Long" : (k % 2 ? "Hair_Buzzed" : "Hair_SimpleParted"), shadow: HI || k < 4 }); k++; } }
      var my = new T.Group(); box(1.0, 0.035, 0.55, lamM(), 0, 0.75, 0, my, true, 0.9); [[-0.45, -0.22], [0.45, -0.22], [-0.45, 0.22], [0.45, 0.22]].forEach(function (q) { box(0.035, 0.73, 0.035, metal("#3a3e44"), q[0], 0.365, q[1], my); }); box(0.21, 0.002, 0.297, "#ffffff", 0, 0.77, 0, my); box(0.14, 0.006, 0.006, "#1d4ed8", 0.15, 0.776, 0.05, my); my.position.set(-1.2, 0, 0.3); station("mydesk", my); solid(-1.72, 0.02, -0.68, 0.58); chair(null, -1.2, 0.8, Math.PI);
      var cm = new T.Group(); box(2.4, 0.04, 0.8, woodM(), 0, 0.75, 0, cm, true, 1); box(2.3, 0.7, 0.04, woodM(), 0, 0.38, -0.38, cm, true, 1); box(0.04, 0.73, 0.76, woodM(), -1.15, 0.37, 0, cm); box(0.04, 0.73, 0.76, woodM(), 1.15, 0.37, 0, cm); box(0.16, 0.22, 0.01, "#a16207", 0.3, 0.77, 0.1, cm).rotation.x = -Math.PI / 2; box(0.3, 0.02, 0.22, "#f1f1ee", -0.5, 0.775, 0.05, cm);
      cm.position.set(0, 0, -3.6); station("examiner", cm); solid(-1.25, -4.05, 1.25, -3.15); chair(null, 0.8, -4.2, 0);
      var ex = person("#4b5535", 0, -4.2, 0, "#3d4429", "#454d30"); LV.add(ex.g); NPC = ex.g; HEAD = ex.h; PROXY.push(ex.g);
      npc({ main: 1, x: 0, z: -4.25, ry: 0, outfit: OUT.exam, hair: "Hair_Buzzed", look: 1 });
      npc({ x: 0.8, z: -4.25, ry: 0, anim: "sit", seatY: 0.48, sex: "f", outfit: { top: "#4b5535", bot: "#454d30", camo: 1 }, hair: "Hair_Long" });
      var dr = door(1.0, 2.1, woodM()); dr.rotation.y = -Math.PI / 2; var drg = new T.Group(); drg.add(dr); drg.position.set(4.5, 0, -3.4); station("door", drg);
      ceilingLights([[-2.2, -2, 1.2, 0.6], [2.2, -2, 1.2, 0.6], [-2.2, 2, 1.2, 0.6], [2.2, 2, 1.2, 0.6]], 3.0);
      label("mydesk", -1.2, 1.4, 0.3); label("examiner", 0, 2.3, -3.6); label("door", 4.3, 2.5, -3.4);
    }
    var CLOCK = null, CLOCKTXT = "", CLOCKSET = null;
    function drawClock() { if (!CLOCK) return; var c = CLOCK.image.getContext("2d"), d = new Date(); c.clearRect(0, 0, 128, 128); c.fillStyle = "#fff"; c.beginPath(); c.arc(64, 64, 60, 0, 7); c.fill(); c.strokeStyle = "#111"; c.lineWidth = 5; c.stroke(); for (var i = 0; i < 12; i++) { var a = i / 6 * Math.PI; c.fillStyle = "#111"; c.fillRect(64 + Math.sin(a) * 50 - 2, 64 - Math.cos(a) * 50 - 2, 4, 4); } var hh = (d.getHours() % 12 + d.getMinutes() / 60) / 6 * Math.PI, mm = d.getMinutes() / 30 * Math.PI; c.lineCap = "round"; c.lineWidth = 6; c.beginPath(); c.moveTo(64, 64); c.lineTo(64 + Math.sin(hh) * 30, 64 - Math.cos(hh) * 30); c.stroke(); c.lineWidth = 4; c.beginPath(); c.moveTo(64, 64); c.lineTo(64 + Math.sin(mm) * 44, 64 - Math.cos(mm) * 44); c.stroke(); if (CLOCKTXT) { c.fillStyle = "#b91c1c"; c.font = "bold 18px monospace"; c.textAlign = "center"; c.fillText(CLOCKTXT, 64, 100); } CLOCK.needsUpdate = true; }
    /* panouri: SVG (aceleași coordonate ca în 2D) + porturi RJ45 reale (foto) suprapuse */
    var PIMG = {}; function pimg(src, cb) { var e = PIMG[src]; if (!e) { e = PIMG[src] = { im: new Image(), ok: false, w: [] }; e.im.onload = function () { e.ok = true; e.w.splice(0).forEach(function (f) { f(); }); }; e.im.onerror = function () { e.bad = true; e.w.splice(0).forEach(function (f) { f(); }); }; e.im.src = src; } if (e.ok || e.bad) cb(); else e.w.push(cb); }
    function svgTex(svg, w, h, key) { if (UL && w <= 2048) { w *= 2; h *= 2; } var c = document.createElement("canvas"); c.width = w; c.height = h; var t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 8; texs.push(t); var im = new Image();
      im.onload = function () { try { var x = c.getContext("2d"); x.drawImage(im, 0, 0, w, h); var L = key && window.JGP && window.JGP.L[key]; if (L) { var sx = w / L.w, sy = h / L.h; pimg("img3d/rjt.webp", function () { pimg("img3d/rjb.webp", function () { Object.keys(L.p).forEach(function (pid) { var p = L.p[pid]; if (p[2] !== "rj" || pid === "con") return; var e = PIMG[p[3] === "b" ? "img3d/rjb.webp" : "img3d/rjt.webp"]; if (!e || !e.ok) return; x.drawImage(e.im, (p[0] - 1.5) * sx, (p[1] - 1.5) * sy, 25 * sx, 22 * sy); }); x.globalAlpha = 0.06; for (var k = 0; k < 2500; k++) { x.fillStyle = Math.random() < 0.5 ? "#000" : "#fff"; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); } x.globalAlpha = 1; t.needsUpdate = true; }); }); } t.needsUpdate = true; } catch (e) {} };
      im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); return t; }
    function panelLeds(dev, key, grp, w, h, pw, ph, flip, z) { var L = window.JGP.L[key]; Object.keys(L.p).forEach(function (pid) { var p = L.p[pid]; var u = (p[0] + 11) / L.w, v = (p[1] + 9) / L.h; var x = (u - 0.5) * pw * (flip ? -1 : 1), y = (0.5 - v) * ph; var a = new T.Object3D(); a.position.set(x, y, z + (flip ? -0.03 : 0.03)); grp.add(a); anchors[dev + "." + pid] = a;
      if (p[2] === "rj" || dev === "r") { var lid = dev + "." + pid; if (key !== "swr" && (p[2] === "rj")) { var vy = (0.5 - (p[3] === "t" ? p[1] - 5 : p[1] + 25) / L.h) * ph; if (dev === "r") vy = (0.5 - (p[1] - 6) / L.h) * ph; var lx = dev === "r" ? ((p[0] + 4) / L.w - 0.5) * pw * (flip ? -1 : 1) : x; var lm = box(0.006, 0.004, 0.004, M("#2b2f36"), lx, vy, z + (flip ? -0.002 : 0.002), grp); leds[lid] = lm; } } }); }
    /* ================= NIVEL: sala de practică ================= */
    function lvPrac() {
      ST = { rack: [0, -4.6, 0, -5.45], desk: [-2.6, -1.7, -2.6, -2.55], bench: [2.6, -1.7, 2.6, -2.55], fiber: [2.6, 1.6, 2.6, 0.8], box: [2.9, 3.0, 2.9, 3.75], examiner: [-1.35, 0.2, -2.8, 0.2], gate: [0, 5.2, 0, 5.85] };
      LBL = { gate: "Ușa – înapoi", rack: "Masa cu echipamente: switch 2960 + router 1941", desk: "Laptop", bench: "Banc de mufare RJ45", fiber: "Fibră optică – măsurători", box: "Cutia cu cabluri", examiner: "Examinator" };
      BND = [-4.2, 4.2, -5.7, 5.7]; FY = null; lights("in", { c: [0, 0], e: 9, d: [-12, 9, 3] });
      var fl = plane(9, 12, PM("terrazzo_tiles", { c0: "#a9a69f", tint: "#d4d2cc", r: 0.4, ns: 0.3, rm: 1 }), 0, 0, 0, -Math.PI / 2, 0, 1.5);
      var wall = wallM("#e4dfd2"), wall2 = wallM("#dcd7c8");
      box(9, 3, 0.1, wall, 0, 1.5, -6.05, null, true, 2); box(9, 3, 0.1, wall2, 0, 1.5, 6.05, null, true, 2); wallZ(-4.55, -6, 6, 3, 0.1, wall2, [[2.0, 1.4, 0.9, 2.4], [4.2, 1.4, 0.9, 2.4], [-4.6, 1.2, 0.9, 2.4]], 2); box(0.1, 3, 12, wall, 4.55, 1.5, 0, null, true, 2);
      box(9.2, 0.1, 12.2, ceilM(), 0, 3.05, 0, null, true, 2); skirting([[0, -5.99, 9, 0.03], [0, 5.99, 9, 0.03], [4.49, 0, 0.03, 12]]);
      ceilingLights([[0, -3.5], [0, 0], [0, 3.5], [-2.6, -2], [2.6, -2]], 3.0);
      var sign = ctex(1024, 160, function (c, w, h) { c.fillStyle = "#183153"; c.fillRect(0, 0, w, h); c.fillStyle = "#fff"; c.font = "700 64px Helvetica,Arial"; c.textAlign = "center"; c.fillText("SALA DE EXAMEN – PROBA PRACTICĂ", w / 2, 84); c.font = "400 34px Helvetica,Arial"; c.fillText("Serviciul de Telecomunicații Speciale", w / 2, 132); });
      var sg = new T.PlaneGeometry(3.2, 0.5); geos.push(sg); var sm = new T.Mesh(sg, M("#fff", { map: sign, roughness: 0.4 })); sm.position.set(0, 2.55, -5.99); LV.add(sm);
      var flag = ctex(192, 128, function (c) { ["#002b7f", "#fcd116", "#ce1126"].forEach(function (col, i) { c.fillStyle = col; c.fillRect(i * 64, 0, 64, 128); }); });
      var fgg = new T.PlaneGeometry(0.9, 0.6); geos.push(fgg); var fm = new T.Mesh(fgg, M("#fff", { map: flag, roughness: 0.8 })); fm.position.set(-4.49, 2.1, -3); fm.rotation.y = Math.PI / 2; LV.add(fm);
      box(0.02, 1.1, 2.0, M("#f8fafc", { roughness: 0.2 }), 4.49, 1.6, -0.5); box(0.03, 1.16, 2.06, metal("#9ca3af"), 4.5, 1.6, -0.5); box(0.06, 0.03, 1.2, metal("#9ca3af"), 4.45, 1.03, -0.5);
      var wbt = ctex(512, 280, function (c, w, h) { c.clearRect(0, 0, w, h); c.strokeStyle = "#1d4ed8"; c.lineWidth = 3; c.font = "26px 'Comic Sans MS',Helvetica"; c.fillStyle = "#1d4ed8"; c.fillText("T568B: alb-portocaliu, portocaliu,", 20, 50); c.fillText("alb-verde, albastru, alb-albastru,", 20, 85); c.fillText("verde, alb-maro, maro", 20, 120); c.fillStyle = "#b91c1c"; c.fillText("PuTTY: Serial · COM3 · 9600", 20, 175); c.fillStyle = "#15803d"; c.fillText("ssh -l admin <IP>", 20, 225); });
      var wbm = new T.Mesh(new T.PlaneGeometry(1.9, 1.04), M("#fff", { map: wbt, transparent: true, roughness: 0.3 })); geos.push(wbm.geometry); wbm.position.set(4.475, 1.6, -0.5); wbm.rotation.y = -Math.PI / 2; LV.add(wbm);
      box(0.25, 0.08, 10, metal("#8b9096", 0.5), 4.3, 2.75, 0); box(10, 0.08, 0.25, metal("#8b9096", 0.5), 0, 2.75, -5.7);
      /* dulapuri de rețea pe perete, cu echipamente reale (foto) în spatele ușii de sticlă */
      function wallCab(img, w, h, x, y, z, ry) { var g = new T.Group(), body = metal("#2e3238", 0.5); box(w + 0.06, h + 0.06, 0.45, body, 0, 0, -0.2, g, true); var pg = new T.PlaneGeometry(w, h); geos.push(pg); var ph = new T.Mesh(pg, PH(img, { r: 0.7 })); ph.position.z = 0.0; g.add(ph);
        var dg = new T.Mesh(pg, M("#b9cfdc", { transparent: true, opacity: 0.12, roughness: 0.03, metalness: 0.2, depthWrite: false })); dg.position.z = 0.035; g.add(dg); box(w + 0.06, 0.03, 0.05, body, 0, h / 2 + 0.015, 0.03, g); box(w + 0.06, 0.03, 0.05, body, 0, -h / 2 - 0.015, 0.03, g); box(0.03, h, 0.05, body, -w / 2 - 0.015, 0, 0.03, g); box(0.03, h, 0.05, body, w / 2 + 0.015, 0, 0.03, g); box(0.02, 0.12, 0.03, metal("#c7cbd0", 0.2), w / 2 - 0.04, 0, 0.06, g);
        g.position.set(x, y, z); g.rotation.y = ry || 0; LV.add(g); return g; }
      wallCab("img3d/rack_a.webp", 0.74, 0.63, 4.27, 1.75, -3.7, -Math.PI / 2); wallCab("img3d/rack_b.webp", 0.78, 0.65, -3.3, 1.75, -5.77, 0);
      var sc = new T.Group(), scm = metal("#25292e", 0.55); box(0.62, 2.0, 0.8, scm, 0, 1.0, 0, sc, true); var pf = ctex(128, 512, function (c, w, h) { c.fillStyle = "#30353b"; c.fillRect(0, 0, w, h); c.fillStyle = "#15181b"; for (var yy = 6; yy < h; yy += 9) for (var xx = 6; xx < w; xx += 9) c.fillRect(xx, yy, 5, 5); }); var pfm = new T.Mesh(new T.PlaneGeometry(0.56, 1.9), M("#fff", { map: pf, roughness: 0.5, metalness: 0.6 })); geos.push(pfm.geometry); pfm.position.set(0, 1.0, 0.401); sc.add(pfm); box(0.02, 0.2, 0.03, metal("#c7cbd0", 0.2), 0.24, 1.1, 0.42, sc);
      for (var sl = 0; sl < 5; sl++) { var ld = box(0.012, 0.012, 0.005, M("#22c55e", { emissive: "#22c55e", emissiveIntensity: 2 }), -0.2 + sl * 0.03, 1.85, 0.405, sc); ld.receiveShadow = false; }
      sc.position.set(3.75, 0, -5.45); LV.add(sc); solid(3.42, -5.88, 4.08, -5.02);
      /* masa cu echipamentele (rack deschis 19") */
      function panelM(tex) { return M("#fff", { map: tex, roughness: 0.42, metalness: 0.35 }); }
      var rk = new T.Group(), post = metal("#17191c", 0.45);
      var holes = ctex(32, 512, function (c, w, h) { c.fillStyle = "#1b1d21"; c.fillRect(0, 0, w, h); c.fillStyle = "#050506"; for (var yy = 4; yy < h; yy += 10.6) c.fillRect(12, yy, 8, 6); }); var holeM = M("#fff", { map: holes, roughness: 0.45, metalness: 0.6 });
      [[-0.3, -0.25], [0.3, -0.25], [-0.3, 0.49], [0.3, 0.49]].forEach(function (q) { box(0.04, 1.95, 0.04, q[1] > 0 ? holeM : post, q[0], 0.975, q[1], rk, true); }); box(0.64, 0.04, 0.78, post, 0, 1.95, 0.12, rk, true); box(0.64, 0.06, 0.78, post, 0, 0.03, 0.12, rk, true); box(0.6, 1.9, 0.02, metal("#23262a", 0.6), 0, 0.95, -0.26, rk, true); [-0.245, 0.245].forEach(function (x) { box(0.02, 0.6, 0.02, metal("#9ca3af", 0.3), x, 1.25, 0.47, rk); });
      for (var ru = 0; ru < 3; ru++) { box(0.45, 0.044, 0.3, metal("#2e353d", 0.4), 0, 0.5 + ru * 0.06, 0.32, rk, true); for (var lv3 = 0; lv3 < 6; lv3++) box(0.006, 0.004, 0.002, M("#22c55e", { emissive: "#16a34a", emissiveIntensity: 2 }), -0.15 + lv3 * 0.012, 0.51 + ru * 0.06, 0.471, rk); }
      var swBody = metal("#3a4757", 0.42);
      var sw = new T.Group(); sw.position.set(0, 1.32, 0.45); rk.add(sw);
      box(0.445, 0.044, 0.25, swBody, 0, 0, -0.12, sw, true); box(0.483, 0.044, 0.003, swBody, 0, 0, 0.002, sw);
      var swf = new T.PlaneGeometry(0.445, 0.044 * 0.98); geos.push(swf); var FT = svgTex(window.JGP.switchFront({ noimg: 1 }), 2048, 210, "swf"), RT = svgTex(window.JGP.switchRear({ noimg: 1 }), 2048, 210, "swr");
      var swfm = new T.Mesh(swf, panelM(FT)); swfm.position.z = 0.0051; sw.add(swfm);
      panelLeds("sw", "swf", sw, 0, 0, 0.445, 0.044, false, 0.0051);
      var swr = new T.Mesh(swf, panelM(RT)); swr.position.z = -0.2451; swr.rotation.y = Math.PI; sw.add(swr);
      panelLeds("sw", "swr", sw, 0, 0, 0.445, 0.044, true, -0.2451);
      var syst = box(0.006, 0.004, 0.004, M("#2b2f36"), (128 / 880 - 0.5) * 0.445, (0.5 - 18 / 90) * 0.044, 0.007, sw); leds["sw.syst"] = syst;
      var s2 = new T.Group(); s2.position.set(0, 1.5, 0.45); rk.add(s2); box(0.445, 0.044, 0.25, swBody, 0, 0, -0.12, s2, true); box(0.483, 0.044, 0.003, swBody, 0, 0, 0.002, s2);
      var s2f = new T.Mesh(swf, panelM(FT)); s2f.position.z = 0.0051; s2.add(s2f); panelLeds("s2", "swf", s2, 0, 0, 0.445, 0.044, false, 0.0051);
      var s2r = new T.Mesh(swf, panelM(RT)); s2r.position.z = -0.2451; s2r.rotation.y = Math.PI; s2.add(s2r); panelLeds("s2", "swr", s2, 0, 0, 0.445, 0.044, true, -0.2451);
      var s2l = textTex([["SW2", "700 60px Helvetica,Arial", 70]], 128, 96, "#111827", "#fff"); var s2m = new T.Mesh(new T.PlaneGeometry(0.05, 0.035), M("#fff", { map: s2l, roughness: 0.5 })); geos.push(s2m.geometry); s2m.position.set(-0.24, 0, 0.006); s2.add(s2m);
      var rt = new T.Group(); rt.position.set(0, 1.16, 0.32); rk.add(rt);
      box(0.344, 0.089, 0.29, metal("#9aa1a8", 0.35), 0, 0, 0, rt, true);
      var rg = new T.PlaneGeometry(0.344, 0.089 * 0.98); geos.push(rg); var rm = new T.Mesh(rg, panelM(svgTex(window.JGP.routerRear({ noimg: 1 }), 2048, 420, "rr"))); rm.position.z = 0.1451; rt.add(rm);
      panelLeds("r", "rr", rt, 0, 0, 0.344, 0.089, false, 0.1451);
      leds["r.sys"] = box(0.005, 0.004, 0.004, M("#2b2f36"), (420 / 880 - 0.5) * 0.344, (0.5 - 30 / 180) * 0.089, 0.147, rt);
      box(0.9, 0.035, 0.6, lamM(), 0, 0.75, 0.75, rk, true, 0.9); [[-0.42, 0.5], [0.42, 0.5], [-0.42, 1.0], [0.42, 1.0]].forEach(function (q) { box(0.035, 0.75, 0.035, metal("#3a3e44"), q[0], 0.375, q[1], rk); });
      decal("img3d/console.webp", 0.3, 0.23, 0.25, 0.769, 0.85, 0.4, rk);
      rk.position.set(0, 0, -5.55); station("rack", rk); solid(-0.5, -6, 0.5, -4.6); label("rack", 0, 2.15, -5.1);
      /* birou cu laptop */
      function desk(x, z, w, d, c) { return table(null, x, z, w, d, c ? lamM() : lamM()); }
      var dk = desk(-2.6, -2.6, 1.4, 0.7);
      var alu = metal("#9ea4ab", 0.35), kb = ctex(512, 340, function (c, w, h) { c.fillStyle = "#2a2d31"; c.fillRect(0, 0, w, h); c.fillStyle = "#131416"; for (var r = 0; r < 5; r++) for (var k = 0; k < 13; k++) { var kw = r === 4 && k > 3 && k < 9 ? 0 : 1; if (!kw) continue; c.fillRect(18 + k * 37, 20 + r * 38, 32, 32); } c.fillRect(18 + 4 * 37, 20 + 4 * 38, 37 * 5 - 5, 32); c.fillStyle = "#3b3f45"; c.fillRect(170, 228, 170, 100); noise(c, w, h, 600, 0.08); });
      box(0.34, 0.018, 0.235, alu, 0, 0.778, 0.05, dk, true); var kbm = new T.Mesh(new T.PlaneGeometry(0.32, 0.21), M("#fff", { map: kb, roughness: 0.6 })); geos.push(kbm.geometry); kbm.rotation.x = -Math.PI / 2; kbm.position.set(0, 0.7875, 0.05); dk.add(kbm);
      var scr = ctex(768, 480, function (c, w, h) { var g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#0a3d7a"); g.addColorStop(0.55, "#1565c0"); g.addColorStop(1, "#4fa3e8"); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = "rgba(255,255,255,.18)"; c.beginPath(); c.moveTo(w * 0.55, 0); c.lineTo(w, h * 0.7); c.lineTo(w, 0); c.fill();
        [["PuTTY", "#f59e0b"], ["Command Prompt", "#111827"], ["Conexiuni rețea", "#0ea5e9"], ["Coș de reciclare", "#94a3b8"]].forEach(function (q, i) { c.fillStyle = q[1]; c.fillRect(24, 22 + i * 92, 48, 48); c.fillStyle = "#fff"; c.font = "15px Segoe UI,Arial"; c.fillText(q[0], 14, 92 + i * 92); });
        c.fillStyle = "rgba(20,24,30,.92)"; c.fillRect(0, h - 40, w, 40); c.fillStyle = "#3b82f6"; c.fillRect(w / 2 - 110, h - 32, 24, 24); for (var i = 0; i < 4; i++) { c.fillStyle = ["#f59e0b", "#e5e7eb", "#0ea5e9", "#22c55e"][i]; c.fillRect(w / 2 - 70 + i * 40, h - 30, 22, 20); } c.fillStyle = "#e5e7eb"; c.font = "14px Segoe UI,Arial"; c.fillText("10:24", w - 60, h - 15); });
      var lsg = new T.PlaneGeometry(0.33, 0.205); geos.push(lsg); var lid = new T.Group(); lid.position.set(0, 0.787, -0.067); lid.rotation.x = -0.28; dk.add(lid); box(0.34, 0.225, 0.008, alu, 0, 0.1125, -0.004, lid, true); var ls = new T.Mesh(lsg, M("#ffffff", { map: scr, emissive: "#ffffff", emissiveMap: scr, emissiveIntensity: 0.55, roughness: 0.15 })); ls.position.set(0, 0.115, 0.0005); lid.add(ls);
      var ap = new T.Object3D(); ap.position.set(-0.19, 0.78, 0.05); dk.add(ap); anchors["pc.lan"] = ap; var au = new T.Object3D(); au.position.set(0.19, 0.78, 0.0); dk.add(au); anchors["pc.usb"] = au; var au2 = new T.Object3D(); au2.position.set(0.19, 0.78, 0.1); dk.add(au2); anchors["pc.usb2"] = au2;
      var mo = M("#1f2937", { roughness: 0.5 }); box(0.06, 0.02, 0.1, mo, 0.3, 0.778, 0.12, dk, true); decal("img3d/rj45.webp", 0.025, 0.035, -0.4, 0.769, 0.18, 0.6, dk);
      chair(dk, 0, 0.6, Math.PI);
      station("desk", dk); solid(-3.35, -3, -1.85, -2.2); label("desk", -2.6, 1.5, -2.6);
      /* banc RJ45 – unelte reale (poze decupate) */
      var bn = desk(2.6, -2.6, 1.4, 0.7, 1);
      box(0.6, 0.004, 0.45, M("#2f6b3a", { roughness: 0.9 }), -0.1, 0.769, 0.02, bn);
      decal("img3d/crimper2.webp", 0.24, 0.151, -0.26, 0.773, 0.06, 0.15, bn); decal("img3d/tester_m.webp", 0.075, 0.126, 0.07, 0.775, 0.1, 0, bn); decal("img3d/tester_r.webp", 0.038, 0.126, 0.14, 0.775, 0.11, -0.1, bn);
      box(0.075, 0.025, 0.126, M("#d8d4c4", { roughness: 0.6 }), 0.07, 0.761 + 0.0125 - 0.01, 0.1, bn); box(0.038, 0.022, 0.126, M("#d8d4c4", { roughness: 0.6 }), 0.14, 0.761 + 0.011 - 0.01, 0.11, bn);
      for (var pl = 0; pl < 5; pl++) decal("img3d/rj45.webp", 0.016, 0.022, -0.05 + pl * 0.022, 0.774, -0.14 + (pl % 2) * 0.012, pl * 0.7, bn);
      var spool = cyl(0.14, 0.12, M("#3b6fd1", { roughness: 0.55 }), 0.35, 0.83, -0.1, bn, 24); cyl(0.05, 0.125, M("#d6d3cc", { roughness: 0.7 }), 0.35, 0.83, -0.1, bn, 16);
      var rul = ctex(512, 48, function (c, w, h) { c.fillStyle = "#e9e3c8"; c.fillRect(0, 0, w, h); c.fillStyle = "#222"; for (var i = 0; i <= 300; i++) { var x = 6 + i * 1.66, L = i % 10 === 0 ? 20 : i % 5 === 0 ? 14 : 8; c.fillRect(x, 0, 1, L); if (i % 10 === 0) { c.font = "11px Arial"; c.fillText(String(i / 10), x + 2, 36); } } c.font = "9px Arial"; c.fillText("mm", w - 22, 44); });
      var rlm = new T.Mesh(new T.PlaneGeometry(0.3, 0.028), M("#fff", { map: rul, roughness: 0.5 })); geos.push(rlm.geometry); rlm.rotation.x = -Math.PI / 2; rlm.position.set(-0.15, 0.773, 0.2); bn.add(rlm);
      decal("img3d/toolset.webp", 0.26, 0.185, -0.45, 0.771, -0.18, -0.2, bn);
      chair(bn, 0, 0.6, Math.PI);
      station("bench", bn); solid(1.85, -3, 3.35, -2.2); label("bench", 2.6, 1.5, -2.6);
      /* banc fibră */
      var fb = desk(2.6, 0.8, 1.4, 0.7, 1);
      function meter(col, x, z, lcd, txt) { var g = new T.Group(); box(0.1, 0.045, 0.18, M(col, { roughness: 0.55 }), 0, 0.0225, 0, g, true); var ft = ctex(128, 224, function (c, w, h) { c.fillStyle = col; c.fillRect(0, 0, w, h); c.fillStyle = "#1f2937"; c.fillRect(10, 12, w - 20, 72); c.fillStyle = lcd; c.fillRect(16, 18, w - 32, 60); c.fillStyle = "#111"; c.font = "bold 20px monospace"; c.fillText(txt, 20, 56); [["ON", 0], ["λ", 1], ["dB", 2], ["REF", 3]].forEach(function (b, i) { var bx = 14 + (i % 2) * 54, by = 104 + Math.floor(i / 2) * 50; c.fillStyle = "#374151"; c.beginPath(); if (c.roundRect) c.roundRect(bx, by, 46, 34, 8); else c.rect(bx, by, 46, 34); c.fill(); c.fillStyle = "#e5e7eb"; c.font = "bold 14px Arial"; c.fillText(b[0], bx + 12, by + 22); }); });
        var tp = new T.Mesh(new T.PlaneGeometry(0.1, 0.175), M("#fff", { map: ft, roughness: 0.45 })); geos.push(tp.geometry); tp.rotation.x = -Math.PI / 2; tp.position.y = 0.0455; g.add(tp); g.position.set(x, 0.769, z); fb.add(g); return g; }
      meter("#facc15", -0.25, 0, "#a7f3d0", "1310nm"); meter("#9ca3af", 0.25, 0, "#c7f0c2", "-13.4dBm");
      var tg = new T.TorusGeometry(0.09, 0.006, 6, 24); geos.push(tg); var tor = new T.Mesh(tg, mc("#facc15")); tor.rotation.x = Math.PI / 2; tor.position.set(0, 0.78, 0.15); fb.add(tor);
      box(0.02, 0.012, 0.03, "#2563eb", 0.09, 0.78, 0.15, fb); box(0.02, 0.012, 0.03, "#16a34a", -0.09, 0.78, 0.15, fb);
      decal("img3d/lc.webp", 0.09, 0.09, 0.0, 0.771, -0.18, 0.5, fb); decal("img3d/sfp.webp", 0.12, 0.031, -0.45, 0.771, 0.12, 0.3, fb); decal("img3d/multimeter.webp", 0.08, 0.147, 0.5, 0.772, 0.15, -0.25, fb);
      chair(fb, 0, -0.6, 0);
      station("fiber", fb); solid(1.85, 0.4, 3.35, 1.2); label("fiber", 2.6, 1.5, 0.8);
      /* cutia cu cabluri (carton) */
      var cbt = ctex(256, 256, function (c, w, h) { c.fillStyle = "#b98d5c"; c.fillRect(0, 0, w, h); noise(c, w, h, 2500, 0.1); c.fillStyle = "rgba(120,80,40,.35)"; for (var i = 0; i < 40; i++) c.fillRect(0, i * 6.4, w, 1); c.fillStyle = "#d9c7a0"; c.fillRect(w / 2 - 20, 0, 40, h); c.fillStyle = "#3b2a1a"; c.font = "bold 22px Arial"; c.fillText("UTP Cat5e", 60, 200); });
      var bx = new T.Group(); box(0.6, 0.35, 0.45, M("#fff", { map: cbt, roughness: 0.9 }), 0, 0.175, 0, bx, true); [["#2563eb", -0.15], ["#eab308", 0], ["#7dd3fc", 0.15], ["#111827", 0.05]].forEach(function (q, i) { var g = new T.TorusGeometry(0.1, 0.012, 8, 24); geos.push(g); var t = new T.Mesh(g, M(q[0], { roughness: 0.5 })); t.rotation.x = Math.PI / 2; t.position.set(q[1], 0.36 + i * 0.012, (i % 2) * 0.1 - 0.05); if (!low) t.castShadow = true; bx.add(t); });
      bx.position.set(2.9, 0, 3.75); station("box", bx); solid(2.55, 3.5, 3.25, 4.0); label("box", 2.9, 1.0, 3.75);
      /* ușa de ieșire */
      var gt = new T.Group(); var dd = door(1.1, 2.1, woodM()); dd.position.z = 0.05; gt.add(dd); box(0.1, 2.2, 0.15, M("#6b7280", { roughness: 0.5 }), -0.6, 1.1, 0, gt); box(0.1, 2.2, 0.15, M("#6b7280", { roughness: 0.5 }), 0.6, 1.1, 0, gt); box(1.3, 0.1, 0.15, M("#6b7280", { roughness: 0.5 }), 0, 2.2, 0, gt);
      box(0.09, 0.14, 0.03, "#111827", 0.82, 1.25, -0.08, gt); leds["gate.led"] = box(0.012, 0.012, 0.01, M("#2b2f36"), 0.82, 1.3, -0.1, gt);
      gt.position.set(0, 0, 5.95); station("gate", gt); label("gate", 0, 2.45, 5.8);
      /* examinatorul */
      var ex = new T.Group(); NPC = ex; var pr0 = person("#4b5535", 0, 0, 0, "#3d4429", "#454d30"); pr0.g.children.slice().forEach(function (ch) { ex.add(ch); }); ex.userData.arms = pr0.g.userData.arms; HEAD = pr0.h;
      box(0.16, 0.22, 0.01, "#a16207", 0.12, 1.15, 0.13, ex); var exPr = ex.children.slice();
      var et = table(null, 0.55, 0, 0.6, 0.8, woodM()); ex.add(et); ex.position.set(-2.8, 0, 0.2); ex.rotation.y = Math.PI / 2; station("examiner", ex); solid(-3.2, -0.3, -1.85, 0.7); label("examiner", -2.8, 2.05, 0.2);
      ex.userData.proxyKids = exPr;
      npc({ main: 1, x: -2.8, z: 0.2, ry: Math.PI / 2, outfit: OUT.exam, hair: "Hair_Buzzed", look: 1, proxyIn: ex });
    }
    var LVF = { out: lvOut, hall: lvHall, theory: lvTheory, prac: lvPrac }, SPAWN = { out: [0, 10, 0], hall: [0, 4.0, 0], theory: [3.4, -2.2, 1.18], prac: [0, 5.0, 0] };
    function clearLevel() { LTOK++; FOC = null; Object.keys(cables).forEach(function (k) { setCable(k, null); }); NPCS.forEach(function (n) { try { n.dispose(); } catch (e) {} }); NPCS = []; NPCMAIN = null; NPCQ = []; PROXY = []; S.remove(LV); geos.forEach(function (g) { g.dispose(); }); mats.forEach(function (m) { m.dispose(); }); texs.forEach(function (t) { t.dispose(); }); geos = []; mats = []; texs = []; MC = {}; solids = []; stObj = {}; leds = {}; anchors = {}; labels = {}; blinkers = {}; NPC = HEAD = BAR = BARSOLID = null; CLOCK = null; LV = new T.Group(); S.add(LV); near = null; }
    function setLevel(n) { if (!LVF[n]) n = "prac"; if (LVN) clearLevel(); LVN = n; LVF[n](); if (!low) LV.traverse(function (o) { if (o.isMesh && !o.isSprite) { var gl = o.userData.glass || (o.material && o.material.transparent && !o.material.alphaTest); o.receiveShadow = !gl; if (HI && !gl) o.castShadow = true; } }); spawnNpcs(n); var sp = SPAWN[n]; P.lvJ = 1; P.x = sp[0]; P.z = sp[1]; P.yaw = sp[2]; P.pitch = -0.08; tween = null; if (opts.onNear) opts.onNear(null); }
    /* oameni 3D animați (încărcați la cerere; până atunci rămân cei procedurali) */
    var npcLoading = false;
    function spawnNpcs(lv) { var Q = NPCQ.slice(), tok = ++LTOK; if (LO || !window.JGNPC || !Q.length) return; npcLoading = true;
      window.JGNPC.load("m3d/", function (lib) { npcLoading = false; if (dead || LVN !== lv || tok !== LTOK || !lib) return; var made = 0;
        Q.forEach(function (sp) { var n = null; try { n = window.JGNPC.make(Object.assign({ shadow: !low }, sp)); } catch (e) { n = null; } if (!n) return; NG.add(n.root); NPCS.push(n); made++; if (sp.main) NPCMAIN = n;
          if (sp.proxyIn && sp.proxyIn.userData.proxyKids) sp.proxyIn.userData.proxyKids.forEach(function (ch) { ch.visible = false; }); });
        if (made) PROXY.forEach(function (g) { if (g.parent) g.parent.remove(g); }); }); }
    /* jucătorul: cablu în mână */
    var carry = new T.Group(); var cg = new T.TorusGeometry(0.06, 0.01, 6, 16); geos.push(cg); var cmat = M("#2563eb"); var cm = new T.Mesh(cg, cmat); carry.add(cm); carry.position.set(0.16, -0.14, -0.35); carry.rotation.set(0.6, 0.3, 0); carry.visible = false; cam.add(carry); S.add(cam);
    /* cabluri */
    function setCable(key, spec) {
      if (cables[key]) { S.remove(cables[key]); cables[key].traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); delete cables[key]; delete animC[key]; }
      if (!spec || !anchors[spec.a] || !anchors[spec.b]) return;
      var a = new T.Vector3(), b = new T.Vector3(); LV.updateMatrixWorld(true); anchors[spec.a].getWorldPosition(a); anchors[spec.b].getWorldPosition(b);
      var gr = new T.Group(); gr.userData = { a: a, b: b, col: spec.color || "#2563eb", t0: spec.instant ? -1e9 : performance.now(), sag: Math.min(0.9, 0.15 + a.distanceTo(b) * 0.08) };
      [a, b].forEach(function (p, i) { var pg = new T.BoxGeometry(0.014, 0.012, 0.025); var pl = new T.Mesh(pg, mc(gr.userData.col)); pl.position.copy(p); pl.userData.home = p.clone(); gr.add(pl); });
      S.add(gr); cables[key] = gr; cableGeo(gr, spec.instant ? 1e9 : 0); animC[key] = gr;
    }
    /* cablu ca o funie (lănțișor, cosh) care se așază cu o mică oscilație amortizată; mufele intră în port cu „click” */
    var animC = {};
    function cableGeo(gr, ms) { var u = gr.userData, a = u.a, b = u.b, t = ms / 1000, k = t > 3 ? 1 : 1 - Math.exp(-6 * t) * Math.cos(11 * t), sag = u.sag * k, pts = [], N = 24, C = 2.0, ch = Math.cosh(C);
      var dir = b.clone().sub(a); var lift = new T.Vector3(0, -0.02, 0.06);
      for (var i = 0; i <= N; i++) { var s0 = i / N, x = (s0 - 0.5) * 2 * C, f = (ch - Math.cosh(x)) / (ch - 1), p = a.clone().addScaledVector(dir, s0); p.y = Math.max(0.02, p.y - sag * f); if (i === 1) p.add(lift); if (i === N - 1) p.add(lift); pts.push(p); }
      var fin = t > 0.9, g = new T.TubeGeometry(new T.CatmullRomCurve3(pts), fin ? 40 : 18, 0.004, fin ? 5 : 4, false); if (u.mesh) { u.mesh.geometry.dispose(); u.mesh.geometry = g; } else { u.mesh = new T.Mesh(g, mc(u.col)); gr.add(u.mesh); }
      var ins = Math.min(1, ms / 260); gr.children.forEach(function (pl) { if (pl.userData.home) { pl.position.copy(pl.userData.home); pl.position.z += 0.03 * (1 - ins * ins); } }); }
    var fadeL = {};
    var LEDC = { off: new T.Color("#2b2f36"), amber: new T.Color("#f59e0b"), green: new T.Color("#22c55e"), blink: new T.Color("#22c55e") };
    function setLed(id, s) { var m = leds[id]; if (!m) return; if (m.material === mc("#2b2f36") || !m.userData.own) { m.material = new T.MeshBasicMaterial({ color: "#2b2f36", toneMapped: false }); mats.push(m.material); m.userData.own = 1; } m.userData.to = (LEDC[s] || LEDC.off).clone(); fadeL[id] = m; m.scale.setScalar(s && s !== "off" && LEDC[s] ? 1.6 : 1); if (s === "blink") blinkers[id] = m; else delete blinkers[id]; }
    /* mișcare + coliziuni */
    var BOB = (function () { try { return localStorage.getItem("jg_bob") !== "0"; } catch (e) { return true; } })(), VEL = { f: 0, s: 0 }, camY = null, bobPh = 0, doorA = null;
    var near = null, tween = null, fpsS = 60, fpsN = 0, fpsT = 0, slowStep = 0, t0 = performance.now(), last = t0, raf = 0;
    function collide(x, z) { x = Math.max(BND[0], Math.min(BND[1], x)); z = Math.max(BND[2], Math.min(BND[3], z)); for (var i = 0; i < solids.length; i++) { var b = solids[i], r = 0.3; if (x > b[0] - r && x < b[2] + r && z > b[1] - r && z < b[3] + r) { var dl = x - (b[0] - r), dr = b[2] + r - x, dt = z - (b[1] - r), db = b[3] + r - z, mn = Math.min(dl, dr, dt, db); if (mn === dl) x = b[0] - r; else if (mn === dr) x = b[2] + r; else if (mn === dt) z = b[1] - r; else z = b[3] + r; } } return [x, z]; }
    function nearCalc() { var best = null, bd = 1.7; Object.keys(ST).forEach(function (id) { var s = ST[id], dx = s[0] - P.x, dz = s[1] - P.z, d = Math.sqrt(dx * dx + dz * dz); var fx = -Math.sin(P.yaw), fz = -Math.cos(P.yaw); var tx = s[2] - P.x, tz = s[3] - P.z, tl = Math.sqrt(tx * tx + tz * tz) || 1; var dot = (fx * tx + fz * tz) / tl; if (d < bd && dot > 0.45) { bd = d; best = id; } }); if (best !== near) { near = best; Object.keys(labels).forEach(function (k) { labels[k].material.color.set(k === near ? "#facc15" : "#ffffff"); }); if (opts.onNear) opts.onNear(near); } Object.keys(labels).forEach(function (k) { var sp = labels[k], lx = sp.position.x - P.x, lz = sp.position.z - P.z, ld = Math.sqrt(lx * lx + lz * lz), op = Math.max(0, Math.min(1, (ld - 1.1) / 0.7)); sp.material.opacity = op; sp.visible = op > 0.02; }); }
    function frame(now) {
      if (dead) return; raf = requestAnimationFrame(frame); if (paused || document.hidden) { last = now; return; }
      var dt = Math.min(0.05, (now - last) / 1000), dtY = Math.min(0.25, (now - last) / 1000); last = now;
      if (tween) { var k = Math.min(1, (now - tween.t) / tween.dur), e = k * k * (3 - 2 * k); var cc = collide(tween.x0 + (tween.x1 - tween.x0) * e, tween.z0 + (tween.z1 - tween.z0) * e); P.x = cc[0]; P.z = cc[1]; var dy = tween.y1 - tween.y0; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI; P.yaw = tween.y0 + dy * e; P.pitch = tween.p0 + (-0.25 - tween.p0) * e; if (k >= 1) { tween = null; } }
      var ka = Math.min(1, dt * (P.mf || P.ms ? 7 : 10)); VEL.f += ((tween ? 0 : P.mf) - VEL.f) * ka; VEL.s += ((tween ? 0 : P.ms) - VEL.s) * ka; if (Math.abs(VEL.f) < 0.002) VEL.f = 0; if (Math.abs(VEL.s) < 0.002) VEL.s = 0;
      if (!tween && (VEL.f || VEL.s)) { var sp = 1.7 * dt, fx = -Math.sin(P.yaw), fz = -Math.cos(P.yaw), rx = Math.cos(P.yaw), rz = -Math.sin(P.yaw); var ox = P.x, oz = P.z; var c = collide(P.x + (fx * VEL.f + rx * VEL.s) * sp, P.z + (fz * VEL.f + rz * VEL.s) * sp); P.x = c[0]; P.z = c[1]; bobPh = (bobPh + Math.sqrt((P.x - ox) * (P.x - ox) + (P.z - oz) * (P.z - oz)) * 7.5) % (Math.PI * 4); }
      var fy = FY ? FY(P.x, P.z) : 0; if (camY == null || P.lvJ) { camY = fy; P.lvJ = 0; } else { var dyc = (fy - camY) * Math.min(1, dtY * 14), cap = 1.35 * dtY; camY += Math.max(-cap, Math.min(cap, dyc)); if (!tween) camY = Math.max(camY, fy - 0.15); } var spd = Math.min(1, Math.sqrt(VEL.f * VEL.f + VEL.s * VEL.s)), bob = BOB ? Math.sin(bobPh) * 0.022 * spd : 0;
      cam.position.set(P.x + (BOB ? Math.cos(bobPh * 0.5) * 0.008 * spd : 0), 1.6 + camY + bob, P.z); cam.rotation.set(P.pitch, P.yaw, BOB ? Math.sin(bobPh * 0.5) * 0.004 * spd : 0, "YXZ"); if (FOC) focFrame(now);
      for (var ni = 0; ni < NPCS.length; ni++) NPCS[ni].update(dt, P.x, P.z);
      Object.keys(animC).forEach(function (k) { var g = animC[k], ms = now - g.userData.t0; cableGeo(g, ms); if (ms > 900) delete animC[k]; });
      Object.keys(fadeL).forEach(function (k) { var m = fadeL[k]; m.material.color.lerp(m.userData.to, Math.min(1, dt * 9)); if (Math.abs(m.material.color.r - m.userData.to.r) + Math.abs(m.material.color.g - m.userData.to.g) + Math.abs(m.material.color.b - m.userData.to.b) < 0.01) { m.material.color.copy(m.userData.to); delete fadeL[k]; } });
      if (BAR && BAR.userData.to != null) { BAR.rotation.z += (BAR.userData.to - BAR.rotation.z) * Math.min(1, dt * 3.5); }
      if (doorA) { var dk = Math.min(1, (now - doorA.t) / 600), de = 1 - Math.pow(1 - dk, 3); doorA.o.rotation.y = doorA.r0 + doorA.d * de; if (dk >= 1) doorA = null; }
      if (NPC && NPC.userData.arms) { var ar = NPC.userData.arms, gk = nodT ? (now - nodT) / 1400 : 2; ar[0].rotation.x = Math.sin(now / 1100) * 0.04; ar[1].rotation.x = gk < 1 ? -Math.sin(gk * Math.PI) * 1.1 : Math.sin(now / 1100 + 1) * 0.04; ar[1].rotation.z = gk < 1 ? Math.sin(gk * Math.PI) * 0.25 : 0; }
      if (NPC && HEAD) { var hx = P.x - NPC.position.x, hz = P.z - NPC.position.z; if (hx * hx + hz * hz < 20) { var ya = Math.atan2(hx, hz) - NPC.rotation.y; while (ya > Math.PI) ya -= 2 * Math.PI; while (ya < -Math.PI) ya += 2 * Math.PI; HEAD.rotation.y += (Math.max(-1.1, Math.min(1.1, ya)) - HEAD.rotation.y) * 0.1; }
      NPC.children[0].scale.y = 1 + Math.sin(now / 900) * 0.01; if (nodT && now - nodT < 700) HEAD.rotation.x = Math.sin((now - nodT) / 700 * Math.PI * 2) * 0.25; else HEAD.rotation.x += (Math.sin(now / 2300) * 0.04 - HEAD.rotation.x) * 0.1; }
      var bl = Math.floor(now / 120); Object.keys(blinkers).forEach(function (id, i) { blinkers[id].visible = ((bl + i) % 3) !== 0 || Math.random() < 0.3; });
      nearCalc(); if (COMP) COMP.render(dt); else R.render(S, cam);
      fpsN++; if (now - fpsT > 1000) { var f = fpsN * 1000 / (now - fpsT); fpsS = fpsS * 0.5 + f * 0.5; fpsN = 0; fpsT = now;
        if (opts.onTierDown) { if (now - t0 > 4000 && fpsS < 45) { if (++tdC >= 3) { var td = opts.onTierDown; opts.onTierDown = null; setTimeout(function () { if (!dead) td(fpsS); }, 0); } } else tdC = 0; } else if (now - t0 > 3000 && !opts.noDown) { if (COMP && fpsS < Math.max(40, FLR)) { dropComp(); t0 = now; } else if (fpsS < (FLR || 28) && slowStep === 0) { slowStep = 1; if (R.getPixelRatio() > 1.01) { R.setPixelRatio(1); resize(); } else slowStep = 2; t0 = now; } if (fpsS < (FLR ? FLR - 3 : 26) && slowStep === 2 && now - t0 > 2500) { slowStep = 3; R.shadowMap.enabled = false; S.traverse(function (o) { if (o.material) o.material.needsUpdate = true; }); t0 = now; } else if (fpsS < 15 && slowStep === 3 && now - t0 > 2500) { slowStep = 4; if (opts.onSlow) opts.onSlow(fpsS); } else if (slowStep === 1 && now - t0 > 2500) slowStep = 2; } }
    }
    var nodT = 0;
    /* Ultra (doar desktop cu GPU puternic): SSAO + bloom discret + ACES + SMAA */
    var COMP = null, SSAO = null, COMPERR = "", FLR = +opts.fpsFloor || 0, tdC = 0;
    function initComp() { var PP = window.THREE_P; if (!UL || !PP) return; try { var w = container.clientWidth || 1, h = container.clientHeight || 1; var rt = new T.WebGLRenderTarget(w * pr, h * pr, { type: T.HalfFloatType }); COMP = new PP.EffectComposer(R, rt); COMP.setPixelRatio(pr); COMP.setSize(w, h);
      SSAO = new PP.SSAOPass(S, cam, w, h); SSAO.kernelRadius = 0.32; SSAO.minDistance = 0.0006; SSAO.maxDistance = 0.06; try { SSAO.beautyRenderTarget.dispose(); SSAO.beautyRenderTarget = new T.WebGLRenderTarget(w, h, { type: T.HalfFloatType }); } catch (e) {} COMP.addPass(SSAO);
      COMP.addPass(new PP.UnrealBloomPass(new T.Vector2(w, h), 0.22, 0.45, 0.92));
      COMP.addPass(new PP.ShaderPass({ uniforms: { tDiffuse: { value: null }, exposure: { value: 1.0 } }, vertexShader: "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
        fragmentShader: "uniform sampler2D tDiffuse;uniform float exposure;varying vec2 vUv;vec3 fit(vec3 v){vec3 a=v*(v+0.0245786)-0.000090537;vec3 b=v*(0.983729*v+0.4329510)+0.238081;return a/b;}vec3 srgb(vec3 c){return mix(c*12.92,pow(c,vec3(0.41666))*1.055-0.055,step(0.0031308,c));}void main(){vec4 t=texture2D(tDiffuse,vUv);vec3 c=t.rgb*exposure/0.6;c=mat3(0.59719,0.07600,0.02840,0.35458,0.90834,0.13383,0.04823,0.01566,0.83777)*c;c=fit(c);c=mat3(1.60475,-0.10208,-0.00327,-0.53108,1.10813,-0.07276,-0.07367,-0.00605,1.07602)*c;gl_FragColor=vec4(srgb(clamp(c,0.0,1.0)),1.0);}" }));
      COMP.addPass(new PP.SMAAPass(w * pr, h * pr)); } catch (e) { COMP = null; SSAO = null; COMPERR = String(e && e.message || e); } }
    function dropComp() { if (!COMP) return; try { COMP.passes.forEach(function (p) { if (p.dispose) p.dispose(); }); COMP.renderTarget1.dispose(); COMP.renderTarget2.dispose(); } catch (e) {} COMP = null; SSAO = null; }
    function resize() { var w = container.clientWidth || 1, h = container.clientHeight || 1; R.setSize(w, h, false); cam.aspect = w / h; cam.fov = w / h < 0.8 ? 70 : 60; cam.updateProjectionMatrix(); if (COMP) { COMP.setPixelRatio(R.getPixelRatio()); COMP.setSize(w, h); } }
    var ro = window.ResizeObserver ? new ResizeObserver(resize) : null; if (ro) ro.observe(container); else window.addEventListener("resize", resize); resize(); initComp(); if (COMP) resize();
    /* vedere de aproape în 3D (rack): camera alunecă lin spre echipament; porturile se ating direct în scenă */
    var FOC = null, FQ = new T.Quaternion(), FP = new T.Vector3(), FM = new T.Matrix4(), FUP = new T.Vector3(0, 1, 0);
    var FDEF = { swf: ["sw", 1.32, -5.0949, 1, 0.483], s2f: ["s2", 1.5, -5.0949, 1, 0.483], rr: ["r", 1.16, -5.0849, 1, 0.38], swr: ["sw", 1.32, -5.3451, -1, 0.483], s2r: ["s2", 1.5, -5.3451, -1, 0.483], box: [null, 0.95, 3.75, -1, 0.9, 2.9] };
    function focTarget(key, near) { var f = FDEF[key]; if (!f) return null; var asp = cam.aspect || 1, th = Math.tan(cam.fov * Math.PI / 360), dFar = Math.max(0.42, (f[4] / 2) / (th * Math.min(asp, 1.6)) * 1.12), d = f[3] < 0 ? Math.min(0.3, dFar) : near ? Math.max(0.24, dFar * 0.5) : dFar; if (key === "box") d = 1.0; var x = f[5] || 0, p = new T.Vector3(x, f[1] + (key === "box" ? 0.55 : d * 0.06), f[2] + f[3] * d), t = new T.Vector3(x, f[1] - (key === "box" ? 0 : d * th * (asp < 1 ? 0.5 : 0.36)), f[2]); FM.lookAt(p, t, FUP); return { p: p, q: new T.Quaternion().setFromRotationMatrix(FM), key: key, near: !!near, d: d }; }
    function focFrame(now) { var k = Math.min(1, (now - FOC.t) / FOC.dur), e = k * k * (3 - 2 * k); if (FOC.out) { if (k >= 1) { FOC = null; return; } FP.copy(cam.position); FQ.copy(cam.quaternion); cam.position.lerpVectors(FOC.p0, FP, e); cam.quaternion.slerpQuaternions(FOC.q0, FQ, e); return; } FP.copy(FOC.p1); FP.x += FOC.pan; cam.position.lerpVectors(FOC.p0, FP, e); cam.quaternion.slerpQuaternions(FOC.q0, FOC.q1, e); }
    function focus(key, near) { var tg = focTarget(key, near); if (!tg) return false; P.mf = P.ms = 0; tween = null; var keepPan = FOC && !FOC.out && FOC.key === key; FOC = { t: performance.now(), dur: FOC && !FOC.out ? 520 : 750, p0: cam.position.clone(), q0: cam.quaternion.clone(), p1: tg.p, q1: tg.q, key: key, near: tg.near, d: tg.d, pan: keepPan ? FOC.pan : 0 }; var f = FDEF[key]; if (!keepPan && f[3] < 0 && f[0] && anchors[f[0] + ".con"]) { var cv3 = new T.Vector3(); anchors[f[0] + ".con"].getWorldPosition(cv3); var w = 2 * FOC.d * Math.tan(cam.fov * Math.PI / 360) * cam.aspect, lim = Math.max(0, (f[4] - w) / 2 + 0.03); FOC.pan = Math.max(-lim, Math.min(lim, cv3.x - tg.p.x)); } return true; }
    function unfocus() { if (!FOC || FOC.out) return; FOC = { t: performance.now(), dur: 600, p0: cam.position.clone(), q0: cam.quaternion.clone(), out: true }; }
    function focPanBy(px) { if (!FOC || FOC.out || FOC.key === "box") return; var r = cv.getBoundingClientRect(), w = 2 * FOC.d * Math.tan(cam.fov * Math.PI / 360) * cam.aspect, lim = Math.max(0, (FDEF[FOC.key][4] - w) / 2 + 0.03); FOC.pan = Math.max(-lim, Math.min(lim, FOC.pan - FDEF[FOC.key][3] * px / (r.width || 1) * w)); }
    function portAt(cx, cy) { if (!FOC || FOC.out || !window.JGP) return null; var f = FDEF[FOC.key]; if (!f[0]) return null; var L = window.JGP.L[FOC.key === "s2f" ? "swf" : FOC.key === "s2r" ? "swr" : FOC.key]; if (!L) return null; var r = cv.getBoundingClientRect(), best = null, bd = Math.max(22, Math.min(34, r.width * 0.06)), v = new T.Vector3(); cam.updateMatrixWorld();
      Object.keys(L.p).forEach(function (pid) { var a = anchors[f[0] + "." + pid]; if (!a) return; a.getWorldPosition(v); v.project(cam); if (v.z > 1 || v.z < -1) return; var sx = r.left + (v.x + 1) / 2 * r.width, sy = r.top + (1 - v.y) / 2 * r.height, dd = Math.hypot(sx - cx, sy - cy); if (dd < bd) { bd = dd; best = f[0] + "." + pid; } }); return best; }
    function portXY(id) { var a = anchors[id]; if (!a) return null; var v = new T.Vector3(), r = cv.getBoundingClientRect(); cam.updateMatrixWorld(); a.getWorldPosition(v); v.project(cam); return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height, z: v.z }; }
    var ray = new T.Raycaster(), v2 = new T.Vector2();
    function pick(cx, cy) { var r = cv.getBoundingClientRect(); v2.set((cx - r.left) / r.width * 2 - 1, -((cy - r.top) / r.height) * 2 + 1); ray.setFromCamera(v2, cam); var objs = Object.keys(stObj).map(function (k) { return stObj[k]; }); var hit = ray.intersectObjects(objs, true)[0]; var id = hit && hit.object.userData.station; if (id && hit.distance < 7) { if (opts.onPick) opts.onPick(id); return id; } return null; }
    var pd = null, pl = null; cv.addEventListener("pointerdown", function (e) { pd = [e.clientX, e.clientY]; pl = e.clientX; }); cv.addEventListener("pointermove", function (e) { if (pd && FOC && pl != null) { focPanBy(e.clientX - pl); pl = e.clientX; } }); cv.addEventListener("pointercancel", function () { pd = pl = null; }); cv.addEventListener("pointerup", function (e) { if (pd && Math.abs(e.clientX - pd[0]) + Math.abs(e.clientY - pd[1]) < 8) { var pp = portAt(e.clientX, e.clientY); if (pp) { if (opts.onPort) opts.onPort(pp); } else if (!FOC) pick(e.clientX, e.clientY); } pd = pl = null; });
    setLevel(opts.level || "prac");
    var clockT = setInterval(function () { if (CLOCK) drawClock(); }, 15000);
    raf = requestAnimationFrame(frame); setTimeout(function () { if (opts.onReady) opts.onReady(); }, 0);
    var api = {
      move: function (f, s) { if (FOC && !FOC.out) { P.mf = P.ms = 0; return; } P.mf = f || 0; P.ms = s || 0; if (f || s) tween = null; },
      turn: function (dy, dp) { P.yaw -= dy; P.pitch = Math.max(-1.2, Math.min(1.2, P.pitch - (dp || 0))); tween = null; },
      pick: pick, interact: function () { if (near && opts.onPick) { opts.onPick(near); return near; } return null; },
      goTo: function (id) { var s = ST[id]; if (!s) return; var yaw = Math.atan2(-(s[2] - s[0]), -(s[3] - s[1])); tween = { t: performance.now(), x0: P.x, z0: P.z, x1: s[0], z1: s[1], y0: P.yaw, y1: yaw, p0: P.pitch, dur: Math.max(650, Math.min(3600, 420 + Math.hypot(s[0] - P.x, s[1] - P.z) * 430)) }; },
      place: function (id) { var s = ST[id]; if (!s) return; P.x = s[0]; P.z = s[1]; P.yaw = Math.atan2(-(s[2] - s[0]), -(s[3] - s[1])); P.pitch = -0.2; tween = null; },
      setLed: setLed, setCable: setCable, setCarry: function (c) { carry.visible = !!c; if (c) cmat.color.set(c); }, say: function () { nodT = performance.now(); if (NPCMAIN) NPCMAIN.say(); },
      anchor: function (id) { var v = new T.Vector3(); if (anchors[id]) anchors[id].getWorldPosition(v); return anchors[id] ? v : null; },
      fps: function () { return Math.round(fpsS); }, tier: function () { return TIER; }, compErr: function () { return COMPERR; }, post: function () { return COMP ? COMP.passes.map(function (p) { return p.constructor && p.constructor.name || "pass"; }) : []; }, npcs: function () { return NPCS.length; }, npcLoading: function () { return npcLoading; }, near: function () { return near; }, pos: function () { return { x: P.x, z: P.z, yaw: P.yaw }; },
      pause: function (b) { paused = !!b; }, resize: resize,
      focus: focus, unfocus: unfocus, focused: function () { return FOC && !FOC.out ? FOC.key : null; }, focusPan: focPanBy, portAt: portAt, portXY: portXY, focusNear: function () { return !!(FOC && FOC.near); },
      level: function () { return LVN; }, setLevel: setLevel, clock: function (t) { CLOCKTXT = t || ""; drawClock(); }, openBarrier: function () { if (BAR) BAR.userData.to = 1.45; if (BARSOLID) { var bi = solids.indexOf(BARSOLID); if (bi >= 0) solids.splice(bi, 1); BARSOLID = null; } }, stationList: function () { return Object.keys(ST); },
      openDoor: function (id) { var o = stObj[id || "door"]; if (o) doorA = { o: o, t: performance.now(), r0: o.rotation.y, d: -1.3 }; },
      setBob: function (b) { BOB = !!b; try { localStorage.setItem("jg_bob", b ? "1" : "0"); } catch (e) {} }, bob: function () { return BOB; },
      dbg: function () { var down = new T.Raycaster(new T.Vector3(P.x, cam.position.y + 0.1, P.z), new T.Vector3(0, -1, 0)); down.camera = cam; var hit = down.intersectObjects(LV.children, true).filter(function (h) { return !h.object.isSprite; })[0]; return { t: last, x: P.x, z: P.z, y: cam.position.y, fy: FY ? FY(P.x, P.z) : 0, lv: LVN, bnd: BND.slice(), solids: solids.map(function (b) { return b.slice(); }), st: JSON.parse(JSON.stringify(ST)), near: near, floor: hit ? hit.distance : null, fps: Math.round(fpsS), tween: !!tween, nan: !(isFinite(P.x) && isFinite(P.z) && isFinite(cam.position.y)), tier: TIER, npcs: NPCS.length, info: { calls: R.info.render.calls, tris: R.info.render.triangles, geo: R.info.memory.geometries, tex: R.info.memory.textures } }; },
      setPos: function (x, z, yaw) { P.x = x; P.z = z; if (yaw != null) P.yaw = yaw; tween = null; },
      destroy: function () { dead = true; dropComp(); try { if (PMG) PMG.dispose(); if (ENV.roomR === R) { ENV.room = null; ENV.roomR = null; } if (ENV.skyR === R) { ENV.sky = null; ENV.skyR = null; } } catch (e) {} NPCS.forEach(function (n) { try { n.dispose(); } catch (e) {} }); NPCS = []; clearInterval(clockT); cancelAnimationFrame(raf); if (ro) ro.disconnect(); else window.removeEventListener("resize", resize); Object.keys(cables).forEach(function (k) { setCable(k, null); }); geos.forEach(function (g) { g.dispose(); }); mats.forEach(function (m) { m.dispose(); }); texs.forEach(function (t) { t.dispose(); }); R.dispose(); if (R.forceContextLoss) R.forceContextLoss(); if (cv.parentNode) cv.parentNode.removeChild(cv); }
    };
    return api;
  }
  window.JG3D = { supported: supported, create: create };
})();
