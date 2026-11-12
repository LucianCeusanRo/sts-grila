/* ===================== 🎮 JOC PRACTIC STS – logica jocului ===================== */
var JG = (function () {
  "use strict";
  var B = null, root = null, G = null, V3 = null, CTL = null, PANEL = null, tickT = 0, sayT = 0, timerT = 0;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function now() { return Date.now(); }
  /* ---------- biletele (3 variante, ca la examen) ---------- */
  /* ---------- biletele: generate aleator la fiecare simulare (3 variante trase la start, ca la examen) ---------- */
  function mkRng(seed) { var a = (seed >>> 0) || 1; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function i2ip(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join("."); }
  var HOSTS = ["SW1", "SW-STS", "S1", "SW-BC", "SW-LAB", "SW-ETAJ1", "BC-SW01", "SWITCH-A", "SW-ACCES", "S-BACAU"], VN = ["MGMT", "ADMIN", "STS", "TEHNIC", "BIROU", "LAB", "SERVICIU", "DATE", "ADMINISTRARE", "CONTROL"], DOMS = ["sts.ro", "sts.local", "bacau.sts.ro", "stsbc.ro", "lab.sts.ro", "exam.local", "retea.sts.ro"], USERS = ["admin", "tehnic", "operator", "student", "cisco", "sts", "candidat"], PW = ["Cisco", "Sts", "Bacau", "Retea", "Parola", "Admin"];
  var FAULTS = { shutPort: "Portul laptopului era oprit (administratively down) → no shutdown pe el", speed: "PuTTY era salvat pe altă viteză decât 9600 → caractere ciudate până pui 9600", rtrBad: "Routerul avea deja altă adresă pe interfață (și era oprit) → ip address corect + no shutdown", upVlan: "Portul spre router era într-un VLAN greșit → switchport access vlan corect" };
  function genVar(seed, n) {
    var r = mkRng(seed), pk = function (a) { return a[Math.floor(r() * a.length)]; }, ri = function (lo, hi) { return lo + Math.floor(r() * (hi - lo + 1)); };
    var vlan; do { vlan = ri(2, 999); } while (vlan >= 1002); if (r() < 0.4) vlan = pk([10, 20, 30, 40, 50, 99, 100]);
    var pre = pk([24, 24, 24, 25, 26, 27, 28]), sz = Math.pow(2, 32 - pre), base;
    var fam = ri(0, 2); if (fam === 0) base = (192 << 24 | 168 << 16 | ri(0, 254) << 8) >>> 0; else if (fam === 1) base = (10 << 24 | ri(0, 254) << 16 | ri(0, 254) << 8) >>> 0; else base = (172 << 24 | ri(16, 31) << 16 | ri(0, 254) << 8) >>> 0;
    base = (base + Math.floor(r() * (256 / sz)) * sz) >>> 0;
    var hosts = sz - 2, used = {}, pickH = function (pref) { var h = pref; if (!h || used[h]) do { h = ri(1, hosts); } while (used[h]); used[h] = 1; return (base + h) >>> 0; };
    var gw = pickH(r() < 0.6 ? 1 : r() < 0.5 ? hosts : 0), svi = pickH(r() < 0.5 ? 2 : 0), pc = pickH(r() < 0.4 ? 10 : 0);
    var mask = i2ip((0xFFFFFFFF << (32 - pre)) >>> 0), port = ri(1, 24), up = ri(1, 2), rg = ri(0, 1), com = ri(3, 8);
    var o = { n: n || 1, seed: seed, host: pk(HOSTS), vlan: vlan, vname: pk(VN), port: "FastEthernet0/" + port, pshort: "Fa0/" + port, svi: i2ip(svi), gw: i2ip(gw), pc: i2ip(pc), mask: mask, pre: pre, net: i2ip(base),
      dom: pk(DOMS), user: pk(USERS), pass: pk(PW) + ri(10, 9999), up: "GigabitEthernet0/" + up, upa: "sw.gi" + up, upshort: "Gi0/" + up, rif: "GigabitEthernet0/" + rg, ra: "r.g" + rg, rshort: "G0/" + rg, com: com, rcom: com + 1,
      ord: r(), opt: { ident: r() < 0.7, fiber: r() < 0.5 }, faults: [] };
    var V = o; o.tr = "sw.gi" + (3 - up); var v2; do { v2 = ri(2, 999); } while (v2 === vlan || v2 >= 1002); o.vlan2 = v2; o.vname2 = pk(VN.filter(function (x) { return x !== o.vname; }));
    var b2 = (base ^ 0x100) >>> 0; o.net2 = i2ip(b2); o.gw2 = i2ip((b2 + (gw - base)) >>> 0); o.s2ip = i2ip(pickH(0)); o.en = pk(["Cl4s4", "Secret", "Enable", "Priv"]) + ri(10, 999); o.conpw = pk(["Cons", "Linie", "Port"]) + ri(10, 999); o.motd = pk(["Acces autorizat doar personalului STS", "Acces interzis persoanelor neautorizate", "Echipament STS - acces monitorizat"]);
    var fr = -(ri(30, 120) / 10), dirty = 3 + ri(2, 15) / 10, clean = ri(6, 25) / 10; o.fb = { wl: pk([1310, 1550]), ref: fr, dirty: dirty, clean: clean, budget: 3 }; return o;
  }
  function addFaults(V, seed) { var r = mkRng(seed ^ 0x5f3759df), ks = Object.keys(FAULTS), out = []; while (out.length < 2) { var k = ks[Math.floor(r() * ks.length)]; if (out.indexOf(k) < 0) out.push(k); } V.faults = out; return V; }
  function seed0() { return (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0; }
  function draw3(diff) { var s = seed0(); return [0, 1, 2].map(function (i) { var V = genVar((s + i * 7919) >>> 0, i + 1); if (diff === "greu") addFaults(V, V.seed); return V; }); }
  var CAB = {
    straight: { n: "Cablu drept UTP (T568B – T568B)", c: "#2563eb", ic: "🔵", why: "Drept = aceeași schemă la ambele capete. Leagă echipamente DIFERITE: laptop/PC → switch, switch → router." },
    cross: { n: "Cablu crossover (T568A – T568B)", c: "#eab308", ic: "🟡", why: "Crossover = perechile 1-2 și 3-6 inversate. Clasic pentru echipamente de ACELAȘI fel (switch–switch, PC–PC). Azi auto-MDIX îl face să meargă oriunde, dar la examen se cere cel corect." },
    roll: { n: "Cablu rollover / consolă (RJ45 – DB9, albastru deschis, plat)", c: "#7dd3fc", ic: "🩵", why: "Rollover = firele în ordine inversă (1↔8). Se pune în portul CONSOLE și la laptop în portul serial (DB9) – azi prin adaptor USB-serial. Nu transportă date de rețea." },
    usb: { n: "Cablu consolă USB – RJ45", c: "#111827", ic: "⚫", why: "Varianta modernă a cablului de consolă: USB în laptop, RJ45 în portul CONSOLE. În Windows apare ca port COM (Device Manager → Ports)." }
  };
  var PN = { "pc.lan": "Laptop – placa de rețea (RJ45)", "pc.usb": "Laptop – USB 1", "pc.usb2": "Laptop – USB 2", "sw.con": "Switch – CONSOLE", "r.con": "Router – CON", "sw.gi1": "Switch – Gi0/1", "sw.gi2": "Switch – Gi0/2", "r.g0": "Router – GE 0/0", "r.g1": "Router – GE 0/1", "r.aux": "Router – AUX", "r.usb0": "Router – USB 0", "r.usb1": "Router – USB 1", "r.minicon": "Router – consolă mini-USB" };
  function pname(a) { if (PN[a]) return PN[a]; var m = /^sw\.fa(\d+)$/.exec(a); if (m) return "Switch – Fa0/" + m[1]; if ((m = /^s2\.fa(\d+)$/.exec(a))) return "SW2 – Fa0/" + m[1]; if ((m = /^s2\.gi(\d)$/.exec(a))) return "SW2 – Gi0/" + m[1]; if (a === "s2.con") return "SW2 – CONSOLE"; return a; }
  function ifOf(a) { var m; if ((m = /^sw\.fa(\d+)$/.exec(a))) return "FastEthernet0/" + m[1]; if (a === "sw.gi1") return "GigabitEthernet0/1"; if (a === "sw.gi2") return "GigabitEthernet0/2"; if ((m = /^s2\.fa(\d+)$/.exec(a))) return "FastEthernet0/" + m[1]; if (a === "s2.gi1") return "GigabitEthernet0/1"; if (a === "s2.gi2") return "GigabitEthernet0/2"; if (a === "r.g0") return "GigabitEthernet0/0"; if (a === "r.g1") return "GigabitEthernet0/1"; return null; }
  function anchorOfIf(n) { var m; if ((m = /^FastEthernet0\/(\d+)$/.exec(n))) return "sw.fa" + m[1]; return n === "GigabitEthernet0/1" ? "sw.gi1" : n === "GigabitEthernet0/2" ? "sw.gi2" : null; }
  /* ---------- sunete realiste (folosesc mute-ul aplicației) ---------- */
  var SFX = {
    click: function () { B.tone([[1800, 0, 0.012, "square"], [900, 0.012, 0.02, "square"]]); },
    plug: function () { B.tone([[2400, 0, 0.01, "square"], [1200, 0.01, 0.03, "square"], [500, 0.04, 0.02, "triangle"]]); },
    crimp: function () { B.tone([[140, 0, 0.12, "sawtooth"], [90, 0.1, 0.14, "sawtooth"], [2600, 0.24, 0.015, "square"]]); },
    beep: function () { B.tone([[1000, 0, 0.08, "square"]]); },
    step: function () { B.tone([[110, 0, 0.03, "triangle"]]); },
    key: function () { B.tone([[2000 + Math.random() * 600, 0, 0.008, "square"]]); },
    ok: function () { B.SND.ok(); }, bad: function () { B.SND.bad(); }, done: function () { B.SND.done(); }
  };
  /* ---------- starea jocului ---------- */
  function newState(mode, mis, V) {
    var S = B.gxSession({}); if (!V || typeof V !== "object") { V = genVar(seed0(), 1); if (DIFF === "greu" && (mode === "exam" || mode === "story")) addFaults(V, V.seed); }
    var st = { mode: mode, mis: mis, V: V, S: S, cab: [], carry: null, led: {}, linkT: {}, act: {}, fast: false, hints: 0, err: 0, t0: now(), dl: 0, obj: [], done: {}, log: [], putty: { type: "ssh", line: "COM1", speed: "9600", host: "", port: "22" }, con: null, crimp: null, fiber: null, ident: null, theory: null, story: null, lv: "prac", res: {}, scored: false };
    ["sw", "r"].forEach(function (d) { var s = S[d]; s.unpl = {}; Object.keys(s.ifs).forEach(function (n) { if (!/^Vlan/.test(n)) s.unpl[n] = 1; }); });
    S.pc.ip = "169.254.12.7"; S.pc.mask = "255.255.0.0"; S.pc.gw = ""; S.pc.dhcp = true; S.pc.dns = "";
    var L = S.pc, sw = S.sw, rr = S.r, s0 = L.ssh; st.putty.speed = "9600";
    L.reach = function (ip) { return pcReach(st, ip); }; L.dhcpGet = function () { var g = dhcpGet(st); if (g) L.ipFrom = "dhcp"; return g; };
    L.ssh = function (user, host) { return s0(user, host).map(function (x) { return String(x).replace(/portului Fa0\/1/g, "portului " + V.pshort).replace(/ssh -l admin /g, "ssh -l " + V.user + " "); }); };
    applyFaults(st);
    return st;
  }
  function fwd(st) { var c = lanCable(st); if (!c) return false; var a = c.a === "pc.lan" ? c.b : c.a; return st.led[a] === "green" || st.led[a] === "blink"; }
  function uplinkFwd(st) { if (!uplink(st)) return false; var a = st.V.upa; return (st.led[a] === "green" || st.led[a] === "blink") && (st.led[st.V.ra] === "green" || st.led[st.V.ra] === "blink"); }
  function applyFaults(st) { var V = st.V, f = V.faults || []; st.faultsFixed = {};
    if (f.indexOf("shutPort") >= 0) ["enable", "configure terminal", "interface " + V.port, "shutdown", "end", ""].forEach(function (c) { B.cliRun(st.S.sw, c); });
    if (f.indexOf("upVlan") >= 0) ["enable", "configure terminal", "vlan 999", "name PARCARE", "exit", "interface " + V.up, "switchport mode access", "switchport access vlan 999", "end", ""].forEach(function (c) { B.cliRun(st.S.sw, c); });
    if (f.indexOf("rtrBad") >= 0) { var p = V.gw.split("."); p[3] = String((+p[3] + 3) % 254 + 1); ["enable", "configure terminal", "interface " + V.rif, "ip address " + p.join(".") + " 255.255.255.252", "shutdown", "end", ""].forEach(function (c) { B.cliRun(st.S.r, c); }); }
    if (f.indexOf("speed") >= 0) st.putty.speed = "115200";
    ["sw", "r"].forEach(function (d) { var s = st.S[d]; s.mode = "user"; s.hist = []; s.did = {}; s.saved = false; }); }
  function cableAt(st, a) { for (var i = 0; i < st.cab.length; i++) if (st.cab[i].a === a || st.cab[i].b === a) return st.cab[i]; return null; }
  function other(c, a) { return c.a === a ? c.b : c.a; }
  function lanCable(st) { var c = cableAt(st, "pc.lan"); if (!c) return null; var o = other(c, "pc.lan"); return /^sw\.(fa|gi)/.test(o) && (c.t === "straight" || c.t === "cross") ? c : null; }
  function conCable(st, dev) { var c = cableAt(st, dev + ".con"); if (!c) return null; var o = other(c, dev + ".con"); return /^pc\.usb/.test(o) && (c.t === "usb" || c.t === "roll") ? c : null; }
  function comOf(st, dev) { var c = conCable(st, dev); if (!c) return ""; return "COM" + (other(c, dev + ".con") === "pc.usb" ? st.V.com : st.V.rcom); }
  function uplink(st) { var c = cableAt(st, st.V.ra); if (!c) return null; var o = other(c, st.V.ra); return o === st.V.upa && (c.t === "straight" || c.t === "cross") ? c : null; }
  /* ---------- LED-uri și legături (ca pe echipamentul real) ---------- */
  function partnerUp(st, a, c) { var o = other(c, a); if (c.t === "usb" || c.t === "roll") return false; if (o === "pc.lan") return true; if (/^r\.g/.test(o)) { var f = st.S.r.ifs[ifOf(o)]; return f && !f.shut; } if (/^s2\./.test(o)) { var h = st.S.s2 && st.S.s2.ifs[ifOf(o)]; return h && !h.shut; } if (/^sw\./.test(o)) { var g = st.S.sw.ifs[ifOf(o)]; return g && !g.shut; } return false; }
  function linkTick() {
    if (!G) return; var st = G, t = now(), sw = st.S.sw, r = st.S.r, chg = false, msgs = [];
    var ports = []; for (var i = 1; i <= 24; i++) ports.push("sw.fa" + i); ports.push("sw.gi1", "sw.gi2", "r.g0", "r.g1"); if (st.S.s2) { for (var j = 1; j <= 24; j++) ports.push("s2.fa" + j); ports.push("s2.gi1", "s2.gi2"); }
    ports.forEach(function (a) {
      var dev = a.indexOf("s2.") === 0 ? st.S.s2 : a.charAt(0) === "s" ? sw : r, n = ifOf(a), f = dev.ifs[n], c = cableAt(st, a), up = !!(c && f && !f.shut && (c.t === "straight" || c.t === "cross") && partnerUp(st, a, c)), was = !dev.unpl[n], s;
      if (up && !st.linkT[a]) { st.linkT[a] = t; }
      if (!up && st.linkT[a]) delete st.linkT[a];
      if (up && !was) { delete dev.unpl[n]; msgs.push([dev, "%LINK-3-UPDOWN: Interface " + n + ", changed state to up"]); setTimeout(function () { if (G === st && !dev.unpl[n]) conMsg(dev, "%LINEPROTO-5-UPDOWN: Line protocol on Interface " + n + ", changed state to up"); }, 1200); chg = true; }
      if (!up && was) { dev.unpl[n] = 1; if (f && !f.shut) { msgs.push([dev, "%LINEPROTO-5-UPDOWN: Line protocol on Interface " + n + ", changed state to down"]); msgs.push([dev, "%LINK-3-UPDOWN: Interface " + n + ", changed state to down"]); } chg = true; }
      if (!up) s = "off"; else if (dev === r) s = st.act[a] && t - st.act[a] < 1500 ? "blink" : "green"; else { var stp = (t - st.linkT[a]) * (st.fast ? 10 : 1); s = stp < 30000 ? "amber" : (st.act[a] && t - st.act[a] < 1500 ? "blink" : "green"); }
      if (st.led[a] !== s) { st.led[a] = s; chg = true; if (V3) V3.setLed(a, s); }
    });
    var lc = lanCable(st); st.S.pcPort = lc ? ifOf(other(lc, "pc.lan")) : "none"; sw.cport = st.S.pcPort !== "none" ? st.S.pcPort : "";
    var sys = "green"; if (V3) { V3.setLed("sw.syst", sys); V3.setLed("r.sys", sys); }
    msgs.forEach(function (m) { conMsg(m[0], m[1]); });
    if (chg) { if (PANEL && PANEL.id === "rack") paintRack(); checkObj(); }
    hudTimer();
  }
  function conMsg(dev, line) { if (G && G.con && G.con.dev === dev && G.con.tb && G.con.awake) { G.con.tb.add(line, "thint"); G.con.tb.paint(); } }
  /* ---------- obiective și scor ---------- */
  function setObj(list) { G.obj = list; G.done = {}; G.oi = 0; checkObj(true); }
  function checkObj(silent) {
    if (!G || !G.obj) return; var st = G, nw = [];
    st.obj.forEach(function (o, i) { var ok = false; try { ok = !!o.ok(st); } catch (e) { ok = false; } if (ok && !st.done[i]) { st.done[i] = now(); nw.push(o); } });
    if (nw.length && !silent) { var o = nw[nw.length - 1]; SFX.ok(); learn("✅ " + o.t, o.why); if (st.mode !== "exam") say(o.say || "Corect. " + (o.why ? o.why.split(".")[0] + "." : ""), 3500); }
    paintObj();
    var all = st.obj.length && st.obj.every(function (o, i) { return st.done[i]; });
    if (all && !st.fin && (st.mode === "mis" || st.mode === "replay")) { st.fin = 1; setTimeout(function () { if (G === st) (st.mode === "replay" ? replayEnd : missionDone)(false); }, 900); }
  }
  function curObj() { if (!G || !G.obj) return null; for (var i = 0; i < G.obj.length; i++) if (!G.done[i]) return G.obj[i]; return null; }
  function learn(t, why) { G.log.unshift([t, why || ""]); if (G.log.length > 40) G.log.length = 40; var l = $("jgLog"); if (l) paintLog(); }
  function mistake(msg, why, key) { G.err++; var ek = key && G.obj && G.obj.some(function (o) { return o.k === key; }) ? key : errKey(); if (ek) { G.errK = G.errK || {}; G.errK[ek] = 1; } SFX.bad(); say("Atenție! " + msg, 5000, true); if (why) learn("❌ " + msg, why); }
  /* ---------- HUD ---------- */
  function say(t, ms, warn) { var b = $("jgSay"); if (!b) return; b.innerHTML = '<b>' + (G && G.lv === "out" ? "🪖 Paznicul" : G && G.lv === "hall" ? "🧑‍💼 Recepția" : "🎖️ Examinatorul") + ":</b> " + esc(t); b.className = "jgsay on" + (warn ? " warn" : ""); clearTimeout(sayT); sayT = setTimeout(function () { b.className = "jgsay"; }, ms || 4500); if (V3) V3.say(); }
  function paintObj() { var o = curObj(), e = $("jgObj"); if (!e) return; var n = G.obj ? G.obj.length : 0, d = Object.keys(G.done).length; e.innerHTML = o ? "<b>" + (d + 1) + "/" + n + "</b> " + esc(o.t) : n ? "✅ Toate cerințele bifate" : esc(G.goal || ""); }
  function paintLog() { var l = $("jgLog"); if (l) l.innerHTML = G.log.slice(0, 8).map(function (x) { return "<li><b>" + esc(x[0]) + "</b>" + (x[1] ? "<br><span>" + esc(x[1]) + "</span>" : "") + "</li>"; }).join(""); }
  function hudTimer() { var e = $("jgTime"); if (!e || !G) return; if (G.dl) { var left = Math.max(0, G.dl - (G.pz || now())), m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60; e.textContent = (G.pz ? "⏸ " : "⏱ ") + m + ":" + (s < 10 ? "0" : "") + s + (DIFF === "greu" ? " · Greu" : ""); e.className = "jgtime" + (left < 300000 ? " low" : ""); [600000, 300000, 60000].forEach(function (w) { if (left <= w && !G["w" + w]) { G["w" + w] = 1; say("Mai aveți " + (w / 60000) + (w === 60000 ? " minut." : " minute."), 4000); } }); if (left <= 0 && !G.scored) { say("Timpul a expirat! Lăsați echipamentele.", 5000, true); timeUp(); } } else e.textContent = ""; }
  function hint() { var o = curObj(); if (!o) return; G.hints++; G.errK = G.errK || {}; G.errK[o.k] = 1; say("Indiciu: " + o.hint, 9000); learn("💡 " + o.t, o.hint); }
