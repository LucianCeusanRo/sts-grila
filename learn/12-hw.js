/* ===== Hardware PC în detaliu – lecții ORIGINALE (subiecte de tip „hardware bible”, explicate simplu) ===== */
(function () {
  function W(vb, inner, title) { return '<figure class="dia"><svg viewBox="' + vb + '" role="img" aria-label="' + (title || "diagramă") + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12">' + inner + "</svg>" + (title ? "<figcaption>" + title + "</figcaption>" : "") + "</figure>"; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 11) + '" font-weight="' + (o.w || 700) + '">' + s + "</text>"; }
  function r(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 4 : o.rx) + '" fill="' + f + '" stroke="' + (o.st || "#334155") + '" stroke-width="1"/>'; }
  SVG.mobo = function () {
    var g = r(4, 4, 472, 292, "#d1fae5", { st: "#065f46", rx: 8 });
    g += r(20, 20, 70, 40, "#e2e8f0") + t(55, 44, "porturi spate", { s: 9.5 });
    g += r(110, 20, 140, 26, "#fde68a") + t(180, 37, "VRM (faze alimentare)", { s: 9.5 });
    g += r(130, 56, 100, 80, "#93c5fd") + t(180, 92, "SOCKET", { s: 12 }) + t(180, 108, "procesor", { s: 10, w: 400 });
    g += r(260, 20, 64, 22, "#fca5a5") + t(292, 35, "EPS 12 V", { s: 9.5 });
    for (var i = 0; i < 4; i++) g += r(340 + i * 18, 20, 12, 140, i % 2 ? "#c4b5fd" : "#a78bfa");
    g += t(373, 178, "RAM (DIMM)", { s: 9.5 });
    g += r(440, 60, 26, 100, "#fca5a5") + t(453, 112, "24p", { s: 9.5 });
    g += r(40, 160, 280, 16, "#fbbf24") + t(180, 172, "PCIe x16 (placa video) – linii de la CPU", { s: 9.5 });
    g += r(130, 140, 100, 14, "#e5e7eb") + t(180, 151, "M.2 (SSD NVMe)", { s: 9 });
    g += r(40, 190, 80, 12, "#fde68a") + t(80, 200, "PCIe x1", { s: 9 });
    g += r(40, 214, 280, 16, "#fbbf24") + t(180, 226, "PCIe x16 fizic (adesea x4)", { s: 9.5 });
    g += r(340, 200, 80, 60, "#cbd5e1") + t(380, 228, "CHIPSET", { s: 10.5 }) + t(380, 244, "(PCH)", { s: 9.5, w: 400 });
    g += r(432, 190, 34, 70, "#e2e8f0") + t(449, 230, "SATA", { s: 8.5 });
    g += r(40, 244, 30, 30, "#e5e7eb", { rx: 15 }) + t(55, 263, "CMOS", { s: 7.5 });
    g += r(90, 250, 110, 22, "#e5e7eb") + t(145, 265, "BIOS/UEFI (flash)", { s: 9 });
    g += r(220, 266, 110, 20, "#e5e7eb") + t(275, 280, "panou frontal", { s: 9 });
    return W("0 0 480 300", g, "Harta unei plăci de bază ATX (simplificat)");
  };
})();
L("pc", 2, "Placa de bază, procesorul și memoria în detaliu", "🧩", /chipset|PCH|socket|VRM|L1|XMP|EXPO|EPS|CL16|iGPU|PWM|DDR4 într-un slot DDR5|dual channel/i, [
  K("Placa de bază = orașul", "Placa de bază e un oraș: procesorul e primăria, memoria RAM e biroul de lângă ea, iar „drumurile” (magistralele) duc spre cartierele cu periferice.", "<b>Socket</b> – soclul procesorului (trebuie să se potrivească: ex. AM5, LGA1700). <b>VRM</b> – coboară 12 V la ~1 V pentru CPU. <b>Chipset (PCH)</b> – SATA, USB, linii PCIe suplimentare, rețea, sunet. Controlerul de memorie și linia x16 pentru placa video sunt azi chiar în procesor.", SVG.mobo()),
  K("Procesorul: nuclee, fire, cache", "Un nucleu e un bucătar. Cu SMT/Hyper-Threading, fiecare bucătar poate supraveghea două oale deodată, dar tot un singur bucătar rămâne.", "Frecvența (GHz) = câte cicluri pe secundă. <b>Cache</b>: L1 (cel mai mic și rapid, în fiecare nucleu) → L2 → L3 (mare, comun). <b>TDP</b> (W) = căldura pe care trebuie s-o evacueze coolerul. Prea cald → <i>thermal throttling</i> (scade frecvența). <b>iGPU</b> = grafică în procesor, folosește din RAM. Ventilatoare cu 4 pini = turație reglată prin PWM."),
  K("Memoria RAM", "Fiecare generație DDR are „cheia” (crestătura) în alt loc, ca un lacăt care nu primește altă cheie.", "DDR3 1,5 V · DDR4 1,2 V · DDR5 1,1 V – nu sunt interschimbabile. Desktop = DIMM, laptop = <b>SO-DIMM</b>. <b>Dual channel</b>: două module identice în sloturile din manual (de obicei aceeași culoare). <b>ECC</b> corectează erorile de un bit (servere). Viteza de pe etichetă se activează cu profilul <b>XMP/EXPO</b>; <b>CL</b> (latența CAS) – mai mic e mai bine la aceeași frecvență.", EX("în ce sloturi pui 2 module pentru dual channel (cele indicate în manual, de obicei A2 + B2) și de ce DDR4 nu intră în slot DDR5.")),
]);
L("pc", 3, "Magistrale, porturi și asamblarea pas cu pas", "🪛", /PCI Express|PCIe|linii|USB4|Thunderbolt|USB-C|distanțier|standoff|asamblarea|pasta termică|panoul frontal|brățării|placă POST|CPU_FAN|SSD NVMe M\.2|2280|NVMe/i, [
  K("Magistralele = autostrăzi", "Vechea magistrală PCI era un singur drum împărțit de toată lumea. PCIe dă fiecărei plăci benzile ei proprii.", "<b>PCIe</b>: linii seriale punct-la-punct; x1/x4/x16 = numărul de linii. Debit pe linie și sens: ~1 GB/s (3.0), ~2 GB/s (4.0), ~4 GB/s (5.0). Vechi: ISA → PCI (133 MB/s) → AGP (grafică). <b>M.2</b> = forma (ex. 2280 = 22 × 80 mm); <b>NVMe</b> = protocolul rapid pe PCIe; SATA III rămâne la ~600 MB/s."),
  K("Porturi", "Conectorul nu spune viteza: un USB-C poate fi lent ca USB 2.0 sau rapid ca Thunderbolt.", "USB 2.0 = 480 Mbit/s · USB 3.2 Gen 1 = 5 Gbit/s · Gen 2 = 10 Gbit/s · USB4/Thunderbolt 4 = 40 Gbit/s. Imagine: HDMI, DisplayPort (VGA/DVI sunt vechi). Sursa ATX: 24 de pini placa, EPS 4+4 procesorul, PCIe 6 pini (75 W) / 8 pini (150 W) placa video; slotul dă încă 75 W."),
  K("Asamblarea în 8 pași", "Ca la LEGO: întâi piesele mici pe placă, abia apoi placa în cutie.", "1) Scoți din priză, brățară antistatică pe metal nevopsit. 2) CPU în socket (triunghiul aliniat), fără forță. 3) Pastă termică – cât un bob de mazăre – și coolerul (CPU_FAN). 4) RAM. 5) Distanțiere, apoi placa în carcasă. 6) Sursa, stocarea (M.2/SATA), placa video în primul x16. 7) Cablurile: 24p, EPS, PCIe, panoul frontal (PWR SW, RESET, LED-uri). 8) Test: intri în UEFI, verifici CPU/RAM/discuri și temperaturile."),
  K("Depanare de la simplu la complex", "Ca la mașină: întâi verifici dacă are benzină, apoi deschizi motorul.", "Nimic nu pornește → priză, întrerupătorul sursei, 24p, butonul. Ventilatoare merg, fără imagine, bipuri/LED DRAM/VGA → reașezi RAM-ul (un singur modul), placa video, EPS. „CPU Fan Error” → coolerul. Clicuri și erori S.M.A.R.T. → backup imediat. O <b>placă POST</b> afișează codul etapei la care s-a oprit pornirea."),
]);
