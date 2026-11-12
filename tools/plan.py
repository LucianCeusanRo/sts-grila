p='public/app.js';s=open(p).read()
a=s.index('  var PLAN = ['); b=s.index('  ];',a)+5
new='''  /* Punctele slabe (Rețele/subnetare, Electricitate/măsurători, Antene/radio) sunt primele și primesc mai multe zile + exersare suplimentară. */
  var XSUB = [["trainer", "Antrenor subnetting (exerciții nelimitate)"], ["gen", "Grilă subnetting generată – 10 întrebări"]];
  var PLAN = [
    { t: "Rețele I: ce e o rețea, tipuri, topologii, OSI, Ethernet + cabluri", weak: 1, les: R_("net", 1, 5).concat(R_("cab", 1, 4)), test: { cats: ["net", "cab"], n: 25 }, x: [["prac", "Exersare suplimentară Rețele – 20 întrebări", ["net"], 20], ["cards", "Fișe rapide: Rețele", "net"]] },
    { t: "Rețele II: IPv4, ARP/DHCP/DNS, TCP/UDP, NAT + primii pași în subnetare", weak: 1, les: R_("net", 6, 9).concat(R_("sub", 1, 2)), test: { cats: ["net", "sub"], n: 30 }, x: XSUB.concat([["prac", "Exersare suplimentară Rețele – 20 întrebări", ["net"], 20]]) },
    { t: "Subnetare și VLSM + rutare (Cisco IOS, routere)", weak: 1, les: R_("sub", 3, 4).concat(["sub-R"], R_("net", 10, 11)), test: { cats: ["sub", "net"], n: 30 }, x: XSUB.concat([["cards", "Fișe rapide: Subnetting", "sub"]]) },
    { t: "Rețele III: VLAN, IPv6, wireless + recapitulare Rețele; Electricitate de la zero", weak: 1, les: R_("net", 12, 14).concat(["net-R"], R_("el", 1, 3)), test: { cats: ["net", "sub", "el"], n: 35 }, x: XSUB.concat([["prac", "Exersare suplimentară Electricitate – 20 întrebări", ["el"], 20]]) },
    { t: "Electricitate I: U, I, R, unități, serie/paralel, legea lui Ohm, putere, DC/AC", weak: 1, les: R_("el", 4, 9), test: { cats: ["el"], n: 30 }, x: [["prac", "Exersare suplimentară Electricitate – 20 întrebări", ["el"], 20], ["cards", "Fișe rapide: Electricitate", "el"]] },
    { t: "Electricitate II + Măsurători: trifazat, surse/UPS/PoE, multimetru, dB/dBm", weak: 1, les: R_("el", 10, 12).concat(["el-R"], R_("mas", 1, 3), ["mas-R"]), test: { cats: ["el", "mas"], n: 30 }, x: [["prac", "Exersare suplimentară Electricitate + Măsurători – 20", ["el", "mas"], 20], ["cards", "Fișe rapide: Măsurători", "mas"]] },
    { t: "Antene și radio I: unda radio, benzi, TX/RX, tipuri de antene, dB/dBm, câștig, polarizare", weak: 1, les: R_("ant", 1, 7), test: { cats: ["ant"], n: 30 }, x: [["prac", "Exersare suplimentară Antene – 20 întrebări", ["ant"], 20], ["cards", "Fișe rapide: Antene și radio", "ant"]] },
    { t: "Antene și radio II: coaxial și conectori, VSWR/ROS, Fresnel, buget, TETRA, proceduri, siguranță", weak: 1, les: R_("ant", 8, 14).concat(["ant-R"]), test: { cats: ["ant", "mas"], n: 30 }, x: [["prac", "Exersare suplimentară Antene + Măsurători – 20", ["ant", "mas"], 20]] },
    { t: "Munca la STS: 112, rack, PC/terminale, switch Cisco, SIM/APN, TETRA, antene, migrare", les: R_("sts", 1, 8).concat(["sts-R"]), test: { cats: ["sts", "net", "ant"], n: 30 }, x: [["cards", "Fișe rapide: Munca la STS", "sts"]] },
    { t: "Fibră optică, telefonie și cablare structurată (ritm mai rapid)", les: R_("fo", 1, 6).concat(R_("tel", 1, 3), R_("cab", 5, 8)), test: { cats: ["fo", "tel", "cab"], n: 30 } },
    { t: "Calculatoare, Windows, VoIP/radio/satelit (ritm mai rapid)", les: R_("pc", 1, 6).concat(R_("win", 1, 6), R_("extra", 1, 3)), test: { cats: ["pc", "win", "extra"], n: 30 } },
    { t: "Recapitulare: capitolele rapide + test mare pe punctele slabe", weak: 1, les: ["fo-R", "cab-R", "tel-R", "pc-R", "win-R", "extra-R"], test: { cats: ["net", "sub", "el", "mas", "ant", "sts"], n: 50 }, x: XSUB.concat([["go", "Recapitulează „Greșelile mele”", "mist"]]) },
    { t: "Simulare completă de examen #1 + greșelile mele", les: [], exam: 50 },
    { t: "Simulare completă de examen #2 + întrebările marcate", les: [], exam: 50 }
  ];
'''
s=s[:a]+new+s[b:]
# extras rendering
s=s.replace('''      else h += '<button class="ptask' + (st.tok ? " ok" : "") + '" data-pt="' + d + '"><span>' + (st.tok ? "✅" : "🎯") + "</span>Testul zilei: " + p.test.n + " întrebări, minim 70%" + (st.tp ? " · cel mai bun: " + st.tp + "%" : "") + "</button>";''','''      else h += '<button class="ptask' + (st.tok ? " ok" : "") + '" data-pt="' + d + '"><span>' + (st.tok ? "✅" : "🎯") + "</span>Testul zilei: " + p.test.n + " întrebări, minim 70%" + (st.tp ? " · cel mai bun: " + st.tp + "%" : "") + "</button>";
      if (p.x) { h += '<div class="pxh">Exersare în plus (opțional)</div>'; p.x.forEach(function (x, i) { h += '<button class="ptask px" data-px="' + d + "-" + i + '"><span>➕</span>' + esc(x[1]) + "</button>"; }); }''')
