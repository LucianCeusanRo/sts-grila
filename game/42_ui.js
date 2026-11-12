  /* ---------- cabluri ---------- */
  var cabN = 0;
  function addCable(st, t, a, b, silent) { var c = { id: "c" + (++cabN), t: t, a: a, b: b }; st.cab.push(c); if (V3 && st === G) V3.setCable(c.id, { a: a, b: b, color: CAB[t].c }); if (!silent) cableJudge(st, c); return c; }
  function removeCable(st, c) { st.cab.splice(st.cab.indexOf(c), 1); if (V3) V3.setCable(c.id, null); }
  function cableJudge(st, c) {
    var a = c.a, b = c.b, t = c.t, ends = [a, b].sort().join("|"), con = /\.con$/.test(a) || /\.con$/.test(b), usbEnd = /^pc\.usb/.test(a) || /^pc\.usb/.test(b), lanEnd = a === "pc.lan" || b === "pc.lan", ck = /r\.con/.test(ends) ? "rcon" : /s2\.con/.test(ends) ? "s2con" : con || usbEnd ? "conSw" : lanEnd ? "lan" : /(^|\|)s2\./.test(ends) && /(^|\|)sw\./.test(ends) ? "tcab" : /(^|\|)r\.g/.test(ends) ? "up" : null;
    if (con && !(t === "usb" || t === "roll")) return mistake("Portul CONSOLE nu e port de rețea: aici merge cablul de consolă (USB–RJ45 sau rollover), nu " + CAB[t].n.split(" (")[0].toLowerCase() + ".", CAB[t].why, ck);
    if (usbEnd && !(t === "usb" || t === "roll")) return mistake("În USB-ul laptopului intră doar cablul de consolă USB (sau rollover-ul prin adaptor).", "Portul USB al laptopului e pentru cablul de consolă USB–RJ45.", ck);
    if ((t === "usb" || t === "roll") && !con) return mistake("Cablul de consolă se pune în portul CONSOLE, nu într-un port de date. Așa nu ai nici legătură de rețea, nici consolă.", CAB[t].why, ck);
    if (con && usbEnd) { learn("🔌 " + CAB[t].n + ": " + pname(a) + " ↔ " + pname(b), CAB[t].why + (t === "roll" ? " (La laptop: prin adaptor USB–serial DB9.)" : "")); if (G.mode !== "exam") say("Bine. Cablul de consolă e pus. Pe laptop o să apară un port COM nou.", 4000); return; }
    if (lanEnd && /^r\./.test(a + b) && !/^sw/.test(a) && !/^sw/.test(b)) { learn("Laptop direct în router", "Merge cu crossover (sau auto-MDIX), dar la examen laptopul se leagă la switch."); }
    if (/^s[w2]\./.test(a) && /^s[w2]\./.test(b) && a.slice(0, 2) !== b.slice(0, 2)) { learn("🔌 " + CAB[t].n + ": " + pname(a) + " ↔ " + pname(b), t === "cross" ? "Switch–switch = același tip de echipament → clasic crossover. Corect." : "Switch–switch: clasic se folosește crossover; cablul drept merge datorită auto-MDIX (porturile Gigabit îl au)."); return; }
    if (t === "cross") return mistake("Cablu crossover între echipamente diferite. Ar merge datorită auto-MDIX, dar la examen se cere cablu DREPT.", CAB.cross.why, ck);
    learn("🔌 " + CAB[t].n + ": " + pname(a) + " ↔ " + pname(b), CAB[t].why);
    if (G.mode !== "exam") say(/^r\.g/.test(a + "") || /^r\.g/.test(b) ? "Cablul e pus. Vedeți LED-ul routerului? Stinge – portul e oprit până dați no shutdown." : "Bun. LED-ul e portocaliu: STP verifică portul ~30 de secunde, apoi devine verde.", 5500);
  }
  function plugAt(a) {
    var st = G; if (!st) return;
    var ex = cableAt(st, a);
    if (!st.carry) { if (ex && (st.unA !== a || Date.now() - (st.unT || 0) > 5000)) { st.unA = a; st.unT = Date.now(); toastG("Atinge încă o dată ca să scoți cablul din " + pname(a) + "."); return; } st.unA = null; if (ex) { removeCable(st, ex); SFX.plug(); learn("Ai scos cablul din " + pname(a)); toastG("Cablu scos: " + pname(a)); linkTick(); refreshPanel(); } else toastG("Ia întâi un cablu din cutie (sau trage capătul din mână pe port)."); return; }
    if (ex) { toastG("Portul " + pname(a) + " e ocupat. Atinge-l fără cablu în mână ca să scoți cablul."); return; }
    if (!st.carry.a) { st.carry.a = a; SFX.plug(); toastG("Primul capăt în " + pname(a) + ". Acum du celălalt capăt la portul de destinație."); refreshPanel(); return; }
    if (st.carry.a === a) return;
    var c = addCable(st, st.carry.t, st.carry.a, a); st.carry = null; if (V3) V3.setCarry(null); SFX.plug(); paintCarry(); linkTick(); checkObj(); refreshPanel();
  }
  function toastG(t) { var e = $("jgToast"); if (!e) return; e.textContent = t; e.className = "jgtoast on"; clearTimeout(e._t); e._t = setTimeout(function () { e.className = "jgtoast"; }, 2600); }
  function paintCarry() { var e = $("jgCarry"); if (!e) return; var c = G.carry; e.innerHTML = c ? '<span class="jgdot" style="background:' + CAB[c.t].c + '"></span>' + esc(CAB[c.t].n.split(" (")[0]) + (c.a ? " · capăt 1 în " + esc(pname(c.a)) : "") + ' <button class="jgx" id="jgDrop" aria-label="Pune cablul înapoi">✕</button>' : ""; e.className = "jgcarry" + (c ? " on" : ""); if ($("jgDrop")) $("jgDrop").onclick = function () { G.carry = null; if (V3) V3.setCarry(null); paintCarry(); refreshPanel(); }; }
  /* ---------- montarea ecranului ---------- */
  var KEYH = null, LOOK = null, VIS = null;
  function mount(app, bridge, arg) {
    B = bridge; unmount(true); root = document.createElement("div"); root.className = "jg"; root.id = "jgRoot";
    root.innerHTML = '<div class="jgview" id="jgView"></div><div class="jgtop"><div class="jgtitle" id="jgTitle">🎮 Joc practic</div><div class="jgobj" id="jgObj"></div><div class="jgrow"><span class="jgtime" id="jgTime"></span><button class="jgbtn" id="jgHint">💡 Indiciu</button><button class="jgbtn" id="jgSnd" aria-label="Sunet">' + (B.mute() ? "🔇" : "🔊") + '</button></div></div><div class="jgsay" id="jgSay"></div><div class="jgcarry" id="jgCarry"></div><div class="jgtoast" id="jgToast"></div><div class="jgnear" id="jgNear"></div><div class="jgpanel" id="jgPanel" aria-hidden="true"></div><div class="jgmodal" id="jgModal"></div>';
    document.body.appendChild(root); document.documentElement.classList.add("jgon");
    $("jgHint").onclick = hint; $("jgSnd").onclick = function () { B.setMute(!B.mute()); $("jgSnd").textContent = B.mute() ? "🔇" : "🔊"; };
    CTL = jgControls(root, { labels: { act: "Folosește", plug: "Conectează", zoom: "Zoom", con: "Consolă" }, onMove: onMove, onAction: onAction });
    var vw = $("jgView"), lx = null; vw.addEventListener("pointerdown", function (e) { if (e.target.closest && e.target.closest(".jgc-root .jgc-btn, .jgc-joy-base")) return; lx = [e.clientX, e.clientY, e.pointerId]; });
    vw.addEventListener("pointermove", function (e) { if (!lx || lx[2] !== e.pointerId || !V3) return; var dx = e.clientX - lx[0], dy = e.clientY - lx[1]; lx[0] = e.clientX; lx[1] = e.clientY; V3.turn(dx * 0.006, dy * 0.004); });
    window.addEventListener("pointerup", LOOK = function () { lx = null; });
    tickT = setInterval(linkTick, 250); document.addEventListener("visibilitychange", VIS = function () { if (document.hidden) pauseT(true); else if (!modalOn()) pauseT(false); });
    var a = String(arg || "menu");
    startView(function () { if (a === "story" || a === "prac") storyResume(a); else if (/^[mb]\d$/.test(a)) startMission(a); else if (a === "ex") drawTicket(function (V) { startMission("ex", null, V); }); else menu(); });
  }
  function unmount(quiet) { clearInterval(tickT); clearInterval(RPT); if (VIS) { document.removeEventListener("visibilitychange", VIS); VIS = null; } clearTimeout(sayT); if (CTL) { CTL.destroy(); CTL = null; } if (V3) { V3.destroy(); V3 = null; } if (LOOK) window.removeEventListener("pointerup", LOOK); if (root && root.parentNode) root.parentNode.removeChild(root); root = null; PANEL = null; document.documentElement.classList.remove("jgon"); }
  var HAS3D = null;
  /* calitatea graficii 3D: auto (PC = înaltă, telefon = medie) / înaltă / medie / redusă */
  function gfxPref() { try { var q = localStorage.getItem("jg_q"); return /^(ultra|high|med|low)$/.test(q) ? q : "auto"; } catch (e) { return "auto"; } }
  function modernIphone() { var ua = navigator.userAgent, m = /iPhone OS (\d+)_/.exec(ua); return /iPhone/.test(ua) && !!m && +m[1] >= 17 && Math.max(screen.width, screen.height) >= 852; }
  function isMob() { return /iPhone|iPad|Android|Mobile/.test(navigator.userAgent) || ("ontouchstart" in window && Math.min(screen.width, screen.height) < 820); }
  var GPU = null; function gpuName() { if (GPU != null) return GPU; GPU = ""; try { var c = document.createElement("canvas"), g = c.getContext("webgl"), x = g && g.getExtension("WEBGL_debug_renderer_info"); GPU = (x ? g.getParameter(x.UNMASKED_RENDERER_WEBGL) : g ? g.getParameter(g.RENDERER) : "") || ""; var lc = g && g.getExtension("WEBGL_lose_context"); if (lc) lc.loseContext(); } catch (e) {} return GPU; }
  function strongGpu() { return /RTX|RX ?[67]\d{3}|Radeon RX ?(6[6-9]|7\d)|Arc\(TM\) A7|Arc A7|Apple M\d (Pro|Max|Ultra)|GTX 10[78]0|GTX 16[56]0/i.test(gpuName()) && !/SwiftShader|llvmpipe|Software/i.test(gpuName()); }
  /* Automată: pornește de la cel mai înalt nivel potrivit dispozitivului și coboară singură până ține ~45 fps; rezultatul se ține minte (jg_auto) */
  function autoStart() { if (isMob()) { if (!modernIphone()) return "med"; return Math.max(screen.width, screen.height) >= 874 ? "ultra" : "high"; } return strongGpu() && window.innerWidth >= 1200 ? "ultra" : "high"; }
  function autoSaved() { try { var a = localStorage.getItem("jg_auto"); return /^(ultra|high|med|low)$/.test(a) ? a : null; } catch (e) { return null; } }
  function gfxTier() { var q = gfxPref(); if (q !== "auto") return q; var st = autoStart(), sv = autoSaved(), O = ["ultra", "high", "med", "low"]; return sv && O.indexOf(sv) > O.indexOf(st) ? sv : st; }
  function tierDown(cur) { var O = ["ultra", "high", "med", "low"], i = O.indexOf(cur); if (i < 0 || i >= 3 || gfxPref() !== "auto" || !V3 || !root) return; try { localStorage.setItem("jg_auto", O[i + 1]); } catch (e) {} toastG("🎨 Grafica s-a ajustat automat: " + ({ high: "Înaltă", med: "Medie", low: "Redusă" })[O[i + 1]] + " (ca să meargă fluid)"); rebuildView(); }
  function rebuildView() { var lv = G ? G.lv : "prac", ps = V3 && V3.pos ? V3.pos() : null; V3.destroy(); V3 = null; startView(function () { if (G) setLevel(lv); else if (V3) V3.setLevel(lv); if (V3 && ps) V3.setPos(ps.x, ps.z, ps.yaw); if (V3 && PANEL && PANEL.live) V3.focus(PANEL.id === "rack" ? RTAB : "box", PANEL.id === "rack" && RNEAR); }); }
  function setGfx(q) { try { localStorage.setItem("jg_q", q); if (q === "auto") localStorage.removeItem("jg_auto"); } catch (e) {} if (!V3 || !root) return; rebuildView(); }
  function startView(cb) {
    var vw = $("jgView"); var want3d = !B.lowGfx() && window.JG3D_OK !== false;
    function two() { V3 = null; vw.innerHTML = ""; vw.className = "jgview jg2d"; paint2d(); cb(); }
    if (!want3d) return two();
    var TQ = gfxTier(); B.loadScripts(TQ === "low" ? ["vendor/three.min.js", "jg3d.js"] : ["vendor/three.min.js", "vendor/three-x.min.js"].concat(TQ === "ultra" ? ["vendor/three-post.min.js"] : [], ["jgnpc.js", "jg3d.js"]), function (ok) {
      if (!root) return; if (!ok || !window.JG3D || !window.JG3D.supported()) return two();
      try { V3 = window.JG3D.create(vw, { level: "prac", lowPower: /iPhone|iPad|Android/.test(navigator.userAgent), tier: TQ, dprCap: isMob() && (TQ === "high" || TQ === "ultra") ? 2 : undefined, fpsFloor: isMob() && (TQ === "high" || TQ === "ultra") ? 45 : 0, onTierDown: gfxPref() === "auto" && TQ !== "low" && (!B.noSlow() || /[?&]jgauto=1/.test(location.search)) && !/[?&]jgfull=1/.test(location.search) ? function () { tierDown(TQ); } : null, noDown: /[?&]jgfull=1/.test(location.search), onNear: onNear, onPick: openStation, onPort: function (a) { if (PANEL && PANEL.id === "rack" && PANEL.live) portTap(a, null); }, onSlow: function () { if (B.noSlow && B.noSlow()) return; toastG("Grafica 3D merge greu pe acest dispozitiv – trec pe vederea 2D."); V3.destroy(); V3 = null; two(); } }); }
      catch (e) { V3 = null; return two(); }
      cb();
    });
  }
  function setLevel(lv) { G.lv = lv; if (V3) { V3.setLevel(lv); G.cab.forEach(function (c) { if (lv === "prac") V3.setCable(c.id, { a: c.a, b: c.b, color: CAB[c.t].c }); }); Object.keys(G.led).forEach(function (k) { if (lv === "prac") V3.setLed(k, G.led[k]); }); } else paint2d(); onNear(null); }
  var ST2D = { out: [["guard", "🪖 Punct de control"], ["barrier", "🚧 Bariera"], ["door", "🚪 Intrarea în clădire"]], hall: [["desk", "📋 Recepția"], ["up", "🪜 Scări → etajul 1, sala de examen"]], theory: [["mydesk", "📝 Locul tău – proba teoretică"], ["examiner", "🎖️ Comisia"], ["door", "🚪 Spre sala de practică"]], prac: [["examiner", "🎖️ Examinatorul"], ["rack", "🗄️ Switch 2960 + router 1941"], ["desk", "💻 Laptop"], ["box", "📦 Cutia cu cabluri"], ["bench", "🔧 Banc de mufare RJ45"], ["fiber", "💡 Fibră optică"]] };
  function paint2d() { var vw = $("jgView"); if (!vw || V3) return; var lv = G ? G.lv : "prac"; vw.innerHTML = '<div class="jg2dmap"><p class="jg2dh">' + ({ out: "Exteriorul unității", hall: "Holul clădirii", theory: "Sala 12 – proba teoretică", prac: "Sala de practică" })[lv] + '</p>' + ST2D[lv].map(function (s) { return '<button class="jg2ds" data-st="' + s[0] + '">' + s[1] + "</button>"; }).join("") + '<p class="jg2dn">Vedere 2D (dispozitivul nu suportă 3D fluent). Atinge o stație.</p></div>'; Array.prototype.forEach.call(vw.querySelectorAll("[data-st]"), function (b) { b.onclick = function () { openStation(b.getAttribute("data-st")); }; }); }
  var NEARN = { guard: "Paznicul", barrier: "Bariera", door: "Ușa", desk: "Laptop", up: "Scările", mydesk: "Locul tău", examiner: "Examinatorul", rack: "Switch + router", box: "Cutia cu cabluri", bench: "Banc RJ45", fiber: "Fibră optică", gate: "Ușa" };
  function onNear(id) { var e = $("jgNear"); if (!e) return; if (G && G.lv === "hall" && id === "desk") id = "desk"; e.innerHTML = id ? '<button class="jgnearb" id="jgNearB">✋ ' + esc(stationName(id)) + ' <small>(E)</small></button>' : ""; e.className = "jgnear" + (id ? " on" : ""); if ($("jgNearB")) $("jgNearB").onclick = function () { openStation(id); }; }
  function stationName(id) { if (G && G.lv === "hall" && id === "desk") return "Recepția"; return NEARN[id] || id; }
  var CYC = 0;
  function onMove(dx, dy, src, tr) { if (!V3 || PANEL || modalOn()) { if (V3) V3.move(0, 0); return; } if (src === "joy") { V3.move(-dy, 0); if (dx) V3.turn(dx * 0.045, 0); } else { V3.move(-dy, dx); if (tr) V3.turn(tr * 0.04, 0); } }
  function modalOn() { var m = $("jgModal"); return m && m.className.indexOf("on") >= 0; }
  function onAction(n) {
    if (!G) return; var m = modalOn();
    if (n === "menu") { if (m) return closeModal(); if (PANEL) return closePanel(); return menu(); }
    if (m) { if (n === "act") { var f = document.querySelector("#jgModal .jgfocus") || document.querySelector("#jgModal [data-f]"); if (f) f.click(); } else if (n === "tab" || n === "next" || n === "prev") focusCycle($("jgModal"), n === "prev" ? -1 : 1); return; }
    if (PANEL) { var cur = PANEL.el.querySelector(".jgfocus");
      if (n === "tab" || n === "next" || n === "prev") return focusCycle(PANEL.el, n === "prev" ? -1 : 1);
      if (n === "act") { if (cur) cur.dispatchEvent(new MouseEvent("click", { bubbles: true })); return; }
      if (n === "plug") { if (cur && cur.getAttribute("data-port")) plugAt(cur.getAttribute("data-anc")); return; }
      if (n === "zoom") { if (PANEL.zoom) PANEL.zoom(); return; }
      if (n === "con") { closePanel(); return openStation("desk", "putty"); }
      return; }
    if (n === "act") { if (V3) { if (!V3.interact()) toastG("Apropie-te de o stație (mergi spre eticheta ei)."); } return; }
    if (n === "tab" || n === "next" || n === "prev") { if (V3) { var L = V3.stationList(); CYC = (CYC + (n === "prev" ? L.length - 1 : 1)) % L.length; V3.goTo(L[CYC]); toastG("→ " + stationName(L[CYC])); } return; }
    if (n === "zoom") { if (V3 && V3.near()) openStation(V3.near()); return; }
    if (n === "con") { if (G.lv === "prac") openStation("desk", "putty"); return; }
    if (n === "plug") { toastG(G.carry ? "Deschide o stație (rack sau laptop) și atinge portul." : "Ia un cablu din cutie."); }
  }
  function focusCycle(el, d) { var L = Array.prototype.slice.call(el.querySelectorAll("[data-f]")).filter(function (x) { return x.offsetParent !== null || x.getBBox; }); if (!L.length) return; var i = L.indexOf(el.querySelector(".jgfocus")); if (i >= 0) L[i].classList.remove("jgfocus"); i = (i + d + L.length) % L.length; L[i].classList.add("jgfocus"); if (L[i].scrollIntoView) L[i].scrollIntoView({ block: "nearest", inline: "center" }); var lab = L[i].getAttribute("aria-label") || L[i].textContent; if (lab) toastG("🔎 " + lab.trim().slice(0, 60)); }
  /* ---------- panouri (vederi de aproape) și ferestre ---------- */
  function openPanel(id, title, html, wire, opt) { var p = $("jgPanel"); PANEL = { id: id, el: p, zoom: opt && opt.zoom, wire: wire, title: title, live: !!(opt && opt.live) }; p.innerHTML = '<div class="jgph"><button class="jgback" id="jgBack">‹ Înapoi <small>(Esc)</small></button><b>' + esc(title) + "</b></div><div class=\"jgpb\" id=\"jgPB\">" + html + "</div>"; p.className = "jgpanel on" + (opt && opt.cls ? " " + opt.cls : ""); p.setAttribute("aria-hidden", "false"); $("jgBack").onclick = closePanel; if (CTL) CTL.show(false); if (V3) { V3.move(0, 0); V3.pause(!(opt && opt.live)); if (!(opt && opt.live) && V3.unfocus) V3.unfocus(); } if (wire) wire(p); }
  function closePanel() { var p = $("jgPanel"); if (!p) return; if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); p.className = "jgpanel"; p.innerHTML = ""; p.setAttribute("aria-hidden", "true"); PANEL = null; if (CTL) CTL.show(true); if (V3) { V3.pause(false); if (V3.unfocus) V3.unfocus(); } paintCarry(); }
  function refreshPanel() { if (!PANEL) return; if (PANEL.id === "rack") paintRack(); else if (PANEL.id === "desk") paintDeskPorts(); }
  function modal(html, wire) { var m = $("jgModal"); m.innerHTML = '<div class="jgmc">' + html + "</div>"; m.className = "jgmodal on"; pauseT(true); if (CTL) CTL.show(false); if (V3) V3.move(0, 0); if (wire) wire(m); var f = m.querySelector("[data-f]"); if (f && !("ontouchstart" in window)) f.classList.add("jgfocus"); }
  function closeModal() { var m = $("jgModal"); if (!m) return; m.className = "jgmodal"; m.innerHTML = ""; pauseT(false); if (CTL && !PANEL) CTL.show(true); }
  function showResult(t, h, again) { modal("<h2>" + esc(t) + "</h2>" + h + '<div class="jgbtns">' + (B.coActive() ? '<button class="jgbig" data-f id="jgCoNext">▶️ Continuă planul</button>' : "") + (again ? '<button class="jgbig2" data-f id="jgMenu2">📋 Alte misiuni</button>' : "") + '<button class="jgbig2" data-f id="jgExit">🏠 Ieși din joc</button></div>', function (m) { if ($("jgCoNext")) $("jgCoNext").onclick = function () { var b = B; unmount(); b.coDone(); }; if ($("jgMenu2")) $("jgMenu2").onclick = function () { closeModal(); menu(); }; $("jgExit").onclick = exitGame; }); }
  function exitGame() { var b = B; unmount(); b.go("home"); }
