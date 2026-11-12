/* ===== RĂDULESCU – „Rețele de telecomunicații”: rezumate ORIGINALE, pentru începători, pe temele din cuprins ===== */
(function () {
  function W(vb, inner, title) { return '<figure class="dia"><svg viewBox="' + vb + '" role="img" aria-label="' + (title || "diagramă") + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12">' + inner + "</svg>" + (title ? "<figcaption>" + title + "</figcaption>" : "") + "</figure>"; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 12) + '" font-weight="' + (o.w || 400) + '">' + s + "</text>"; }
  function r(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 3 : o.rx) + '" fill="' + f + '" stroke="' + (o.st || "none") + '" stroke-width="' + (o.sw || 1) + '"/>'; }
  SVG.e1 = function () {
    var g = "", i, x, c;
    g += t(240, 16, "Un cadru E1 = 125 µs = 32 intervale × 8 biți = 256 biți", { w: 800, s: 12 });
    for (i = 0; i < 32; i++) { x = 16 + i * 14; c = i === 0 ? "#dc2626" : i === 16 ? "#7c3aed" : "#2563eb"; g += r(x, 28, 13, 40, c, { rx: 2 }); }
    g += t(22, 84, "TS0", { s: 10, w: 700, f: "#dc2626" }) + t(246, 84, "TS16", { s: 10, w: 700, f: "#7c3aed" });
    g += t(22, 98, "sincronizare", { s: 9.5, f: "#dc2626", a: "start" }) + t(246, 98, "semnalizare", { s: 9.5, f: "#7c3aed" });
    g += t(370, 92, "30 canale de voce (albastru)", { s: 10.5, f: "#1d4ed8", w: 700 });
    g += t(240, 124, "8000 eșantioane/s × 8 biți = 64 kbit/s pe canal", { s: 11 });
    g += t(240, 142, "32 × 64 kbit/s = 2,048 Mbit/s", { s: 12, w: 800 });
    return W("0 0 480 152", g, "PCM: cadrul primar E1 (Europa)");
  };
  SVG.hierTx = function () {
    var g = "", rows = [["E1", "2,048 Mbit/s", "30 canale"], ["E2", "8,448 Mbit/s", "4 × E1 · 120"], ["E3", "34,368 Mbit/s", "16 × E1 · 480"], ["E4", "139,264 Mbit/s", "64 × E1 · 1920"]], i;
    g += t(115, 16, "PDH (plesiocron)", { w: 800, f: "#b45309" }) + t(360, 16, "SDH (sincron)", { w: 800, f: "#1d4ed8" });
    for (i = 0; i < 4; i++) { g += r(10, 26 + i * 34, 210, 28, "#fef3c7", { st: "#d97706" }) + t(20, 45 + i * 34, rows[i][0], { a: "start", w: 800, s: 12 }) + t(52, 45 + i * 34, rows[i][1], { a: "start", s: 11 }) + t(212, 45 + i * 34, rows[i][2], { a: "end", s: 10, f: "#78350f" }); }
    var s = [["STM-1", "155,52 Mbit/s", "63 E1 / 1 E4"], ["STM-4", "622,08 Mbit/s", "4 × STM-1"], ["STM-16", "≈ 2,5 Gbit/s", "16 × STM-1"], ["STM-64", "≈ 10 Gbit/s", "64 × STM-1"]];
    for (i = 0; i < 4; i++) { g += r(250, 26 + i * 34, 220, 28, "#dbeafe", { st: "#2563eb" }) + t(258, 45 + i * 34, s[i][0], { a: "start", w: 800, s: 11.5 }) + t(312, 45 + i * 34, s[i][1], { a: "start", s: 10.5 }) + t(464, 45 + i * 34, s[i][2], { a: "end", s: 9.5, f: "#1e3a8a" }); }
    g += t(240, 172, "PDH: ca să scoți un E1 din E4 desfaci tot, treaptă cu treaptă.", { s: 10.5 });
    g += t(240, 188, "SDH: multiplexorul add-drop scoate direct E1-ul dorit.", { s: 10.5, w: 700 });
    return W("0 0 480 196", g, "Ierarhiile digitale de transmisie");
  };
  SVG.atmCell = function () {
    var g = "";
    g += r(20, 30, 70, 44, "#7c3aed") + t(55, 50, "ANTET", { f: "#fff", w: 800, s: 11 }) + t(55, 65, "5 octeți", { f: "#fff", s: 10 });
    g += r(92, 30, 368, 44, "#16a34a") + t(276, 50, "DATE UTILE (payload)", { f: "#fff", w: 800, s: 11 }) + t(276, 65, "48 octeți", { f: "#fff", s: 10 });
    g += t(240, 18, "Celula ATM = 53 de octeți, lungime FIXĂ", { w: 800 });
    g += t(55, 92, "VPI/VCI + HEC", { s: 10, f: "#5b21b6", w: 700 });
    g += t(276, 92, "AAL1 = voce (debit constant) · AAL5 = date (IP)", { s: 10, f: "#166534" });
    return W("0 0 480 100", g, "Celula ATM");
  };
})();
function RB(s) { return '<div class="fact"><b>📙 Tema din manual:</b> ' + s + "</div>"; }
L("rad", 1, "Semnale, modulație, PCM și DPCM", "📙", /cap\. 2\.[1-4]\b/, [
  K("Analogic, digital, modulație", "Vocea e o undă care urcă și coboară lin (analogic). Ca s-o trimitem „digital”, o transformăm în numere (biți) – iar pe drum un regenerator poate „curăța” biții, fără să adune zgomot.", "<b>Modulația</b> = schimbi amplitudinea, frecvența sau faza unei purtătoare după semnal. <b>Multiplexarea</b> = mai multe semnale pe același canal: <b>FDM</b> (benzi de frecvență), <b>TDM</b> (intervale de timp), <b>WDM</b> (lungimi de undă pe fibră). Canalul telefonic vocal: <b>300–3400 Hz</b>."),
  K("PCM pas cu pas", "Ca la un film: „fotografiezi” vocea de 8000 de ori pe secundă, fiecare poză o rotunjești la una din 256 de trepte și scrii treapta ca un număr pe 8 biți.", "<b>Eșantionare</b> la <b>8 kHz</b> (cel puțin dublul celei mai mari frecvențe, ~4 kHz) → <b>cuantizare</b> (256 de niveluri, neuniforme: legea <b>A</b> în Europa, legea µ în SUA/Japonia) → <b>codare</b> pe <b>8 biți</b>. 8000 × 8 = <b>64 kbit/s</b>; un cadru = <b>125 µs</b>. <b>E1</b> = 32 de intervale (TS0 sincronizare, TS16 semnalizare, 30 voce) = <b>2,048 Mbit/s</b>. T1 (SUA) = 24 canale, 1,544 Mbit/s. <b>DPCM</b> trimite doar diferența față de o predicție (mai puțini biți); <b>ADPCM</b> G.726 = 32 kbit/s; modulația delta = 1 bit/eșantion.", SVG.e1() + EX("8 kHz, 8 biți, 64 kbit/s, 125 µs, E1 = 32 intervale / 30 voce / 2,048 Mbit/s, legea A.") + RB("cap. 2.1–2.4")),
]);
L("rad", 1, "QAM, DMT/ADSL și modurile de transfer", "📶", /cap\. 2\.[5-7]\b/, [
  K("QAM: mai mulți biți pe simbol", "Fiecare „simbol” e un punct pe o hartă (amplitudine + fază). Cu cât harta are mai multe puncte, cu atât fiecare punct poartă mai mulți biți – dar punctele sunt mai înghesuite și zgomotul le încurcă mai ușor.", "16-QAM = <b>4 biți</b>/simbol, 64-QAM = <b>6</b>, 256-QAM = <b>8</b> (2<sup>biți</sup> = puncte). Debit = viteza de simboluri (baud) × biți pe simbol. Diagrama de puncte = <b>constelație</b>."),
  K("DMT și ADSL; STM vs. ATM", "DMT împarte drumul în sute de benzi înguste; pe benzile „curate” pune mulți biți, pe cele zgomotoase puțini.", "ADSL: <b>256 subcanale</b> de ~<b>4,3125 kHz</b>, până la ~1,1 MHz; telefonul rămâne jos (0–4 kHz), separat de <b>splitter</b>; asimetric (mai mult spre abonat). <b>Modul de transfer sincron (STM)</b> = intervale de timp fixe, rezervate (circuite). <b>Modul asincron (ATM)</b> = celule trimise doar când există date (bandă împărțită după nevoie).", EX("Biți/simbol la QAM, cum lucrează DMT/ADSL, STM vs. ATM.") + RB("cap. 2.5–2.7")),
]);
L("rad", 1, "Rețele și servicii; PSTN – telefonia clasică", "☎️", /cap\. (1|3\.[1-5]|6)\b/, [
  K("Servicii și rețele", "Rețeaua e „drumul”, serviciul e „ce transporți” pe el.", "<b>Servicii suport</b> (transportul informației, ex. 64 kbit/s) vs. <b>teleservicii</b> (telefonie, fax) și <b>servicii suplimentare</b> (redirecționare, apel în așteptare, conferință). Rețele descrise în manual: PSTN, N-ISDN, SS7, IN, PLMN, X.25, Frame Relay, ATM/B-ISDN, Internet, rețele de acces."),
  K("Cum funcționează linia de telefon", "Telefonul analogic e alimentat de centrală prin perechea de cupru – de aceea merge și când se ia curentul în casă.", "<b>Bucla locală</b> = perechea abonat–centrală. Alimentare <b>−48 V c.c.</b>; soneria = tensiune alternativă (~75 V, ~25 Hz). Ridici receptorul → se închide bucla → ton de disc. Numărul: <b>DTMF</b> (două tonuri pe tastă, ex. 1 = 697 + 1209 Hz) sau impulsuri decadice (disc). Ierarhie: centrală locală → tranzit → internațională. <b>Comutație de circuite</b>: circuit rezervat toată convorbirea – întârziere mică, dar bandă irosită la date.", EX("Bucla locală, −48 V, DTMF, comutație de circuite vs. de pachete.") + RB("cap. 1, 3, 6")),
]);
L("rad", 2, "Centrale telefonice digitale și semnalizări", "🏢", /cap\. 5\b/, [
  K("Comutația digitală", "Centrala digitală nu mai leagă fire; mută octeți de vorbire dintr-un „sertar” de timp în altul.", "<b>Comutator temporal (T)</b> = schimbă intervalul de timp (scrie în memorie, citește în altă ordine). <b>Comutator spațial (S)</b> = leagă o magistrală de intrare de una de ieșire, în același interval. Structuri tipice: <b>T-S-T</b>. Comanda: <b>SPC</b> – programe pe calculatoare, nu relee."),
  K("Interfața de abonat și semnalizările", "Placa de abonat din centrală face 7 treburi pentru fiecare telefon analogic.", "<b>BORSCHT</b>: alimentare, protecție la supratensiuni, sonerie, supraveghere (receptor ridicat?), codare (codec PCM), <b>hibrid</b> 2/4 fire, testare. Semnalizări: de abonat (buclă, tonuri, DTMF) și între centrale: <b>CAS</b> (asociată canalului, ex. R2 pe TS16) sau <b>CCS</b> (canal comun, SS7).", EX("T vs. S, BORSCHT, hibridul 2/4 fire, CAS vs. CCS.") + RB("cap. 5")),
]);
L("rad", 2, "ISDN: BRI 2B+D și PRI 30B+D", "🔢", /cap\. (3\.6|7)\b/, [
  K("Digital până la abonat", "ISDN aduce linia digitală până în casă: în loc de o singură convorbire analogică, ai două canale digitale separate.", "<b>BRI</b> = <b>2B + D</b>: 2 × 64 + 16 = <b>144 kbit/s</b> util (192 kbit/s pe interfața S/T, cu încadrare). <b>PRI</b> european = <b>30B + D</b> (D = 64 kbit/s) pe E1 de <b>2,048 Mbit/s</b>; în SUA 23B + D pe T1. Canal <b>B</b> = 64 kbit/s (voce/date), canal <b>D</b> = semnalizare (DSS1/Q.931)."),
  K("Echipamente și puncte de referință", "Ca o priză cu adaptor: NT1 transformă linia de la centrală în „priza” la care pui terminalele.", "Puncte: <b>R – S – T – U</b>. <b>NT1</b>: termină linia U (2 fire) și oferă S/T (4 fire). TE1 = terminal ISDN; TE2 = terminal ne-ISDN, prin <b>TA</b>. Pe magistrala S: până la 8 terminale, dar doar 2 convorbiri simultane.", EX("2B+D = 144 kbit/s, 30B+D pe E1, rolul canalului D, NT1, R/S/T/U.") + RB("cap. 3.6, 7")),
]);
L("rad", 2, "SS7 și rețeaua inteligentă", "🧠", /cap\. (3\.8|3\.13|8|9)\b/, [
  K("SS7 – semnalizarea pe canal comun", "Vocea merge pe un drum, iar „bilețelele” dintre centrale (cine sună pe cine, eliberează linia) merg pe o rețea separată.", "Noduri: <b>SSP</b> (centrala), <b>STP</b> (dirijează mesajele de semnalizare), <b>SCP</b> (baze de date de servicii). Stivă: <b>MTP 1–3</b>, <b>ISUP</b> (apeluri: IAM, ACM, ANM, REL, RLC), SCCP, TCAP. Legături de <b>64 kbit/s</b>. Avantaje: apeluri mai rapide, roaming, SMS, servicii IN. Standard ITU-T seria Q.700."),
  K("Rețeaua inteligentă (IN)", "În loc să programezi fiecare centrală, pui „creierul” serviciului într-un singur loc și centralele îl întreabă.", "SSP detectează un apel special și cere instrucțiuni de la <b>SCP</b> prin SS7 (protocol INAP). Servicii: <b>0800</b> gratuit, <b>0900</b> tarif special, portabilitate, cartele preplătite, VPN, televoting. Standardizare pe etape: CS-1, CS-2.", EX("STP/SSP/SCP, ISUP, 64 kbit/s, ce înseamnă IN și exemple de servicii.") + RB("cap. 3.8, 3.13, 8, 9")),
]);
L("rad", 2, "PLMN: GSM, GPRS, UMTS", "📱", /cap\. (3\.7|10)\b/, [
  K("Arhitectura GSM", "Telefonul vorbește cu antena (BTS); antenele sunt conduse de un BSC; apelurile le face centrala mobilă (MSC), care ține evidența abonaților în registre.", "<b>BSS</b> = BTS + BSC. <b>MSC</b> + registre: <b>HLR</b> (abonații proprii și unde sunt), <b>VLR</b> (vizitatorii din zonă), <b>AuC</b> (chei de autentificare), <b>EIR</b> (IMEI). <b>Handover</b> = convorbirea trece la altă celulă fără întrerupere."),
  K("Frecvențe și evoluție", "GSM împarte banda în purtătoare de 200 kHz, iar fiecare purtătoare în 8 „felii” de timp.", "GSM 900: <b>890–915</b> MHz (de la mobil) / <b>935–960</b> MHz (spre mobil), duplex 45 MHz; DCS 1800: 1710–1785 / 1805–1880 MHz. <b>200 kHz</b>, <b>8 intervale</b> TDMA. <b>GPRS</b> = pachete (SGSN, GGSN). <b>UMTS</b> = W-CDMA, 5 MHz, Node B + RNC.", EX("BTS/BSC/MSC/HLR/VLR, 200 kHz și 8 intervale, benzile GSM 900, GPRS = pachete.") + RB("cap. 3.7, 10")),
]);
L("rad", 3, "Rețele de date: X.25, Frame Relay, ATM", "📦", /cap\. (3\.(9|10|11)|11|12|13)\b/, [
  K("X.25 și Frame Relay", "X.25 verifica fiecare pachet la fiecare nod (bun pe linii proaste, dar lent). Frame Relay are încredere în liniile digitale bune: aruncă cadrele stricate și lasă capetele să le ceară din nou.", "<b>X.25</b>: comutație de pachete, circuite virtuale (SVC/PVC), 3 niveluri (fizic, LAPB, pachet), <b>PAD</b> pentru terminale simple, X.75 între rețele, adrese X.121. <b>Frame Relay</b>: nivel 2, <b>DLCI</b> (circuit virtual, semnificație locală), <b>CIR</b> (debit garantat), bit <b>DE</b>, congestie <b>FECN/BECN</b>."),
  K("ATM și B-ISDN", "ATM taie totul în „cutii” identice de 53 de octeți, ca să poată fi sortate foarte repede în hardware.", "Celula: <b>5 octeți antet + 48 date = 53</b>. Conexiune identificată prin <b>VPI/VCI</b>; <b>HEC</b> protejează doar antetul. Orientat pe conexiune. <b>AAL</b> adaptează: AAL1 voce (CBR), AAL5 date. Clase: CBR, rt-VBR, nrt-VBR, ABR, UBR. Interfețe B-ISDN: 155,52 și 622,08 Mbit/s (pe SDH).", SVG.atmCell() + EX("Celula 53 = 5 + 48, VPI/VCI, DLCI/CIR la Frame Relay, X.25 corectează la fiecare nod.") + RB("cap. 3.9–3.11, 11–13")),
]);
L("rad", 3, "Transmisiuni digitale: PDH, SDH și fibra", "🧬", /cap\. 4\b/, [
  K("PDH – ierarhia plesiocronă", "Plesiocron = „aproape sincron”: fiecare echipament are ceasul lui, aproape la fel; diferențele se umplu cu biți de justificare.", "Europa: <b>E1 2,048</b> → <b>E2 8,448</b> → <b>E3 34,368</b> → <b>E4 139,264 Mbit/s</b> (câte 4 fluxuri din treapta de jos); canale: 30 / 120 / 480 / 1920. Coduri de linie: <b>HDB3</b> (E1–E3), CMI (E4). Dezavantaj: ca să scoți un E1 din E4, demultiplexezi tot."),
  K("SDH – ierarhia sincronă", "SDH are un ceas comun în toată rețeaua, așa că poți „pescui” direct un E1 dintr-un flux mare.", "<b>STM-1 = 155,52 Mbit/s</b> (cadru 9 × 270 octeți în 125 µs) = <b>63 × E1</b> sau 1 × E4; STM-4 = 622,08 Mbit/s; STM-16 ≈ 2,5 Gbit/s; STM-64 ≈ 10 Gbit/s. Echipamente: <b>ADM</b> (add-drop), DXC, regeneratoare. Inele cu autoprotecție &lt; <b>50 ms</b>. SONET: OC-3 = STM-1. Fibra: atenuare mică, bandă mare, fără EMI; LED/laser la emisie, fotodiode PIN/APD la recepție.", SVG.hierTx() + EX("Debitele E1–E4 și STM-1/4/16, 63 × E1 în STM-1, ce face un ADM, plesiocron vs. sincron.") + RB("cap. 4")),
]);
L("rad", 3, "Internet, VoIP și rețele de acces", "🏠", /cap\. (3\.12|14|15)\b/, [
  K("Internet și telefonie prin IP", "Internetul trimite pachete independente; vocea trebuie să ajungă la timp, deci „suferă” la întârzieri și pierderi.", "Comutație de pachete, fără conexiune la nivel IP. VoIP: semnalizare <b>H.323</b> sau <b>SIP</b>, voce pe <b>RTP/UDP</b>; codec <b>G.711</b> = 64 kbit/s, G.729 = 8 kbit/s. Probleme: întârziere, <b>jitter</b>, pierderi → QoS. <b>Gateway VoIP</b> = legătura cu PSTN/ISDN."),
  K("Rețeaua de acces", "Ultimul „kilometru” până la abonat: poate fi cupru, fibră, coaxial sau radio.", "<b>Concentrare</b> (mai mulți abonați pe mai puține căi) vs. <b>multiplexare</b>. Cupru: ADSL (asimetric), HDSL/SDSL (simetric), VDSL (rapid, distanțe scurte). Fibră: <b>FTTH</b>/FTTB/FTTC, <b>PON</b> cu splittere pasive (OLT – ONT). Coaxial: <b>HFC</b>, modem de cablu DOCSIS, CMTS, bandă de urcare partajată. Radio: <b>WLL</b>.", EX("ADSL vs. HDSL vs. VDSL, FTTH, PON, HFC, G.711 = 64 kbit/s, SIP/H.323.") + RB("cap. 3.12, 14, 15")),
]);
