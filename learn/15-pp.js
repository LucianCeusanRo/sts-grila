/* ===== PROBA PRACTICĂ – scenarii de examen, pas cu pas (conținut original) ===== */
(function () {
  function W(vb, inner, title) { return '<figure class="dia"><svg viewBox="' + vb + '" role="img" aria-label="' + (title || "diagramă") + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12">' + inner + "</svg>" + (title ? "<figcaption>" + title + "</figcaption>" : "") + "</figure>"; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 11) + '" font-weight="' + (o.w || 700) + '"' + (o.ff ? ' font-family="' + o.ff + '"' : "") + ">" + s + "</text>"; }
  function r(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 5 : o.rx) + '" fill="' + f + '" stroke="' + (o.st || "#334155") + '" stroke-width="' + (o.sw || 1.2) + '"/>'; }
  function ln(x1, y1, x2, y2, c, w, o) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="' + (w || 2) + '"' + (o || "") + "/>"; }
  var B = [["#fff", "#f97316", "alb-portocaliu"], ["#f97316", 0, "portocaliu"], ["#fff", "#16a34a", "alb-verde"], ["#2563eb", 0, "albastru"], ["#fff", "#2563eb", "alb-albastru"], ["#16a34a", 0, "verde"], ["#fff", "#92400e", "alb-maro"], ["#92400e", 0, "maro"]];
  var A568 = [B[2], B[5], B[0], B[3], B[4], B[1], B[6], B[7]];
  function wireV(x, y1, y2, c) { var s = ln(x, y1, x, y2, c[0], 7, ' stroke-linecap="butt"'); if (c[1]) s += ln(x, y1, x, y2, c[1], 7, ' stroke-dasharray="5 5"'); return s + ln(x - 3.5, y1, x - 3.5, y2, "#64748b", 0.6) + ln(x + 3.5, y1, x + 3.5, y2, "#64748b", 0.6); }
  var GR = '<defs><linearGradient id="gMet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e5e7eb"/><stop offset=".5" stop-color="#9ca3af"/><stop offset="1" stop-color="#4b5563"/></linearGradient><linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f87171"/><stop offset="1" stop-color="#b91c1c"/></linearGradient><linearGradient id="gBeige" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fefce8"/><stop offset="1" stop-color="#d6d3c4"/></linearGradient><linearGradient id="gYel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde047"/><stop offset="1" stop-color="#ca8a04"/></linearGradient><radialGradient id="gKnob" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#4b5563"/><stop offset="1" stop-color="#111827"/></radialGradient></defs>';

  SVG.crimper = function () {
    var g = GR;
    g += '<path d="M150 70 L440 40 L446 58 L160 96 Z" fill="url(#gRed)" stroke="#7f1d1d"/><path d="M150 100 L440 128 L434 146 L156 120 Z" fill="url(#gRed)" stroke="#7f1d1d"/>';
    g += '<path d="M30 52 L170 60 L176 132 L30 140 Q14 96 30 52 Z" fill="url(#gMet)" stroke="#374151" stroke-width="1.5"/>';
    g += r(48, 70, 30, 22, "#1f2937", { rx: 2, st: "#111" }) + t(63, 104, "8P (RJ45)", { s: 8.5, f: "#f8fafc" }) + r(92, 74, 22, 18, "#1f2937", { rx: 2, st: "#111" }) + t(103, 104, "6P", { s: 8.5, f: "#f8fafc" });
    g += r(128, 64, 30, 8, "#d1d5db", { rx: 1 }) + t(143, 60, "lamă tăiere", { s: 8, f: "#334155" }) + r(128, 120, 30, 8, "#d1d5db", { rx: 1 }) + t(143, 140, "dezizolare", { s: 8, f: "#334155" });
    g += '<circle cx="170" cy="96" r="7" fill="#6b7280" stroke="#111"/>';
    g += t(300, 24, "Clește de sertizat RJ45: cavitatea 8P presează contactele", { s: 10.5 }) + t(300, 166, "Strângi până la capăt: clichetul se eliberează doar după sertizare completă", { s: 9.5, w: 400 });
    return W("0 0 480 175", g, "Cleștele de sertizat (ilustrație)");
  };
  SVG.rj45pin = function () {
    var g = GR, i;
    function plug(x0, arr, lbl) {
      var s = '<path d="M' + x0 + ' 40 h120 v70 h-20 v12 h-80 v-12 h-20 z" fill="rgba(186,230,253,.5)" stroke="#0369a1" stroke-width="1.5"/>' + r(x0 + 40, 122, 40, 12, "#bae6fd", { st: "#0369a1", rx: 2 }) + t(x0 + 60, 148, "clema – în jos", { s: 8.5, f: "#0369a1" });
      for (i = 0; i < 8; i++) { var x = x0 + 11 + i * 14; s += r(x - 4, 44, 8, 8, "url(#gYel)", { rx: 1, st: "#a16207", sw: 0.6 }) + wireV(x, 54, 108, arr[i]) + t(x, 38, i + 1, { s: 9 }); }
      return s + t(x0 + 60, 18, lbl, { s: 11 });
    }
    g += plug(30, B, "T568B (cel mai folosit)") + plug(250, A568, "T568A");
    g += t(240, 172, "Contactele spre tine, clema în jos → pinul 1 e în stânga", { s: 10 });
    return W("0 0 480 180", g, "Ordinea firelor în mufă (vedere din față)");
  };
  SVG.tester = function () {
    var g = GR, i;
    function box(x, lbl) { var s = r(x, 20, 150, 120, "url(#gBeige)", { rx: 10, st: "#78716c" }) + t(x + 75, 40, lbl, { s: 10.5 }) + r(x + 55, 112, 40, 22, "#374151", { rx: 3 }) + t(x + 75, 106, "RJ45", { s: 8, f: "#57534e" }); for (i = 0; i < 9; i++) { s += '<circle cx="' + (x + 15 + i * 15) + '" cy="70" r="5.5" fill="' + (i < 8 ? "#22c55e" : "#d1d5db") + '" stroke="#166534"/>' + t(x + 15 + i * 15, 88, i < 8 ? i + 1 : "G", { s: 8.5 }); } return s; }
    g += box(20, "MASTER (cu baterie)") + box(310, "REMOTE");
    g += '<path d="M95 134 C95 170 385 170 385 134" fill="none" stroke="#94a3b8" stroke-width="6"/>';
    g += t(240, 60, "drept: 1→1 … 8→8", { s: 10, f: "#15803d" }) + t(240, 78, "crossover: 1↔3, 2↔6", { s: 9.5, f: "#7c3aed" }) + t(240, 96, "rollover: 1→8 … 8→1", { s: 9.5, f: "#b45309" }) + t(240, 114, "LED stins = fir întrerupt", { s: 9.5, f: "#b91c1c" });
    return W("0 0 480 175", g, "Testerul de cablu: LED-urile se aprind pe rând pe ambele unități");
  };
  SVG.mmDial = function () {
    var g = GR, cx = 160, cy = 156, R = 54;
    g += r(60, 10, 200, 260, "url(#gYel)", { rx: 18, st: "#854d0e" }) + r(72, 22, 176, 236, "#1f2937", { rx: 12, st: "#111" });
    g += r(88, 34, 144, 52, "#cbd5c0", { rx: 4, st: "#4b5563" }) + t(222, 72, "230.4", { s: 30, a: "end", ff: "monospace", f: "#111827" }) + t(98, 48, "AC", { s: 9, a: "start", f: "#111827" }) + t(222, 82, "V", { s: 10, a: "end", f: "#111827" });
    var pos = [["OFF", -90], ["V~", -50], ["V⎓", -15], ["mV", 15], ["Ω", 45], ["•)))", 80], ["mA", 130], ["A⎓", 165], ["A~", 200]];
    pos.forEach(function (p) { var a = p[1] * Math.PI / 180, x = cx + Math.cos(a) * (R + 12), y = cy + Math.sin(a) * (R + 12); g += t(x.toFixed(1), (y + 4).toFixed(1), p[0], { s: 10.5, f: p[0] === "V~" ? "#fde047" : "#e5e7eb" }); });
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R - 6) + '" fill="url(#gKnob)" stroke="#000"/>';
    var a = -50 * Math.PI / 180; g += ln(cx, cy, (cx + Math.cos(a) * (R - 10)).toFixed(1), (cy + Math.sin(a) * (R - 10)).toFixed(1), "#fde047", 5, ' stroke-linecap="round"');
    var jx = [92, 132, 172, 212], jl = ["10A", "mA", "COM", "VΩ"], jc = ["#dc2626", "#dc2626", "#111827", "#dc2626"];
    jx.forEach(function (x, i) { g += '<circle cx="' + x + '" cy="246" r="9" fill="#000" stroke="' + jc[i] + '" stroke-width="3"/>' + t(x, 233, jl[i], { s: 9, f: "#e5e7eb" }); });
    g += '<path d="M172 255 C180 292 300 284 330 244" fill="none" stroke="#111827" stroke-width="4"/><path d="M212 255 C230 300 360 300 400 234" fill="none" stroke="#dc2626" stroke-width="4"/>';
    g += t(370, 60, "Priză 230 V AC:", { s: 11 }) + t(370, 78, "selector pe V~", { s: 10, w: 400 }) + t(370, 94, "negru → COM", { s: 10, w: 400 }) + t(370, 110, "roșu → VΩ", { s: 10, w: 400 }) + t(370, 134, "NICIODATĂ în 10A/mA", { s: 10, f: "#b91c1c" }) + t(370, 150, "când măsori tensiune!", { s: 10, f: "#b91c1c" });
    return W("0 0 480 300", g, "Multimetrul: selectorul și bornele (ilustrație)");
  };
  SVG.iosModes = function () {
    var g = "", y = [30, 82, 134, 186], p = ["Switch>", "Switch#", "Switch(config)#", "Switch(config-if)#"], n = ["utilizator (doar show)", "privilegiat (show, copy, reload)", "configurare globală", "configurare interfață"], c = ["#e2e8f0", "#bfdbfe", "#fde68a", "#bbf7d0"], up = ["enable", "configure terminal", "interface fa0/1"];
    for (var i = 0; i < 4; i++) { g += r(20 + i * 30, y[i] - 18, 190, 34, c[i]) + t(30 + i * 30, y[i] + 4, p[i], { s: 12, a: "start", ff: "monospace" }) + t(230 + i * 30, y[i] + 4, n[i], { s: 9.5, a: "start", w: 400 }); if (i < 3) g += t(150 + i * 30, y[i] + 32, "↓ " + up[i], { s: 10, a: "start", f: "#1d4ed8", ff: "monospace" }); }
    g += t(240, 222, "exit = un nivel în sus · end (Ctrl+Z) = direct la # · disable = la >", { s: 9, f: "#b45309" });
    return W("0 0 480 230", g, "Modurile Cisco IOS și cum treci dintr-unul în altul");
  };
  SVG.straightCross = function () {
    var g = "", i;
    function col(x, arr, lbl) { var s = t(x, 16, lbl, { s: 10 }); for (var k = 0; k < 8; k++) { s += r(x - 18, 26 + k * 16, 36, 12, arr[k][0], { rx: 2, st: "#64748b" }) + (arr[k][1] ? '<rect x="' + (x - 18) + '" y="' + (31 + k * 16) + '" width="36" height="3" fill="' + arr[k][1] + '"/>' : "") + t(x - 26, 36 + k * 16, k + 1, { s: 9, a: "end" }); } return s; }
    g += col(40, B, "B") + col(160, B, "B") + col(300, A568, "A") + col(430, B, "B");
    for (i = 0; i < 8; i++) g += ln(58, 32 + i * 16, 142, 32 + i * 16, "#94a3b8", 1.5);
    var map = [2, 5, 0, 3, 4, 1, 6, 7];
    for (i = 0; i < 8; i++) g += ln(318, 32 + i * 16, 412, 32 + map.indexOf(i) * 16 + 0, i === 0 || i === 1 || i === 2 || i === 5 ? "#dc2626" : "#94a3b8", 1.5);
    g += t(100, 168, "DREPT (B–B): PC–switch, switch–router", { s: 9.5 }) + t(365, 168, "CROSSOVER (A–B): PC–PC, switch–switch", { s: 9.5, f: "#b91c1c" });
    return W("0 0 480 178", g, "Cablu drept și cablu crossover (azi auto-MDIX le face pe amândouă să meargă)");
  };
  SVG.fiberConn = function () {
    var g = "";
    g += r(30, 30, 60, 60, "#60a5fa", { rx: 4, st: "#1e3a8a" }) + '<circle cx="60" cy="60" r="7" fill="#f8fafc" stroke="#475569"/>' + t(60, 110, "SC", { s: 13 }) + t(60, 126, "pătrat, push-pull", { s: 9, w: 400 });
    g += r(150, 44, 34, 34, "#60a5fa", { rx: 3, st: "#1e3a8a" }) + r(188, 44, 34, 34, "#60a5fa", { rx: 3, st: "#1e3a8a" }) + '<circle cx="167" cy="61" r="4" fill="#f8fafc" stroke="#475569"/><circle cx="205" cy="61" r="4" fill="#f8fafc" stroke="#475569"/>' + t(186, 110, "LC duplex", { s: 13 }) + t(186, 126, "mic, clemă, SFP", { s: 9, w: 400 });
    g += '<circle cx="300" cy="60" r="30" fill="#d1d5db" stroke="#374151" stroke-width="2"/><circle cx="300" cy="60" r="18" fill="#9ca3af" stroke="#374151"/><circle cx="300" cy="60" r="6" fill="#f8fafc" stroke="#475569"/>' + r(326, 52, 10, 16, "#6b7280", { rx: 2 }) + t(300, 110, "ST", { s: 13 }) + t(300, 126, "rotund, baionetă ¼ tură", { s: 9, w: 400 });
    g += r(380, 30, 40, 22, "#3b82f6", { rx: 3 }) + t(400, 45, "UPC", { s: 9.5, f: "#fff" }) + '<path d="M425 34 h40 v14 h-40 z" fill="#e5e7eb" stroke="#475569"/>' + t(445, 64, "capăt drept", { s: 8.5, w: 400 });
    g += r(380, 78, 40, 22, "#16a34a", { rx: 3 }) + t(400, 93, "APC", { s: 9.5, f: "#fff" }) + '<path d="M425 82 h36 l4 14 h-40 z" fill="#e5e7eb" stroke="#475569"/>' + t(445, 112, "unghi 8°", { s: 8.5, w: 400 });
    g += t(240, 152, "Albastru = UPC, verde = APC – nu le cupla niciodată între ele!", { s: 10, f: "#b91c1c" });
    return W("0 0 480 162", g, "Conectorii de fibră pe care trebuie să-i recunoști");
  };
  SVG.ramSlot = function () {
    var g = GR;
    g += r(40, 30, 400, 56, "#15803d", { rx: 3, st: "#14532d" });
    for (var i = 0; i < 8; i++) g += r(60 + i * 46 + (i > 3 ? 20 : 0), 40, 30, 22, "#111827", { rx: 2, st: "#000" });
    for (var k = 0; k < 60; k++) { var x = 46 + k * 6.5; if (Math.abs(x - 262) < 6) continue; g += r(x, 76, 4, 10, "url(#gYel)", { rx: 0, st: "none" }); }
    g += '<path d="M256 86 v-10 h12 v10" fill="#fff" stroke="#14532d"/>' + t(262, 104, "crestătură (nu e la mijloc)", { s: 9.5, f: "#b91c1c" });
    g += r(30, 120, 420, 18, "#1f2937", { rx: 3 }) + r(258, 118, 8, 22, "#fbbf24", { rx: 1, st: "#92400e" }) + t(262, 156, "cheia din slot", { s: 9.5 });
    g += r(14, 104, 12, 40, "#9ca3af", { rx: 2 }) + r(454, 104, 12, 40, "#9ca3af", { rx: 2 }) + t(14, 160, "clemă", { s: 9, a: "start" }) + t(466, 160, "clemă", { s: 9, a: "end" });
    g += t(240, 18, "Aliniezi crestătura cu cheia și apeși pe ambele capete până se închid clemele", { s: 10 });
    return W("0 0 480 168", g, "Modulul RAM și slotul");
  };
})();
function SC(title, steps) { return '<div class="scen"><b>🎬 Scenariu la probă:</b> ' + title + "<ol>" + steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol></div>"; }
function CHK(items) { return '<div class="fact"><b>✅ Ce verifică examinatorul:</b><ul>' + items.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ul></div>"; }
function MIST(items) { return '<div class="eli trapw"><b>❌ Greșeli care te pică:</b><ul>' + items.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ul></div>"; }
function TIME(s) { return '<div class="exam"><b>⏱ Timp țintă:</b> ' + s + "</div>"; }
function TOOL(v, label) { return '<button class="ghost toolbtn" data-go="' + v + '">' + label + "</button>"; }

L("pp", 1, "Scenariul 1: mufezi un cablu drept T568B", "🔌", /Practic: RJ45/, [
  K("Ce primești pe masă", "Comisia îți dă o bucată de cablu UTP, două mufe RJ45 (uneori și una de rezervă), un clește de sertizat și un tester. Cerința sună cam așa: „Realizați un cablu drept T568B și verificați-l.”", "Scule: <b>clește de sertizat 8P</b> (cu lamă de tăiere și de dezizolare), eventual <b>dezizolator rotativ</b>, <b>tester</b> master/remote. Mufele pentru Cat6 cu fir gros pot avea un ghidaj interior (load bar).", PH("toolset") + SVG.crimper() + PH("crimper2")),
  K("Pașii, în ordine", "Fă-o la fel de fiecare dată, ca pe o rețetă – emoția de la examen nu te mai încurcă.", SC("„Primești un cablu UTP, un clește și 2 mufe. Faceți un cablu drept.”", ["Dezizolezi ~2–3 cm de manta (rotești o dată lama, nu crestezi firele).", "Desfaci perechile și îndrepți firele între degete.", "Le aranjezi în ordinea <b>T568B</b>: alb-portocaliu, portocaliu, alb-verde, albastru, alb-albastru, verde, alb-maro, maro.", "Le tai drept, la ~12–13 mm de la manta.", "Ții mufa cu clema în jos și împingi firele până ating peretele din față; mantaua intră sub clema de strângere.", "Verifici prin plastic că toate cele 8 fire sunt la capăt și în ordine.", "Sertizezi ferm, până la capăt.", "Repeți la celălalt capăt, tot T568B.", "Testezi: LED-urile 1→8 pe rând pe ambele unități."]), AN("crimp") + SVG.rj45pin() + PH("rj45") + TOOL("rj", "Exersează ordinea culorilor (interactiv)")),
  K("Cum te notează și ce te pică", "Examinatorul se uită întâi cu ochii, apoi folosește testerul. Un cablu care „merge” dar e făcut neglijent poate pierde puncte.", CHK(["ordinea culorilor la ambele capete (vizual, prin mufă)", "mantaua prinsă în mufă, fără fire desfăcute la vedere", "firele tăiate drept, toate la capăt", "testerul: 1-2-3-4-5-6-7-8 la ambele unități", "uneori: cablul pus între PC și switch → LED de link + ping"]) + MIST(["ordinea inversată pentru că ai ținut mufa cu clema în sus", "verdele pus lângă alb-verde (perechea despărțită corect e 3 și 6!)", "fire tăiate inegal → un LED stins", "manta scurtă → 2 cm de fire desfăcute", "ai sertizat înainte să verifici ordinea"]) + TIME("5–8 minute pentru un cablu complet, după 10 cabluri de antrenament acasă. Cumpără un clește ieftin, un tester și 20 de mufe – e cea mai bună investiție pentru probă.")),
], { byE: true });
L("pp", 1, "Testerul de cablu: ce înseamnă LED-urile", "🚦", /Practic: tester/, [
  K("Cum citești testerul", "Testerul trimite curent pe rând prin fiecare fir: dacă LED-ul cu același număr se aprinde la celălalt capăt, firul e bun și e la locul lui.", "Pui master-ul la un capăt și remote-ul la celălalt, pornești. <b>Drept</b>: 1→8 în aceeași ordine. <b>Crossover</b>: 3,6,1,4,5,2,7,8. <b>Rollover</b>: 8→1. <b>LED stins</b> = fir întrerupt. <b>Două LED-uri deodată</b> = scurtcircuit. <b>Ordine greșită</b> = fire inversate.", SVG.tester() + PH("tester")),
  K("Drept, crossover, rollover – când folosești fiecare", "Echipamente diferite (PC–switch) = drept. Echipamente la fel (PC–PC, switch–switch) = crossover, deși azi auto-MDIX se descurcă singur. Consola Cisco = rollover (albastru).", "La probă, cerința spune clar ce cablu vrea. Dacă ți se cere „drept” și testerul arată 8→1, ai pus o mufă invers.", SVG.straightCross() + PH("console")),
  K("Capcana: testerul spune OK, dar cablul e greșit", "Testerul simplu verifică doar că pinul 1 ajunge la pinul 1. Dacă ai greșit la fel la ambele capete, el zice OK – dar perechile răsucite nu mai sunt unde trebuie.", MIST(["aceeași ordine greșită la ambele capete (split pair) – merge prost sau deloc la 100/1000 Mbit/s", "să te bazezi doar pe tester fără să verifici culorile"]) + CHK(["ordinea culorilor", "rezultatul testerului", "eventual link și ping cu cablul în rețea"])),
], { byE: true });
L("pp", 1, "Multimetrul: tensiune, continuitate, rezistență", "🧪", /Practic: multimetru/, [
  K("Ce primești și ce ți se cere", "Un multimetru digital, o baterie, poate o siguranță, un rezistor sau un cablu. Cerințe tipice: „măsurați tensiunea bateriei”, „verificați continuitatea firului”, „măsurați rezistorul”, „ce tensiune are priza?”.", "Negru <b>mereu în COM</b>. Roșu în <b>VΩ</b> pentru tensiune, rezistență, continuitate; în <b>mA/10A</b> doar pentru curent. <b>V⎓</b> = DC (baterie), <b>V~</b> = AC (priză).", SVG.mmDial() + PH("multimeter") + TOOL("mm", "Exersează selectorul și bornele (interactiv)")),
  K("Pas cu pas pentru fiecare măsurare", "Întâi gândești ce măsori, apoi setezi selectorul, apoi bornele – și abia la final atingi circuitul.", SC("„Măsurați tensiunea bateriei de 9 V.”", ["Selector pe <b>V⎓</b> (scala 20 V dacă e manual).", "Negru în COM, roșu în VΩ.", "Roșu pe +, negru pe −.", "Citești ~9 V (o baterie nouă are 9,3–9,6 V; sub ~7,5 V e descărcată). „−9” = vârfuri inversate."]) + SC("„Verificați dacă firul e întrerupt.”", ["Cablul NEALIMENTAT.", "Selector pe continuitate (•)))).", "Atingi vârfurile între ele: trebuie să bipăie (testul aparatului).", "Vârfurile la capetele firului: bip = întreg; „OL” = întrerupt."]) + AN("circuit")),
  K("Siguranța – ce te descalifică", "La 230 V nu există a doua șansă. Comisia urmărește mai ales ce faci înainte să atingi ceva.", MIST(["roșul lăsat în 10A când măsori tensiune → scurtcircuit pe sursă", "măsori rezistență sau continuitate pe circuit alimentat", "ții vârfurile de partea metalică / cu ambele mâini pe 230 V", "selector pe Ω sau A când măsori priza", "aparat fără categorie CAT pe rețea"]) + CHK(["selector corect pentru mărime și tip (AC/DC)", "bornele corecte", "voltmetru în paralel, ampermetru în serie", "citirea cu unitatea de măsură (V, Ω, mA)"]) + TIME("~1 minut pe măsurare. Spune cu voce tare ce faci: „trec pe V alternativ, negru în COM, roșu în V”. Arată că știi.") + PH("multimeter3")),
], { byE: true });
L("pp", 2, "Cisco IOS: primii pași pe consolă", "💻", /Practic: IOS/, [
  K("Legătura la consolă", "Switch-ul nu are ecran: îl „vezi” printr-un cablu de consolă legat la laptop și un program de terminal.", "Cablu <b>rollover</b> (albastru, RJ45–DB9) sau USB, port <b>COM</b> din Device Manager, PuTTY/Tera Term la <b>9600 8N1</b>, fără flow control. Apeși Enter → apare <code>Switch&gt;</code>. Dacă apare „Would you like to enter the initial configuration dialog?”, răspunzi <b>no</b>.", PH("console") + PH("router")),
  K("Modurile IOS", "Ca o clădire cu etaje: la parter (>) doar te uiți, la etajul 1 (#) ai cheile, la etajul 2 (config) schimbi lucruri, iar fiecare interfață e o cameră separată.", "<code>enable</code> → <code>configure terminal</code> → <code>interface …</code>; <code>exit</code> urcă un nivel, <code>end</code> te duce direct la #. Prescurtările merg: <code>en</code>, <code>conf t</code>, <code>int g0/0</code>, <code>sh run</code>. Tasta <b>Tab</b> completează, <b>?</b> arată opțiunile.", SVG.iosModes() + TOOL("cli", "Deschide simulatorul CLI Cisco")),
  K("Scenariul tipic: configurarea de bază", "Cerința vine ca listă. Le faci în ordine și bifezi.", SC("„Configurați switch-ul: nume SW1, parolă privilegiată criptată, parolă pe consolă, banner, salvare.”", ["<code>enable</code>", "<code>configure terminal</code>", "<code>no ip domain-lookup</code> (opțional, te scapă de blocaje la greșeli de tastare)", "<code>hostname SW1</code>", "<code>enable secret Parola123</code>", "<code>line console 0</code> → <code>password cisco</code> → <code>login</code> → <code>exit</code>", "<code>service password-encryption</code>", "<code>banner motd #Acces autorizat#</code>", "<code>end</code> → <code>copy running-config startup-config</code> (Enter la întrebare)"]) + CHK(["<code>show running-config</code>: hostname, enable secret, line con 0 cu login", "promptul SW1#", "configurația salvată (show startup-config)"]) + MIST(["ai uitat <code>login</code> pe linie", "ai uitat să salvezi", "<code>enable password</code> în loc de <code>enable secret</code> când cerința zice „criptată”"]) + TIME("10 minute pentru tot, cu verificare.")),
  K("Routerul: interfața și adresa IP", "Spre deosebire de switch, routerul are interfețele oprite din fabrică. Fără <code>no shutdown</code>, nu merge nimic.", SC("„Configurați pe R1 interfața G0/0 cu 192.168.1.1/24 și verificați.”", ["<code>enable</code> → <code>conf t</code> → <code>hostname R1</code>", "<code>interface g0/0</code>", "<code>ip address 192.168.1.1 255.255.255.0</code>", "<code>no shutdown</code> (apare mesajul „changed state to up”)", "<code>end</code> → <code>show ip interface brief</code>: G0/0 192.168.1.1 <b>up up</b>", "<code>copy running-config startup-config</code>"]) + CHK(["show ip interface brief: IP corect, up/up", "ping de la PC la 192.168.1.1"]) + MIST(["masca scrisă /24 în loc de 255.255.255.0 (IOS clasic cere masca zecimală)", "„administratively down” = ai uitat no shutdown"]) + PH("switch")),
], { byE: true });
L("pp", 2, "VLAN-uri, verificare și salvare", "🗂️", /Practic: VLAN/, [
  K("VLAN-uri în 5 comenzi", "Un VLAN e ca o despărțitură într-un birou mare: PC-urile din camere diferite nu se aud, deși sunt pe același switch.", SC("„Creați VLAN 10 ADMIN și VLAN 20 TEHNIC; Fa0/1 în VLAN 10, Fa0/2 în VLAN 20; verificați.”", ["<code>conf t</code>", "<code>vlan 10</code> → <code>name ADMIN</code> → <code>vlan 20</code> → <code>name TEHNIC</code> → <code>exit</code>", "<code>interface fa0/1</code> → <code>switchport mode access</code> → <code>switchport access vlan 10</code>", "<code>interface fa0/2</code> → <code>switchport mode access</code> → <code>switchport access vlan 20</code>", "<code>end</code> → <code>show vlan brief</code>", "<code>copy running-config startup-config</code>"]) + TOOL("cli", "Fă exercițiul în simulatorul CLI")),
  K("Adresa de management și accesul de la distanță", "Ca să poți administra switch-ul prin rețea, îi dai un IP pe o interfață virtuală (VLAN 1 sau VLAN-ul de management) și parolă pe liniile vty.", "<code>interface vlan 1</code> → <code>ip address 192.168.1.2 255.255.255.0</code> → <code>no shutdown</code> → <code>exit</code> → <code>ip default-gateway 192.168.1.1</code> → <code>line vty 0 15</code> → <code>password cisco</code> → <code>login</code>.", CHK(["show vlan brief: porturile în VLAN-urile cerute", "show ip interface brief: Vlan1 cu IP, up/up", "show running-config: line vty cu login", "ping de la PC la IP-ul switch-ului"]) + MIST(["„interface vlan 10” când voiai să creezi VLAN-ul (asta e SVI)", "porturi uitate în VLAN 1", "ai verificat doar în show run, nu și cu ping"])),
  K("Comenzile de verificare pe care le cere examinatorul", "Gândește-te ca examinatorul: ce comandă dovedește că ai făcut ce ți s-a cerut?", "<code>show running-config</code> (tot), <code>show ip interface brief</code> (IP-uri și stare), <code>show vlan brief</code> (VLAN-uri și porturi), <code>show interfaces trunk</code>, <code>show mac address-table</code>, <code>show version</code>, <code>show startup-config</code> (dacă ai salvat). Din config: <code>do show …</code>.", PH("fx") + PH("rackpp")),
], { byE: true });
L("pp", 1, "IP în Windows: ipconfig, ping, tracert", "🪟", /Practic: Windows/, [
  K("Setezi IP static", "Ca să vorbească cu routerul, PC-ul trebuie să fie în aceeași rețea: aceeași primă parte a adresei, aceeași mască.", SC("„Configurați PC-ul cu 192.168.1.10/24, gateway 192.168.1.1, DNS 8.8.8.8 și verificați legătura.”", ["<b>Win+R</b> → <code>ncpa.cpl</code> → Enter", "Clic dreapta pe Ethernet → Properties", "Internet Protocol Version 4 (TCP/IPv4) → Properties", "Use the following IP address: 192.168.1.10 / 255.255.255.0 / 192.168.1.1", "DNS: 8.8.8.8 → OK → Close", "<code>cmd</code> → <code>ipconfig</code> (verifici) → <code>ping 192.168.1.1</code>"]) + AN("packet")),
  K("Comenzile de diagnostic", "Fiecare comandă răspunde la o întrebare: „ce adresă am?” (ipconfig), „ajung acolo?” (ping), „pe unde trec?” (tracert), „merge DNS-ul?” (nslookup).", "<code>ipconfig /all</code> (MAC, DHCP, DNS) · <code>ipconfig /release</code> + <code>/renew</code> · <code>ping -t</code> (continuu) · <code>ping -n 10</code> · <code>tracert 8.8.8.8</code> · <code>nslookup google.com</code> · <code>arp -a</code> · <code>netstat -an</code>. 169.254.x.x = DHCP n-a răspuns.", AN("arp")),
  K("Depanare când ping-ul nu merge", "Mergi de jos în sus, ca la un etaj cu etaj: cablu → adresă → echipament → firewall.", MIST(["IP în altă rețea decât gateway-ul (ex. 192.168.2.10 cu gateway 192.168.1.1)", "masca greșită", "firewall-ul Windows blochează ping-ul primit", "ai pus gateway-ul în câmpul DNS"]) + CHK(["ipconfig arată exact valorile cerute", "ping la gateway: 4 răspunsuri (primul poate pierde din cauza ARP)", "eventual tracert / nslookup dacă se cere Internet"]) + TIME("3–5 minute.") + AN("nat")),
], { byE: true });
L("pp", 2, "Fibra: conectori, UPC/APC și curățare", "💡", /Practic: fibră/, [
  K("Recunoaște conectorii", "Trei forme de bază: pătrat mare (SC), mic cu clemă (LC), rotund cu baionetă (ST). Culoarea corpului îți spune lustruirea.", "<b>SC</b> push-pull, ferulă 2,5 mm · <b>LC</b> ferulă 1,25 mm, duplex, la SFP · <b>ST</b> baionetă (răsucești) · <b>FC</b> filet. <b>UPC = albastru</b> (drept), <b>APC = verde</b> (8°). Manta galbenă = single-mode, aqua = OM3/OM4, portocalie = OM1/OM2.", SVG.fiberConn() + PH("sc") + PH("lc") + PH("st")),
  K("Curățarea, pas cu pas", "Un fir de praf pe capătul fibrei e ca un bolovan în fața unui far: blochează lumina. De aceea, la fibră, regula nr. 1 e curățenia.", SC("„Conectați patch-cord-ul de fibră la switch.”", ["Nu te uiți niciodată în capăt (laser invizibil).", "Scoți capacul de protecție doar acum.", "<b>Inspectezi</b> capătul cu microscopul/sonda.", "<b>Cureți</b>: one-click cleaner (o apăsare) sau caseta de curățare / șervețel fără scame cu alcool izopropilic, apoi uscat.", "<b>Inspectezi</b> din nou.", "Cuplezi: SC/LC – împingi până face clic; ST – răsucești.", "Pui capacele pe conectorii liberi."]) + AN("fiber")),
  K("Ce te pică la fibră", "Greșelile de la fibră nu se văd cu ochiul liber – de aceea examinatorul întreabă ce ai făcut.", MIST(["APC (verde) cuplat cu UPC (albastru)", "conector necurățat sau atins cu degetul", "te uiți în fibră", "fibră îndoită strâns (raza minimă!)", "single-mode amestecat cu multimode"]) + CHK(["recunoști tipul de conector și lustruirea", "explici inspectează–curăță–inspectează", "VFL/power meter pentru verificare"])),
], { byE: true });
L("pp", 2, "PC: memorie RAM și disc", "🖥️", /Practic: PC/, [
  K("Înainte de orice", "Electricitatea statică de pe tine poate omorî un modul de memorie fără să simți nimic.", "PC oprit, <b>scos din priză</b>, apeși butonul de pornire 5 s (descarci condensatorii), <b>brățară antistatică</b> legată de carcasă (sau atingi carcasa metalică), lucrezi pe masă, nu pe covor. Componentele le ții de margini.", PH("mobo")),
  K("Schimbi RAM-ul", "Modulul are o crestătură care nu e la mijloc: intră doar într-un sens. Dacă trebuie să forțezi, e invers.", SC("„Înlocuiți modulul de memorie și verificați.”", ["Deschizi clemele slotului.", "Scoți modulul vechi ținându-l de margini.", "Aliniezi crestătura noului modul cu cheia din slot.", "Apeși vertical pe ambele capete până clemele se închid singure (clic).", "Pornești și verifici în BIOS sau în Windows (Task Manager → Performance → Memory)."]) + SVG.ramSlot() + PH("ram")),
  K("Schimbi discul (HDD → SSD)", "SSD-ul SATA se leagă ca HDD-ul: un cablu de date și unul de alimentare. SSD-ul M.2 intră direct în placă.", SC("„Înlocuiți HDD-ul cu SSD-ul primit.”", ["Backup/clonare înainte (dacă e PC de lucru).", "Scoți cablurile SATA de date și alimentare, apoi discul din sertar.", "Montezi SSD-ul (adaptor 2,5\"→3,5\" dacă e nevoie), legi cele două cabluri.", "M.2: îl introduci la ~30°, îl apeși și îl prinzi cu șurubul.", "BIOS/UEFI: discul apare? Windows: Disk Management → Initialize (GPT) → New Simple Volume."]) + PH("ssd") + PH("hdd") + MIST(["lucrezi cu PC-ul în priză", "atingi contactele aurii", "forțezi modulul invers", "uiți cablul de alimentare SATA"])),
], { byE: true });
L("pp", 3, "Packet Tracer și strategia la probă", "🧭", /Practic: Packet Tracer/, [
  K("Packet Tracer – simulatorul gratuit Cisco", "E un „laborator” pe calculator: tragi routere, switch-uri și PC-uri, le legi cu cabluri și le configurezi exact ca pe cele reale.", "Îl descarci gratuit cu cont Cisco Networking Academy (curs „Getting Started with Cisco Packet Tracer”). Cabluri: negru continuu = drept, negru punctat = crossover, albastru deschis = consolă, roșu zig-zag = serial, portocaliu = fibră. Becuri: verde = OK, portocaliu = STP (așteaptă), roșu = jos. PC → Desktop → IP Configuration / Command Prompt / Terminal. Router → CLI. <b>Simulation mode</b> îți arată fiecare pachet.", PH("rack")),
  K("Exerciții de făcut acasă", "Fă aceleași 4 scenarii până le poți face fără notițe, cu cronometru.", "<b>1.</b> 2 PC-uri + switch: IP-uri în aceeași rețea, ping. <b>2.</b> Switch: hostname, enable secret, consolă, vty, banner, salvare. <b>3.</b> Router + switch + 2 PC-uri: G0/0 cu IP, gateway pe PC-uri, ping la gateway. <b>4.</b> VLAN 10 și 20 pe switch, câte un PC în fiecare – verifici că NU își dau ping; apoi show vlan brief.", TOOL("cli", "Simulatorul CLI din aplicație") + TOOL("ppsheet", "Fișa „ce fac pas cu pas” (de tipărit)")),
  K("Strategia în sala de examen", "Calm, ordine, verificare. Comisia vrea să vadă că lucrezi sigur și metodic, nu că știi trucuri.", "<b>1.</b> Citește toată cerința și notează pașii. <b>2.</b> Pregătește sculele/aparatul înainte. <b>3.</b> Fă pașii în ordine, cu voce tare dacă ți se cere să explici. <b>4.</b> Verifică fiecare rezultat (tester, show, ping). <b>5.</b> Salvează (copy run start). <b>6.</b> Dacă ai stricat ceva, spune și cere o mufă/încă o încercare – nu ascunde. <b>Formatul exact al probei îl stabilește comisia; aici sunt scenariile tipice.</b>", CHK(["siguranța (priză, ESD, laser)", "rezultatul verificabil", "ordinea și curățenia lucrului", "timpul"]) + TIME("Antrenează-te să termini fiecare scenariu în ~70% din timpul pe care crezi că îl ai.")),
], { byE: true });

/* animații și fotografii adăugate în lecțiile existente */
(function () {
  function add(c, title, k, h) { var l = LESSONS.filter(function (x) { return x.c === c && x.t === title; })[0]; if (l) l.cards.push(K(h, "", "", AN(k))); }
  add("net", "Ethernet, MAC și switch-ul", "packet", "Animație: un pachet prin switch și router");
  add("net", "Routere și rutare", "packet", "Animație: ce rescrie routerul");
  add("baz", "Switch-ul și adresa MAC", "packet", "Animație: MAC-ul se schimbă, IP-ul rămâne");
  add("net", "ARP, DHCP și DNS", "arp", "Animație: ARP pas cu pas");
  add("net", "NAT – traducerea adreselor", "nat", "Animație: NAT/PAT pas cu pas");
  add("sub", "Împărțirea în subrețele", "subnet", "Animație: /24 → /25 → /26");
  add("el", "Serie și paralel", "circuit", "Animație: curentul în serie și în paralel");
  add("baz", "Serie, paralel și cum legi aparatele", "circuit", "Animație: unde pui ampermetrul și voltmetrul");
  add("el", "Curent continuu și curent alternativ", "acdc", "Animație: DC și AC");
  add("el", "Monofazat și trifazat", "three", "Animație: trei faze la 120°");
  add("fo", "Monomod și multimod", "fiber", "Animație: lumina în fibră");
  add("ant", "Linia de vedere și zona Fresnel", "fresnel", "Animație: unda radio și zona Fresnel");
  add("ant", "Antena și tipurile de antene", "pattern", "Animație: diagrame de radiație");
  add("cab", "RJ45: T568A, T568B, tipuri de cabluri", "crimp", "Animație: mufarea pas cu pas");
  function addP(c, title, keys) { var l = LESSONS.filter(function (x) { return x.c === c && x.t === title; })[0]; if (l) l.cards[l.cards.length - 1] += keys.map(function (k) { return PH(k); }).join(""); }
  addP("ant", "Antena și tipurile de antene", ["tower"]);
  addP("el", "Multimetrul și măsurarea la priză", ["multimeter"]);
  addP("cab", "RJ45: T568A, T568B, tipuri de cabluri", ["rj45", "punch"]);
})();
