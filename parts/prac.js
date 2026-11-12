  /* ---------- Simulare probă practică ---------- */
  function ipIn(ip, net, mask) { if (!ipOk(ip) || !ipOk(net) || !ipOk(mask)) return false; var a = ip.split(".").map(Number), b = net.split(".").map(Number), m = mask.split(".").map(Number); for (var k = 0; k < 4; k++) if ((a[k] & m[k]) !== (b[k] & m[k])) return false; return true; }
  function winNew(o) {
    o = o || {};
    return { host: "LAPTOP-STS01", ip: o.ip || "192.168.0.57", mask: o.mask || "255.255.255.0", gw: o.gw === undefined ? "192.168.0.1" : o.gw, dns: o.dns === undefined ? "8.8.8.8" : o.dns, dhcp: o.dhcp !== false, mac: o.mac || "3C-52-82-1A-7F-04", flushed: false, did: {}, hist: [], inet: o.inet !== false, live: o.live || ["192.168.0.1"], reach: o.reach || null, ssh: o.ssh || null,
      cache: ["www.google.com", "login.live.com", "www.cisco.com", "settings-win.data.microsoft.com"] };
  }
  var DNSDB = { "www.google.com": "142.250.180.196", "google.com": "142.250.180.206", "www.cisco.com": "23.205.210.111", "cisco.com": "72.163.4.185", "login.live.com": "20.190.159.68", "www.example.com": "93.184.215.14", "example.com": "93.184.215.14", "settings-win.data.microsoft.com": "51.104.15.252" };
  function winReach(L, ip) {
    if (L.reach) return L.reach(ip);
    if (!ipOk(ip) || !L.ip) return false;
    if (ip === L.ip || ip === "127.0.0.1") return true;
    if (ipIn(ip, L.ip, L.mask)) return L.live.indexOf(ip) >= 0;
    return L.inet && !!L.gw && ipIn(L.gw, L.ip, L.mask) && L.live.indexOf(L.gw) >= 0 && (L.live.indexOf(ip) >= 0 || /^(142|23|72|20|93|51|8)\./.test(ip));
  }
  function winRun(L, line) {
    var raw = line.trim(), low = raw.toLowerCase().replace(/\s+/g, " "), out = [], o = function (x) { out.push(x); };
    if (!raw) return out;
    low = low.replace(/^ipconfig\//, "ipconfig /");
    var tk = low.split(" "), c = tk[0].replace(/\.exe$/, "");
    function dns() { return L.dns && L.inet && winReach(L, L.dns); }
    if (c === "ipconfig") {
      var sw = tk[1] || "";
      if (sw === "/all" || sw === "-all" || sw === "") {
        if (sw) L.did.ipall = 1; else L.did.ip = 1;
        o("Windows IP Configuration"); o("");
        if (sw) { o("   Host Name . . . . . . . . . . . . : " + L.host); o("   Primary Dns Suffix  . . . . . . . : "); o("   Node Type . . . . . . . . . . . . : Hybrid"); o("   IP Routing Enabled. . . . . . . . : No"); o(""); }
        o("Ethernet adapter Ethernet:"); o("");
        o("   Connection-specific DNS Suffix  . : ");
        if (sw) { o("   Description . . . . . . . . . . . : Intel(R) Ethernet Connection (7) I219-V"); o("   Physical Address. . . . . . . . . : " + L.mac); o("   DHCP Enabled. . . . . . . . . . . : " + (L.dhcp ? "Yes" : "No")); o("   Autoconfiguration Enabled . . . . : Yes"); }
        o("   Link-local IPv6 Address . . . . . : fe80::1c4a:9e2f:3b71:52d8%12" + (sw ? "(Preferred)" : ""));
        o("   IPv4 Address. . . . . . . . . . . : " + L.ip + (sw ? "(Preferred)" : ""));
        o("   Subnet Mask . . . . . . . . . . . : " + L.mask);
        o("   Default Gateway . . . . . . . . . : " + (L.gw || ""));
        if (sw) { if (L.dhcp) o("   DHCP Server . . . . . . . . . . . : " + (L.gw || "192.168.0.1")); o("   DNS Servers . . . . . . . . . . . : " + (L.dns || "")); o("   NetBIOS over Tcpip. . . . . . . . : Enabled"); }
        return out;
      }
      if (sw === "/displaydns") { L.did.disp = 1; o("Windows IP Configuration"); o(""); if (L.flushed || !L.cache.length) { o("Could not display the DNS Resolver Cache."); return out; } L.cache.forEach(function (n) { o("    " + n); o("    ----------------------------------------"); o("    Record Name . . . . . : " + n); o("    Record Type . . . . . : 1"); o("    Time To Live  . . . . : " + (60 + n.length * 7)); o("    Data Length . . . . . : 4"); o("    Section . . . . . . . : Answer"); o("    A (Host) Record . . . : " + (DNSDB[n] || "10.0.0.1")); o(""); }); return out; }
      if (sw === "/flushdns") { L.did.flush = 1; L.flushed = true; L.cache = []; o("Windows IP Configuration"); o(""); o("Successfully flushed the DNS Resolver Cache."); return out; }
      if (sw === "/release" || sw === "/renew") { o("Windows IP Configuration"); o(""); if (!L.dhcp) { o("The operation failed as no adapter is in the state permissible for"); o("this operation."); o("(Adresa e statică – /release și /renew merg doar cu DHCP.)"); } else o(sw === "/renew" ? "(Adresa a fost reînnoită de la serverul DHCP.)" : "(Adresa a fost eliberată.)"); return out; }
      if (sw === "/?" ) { o("USAGE: ipconfig [/allcompartments] [/? | /all | /renew [adapter] | /release [adapter] |"); o("       /flushdns | /displaydns | /registerdns | /showclassid | /setclassid ]"); return out; }
      o("Error: unrecognized or incomplete command line."); o(""); o("USAGE: ipconfig [/? | /all | /renew | /release | /flushdns | /displaydns]"); return out;
    }
    if (c === "netstat") {
      var f = tk.slice(1).join(""); L.did.netstat = 1;
      if (/b/.test(f)) { o("The requested operation requires elevation."); o("(netstat -b cere cmd pornit ca Administrator.)"); return out; }
      if (/r/.test(f)) { o("IPv4 Route Table"); o("==========================================================================="); o("Network Destination        Netmask          Gateway       Interface  Metric"); if (L.gw) o("          0.0.0.0          0.0.0.0      " + pad(L.gw, 14) + pad(L.ip, 14) + "  25"); o("        127.0.0.0        255.0.0.0         On-link         127.0.0.1    331"); return out; }
      var n = /n/.test(f), a = /a/.test(f), oo = /o/.test(f);
      o(""); o("Active Connections"); o(""); o("  Proto  Local Address          Foreign Address        State" + (oo ? "           PID" : ""));
      var rows = [];
      if (a) rows.push(["TCP", "0.0.0.0:135", "0.0.0.0:0", "LISTENING", 1104], ["TCP", "0.0.0.0:445", "0.0.0.0:0", "LISTENING", 4], ["UDP", "0.0.0.0:5353", "*:*", "", 2284]);
      if (L.inet) rows.push(["TCP", L.ip + ":50112", n ? "142.250.180.196:443" : "fra16s49-in-f4:https", "ESTABLISHED", 9120], ["TCP", L.ip + ":50140", n ? "20.190.159.68:443" : "login.live.com:https", "TIME_WAIT", 0]);
      rows.push(["TCP", "127.0.0.1:49670", n ? "127.0.0.1:49671" : L.host + ":49671", "ESTABLISHED", 3388]);
      rows.forEach(function (r) { o("  " + pad(r[0], 7) + pad(r[1], 23) + pad(r[2], 23) + pad(r[3], 16) + (oo ? r[4] : "")); });
      if (!n) o("(Sfat: netstat -an afișează numeric și toate porturile ascultate – e mai rapid.)");
      return out;
    }
    if (c === "nslookup") {
      var nm = tk[1];
      if (!nm) { L.did.ns = L.did.ns || 0; o("Default Server:  " + (L.dns === "8.8.8.8" ? "dns.google" : "UnKnown")); o("Address:  " + (L.dns || "")); o(""); o("> (în simulator scrie direct: nslookup www.google.com)"); return out; }
      if (!L.dns || !dns()) { o("DNS request timed out."); o("    timeout was 2 seconds."); o("Default Server:  UnKnown"); o("Address:  " + (L.dns || "")); o(""); o("*** Request to UnKnown timed-out"); o("(Verifică serverul DNS și gateway-ul din setările IPv4.)"); return out; }
      L.did.ns = 1;
      o("Server:  " + (L.dns === "8.8.8.8" ? "dns.google" : "UnKnown")); o("Address:  " + L.dns); o("");
      if (DNSDB[nm]) { o("Non-authoritative answer:"); o("Name:    " + nm); o("Address:  " + DNSDB[nm]); if (!L.flushed || L.cache.indexOf(nm) < 0) L.cache.push(nm); L.flushed = false; }
      else o("*** dns.google can't find " + nm + ": Non-existent domain");
      return out;
    }
    if (c === "ping" || c === "tracert") {
      var tg = tk.filter(function (x, i) { return i > 0 && !/^[-\/]/.test(x) && !/^\d+$/.test(x) || (i > 0 && ipOk(x)); })[0];
      if (!tg) { o("Usage: " + c + " [-t] [-n count] target_name"); return out; }
      var ip = tg;
      if (!ipOk(tg)) { if (!DNSDB[tg] || !dns()) { o("Ping request could not find host " + tg + ". Please check the name and try again."); return out; } ip = DNSDB[tg]; }
      var ok = winReach(L, ip), nn = tk.indexOf("-n") > 0 ? Math.min(+tk[tk.indexOf("-n") + 1] || 4, 6) : 4;
      L.did[c] = L.did[c] || {}; if (ok) L.did[c][ip] = 1;
      if (c === "tracert") { o(""); o("Tracing route to " + tg + (tg !== ip ? " [" + ip + "]" : "")); o("over a maximum of 30 hops:"); o(""); if (!ok) { o("  1     *        *        *     Request timed out."); o("  2     *        *        *     Request timed out."); o("(întrerupt – nicio rută)"); return out; } var hops = ipIn(ip, L.ip, L.mask) ? [ip] : [L.gw, ip]; hops.forEach(function (h, i) { o("  " + (i + 1) + "    <1 ms    <1 ms    <1 ms  " + h); }); o(""); o("Trace complete."); return out; }
      o(""); o("Pinging " + tg + (tg !== ip ? " [" + ip + "]" : "") + " with 32 bytes of data:");
      var noGw = !ipIn(ip, L.ip, L.mask) && (!L.gw || !ipIn(L.gw, L.ip, L.mask));
      for (var i = 0; i < nn; i++) o(ok ? "Reply from " + ip + ": bytes=32 time" + (ipIn(ip, L.ip, L.mask) ? "<1ms" : "=" + (12 + i) + "ms") + " TTL=" + (ipIn(ip, L.ip, L.mask) ? 255 : 117) : noGw ? "PING: transmit failed. General failure." : "Request timed out.");
      o(""); o("Ping statistics for " + ip + ":"); o("    Packets: Sent = " + nn + ", Received = " + (ok ? nn : 0) + ", Lost = " + (ok ? 0 : nn) + " (" + (ok ? 0 : 100) + "% loss),");
      if (tk.indexOf("-t") > 0) o("(-t pingează la infinit; pe un PC real oprești cu Ctrl+C)");
      return out;
    }
    if (c === "ssh") {
      var li = tk.indexOf("-l"), user = li > 0 ? raw.split(/\s+/)[li + 1] : null, host = raw.split(/\s+/).slice(1).filter(function (x, i, arr) { return x !== "-l" && arr[i - 1] !== "-l"; })[0] || "";
      if (host.indexOf("@") > 0) { user = host.split("@")[0]; host = host.split("@")[1]; }
      if (!host) { o("usage: ssh [-l login_name] destination"); return out; }
      if (L.ssh) return L.ssh(user, host);
      o("ssh: connect to host " + host + " port 22: Connection timed out"); return out;
    }
    if (c === "arp") { o(""); o("Interface: " + L.ip + " --- 0xc"); o("  Internet Address      Physical Address      Type"); L.live.forEach(function (x, i) { if (ipIn(x, L.ip, L.mask)) o("  " + pad(x, 22) + pad("00-1e-7a-5c-0" + i + "-b1", 22) + "dynamic"); }); return out; }
    if (c === "getmac") { o(""); o("Physical Address    Transport Name"); o("=================== =========================================================="); o(L.mac + "   \\Device\\Tcpip_{9A1C2F3E-5B6D-4E7F-8A9B-0C1D2E3F4A5B}"); return out; }
    if (c === "hostname") { o(L.host); return out; }
    if (c === "whoami") { o(L.host.toLowerCase() + "\\student"); return out; }
    if (c === "cls") return ["\f"];
    if (c === "ncpa.cpl" || c === "control") { o("(Se deschide „Network Connections”. În simulare: pasul cu setarea IP-ului static.)"); return out; }
    if (c === "devmgmt.msc") { o("(Se deschide Device Manager. În simulare: pasul cu portul COM.)"); return out; }
    if (c === "help" || c === "/?") { o("Comenzi simulate: ipconfig [/all | /displaydns | /flushdns | /release | /renew], netstat [-a -n -o -r], nslookup <nume>, ping <IP/nume> [-n N] [-t], tracert <IP>, arp -a, getmac, hostname, ssh -l <user> <IP>, cls"); return out; }
    if (/^(enable|conf|configure|show|interface|hostname)$/.test(c)) { o("'" + raw.split(/\s+/)[0] + "' is not recognized as an internal or external command,"); o("operable program or batch file."); o("(Asta e comandă Cisco IOS – se dă în PuTTY, pe switch/router, nu în cmd.)"); return out; }
    o("'" + raw.split(/\s+/)[0] + "' is not recognized as an internal or external command,"); o("operable program or batch file.");
    return out;
  }
  /* terminal widgets (embedded) */
  function termBox(el, opt) {
    /* opt: { prompt(), run(line)->lines, complete(val), tip(line,out), lines, cls } */
    var lines = opt.lines, hi = -1, hist = opt.hist || [];
    el.innerHTML = '<div class="term ' + (opt.cls || "") + '" role="log" aria-live="polite"></div><form class="tin" autocomplete="off"><label></label><input autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send" aria-label="Comandă"></form><div class="tkeys">' + (opt.complete ? '<button class="ghost sm" type="button" data-k="tab">Tab</button><button class="ghost sm" type="button" data-k="q">?</button>' : "") + '<button class="ghost sm" type="button" data-k="up">↑</button>' + (opt.hint ? '<button class="ghost sm" type="button" data-k="hint">💡 Indiciu</button>' : "") + "</div>";
    var term = el.querySelector(".term"), inp = el.querySelector("input"), lab = el.querySelector("label");
    function paint() { term.innerHTML = lines.map(function (l) { return '<div class="tline ' + l[1] + '">' + (esc(l[0]) || "&nbsp;") + "</div>"; }).join(""); lab.textContent = opt.prompt(); term.scrollTop = term.scrollHeight; }
    function add(t, c) { lines.push([t, c || ""]); if (lines.length > 300) lines.splice(0, lines.length - 300); }
    function exec(v) {
      var echo = opt.echo ? opt.echo(v) : opt.prompt() + v; add(echo);
      if (v.trim()) { hist.push(v.trim()); hi = -1; }
      var out = []; try { out = opt.run(v); } catch (e) { out = ["(eroare internă a simulatorului)"]; }
      if (out[0] === "\f") { lines.length = 0; out = []; }
      out.forEach(function (l) { add(l, opt.cls2 ? opt.cls2(l) : ""); });
      var tip = opt.tip && opt.tip(v, out); if (tip) add("💡 " + tip, "thint");
      paint(); if (opt.onChange) opt.onChange();
    }
    el.querySelector("form").onsubmit = function (e) { e.preventDefault(); var v = inp.value; inp.value = ""; exec(v); inp.focus(); };
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && opt.complete) { e.preventDefault(); inp.value = opt.complete(inp.value); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (hist.length) { hi = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1); inp.value = hist[hi]; } }
      else if (e.key === "?" && opt.complete) { e.preventDefault(); exec(inp.value + "?"); }
    });
    Array.prototype.forEach.call(el.querySelectorAll("[data-k]"), function (b) { b.onclick = function () { var k = b.getAttribute("data-k"); if (k === "tab") inp.value = opt.complete(inp.value); else if (k === "q") exec(inp.value + "?"); else if (k === "up") { if (hist.length) { hi = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1); inp.value = hist[hi]; } } else if (k === "hint") { add("💡 " + opt.hint(), "thint"); paint(); } inp.focus(); }; });
    paint();
    return { paint: paint, add: add, exec: exec };
  }
  function cliBox(el, s, T, onChange) {
    var lines = [[s.dev === "router" ? "Cisco ISR – consolă 9600 8N1 (simulat)" : "Cisco Catalyst 2960 – consolă 9600 8N1 (simulat)", "thint"], ["Press RETURN to get started!", ""], ["", ""]];
    return termBox(el, { lines: lines, hist: s.hist,
      prompt: function () { return s.pend ? "" : cliPrompt(s); },
      echo: function (v) { return (s.pend ? "" : cliPrompt(s)) + (s.pend && /parola|Password/i.test(lines.length ? lines[lines.length - 1][0] : "") ? "" : v); },
      run: function (v) { return cliRun(s, v); },
      complete: function (v) { return cliComplete(s, v); },
      cls2: function (l) { return /^%(?!SYS|LINK|LINEPROTO|SSH)|^\s*\^$/.test(l) ? "terr" : /^\(|^%LINK|^%LINEPROTO|^%SYS|^%SSH/.test(l) ? "thint" : ""; },
      tip: function (v, out) { return out.some(function (l) { return /Invalid input|Incomplete|Ambiguous|Unknown command/.test(l); }) ? cliTip(s, v) : ""; },
      hint: function () { var g = T.g.filter(function (x) { try { return !x[1](s); } catch (e) { return true; } })[0]; return g ? g[2] + "   (ești în: " + cliPrompt(s) + ")" : "Toate obiectivele sunt bifate."; },
      onChange: onChange });
  }
  function winBox(el, L, hintFn, onChange) {
    return termBox(el, { cls: "wcmd", lines: [["Microsoft Windows [Version 10.0.19045.4529]", ""], ["(c) Microsoft Corporation. All rights reserved.", ""], ["", ""]], hist: L.hist,
      prompt: function () { return "C:\\Users\\student>"; }, run: function (v) { return winRun(L, v); },
      cls2: function (l) { return /^\(/.test(l) ? "thint" : /not recognized|could not find|timed out|failed|General failure|Error/.test(l) ? "terr" : ""; },
      hint: hintFn, onChange: onChange });
  }
  /* SVG-uri pentru pași */
  function rtrRearSvg(sel) {
    var P = [["ge00", "GE 0/0", 40, "#e5e7eb"], ["ge01", "GE 0/1", 92, "#e5e7eb"], ["con", "CON", 162, "#7dd3fc"], ["aux", "AUX", 214, "#1f2937"], ["usb", "USB", 270, "#e5e7eb"], ["ser", "SERIAL 0/0/0", 340, "#e5e7eb"]];
    var h = '<svg viewBox="0 0 440 170" class="prsvg" role="img" aria-label="Spatele unui router Cisco ISR (schemă)" font-family="system-ui,Arial"><rect x="4" y="18" width="432" height="120" rx="8" fill="#374151" stroke="#111"/><text x="14" y="34" font-size="10" fill="#cbd5e1">Cisco ISR – panoul din spate (schemă simplificată)</text><rect x="318" y="44" width="110" height="80" rx="4" fill="#4b5563" stroke="#9ca3af" stroke-dasharray="3 2"/><text x="373" y="120" font-size="8" fill="#cbd5e1" text-anchor="middle">slot EHWIC</text><circle cx="420" cy="30" r="5" fill="#22c55e"/><text x="404" y="33" font-size="8" fill="#cbd5e1" text-anchor="end">PWR</text>';
    P.forEach(function (p) {
      var on = sel && sel.indexOf(p[0]) >= 0, x = p[2], w = p[0] === "usb" ? 30 : p[0] === "ser" ? 70 : 40, hgt = p[0] === "usb" ? 14 : 32, y = p[0] === "usb" ? 70 : 62;
      h += '<g class="prport" data-p="' + p[0] + '" role="button" tabindex="0" aria-label="Port ' + p[1] + '"><rect x="' + (x - 6) + '" y="46" width="' + (w + 12) + '" height="76" rx="5" fill="' + (on ? "#facc15" : "transparent") + '" opacity=".55"/><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hgt + '" rx="3" fill="' + p[3] + '" stroke="#111"/>' + (p[0] === "ser" ? '<rect x="' + (x + 8) + '" y="' + (y + 8) + '" width="54" height="16" rx="3" fill="#111"/>' : p[0] === "usb" ? "" : '<rect x="' + (x + 10) + '" y="' + (y + 8) + '" width="20" height="16" fill="#111"/>') + '<text x="' + (x + w / 2) + '" y="112" font-size="10" font-weight="700" fill="#f9fafb" text-anchor="middle">' + p[1] + "</text></g>";
    });
    return h + '<text x="220" y="160" font-size="10" fill="currentColor" text-anchor="middle">Atinge portul. CON = albastru deschis (consolă), AUX = negru (modem), GE = porturi de date Gigabit.</text></svg>';
  }
  function otdrSvg() {
    var h = '<svg viewBox="0 0 440 230" class="prsvg" role="img" aria-label="Urmă OTDR cu evenimentele A, B, C și D" font-family="system-ui,Arial"><rect x="0" y="0" width="440" height="230" rx="8" fill="#0b1220"/>';
    for (var i = 0; i <= 10; i++) h += '<line x1="' + (40 + i * 38) + '" y1="20" x2="' + (40 + i * 38) + '" y2="190" stroke="#1e293b"/><text x="' + (40 + i * 38) + '" y="204" font-size="9" fill="#94a3b8" text-anchor="middle">' + i + "</text>";
    for (var j = 0; j <= 4; j++) h += '<line x1="40" y1="' + (20 + j * 42) + '" x2="420" y2="' + (20 + j * 42) + '" stroke="#1e293b"/>';
    h += '<text x="230" y="222" font-size="10" fill="#94a3b8" text-anchor="middle">distanță (km)</text><text x="14" y="110" font-size="10" fill="#94a3b8" transform="rotate(-90 14 110)" text-anchor="middle">dB</text>';
    h += '<path d="M40 190 L44 30 L50 52 L56 60 L161 77 L163 88 L287 108 L289 92 L292 112 L296 116 L382 130 L384 40 L390 168 L398 182 L406 176 L414 186 L420 180" fill="none" stroke="#facc15" stroke-width="2"/>';
    [["A", 46, 26], ["B", 162, 72], ["C", 289, 86], ["D", 384, 34]].forEach(function (e) { h += '<circle cx="' + e[1] + '" cy="' + e[2] + '" r="9" fill="#2563eb"/><text x="' + e[1] + '" y="' + (e[2] + 4) + '" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">' + e[0] + "</text>"; });
    return h + "</svg>";
  }
  function testerSvg(remote, title) {
    var h = '<svg viewBox="0 0 440 150" class="prsvg" role="img" aria-label="' + esc(title) + '" font-family="system-ui,Arial"><rect x="6" y="10" width="200" height="130" rx="10" fill="#1f2937"/><rect x="234" y="10" width="200" height="130" rx="10" fill="#1f2937"/><text x="106" y="30" font-size="11" fill="#e5e7eb" text-anchor="middle">MAIN (unitatea principală)</text><text x="334" y="30" font-size="11" fill="#e5e7eb" text-anchor="middle">REMOTE (capătul celălalt)</text>';
    for (var i = 0; i < 8; i++) { var x = 28 + i * 22, r = remote[i]; h += '<circle cx="' + x + '" cy="70" r="8" fill="#22c55e"/><text x="' + x + '" y="98" font-size="11" fill="#e5e7eb" text-anchor="middle">' + (i + 1) + '</text><circle cx="' + (x + 228) + '" cy="70" r="8" fill="' + (r ? "#22c55e" : "#374151") + '" stroke="#6b7280"/><text x="' + (x + 228) + '" y="98" font-size="11" fill="#e5e7eb" text-anchor="middle">' + (r || "–") + "</text>"; }
    return h + '<text x="220" y="128" font-size="10" fill="#e5e7eb" text-anchor="middle">Rândul de jos = ce LED se aprinde la REMOTE când MAIN aprinde 1, 2, … 8</text></svg>';
  }
  function photoNoCap(k) { var p = PHOTOS[k]; if (!p) return ""; return '<figure class="ph"><img src="' + p.f + '" width="' + p.w + '" height="' + p.h + '" loading="lazy" decoding="async" alt="Echipament de identificat"><figcaption><small>Foto: ' + p.a + " · " + p.l + " · Wikimedia Commons</small></figcaption></figure>"; }
  /* întrebări cu 4 variante în pași */
  function mcqHtml(qs, pre) { return qs.map(function (q, i) { var ord = q._o || (q._o = shuffle([0, 1, 2, 3])); return '<div class="prq" data-q="' + i + '">' + (q.ph ? (q.nocap ? photoNoCap(q.ph) : PH(q.ph)) : "") + (q.svg || "") + '<p class="prqt"><b>' + (pre || "") + (i + 1) + ".</b> " + q.q + '</p><div class="opts">' + ord.map(function (k) { return '<button class="opt" data-k="' + k + '">' + esc(q.o[k]) + "</button>"; }).join("") + '</div><div class="prfb"></div></div>'; }).join(""); }
  function mcqWire(root, qs, res, onAll) {
    Array.prototype.forEach.call(root.querySelectorAll(".prq"), function (box) {
      var i = +box.getAttribute("data-q"), q = qs[i];
      Array.prototype.forEach.call(box.querySelectorAll(".opt"), function (b) { b.onclick = function () {
        if (res[i] !== undefined) return; var k = +b.getAttribute("data-k"); res[i] = k === 0;
        Array.prototype.forEach.call(box.querySelectorAll(".opt"), function (x) { x.disabled = true; var kk = +x.getAttribute("data-k"); if (kk === 0) x.classList.add("good"); else if (x === b) x.classList.add("bad"); });
        box.querySelector(".prfb").innerHTML = '<div class="' + (k === 0 ? "fact tok" : "eli trapw") + ' small">' + (k === 0 ? "✅ " : "❌ Corect: <b>" + esc(q.o[0]) + "</b>. ") + (q.e || "") + "</div>";
        if (k === 0) SND.ok(); else SND.bad();
        if (onAll && res.filter(function (x) { return x !== undefined; }).length === qs.length) onAll();
      }; });
    });
  }
  var PR_ID_OPTS = ["Router", "Switch", "Switch compact (de birou)", "Patch panel"];
  var PR_DIFF = { q: "Examinatorul întreabă: care e diferența dintre switch și router?", o: ["Switch-ul leagă dispozitive din ACEEAȘI rețea după adresa MAC (nivel 2); routerul leagă rețele DIFERITE după adresa IP (nivel 3)", "Switch-ul lucrează cu adrese IP, routerul cu adrese MAC", "Routerul are mereu mai multe porturi decât switch-ul", "Nu există nicio diferență, sunt două denumiri pentru același aparat"], e: "Truc vizual: switch-ul are un șir lung de porturi identice numerotate (8/24/48); routerul are puține porturi diferite (GE 0/0, GE 0/1, CON, AUX, USB, sloturi de module)." };
  function prVariants() {
    var X = 20 + Math.floor(Math.random() * 40);
    return [
      { id: 1, t: "Varianta 1 – ca la examen", d: "Exact pașii relatați de candidat: identificare echipamente, mufare RJ45, switch → router, comenzi pe laptop, IP static, Device Manager, PuTTY, SSH pe switch cu VLAN.", min: 45, steps: [
        { k: "id", t: "Identifică echipamentele de pe masă", pts: 10, items: [["sw2960", 1, "Switch în rack: zeci de porturi RJ45 identice, cu patch-cord-uri."], ["rtr2800", 0, "Router ISR: carcasă plată, puține porturi, sloturi de module; pe față doar LED-uri."], ["sgback", 2, "Switch mic, de birou, cu 8 porturi numerotate – „switch-ul alb de deasupra”."], ["router", 0, "Router Cisco seria 1900: porturi GE 0/0, GE 0/1, CON, AUX, USB și sloturi EHWIC."], ["swports", 1, "Rânduri de porturi RJ45 numerotate – switch de 48 de porturi."]], diff: PR_DIFF },
        { k: "rj", t: "Mufează un cablu RJ45 (T568B) și testează-l", pts: 15, q: { q: "Ai mufat ambele capete T568B. Pe tester, LED-urile MAIN 1…8 și REMOTE 1…8 se aprind în ordine. Ce cablu ai făcut și unde îl folosești?", o: ["Cablu drept (straight-through) – de exemplu switch ↔ router sau PC ↔ switch", "Cablu crossover – numai switch ↔ router", "Cablu rollover (de consolă)", "Cablu defect – LED-urile trebuiau să se aprindă invers"], e: "B–B (sau A–A) = drept. A la un capăt și B la celălalt = crossover (1↔3, 2↔6)." } },
        { k: "port", t: "Conectează switch-ul la router", pts: 10, clicks: [{ q: "Cablul care vine din switch intră în routerul din spate. Atinge portul corect.", ok: ["ge00", "ge01"], e: "Datele merg în portul GigabitEthernet (GE 0/0 sau GE 0/1, în stânga). CON e doar pentru configurare cu cablul albastru de consolă." }], qs: [{ q: "În ce port intră celălalt capăt, pe switch?", o: ["În oricare port de date (Fa0/x sau Gi0/x), nu în Console", "Doar în portul Console", "Doar în ultimul port, altfel nu merge", "În portul de alimentare PoE"], e: "Orice port de date de pe switch merge (de obicei Gi0/1 – uplink). Portul Console e doar pentru cablul de configurare." }, { q: "Ai legat cablul, dar LED-ul portului de la router nu se aprinde. Cel mai probabil:", o: ["Interfața routerului e oprită implicit – trebuie no shutdown", "Cablul trebuia să fie rollover", "Switch-ul trebuie repornit de fiecare dată", "Routerul nu are voie să fie legat la switch"], e: "Pe router toate interfețele pornesc în „administratively down”. După interface g0/0 → no shutdown LED-ul devine verde." }] },
        { k: "cmd", t: "Comenzi pe laptop (cmd)", pts: 15, L: { ip: "192.168.0.57", gw: "192.168.0.1", dns: "8.8.8.8" }, goals: [["ipconfig /all (vezi MAC-ul)", function (L) { return L.did.ipall; }, "ipconfig /all"], ["netstat (conexiunile active)", function (L) { return L.did.netstat; }, "netstat -an"], ["ipconfig /displaydns", function (L) { return L.did.disp; }, "ipconfig /displaydns"], ["ipconfig /flushdns", function (L) { return L.did.flush; }, "ipconfig /flushdns"], ["nslookup cu răspuns", function (L) { return L.did.ns === 1; }, "nslookup www.google.com"]], q: function (L) { return { q: "Din ipconfig /all: care e adresa fizică (MAC) a plăcii Ethernet?", o: [L.mac, "192.168.0.57", "FE80::1C4A:9E2F", "00-00-00-00-00-00"], e: "Linia „Physical Address” = MAC-ul (48 de biți, 12 cifre hexa). IP-ul e logic, MAC-ul e „ars” în placa de rețea." }; } },
        { k: "ip", t: "Setează IP static din foaie", pts: 10, tg: { ip: "192.168.0." + X, mask: "255.255.255.0", gw: "192.168.0.1", dns: "8.8.8.8" } },
        { k: "dev", t: "Device Manager: găsește portul COM al cablului de consolă", pts: 5 },
        { k: "putty", t: "PuTTY: conexiune serială pe consolă", pts: 10 },
        { k: "cli", t: "Terminal Cisco: SSH pe switch cu VLAN", pts: 25, task: "ssh" }] },
      { id: 2, t: "Varianta 2 – router, IP pe interfețe, ping între PC-uri", d: "Variantă plauzibilă: cablu crossover PC–router, IP pe două interfețe de router, IP static pe PC și test cu ping/tracert.", min: 40, steps: [
        { k: "id", t: "Identifică echipamentele", pts: 10, items: [["router", 0, "Router Cisco 1900: puține porturi diferite și sloturi de module."], ["sg300", 1, "Switch de 28 de porturi, format rack 1U."], ["sgfront", 2, "Switch compact de birou, 8 porturi, fără ventilator."]], diff: PR_DIFF },
        { k: "rj", t: "Mufează cablul pentru PC1 → router (direct)", pts: 15, q: { q: "PC1 se leagă DIRECT în routerul R1 (fără switch). Ce cablu face standardul clasic cerut la examen?", o: ["Crossover: T568A la un capăt, T568B la celălalt", "Drept: T568B la ambele capete", "Rollover albastru", "Cablu coaxial"], e: "Echipamente de același tip (PC–router, switch–switch, PC–PC) = crossover. Diferite (PC–switch, switch–router) = drept. Azi Auto-MDIX corectează automat, dar la examen se cere regula." } },
        { k: "port", t: "Leagă cablurile la router", pts: 10, clicks: [{ q: "PC1 e în rețeaua 192.168.1.0/24, care va fi pe G0/0. Atinge portul pentru PC1.", ok: ["ge00"], e: "G0/0 = GE 0/0." }, { q: "Acum cablul albastru de consolă, pentru configurare. Atinge portul.", ok: ["con"], e: "CON (albastru deschis). AUX e pentru modem, nu pentru consolă." }], qs: [{ q: "PC2 (192.168.2.10) intră în:", o: ["GE 0/1, care va avea 192.168.2.1/24", "Tot în GE 0/0, lângă PC1", "Portul AUX", "Portul USB"], e: "Două rețele diferite = două interfețe diferite de router." }] },
        { k: "ip", t: "IP static pe PC1", pts: 10, tg: { ip: "192.168.1.10", mask: "255.255.255.0", gw: "192.168.1.1", dns: "" } },
        { k: "cli", t: "Terminal Cisco: configurează R1", pts: 30, task: "rtr2" },
        { k: "cmd", t: "Testează de pe PC1", pts: 15, L: { ip: "192.168.1.10", gw: "192.168.1.1", dns: "", inet: false, dhcp: false, live: ["192.168.1.1", "192.168.2.1", "192.168.2.10"] }, useIp: true, goals: [["ipconfig (verifici IP-ul)", function (L) { return L.did.ip || L.did.ipall; }, "ipconfig"], ["ping gateway 192.168.1.1 reușit", function (L) { return L.did.ping && L.did.ping["192.168.1.1"]; }, "ping 192.168.1.1"], ["ping PC2 192.168.2.10 reușit", function (L) { return L.did.ping && L.did.ping["192.168.2.10"]; }, "ping 192.168.2.10"], ["tracert 192.168.2.10", function (L) { return L.did.tracert && L.did.tracert["192.168.2.10"]; }, "tracert 192.168.2.10 (vezi 2 salturi: gateway, apoi PC2)"]] },
        { k: "mcq", t: "Depanare rapidă", pts: 10, qs: [{ q: "PC1 dă ping în 192.168.1.1, dar nu în PC2. Ce verifici ÎNTÂI?", o: ["Gateway-ul lui PC2 (trebuie 192.168.2.1) și că G0/1 e up/up", "Masca de pe PC1 trebuie schimbată în 255.0.0.0", "Cablul de consolă", "Să repornești PC1 de 3 ori"], e: "Răspunsul ping trebuie să se întoarcă: PC2 fără gateway corect nu știe să răspundă în altă rețea." }, { q: "La ping primești „PING: transmit failed. General failure.”. Ce înseamnă de obicei?", o: ["Placa nu are IP valid sau gateway în aceeași rețea (setări IPv4 greșite / cablu scos)", "Destinația a răspuns prea repede", "Routerul a blocat ICMP cu o regulă ACL", "Totul e în regulă"], e: "„General failure” = PC-ul nici n-a putut trimite pachetul (problemă locală)." }] }] },
      { id: 3, t: "Varianta 3 – VLAN + trunk + router-on-a-stick, fibră/OTDR, test de cablu", d: "Variantă plauzibilă: identifici conectori de fibră și citești un OTDR, interpretezi testerul de cablu, apoi configurezi VLAN-uri cu trunk pe switch și sub-interfețe pe router.", min: 45, steps: [
        { k: "mcq", t: "Identifică conectorii de fibră", pts: 15, qs: [{ ph: "sc", nocap: true, q: "Ce conector e în fotografie (pătrat, push-pull, ~2,5 mm)?", o: ["SC", "LC", "ST", "RJ45"], e: "SC = pătrat, se împinge și se trage. LC = mic (1,25 mm), cu clemă. ST = rotund, baionetă." }, { ph: "lc", nocap: true, q: "Și acesta (mic, cu clemă, de obicei duplex în switch-uri/SFP)?", o: ["LC", "SC", "ST", "FC"], e: "LC = „Little/Lucent Connector”, jumătate cât SC – standard în modulele SFP." }, { ph: "st", nocap: true, q: "Conector rotund cu baionetă (răsucești un sfert de tură):", o: ["ST", "LC", "SC", "MTP"], e: "ST = „straight tip”, baionetă, mai vechi, des întâlnit pe multimod." }, { q: "Un conector VERDE față de unul ALBASTRU înseamnă:", o: ["Verde = APC (șlefuit la 8°), albastru = UPC – nu se cuplează între ele", "Verde = multimod, albastru = monomod, se pot cupla", "Verde = mai scump, altfel identici", "Verde = cupru, albastru = fibră"], e: "APC (unghi 8°) are reflexie foarte mică; dacă îl cuplezi cu UPC (drept) rămâne aer între fețe → pierderi mari și poți zgâria fețele." }] },
        { k: "mcq", t: "Citește urma OTDR", pts: 15, svg: true, qs: [{ svg: otdrSvg(), q: "Evenimentul B (o mică treaptă în jos, FĂRĂ vârf) este de obicei:", o: ["O sudură prin fuziune (pierdere mică, nereflexivă)", "Un conector (are mereu vârf)", "Capătul fibrei", "Zona moartă a aparatului"], e: "Sudura = treaptă mică fără reflexie (~0,05–0,1 dB). Conectorul = vârf (reflexie) + treaptă." }, { q: "Vârful mare D urmat de zgomot (la ~9 km):", o: ["Capătul fibrei sau o rupere (reflexie Fresnel, apoi nu mai e semnal)", "O sudură foarte bună", "Un splitter optic", "Un amplificator"], e: "După capătul fibrei OTDR-ul vede doar zgomot. Distanța până la vârf = lungimea fibrei sau locul ruperii." }, { q: "Ce arată panta liniei dintre evenimente?", o: ["Atenuarea fibrei, în dB/km (ex. ~0,35 dB/km la 1310 nm)", "Viteza internetului", "Numărul de clienți", "Puterea laserului de la abonat"], e: "Cu cât linia coboară mai abrupt, cu atât fibra atenuează mai mult pe kilometru." }] },
        { k: "mcq", t: "Interpretează testerul de cablu", pts: 10, qs: [{ svg: testerSvg([3, 6, 1, 4, 5, 2, 7, 8], "Tester: remote 3 6 1 4 5 2 7 8"), q: "Ce cablu ai pe tester?", o: ["Crossover (T568A la un capăt, T568B la celălalt): 1↔3, 2↔6", "Drept, corect", "Rollover", "Cablu cu pinul 7 întrerupt"], e: "Perechile portocalie și verde sunt inversate între capete: semnul crossover-ului." }, { svg: testerSvg([1, 2, 3, 4, 5, 6, 0, 8], "Tester: remote pinul 7 nu se aprinde"), q: "LED-ul 7 de la REMOTE nu se aprinde deloc. Ce faci?", o: ["Firul 7 nu face contact (circuit deschis) – tai mufa și refaci", "E normal, pinul 7 nu se folosește niciodată", "Schimbi bateria testerului", "Lipești firul cu bandă izolatoare"], e: "La examen orice LED lipsă = cablu respins. Cauze: fir prea scurt, neîmpins până la capăt, sertizare slabă." }] },
        { k: "cli", t: "Terminal Cisco: VLAN-uri + trunk pe switch", pts: 25, task: "trunk" },
        { k: "cli", t: "Terminal Cisco: router-on-a-stick pe R1", pts: 25, task: "roas" },
        { k: "cmd", t: "Testează rutarea între VLAN-uri", pts: 10, L: { ip: "192.168.10.10", gw: "192.168.10.1", dns: "", inet: false, dhcp: false }, roas: true, goals: [["ping gateway VLAN 10 (192.168.10.1) reușit", function (L) { return L.did.ping && L.did.ping["192.168.10.1"]; }, "ping 192.168.10.1"], ["ping PC din VLAN 20 (192.168.20.10) reușit", function (L) { return L.did.ping && L.did.ping["192.168.20.10"]; }, "ping 192.168.20.10"]] }] }
    ];
  }
  function prDevHtml(com, open, picked) {
    var cats = [["Audio inputs and outputs"], ["Batteries"], ["Bluetooth"], ["Computer"], ["Disk drives"], ["Display adapters"], ["Keyboards"], ["Mice and other pointing devices"], ["Network adapters", ["Intel(R) Ethernet Connection (7) I219-V", "Intel(R) Wi-Fi 6 AX201 160MHz"]], ["Ports (COM & LPT)", ["Communications Port (COM1)", "Prolific USB-to-Serial Comm Port (COM" + com + ")"]], ["Universal Serial Bus controllers", ["USB Root Hub (USB 3.0)"]]];
    return '<div class="dmwin"><div class="dmbar">Device Manager</div><ul class="dmtree"><li class="dmroot">💻 ' + "LAPTOP-STS01" + "</li>" + cats.map(function (c, i) { var isOpen = open[i]; return '<li><button class="dmcat" data-c="' + i + '" aria-expanded="' + (isOpen ? "true" : "false") + '">' + (c[1] ? (isOpen ? "▾ " : "▸ ") : "▸ ") + esc(c[0]) + "</button>" + (isOpen && c[1] ? '<ul>' + c[1].map(function (d) { return '<li><button class="dmdev' + (picked === d ? " on" : "") + '" data-d="' + esc(d) + '">' + esc(d) + "</button></li>"; }).join("") + "</ul>" : "") + "</li>"; }).join("") + "</ul></div>";
  }
  var PRS = null;
  function vPrac(vid) {
    view = "practice"; navbar(true);
    if (!vid) {
      var hist = P.exams.filter(function (e) { return e.k === "prac"; }).slice(-8).reverse(), V = prVariants();
      var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICA.plug + ' Simulare probă practică</h2><p class="muted small">La fel ca în sală: lucrezi pas cu pas, fiecare pas primește puncte, la final primești nota (1–10). Minim <b>7</b> ca să treci. Pașii nu se pot relua după ce îi predai – exact ca la examen. La sală tragi la sorți un plic: Varianta 1 urmează relatarea candidatului, 2 și 3 sunt variante plauzibile din tematică.</p>' +
        V.map(function (v) { return '<div class="prv"><h3>' + esc(v.t) + '</h3><p class="small">' + esc(v.d) + '</p><p class="muted small">' + v.steps.length + " pași · țintă ~" + v.min + ' min</p><button class="big" data-v="' + v.id + '">Începe ' + esc(v.t.split(" – ")[0]) + "</button></div>"; }).join("") + "</section>";
      h += '<section class="card"><h2>Rezultatele tale</h2>' + (hist.length ? hist.map(function (e) { return '<div class="crow"><span>' + fmtDate(e.t) + " · Varianta " + e.v + '</span><b class="' + (e.g >= 7 ? "okc" : "badc") + '">' + fmtG(e.g) + "</b><span>" + e.c + "/100" + (e.g >= 7 ? " · admis" : " · respins") + "</span></div>"; }).join("") : '<p class="muted">Nicio simulare practică încă.</p>') + "</section>";
      app.innerHTML = h;
      $("backBtn").onclick = function () { go("practice"); };
      Array.prototype.forEach.call(app.querySelectorAll("[data-v]"), function (b) { b.onclick = function () { PRS = null; vPrac(+b.getAttribute("data-v")); }; });
      return;
    }
    if (!PRS || PRS.v !== vid) { var VV = prVariants().filter(function (x) { return x.id === vid; })[0]; PRS = { v: vid, V: VV, i: 0, sc: [], t0: Date.now(), L: winNew(), com: 3 + Math.floor(Math.random() * 5), cli: {} }; }
    var S = PRS, st = S.V.steps[S.i];
    if (!st) return prResult();
    var el = Math.round((Date.now() - S.t0) / 60000);
    var h2 = '<section class="card prcard"><div class="prhd"><button class="back" id="prQuit">‹ Renunț</button><span class="muted small">' + esc(S.V.t.split(" – ")[0]) + " · pasul " + (S.i + 1) + "/" + S.V.steps.length + " · " + el + " min din ~" + S.V.min + '</span></div><div class="bar"><i style="width:' + Math.round(100 * S.i / S.V.steps.length) + '%"></i></div><h2>' + (S.i + 1) + ". " + esc(st.t) + ' <span class="pill">' + st.pts + ' p</span></h2><div id="prBody"></div><div id="prFb"></div><button class="big" id="prNext">Predau pasul ›</button></section>';
    app.innerHTML = h2;
    $("prQuit").onclick = function () { if (confirm("Ieși din simulare? Pașii făcuți se pierd.")) { PRS = null; vPrac(); } };
    var body = $("prBody"), nextB = $("prNext"), scoreFn = function () { return 0; }, fb = "";
    function done(frac, msg) { S.sc.push({ t: st.t, p: Math.round(st.pts * Math.max(0, Math.min(1, frac)) * 10) / 10, m: st.pts }); S.i++; if (msg) { $("prFb").innerHTML = msg; } vPrac(vid); window.scrollTo(0, 0); }
    if (st.k === "id") {
      var qs = st.items.map(function (it) { return { ph: it[0], nocap: true, q: "Ce echipament e acesta?", o: [PR_ID_OPTS[it[1]]].concat(PR_ID_OPTS.filter(function (x, j) { return j !== it[1]; })), e: it[2] }; }).concat([st.diff]);
      var res = []; body.innerHTML = '<p class="small">Pe masă: switch-uri jos, routere, un switch mic deasupra. Le poți lua în mână și întoarce. Pentru fiecare: ce e?</p>' + mcqHtml(qs);
      mcqWire(body, qs, res); scoreFn = function () { return res.filter(Boolean).length / qs.length; };
    } else if (st.k === "mcq") {
      var qs2 = st.qs, res2 = []; body.innerHTML = mcqHtml(qs2); mcqWire(body, qs2, res2); scoreFn = function () { return res2.filter(Boolean).length / qs2.length; };
    } else if (st.k === "rj") {
      var want = T568.B, got = [], pool = shuffle(want.slice()), ordOk = null, res3 = [];
      var paintRj = function () {
        body.innerHTML = '<p class="small">Ai pe masă: cablu UTP Cat5e, clește de sertizat cu lamă, 2 mufe RJ45, tester. Dezizolezi ~2,5 cm, desfaci perechile, le îndrepți, le aranjezi T568B și tai drept la ~1,3 cm. <b>Clema în jos, pinul 1 în stânga.</b> Atinge firele în ordinea 1 → 8 (atinge un pin ca să scoți firul).</p>' + PH("rj45") +
          '<div class="rjplug">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { var n = got[i], cls = ordOk !== null && n ? (n === want[i] ? " ok" : " bad") : ""; return '<button class="rjpin' + cls + '" data-i="' + i + '"' + (n && ordOk === null ? "" : " disabled") + '><i>' + (i + 1) + "</i>" + (n ? wireSw(n) + "<small>" + n.replace("alb-", "alb-<br>") + "</small>" : "<small>—</small>") + "</button>"; }).join("") + '</div><div class="rjpool">' + (ordOk === null ? pool.map(function (n, k) { return got.indexOf(n) >= 0 ? "" : '<button class="rjw" data-k="' + k + '">' + wireSw(n) + n + "</button>"; }).join("") : "") + "</div>" +
          (ordOk === null ? '<button class="ghost" id="rjSert"' + (got.length < 8 ? " disabled" : "") + ">Sertizez și testez</button>" : '<div class="' + (ordOk ? "fact tok" : "eli trapw") + ' small">' + (ordOk ? "✅ Testerul: 1-2-3-4-5-6-7-8 în ordine la ambele capete." : "❌ Testerul arată fire inversate – la examen ai fi refăcut mufa (timp pierdut). Corect: " + want.map(function (n, i) { return (i + 1) + "=" + n; }).join(", ")) + "</div>" + mcqHtml([st.q]));
        Array.prototype.forEach.call(body.querySelectorAll(".rjw"), function (b) { b.onclick = function () { got.push(pool[+b.getAttribute("data-k")]); paintRj(); }; });
        Array.prototype.forEach.call(body.querySelectorAll(".rjpin"), function (b) { b.onclick = function () { got.splice(+b.getAttribute("data-i"), 1); paintRj(); }; });
        if ($("rjSert")) $("rjSert").onclick = function () { ordOk = got.every(function (n, i) { return n === want[i]; }); if (ordOk) SND.ok(); else SND.bad(); paintRj(); };
        if (ordOk !== null) mcqWire(body, [st.q], res3);
      };
      paintRj(); scoreFn = function () { return (ordOk ? 0.6 : 0) + (res3[0] ? 0.4 : 0); };
    } else if (st.k === "port") {
      var ci = 0, cres = [], res4 = [];
      var paintP = function () {
        var cur = st.clicks[ci];
        body.innerHTML = (cur ? '<p class="prqt"><b>' + esc(cur.q) + "</b></p>" : "") + rtrRearSvg(cres.map(function (x) { return x.p; })) + '<div id="prPf">' + cres.map(function (r, i) { return '<div class="' + (r.ok ? "fact tok" : "eli trapw") + ' small">' + (r.ok ? "✅ " : "❌ ") + esc(st.clicks[i].e) + "</div>"; }).join("") + "</div>" + (cur ? "" : mcqHtml(st.qs));
        Array.prototype.forEach.call(body.querySelectorAll(".prport"), function (g) { g.onclick = function () { if (!st.clicks[ci]) return; var p = g.getAttribute("data-p"), ok = st.clicks[ci].ok.indexOf(p) >= 0; cres.push({ p: p, ok: ok }); if (ok) SND.ok(); else SND.bad(); ci++; paintP(); }; });
        if (!cur) mcqWire(body, st.qs, res4);
      };
      paintP(); scoreFn = function () { var n = st.clicks.length + st.qs.length; return (cres.filter(function (x) { return x.ok; }).length + res4.filter(Boolean).length) / n; };
    } else if (st.k === "cmd") {
      var L = winNew(st.L); if (st.useIp) { L.ip = S.L.ip || L.ip; L.mask = S.L.mask || L.mask; L.gw = S.L.gw; L.dhcp = false; }
      if (st.roas) { var rs = S.cli.roas, ts = S.cli.trunk; L.reach = function (ip) { var r = !!rs && !rs.ifs["GigabitEthernet0/0"].shut, sw = !!ts && ts.ifs["GigabitEthernet0/1"].mode === "trunk" && ts.ifs["FastEthernet0/1"].vlan === 10; if (ip === "192.168.10.1") return r && sw && !!rs.ifs["GigabitEthernet0/0.10"] && rs.ifs["GigabitEthernet0/0.10"].enc === 10 && rs.ifs["GigabitEthernet0/0.10"].ip === "192.168.10.1"; if (ip === "192.168.20.10") return r && sw && !!rs.ifs["GigabitEthernet0/0.20"] && rs.ifs["GigabitEthernet0/0.20"].enc === 20 && rs.ifs["GigabitEthernet0/0.20"].ip === "192.168.20.1" && ts.ifs["FastEthernet0/2"].vlan === 20 && L.reach("192.168.10.1"); return ip === L.ip; }; }
      if (st.useIp && S.cli.rtr2) { var r2 = S.cli.rtr2; L.reach = function (ip) { var g0 = r2.ifs["GigabitEthernet0/0"], g1 = r2.ifs["GigabitEthernet0/1"]; if (ip === L.ip) return true; var gwOk = L.gw === g0.ip && !g0.shut && ipIn(L.ip, g0.ip || "0.0.0.0", g0.mask || "255.255.255.255") && L.ip !== g0.ip; if (ip === "192.168.1.1") return !g0.shut && g0.ip === ip && ipIn(L.ip, ip, g0.mask || "255.255.255.0"); if (ip === "192.168.2.1") return gwOk && !g1.shut && g1.ip === ip; if (ip === "192.168.2.10") return gwOk && !g1.shut && g1.ip === "192.168.2.1" && g1.mask === "255.255.255.0"; return false; }; }
      var qq = st.q ? st.q(L) : null, res5 = [];
      body.innerHTML = '<p class="small">Laptopul e deschis. Win+R → <b>cmd</b> → Enter. Fă, pe rând:</p><ul class="goals" id="prG"></ul><div id="prTerm"></div>' + (qq ? mcqHtml([qq]) : "");
      var paintG = function () { $("prG").innerHTML = st.goals.map(function (g) { var ok = !!g[1](L); return '<li class="' + (ok ? "ok" : "") + '">' + (ok ? "✓ " : "○ ") + esc(g[0]) + "</li>"; }).join(""); };
      winBox($("prTerm"), L, function () { var g = st.goals.filter(function (x) { return !x[1](L); })[0]; return g ? "Tastează: " + g[2] : "Toate comenzile sunt făcute."; }, paintG); paintG();
      if (qq) mcqWire(body, [qq], res5);
      scoreFn = function () { var n = st.goals.length + (qq ? 1 : 0); return (st.goals.filter(function (g) { return !!g[1](L); }).length + (res5[0] ? 1 : 0)) / n; };
    } else if (st.k === "ip") {
      var tg = st.tg;
      body.innerHTML = '<div class="fact small"><b>Foaia de examen:</b> IP ' + tg.ip + " · mască " + tg.mask + " · gateway " + tg.gw + (tg.dns ? " · DNS " + tg.dns : " · DNS: nu se cere") + "</div>" + mcqHtml([PR_IPQ]) +
        '<div class="wdlg"><div class="wdbar">Internet Protocol Version 4 (TCP/IPv4) Properties</div><div class="wdbody"><label class="wr"><input type="radio" name="ipm" value="a" checked> Obtain an IP address automatically</label><label class="wr"><input type="radio" name="ipm" value="m"> Use the following IP address:</label>' +
        [["IP address:", "fIp"], ["Subnet mask:", "fMask"], ["Default gateway:", "fGw"]].map(function (f) { return '<label class="wf"><span>' + f[0] + '</span><input id="' + f[1] + '" inputmode="decimal" autocomplete="off" disabled></label>'; }).join("") +
        '<label class="wr"><input type="radio" name="dnm" value="a" checked> Obtain DNS server address automatically</label><label class="wr"><input type="radio" name="dnm" value="m"> Use the following DNS server addresses:</label><label class="wf"><span>Preferred DNS server:</span><input id="fDns" inputmode="decimal" autocomplete="off" disabled></label><label class="wf"><span>Alternate DNS server:</span><input id="fDns2" inputmode="decimal" autocomplete="off" disabled></label><div class="wbtns"><button class="ghost sm" type="button" id="wOk">OK</button><button class="ghost sm" type="button" id="wCancel">Cancel</button></div></div></div><div id="ipOut"></div>';
      var res6 = []; mcqWire(body, [PR_IPQ], res6);
      var syncDis = function () { var m = body.querySelector('input[name="ipm"]:checked').value === "m"; if (m) body.querySelector('input[name="dnm"][value="m"]').checked = true; ["fIp", "fMask", "fGw"].forEach(function (id) { $(id).disabled = !m; }); var dm = body.querySelector('input[name="dnm"]:checked').value === "m"; ["fDns", "fDns2"].forEach(function (id) { $(id).disabled = !dm; }); body.querySelector('input[name="dnm"][value="a"]').disabled = m; };
      Array.prototype.forEach.call(body.querySelectorAll('input[type="radio"]'), function (r) { r.onchange = syncDis; });
      $("fIp").addEventListener("input", function () { if (!$("fMask").value && /^\d+\.\d+\.\d+\.\d+$/.test($("fIp").value)) $("fMask").value = "255.255.255.0"; });
      var applied = null;
      $("wCancel").onclick = function () { $("ipOut").innerHTML = '<div class="eli small">Cancel = nu se salvează nimic.</div>'; };
      $("wOk").onclick = function () {
        var m = body.querySelector('input[name="ipm"]:checked').value === "m", v = { ip: $("fIp").value.trim(), mask: $("fMask").value.trim(), gw: $("fGw").value.trim(), dns: $("fDns").value.trim() };
        var errs = []; if (!m) errs.push("Ai lăsat „Obtain automatically” (DHCP) – trebuia „Use the following IP address”.");
        if (m && !ipOk(v.ip)) errs.push("Adresa IP nu e validă."); if (m && !maskOk(v.mask)) errs.push("Masca nu e validă.");
        if (m && v.gw && !ipIn(v.gw, v.ip, v.mask)) errs.push("Gateway-ul nu e în aceeași rețea cu IP-ul.");
        if (m && errs.length && !ipOk(v.ip)) { $("ipOut").innerHTML = '<div class="eli trapw small">⚠️ Windows: „' + esc(errs[errs.length - 1]) + '” Corectează și apasă OK din nou.</div>'; return; }
        applied = { m: m, v: v };
        if (m) { S.L.ip = v.ip; S.L.mask = v.mask; S.L.gw = v.gw; S.L.dns = v.dns; S.L.dhcp = false; }
        var parts = [m, v.ip === tg.ip, v.mask === tg.mask, v.gw === tg.gw, tg.dns ? v.dns === tg.dns : true], ok = parts.filter(Boolean).length;
        $("ipOut").innerHTML = '<div class="' + (ok === 5 ? "fact tok" : "eli trapw") + ' small">' + (ok === 5 ? "✅ Setat corect. Verificarea examinatorului: ipconfig → IPv4 Address " + esc(tg.ip) + ", Default Gateway " + esc(tg.gw) + "." : "Salvat, dar " + (5 - ok) + " câmp(uri) nu corespund foii (" + ["metodă", "IP", "mască", "gateway", "DNS"].filter(function (x, i) { return !parts[i]; }).join(", ") + "). Poți corecta și apăsa iar OK.") + "</div>";
      };
      scoreFn = function () { if (!applied) return 0; var v = applied.v, parts = [applied.m, v.ip === tg.ip, v.mask === tg.mask, v.gw === tg.gw, tg.dns ? v.dns === tg.dns : true, !!res6[0]]; return parts.filter(Boolean).length / 6; };
    } else if (st.k === "dev") {
      var open = {}, picked = null, res7 = [];
      var paintD = function () {
        body.innerHTML = '<p class="small">Ai legat cablul de consolă USB-serial (sau cel albastru + adaptor). Win+X → <b>Device Manager</b>. Găsește adaptorul și portul COM (fiecare laptop îl numerotează altfel!).</p>' + prDevHtml(S.com, open, picked) + (picked ? '<div class="' + (/Prolific/.test(picked) ? "fact tok" : "eli trapw") + ' small">' + (/Prolific/.test(picked) ? "✅ Acesta e adaptorul USB-serial: COM" + S.com + "." : "❌ Nu acesta. COM1 e portul serial intern al plăcii de bază; adaptorul de consolă apare ca „USB-to-Serial” în Ports (COM & LPT).") + "</div>" + mcqHtml([PR_COMQ(S.com)]) : "");
        Array.prototype.forEach.call(body.querySelectorAll(".dmcat"), function (b) { b.onclick = function () { var c = b.getAttribute("data-c"); open[c] = !open[c]; paintD(); }; });
        Array.prototype.forEach.call(body.querySelectorAll(".dmdev"), function (b) { b.onclick = function () { if (picked) return; picked = b.getAttribute("data-d"); paintD(); }; });
        if (picked) mcqWire(body, [PR_COMQ(S.com)], res7);
      };
      paintD(); scoreFn = function () { return (picked && /Prolific/.test(picked) ? 0.5 : 0) + (res7[0] ? 0.5 : 0); };
    } else if (st.k === "putty") {
      body.innerHTML = '<p class="small">Deschide PuTTY. Categoria <b>Session</b>, apoi <b>Connection → Serial</b>. Adaptorul de consolă e pe <b>COM' + S.com + "</b> (l-ai găsit în Device Manager).</p>" + PH("console") +
        '<div class="wdlg putty"><div class="wdbar">PuTTY Configuration</div><div class="wdbody"><b class="small">Session – Connection type:</b><div class="pradio">' + ["Raw", "Telnet", "Rlogin", "SSH", "Serial"].map(function (x) { return '<label><input type="radio" name="ct" value="' + x + '"' + (x === "SSH" ? " checked" : "") + "> " + x + "</label>"; }).join("") + '</div><label class="wf"><span id="lHost">Host Name (or IP address)</span><input id="pHost" autocomplete="off" autocapitalize="off"></label><label class="wf"><span id="lPort">Port</span><input id="pPort" value="22" inputmode="numeric" autocomplete="off"></label><b class="small">Connection → Serial:</b>' +
        '<label class="wf"><span>Data bits</span><input id="pData" value="8" inputmode="numeric"></label><label class="wf"><span>Stop bits</span><input id="pStop" value="1" inputmode="numeric"></label><label class="wf"><span>Parity</span><select id="pPar"><option>None</option><option>Odd</option><option>Even</option><option>Mark</option><option>Space</option></select></label><label class="wf"><span>Flow control</span><select id="pFlow"><option>XON/XOFF</option><option>None</option><option>RTS/CTS</option><option>DSR/DTR</option></select></label><div class="wbtns"><button class="ghost sm" type="button" id="pOpen">Open</button></div></div></div><div id="pOut"></div>';
        var syncP = function () { var ser = body.querySelector('input[name="ct"]:checked').value === "Serial"; $("lHost").textContent = ser ? "Serial line" : "Host Name (or IP address)"; $("lPort").textContent = ser ? "Speed" : "Port"; if (ser && ($("pPort").value === "22" || $("pPort").value === "23")) { $("pPort").value = "9600"; } if (ser && !$("pHost").value) $("pHost").value = "COM1"; };
        Array.prototype.forEach.call(body.querySelectorAll('input[name="ct"]'), function (r) { r.onchange = syncP; });
        var pv = null;
        $("pOpen").onclick = function () {
          var v = { ct: body.querySelector('input[name="ct"]:checked').value, line: $("pHost").value.trim().toUpperCase().replace(/\s+/g, ""), sp: $("pPort").value.trim(), d: $("pData").value.trim(), s: $("pStop").value.trim(), p: $("pPar").value, f: $("pFlow").value };
          pv = v; var parts = [["tip Serial", v.ct === "Serial"], ["COM" + S.com, v.line === "COM" + S.com], ["9600", v.sp === "9600"], ["8 biți de date", v.d === "8"], ["1 bit de stop", v.s === "1"], ["paritate None", v.p === "None"], ["flow control None", v.f === "None"]];
          var bad = parts.filter(function (x) { return !x[1]; });
          var ok = bad.length === 0, partial = v.ct === "Serial" && v.line === "COM" + S.com && v.sp === "9600";
          $("pOut").innerHTML = ok ? '<div class="term"><div class="tline">&nbsp;</div><div class="tline">Switch&gt;</div></div><div class="fact tok small">✅ Fereastra neagră + Enter → apare <b>Switch&gt;</b>. Ești în consola switch-ului.</div>' : '<div class="term"><div class="tline">' + (partial ? "Switch&gt;  (merge – dar setările diferă de standardul cerut)" : v.ct !== "Serial" ? "PuTTY Fatal Error: Network error: Connection timed out" : v.line !== "COM" + S.com ? "PuTTY Error: Unable to open connection to " + esc(v.line || "?") + ": Unable to open serial port" : "ÿ~#þ@×ÿ  (caractere ciudate = viteză greșită)") + '</div></div><div class="eli trapw small">De corectat: ' + bad.map(function (x) { return x[0]; }).join(", ") + ". Poți modifica și apăsa iar Open.</div>";
          if (ok) SND.ok();
        };
        scoreFn = function () { if (!pv) return 0; var v = pv, parts = [v.ct === "Serial", v.line === "COM" + S.com, v.sp === "9600", v.d === "8", v.s === "1", v.p === "None", v.f === "None"]; return parts.filter(Boolean).length / 7; };
    } else if (st.k === "cli") {
      var T = CLI_TASKS.filter(function (x) { return x.id === st.task; })[0], s = S.cli[st.task] || (S.cli[st.task] = cliNew(T.dev));
      body.innerHTML = '<div class="ctask"><b>Sarcina:</b> ' + esc(T.d) + '<ul class="goals" id="prG"></ul></div><div id="prTerm"></div>';
      var paintC = function () { $("prG").innerHTML = T.g.map(function (g) { var ok = false; try { ok = !!g[1](s); } catch (e) {} return '<li class="' + (ok ? "ok" : "") + '">' + (ok ? "✓ " : "○ ") + esc(g[0]) + "</li>"; }).join(""); };
      cliBox($("prTerm"), s, T, paintC); paintC();
      scoreFn = function () { return T.g.filter(function (g) { try { return !!g[1](s); } catch (e) { return false; } }).length / T.g.length; };
    }
    nextB.onclick = function () {
      var f = scoreFn();
      if (f < 1 && !confirm("Pasul nu e complet (" + Math.round(f * 100) + "%). Predai așa? Nu-l mai poți relua.")) return;
      if (f >= 1) SND.ok();
      done(f);
    };
  }
  var PR_IPQ = { q: "Cel mai rapid drum până la setările IPv4 ale plăcii Ethernet:", o: ["Win+R → ncpa.cpl → clic dreapta pe Ethernet → Properties → Internet Protocol Version 4 (TCP/IPv4) → Properties", "Win+R → cmd → ipconfig /static", "Device Manager → Network adapters → Update driver", "Control Panel → Sound → Ethernet"], e: "ncpa.cpl deschide direct „Network Connections”. Merge și Settings → Network & Internet → Change adapter options." };
  function PR_COMQ(com) { return { q: "Ce scrii în PuTTY la „Serial line”?", o: ["COM" + com, "COM1", "USB" + com, "192.168.1.1"], e: "Numele exact din Device Manager. COM1 e de obicei portul intern (care pe laptop nici nu are mufă)." }; }
  function prResult() {
    var S = PRS, tot = S.sc.reduce(function (a, x) { return a + x.p; }, 0), g = Math.round((1 + 9 * tot / 100) * 100) / 100, secs = Math.round((Date.now() - S.t0) / 1000);
    if (!S.saved) { S.saved = 1; P.exams.push({ t: Date.now(), k: "prac", v: S.v, c: Math.round(tot), n: 100, g: g, d: secs }); if (P.exams.length > 100) P.exams = P.exams.slice(-100); P.cli = P.cli || {}; P.cli["prac" + S.v] = Date.now(); addXP(g >= 7 ? 40 : 15); saveP(); if (g >= 7) SND.ok(); else SND.bad(); }
    app.innerHTML = '<section class="card sheetres"><div class="rhead"><b>PROBA PRACTICĂ – FIȘĂ DE EVALUARE</b><span class="muted small">' + esc(S.V.t) + " · " + fmtDate(Date.now()) + " · " + Math.round(secs / 60) + ' min</span></div><table class="rtab"><thead><tr><th>Pas</th><th>Punctaj</th></tr></thead><tbody>' + S.sc.map(function (x, i) { return "<tr><td>" + (i + 1) + ". " + esc(x.t) + '</td><td class="' + (x.p >= x.m ? "okc" : x.p >= x.m / 2 ? "" : "badc") + '">' + String(x.p).replace(".", ",") + " / " + x.m + "</td></tr>"; }).join("") + '<tr><td><b>Total</b></td><td><b>' + String(Math.round(tot * 10) / 10).replace(".", ",") + ' / 100</b></td></tr></tbody></table><div class="gradebox ' + (g >= 7 ? "ok" : "bad") + '"><span>Nota</span><b>' + fmtG(g) + "</b><span>" + (g >= 7 ? "ADMIS (minim 7)" : "RESPINS (minim 7)") + '</span></div><p class="small muted">Nota = 1 + 9 × punctaj/100. La examen trebuie minim 7 și la teorie, și la practică.</p><button class="big" id="prAgain">Altă variantă</button><button class="ghost" id="prBack">‹ Exersează</button></section>';
    $("prAgain").onclick = function () { PRS = null; vPrac(); };
    $("prBack").onclick = function () { PRS = null; go("practice"); };
  }
