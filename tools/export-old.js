(async function () {
  try {
    var g = function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
    var A = g("sts_auth2"), L = g("sts_p2"), C = null, note = "";
    if (A && A.token) {
      try {
        var r = await fetch("/api/progress", { headers: { authorization: "Bearer " + A.token }, cache: "no-store" });
        if (r.ok) C = (await r.json()).progress; else note = "Cloud: nu am putut citi (cod " + r.status + "), folosesc doar telefonul.";
      } catch (e) { note = "Cloud: fără internet, folosesc doar telefonul."; }
    }
    if (!L && !C) { alert("Nu am găsit progres pe această pagină. Ești pe site-ul VECHI (sts-grila-ceusan)?"); return; }
    var out = { app: "sts-grila-export", v: 1, t: Date.now(), user: A && A.user || null, local: L, cloud: C };
    var s = JSON.stringify(out);
    var nq = function (p) { return p && p.q ? Object.keys(p.q).length : 0; };
    var d = document.createElement("div");
    d.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:#fff;color:#111;font:16px -apple-system,Arial;padding:16px;overflow:auto";
    var h = document.createElement("div");
    h.innerHTML = "<h2 style='margin:0 0 8px'>Progres gata ✓</h2><p style='margin:0 0 8px'>Cont: <b>" + (out.user || "fără cont") + "</b> · întrebări rezolvate: <b>" + Math.max(nq(L), nq(C)) + "</b><br>" + note + "</p>";
    var ta = document.createElement("textarea");
    ta.value = s; ta.readOnly = true; ta.style.cssText = "width:100%;height:30vh;font:12px monospace;margin:8px 0";
    var msg = document.createElement("p"); msg.style.cssText = "color:#166534;font-weight:700";
    function btn(t, f) { var b = document.createElement("button"); b.textContent = t; b.style.cssText = "display:block;width:100%;padding:16px;margin:8px 0;font-size:18px;border:0;border-radius:12px;background:#2563eb;color:#fff"; b.onclick = f; return b; }
    function copy() {
      ta.focus(); ta.select(); ta.setSelectionRange(0, 1e9);
      var ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
      if (!ok && navigator.clipboard) { navigator.clipboard.writeText(s).then(function () { msg.textContent = "Copiat ✓ Acum deschide site-ul nou și lipește."; }, function () { msg.textContent = "Nu s-a copiat. Ține apăsat în căsuță, Selectează tot, Copiază."; }); return; }
      msg.textContent = ok ? "Copiat ✓ Acum deschide site-ul nou și lipește." : "Nu s-a copiat. Ține apăsat în căsuță, Selectează tot, Copiază.";
    }
    d.appendChild(h);
    d.appendChild(btn("1. Copiază progresul", copy));
    if (navigator.share) d.appendChild(btn("2. Trimite / Salvează (Partajare)", function () { navigator.share({ title: "Progres STS Grilă", text: s }).catch(function () {}); }));
    d.appendChild(btn("Descarcă fișier", function () { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([s], { type: "application/json" })); a.download = "progres-sts-grila.json"; document.body.appendChild(a); a.click(); a.remove(); }));
    d.appendChild(msg); d.appendChild(ta);
    var x = btn("Închide", function () { d.remove(); }); x.style.background = "#64748b"; d.appendChild(x);
    document.body.appendChild(d);
  } catch (e) { alert("Eroare: " + e.message); }
})();
