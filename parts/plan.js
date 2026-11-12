  /* ---------------- Plan 11 zile (4–5 ore/zi) ---------------- */
  var DEFAULT_EXAM = "2026-10-19";
  function R_(c, a, b) { var o = []; for (var i = a; i <= b; i++) o.push(c + "-" + i); return o; }
  /* Ordinea = ponderea la examen: ~40% CCNA (rețele, subnetare, Cisco IOS), ~20% telecom (telefonie, radio, VoIP), restul fibră + cablare + proba practică. Fizica (electricitate, măsurători) e opțională, la final.
     Din ziua 4: în fiecare zi câte o simulare completă (teorie 18 întrebări + probă practică). Ultimele 2 zile: doar simulări + greșeli. */
  var XSUB = [["trainer", "Antrenor subnetting (exerciții nelimitate)"], ["gen", "Grilă subnetting generată – 10 întrebări"]];
  var PLAN = [
    { t: "Exact ca la examen: toate temele raportate de candidat (canal telefonic, RJ11/RJ45, PPPoE, topologii, LAN/WAN, viteze, fibră, OTDR, UTP, cabluri, OSI, IP, VLAN, Wi-Fi) + bazele", les: R_("ex", 1, 18).concat(["ex-R"], R_("baz", 1, 4)), test: { cats: ["ex"], n: 30 }, x: [["go", "Joc: ordinea firelor RJ45 (T568B)", "rj"], ["cards", "Fișe rapide: Exact ca la examen", "ex"], ["prac", "Încă 20 de întrebări „Examen real”", ["ex"], 20]] },
    { t: "CCNA I: ce e o rețea, OSI/TCP-IP, Ethernet și MAC, IPv4, ARP/DHCP/DNS, binar și subnetare de bază, cabluri RJ45 + practic: mufare, tester, primii pași în Cisco IOS", les: R_("net", 1, 7).concat(R_("sub", 1, 2), R_("cab", 1, 4), ["pp-1", "pp-2", "pp-4"]), test: { cats: ["net", "sub", "cab", "ex"], n: 30 }, x: [["go", "Terminal Cisco: configurare de bază + router", "cli"], ["go", "Antrenor binar/hexa", "bin"]].concat(XSUB) },
    { t: "CCNA II: TCP/UDP și porturi, NAT, Cisco IOS, rutare, VLAN/trunk/STP, IPv6, wireless, subnetare avansată + practic: VLAN, Windows, Packet Tracer + Tanenbaum cap. 1–2", les: R_("net", 8, 14).concat(["net-R"], R_("sub", 3, 4), ["sub-R", "pp-5", "pp-6", "pp-9"], R_("tan", 1, 4)), test: { cats: ["net", "sub", "pp", "tan"], n: 30 }, x: [["go", "Terminal Cisco: VLAN, management, SSH", "cli"]].concat(XSUB) },
    { t: "CCNA III din bibliografie: Tanenbaum cap. 3–8 + Munteanu (Ethernet, IPv4, TCP/UDP, comutare, routere Cisco) + PRIMA simulare completă", sim: 1, les: R_("tan", 5, 13).concat(["tan-R"], R_("mun", 1, 4), R_("mun", 6, 7)), test: { cats: ["tan", "mun", "net"], n: 30 }, x: XSUB.slice(0, 1) },
    { t: "Telecom: linii și cabluri telefonice, PCM/E1, ADSL, ISDN, SS7, GSM/UMTS, X.25/ATM (Rădulescu) + VoIP + telefonie digitală, radio, satelit", sim: 2, les: R_("tel", 1, 3).concat(["tel-R"], R_("rad", 1, 10), ["rad-R"], R_("voip", 1, 5), ["voip-R"], R_("extra", 1, 3), ["extra-R"]), test: { cats: ["tel", "rad", "voip", "extra"], n: 30 }, x: [["cards", "Fișe rapide: Telefonie", "tel"]] },
    { t: "Fibră optică (monomod/multimod, atenuare, sudură, conectori, OTDR, FTTx) + cablare structurată + practic: fibra + Munteanu cap. 8, 12–14 + PC I", sim: 3, les: R_("fo", 1, 6).concat(["fo-R"], R_("cab", 5, 8), ["cab-R", "pp-7", "mun-5"], R_("mun", 8, 9), ["mun-R"], R_("pc", 1, 4)), test: { cats: ["fo", "cab", "pp", "mun", "pc"], n: 30 }, x: [["cards", "Fișe rapide: Fibră optică", "fo"], ["go", "Animații: fibră monomod vs multimod și altele", "anims"]] },
    { t: "Antene și radio I (undă, benzi, antene, dB/dBm, polarizare, coaxial, VSWR, Fresnel, buget, TETRA, proceduri) + Norton cap. 1–6 + PC II", sim: 4, les: R_("ant", 1, 14).concat(R_("nor", 1, 4), R_("pc", 5, 8), ["pc-R"]), test: { cats: ["ant", "nor", "pc"], n: 30 }, x: [["cards", "Fișe rapide: Antene și radio", "ant"]] },
    { t: "Antene și radio II (Colonati, Graham) + Norton cap. 7–19 + munca la STS (112, rack, TETRA, terminale, migrare)", sim: 5, les: R_("ant", 15, 25).concat(["ant-R"], R_("nor", 5, 9), ["nor-R"], R_("sts", 1, 9), ["sts-R"]), test: { cats: ["ant", "nor", "sts"], n: 30 }, x: [] },
    { t: "Windows + proba practică (multimetru, RAM/disc) + capcanele de examen + recapitulare baze. Opțional: fizica (electricitate, măsurători)", sim: 6, les: R_("win", 1, 6).concat(["win-R", "pp-3", "pp-8", "pp-R"], R_("baz", 5, 6), ["baz-R"], R_("cap", 1, 4), ["cap-R"]), opt: R_("el", 1, 12).concat(["el-R"], R_("mas", 1, 3), ["mas-R"]), test: { cats: ["win", "pp", "cap", "baz"], n: 30 }, x: [["go", "Joc: selectorul multimetrului", "mm"], ["prac", "Exersare Electricitate + Măsurători – 20 (opțional)", ["el", "mas"], 20]] },
    { t: "Doar simulări: teorie (Subiectul 1, 2, 3) + practică (Varianta 1, 2, 3) + Greșelile mele", sim: 7, simOnly: 1, les: [], exam: 50, x: [["prac", "Capcane la examen – 20 întrebări", ["cap"], 20], ["prac", "„Examen real” – 20 întrebări", ["ex"], 20]] },
    { t: "Ultima zi: simulări + greșelile + fițuica „Foaie” și lista „ce fac pas cu pas” la proba practică. Seara: odihnă!", sim: 8, simOnly: 1, les: [], exam: 50, x: [["go", "Foaia de recapitulare", "sheet"], ["go", "Proba practică: lista „ce fac pas cu pas”", "ppsheet"]] }
  ];
  function pk(d) { return "b" + d; }
  function parseDay(s) { var a = String(s).split("-"); return new Date(+a[0], +a[1] - 1, +a[2]); }
  function planExam() { return (P.plan && /^\d{4}-\d{2}-\d{2}$/.test(P.plan.exam)) ? P.plan.exam : DEFAULT_EXAM; }
  function fmtDay(d) { return ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear(); }
  function planInfo() {
    var ex = parseDay(planExam()), today = parseDay(dayKey());
    var left = Math.round((ex - today) / 864e5), start = new Date(ex); start.setDate(ex.getDate() - PLAN.length);
    return { ex: ex, left: left, start: start, idx: Math.round((today - start) / 864e5) + 1 };
  }
  function dayDate(d) { var x = new Date(planInfo().start); x.setDate(x.getDate() + d - 1); return x; }
  function simsOn(d, k) { var key = dayKey(dayDate(d)); return P.exams.filter(function (e) { return e.k === k && dayKey(new Date(e.t)) === key; }); }
  function dayStatus(d) {
    var p = PLAN[d - 1], ld = p.les.filter(isDone).length, tp = P.plan.tests[pk(d)] || 0, tok = p.exam ? tp > 0 : tp >= 70;
    return { ld: ld, lt: p.les.length, tp: tp, tok: tok, done: !!P.plan.done[pk(d)] || (ld === p.les.length && tok) };
  }
  function dayMin(p) { return p.les.length * 7 + (p.exam ? 60 : 20) + (p.sim ? (p.simOnly ? 150 : 75) : 0) + 20; }
  function fmtH(m) { var h = Math.round(m / 30) / 2; return String(h).replace(".", ",") + " h"; }
  function checkPlan() { for (var d = 1; d <= PLAN.length; d++) if (!P.plan.done[pk(d)] && dayStatus(d).done) { P.plan.done[pk(d)] = Date.now(); toast("📅 Ziua " + d + " din plan – completă! 🎉"); } }
  function startPlanTest(d) {
    var p = PLAN[d - 1];
    if (p.exam) return runQuiz({ mode: "exam", items: shuffle(QS.filter(function (q) { return !q.s; })).slice(0, p.exam), minutes: p.exam, title: "Simulare mare – ziua " + d, planDay: pk(d) });
    runQuiz({ mode: "practice", items: pickQuestions(QS.filter(function (q) { return p.test.cats.indexOf(q.c) >= 0; }), p.test.n), hearts: 0, requeue: false, xpEach: 5, title: "Testul zilei " + d, planDay: pk(d) });
  }
  function planExtra(x) {
    SND.tap();
    if (x[0] === "trainer") return go("trainer");
    if (x[0] === "gen") { var it = []; for (var i = 0; i < 10; i++) it.push(SUB.question(SET.diff || 2)); return runQuiz({ mode: "practice", items: it, hearts: 0, requeue: false, xpEach: 5, title: "Subnetting" }); }
    if (x[0] === "prac") return runQuiz({ mode: "practice", items: pickQuestions(QS.filter(function (q) { return x[2].indexOf(q.c) >= 0; }), x[3]), hearts: 0, requeue: false, xpEach: 5, title: "Exersare suplimentară" });
    if (x[0] === "cards") return startCards([x[2]]);
    if (x[0] === "go") return go(x[2]);
  }
  function planDayHtml(d, open) {
    var p = PLAN[d - 1], st = dayStatus(d), pi = planInfo();
    var cls = st.done ? "pdone" : d === pi.idx ? "ptoday" : d < pi.idx ? "plate" : "";
    var h = '<div class="pday ' + cls + '"><div class="pdh"><span class="pdn">' + (st.done ? "✓" : d) + '</span><div><b>Ziua ' + d + " · " + fmtDay(dayDate(d)) + (d === pi.idx ? ' <i class="tag">AZI</i>' : "") + ' <i class="tag">~' + fmtH(dayMin(p)) + "</i></b><small>" + esc(p.t) + "</small></div></div>";
    if (open) {
      h += '<div class="ptasks">';
      if (p.les.length) h += '<div class="pxh">Lecții noi (' + st.ld + "/" + st.lt + ")</div>";
      p.les.forEach(function (id) { var l = LBY[id]; if (!l) return; h += '<button class="ptask' + (isDone(id) ? " ok" : "") + '" data-pl="' + id + '"><span>' + (isDone(id) ? "✅" : "⭕") + "</span>" + l.ic + " " + esc(CATBY[l.c].short) + " – " + esc(l.t) + "</button>"; });
      if (p.exam) h += '<button class="ptask' + (st.tok ? " ok" : "") + '" data-pt="' + d + '"><span>' + (st.tok ? "✅" : "📝") + "</span>Simulare mare: " + p.exam + " întrebări din tot, " + p.exam + " min" + (st.tp ? " · cel mai bun: " + st.tp + "%" : "") + "</button>";
      else h += '<button class="ptask' + (st.tok ? " ok" : "") + '" data-pt="' + d + '"><span>' + (st.tok ? "✅" : "🎯") + "</span>Testul zilei: " + p.test.n + " întrebări, minim 70%" + (st.tp ? " · cel mai bun: " + st.tp + "%" : "") + "</button>";
      if (p.sim) {
        var ts = simsOn(d, "sim"), ps = simsOn(d, "prac"), sv = ["Subiectul 1", "Subiectul 2", "Subiectul 3"][(p.sim - 1) % 3], pv = (p.sim - 1) % 3 + 1;
        h += '<div class="pxh">Simulare completă de examen' + (p.simOnly ? " (fă-le pe toate, de 2 ori dacă ai timp)" : "") + "</div>" +
          '<button class="ptask' + (ts.length ? " ok" : "") + '" data-go="sim"><span>' + (ts.length ? "✅" : "📝") + "</span>Teorie: 18 întrebări, nota 1–10 · azi: " + (p.simOnly ? "toate 3 subiectele" : sv) + (ts.length ? " · nota azi: " + fmtG(Math.max.apply(null, ts.map(function (e) { return e.g || 0; }))) : "") + "</button>" +
          '<button class="ptask' + (ps.length ? " ok" : "") + '" data-go="prac"><span>' + (ps.length ? "✅" : "🔌") + "</span>Practică: simulare pas cu pas · azi: " + (p.simOnly ? "toate 3 variantele" : "Varianta " + pv) + (ps.length ? " · nota azi: " + fmtG(Math.max.apply(null, ps.map(function (e) { return e.g || 0; }))) : "") + "</button>";
      }
      h += '<div class="pxh">Repetare (spaced review)</div><button class="ptask" data-go="mist"><span>❗</span>Greșelile mele – repetă ce ai greșit (' + Object.keys(P.mist).filter(function (k) { return P.mist[k] && P.mist[k][1]; }).length + ")</button>";
      if (p.opt) { h += '<div class="pxh">Opțional – fizică (doar dacă îți rămâne timp)</div>'; p.opt.forEach(function (id) { var l = LBY[id]; if (!l) return; h += '<button class="ptask px' + (isDone(id) ? " ok" : "") + '" data-pl="' + id + '"><span>' + (isDone(id) ? "✅" : "◽") + "</span>" + l.ic + " " + esc(CATBY[l.c].short) + " – " + esc(l.t) + "</button>"; }); }
      if (p.x && p.x.length) { h += '<div class="pxh">Jocuri și exersare în plus</div>'; p.x.forEach(function (x, i) { h += '<button class="ptask px" data-px="' + d + "-" + i + '"><span>➕</span>' + esc(x[1]) + "</button>"; }); }
      h += '<button class="ghost sm mk" data-md="' + d + '">' + (P.plan.done[pk(d)] ? "↺ Marchează ca nefăcută" : "✓ Marchează ziua ca făcută") + "</button></div>";
    }
    return h + "</div>";
  }
  function wirePlan(root) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-pl]"), function (b) { b.onclick = function () { SND.tap(); startLesson(LBY[b.getAttribute("data-pl")]); }; });
    Array.prototype.forEach.call(root.querySelectorAll("[data-pt]"), function (b) { b.onclick = function () { SND.tap(); startPlanTest(+b.getAttribute("data-pt")); }; });
    Array.prototype.forEach.call(root.querySelectorAll("[data-go]"), function (b) { b.onclick = function () { go(b.getAttribute("data-go")); }; });
    Array.prototype.forEach.call(root.querySelectorAll("[data-px]"), function (b) { b.onclick = function () { var k = b.getAttribute("data-px").split("-"); planExtra(PLAN[+k[0] - 1].x[+k[1]]); }; });
    Array.prototype.forEach.call(root.querySelectorAll("[data-md]"), function (b) { b.onclick = function () { var d = +b.getAttribute("data-md"); if (P.plan.done[pk(d)]) P.plan.done[pk(d)] = 0; else P.plan.done[pk(d)] = Date.now(); saveP(); go(view === "plan" ? "plan" : "learn"); }; });
  }
  function placeCard() {
    if (P.place && P.place.t) return "";
    return '<section class="card placec"><b>🧭 Test de nivel</b><p class="muted">20 de întrebări din toate capitolele (~5 minute). Îți arată ce știi deja și de unde să începi.</p><button class="big" id="plBtn">Fă testul de nivel</button></section>';
  }
  function planCard() {
    var pi = planInfo(), d = Math.min(PLAN.length, Math.max(1, pi.idx)), nd = 0;
    for (var k = 1; k <= PLAN.length; k++) if (dayStatus(k).done) nd++;
    var cd = pi.left > 1 ? "⏳ <b>" + pi.left + " zile</b> până la examen" : pi.left === 1 ? "⏳ Examenul este <b>mâine</b>!" : pi.left === 0 ? "🎖️ Examenul este <b>azi</b>. Mult succes!" : "Examenul a trecut. Poți seta o nouă dată.";
    var h = '<section class="card plan"><div class="ph"><b>📅 Plan ' + PLAN.length + ' zile · 4–5 h/zi</b><button class="back" id="planAll">Tot planul ›</button></div><div class="cd">' + cd + " (" + fmtDay(pi.ex) + ")</div>" +
      '<div class="pdots">' + PLAN.map(function (_, i) { var s = dayStatus(i + 1); return '<i class="' + (s.done ? "d" : i + 1 === pi.idx ? "t" : i + 1 < pi.idx ? "l" : "") + '" title="Ziua ' + (i + 1) + '"></i>'; }).join("") + '</div><small class="muted">' + nd + " / " + PLAN.length + " zile complete" + (pi.idx < 1 ? " · planul începe pe " + fmtDay(pi.start) + " (poți începe deja)" : pi.idx > PLAN.length ? "" : "") + "</small>";
    return h + planDayHtml(d, true) + "</section>";
  }
  function vPlan() {
    view = "plan"; navbar(true);
    var h = '<section class="card"><button class="back" id="backBtn">‹ Învață</button><h2>📅 Plan de pregătire – ' + PLAN.length + ' zile, 4–5 ore pe zi</h2><label class="tform"><span>Data examenului</span><input type="date" id="exDate" value="' + planExam() + '"></label><p class="muted">Ordinea urmează ponderea la examen: întâi „Exact ca la examen”, apoi CCNA (~40%), telecom (~20%), fibră, cablare și proba practică; fizica e opțională, la final. Fiecare zi: lecții noi, jocuri și simulatoare, repetarea greșelilor. Din ziua 4 faci zilnic o simulare completă (teorie 18 întrebări + probă practică). Ultimele 2 zile: doar simulări și greșeli. Ziua e completă când termini lecțiile și treci testul zilei (≥ 70%). Maxim 6 ore pe zi – somnul contează.</p></section>';
    for (var d = 1; d <= PLAN.length; d++) h += '<div class="card">' + planDayHtml(d, true) + "</div>";
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("learn"); };
    $("exDate").onchange = function () { if (!/^\d{4}-\d{2}-\d{2}$/.test(this.value)) return; P.plan.exam = this.value; P.plan.et = Date.now(); saveP(); toast("Data examenului salvată: " + fmtDay(parseDay(this.value))); go("plan"); };
    wirePlan(app);
  }
