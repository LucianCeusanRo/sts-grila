  /* ---------- ecran: terminal Cisco simulat ---------- */
  var CLIS = null;
  function vCli(tid) {
    view = "practice"; navbar(true);
    var T = CLI_TASKS.filter(function (x) { return x.id === tid; })[0] || CLI_TASKS[0];
    if (!CLIS || CLIS.tid !== T.id) CLIS = { tid: T.id, s: cliNew(T.dev), lines: [], hi: -1, done: false, hint: 0 };
    var C = CLIS, s = C.s;
    P.cli = P.cli || {};
    var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICA.term + ' Terminal Cisco IOS (simulat)</h2><p class="muted small">Exersezi exact ce tastezi la proba practică, prin cablul de consolă. Comenzile se pot prescurta (conf t, int g0/0, sh ip int br). Tab completează, ? arată opțiunile.</p>' +
      '<div class="seg wrap" id="cliT">' + CLI_TASKS.map(function (x) { return '<button data-t="' + x.id + '" class="' + (x.id === T.id ? "on" : "") + '">' + (P.cli[x.id] ? "✓ " : "") + esc(x.t) + "</button>"; }).join("") + "</div>" +
      '<div class="ctask"><b>Sarcina:</b> ' + esc(T.d) + (T.g.length ? '<ul class="goals" id="goals"></ul>' : "") + "</div>" +
      '<div class="term" id="term" role="log" aria-live="polite"></div>' +
      '<form id="cliF" class="tin" autocomplete="off"><label for="cliI" id="cliP"></label><input id="cliI" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send" aria-label="Comandă"></form>' +
      '<div class="tkeys"><button class="ghost sm" type="button" id="kTab">Tab</button><button class="ghost sm" type="button" id="kQ">?</button><button class="ghost sm" type="button" id="kUp">↑</button><button class="ghost sm" type="button" id="kHint">💡 Indiciu</button><button class="ghost sm" type="button" id="kReset">↺ Reset</button></div>' +
      '<div id="cliMsg"></div><details class="ghostd"><summary>Fițuică: modurile IOS</summary><p class="small">Switch&gt; utilizator → <b>enable</b> → Switch# privilegiat → <b>configure terminal</b> → Switch(config)# global → <b>interface …</b> / <b>line …</b> / <b>vlan …</b> → sub-moduri. <b>exit</b> urcă un nivel, <b>end</b> (Ctrl+Z) te duce direct în #. Comenzile show/copy/ping din config: pune <b>do</b> în față.</p></details></section>';
    app.innerHTML = h;
    var term = $("term"), inp = $("cliI");
    function add(t, cls) { C.lines.push([t, cls || ""]); if (C.lines.length > 400) C.lines.splice(0, C.lines.length - 400); }
    function paint() {
      term.innerHTML = C.lines.map(function (l) { return '<div class="tline ' + l[1] + '">' + (esc(l[0]) || "&nbsp;") + "</div>"; }).join("");
      $("cliP").textContent = s.pend ? "" : cliPrompt(s);
      term.scrollTop = term.scrollHeight;
      if (T.g.length) {
        var allOk = true;
        $("goals").innerHTML = T.g.map(function (g) { var ok = false; try { ok = !!g[1](s); } catch (e) {} if (!ok) allOk = false; return '<li class="' + (ok ? "ok" : "") + '">' + (ok ? "✓ " : "○ ") + esc(g[0]) + "</li>"; }).join("");
        if (allOk && !C.done) { C.done = true; var first = !P.cli[T.id]; P.cli[T.id] = Date.now(); if (first) { addXP(20); SND.ok(); } saveP(); $("cliMsg").innerHTML = '<div class="fact tok"><b>✅ Sarcină îndeplinită' + (first ? " · +20 XP" : "") + '</b><br>Exact asta verifică examinatorul: show running-config / show ip interface brief și că ai salvat (după reload configurația rămâne).</div>'; }
      }
    }
    if (!C.lines.length) { add(s.dev === "router" ? "Cisco 1941 – consolă 9600 8N1 (simulat)" : "Cisco Catalyst 2960 – consolă 9600 8N1 (simulat)", "thint"); add("Press RETURN to get started!"); add(""); }
    paint();
    function exec(v) {
      var pr = s.pend ? "" : cliPrompt(s);
      add(pr + (s.pend && /parola|Password/i.test(C.lines[C.lines.length - 1][0]) ? "" : v));
      if (v.trim() && !s.pend) { s.hist.push(v.trim()); C.hi = -1; }
      var out = []; try { out = cliRun(s, v); } catch (e) { out = ["% Eroare internă a simulatorului"]; }
      out.forEach(function (l) { add(l, /^%(?!SYS|LINK|LINEPROTO)|^\s*\^$/.test(l) ? "terr" : /^\(|^%LINK|^%LINEPROTO|^%SYS/.test(l) ? "thint" : ""); });
      if (out.some(function (l) { return /Invalid input|Incomplete|Ambiguous|Unknown command/.test(l); })) { var tip = cliTip(s, v); if (tip) add("💡 " + tip, "thint"); }
      paint();
    }
    $("cliF").onsubmit = function (e) { e.preventDefault(); var v = inp.value; inp.value = ""; exec(v); inp.focus(); };
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Tab") { e.preventDefault(); inp.value = cliComplete(s, inp.value); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (s.hist.length) { C.hi = C.hi < 0 ? s.hist.length - 1 : Math.max(0, C.hi - 1); inp.value = s.hist[C.hi]; } }
      else if (e.key === "ArrowDown") { e.preventDefault(); if (C.hi >= 0) { C.hi++; if (C.hi >= s.hist.length) { C.hi = -1; inp.value = ""; } else inp.value = s.hist[C.hi]; } }
      else if (e.key === "?") { e.preventDefault(); exec(inp.value + "?"); inp.value = inp.value; }
    });
    $("kTab").onclick = function () { inp.value = cliComplete(s, inp.value); inp.focus(); };
    $("kQ").onclick = function () { exec(inp.value + "?"); inp.focus(); };
    $("kUp").onclick = function () { if (s.hist.length) { C.hi = C.hi < 0 ? s.hist.length - 1 : Math.max(0, C.hi - 1); inp.value = s.hist[C.hi]; } inp.focus(); };
    $("kHint").onclick = function () {
      var g = T.g.filter(function (x) { try { return !x[1](s); } catch (e) { return true; } })[0];
      add("💡 " + (g ? g[2] + "   (ești în: " + cliPrompt(s) + ")" : T.g.length ? "Toate obiectivele sunt bifate." : "Mod liber: încearcă enable, configure terminal, ? pentru listă."), "thint"); paint(); inp.focus();
    };
    $("kReset").onclick = function () { CLIS = null; vCli(T.id); };
    Array.prototype.forEach.call(app.querySelectorAll("#cliT button"), function (b) { b.onclick = function () { CLIS = null; vCli(b.getAttribute("data-t")); }; });
    $("backBtn").onclick = function () { go("practice"); };
  }
  function cliTip(s, v) {
    var w = (v.trim().split(/\s+/)[0] || "").toLowerCase(), m = s.mode;
    var cfgOnly = ["hostname", "interface", "int", "line", "vlan", "banner", "service", "ip"], exOnly = ["show", "sh", "copy", "write", "wr", "reload", "ping"];
    if ((m === "user" || m === "priv") && cfgOnly.some(function (x) { return w === x || (x.length > 3 && x.indexOf(w) === 0 && w.length > 2); })) return m === "user" ? "Comanda e de configurare: mai întâi enable, apoi configure terminal." : "Comanda e de configurare: intră cu configure terminal (conf t).";
    if (m === "user" && /^(conf|configure|copy|wr|reload)/.test(w)) return "Ești în modul utilizator (>). Tastează enable ca să ajungi la #.";
    if (m !== "user" && m !== "priv" && exOnly.some(function (x) { return w === x; })) return "În modurile de configurare pune do în față: do " + v.trim() + " – sau ieși cu end.";
    if (m === "config" && /^(no$|shut|shutdown|switchport|password|login|name)/.test(w)) return "Comanda aceasta merge într-un sub-mod (interface / line / vlan). Ești în (config)#.";
    if (/^(ipconfig|tracert|cls|dir)$/.test(w)) return "Aceasta e comandă de Windows (cmd), nu de Cisco IOS.";
    return "";
  }

  /* ---------- ecran: ordinea firelor RJ45 ---------- */
  var RJW = { "alb-portocaliu": ["#f97316", 1], "portocaliu": ["#f97316", 0], "alb-verde": ["#16a34a", 1], "albastru": ["#2563eb", 0], "alb-albastru": ["#2563eb", 1], "verde": ["#16a34a", 0], "alb-maro": ["#92400e", 1], "maro": ["#92400e", 0] };
  var T568 = { B: ["alb-portocaliu", "portocaliu", "alb-verde", "albastru", "alb-albastru", "verde", "alb-maro", "maro"], A: ["alb-verde", "verde", "alb-portocaliu", "albastru", "alb-albastru", "portocaliu", "alb-maro", "maro"] };
  function wireSw(n) { var c = RJW[n]; return '<span class="wsw" style="background:' + (c[1] ? "repeating-linear-gradient(90deg,#fff 0 5px," + c[0] + " 5px 10px)" : c[0]) + '"></span>'; }
  function vRj(std) {
    view = "practice"; navbar(true); std = std === "A" ? "A" : "B";
    var want = T568[std], got = [], pool = shuffle(want.slice()), checked = false;
    function paint() {
      var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICA.plug + ' Ordinea firelor în mufa RJ45</h2><p class="muted small">Ții mufa cu <b>clema în jos</b>, contactele aurii spre tine: pinul 1 e în <b>stânga</b>. Atinge firele în ordinea 1 → 8. Atinge un fir pus ca să-l scoți.</p>' +
        '<div class="seg" id="rjStd"><button data-s="B" class="' + (std === "B" ? "on" : "") + '">T568B (cel folosit la examen)</button><button data-s="A" class="' + (std === "A" ? "on" : "") + '">T568A</button></div>' +
        '<div class="rjplug" id="rjPlug">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { var n = got[i], cls = checked && n ? (n === want[i] ? " ok" : " bad") : ""; return '<button class="rjpin' + cls + '" data-i="' + i + '"' + (n ? "" : " disabled") + ' aria-label="Pin ' + (i + 1) + (n ? ": " + n : " gol") + '"><i>' + (i + 1) + "</i>" + (n ? wireSw(n) + "<small>" + n.replace("alb-", "alb-<br>") + "</small>" : "<small>—</small>") + "</button>"; }).join("") + "</div>" +
        '<div class="rjpool" id="rjPool">' + pool.map(function (n, k) { return got.indexOf(n) >= 0 ? "" : '<button class="rjw" data-k="' + k + '">' + wireSw(n) + n + "</button>"; }).join("") + "</div>" +
        '<button class="big" id="rjChk"' + (got.length < 8 ? " disabled" : "") + '>Verifică (ca testerul: LED-urile 1–8)</button><button class="ghost" id="rjNew">Din nou ↻</button><div id="rjOut"></div>' +
        '<div class="fact small"><b>Memorare T568B:</b> <i>portocaliu – verde – albastru – maro</i>, albul mereu înainte; dar <b>albastrul</b> (pin 4) și <b>alb-albastru</b> (5) stau la mijloc, iar <b>verdele</b> sare peste ele (pin 3 și 6). Cablu drept: B la ambele capete. Crossover: A la un capăt, B la celălalt.</div></section>';
      app.innerHTML = h;
      $("backBtn").onclick = function () { go("practice"); };
      $("rjNew").onclick = function () { vRj(std); };
      Array.prototype.forEach.call(app.querySelectorAll("#rjStd button"), function (b) { b.onclick = function () { vRj(b.getAttribute("data-s")); }; });
      Array.prototype.forEach.call(app.querySelectorAll(".rjw"), function (b) { b.onclick = function () { if (got.length < 8) { got.push(pool[+b.getAttribute("data-k")]); checked = false; paint(); } }; });
      Array.prototype.forEach.call(app.querySelectorAll(".rjpin"), function (b) { b.onclick = function () { var i = +b.getAttribute("data-i"); if (got[i]) { got.splice(i, 1); checked = false; paint(); } }; });
      $("rjChk").onclick = function () {
        checked = true; var bad = []; got.forEach(function (n, i) { if (n !== want[i]) bad.push(i + 1); });
        paint();
        if (!bad.length) { addXP(5); saveP(); SND.ok(); $("rjOut").innerHTML = '<div class="fact tok"><b>✅ Corect – toate cele 8 LED-uri se aprind în ordine, 1↔1 … 8↔8. +5 XP</b><br>La probă: împingi firele până la capătul mufei (vezi cuprul în față), mantaua intră sub clema de presare, apoi sertizezi ferm.</div>'; }
        else { SND.bad(); $("rjOut").innerHTML = '<div class="eli trapw"><b>❌ Pinii ' + bad.join(", ") + ' sunt greșiți.</b> Pe tester ai vedea LED-urile acestor pini aprinzându-se în altă ordine (fire inversate) – examinatorul te pică.<br>Corect ' + "T568" + std + ": " + want.map(function (n, i) { return (i + 1) + "=" + n; }).join(", ") + "</div>"; }
      };
    }
    paint();
  }

  /* ---------- ecran: multimetru (selector + borne) ---------- */
  var MMP = [["off", "OFF", -90], ["vdc", "V⎓", -45], ["vac", "V~", 0], ["ohm", "Ω", 45], ["cont", "•)))", 90], ["ma", "mA⎓", 135], ["a10", "10A⎓", 180]];
  var MMJ = [["a10", "10A", 40], ["ma", "mA", 95], ["com", "COM", 150], ["v", "VΩ", 205]];
  var MMS = [
    ["Măsoară tensiunea unei baterii AA (1,5 V).", "vdc", "v", "V⎓ (DC), roșu în VΩ, negru în COM; vârful roșu pe + și negrul pe –. Afișaj ≈ 1,5–1,6 V (dacă vezi „-1.5”, ai inversat vârfurile, nu se strică nimic)."],
    ["Verifică tensiunea dintr-o priză de 230 V.", "vac", "v", "V~ (AC), roșu în VΩ. Ții vârfurile doar de mânerele izolate, cu o mână dacă se poate. Afișaj ≈ 220–240 V. NICIODATĂ pe Ω, continuitate sau curent – arzi siguranța sau aparatul."],
    ["Verifică dacă un fir dintr-un cablu e întreg (continuitate).", "cont", "v", "Continuitate (•))), roșu în VΩ. Circuitul trebuie să fie FĂRĂ tensiune. Bip = fir întreg; „OL”/fără bip = întrerupt."],
    ["Măsoară un rezistor scos din circuit (codul spune 1 kΩ).", "ohm", "v", "Ω, roșu în VΩ, rezistorul fără tensiune și scos din circuit (altfel măsori și restul). Nu ține cu degetele ambele capete – corpul tău e o rezistență în paralel."],
    ["Măsoară curentul consumat de un LED cu rezistor (câțiva mA).", "ma", "ma", "mA⎓, roșu în mA. Aparatul se pune ÎN SERIE: deschizi circuitul și închizi bucla prin multimetru. După măsurare, roșul înapoi în VΩ!"],
    ["Măsoară curentul unui motoraș de câțiva amperi.", "a10", "a10", "10A⎓, roșu în 10A (borna mA are siguranță mică și s-ar arde). În serie, scurt timp (de obicei max 10–30 s la 10 A)."],
    ["Verifică o siguranță fuzibilă scoasă din soclu.", "cont", "v", "Continuitate (sau Ω): bip / ~0 Ω = siguranță bună; OL = arsă. Întotdeauna scoasă din circuit, fără tensiune."],
    ["Verifică ieșirea unui alimentator de router (12 V DC).", "vdc", "v", "V⎓, roșu în VΩ; centrul mufei de obicei +, exteriorul –. Un afișaj mult sub 12 V în gol = alimentator defect."],
    ["Ai terminat măsurătorile. Cum lași aparatul?", "off", "v", "OFF, cu roșul în VΩ. Lăsat pe A cu roșul în 10A, următorul care măsoară o priză face scurtcircuit prin aparat."],
    ["Verifici dacă o perechea 1–2 a unui patch-cord e conectată capăt la capăt.", "cont", "v", "Continuitate, roșu în VΩ: un vârf pe pinul 1 de la un capăt, celălalt pe pinul 1 la capătul opus → bip. Testerul de cablu face același lucru pentru toți pinii deodată."]
  ];
  function mmSvg(pos, jack) {
    var cx = 160, cy = 175, h = '<svg class="mmsvg" viewBox="0 0 320 330" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" role="img" aria-label="Multimetru: selector și borne">';
    h += '<rect x="20" y="6" width="280" height="318" rx="26" fill="#f2b705" stroke="#8a6500" stroke-width="2"/><rect x="34" y="18" width="252" height="296" rx="18" fill="#2b2f36"/>';
    h += '<rect x="66" y="30" width="188" height="56" rx="6" fill="#b9c7a6" stroke="#111" stroke-width="2"/><text x="244" y="70" text-anchor="end" font-size="30" font-family="ui-monospace,Menlo,monospace" fill="#1f2a1a" id="mmLcd">' + ({ off: "", vdc: "0.00", vac: "0.0", ohm: "OL", cont: "OL", ma: "0.00", a10: "0.00" }[pos] || "") + '</text><text x="76" y="44" font-size="9" fill="#1f2a1a">' + ({ vdc: "DC V", vac: "AC V", ohm: "kΩ", cont: "•)))", ma: "DC mA", a10: "DC A" }[pos] || "") + "</text>";
    h += '<circle cx="' + cx + '" cy="' + cy + '" r="52" fill="#15181d" stroke="#555" stroke-width="3"/>';
    MMP.forEach(function (p) { var a = p[2] * Math.PI / 180, x = cx + 74 * Math.sin(a), y = cy - 74 * Math.cos(a), on = p[0] === pos; h += '<g class="mmpos" data-p="' + p[0] + '" role="button" tabindex="0" aria-label="Selector ' + p[1] + '"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="19" fill="' + (on ? "#f2b705" : "#3a3f47") + '" stroke="' + (on ? "#fff" : "#666") + '"/><text x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="middle" font-size="' + (p[1].length > 3 ? 9 : 12) + '" font-weight="700" fill="' + (on ? "#111" : "#eee") + '">' + p[1] + "</text></g>"; });
    var ang = (MMP.filter(function (p) { return p[0] === pos; })[0] || MMP[0])[2];
    h += '<g transform="rotate(' + ang + " " + cx + " " + cy + ')"><rect x="' + (cx - 9) + '" y="' + (cy - 46) + '" width="18" height="92" rx="9" fill="#444"/><path d="M' + cx + " " + (cy - 46) + "l-6 14h12z" + '" fill="#fff"/></g>';
    MMJ.forEach(function (j) { var x = j[2] + 18, on = j[0] === jack, isCom = j[0] === "com"; h += '<g class="mmjack" data-j="' + j[0] + '" role="button" tabindex="0" aria-label="Borna ' + j[1] + '"><circle cx="' + x + '" cy="290" r="15" fill="' + (isCom ? "#111" : on ? "#dc2626" : "#5b1111") + '" stroke="' + (on || isCom ? "#fff" : "#888") + '" stroke-width="2.5"/><circle cx="' + x + '" cy="290" r="6" fill="#000"/><text x="' + x + '" y="268" text-anchor="middle" font-size="10" font-weight="700" fill="#eee">' + j[1] + "</text></g>"; });
    h += '<text x="160" y="318" text-anchor="middle" font-size="8.5" fill="#bbb">negru mereu în COM · atinge borna pentru firul roșu</text></svg>';
    return h;
  }
  var MMST = { i: 0, ok: 0 };
  function vMm() {
    view = "practice"; navbar(true);
    var sc = MMS[MMST.i % MMS.length], pos = "off", jack = "v", done = false;
    function paint() {
      app.innerHTML = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICA.meter + ' Multimetrul: selector și borne</h2><p class="muted small">Scenariul ' + (MMST.i % MMS.length + 1) + "/" + MMS.length + " · corecte în sesiune: " + MMST.ok + '</p><div class="probl">' + esc(sc[0]) + '</div><div class="mmwrap">' + mmSvg(pos, jack) + '</div><p class="small muted">Selector: <b>' + MMP.filter(function (p) { return p[0] === pos; })[0][1] + "</b> · fir roșu în: <b>" + MMJ.filter(function (j) { return j[0] === jack; })[0][1] + '</b></p><button class="big" id="mmChk">Verifică</button><button class="ghost" id="mmNext">Scenariul următor ›</button><div id="mmOut"></div></section>';
      $("backBtn").onclick = function () { go("practice"); };
      Array.prototype.forEach.call(app.querySelectorAll(".mmpos"), function (g) { var f = function () { pos = g.getAttribute("data-p"); paint(); }; g.onclick = f; g.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }; });
      Array.prototype.forEach.call(app.querySelectorAll(".mmjack"), function (g) { var f = function () { var j = g.getAttribute("data-j"); if (j === "com") return toast("COM e borna firului negru – rămâne acolo."); jack = j; paint(); }; g.onclick = f; g.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }; });
      $("mmNext").onclick = function () { MMST.i++; vMm(); };
      $("mmChk").onclick = function () {
        var ok = pos === sc[1] && jack === sc[2], danger = (jack === "a10" || jack === "ma") && (sc[1] === "vac" || sc[1] === "vdc");
        if (ok) { if (!done) { done = true; MMST.ok++; addXP(5); saveP(); } SND.ok(); }
        else SND.bad();
        $("mmOut").innerHTML = '<div class="' + (ok ? "fact tok" : "eli trapw") + '"><b>' + (ok ? "✅ Corect" + (done ? " · +5 XP" : "") : danger ? "⚠ Periculos: cu roșul în borna de curent pe o sursă de tensiune faci scurtcircuit prin aparat (arde siguranța – sau mai rău, la 230 V)." : "❌ Nu e corect.") + "</b><br>" + esc(sc[3]) + "</div>";
      };
    }
    paint();
  }
