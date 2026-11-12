  /* ---------- Stăpânire (0–5) pe întrebare + „Exersează greșelile” în formate diferite ---------- */
  /* P.cli["m:"+id] = timp*10 + nivel (merge = max → câștigă cea mai nouă valoare); P.cli["mx:"+id] = câte greșeli; P.cli["mf:"+id] = timp*10 + ultimul format */
  function mLvl(id) { var v = P.cli && P.cli["m:" + id]; return v ? v % 10 : 0; }
  function mSet(id, l) { P.cli = P.cli || {}; P.cli["m:" + id] = Date.now() * 10 + Math.max(0, Math.min(5, l)); }
  function mMiss(id) { return (P.cli && P.cli["mx:" + id]) || 0; }
  function mUpd(id, ok) { if (!id) return; var l = mLvl(id); mSet(id, ok ? l + 1 : Math.max(0, l - 2)); if (!ok) P.cli["mx:" + id] = mMiss(id) + 1; }
  function mDots(id) { var l = mLvl(id), s = ""; for (var i = 0; i < 5; i++) s += i < l ? "●" : "○"; return '<span class="mdots" title="Stăpânire ' + l + '/5">' + s + "</span>"; }
  function weakIds() {
    var m = activeMistakes().sort(function (a, b) { return P.mist[a][0] - P.mist[b][0]; });
    var low = Object.keys(P.q).filter(function (id) { return BYID[id] && !BYID[id].s && !(P.mist[id] && P.mist[id][1]) && P.q[id][1] > 0 && mLvl(id) < 3; });
    return m.concat(low).filter(function (id) { return BYID[id] && !BYID[id].s; });
  }
  var FMT = ["Grilă", "Adevărat / Fals", "Perechi", "Scrie răspunsul", "Ordonează cuvintele", "Fișă"];
  function norm(x) { return String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim(); }
  function lev(a, b) { var m = [], i, j; for (i = 0; i <= a.length; i++) { m[i] = [i]; for (j = 1; j <= b.length; j++) m[i][j] = i ? Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) : j; } return m[a.length][b.length]; }
  function fmtsFor(q) { var f = [0, 1, 2, 5]; if (q.a[0].length <= 22 && !/\d+\.\d+\.\d+/.test(q.a[0])) f.push(3); var w = q.a[0].split(/\s+/); if (w.length >= 3 && w.length <= 9) f.push(4); return f; }
  function pickFmt(q, avoid) {
    var f = fmtsFor(q), last = P.cli["mf:" + q.id] ? P.cli["mf:" + q.id] % 10 : -1;
    var c = f.filter(function (x) { return x !== last && x !== avoid; });
    var k = c[(mMiss(q.id) + mLvl(q.id) + (P.q[q.id] ? P.q[q.id][0] + P.q[q.id][1] : 0)) % c.length];
    P.cli["mf:" + q.id] = Date.now() * 10 + k; return k;
  }
  function lessonFor(q) { for (var i = 0; i < LES.length; i++) { var l = LES[i]; if (l.c === q.c && l.re && !/-R$/.test(l.id) && l.re.test(l.byE ? q.e : q.q)) return l; } return null; }
  var RV = null;
  function vRev() {
    view = "mist"; navbar(true); P.cli = P.cli || {};
    var ids = weakIds();
    if (!ids.length) { app.innerHTML = '<section class="card"><button class="back" id="backBtn">‹ Înapoi</button><h2>🧠 Exersează greșelile</h2><p>Nu ai nimic de repetat acum. 🎉 Fă o lecție sau un joc, iar ce greșești va reveni aici în alt format.</p></section>'; $("backBtn").onclick = function () { go("mist"); }; return; }
    RV = { q: ids.slice(0, 12).map(function (id) { return { q: BYID[id], tries: 0 }; }), i: 0, ok: 0, bad: 0, mini: {}, done: [] };
    app.innerHTML = '<section class="card"><button class="back" id="backBtn">‹ Înapoi</button><h2>🧠 Exersează greșelile</h2><p>' + RV.q.length + ' întrebări pe care le-ai greșit sau nu le stăpânești încă. Fiecare revine <b>în alt format</b> decât data trecută: grilă, adevărat/fals, perechi, scris, ordonare, fișă. O greșeală o trimite din nou la finalul sesiunii. După 2 greșeli primești o mini-lecție.</p><button class="big" id="rvGo">Începe</button></section>';
    $("backBtn").onclick = function () { go("mist"); }; $("rvGo").onclick = rvNext;
  }
  function rvShell(inner, it) { var tot = RV.q.length; app.innerHTML = '<section class="card rvcard"><div class="rvtop"><button class="back" id="rvX">✕ Ieși</button><span class="muted small">' + Math.min(RV.i + 1, tot) + " / " + tot + "</span>" + (it ? mDots(it.q.id) : "") + '</div><div class="pbar"><i style="width:' + Math.round(100 * RV.i / tot) + '%"></i></div>' + inner + "</section>"; $("rvX").onclick = function () { saveP(); go("mist"); }; }
  function rvNext() {
    if (RV.i >= RV.q.length) return rvEnd();
    var it = RV.q[RV.i], q = it.q;
    if (mMiss(q.id) >= 2 && !RV.mini[q.id]) { RV.mini[q.id] = 1; return rvMini(it); }
    var f = pickFmt(q, it.lastF); it.lastF = f;
    var head = '<div class="tag rvfmt">' + FMT[f] + '</div><div class="qmeta">' + CATBY[q.c].ic + " " + esc(CATBY[q.c].short) + "</div>";
    [rvMcq, rvTf, rvPair, rvType, rvOrder, rvFlash][f](it, head);
  }
  function rvMini(it) {
    var q = it.q, l = lessonFor(q), hk = typeof HACK_FIND === "function" ? HACK_HTML(HACK_FIND(q.q + " " + q.a[0] + " " + q.e, null, q)) : "";
    rvShell('<h3>📘 Mini-lecție – ai greșit asta de ' + mMiss(q.id) + ' ori</h3><div class="qq">' + esc(q.q) + '</div><div class="fact tok"><b>✅ Răspuns:</b> ' + esc(q.a[0]) + '</div><div class="fact"><b>De ce:</b> ' + esc(q.e) + "</div>" + hk + (l ? '<button class="ghost" id="rvL">Deschide lecția: ' + esc(l.t) + "</button>" : "") + '<button class="big" id="rvC">Am înțeles – încerc acum</button>', it);
    $("rvC").onclick = rvNext; if (l) $("rvL").onclick = function () { saveP(); startLesson(l); };
  }
  function rvGrade(it, ok, html) {
    var q = it.q; record(q, ok); mUpd(q.id, ok);
    if (ok) { RV.ok++; addXP(5); if (mLvl(q.id) >= 2 || !it.tries) clearMistake(q.id); SND.ok(); } else { RV.bad++; it.tries++; if (it.tries <= 2) RV.q.push({ q: q, tries: it.tries, lastF: it.lastF }); SND.bad(); }
    saveP();
    var hk = !ok && typeof HACK_FIND === "function" ? HACK_HTML(HACK_FIND(q.q + " " + q.a[0] + " " + q.e, null, q)) : "";
    var out = $("rvOut"); out.innerHTML = '<div class="' + (ok ? "fact tok" : "eli trapw") + '">' + (ok ? "✅ Corect! Stăpânire " + mLvl(q.id) + "/5" : "❌ Răspuns corect: <b>" + esc(q.a[0]) + "</b>" + (it.tries <= 2 ? " · revine la final, în alt format" : "")) + '<div class="small muted">' + esc(q.e) + "</div></div>" + hk + (html || "") + '<button class="big" id="rvN">Continuă ›</button>';
    $("rvN").onclick = function () { RV.i++; rvNext(); }; $("rvN").scrollIntoView({ block: "nearest" });
  }
  function rvMcq(it, head) {
    var q = it.q, ord = shuffle(q.a.map(function (_, i) { return i; }));
    rvShell(head + '<h3 class="rvq">' + esc(q.q) + '</h3><div class="opts">' + ord.map(function (k) { return '<button class="opt" data-k="' + k + '">' + esc(q.a[k]) + "</button>"; }).join("") + '</div><div id="rvOut"></div>', it);
    Array.prototype.forEach.call(app.querySelectorAll(".opt"), function (b) { b.onclick = function () { var ok = b.getAttribute("data-k") === "0"; Array.prototype.forEach.call(app.querySelectorAll(".opt"), function (o) { o.disabled = true; if (o.getAttribute("data-k") === "0") o.classList.add("good"); else if (o === b) o.classList.add("bad"); }); rvGrade(it, ok); }; });
  }
  function rvTf(it, head) {
    var q = it.q, truth = Math.random() < 0.5, cand = truth ? q.a[0] : q.a[1 + Math.floor(Math.random() * (q.a.length - 1))];
    rvShell(head + '<h3 class="rvq">' + esc(q.q) + '</h3><div class="swf tfstat"><small class="muted">Răspunsul de mai jos este corect?</small><p>' + esc(cand) + '</p></div><div class="row2"><button class="ghost swbtn bad" id="rvF">✗ Fals</button><button class="ghost swbtn good" id="rvA">✓ Adevărat</button></div><div id="rvOut"></div>', it);
    function ans(v) { $("rvF").disabled = $("rvA").disabled = true; rvGrade(it, v === truth); }
    $("rvF").onclick = function () { ans(false); }; $("rvA").onclick = function () { ans(true); };
  }
  function rvPair(it, head) {
    var q = it.q, others = shuffle(QS.filter(function (x) { return !x.s && x.id !== q.id && x.c === q.c && x.a[0].length < 60 && x.q.length < 140; })).slice(0, 3), set = shuffle([q].concat(others)), ans = shuffle(set.slice()), sel = null, got = {}, wrongCur = false;
    rvShell(head + '<p class="small muted">Atinge o întrebare, apoi răspunsul ei. Contează perechea întrebării tale (cea cu ★).</p><div class="pairs2"><div>' + set.map(function (x, i) { return '<button class="pq" data-i="' + i + '">' + (x === q ? "★ " : "") + esc(x.q) + "</button>"; }).join("") + "</div><div>" + ans.map(function (x, i) { return '<button class="pa" data-j="' + i + '">' + esc(x.a[0]) + "</button>"; }).join("") + '</div></div><div id="rvOut"></div>', it);
    Array.prototype.forEach.call(app.querySelectorAll(".pq"), function (b) { b.onclick = function () { if (got[b.getAttribute("data-i")]) return; Array.prototype.forEach.call(app.querySelectorAll(".pq"), function (x) { x.classList.remove("sel"); }); b.classList.add("sel"); sel = +b.getAttribute("data-i"); }; });
    Array.prototype.forEach.call(app.querySelectorAll(".pa"), function (b) { b.onclick = function () {
      if (sel === null || b.disabled) return; var j = +b.getAttribute("data-j"), ok = ans[j] === set[sel], qb = app.querySelector('.pq[data-i="' + sel + '"]');
      if (ok) { got[sel] = 1; qb.classList.add("good"); qb.classList.remove("sel"); b.classList.add("good"); b.disabled = true; SND.tap(); } else { b.classList.add("bad"); setTimeout(function () { b.classList.remove("bad"); }, 500); if (set[sel] === q) wrongCur = true; }
      sel = null; if (Object.keys(got).length === set.length) rvGrade(it, !wrongCur);
    }; });
  }
  function rvType(it, head) {
    var q = it.q, a = q.a[0];
    rvShell(head + '<h3 class="rvq">' + esc(q.q) + '</h3><p class="small muted">Scrie răspunsul (fără grija diacriticelor). Indiciu: începe cu „' + esc(a.charAt(0)) + "”, " + a.length + ' caractere.</p><form id="rvForm" class="tin" autocomplete="off"><input id="rvIn" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="Răspunsul tău"></form><button class="big" id="rvChk">Verifică</button><div id="rvOut"></div>', it);
    var done = false; function chk() { if (done) return; done = true; var v = norm($("rvIn").value), t = norm(a), ok = v === t || (t.length > 6 && lev(v, t) <= (t.length > 12 ? 2 : 1)); $("rvIn").disabled = true; $("rvChk").remove(); rvGrade(it, ok); }
    $("rvForm").onsubmit = function (e) { e.preventDefault(); chk(); }; $("rvChk").onclick = chk; $("rvIn").focus();
  }
  function rvOrder(it, head) {
    var q = it.q, w = q.a[0].split(/\s+/), pool = shuffle(w.map(function (x, i) { return i; })), got = [];
    if (pool.every(function (x, i) { return x === i; })) pool.reverse();
    function paint() {
      rvShell(head + '<h3 class="rvq">' + esc(q.q) + '</h3><p class="small muted">Atinge cuvintele în ordine ca să formezi răspunsul corect.</p><div class="wline">' + got.map(function (i, k) { return '<button class="wchip on" data-r="' + k + '">' + esc(w[i]) + "</button>"; }).join("") + '</div><div class="wpool">' + pool.filter(function (i) { return got.indexOf(i) < 0; }).map(function (i) { return '<button class="wchip" data-a="' + i + '">' + esc(w[i]) + "</button>"; }).join("") + '</div><div id="rvOut"></div>', it);
      Array.prototype.forEach.call(app.querySelectorAll("[data-a]"), function (b) { b.onclick = function () { got.push(+b.getAttribute("data-a")); SND.tap(); if (got.length === w.length) { paint(); Array.prototype.forEach.call(app.querySelectorAll(".wchip"), function (x) { x.disabled = true; }); rvGrade(it, got.map(function (i) { return w[i]; }).join(" ") === w.join(" ")); } else paint(); }; });
      Array.prototype.forEach.call(app.querySelectorAll("[data-r]"), function (b) { b.onclick = function () { got.splice(+b.getAttribute("data-r"), 1); paint(); }; });
    }
    paint();
  }
  function rvFlash(it, head) {
    var q = it.q;
    rvShell(head + '<div class="fcard2" id="rvFc"><div class="fcin"><div class="fcf"><small class="muted">Gândește-te la răspuns, apoi întoarce fișa</small><p>' + esc(q.q) + '</p></div><div class="fcb"><b>' + esc(q.a[0]) + '</b><p class="small muted">' + esc(q.e) + '</p></div></div></div><button class="big" id="rvFlip">Întoarce fișa</button><div class="row2 hidden" id="rvSelf"><button class="ghost swbtn bad" id="rvNo">Nu știam</button><button class="ghost swbtn good" id="rvYes">Știam</button></div><div id="rvOut"></div>', it);
    $("rvFlip").onclick = function () { $("rvFc").classList.add("flip"); this.remove(); $("rvSelf").classList.remove("hidden"); };
    $("rvYes").onclick = function () { $("rvSelf").remove(); rvGrade(it, true); }; $("rvNo").onclick = function () { $("rvSelf").remove(); rvGrade(it, false); };
  }
  function rvEnd() {
    saveP(); P.cli["g:rev"] = Date.now(); saveP();
    var seen = {}, list = RV.q.filter(function (x) { if (seen[x.q.id]) return false; seen[x.q.id] = 1; return true; });
    app.innerHTML = '<section class="card"><h2>🧠 Sesiune terminată</h2><div class="gend"><b>' + RV.ok + "/" + (RV.ok + RV.bad) + '</b><span>răspunsuri corecte</span></div>' + list.map(function (x) { return '<div class="crow2"><div><small>' + esc(x.q.q.slice(0, 90)) + "</small></div>" + mDots(x.q.id) + "</div>"; }).join("") + '<p class="muted small">Rămase de repetat: ' + activeMistakes().length + '</p><button class="big" id="rvAg">Încă o sesiune</button><button class="ghost" id="rvBk">Înapoi la greșeli</button></section>';
    $("rvAg").onclick = vRev; $("rvBk").onclick = function () { go("mist"); };
  }
