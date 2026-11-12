  /* ---------- Progres total (0–100%) și clasament ---------- */
  function completion() {
    var it = [];
    LES.forEach(function (l) { it.push(["Lecție: " + l.t, isDone(l.id)]); });
    CLI_TASKS.forEach(function (t) { if (t.g.length) it.push(["Terminal: " + t.t, !!(P.cli && P.cli[t.id])]); });
    gKeys().forEach(function (k) { it.push(["Joc: " + k, !!(P.cli && P.cli[k])]); });
    it.push(["Joc: ordinea firelor RJ45", !!(P.cli && P.cli["g:rj"])], ["Joc: multimetru (toate scenariile)", !!(P.cli && P.cli["g:mm"])]);
    [1, 2, 3].forEach(function (v) { it.push(["Simulare teorie: Subiectul " + v, P.exams.some(function (e) { return e.k === "sim" && e.s === "Subiectul " + v; })]); it.push(["Simulare practică: Varianta " + v, !!(P.cli && P.cli["prac" + v])]); });
    var d = it.filter(function (x) { return x[1]; }).length;
    return { done: d, total: it.length, pct: Math.floor(1000 * d / it.length) / 10, items: it };
  }
  var lbLast = 0;
  function lbPush(force) {
    if (!AUTH || !P.lb || (!force && Date.now() - lbLast < 60000)) return Promise.resolve();
    lbLast = Date.now(); var c = completion();
    return api("POST", "/api/board", { on: !!P.lb.on, name: P.lb.name, pct: c.pct, xp: xpTotal(), done: c.done, total: c.total }).catch(function () {});
  }
  function vBoard() {
    view = "stats"; navbar(true);
    var c = completion(), lb = P.lb || { on: false, name: "", t: 0 };
    var h = '<section class="card"><button class="back" id="backBtn">‹ Statistici</button><h2>🏆 Clasament</h2><div class="gend"><b>' + String(c.pct).replace(".", ",") + '%</b><span>din tot site-ul (' + c.done + " / " + c.total + ' lecții, jocuri, terminale, simulări)</span></div>';
    if (!AUTH) { h += '<p>Clasamentul e privat: apar doar conturile de pe acest site care aleg să participe, cu numele afișat ales de ele. Autentifică-te în tabul Cont ca să participi.</p><button class="big" id="toAcct">Mergi la Cont</button></section>'; app.innerHTML = h; $("backBtn").onclick = function () { go("stats"); }; $("toAcct").onclick = function () { go("acct"); }; return; }
    h += '<label class="wr2"><input type="checkbox" id="lbOn"' + (lb.on ? " checked" : "") + '> Vreau să apar în clasament (opțional)</label><label class="tform"><span>Nume afișat</span><input id="lbName" maxlength="24" value="' + esc(lb.name || AUTH.user) + '"></label><button class="big" id="lbSave">Salvează</button><div id="lbList"><p class="muted">Se încarcă…</p></div></section>';
    h += '<section class="card"><h2>Ce mai ai de făcut</h2>' + c.items.filter(function (x) { return !x[1]; }).slice(0, 40).map(function (x) { return '<div class="small">○ ' + esc(x[0]) + "</div>"; }).join("") + (c.total - c.done > 40 ? '<div class="small muted">… și încă ' + (c.total - c.done - 40) + "</div>" : "") + (c.done === c.total ? '<p class="okc"><b>Totul e terminat – 100%! 🎖️</b></p>' : "") + "</section>";
    app.innerHTML = h; $("backBtn").onclick = function () { go("stats"); };
    function load() { api("GET", "/api/board").then(function (r) { $("lbList").innerHTML = r.rows.length ? '<ol class="lbl">' + r.rows.map(function (x, i) { return '<li class="' + (x.me ? "me" : "") + '"><span class="lbn">' + (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (i + 1) + ".") + "</span><b>" + esc(x.name) + "</b><span>" + String(x.pct).replace(".", ",") + "% · " + x.xp + " XP</span></li>"; }).join("") + "</ol>" : '<p class="muted">Nimeni în clasament încă. Bifează mai sus ca să apari.</p>'; }).catch(function (e) { $("lbList").innerHTML = '<p class="muted">Clasamentul nu se poate încărca acum (' + esc(e.message) + ").</p>"; }); }
    $("lbSave").onclick = function () { P.lb = { on: $("lbOn").checked, name: $("lbName").value.trim().slice(0, 24) || AUTH.user, t: Date.now() }; saveP(); lbPush(true).then(function () { toast(P.lb.on ? "Apari în clasament ✓" : "Nu mai apari în clasament."); load(); }); };
    if (lb.on) lbPush(true).then(load); else load();
  }
