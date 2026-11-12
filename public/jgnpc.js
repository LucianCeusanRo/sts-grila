/* STS – oameni 3D animați (NPC). Modele: Quaternius „Universal Base Characters” + „Universal Animation Library” (CC0 1.0).
   Hainele (uniformă / civil) sunt colorate în shader pe regiuni ale corpului, calculate din oasele scheletului. */
(function () {
  "use strict";
  var T = window.THREE, X = window.THREE_X, LIB = null, WAIT = [], LOADING = false, FAIL = false;
  var BONE_REG = function (n) {
    if (/^(Head|neck_01)$/.test(n) || /^(hand|index|middle|pinky|ring|thumb)_/.test(n)) return 0;
    if (/^(foot|ball)_/.test(n)) return 3;
    if (/^(calf|thigh)_/.test(n)) return 2;
    if (/^(upperarm|lowerarm|clavicle)_/.test(n)) return 1;
    if (/^spine_|^pelvis$/.test(n)) return 5; /* trunchi: se decide după înălțime */
    return 1;
  };
  function LC(c) { var k = new T.Color(c); if (T.ColorManagement && T.ColorManagement.legacyMode) k.convertSRGBToLinear(); return k; }
  function GC(a, i, k) { return k === 0 ? a.getX(i) : k === 1 ? a.getY(i) : k === 2 ? a.getZ(i) : a.getW(i); }
  function prep(g, H) {
    /* g = gltf.scene al unui model; calculează regiunea fiecărui vârf (o singură dată, geometria e partajată de clone) */
    var body = null, nt = 0; g.traverse(function (o) { if (o.isSkinnedMesh) { var c = o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count; if (c > nt) { nt = c; body = o; } } });
    if (!body || !body.skeleton) throw new Error("NPC: lipsește scheletul"); g.updateMatrixWorld(true); body.skeleton.update();
    var geo = body.geometry, pos = geo.attributes.position, si = geo.attributes.skinIndex, sw = geo.attributes.skinWeight, n = pos.count, reg = new Float32Array(n), v = new T.Vector3(), bones = body.skeleton.bones;
    var W = new Float32Array(n * 3), lo = 1e9, hi = -1e9, rlo = 1e9, rhi = -1e9;
    for (var j = 0; j < n; j++) { v.fromBufferAttribute(pos, j); body.boneTransform(j, v); v.applyMatrix4(body.matrixWorld); W[j * 3] = v.x; W[j * 3 + 1] = v.y; W[j * 3 + 2] = v.z; if (v.y < lo) lo = v.y; if (v.y > hi) hi = v.y; var ry = pos.getY(j); if (ry < rlo) rlo = ry; if (ry > rhi) rhi = ry; }
    var h0 = hi - lo, sc = H / h0, H0 = lo, kq = h0 / Math.max(1e-6, rhi - rlo);
    var headTop = -1e9, hx = 0, hz = 0, hn = 0, FB = { l: new T.Box3(), r: new T.Box3() };
    for (var i = 0; i < n; i++) {
      var best = 0, bw = -1; for (var k = 0; k < 4; k++) { var w = GC(sw, i, k); if (w > bw) { bw = w; best = GC(si, i, k); } }
      var bn = bones[best] ? bones[best].name : ""; v.set(W[i * 3], W[i * 3 + 1], W[i * 3 + 2]); var y = (v.y - H0) / h0, r = BONE_REG(bn);
      if (r === 5) r = y > 0.585 ? 1 : 2; if (r === 2 && y < 0.115) r = 3; if ((r === 1 || r === 2) && y > 0.565 && y < 0.6 && !/arm|clav/.test(bn)) r = 4;
      if (/^(foot|ball)/.test(bn)) { var fs = bn.slice(-1) === "l" ? FB.l : FB.r; fs.expandByPoint(v); }
      if (bn === "Head") { if (v.y > headTop) headTop = v.y; hx += v.x; hz += v.z; hn++; }
      reg[i] = r;
    }
    geo.setAttribute("aReg", new T.BufferAttribute(reg, 1));
    return { body: body.name, scale: sc, minY: H0, headTop: headTop, hx: hn ? hx / hn : 0, hz: hn ? hz / hn : 0, meshScale: kq, feet: FB };
  }
  function outfitMat(src, o, infl) {
    var m = new T.MeshStandardMaterial({ map: src.map, normalMap: src.normalMap, roughness: 0.78, metalness: 0 });
    var U = { uTop: { value: LC(o.top) }, uBot: { value: LC(o.bot) }, uShoe: { value: LC(o.shoe || "#141414") }, uBelt: { value: LC(o.belt || "#222") }, uSkin: { value: LC(o.skin || "#ffffff") }, uInfl: { value: infl }, uCam: { value: o.camo ? 1 : 0 } };
    m.userData.U = U;
    m.onBeforeCompile = function (s) {
      Object.keys(U).forEach(function (k) { s.uniforms[k] = U[k]; });
      s.vertexShader = s.vertexShader.replace("#include <common>", "#include <common>\nattribute float aReg; varying float vReg; varying vec3 vOP; uniform float uInfl;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvReg = aReg; vOP = position; float cl = (aReg > 0.5 && aReg < 4.5) ? 1.0 : 0.0; transformed += normalize(objectNormal) * uInfl * cl * (aReg > 2.5 && aReg < 3.5 ? 1.6 : 1.0);");
      s.fragmentShader = s.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vReg; varying vec3 vOP; uniform vec3 uTop, uBot, uShoe, uBelt, uSkin; uniform float uCam;\nfloat hsh(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }\nfloat vn(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(mix(hsh(i),hsh(i+vec3(1,0,0)),f.x),mix(hsh(i+vec3(0,1,0)),hsh(i+vec3(1,1,0)),f.x),f.y),mix(mix(hsh(i+vec3(0,0,1)),hsh(i+vec3(1,0,1)),f.x),mix(hsh(i+vec3(0,1,1)),hsh(i+vec3(1,1,1)),f.x),f.y),f.z); }")
        .replace("#include <map_fragment>", "#include <map_fragment>\nfloat rg = floor(vReg + 0.5); if (rg < 0.5) { diffuseColor.rgb *= uSkin; } else if (rg < 4.5) { vec3 cc = rg < 1.5 ? uTop : rg < 2.5 ? uBot : rg < 3.5 ? uShoe : uBelt; float q = vn(vOP * 90.0) * 0.5 + vn(vOP * 260.0) * 0.5; if (uCam > 0.5 && rg < 2.5) { float c1 = vn(vOP * 9.0 + 3.1), c2 = vn(vOP * 14.0 + 7.7); cc = c1 > 0.62 ? cc * 0.62 : c2 > 0.6 ? cc * 1.25 + vec3(0.03, 0.025, 0.0) : cc; } diffuseColor.rgb = cc * (0.88 + 0.2 * q); }")
        .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nif (floor(vReg + 0.5) > 0.5 && floor(vReg + 0.5) < 4.5) roughnessFactor = floor(vReg + 0.5) > 2.5 ? 0.45 : 0.92;")
        .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\nif (floor(vReg + 0.5) > 0.5 && floor(vReg + 0.5) < 4.5) normal = normalize(mix(normal, geometryNormal, 0.85));");
    };
    m.customProgramCacheKey = function () { return "jgnpc1"; };
    return m;
  }
  function load(base, cb) {
    if (LIB) return cb(LIB); if (FAIL) return cb(null); WAIT.push(cb); if (LOADING) return; LOADING = true;
    if (!X || !X.GLTFLoader) { FAIL = true; WAIT.splice(0).forEach(function (f) { f(null); }); return; }
    var L = new X.GLTFLoader(), got = {}, left = 4;
    function done() { if (--left) return; if (!got.m || !got.a) { FAIL = true; WAIT.splice(0).forEach(function (f) { f(null); }); return; }
      try {
        LIB = { m: got.m.scene, f: got.f ? got.f.scene : got.m.scene, clips: {}, hair: {} };
        LIB.pm = prep(LIB.m, 1.78); LIB.pf = got.f ? prep(LIB.f, 1.68) : LIB.pm;
        got.a.animations.forEach(function (c) { LIB.clips[c.name] = c; });
        if (got.h) got.h.scene.traverse(function (o) { if (o.isMesh) LIB.hair[o.name.replace(/_\d+$/, "")] = o; });
        [["m", LIB.m], ["f", LIB.f]].forEach(function (q) { var pel = null; q[1].traverse(function (o) { if (o.name === "pelvis") pel = o; }); var cl = LIB.clips.Idle_Loop, tr = cl && cl.tracks.filter(function (t) { return t.name === "pelvis.position"; })[0]; LIB["pr" + q[0]] = pel && tr ? pel.position.length() / Math.max(1e-6, new T.Vector3(tr.values[0], tr.values[1], tr.values[2]).length()) : 1; LIB["cl" + q[0]] = {}; Object.keys(LIB.clips).forEach(function (k) { var c = LIB.clips[k].clone(), r = LIB["pr" + q[0]]; c.tracks.forEach(function (t) { if (t.name === "pelvis.position" && Math.abs(r - 1) > 0.01) for (var i = 0; i < t.values.length; i++) t.values[i] *= r; }); LIB["cl" + q[0]][k] = c; }); });
      } catch (e) { FAIL = true; LIB = null; window.__npcErr = String(e && e.stack || e); }
      WAIT.splice(0).forEach(function (f) { f(LIB); }); }
    [["m", "npc_m.glb"], ["f", "npc_f.glb"], ["a", "npc_anim.glb"], ["h", "npc_hair.glb"]].forEach(function (q) { L.load(base + q[1], function (g) { got[q[0]] = g; done(); }, undefined, function (er) { window.__npcErr = (window.__npcErr || "") + " load " + q[1] + ": " + er; done(); }); });
  }
  var up = new T.Vector3(0, 1, 0), tq = new T.Quaternion(), pq = new T.Quaternion(), dq = new T.Quaternion(), tv = new T.Vector3();
  function make(spec) {
    if (!LIB) return null; var F = spec.sex === "f", src = F ? LIB.f : LIB.m, pm = F ? LIB.pf : LIB.pm, clips = F ? LIB.clf : LIB.clm;
    var root = new T.Group(), mdl = X.SkeletonUtils.clone(src), mats = [], H = F ? 1.68 : 1.78; mdl.scale.setScalar(pm.scale * (spec.h || 1)); mdl.position.y = -pm.minY * pm.scale * (spec.h || 1); root.add(mdl);
    var head = null, neck = null, pel = null;
    mdl.traverse(function (o) { if (o.name === "Head") head = o; if (o.name === "neck_01") neck = o; if (o.name === "pelvis") pel = o;
      if (o.isMesh) { o.frustumCulled = false; o.castShadow = spec.shadow !== false; o.receiveShadow = true;
        if (o.isSkinnedMesh && o.geometry.attributes.aReg) { var m = outfitMat(o.material, spec.outfit || {}, 0.011 / (pm.meshScale * pm.scale)); o.material = m; mats.push(m); }
        else { var m2 = o.material.clone(); m2.roughness = 0.6; m2.metalness = 0; o.material = m2; mats.push(m2); } } });
    var hairK = spec.hair || (F ? "Hair_Long" : "Hair_SimpleParted");
    if (LIB.hair[hairK] && head) { var hm = LIB.hair[hairK].clone(); hm.material = hm.material.clone(); hm.material.color.set(spec.hairCol || "#3b2a1e"); hm.material.roughness = 0.7; hm.material.metalness = 0; mats.push(hm.material); hm.castShadow = spec.shadow !== false; hm.frustumCulled = false;
      /* părul e modelat pentru capul standard; îl aliniem pe capul acestui model */
      if (hairK === "Hair_Long") hm.scale.multiply(new T.Vector3(1.09, 1.05, 1.09)); else if (hairK === "Hair_SimpleParted") hm.scale.multiplyScalar(1.05);
      hm.updateMatrixWorld(true); var hb = new T.Box3().setFromObject(hm), s0 = pm.scale * (spec.h || 1), hu = (spec.hairUp != null ? spec.hairUp : (hairK === "Hair_Buzzed" ? 0.006 : hairK === "Hair_Long" ? 0.028 : 0.02)) / s0;
      hm.position.x += pm.hx - (hb.min.x + hb.max.x) / 2; hm.position.y += pm.headTop - hb.max.y + hu; hm.position.z += pm.hz - (hb.min.z + hb.max.z) / 2 - (hairK === "Hair_Long" ? 0.012 : 0.004) / s0;
      mdl.add(hm);
      if (hairK !== "Hair_Buzzed" && !spec.cap) { var cr = 0.084 / s0, cap0 = new T.Mesh(new T.SphereGeometry(cr, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), hm.material); cap0.userData.ownGeo = 1; cap0.scale.set(1, 0.78, 1.08); cap0.position.set(pm.hx, pm.headTop - 0.05 / s0, pm.hz - 0.022 / s0); cap0.castShadow = false; mdl.add(cap0); mdl.updateMatrixWorld(true); head.attach(cap0); }
      mdl.updateMatrixWorld(true); head.attach(hm); }
    if (spec.cap && head) { var cg = new T.Group(), cm = new T.MeshStandardMaterial({ color: spec.cap, roughness: 0.85 }); mats.push(cm); var c1 = new T.Mesh(new T.CylinderGeometry(0.105, 0.1, 0.07, 18), cm); c1.position.y = 0.035; cg.add(c1); var c2 = new T.Mesh(new T.CylinderGeometry(0.115, 0.105, 0.035, 18), cm); c2.position.y = 0.085; c2.scale.z = 1.08; cg.add(c2); var vm = new T.MeshStandardMaterial({ color: "#151515", roughness: 0.35 }); mats.push(vm); var vs = new T.Mesh(new T.BoxGeometry(0.15, 0.008, 0.07), vm); vs.position.set(0, 0.008, 0.11); vs.rotation.x = 0.25; cg.add(vs); cg.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.userData.ownGeo = 1; } });
      var s = pm.scale * (spec.h || 1); cg.scale.setScalar(1 / s); cg.position.set(pm.hx, pm.headTop - 0.07 / s, pm.hz + 0.005 / s); mdl.add(cg); mdl.updateMatrixWorld(true); head.attach(cg); root.userData.cap = cg; }
    var feetB = {}; mdl.traverse(function (o) { if (o.name === "foot_l") feetB.l = o; if (o.name === "foot_r") feetB.r = o; });
    var shm = new T.MeshStandardMaterial({ color: spec.outfit && spec.outfit.shoe || "#141414", roughness: 0.38, metalness: 0 }); mats.push(shm);
    ["l", "r"].forEach(function (sd) { var fb = pm.feet[sd], fo = feetB[sd]; if (!fo || fb.isEmpty()) return; var sz = new T.Vector3(), c = new T.Vector3(); fb.getSize(sz); fb.getCenter(c);
      var g = new T.BoxGeometry(sz.x * 1.22, sz.y * 0.62, sz.z * 1.12, 2, 2, 3), P = g.attributes.position; for (var i = 0; i < P.count; i++) { var y = P.getY(i), z = P.getZ(i), x = P.getX(i), top = y > 0, fr = z / (sz.z * 0.56); P.setX(i, x * (fr > 0.2 ? 1 - (fr - 0.2) * 0.35 : 1) * (top ? 0.88 : 1)); if (top && fr > 0.1) P.setY(i, y - (fr - 0.1) * sz.y * 0.32); } g.computeVertexNormals();
      var m = new T.Mesh(g, shm); m.userData.ownGeo = 1; m.castShadow = spec.shadow !== false; m.position.set(c.x, fb.min.y + sz.y * 0.31 - 0.004, c.z + sz.z * 0.03); mdl.add(m); mdl.updateMatrixWorld(true); fo.attach(m); });
    var mix = new T.AnimationMixer(mdl), act = {}, cur = null;
    function play(n, fade) { var c = clips[n]; if (!c) return; var a = act[n] || (act[n] = mix.clipAction(c)); if (cur === a) return; a.reset().setEffectiveWeight(1).play(); if (cur) cur.crossFadeTo(a, fade || 0.35, false); cur = a; }
    var mode = spec.anim || "idle"; play(mode === "sit" ? "Sitting_Idle_Loop" : mode === "walk" ? "Walk_Loop" : "Idle_Loop", 0);
    if (cur) { cur.time = Math.random() * 2; } mix.update(0);
    if (mode === "sit" && pel) { mdl.updateMatrixWorld(true); pel.getWorldPosition(tv); var dy = (spec.seatY || 0.46) + 0.1 - tv.y; mdl.position.y += dy; var dz = (spec.seatZ != null ? spec.seatZ : 0) - tv.z; mdl.position.z += dz; }
    root.position.set(spec.x || 0, 0, spec.z || 0); root.rotation.y = spec.ry || 0;
    var path = spec.path, pi = 1, lookY = 0, talkT = 0, sp = spec.speed || 1.05;
    if (path) { root.position.set(path[0][0], 0, path[0][1]); }
    var api = { root: root, head: head,
      say: function () { if (mode === "sit" || mode === "walk") return; play("Idle_Talking_Loop", 0.3); talkT = 2.6; },
      update: function (dt, px, pz) {
        if (path) { var tx = path[pi][0], tz = path[pi][1], dx = tx - root.position.x, dz = tz - root.position.z, d = Math.sqrt(dx * dx + dz * dz);
          if (d < 0.08) { pi = (pi + 1) % path.length; } else { var ya = Math.atan2(dx, dz), dyw = ya - root.rotation.y; while (dyw > Math.PI) dyw -= 2 * Math.PI; while (dyw < -Math.PI) dyw += 2 * Math.PI; root.rotation.y += dyw * Math.min(1, dt * 4); var st = Math.min(d, sp * dt * Math.max(0.2, Math.cos(dyw))); root.position.x += Math.sin(root.rotation.y) * st; root.position.z += Math.cos(root.rotation.y) * st; } }
        if (talkT > 0) { talkT -= dt; if (talkT <= 0) play("Idle_Loop", 0.5); }
        mix.update(dt);
        if (spec.look && neck && px != null) { var hx = px - root.position.x, hz = pz - root.position.z, want = 0; if (hx * hx + hz * hz < 25) { want = Math.atan2(hx, hz) - root.rotation.y; while (want > Math.PI) want -= 2 * Math.PI; while (want < -Math.PI) want += 2 * Math.PI; want = Math.max(-1.0, Math.min(1.0, want)); } lookY += (want - lookY) * Math.min(1, dt * 5);
          [[neck, 0.55], [head, 0.45]].forEach(function (q) { if (!q[0] || !q[0].parent) return; q[0].parent.getWorldQuaternion(pq); dq.setFromAxisAngle(up, lookY * q[1]); tq.copy(pq).invert().multiply(dq).multiply(pq); q[0].quaternion.premultiply(tq); }); }
      },
      dispose: function () { mix.stopAllAction(); root.traverse(function (o) { if (o.isSkinnedMesh && o.skeleton) o.skeleton.dispose(); }); mix.uncacheRoot(mdl); mats.forEach(function (m) { m.dispose(); }); root.traverse(function (o) { if (o.userData.ownGeo && o.geometry) o.geometry.dispose(); }); if (root.parent) root.parent.remove(root); }
    };
    return api;
  }
  window.JGNPC = { dbg: function () { return LIB && { pm: LIB.pm, pf: LIB.pf, prm: LIB.prm, prf: LIB.prf, hair: Object.keys(LIB.hair) }; }, LC: LC, load: load, make: make, ready: function () { return !!LIB; }, failed: function () { return FAIL; } };
})();