s=s.replace('''<b>Ziua ' + d + " · " + fmtDay(dayDate(d)) + (d === pi.idx ? ' <i class="tag">AZI</i>' : "") + "</b>''','''<b>Ziua ' + d + " · " + fmtDay(dayDate(d)) + (d === pi.idx ? ' <i class="tag">AZI</i>' : "") + (p.weak ? ' <i class="tag weak">punct slab</i>' : "") + "</b>''')
s=s.replace('''    Array.prototype.forEach.call(root.querySelectorAll("[data-go]"), function (b) { b.onclick = function () { go(b.getAttribute("data-go")); }; });
    Array.prototype.forEach.call(root.querySelectorAll("[data-md]")''','''    Array.prototype.forEach.call(root.querySelectorAll("[data-go]"), function (b) { b.onclick = function () { go(b.getAttribute("data-go")); }; });
    Array.prototype.forEach.call(root.querySelectorAll("[data-px]"), function (b) { b.onclick = function () { var k = b.getAttribute("data-px").split("-"); planExtra(PLAN[+k[0] - 1].x[+k[1]]); }; });
    Array.prototype.forEach.call(root.querySelectorAll("[data-md]")''',1)
s=s.replace('''  function planDayHtml(d, open) {''','''  function planExtra(x) {
    SND.tap();
    if (x[0] === "trainer") return go("trainer");
    if (x[0] === "gen") { var it = []; for (var i = 0; i < 10; i++) it.push(SUB.question(SET.diff || 2)); return runQuiz({ mode: "practice", items: it, hearts: 0, requeue: false, xpEach: 5, title: "Subnetting" }); }
    if (x[0] === "prac") return runQuiz({ mode: "practice", items: pickQuestions(QS.filter(function (q) { return x[2].indexOf(q.c) >= 0; }), x[3]), hearts: 0, requeue: false, xpEach: 5, title: "Exersare suplimentară" });
    if (x[0] === "cards") return startCards([x[2]]);
    if (x[0] === "go") return go(x[2]);
  }
  function planDayHtml(d, open) {''')
open(p,'w').write(s); print('ok')
