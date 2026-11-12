  /* ---------------- Simulare examen real: 18 întrebări, nota 1–10, minim 7 ---------------- */
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function sshuf(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var SIM_N = 18;
  function simPools() {
    var ok4 = function (q) { return q.a && q.a.length === 4; };
    var exq = QS.filter(function (q) { return q.c === "ex" && ok4(q); });
    function g(name) { return exq.filter(function (q) { return q.e.indexOf("Examen real · " + name + " ·") >= 0; }); }
    return {
      ccna: g("CCNA"), tel: g("Telecom"), fib: g("Fibră"), gen: g("General"),
      ccnaX: QS.filter(function (q) { return (q.c === "net" || q.c === "sub" || q.c === "cab") && ok4(q); }),
      telX: QS.filter(function (q) { return (q.c === "tel" || q.c === "voip") && ok4(q); }),
      fibX: QS.filter(function (q) { return q.c === "fo" && ok4(q); })
    };
  }
  /* 18 = 7 CCNA (6 + 1) · 4 Telecom (3 + 1) · 7 fibră și rest (3 fibră + 3 general + 1 fibră din capitolul Fibră). ~83% din „Examen real”. */
  var SIM_MIX = [["ccna", 6], ["ccnaX", 1], ["tel", 3], ["telX", 1], ["fib", 3], ["gen", 3], ["fibX", 1]];
  function simPick(v) {
    var P0 = simPools(), out = [];
    SIM_MIX.forEach(function (m) {
      var pool = P0[m[0]], n = m[1];
      if (v >= 1 && v <= 3) { var sh = sshuf(pool, rng(9001 + m[0].length * 31 + pool.length)); out = out.concat(sh.slice((v - 1) * n, v * n)); }
      else out = out.concat(shuffle(pool).slice(0, n));
    });
    return v >= 1 && v <= 3 ? sshuf(out, rng(4242 + v)) : shuffle(out);
  }
  function grade(c, n) { return Math.round((1 + 9 * c / n) * 100) / 100; }
  function fmtG(g) { return g.toFixed(2).replace(".", ","); }
  function vSim() {
    view = "practice"; navbar(true);
    var hist = P.exams.filter(function (e) { return e.k === "sim"; }).slice(-8).reverse();
    var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>📝 Simulare examen – proba teoretică</h2>' +
      '<p class="muted">Exact formatul raportat: <b>18 întrebări</b>, fiecare cu <b>4 variante (A–D)</b> și <b>un singur răspuns corect</b>. Aproximativ 40% CCNA, 20% telecom și 40% fibră și cultură generală de rețele, majoritatea din „Examen real”. Fiecare răspuns corect valorează 0,5 puncte, plus 1 punct din oficiu, deci nota e între 1 și 10. <b>Promovezi cu minimum 7</b>, adică 12 răspunsuri corecte din 18.</p>' +
      '<h3>Timp</h3><div class="seg" id="stSeg">' + [[30, "30 min"], [20, "20 min"], [0, "Fără limită"]].map(function (x) { return '<button data-t="' + x[0] + '" class="' + ((SET.st == null ? 30 : SET.st) === x[0] ? "on" : "") + '">' + x[1] + "</button>"; }).join("") + "</div>" +
      '<div class="row2"><button class="big" data-v="1">Subiectul 1</button><button class="big" data-v="2">Subiectul 2</button></div><div class="row2"><button class="big" data-v="3">Subiectul 3</button><button class="big" data-v="0">Aleator</button></div>' +
      '<p class="muted small">Subiectele 1, 2 și 3 sunt fixe și nu au întrebări comune între ele. „Aleator” extrage alt set de fiecare dată.</p></section>';
    h += '<section class="card"><h2>Rezultatele tale</h2>' + (hist.length ? hist.map(function (e) { return '<div class="crow"><span>' + fmtDate(e.t) + " · " + esc(e.s || "") + "</span><b class=\"" + (e.g >= 7 ? "okc" : "badc") + "\">" + fmtG(e.g) + "</b><span>" + e.c + "/" + e.n + (e.g >= 7 ? " · admis" : " · respins") + "</span></div>"; }).join("") : '<p class="muted">Nicio simulare încă.</p>') + "</section>";
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("practice"); };
    Array.prototype.forEach.call(app.querySelectorAll("#stSeg button"), function (b) { b.onclick = function () { SET.st = +b.getAttribute("data-t"); saveSet(); vSim(); }; });
    Array.prototype.forEach.call(app.querySelectorAll("[data-v]"), function (b) { b.onclick = function () { var v = +b.getAttribute("data-v"); var mins = SET.st == null ? 30 : SET.st; runQuiz({ mode: "exam", items: simPick(v), minutes: mins, title: "Simulare examen", sim: v ? "Subiectul " + v : "Subiect aleator" }); }; });
  }
  function simResult(o, corr, secs, timeout) {
    var n = o.items.length, g = grade(corr, n), pass = g >= 7;
    var h = '<div class="result card pop sheetres"><div class="rhead"><b>FOAIE DE REZULTAT – PROBA TEORETICĂ</b><small>Simulare · ' + esc(o.sim) + " · " + fmtDate(Date.now()) + " · timp " + fmtTime(secs) + (timeout ? " · timpul a expirat" : "") + "</small></div>" +
      '<table class="rtab"><thead><tr><th>Nr.</th><th>Răspuns</th><th>Corect</th><th>Punctaj</th></tr></thead><tbody>' +
      o.items.map(function (it, j) { var ch = it.pick == null ? "—" : LET[it.ord.indexOf(it.pick)], co = LET[it.ord.indexOf(0)], ok = it.pick === 0; return '<tr class="' + (ok ? "ok" : "bad") + '"><td>' + (j + 1) + "</td><td>" + ch + "</td><td>" + co + "</td><td>" + (ok ? "0,5" : "0") + "</td></tr>"; }).join("") +
      '</tbody><tfoot><tr><td colspan="3">Răspunsuri corecte: ' + corr + " / " + n + " · din oficiu: 1</td><td>" + fmtG(g) + "</td></tr></tfoot></table>" +
      '<div class="gradebox ' + (pass ? "ok" : "bad") + '"><span>Nota</span><b>' + fmtG(g) + '</b><em>' + (pass ? "ADMIS (minim 7)" : "RESPINS – sub 7 (îți mai trebuiau " + Math.max(0, 12 - corr) + " răspunsuri corecte)") + "</em></div>" +
      '<button class="big" id="doneBtn">Gata</button><button class="ghost" id="againSim">Altă simulare</button></div><h2 class="sec">Răspunsuri greșite / nerăspunse</h2>';
    var wrong = o.items.filter(function (it) { return it.pick !== 0; });
    if (!wrong.length) h += '<div class="card">Perfect – niciun răspuns greșit! 🎉</div>';
    wrong.forEach(function (it) { var j = o.items.indexOf(it); h += '<div class="card rev"><div class="qmeta">' + (j + 1) + ". " + CATBY[it.q.c].ic + " " + esc(CATBY[it.q.c].short) + markBtn(it.q.id) + '</div><div class="qq">' + esc(it.q.q) + "</div>" + qSvg(it.q) + (it.pick != null ? '<div class="a bad">❌ ' + LET[it.ord.indexOf(it.pick)] + ") " + esc(it.q.a[it.pick]) + "</div>" : '<div class="a bad">— fără răspuns</div>') + '<div class="a ok">✅ ' + LET[it.ord.indexOf(0)] + ") " + esc(it.q.a[0]) + '</div><div class="e">💡 ' + esc(it.q.e) + "</div></div>"; });
    app.innerHTML = h; wireMarks();
    $("doneBtn").onclick = function () { go("sim"); };
    $("againSim").onclick = function () { go("sim"); };
    toTop();
    return g;
  }
  function qSvg(q) { return q.s ? '<div class="qsvg">' + q.s + "</div>" : ""; }
