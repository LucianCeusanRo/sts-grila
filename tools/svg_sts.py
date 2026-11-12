p='learn/00-svg.js';s=open(p).read()
if 'S.rack' in s: raise SystemExit('already')
new=r'''
  /* ---- munca la STS ---- */
  S.rack = function () {
    var g = r(20, 10, 200, 290, "#1f2937", { rx: 4 }) + r(30, 18, 180, 274, "#111827", { rx: 2 });
    var items = [["patch panel 24 porturi", "#e5e7eb", 1], ["organizator cabluri", "#6b7280", 1], ["SWITCH 24/48 porturi", "#2563eb", 1], ["patch panel fibră (ODF)", "#fde68a", 1], ["organizator cabluri", "#6b7280", 1], ["SWITCH", "#2563eb", 1], ["ROUTER / firewall", "#16a34a", 1], ["", "#111827", 2], ["SERVER", "#475569", 2], ["", "#111827", 1], ["UPS (acumulatori)", "#b91c1c", 3]];
    var y = 22;
    items.forEach(function (it) { var h = it[2] * 20; if (it[0]) { g += r(34, y, 172, h - 2, it[1], { rx: 2 }) + t(120, y + h / 2 + 3, it[0], { s: 9.5, w: 700, f: it[1] === "#e5e7eb" || it[1] === "#fde68a" ? "#111827" : "#fff" }); if (/patch|SWITCH/.test(it[0])) for (var k = 0; k < 12; k++) g += r(40 + k * 13.5, y + 3, 9, 5, "#111827", { rx: 1 }); } y += h; });
    g += l(20, 300, 20, 312, "#14213d") + l(220, 300, 220, 312, "#14213d") + t(120, 324, "lățime de montaj 19\" (482,6 mm)", { s: 10, w: 700 });
    g += t(335, 30, "Rack-ul de 19\"", { s: 14, w: 800 });
    var tx = ["1U = 1,75\" = 44,45 mm înălțime", "Rack-uri uzuale: 42U, 24U, 12U (de perete)", "Sus: patch panel + organizator + switch", "Jos: echipamente grele (UPS, servere)", "Cablurile: etichetate la ambele capete", "Rack-ul se leagă la bara de împământare", "Aer rece prin față, aer cald prin spate", "PDU = prelungitorul de rack"];
    tx.forEach(function (x, i) { g += t(240, 60 + i * 24, "• " + x, { a: "start", s: 10.5 }); });
    return W("0 0 490 332", g, "Un rack de comunicații tipic (vedere din față)");
  };
  S.e112 = function () {
    var g = arrowDef;
    function box(x, y, w, a, b, f) { return r(x, y, w, 46, f, { st: "#475569" }) + t(x + w / 2, y + 20, a, { s: 10.5, w: 800 }) + t(x + w / 2, y + 36, b, { s: 9 }); }
    g += box(5, 20, 100, "Cetățean", "sună / SMS la 112", "#f1f5f9") + ar(105, 43, 140, 43);
    g += box(140, 20, 120, "Centrul 112", "preia apelul, localizează", "#fde68a") + ar(260, 43, 300, 43);
    g += box(300, 8, 175, "Dispecerat ISU-SMURD-Ambulanță", "", "#fecaca") + box(300, 58, 175, "Dispecerat Poliție / Jandarmi", "", "#bfdbfe");
    g += ar(390, 104, 390, 140) + box(270, 140, 205, "Echipaje în teren", "radio TETRA + tablete (date mobile)", "#bbf7d0");
    g += r(5, 110, 250, 76, "#eff6ff", { st: "#1d4ed8" }) + t(130, 128, "STS administrează sistemul 112 (SNUAU)", { s: 10, w: 800 }) + t(130, 146, "și platforma radio TETRA folosită de", { s: 10 }) + t(130, 162, "Poliție, ISU/SMURD, Ambulanță, Jandarmerie", { s: 10 }) + t(130, 178, "(rețele de date WAN, radio, centre de date)", { s: 9, f: "#475569" });
    return W("0 0 480 196", g, "Drumul unei urgențe: de la apelul 112 la echipajul din teren (informații publice)");
  };
'''
s=s.replace("  S.tir = S.fiber;\n", new+"  S.tir = S.fiber;\n")
open(p,'w').write(s); print('ok')
