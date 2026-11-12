  /* ---------- Jocuri ---------- */
  function gDone(k) { P.cli = P.cli || {}; var first = !P.cli[k]; P.cli[k] = Date.now(); return first; }
  function gBest(k, v) { P.cli = P.cli || {}; var b = P.cli["best:" + k] || 0; if (v > b) { P.cli["best:" + k] = v; return true; } return false; }
  function gWin(k, xp, msg) { var first = gDone(k); addXP(first ? xp : Math.ceil(xp / 3)); saveP(); SND.ok(); return '<div class="fact tok"><b>🎉 ' + (msg || "Gata!") + " +" + (first ? xp : Math.ceil(xp / 3)) + " XP</b></div>"; }
  var GAMES = [
    ["daily", "📅", "Joc zilnic", "10 întrebări amestecate: întâi ce ai greșit (repetare spațiată)"],
    ["swipe", "👆", "Adevărat sau Fals – swipe", "60 de secunde: dreapta = Adevărat, stânga = Fals; cardul se întoarce cu explicația"],
    ["light", "⚡", "Fulger: 4 variante", "Cât mai multe răspunsuri corecte în 60 s, cu combo"],
    ["fall", "🎯", "Prinde răspunsul corect", "Variantele cad – atinge-o pe cea corectă înainte să ajungă jos"],
    ["pairs", "🃏", "Perechi (memorie)", "Întoarce cărțile și găsește perechile"],
    ["order", "🔢", "Pune în ordine", "T568B, mufare, SSH, VLAN, OSI, consolă, IP static, DHCP"],
    ["cli", "⌨️", "Completează comanda", "Scrie cuvântul care lipsește din comanda Cisco/Windows"],
    ["cable", "🔌", "Ce cablu?", "Alege cablul corect pentru fiecare legătură"],
    ["photo", "📷", "Recunoaște din poză", "Conectori, echipamente Cisco, scule"],
    ["mnem", "🧠", "Ce ascunde trucul?", "Vezi trucul de memorie – ce codifică?"]
  ];
  function gKeys() { var k = ["g:daily", "g:swipe", "g:light", "g:fall", "g:cli", "g:cable", "g:photo", "g:mnem"]; Object.keys(GPAIRS).forEach(function (x) { k.push("g:pairs:" + x); }); Object.keys(GORDER).forEach(function (x) { k.push("g:order:" + x); }); return k; }
  var GS = null;
  function vGames(id, sub) {
    view = "practice"; navbar(true); P.cli = P.cli || {};
    if (!id) {
      var keys = gKeys(), dn = keys.filter(function (k) { return P.cli[k]; }).length;
      var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>🎮 Jocuri de memorie</h2><p class="muted small">' + dn + " / " + keys.length + ' jocuri terminate · fiecare dă XP și contează la progres.</p><div class="ggrid">' + GAMES.map(function (g) {
        var tot = g[0] === "pairs" ? Object.keys(GPAIRS).length : g[0] === "order" ? Object.keys(GORDER).length : 1, got = g[0] === "pairs" ? Object.keys(GPAIRS).filter(function (x) { return P.cli["g:pairs:" + x]; }).length : g[0] === "order" ? Object.keys(GORDER).filter(function (x) { return P.cli["g:order:" + x]; }).length : P.cli["g:" + g[0]] ? 1 : 0, best = P.cli["best:" + g[0]];
        return '<button class="gcard' + (got >= tot ? " ok" : "") + '" data-g="' + g[0] + '"><span class="gic">' + g[1] + "</span><b>" + esc(g[2]) + "</b><small>" + esc(g[3]) + "</small><i>" + (got >= tot ? "✓ " : "") + got + "/" + tot + (best ? " · record " + best : "") + "</i></button>";
      }).join("") + "</div></section>";
      app.innerHTML = h; $("backBtn").onclick = function () { go("practice"); };
      Array.prototype.forEach.call(app.querySelectorAll("[data-g]"), function (b) { b.onclick = function () { GS = null; vGames(b.getAttribute("data-g")); }; });
      return;
    }
    var G = GAMES.filter(function (g) { return g[0] === id; })[0];
    app.innerHTML = '<section class="card gbox"><button class="back" id="backBtn">‹ Jocuri</button><h2>' + G[1] + " " + esc(G[2]) + '</h2><div id="gB"></div></section>';
    $("backBtn").onclick = function () { stopG(); vGames(); };
    var B = $("gB");
    ({ daily: gDaily, swipe: gSwipe, light: gLight, fall: gFall, pairs: gPairs, order: gOrder, cli: gCli, cable: gCable, photo: gPhoto, mnem: gMnem }[id])(B, sub);
  }
  function stopG() { if (GS && GS.tm) clearInterval(GS.tm); if (GS && GS.raf) clearTimeout(GS.raf); GS = null; }
  function pickSet(B, map, cb, label) {
    B.innerHTML = '<p class="muted small">' + label + '</p><div class="gsets">' + Object.keys(map).map(function (k) { return '<button class="ptask' + (P.cli[cb + k] ? " ok" : "") + '" data-s="' + k + '"><span>' + (P.cli[cb + k] ? "✅" : "▶️") + "</span>" + esc(map[k].t) + "</button>"; }).join("") + "</div>";
  }
  /* 1) zilnic */
  function gDaily(B) {
    var k = "d:" + dayKey(), done = P.cli[k];
    var nm = Object.keys(P.mist).filter(function (x) { return P.mist[x] && P.mist[x][1]; }).length;
    B.innerHTML = '<p>Azi: 10 întrebări din tot materialul. Întâi revin cele greșite (ai ' + nm + ' de repetat), apoi cele nevăzute.</p>' + (done ? '<div class="fact tok small">✅ Jocul de azi e făcut. Poți să-l mai joci.</div>' : "") + '<button class="big" id="dGo">Joacă</button>';
    $("dGo").onclick = function () { P.cli[k] = P.cli[k] || 0; gDone("g:daily"); P.cli[k] = Date.now(); addXP(5); saveP(); runQuiz({ mode: "practice", items: pickQuestions(QS.filter(function (q) { return !q.s; }), 10), hearts: 0, requeue: true, xpEach: 5, title: "Joc zilnic" }); };
  }
  /* 2) swipe Adevărat/Fals */
  function gSwipe(B) {
    var deck = shuffle(GTF), S = GS = { i: 0, score: 0, combo: 0, t: 60, wrong: [], right: 0, back: false, tm: null, on: false };
    function hud() { return '<div class="ghud"><span>⏱ <b id="sT">' + S.t + '</b>s</span><span>Scor <b id="sS">' + S.score + '</b></span><span>Combo <b id="sC">×' + mult() + "</b></span></div>"; }
    function mult() { return S.combo >= 10 ? 3 : S.combo >= 5 ? 2 : 1; }
    function intro() { B.innerHTML = '<p>Glisează cardul: <b>dreapta = ADEVĂRAT</b>, <b>stânga = FALS</b> (sau folosește butoanele). După fiecare răspuns cardul se întoarce: vezi verdictul, varianta corectă și trucul. Timpul stă pe loc cât citești spatele cardului. Combo: ×2 după 5 corecte la rând, ×3 după 10.</p><p class="muted small">Record: ' + (P.cli["best:swipe"] || 0) + '</p><button class="big" id="sGo">Start</button>'; $("sGo").onclick = start; }
    function start() { S.on = true; paint(); S.tm = setInterval(function () { if (!document.body.contains(B)) return stopG(); if (S.back) return; S.t--; var el = $("sT"); if (el) el.textContent = S.t; if (S.t <= 0) end(); }, 1000); }
    function paint() {
      var x = deck[S.i % deck.length];
      B.innerHTML = hud() + '<div class="swwrap"><div class="swcard" id="swc" tabindex="0" aria-live="polite"><div class="swin" id="swin"><div class="swf"><small class="muted">Adevărat sau fals?</small><p>' + esc(x[0]) + '</p><div class="swhint"><span>‹ FALS</span><span>ADEVĂRAT ›</span></div></div><div class="swb" id="swb"></div></div></div></div><div class="row2"><button class="ghost swbtn bad" id="sF">✗ Fals</button><button class="ghost swbtn good" id="sA">✓ Adevărat</button></div>';
      $("sF").onclick = function () { answer(0); }; $("sA").onclick = function () { answer(1); };
      var c = $("swc"), x0 = null, dx = 0;
      c.addEventListener("pointerdown", function (e) { if (S.back) return; x0 = e.clientX; dx = 0; c.setPointerCapture(e.pointerId); c.style.transition = "none"; });
      c.addEventListener("pointermove", function (e) { if (x0 === null) return; dx = e.clientX - x0; c.style.transform = "translateX(" + dx + "px) rotate(" + dx / 18 + "deg)"; c.classList.toggle("tl", dx < -40); c.classList.toggle("tr", dx > 40); });
      c.addEventListener("pointerup", function () { if (x0 === null) return; x0 = null; c.style.transition = ""; if (Math.abs(dx) > 90) answer(dx > 0 ? 1 : 0, dx); else { c.style.transform = ""; c.classList.remove("tl", "tr"); } });
      c.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") answer(1); if (e.key === "ArrowLeft") answer(0); });
    }
    function answer(v, dx) {
      if (S.back || !S.on) return; var x = deck[S.i % deck.length], ok = v === x[1], c = $("swc");
      if (ok) { S.combo++; S.right++; S.score += 10 * mult(); SND.ok(); } else { S.combo = 0; S.wrong.push(x); SND.bad(); if (navigator.vibrate) try { navigator.vibrate(60); } catch (e) {} }
      S.back = true; c.style.transform = ""; c.classList.remove("tl", "tr"); c.classList.add(ok ? "bump" : "shake");
      var hk = typeof HACK_FIND === "function" ? HACK_HTML(HACK_FIND(x[0] + " " + (x[3] || "") + " " + x[2], null)) : "";
      $("swb").innerHTML = '<div class="swv ' + (x[1] ? "t" : "f") + '">' + (x[1] ? "ADEVĂRAT" : "FALS") + '</div><div class="swr ' + (ok ? "good" : "bad") + '">' + (ok ? "✅ Ai răspuns corect" + (mult() > 1 ? " · combo ×" + mult() : "") : "❌ Ai greșit") + "</div>" + (x[1] ? "" : '<p class="small"><b>Varianta corectă:</b> ' + esc(x[3]) + "</p>") + '<p class="small muted">' + esc(x[2]) + "</p>" + (ok ? "" : hk) + '<button class="big" id="sCont">Continuă ›</button>';
      $("swin").classList.add("flip"); $("sS").textContent = S.score; $("sC").textContent = "×" + mult();
      $("sCont").onclick = function () { S.back = false; S.i++; if (S.t <= 0) end(); else paint(); };
    }
    function end() {
      if (!S.on) return; S.on = false; clearInterval(S.tm); S.back = false;
      var rec = gBest("swipe", S.score), win = S.right >= 5 ? gWin("g:swipe", 15, "Rundă terminată!") : (saveP(), "");
      B.innerHTML = '<div class="gend"><b>' + S.score + '</b><span>puncte · ' + S.right + " corecte · " + S.wrong.length + " greșite</span>" + (rec ? '<i class="tag">🏆 Record nou!</i>' : "<small>Record: " + (P.cli["best:swipe"] || 0) + "</small>") + "</div>" + win + (S.right < 5 ? '<p class="small muted">Ca jocul să se bifeze: minim 5 răspunsuri corecte într-o rundă.</p>' : "") + (S.wrong.length ? '<h3>De reținut</h3>' + S.wrong.map(function (x) { return '<div class="card rev"><div class="qq">' + esc(x[0]) + '</div><div class="small"><b>' + (x[1] ? "ADEVĂRAT" : "FALS") + "</b>" + (x[3] ? " – " + esc(x[3]) : "") + '</div><div class="small muted">' + esc(x[2]) + "</div></div>"; }).join("") : "") + '<button class="big" id="sAgain">Încă o rundă</button>';
      $("sAgain").onclick = function () { gSwipe(B); };
    }
    intro();
  }
  /* 3) fulger */
  function lightPool() { return QS.filter(function (q) { return !q.s && q.a.length === 4 && q.q.length < 160; }); }
  function gLight(B) {
    var pool = shuffle(lightPool()), S = GS = { i: 0, score: 0, combo: 0, t: 60, ok: 0, bad: [], tm: null, on: false };
    B.innerHTML = '<p>60 de secunde, întrebări din tot materialul. Răspuns corect = 10 puncte × combo (×2 de la 3 la rând, ×3 de la 6). Greșeala nu oprește timpul – vezi explicațiile la final.</p><p class="muted small">Record: ' + (P.cli["best:light"] || 0) + '</p><button class="big" id="lGo">Start</button>';
    $("lGo").onclick = function () { S.on = true; paint(); S.tm = setInterval(function () { if (!document.body.contains(B)) return stopG(); S.t--; var e = $("lT"); if (e) e.textContent = S.t; if (S.t <= 0) end(); }, 1000); };
    function mult() { return S.combo >= 6 ? 3 : S.combo >= 3 ? 2 : 1; }
    function paint() {
      var q = pool[S.i % pool.length], ord = shuffle([0, 1, 2, 3]);
      B.innerHTML = '<div class="ghud"><span>⏱ <b id="lT">' + S.t + "</b>s</span><span>Scor <b>" + S.score + "</b></span><span>×" + mult() + '</span></div><p class="lq">' + esc(q.q) + '</p><div class="opts">' + ord.map(function (k) { return '<button class="opt" data-k="' + k + '">' + esc(q.a[k]) + "</button>"; }).join("") + "</div>";
      Array.prototype.forEach.call(B.querySelectorAll(".opt"), function (b) { b.onclick = function () { if (!S.on) return; var ok = b.getAttribute("data-k") === "0"; if (ok) { S.combo++; S.ok++; S.score += 10 * mult(); SND.ok(); } else { S.combo = 0; S.bad.push(q); SND.bad(); } b.classList.add(ok ? "good" : "bad"); setTimeout(function () { S.i++; if (S.on) paint(); }, ok ? 180 : 450); }; });
    }
    function end() { S.on = false; clearInterval(S.tm); var rec = gBest("light", S.score), win = S.ok >= 5 ? gWin("g:light", 15, "Fulger terminat!") : (saveP(), ""); B.innerHTML = '<div class="gend"><b>' + S.score + "</b><span>" + S.ok + " corecte · " + S.bad.length + " greșite</span>" + (rec ? '<i class="tag">🏆 Record nou!</i>' : "") + "</div>" + win + S.bad.map(function (q) { return '<div class="card rev"><div class="qq">' + esc(q.q) + '</div><div class="small">✅ ' + esc(q.a[0]) + '</div><div class="small muted">' + esc(q.e) + "</div></div>"; }).join("") + '<button class="big" id="lAgain">Încă o dată</button>'; $("lAgain").onclick = function () { gLight(B); }; }
  }
  /* 4) prinde răspunsul */
  function gFall(B) {
    var pool = shuffle(lightPool().filter(function (q) { return q.a.every(function (x) { return x.length <= 40; }); })), S = GS = { i: 0, score: 0, lives: 3, ok: 0, bad: [], on: false };
    B.innerHTML = '<p>Cele 4 variante cad pe ecran. Atinge-o pe cea <b>corectă</b> înainte să ajungă jos. Ai 3 vieți. Viteza crește pe parcurs.</p><p class="muted small">Record: ' + (P.cli["best:fall"] || 0) + '</p><button class="big" id="fGo">Start</button>';
    $("fGo").onclick = function () { S.on = true; round(); };
    function round() {
      if (!S.on) return; var q = pool[S.i % pool.length], ord = shuffle([0, 1, 2, 3]), dur = Math.max(4.5, 9 - S.ok * 0.3);
      B.innerHTML = '<div class="ghud"><span>' + "❤️".repeat(S.lives) + "</span><span>Scor <b>" + S.score + '</b></span></div><p class="lq">' + esc(q.q) + '</p><div class="fall" id="fz">' + ord.map(function (k, j) { return '<button class="fitem" data-k="' + k + '" style="left:' + (2 + j * 24.5) + "%;animation-duration:" + (dur + j * 0.35).toFixed(2) + "s;animation-delay:" + (j * 0.25) + 's">' + esc(q.a[k]) + "</button>"; }).join("") + "</div>";
      var settled = false;
      function fin(ok, b) { if (settled || !S.on) return; settled = true; if (ok) { S.ok++; S.score += 10 + S.ok; SND.ok(); } else { S.lives--; S.bad.push(q); SND.bad(); } if (b) b.classList.add(ok ? "good" : "bad"); Array.prototype.forEach.call(B.querySelectorAll(".fitem"), function (x) { x.style.animationPlayState = "paused"; if (x.getAttribute("data-k") === "0") x.classList.add("good"); }); setTimeout(function () { S.i++; if (S.lives <= 0) end(); else round(); }, ok ? 350 : 900); }
      Array.prototype.forEach.call(B.querySelectorAll(".fitem"), function (b) { b.onclick = function () { fin(b.getAttribute("data-k") === "0", b); }; if (b.getAttribute("data-k") === "0") b.addEventListener("animationend", function () { fin(false, null); }); });
    }
    function end() { S.on = false; var rec = gBest("fall", S.score), win = S.ok >= 5 ? gWin("g:fall", 15, "Bravo!") : (saveP(), ""); B.innerHTML = '<div class="gend"><b>' + S.score + "</b><span>" + S.ok + " prinse</span>" + (rec ? '<i class="tag">🏆 Record nou!</i>' : "") + "</div>" + win + S.bad.map(function (q) { return '<div class="card rev"><div class="qq">' + esc(q.q) + '</div><div class="small">✅ ' + esc(q.a[0]) + '</div><div class="small muted">' + esc(q.e) + "</div></div>"; }).join("") + '<button class="big" id="fAgain">Încă o dată</button>'; $("fAgain").onclick = function () { gFall(B); }; }
  }
  /* 5) perechi */
  function gPairs(B, set) {
    if (!set) { pickSet(B, GPAIRS, "g:pairs:", "Alege un set. Întoarce câte 2 cărți: dacă se potrivesc, rămân descoperite."); Array.prototype.forEach.call(B.querySelectorAll("[data-s]"), function (b) { b.onclick = function () { gPairs(B, b.getAttribute("data-s")); }; }); return; }
    var pr = shuffle(GPAIRS[set].p).slice(0, 6), cards = shuffle(pr.reduce(function (a, p, i) { return a.concat([{ i: i, s: p[0] }, { i: i, s: p[1] }]); }, [])), open = [], got = {}, moves = 0, lock = false;
    function face(s) { return s.charAt(0) === "@" ? '<img src="' + PHOTOS[s.slice(1)].f + '" alt="" loading="lazy">' : esc(s); }
    function paint() {
      B.innerHTML = '<p class="muted small">' + esc(GPAIRS[set].t) + " · mutări: " + moves + " · perechi: " + Object.keys(got).length + "/" + pr.length + '</p><div class="mgrid">' + cards.map(function (c, k) { var up = got[c.i] || open.indexOf(k) >= 0; return '<button class="mc' + (up ? " up" : "") + (got[c.i] ? " ok" : "") + '" data-k="' + k + '" aria-label="' + (up ? esc(c.s.replace("@", "poză ")) : "carte întoarsă") + '"><span class="mcb">?</span><span class="mcf2">' + (up ? face(c.s) : "") + "</span></button>"; }).join("") + '</div><div id="pOut"></div><button class="ghost" id="pBack">‹ Alt set</button>';
      $("pBack").onclick = function () { gPairs(B); };
      Array.prototype.forEach.call(B.querySelectorAll(".mc"), function (b) { b.onclick = function () { var k = +b.getAttribute("data-k"); if (lock || got[cards[k].i] || open.indexOf(k) >= 0) return; open.push(k); SND.tap(); if (open.length === 2) { moves++; lock = true; var a = cards[open[0]], c = cards[open[1]]; paint(); setTimeout(function () { if (a.i === c.i) { got[a.i] = 1; SND.ok(); } open = []; lock = false; paint(); if (Object.keys(got).length === pr.length) $("pOut").innerHTML = gWin("g:pairs:" + set, 10, "Toate perechile în " + moves + " mutări!") + pr.map(function (p) { return '<div class="small">• ' + face(p[0]).replace(/<img[^>]*>/, "🖼️ " + esc(p[1])) + " ↔ " + esc(p[1]) + "</div>"; }).join(""); }, a.i === c.i ? 350 : 900); } else paint(); }; });
    }
    paint();
  }
  /* 6) ordine */
  function gOrder(B, set) {
    if (!set) { pickSet(B, GORDER, "g:order:", "Alege o secvență. Atinge pașii în ordinea corectă (atinge un pas pus ca să-l scoți)."); Array.prototype.forEach.call(B.querySelectorAll("[data-s]"), function (b) { b.onclick = function () { gOrder(B, b.getAttribute("data-s")); }; }); return; }
    var O = GORDER[set], pool = shuffle(O.s.map(function (x, i) { return i; })), got = [], checked = false;
    if (pool.every(function (x, i) { return x === i; })) pool.reverse();
    function paint() {
      var bad = checked ? got.filter(function (x, i) { return x !== i; }).length : 0;
      B.innerHTML = '<p class="muted small">' + esc(O.t) + '</p><ol class="olist">' + got.map(function (x, i) { return '<li><button class="ostep' + (checked ? (x === i ? " ok" : " bad") : "") + '" data-r="' + i + '"' + (checked ? " disabled" : "") + ">" + esc(O.s[x]) + "</button></li>"; }).join("") + '</ol><div class="opool">' + pool.filter(function (x) { return got.indexOf(x) < 0; }).map(function (x) { return '<button class="ghost ostep" data-a="' + x + '">' + esc(O.s[x]) + "</button>"; }).join("") + "</div>" + (checked ? (bad ? '<div class="eli trapw small">❌ ' + bad + " pași nu sunt la locul lor. Ordinea corectă:<ol>" + O.s.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>" + esc(O.e) + '</div><button class="big" id="oRe">Încearcă din nou</button>' : gWin("g:order:" + set, 10, "Ordine perfectă!") + '<div class="small muted">' + esc(O.e) + "</div>") : '<button class="big" id="oChk"' + (got.length < O.s.length ? " disabled" : "") + ">Verifică</button>") + '<button class="ghost" id="oBack">‹ Altă secvență</button>';
      Array.prototype.forEach.call(B.querySelectorAll("[data-a]"), function (b) { b.onclick = function () { got.push(+b.getAttribute("data-a")); SND.tap(); paint(); }; });
      Array.prototype.forEach.call(B.querySelectorAll("[data-r]"), function (b) { b.onclick = function () { got.splice(+b.getAttribute("data-r"), 1); paint(); }; });
      if ($("oChk")) $("oChk").onclick = function () { checked = true; if (got.some(function (x, i) { return x !== i; })) SND.bad(); paint(); };
      if ($("oRe")) $("oRe").onclick = function () { gOrder(B, set); };
      $("oBack").onclick = function () { gOrder(B); };
    }
    paint();
  }
  /* 7) completează comanda */
  function gCli(B) {
    var L = shuffle(GCLI).slice(0, 10), S = GS = { i: 0, ok: 0, done: false };
    function paint() {
      var x = L[S.i];
      if (!x) { var win = S.ok >= 7 ? gWin("g:cli", 15, S.ok + "/10 corecte!") : '<div class="eli trapw small">' + S.ok + "/10. Ca jocul să se bifeze: minim 7 corecte.</div>"; B.innerHTML = win + '<button class="big" id="cAgain">Încă o rundă</button>'; $("cAgain").onclick = function () { gCli(B); }; return; }
      B.innerHTML = '<p class="muted small">' + (S.i + 1) + " / 10 · corecte: " + S.ok + '</p><div class="term"><div class="tline">' + esc(x[0]) + '</div></div><form id="cF" class="tin" autocomplete="off"><label>____ =</label><input id="cI" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="Cuvântul lipsă"></form><div id="cOut"></div><button class="big" id="cNext">' + (S.done ? "Următoarea ›" : "Verifică") + "</button>";
      var inp = $("cI"); if (!S.done) inp.focus();
      function check() { if (S.done) { S.done = false; S.i++; return paint(); } var v = inp.value.trim().toLowerCase(), ok = x[1].some(function (a) { return a.toLowerCase() === v; }); S.done = true; if (ok) { S.ok++; SND.ok(); } else SND.bad(); $("cOut").innerHTML = '<div class="' + (ok ? "fact tok" : "eli trapw") + ' small">' + (ok ? "✅ " : "❌ Corect: <b>" + esc(x[1][0]) + "</b>. ") + esc(x[2]) + '<div class="term"><div class="tline">' + esc(x[0].replace("____", x[1][0])) + "</div></div></div>"; $("cNext").textContent = "Următoarea ›"; inp.disabled = true; }
      $("cF").onsubmit = function (e) { e.preventDefault(); check(); }; $("cNext").onclick = check;
    }
    paint();
  }
  /* 8) ce cablu / 9) poze / 10) trucuri – runde cu variante */
  function mcRound(B, key, items, render, xp, minOk) {
    var L = shuffle(items).slice(0, Math.min(10, items.length)), S = GS = { i: 0, ok: 0, ans: false };
    function paint() {
      var x = L[S.i];
      if (!x) { var win = S.ok >= minOk ? gWin(key, xp, S.ok + "/" + L.length + " corecte!") : '<div class="eli trapw small">' + S.ok + "/" + L.length + ". Ca jocul să se bifeze: minim " + minOk + " corecte.</div>"; B.innerHTML = win + '<button class="big" id="mAgain">Încă o rundă</button>'; $("mAgain").onclick = function () { mcRound(B, key, items, render, xp, minOk); }; return; }
      var r = render(x), ord = r.ord || (r.ord = shuffle(r.o.map(function (_, i) { return i; })));
      B.innerHTML = '<p class="muted small">' + (S.i + 1) + " / " + L.length + " · corecte: " + S.ok + "</p>" + r.top + '<div class="opts">' + ord.map(function (k) { return '<button class="opt" data-k="' + k + '">' + esc(r.o[k]) + "</button>"; }).join("") + '</div><div id="mOut"></div>';
      Array.prototype.forEach.call(B.querySelectorAll(".opt"), function (b) { b.onclick = function () { var ok = b.getAttribute("data-k") === "0"; if (ok) { S.ok++; SND.ok(); } else SND.bad(); Array.prototype.forEach.call(B.querySelectorAll(".opt"), function (o) { o.disabled = true; if (o.getAttribute("data-k") === "0") o.classList.add("good"); else if (o === b) o.classList.add("bad"); }); $("mOut").innerHTML = '<div class="' + (ok ? "fact tok" : "eli trapw") + ' small">' + (ok ? "✅ " : "❌ ") + (r.e || "") + '</div><button class="big" id="mNext">Următoarea ›</button>'; $("mNext").onclick = function () { S.i++; paint(); }; }; });
    }
    paint();
  }
  function gCable(B) { mcRound(B, "g:cable", GCABLE, function (x) { var wrong = shuffle(GCABOPT.filter(function (o) { return o !== x[1]; })).slice(0, 3); return { top: '<div class="acr"><b>' + esc(x[0]) + '</b><small class="muted">Ce cablu/conector folosești?</small></div>', o: [x[1]].concat(wrong), e: "Regula: aparate diferite → drept; același tip → crossover; consolă → rollover; distanțe mari → fibră (monomod la km, multimod OM3/OM4 la sute de metri)." }; }, 15, 8); }
  function gPhoto(B) { mcRound(B, "g:photo", GPHOTO.filter(function (x) { return PHOTOS[x[0]]; }), function (x) { var wrong = shuffle(GPHOTO.filter(function (o) { return o[1] !== x[1]; }).map(function (o) { return o[1]; })).slice(0, 3); var p = PHOTOS[x[0]]; return { top: '<figure class="ph"><img src="' + p.f + '" width="' + p.w + '" height="' + p.h + '" alt="Ce este în poză?"><figcaption><small>Foto: ' + p.a + " · " + p.l + "</small></figcaption></figure>", o: [x[1]].concat(wrong), e: p.c }; }, 15, 8); }
  function gMnem(B) { mcRound(B, "g:mnem", GMNEM, function (x) { return { top: '<div class="acr"><b style="font-size:1.15rem">' + esc(x[0]) + '</b><small class="muted">Ce te ajută să-ți amintești trucul acesta?</small></div>', o: [x[1]].concat(x[2]), e: x[1] + "." }; }, 15, 8); }
