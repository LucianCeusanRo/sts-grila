/* Videoclipuri opționale (segmente scurte, youtube-nocookie, se încarcă doar la apăsare). ID-uri verificate cu oEmbed. */
function YT(id, s, e, title, ch, note) {
  var mm = function (x) { return Math.floor(x / 60) + ":" + ("0" + (x % 60)).slice(-2); };
  return '<div class="ytbox"><button class="ytf" data-yt="' + id + '" data-s="' + s + '" data-e="' + e + '" aria-label="Pornește videoclipul: ' + title.replace(/"/g, "") + '"><svg viewBox="0 0 68 48" width="54" height="38" aria-hidden="true"><path d="M66.5 7.7c-.8-2.9-3-5.2-5.9-6C55.3.3 34 .3 34 .3S12.7.3 7.4 1.7c-2.9.8-5.1 3.1-5.9 6C0 13 0 24 0 24s0 11 1.5 16.3c.8 2.9 3 5.2 5.9 6C12.7 47.7 34 47.7 34 47.7s21.3 0 26.6-1.4c2.9-.8 5.1-3.1 5.9-6C68 35 68 24 68 24s0-11-1.5-16.3z" fill="#e11d48"/><path d="M27 34l18-10-18-10z" fill="#fff"/></svg><span><b>' + title + "</b><small>" + ch + " · segment " + mm(s) + "–" + mm(e) + " (" + Math.round((e - s) / 60) + ' min) · opțional</small></span></button><div class="small muted">🎬 ' + note + "</div></div>";
}
(function () {
  var V = [
    [/^Împărțirea în subrețele$/, "oQTJUeRVklc", 89, 257, "Cum subnetez o rețea (partea 1)", "Ramon Adrian Năstase · RO", "Urmărește cum împarte o rețea în subrețele și cum află adresa de rețea și broadcast-ul. Apoi exersează în Antrenorul de subnetting."],
    [/^VLAN, trunk și STP$/, "H0P5I9-L3r0", 25, 266, "Ce înseamnă VLAN, access și trunk", "Ramon Adrian Năstase · RO", "Reține: VLAN = separare la nivelul 2; portul access duce un singur VLAN, trunk-ul mai multe (802.1Q)."],
    [/^NAT – traducerea adreselor$/, "fLZkRieollc", 20, 279, "Cum funcționează NAT", "Ramon Adrian Năstase · RO", "Urmărește diferența dintre NAT static și dinamic. PAT (overload) – mai multe adrese private pe un singur IP public – e la finalul clipului."],
    [/^Ce este o rețea$/, "lxZpuEJQFMQ", 72, 240, "Introducere în rețele de calculatoare", "Ramon Adrian Năstase · RO", "Concepte de bază: ce e o rețea, cum funcționează Internetul. Bun ca prim contact, înainte de lecție."],
    [/^Scenariul 1: mufezi un cablu drept T568B$/, "QMpWkkqX1eM", 79, 334, "Cum se mufează un cablu Cat5e/Cat6 (RJ45)", "Switched On Network · EN", "Fără sunet se înțelege tot: dezizolare, îndreptarea firelor, ordinea culorilor, tăiere, sertizare, test. Verifică pe ecran ordinea T568B."],
    [/^Exersare acasă: mufezi, testezi, repari$/, "QMpWkkqX1eM", 79, 334, "Cum se mufează un cablu Cat5e/Cat6 (RJ45)", "Switched On Network · EN", "Uită-te o dată, apoi oprește și fă exact pașii pe cablul tău."],
    [/^Lab B în Packet Tracer: SSH pe switch în VLAN 10$/, "lC0JoWTjgjg", 0, 300, "VLAN și SSH pe un switch în Packet Tracer", "Triple Play Technical · EN", "Comparați comenzile cu cele din lecție: vlan, interface vlan, domain-name, crypto key, username, line vty."],
    [/^Lab C în Packet Tracer: router Gi0\/0 \+ switch \+ 2 PC-uri$/, "T5RKNkFDBtU", 0, 300, "Configurări de bază pe router în Packet Tracer", "Ramon Adrian Năstase · RO", "Primele 5 minute: hostname, parole, IP pe interfață, no shutdown – exact ce faci la Lab C."],
    [/^Conectori de fibră și UPC\/APC$/, "bgboCnc7nmg", 0, 286, "Conectori de fibră: ST, FC, SC, LC, MT-RJ", "Sunny Classroom · EN", "Animații clare cu forma fiecărui conector. Leagă imaginea de nume: SC pătrat, LC mic, ST baionetă, FC filet."],
    [/^OTDR și diagnosticarea fibrei$/, "GP39QVYwmNU", 0, 289, "Cum citești o urmă OTDR", "Fosco Connect / Corning · EN", "Recunoaște pe grafic: vârful de la început, panta (atenuarea), treapta de la sudură, vârful de la conector și capătul fibrei."]
  ];
  V.forEach(function (v) { LESSONS.forEach(function (l) { if (v[0].test(l.t)) l.cards[l.cards.length - 1] += YT(v[1], v[2], v[3], v[4], v[5], v[6]); }); });
})();
