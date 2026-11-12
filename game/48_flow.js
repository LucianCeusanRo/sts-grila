  /* ===== nivel (Normal / Greu), timpi, pauză, „Reia greșelile” pe timp, rezolvare automată (teste) ===== */
  var DIFF = (function () { try { return localStorage.getItem("jg_diff") === "greu" ? "greu" : "normal"; } catch (e) { return "normal"; } })();
  function setDiff(d) { DIFF = d === "greu" ? "greu" : "normal"; try { localStorage.setItem("jg_diff", DIFF); } catch (e) {} }
  function pauseT(on) { if (!G || !G.dl || G.scored) return; if (on) { if (DIFF === "greu" || G.pz) return; G.pz = now(); } else if (G.pz) { G.dl += now() - G.pz; G.pz = 0; } hudTimer(); }
  function minsFor(st, n, kind) { var g = DIFF === "greu"; if (kind === "exam") return g ? 35 : 45; if (kind === "replay") return Math.max(2, Math.ceil(n * (g ? 1.5 : 2.5))); var per = { m2: 6, m9: 5, m1: 5 }[st.mis]; if (per) return g ? Math.ceil(per * 0.7) : per; return Math.max(3, Math.ceil(n * (g ? 1.2 : 2))); }
  function timeUp() { var st = G; if (!st || st.scored) return; if (st.mode === "exam" || st.mode === "story") return examSubmit(true); if (st.mode === "replay") return replayEnd(true); missionTimeout(); }
  function missionTimeout() { var st = G; st.scored = true; closePanel(); SFX.bad(); var ok = st.obj.filter(function (o, i) { return st.done[i]; }).length; var P = B.P(); P.cli = P.cli || {}; var k = "jg:t:" + st.mis; P.cli[k] = (P.cli[k] || 0) + 1; B.saveP();
    showResult("⏱️ Timpul a expirat", "<p>Ai bifat <b>" + ok + "</b> din " + st.obj.length + " cerințe în " + minsFor(st, st.obj.length) + " min" + (DIFF === "greu" ? " (Greu)" : "") + ".</p>" + (st.tfault ? "<p>Defectul era: <b>" + esc(st.tfault[1]) + "</b></p>" : "") + replayBtn(), true); wireReplay(true); }
  /* care pas a fost greșit: după panoul deschis, altfel cerința curentă */
  function errKey() { if (!G || !G.obj || !G.obj.length) return null; var has = function (k) { return G.obj.some(function (o) { return o.k === k; }); };
    if (PANEL) { if (PANEL.id === "bench" && has("crimp")) return "crimp"; if (PANEL.id === "fiber" && has("fiber")) return "fiber"; if (PANEL.id === "rack" && G.ident && !G.ident.done && has("ident")) return "ident"; }
    for (var i = 0; i < G.obj.length; i++) { var k = G.obj[i].k; if (!G.done[i] && k !== "crimp" && k !== "fiber" && k !== "ident") return k; } var o = curObj(); return o ? o.k : null; }
  function failedObjs(st) { return st.obj.filter(function (o, i) { return !st.done[i] || (st.errK && st.errK[o.k]); }); }
  var RPT = 0;
  function replayBtn() { clearInterval(RPT); var f = G ? failedObjs(G) : []; return f.length ? '<div class="jgrep"><p><b>🔁 Reia greșelile</b> – doar cei ' + f.length + " pași greșiți / nefăcuți, pe timp (" + minsFor(G, f.length, "replay") + " min" + (DIFF === "greu" ? ", Greu: fără pauză" : "") + "):</p><ul class='jgol'>" + f.slice(0, 8).map(function (o) { return "<li>❌ " + esc(o.t) + "</li>"; }).join("") + (f.length > 8 ? "<li>… încă " + (f.length - 8) + "</li>" : "") + '</ul><div class="jgbtns"><button class="jgbig gold" data-f id="jgReplay">🔁 Reia greșelile acum</button><button class="jgbig2" data-f id="jgNoRep">Nu acum</button></div></div>' : '<p class="jgsm">Nicio greșeală de reluat. 👏</p>'; }
  function wireReplay(auto) { var b = $("jgReplay"); if (!b) return; var go = function () { clearInterval(RPT); closeModal(); startReplay(); }; b.onclick = go; if ($("jgNoRep")) $("jgNoRep").onclick = function () { clearInterval(RPT); b.textContent = "🔁 Reia greșelile acum"; var n = $("jgNoRep"); if (n) n.remove(); };
    if (auto && !B.coActive() && !(G && G.mode === "replay" && G.rpN > 2)) { var t = 10; b.textContent = "🔁 Pornește automat în " + t + " s"; RPT = setInterval(function () { t--; var e = $("jgReplay"); if (!e) { clearInterval(RPT); return; } if (t <= 0) go(); else e.textContent = "🔁 Pornește automat în " + t + " s"; }, 1000); } }
  var FREL = { shutPort: ["acc", "lan", "pingSw", "pcIp"], speed: ["putCom", "awake", "en"], rtrBad: ["rip", "rns", "pingGw"], upVlan: ["upAcc", "pingGw"] };
  var CFGK = ["host", "vlan", "acc", "svi", "dom", "rsa", "user", "vty", "upAcc", "esec", "conp", "spe", "ban"];
  function expandFail(keys, all) { var f = {}; keys.forEach(function (k) { f[k] = 1; }); var dep = function (a, bs) { if (f[a]) bs.forEach(function (b) { if (all.indexOf(b) >= 0) f[b] = 1; }); };
    dep("conSw", ["putCom", "awake", "en"]); dep("putCom", ["awake", "en"]); dep("awake", ["en"]); dep("host", ["rsa"]); dep("dom", ["rsa"]); CFGK.forEach(function (k) { dep(k, ["save"]); }); dep("dnet", ["dgot", "dcfg"]); dep("dgw", ["dgot", "dcfg"]); dep("dgot", ["dcfg"]); return all.filter(function (k) { return f[k]; }); }
  function buildReplay(st, keys) {
    var V = JSON.parse(JSON.stringify(st.V)); V.faults = (V.faults || []).filter(function (fk) { return FREL[fk].some(function (k) { return keys.indexOf(k) >= 0; }); });
    var s2 = newState("replay", st.mis, V); s2.fast = st.fast; s2.rpN = (st.rpN || 0) + 1; s2.from = st.mode; s2.story = st.story; if (/^[mb]/.test(st.mis) && st.mis !== "ex") setupMission(s2, st.mis); s2.tfault = st.tfault;
    var all = st.obj.map(function (o) { return o.k; }), fail = expandFail(keys, all), saveG = G; G = s2;
    try { all.forEach(function (k) { if (fail.indexOf(k) < 0 && SOLVE[k]) SOLVE[k](s2); }); } finally { G = saveG; }
    var X = allObjs(s2); s2.obj = fail.map(function (k) { return X[k]; }).filter(Boolean); s2.done = {}; s2.S.pc.did = s2.S.pc.did || {}; return s2; }
  function startReplay() { var st = G; if (!st) return; var f = failedObjs(st).map(function (o) { return o.k; }); if (!f.length) return; var s2 = buildReplay(st, f); G = s2;
    s2.dl = now() + minsFor(s2, s2.obj.length, "replay") * 60000; $("jgTitle").textContent = "🔁 Reia greșelile · " + (DIFF === "greu" ? "Greu" : "Normal"); setLevel("prac"); if (!V3) paint2d(); paintCarry(); setObj(s2.obj); linkTick(); say("Reluăm doar pașii greșiți (" + s2.obj.length + "). Ceasul pornește acum" + (DIFF === "greu" ? " și nu se oprește." : "."), 6000); }
  function replayEnd(timeout) { var st = G; if (st.scored) return; st.scored = true; closePanel(); var ok = st.obj.filter(function (o, i) { return st.done[i]; }).length; var P = B.P(); P.cli = P.cli || {}; P.cli["jg:rp"] = (P.cli["jg:rp"] || 0) + 1; if (!timeout && ok === st.obj.length) P.cli["jg:rpok"] = (P.cli["jg:rpok"] || 0) + 1; B.saveP(); if (ok === st.obj.length && !timeout) SFX.done(); else SFX.bad();
    showResult(timeout ? "⏱️ Timpul a expirat" : "🔁 Reluare terminată", "<p>Ai rezolvat <b>" + ok + "</b> din " + st.obj.length + " pași reluați în " + mmss(now() - st.t0) + (timeout ? " – timpul a expirat" : "") + ".</p>" + replayBtn(), true); wireReplay(false); }
  /* ---------- rezolvitor: face fiecare pas prin aceleași motoare (cabluri, IOS, Windows) – folosit la reluare și la testele automate ---------- */
  function cli(st, dev, cmds) { var d = st.S[dev], V = st.V; if (d.pend) gRun(d, ""); var seq = ["", "enable"]; seq.forEach(function (c) { gRun(d, c); if (d.pend && c === "enable") gRun(d, d.secret === V.en ? V.en : d.secret || d.epw); }); if (d.mode === "user") return; gRun(d, "configure terminal"); cmds.forEach(function (c) { var o = gRun(d, c); if (d.pend) gRun(d, /rsa/.test(c) ? "1024" : ""); }); gRun(d, "end"); }
  function settle(st) { linkTick(); Object.keys(st.linkT).forEach(function (k) { st.linkT[k] -= 40000; }); linkTick(); }
  function cab(st, t, a, b) { [a, b].forEach(function (x) { var c = cableAt(st, x); if (c) removeCable(st, c); }); addCable(st, t, a, b, true); settle(st); }
  function win(st, c) { var L = st.S.pc; settle(st); return B.winRun(L, c); }
  var SOLVE = {
    conSw: function (st) { cab(st, "usb", "pc.usb", "sw.con"); }, lan: function (st) { cab(st, "straight", "pc.lan", anchorOfIf(st.V.port)); }, up: function (st) { cab(st, "straight", st.V.upa, st.V.ra); }, rcon: function (st) { cab(st, "usb", "pc.usb2", "r.con"); },
    lanGreen: settle, upGreen: settle,
    putCom: function (st) { st.putty = { type: "serial", line: "COM" + st.V.com, speed: "9600", host: "", port: "22" }; st.con = { dev: st.S.sw, open: true, awake: false, title: "COM" + st.V.com + " - PuTTY", lines: [], speed: "9600", kind: "serial" }; },
    awake: function (st) { if (st.con) st.con.awake = true; }, en: function (st) { var s = st.S.sw; if (s.mode === "user") { gRun(s, "enable"); if (s.pend) gRun(s, s.secret || s.epw); } },
    host: function (st) { cli(st, "sw", ["hostname " + st.V.host]); }, vlan: function (st) { cli(st, "sw", ["vlan " + st.V.vlan, "name " + st.V.vname, "exit"]); },
    acc: function (st) { cli(st, "sw", ["interface " + st.V.port, "switchport mode access", "switchport access vlan " + st.V.vlan, "no shutdown"]); }, svi: function (st) { cli(st, "sw", ["interface vlan " + st.V.vlan, "ip address " + st.V.svi + " " + st.V.mask, "no shutdown"]); },
    dom: function (st) { cli(st, "sw", ["ip domain-name " + st.V.dom]); }, rsa: function (st) { cli(st, "sw", ["crypto key generate rsa modulus 1024"]); }, user: function (st) { cli(st, "sw", ["username " + st.V.user + " secret " + st.V.pass]); },
    vty: function (st) { cli(st, "sw", ["line vty 0 4", "login local", "transport input ssh"]); }, save: function (st) { var s = st.S.sw; cli(st, "sw", []); gRun(s, "copy running-config startup-config"); if (s.pend) gRun(s, ""); },
    rip: function (st) { cli(st, "r", ["interface " + st.V.rif, "ip address " + st.V.gw + " " + st.V.mask]); }, rns: function (st) { cli(st, "r", ["interface " + st.V.rif, "no shutdown"]); settle(st); },
    upAcc: function (st) { cli(st, "sw", ["interface " + st.V.up, "switchport mode access", "switchport access vlan " + st.V.vlan, "no shutdown"]); settle(st); },
    pcIp: function (st) { pcStatic(st); st.S.pc.ipFrom = ""; }, ipcfg: function (st) { win(st, "ipconfig"); }, pingGw: function (st) { win(st, "ping " + st.V.gw); }, pingSw: function (st) { win(st, "ping " + st.V.svi); }, ssh: function (st) { win(st, "ssh -l " + st.V.user + " " + st.V.svi); },
    ident: function (st) { st.ident = { done: true, q: [], i: 0, ok: 0 }; }, crimp: function (st) { st.crimp = { passed: true, got: [[], []], end: 1, step: 5 }; }, fiber: function (st) { st.fiber = { done: true, s: 9 }; },
    tcab: function (st) { cab(st, "straight", st.V.tr, "s2.gi1"); }, s2con: function (st) { cab(st, "usb", "pc.usb2", "s2.con"); },
    t1: function (st) { cli(st, "sw", ["interface " + ifOf(st.V.tr), "switchport mode trunk", "switchport trunk allowed vlan " + st.V.vlan + "," + st.V.vlan2]); settle(st); },
    s2v: function (st) { cli(st, "s2", ["vlan " + st.V.vlan, "exit", "vlan " + st.V.vlan2, "exit"]); }, t2: function (st) { cli(st, "s2", ["interface GigabitEthernet0/1", "switchport mode trunk", "switchport trunk allowed vlan " + st.V.vlan + "," + st.V.vlan2]); settle(st); },
    s2svi: function (st) { cli(st, "s2", ["interface vlan " + st.V.vlan, "ip address " + st.V.s2ip + " " + st.V.mask, "no shutdown"]); }, pingS2: function (st) { win(st, "ping " + st.V.s2ip); },
    rtk: function (st) { cli(st, "sw", ["interface " + st.V.up, "switchport mode trunk", "switchport trunk allowed vlan " + st.V.vlan + "," + st.V.vlan2, "no shutdown"]); settle(st); },
    subA: function (st) { cli(st, "r", ["interface " + st.V.rif + "." + st.V.vlan, "encapsulation dot1Q " + st.V.vlan, "ip address " + st.V.gw + " " + st.V.mask]); }, subB: function (st) { cli(st, "r", ["interface " + st.V.rif + "." + st.V.vlan2, "encapsulation dot1Q " + st.V.vlan2, "ip address " + st.V.gw2 + " " + st.V.mask]); },
    pA: function (st) { win(st, "ping " + st.V.gw); }, pB: function (st) { win(st, "ping " + st.V.gw2); },
    dex: function (st) { cli(st, "r", ["ip dhcp excluded-address " + st.V.gw]); }, dnet: function (st) { cli(st, "r", ["ip dhcp pool LAN", "network " + st.V.net + " " + st.V.mask]); }, dgw: function (st) { cli(st, "r", ["ip dhcp pool LAN", "default-router " + st.V.gw]); },
    dgot: function (st) { var L = st.S.pc; L.dhcp = true; settle(st); var g = L.dhcpGet(); if (g) { L.ip = g.ip; L.mask = g.mask; L.gw = g.gw; } }, dcfg: function (st) { win(st, "ipconfig /all"); },
    esec: function (st) { cli(st, "sw", ["enable secret " + st.V.en]); }, conp: function (st) { cli(st, "sw", ["line console 0", "password " + st.V.conpw, "login"]); }, spe: function (st) { cli(st, "sw", ["service password-encryption"]); }, ban: function (st) { cli(st, "sw", ["banner motd #" + st.V.motd + "#"]); },
    tpS: function (st) { var f = st.tfault && st.tfault[0], V = st.V; if (f === "cable") cab(st, "straight", V.upa, V.ra); if (f === "shut") cli(st, "sw", ["interface " + V.port, "no shutdown"]); if (f === "vlan") cli(st, "sw", ["interface " + V.port, "switchport access vlan " + V.vlan]); if (f === "mask") st.S.pc.mask = V.mask; if (f === "rshut") cli(st, "r", ["interface " + V.rif, "no shutdown"]); settle(st); win(st, "ping " + V.svi); },
    tpG: function (st) { win(st, "ping " + st.V.gw); }, diag: function (st) { st.diagOK = true; }
  };
  /* rulează o misiune întreagă cu rezolvitorul (doar pentru teste: window.__jg) */
  function autoSolve(id, seed, diff, skip) { var d0 = DIFF; setDiff(diff); try { var V = genVar(seed, 1); if (diff === "greu" && id === "ex") addFaults(V, seed); var st = newState(id === "ex" ? "exam" : "mis", id, V), saveG = G; G = st; st.fast = true;
      try { if (id === "ex") st.obj = examObjs(st); else { setupMission(st, id); st.obj = MS(st)[id].obj; } st.done = {}; st.obj.forEach(function (o) { if (!(skip && skip.indexOf(o.k) >= 0)) { if (!SOLVE[o.k]) throw new Error("fără rezolvitor: " + o.k); SOLVE[o.k](st); } settle(st); });
        st.obj.forEach(function (o, i) { var ok = false; try { ok = !!o.ok(st); } catch (e) { ok = false; } if (ok) st.done[i] = 1; });
        var res = { id: id, seed: seed, total: st.obj.length, done: Object.keys(st.done).length, fail: st.obj.filter(function (o, i) { return !st.done[i]; }).map(function (o) { return o.k; }), grade: id === "ex" ? examGrade(st).g : null, V: { host: V.host, vlan: V.vlan, net: V.net + "/" + V.pre, rif: V.rif, up: V.up, port: V.port, faults: V.faults, groups: st.exg }, dbg: { lu: st.led[V.upa], lr: st.led[V.ra], u: st.S.sw.ifs[V.up], g: st.S.r.ifs[V.rif], pc: [st.S.pc.ip, st.S.pc.mask, st.S.pc.gw], gw: V.gw, svi: V.svi, cab: st.cab.map(function (c) { return c.t + ":" + c.a + "-" + c.b; }), save: CK.save(st) } };
        if (skip && skip.length) { var r2 = buildReplay(st, skip.filter(function (k) { return st.obj.some(function (o) { return o.k === k; }); })); G = r2; r2.obj.forEach(function (o) { SOLVE[o.k](r2); settle(r2); }); res.replay = { total: r2.obj.length, done: r2.obj.filter(function (o) { try { return o.ok(r2); } catch (e) { return false; } }).length, keys: r2.obj.map(function (o) { return o.k; }) }; }
        return res; } finally { G = saveG; } } finally { setDiff(d0); } }
  /* test negativ: valori greșite (dar plauzibile) NU trebuie acceptate */
  function negTest(seed) { var V0 = genVar(seed, 1), bad = [], saveG = G;
    function alt(ip) { var a = ip.split("."); a[3] = String(((+a[3] + 7) % 250) + 1); var x = a.join("."); return x === V0.pc || x === V0.gw || x === V0.svi ? alt(x) : x; }
    var portN = String(V0.port).replace(/(\d+)$/, function (m) { return String((+m % 20) + 1 === +m ? +m + 1 : (+m % 20) + 1); });
    var C = [["host", function (st) { cli(st, "sw", ["hostname " + st.V.host + "X"]); }],
      ["vlan", function (st) { cli(st, "sw", ["vlan " + (+st.V.vlan + 1), "name " + st.V.vname, "exit"]); }],
      ["vlan", function (st) { cli(st, "sw", ["vlan " + st.V.vlan, "name GRESIT", "exit"]); }],
      ["acc", function (st) { cli(st, "sw", ["interface " + portN, "switchport mode access", "switchport access vlan " + st.V.vlan, "no shutdown"]); }],
      ["acc", function (st) { cli(st, "sw", ["interface " + st.V.port, "switchport mode access", "switchport access vlan " + (+st.V.vlan + 1), "no shutdown"]); }],
      ["svi", function (st) { cli(st, "sw", ["interface vlan " + st.V.vlan, "ip address " + alt(st.V.svi) + " " + st.V.mask, "no shutdown"]); }],
      ["dom", function (st) { cli(st, "sw", ["ip domain-name gresit.ro"]); }],
      ["user", function (st) { cli(st, "sw", ["username " + st.V.user + "x secret " + st.V.pass]); }],
      ["pcIp", function (st) { pcStatic(st); st.S.pc.mask = "255.255.255.252" === st.V.mask ? "255.255.255.0" : "255.255.255.252"; st.S.pc.ipFrom = ""; }],
      ["pcIp", function (st) { pcStatic(st); st.S.pc.gw = alt(st.V.gw); st.S.pc.ipFrom = ""; }],
      ["upAcc", function (st) { cli(st, "sw", ["interface " + st.V.up, "switchport mode trunk", "no shutdown"]); settle(st); }],
      ["upAcc", function (st) { cli(st, "sw", ["interface " + st.V.up, "switchport mode access", "switchport access vlan " + st.V.vlan, "shutdown"]); settle(st); }]];
    C.forEach(function (c) { var st = newState("exam", "ex", genVar(seed, 1)); G = st; st.fast = true; try { st.obj = examObjs(st); st.obj.forEach(function (o) { if (o.k !== c[0]) SOLVE[o.k](st); else c[1](st); settle(st); });
      var o = st.obj.filter(function (x) { return x.k === c[0]; })[0]; var ok = false; try { ok = !!o.ok(st); } catch (e) {} if (ok) bad.push(c[0] + ":" + C.indexOf(c)); if (examGrade(st).g >= 10) bad.push("grade10:" + C.indexOf(c)); } catch (e) { bad.push("EXC " + c[0] + " " + e.message); } finally { G = saveG; } });
    var d = newState("mis", "b3", genVar(seed, 1)); G = d; try { setupMission(d, "b3"); cli(d, "r", ["ip dhcp excluded-address " + d.V.gw]); var n1 = (d.S.r.dexcl || []).length; cli(d, "r", ["no ip dhcp excluded-address " + d.V.gw]); if (!(n1 === 1 && d.S.r.dexcl.length === 0)) bad.push("dhcp-no-excl"); } catch (e) { bad.push("EXC dhcp " + e.message); } finally { G = saveG; }
    return bad; }

