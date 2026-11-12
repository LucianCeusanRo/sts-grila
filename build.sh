#!/bin/bash
# Concatenează fișierele cu întrebări într-un singur questions.js
set -e
cd "$(dirname "$0")"
{
cat <<'H'
/* Banca de întrebări STS – grilă. Format: [întrebare, [corect, greșit1, greșit2, greșit3], explicație].
   Primul răspuns din listă este cel corect; ordinea este amestecată la afișare. */
window.CATEGORIES = [
  {id:"ex",    nr:"★", ic:"🎯", name:"Exact ca la examen – temele raportate de un candidat care a trecut proba: canal telefonic, RJ11/RJ45, PPPoE, topologii, LAN/WAN, viteze, fibră și OTDR, UPC/APC, UTP și categorii, cabluri, OSI/TCP-IP, adrese IP, VLAN, Wi-Fi", short:"Exact ca la examen"},
  {id:"baz",   nr:"0", ic:"🚀", name:"Bazele esențiale – switch și MAC, IPv4, ce cablu alegi, fibra după culori, legea lui Ohm, serie/paralel și aparate", short:"Bazele esențiale"},
  {id:"pp",    nr:"P", ic:"🛠️", name:"Proba practică – scenarii de examen: mufare RJ45 și tester, multimetru, configurare Cisco IOS, IP în Windows, fibră, componente PC, Packet Tracer", short:"Proba practică"},
  {id:"fo",    nr:"1", ic:"💡", name:"Infrastructura rețelelor de date – fibră optică, verificare, rețele de acces", short:"Fibră optică & acces"},
  {id:"cab",   nr:"2", ic:"🧵", name:"Rețele de cablare structurată, amenajare, conectori și cabluri IT", short:"Cablare structurată"},
  {id:"pc",    nr:"3", ic:"🖥️", name:"Calculatoare personale – arhitectură, componente, periferice, depanare", short:"Calculatoare (PC)"},
  {id:"win",   nr:"4", ic:"🖱️", name:"Sisteme de operare Windows XP/7/8.1/10, backup, servicii de rețea", short:"Windows"},
  {id:"net",   nr:"5", ic:"🌐", name:"Comunicații – rețele de calculatoare (CCNA 1 / ITN): switch, router, VLAN, VPN, wireless, firewall", short:"Rețele / CCNA"},
  {id:"trk",   nr:"5T", ic:"🛣️", name:"Port TRUNK și VLAN – access vs trunk, 802.1Q, VLAN nativ, allowed vlan, DTP, trunk între switch-uri, router-on-a-stick, comenzi și verificare", short:"Trunk și VLAN"},
  {id:"sub",   nr:"5+", ic:"🧮", name:"Subnetting IPv4 și VLSM – calcule de adrese, măști, CIDR", short:"Subnetting"},
  {id:"tel",   nr:"6", ic:"☎️", name:"Cabluri telefonice din cupru și fibră optică – clasificare, caracteristici", short:"Cabluri telefonice"},
  {id:"mas",   nr:"7", ic:"📏", name:"Măsurători în telecomunicații – nivel, dB, dBm, Np, generatoare, indicatoare", short:"Măsurători telecom"},
  {id:"el",    nr:"⚡", ic:"⚡", name:"Noțiuni de bază electricitate – U, I, R, legea lui Ohm, putere", short:"Electricitate"},
  {id:"ant",   nr:"📡", ic:"📡", name:"Antene și radio – câștig, polarizare, VSWR, Fresnel, radioreleu, TETRA, satelit, siguranță", short:"Antene și radio"},
  {id:"sts",   nr:"★", ic:"🏢", name:"Munca la STS – camera de echipamente, switch-uri, terminale și SIM, sistemul 112, TETRA, antene, migrare", short:"Munca la STS"},
  {id:"cap",   nr:"!", ic:"⚠️", name:"Capcane la examen – confuzii clasice explicate, cu „de ce greșesc oamenii”", short:"Capcane la examen"},
  {id:"tan",   nr:"T", ic:"📘", name:"Tanenbaum – „Rețele de calculatoare” (ed. a 4-a): întrebări originale pe capitolele manualului, cu trimitere la capitol", short:"Tanenbaum (manual)"},
  {id:"mun",   nr:"M", ic:"📗", name:"Munteanu & Greavu-Șerban – „Rețele locale de calculatoare”: întrebări originale pe capitolele manualului, cu trimitere la capitol", short:"Munteanu (manual LAN)"},
  {id:"rad",   nr:"R", ic:"📙", name:"Rădulescu – „Rețele de telecomunicații”: întrebări originale pe temele manualului (PCM, ISDN, SS7, GSM, X.25, Frame Relay, ATM, PDH/SDH, acces), cu trimitere la capitol", short:"Rădulescu (telecom)"},
  {id:"nor",   nr:"N", ic:"📒", name:"Norton & Kearns – „Rețele de calculatoare”: întrebări originale pe capitolele manualului (OSI, Ethernet, cabluri, WAN, modemuri, IP, directoare, RAID/UPS/backup, depanare)", short:"Norton (manual)"},
  {id:"voip",  nr:"V", ic:"🎧", name:"VoIP Cisco – Davidson & Peters, „Voice over IP Fundamentals”: întrebări originale (PSTN, PCM/G.711, codecuri, pachete, jitter/întârziere, QoS, SIP/H.323, RTP, PBX și telefoane IP)", short:"VoIP Cisco"},
  {id:"iq",    nr:"🧠", ic:"🧠", name:"Teste de inteligență și vocabular – cuburi și desfășurări, șiruri, intrusul, analogii, sinonime, antonime, paronime (tip test psihologic)", short:"Teste inteligență & vocabular"},
  {id:"extra", nr:"+", ic:"🛰️", name:"Extra – VoIP, telefonie digitală, radio VHF/UHF, sateliți", short:"VoIP / radio / satelit"}
];
window.QUESTIONS = [];
var QB = { n: {}, add: function (c, arr) { var self = this; arr.forEach(function (x) {
  self.n[c] = (self.n[c] || 0) + 1;
  var o = { id: c + "-" + self.n[c], c: c, q: x[0], a: x[1], e: x[2] }; if (x[3]) o.s = x[3]; window.QUESTIONS.push(o); }); } };
H
for f in src/*.js; do cat "$f"; echo; done
} > public/questions.js
echo "questions.js generat"
{ echo "/* Lecții generate din learn/*.js */"; for f in learn/*.js; do cat "$f"; echo; done; } > public/lessons.js
echo "lessons.js generat"
cp shared/merge.js public/merge.js
bash tools/buildgame.sh
V=$(cat public/app.js public/apt.js public/style.css public/questions.js public/lessons.js public/merge.js public/game.js public/game.css public/jg3d.js public/jgnpc.js public/vendor/three-x.min.js public/vendor/three-post.min.js | md5sum | cut -c1-10)
sed -i -E "s/\?v=[a-z0-9]+/?v=$V/g" public/index.html
sed -E "s/var V = \"[^\"]*\";/var V = \"$V\";/" sw.template.js > public/sw.js
echo "versiune $V"
