/* Îmbinarea progresului (folosit și în browser, și în funcțiile Netlify). */
(function (root) {
  function obj(x) { return x && typeof x === "object" && !Array.isArray(x) ? x : {}; }
  function num(x) { return typeof x === "number" && isFinite(x) ? x : 0; }
  function empty() { return { v: 2, days: {}, lessons: {}, q: {}, mist: {}, bm: {}, fc: {}, plan: { exam: "", et: 0, done: {}, tests: {} }, exams: [], best: 0, sub: [0, 0], t: 0 }; }
  function merge(a, b) {
    a = obj(a); b = obj(b);
    var r = empty(), k;
    var da = obj(a.days), db = obj(b.days);
    for (k in da) r.days[k] = num(da[k]);
    for (k in db) r.days[k] = Math.max(num(r.days[k]), num(db[k]));
    var la = obj(a.lessons), lb = obj(b.lessons);
    var keys = Object.keys(la).concat(Object.keys(lb));
    keys.forEach(function (id) {
      var x = obj(la[id]), y = obj(lb[id]);
      r.lessons[id] = { s: Math.max(num(x.s), num(y.s)), b: Math.max(num(x.b), num(y.b)), n: Math.max(num(x.n), num(y.n)), t: Math.max(num(x.t), num(y.t)) };
    });
    var qa = obj(a.q), qb = obj(b.q);
    Object.keys(qa).concat(Object.keys(qb)).forEach(function (id) {
      var x = Array.isArray(qa[id]) ? qa[id] : null, y = Array.isArray(qb[id]) ? qb[id] : null;
      if (!x) { r.q[id] = y; return; } if (!y) { r.q[id] = x; return; }
      var sx = num(x[0]) + num(x[1]), sy = num(y[0]) + num(y[1]);
      r.q[id] = sx > sy ? x : sy > sx ? y : (num(x[2]) >= num(y[2]) ? x : y);
    });
    var ma = obj(a.mist), mb = obj(b.mist);
    Object.keys(ma).concat(Object.keys(mb)).forEach(function (id) {
      var x = Array.isArray(ma[id]) ? ma[id] : null, y = Array.isArray(mb[id]) ? mb[id] : null;
      r.mist[id] = !x ? y : !y ? x : (num(x[0]) >= num(y[0]) ? x : y);
    });
    var ba = obj(a.bm), bb = obj(b.bm);
    Object.keys(ba).concat(Object.keys(bb)).forEach(function (id) {
      var x = Array.isArray(ba[id]) ? ba[id] : null, y = Array.isArray(bb[id]) ? bb[id] : null;
      r.bm[id] = !x ? y : !y ? x : (num(x[0]) >= num(y[0]) ? x : y);
    });
    var fa = obj(a.fc), fb = obj(b.fc);
    Object.keys(fa).concat(Object.keys(fb)).forEach(function (id) {
      var x = Array.isArray(fa[id]) ? fa[id] : null, y = Array.isArray(fb[id]) ? fb[id] : null;
      r.fc[id] = !x ? y : !y ? x : (num(x[2]) >= num(y[2]) ? x : y);
    });
    var pa = obj(a.plan), pb = obj(b.plan);
    var newer = num(pa.et) >= num(pb.et) ? pa : pb;
    r.plan.exam = typeof newer.exam === "string" ? newer.exam : (pa.exam || pb.exam || "");
    r.plan.et = Math.max(num(pa.et), num(pb.et));
    [["done"], ["tests"]].forEach(function (f) {
      var x = obj(pa[f[0]]), y = obj(pb[f[0]]), o = r.plan[f[0]];
      for (var kk in x) o[kk] = num(x[kk]);
      for (kk in y) o[kk] = Math.max(num(o[kk]), num(y[kk]));
    });
    var seen = {};
    (Array.isArray(a.exams) ? a.exams : []).concat(Array.isArray(b.exams) ? b.exams : []).forEach(function (e) {
      e = obj(e); if (!e.t || seen[e.t]) return; seen[e.t] = 1; r.exams.push(e);
    });
    r.exams.sort(function (x, y) { return x.t - y.t; });
    if (r.exams.length > 100) r.exams = r.exams.slice(-100);
    var ca = obj(a.cli), cb = obj(b.cli); r.cli = {};
    for (k in ca) r.cli[k] = num(ca[k]);
    for (k in cb) r.cli[k] = Math.max(num(r.cli[k]), num(cb[k]));
    var la2 = obj(a.lb), lb2 = obj(b.lb), lw = num(la2.t) >= num(lb2.t) ? la2 : lb2;
    if (lw.t) r.lb = { on: !!lw.on, name: String(lw.name || "").slice(0, 24), t: num(lw.t) };
    /* XP pe dispozitiv și zi („dispozitiv|zi”): două dispozitive în aceeași zi se adună, nu se suprascriu */
    var xa = obj(a.dd), xb = obj(b.dd); r.dd = {};
    for (k in xa) r.dd[k] = num(xa[k]);
    for (k in xb) r.dd[k] = Math.max(num(r.dd[k]), num(xb[k]));
    var sum = {};
    for (k in r.dd) { var dy = k.split("|")[1]; if (dy) sum[dy] = (sum[dy] || 0) + r.dd[k]; }
    for (k in sum) r.days[k] = Math.max(num(r.days[k]), sum[k]);
    r.best = Math.max(num(a.best), num(b.best));
    var pa = obj(a.place), pb = obj(b.place); r.place = num(pb.t) > num(pa.t) ? pb : pa; if (!r.place.t) r.place = null;
    var sa = Array.isArray(a.sub) ? a.sub : [0, 0], sb = Array.isArray(b.sub) ? b.sub : [0, 0];
    r.sub = num(sa[0]) + num(sa[1]) >= num(sb[0]) + num(sb[1]) ? [num(sa[0]), num(sa[1])] : [num(sb[0]), num(sb[1])];
    r.t = Math.max(num(a.t), num(b.t));
    return r;
  }
  merge.empty = empty;
  if (typeof module !== "undefined" && module.exports) module.exports = merge; else root.mergeProgress = merge;
})(this);
