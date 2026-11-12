  /* ---------- simulator Cisco IOS ---------- */
  var CLI_TASKS = [
    { id: "base", dev: "switch", t: "Configurare de bază switch", d: "Nume SW1, parolă privilegiată criptată (enable secret), parolă pe consolă cu login, criptarea parolelor, banner MOTD, salvare.", g: [
      ["hostname SW1", function (s) { return s.host === "SW1"; }, "configure terminal → hostname SW1"],
      ["enable secret setată", function (s) { return !!s.secret; }, "enable secret <parolă>"],
      ["consolă: parolă + login", function (s) { return s.line.con.pw && s.line.con.login; }, "line console 0 → password cisco → login"],
      ["service password-encryption", function (s) { return s.enc; }, "service password-encryption"],
      ["banner motd", function (s) { return !!s.banner; }, "banner motd #Acces autorizat#"],
      ["configurația salvată", function (s) { return s.saved && s.saved.host === "SW1" && cfgEq(s); }, "end → copy running-config startup-config"]] },
    { id: "rtr", dev: "router", t: "Router: interfața G0/0 și IP", d: "Nume R1, G0/0 cu 192.168.1.1/24 activă (up/up), verificare cu show ip interface brief, salvare.", g: [
      ["hostname R1", function (s) { return s.host === "R1"; }, "configure terminal → hostname R1"],
      ["G0/0 = 192.168.1.1 255.255.255.0", function (s) { var f = s.ifs["GigabitEthernet0/0"]; return f.ip === "192.168.1.1" && f.mask === "255.255.255.0"; }, "interface g0/0 → ip address 192.168.1.1 255.255.255.0"],
      ["G0/0 pornită (no shutdown)", function (s) { return !s.ifs["GigabitEthernet0/0"].shut; }, "(în interfață) no shutdown"],
      ["verificat cu show ip interface brief", function (s) { return s.did.sipib; }, "end → show ip interface brief"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "copy running-config startup-config"]] },
    { id: "vlan", dev: "switch", t: "VLAN-uri pe switch", d: "VLAN 10 ADMIN, VLAN 20 TEHNIC; Fa0/1 acces în VLAN 10, Fa0/2 acces în VLAN 20; verificare cu show vlan brief; salvare.", g: [
      ["VLAN 10 cu numele ADMIN", function (s) { return s.vlans[10] === "ADMIN"; }, "vlan 10 → name ADMIN"],
      ["VLAN 20 cu numele TEHNIC", function (s) { return s.vlans[20] === "TEHNIC"; }, "vlan 20 → name TEHNIC"],
      ["Fa0/1: mode access, VLAN 10", function (s) { var f = s.ifs["FastEthernet0/1"]; return f.mode === "access" && f.vlan === 10; }, "interface fa0/1 → switchport mode access → switchport access vlan 10"],
      ["Fa0/2: mode access, VLAN 20", function (s) { var f = s.ifs["FastEthernet0/2"]; return f.mode === "access" && f.vlan === 20; }, "interface fa0/2 → switchport mode access → switchport access vlan 20"],
      ["verificat cu show vlan brief", function (s) { return s.did.svb; }, "end → show vlan brief"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "copy running-config startup-config"]] },
    { id: "mgmt", dev: "switch", t: "Switch: IP de management și acces la distanță", d: "Interface VLAN 1 cu 192.168.1.2/24 activă, default gateway 192.168.1.1, enable secret, vty 0 15 cu parolă și login, salvare.", g: [
      ["Vlan1 = 192.168.1.2 255.255.255.0", function (s) { var f = s.ifs.Vlan1; return f.ip === "192.168.1.2" && f.mask === "255.255.255.0"; }, "interface vlan 1 → ip address 192.168.1.2 255.255.255.0"],
      ["Vlan1 pornită", function (s) { return !s.ifs.Vlan1.shut; }, "(în interface vlan 1) no shutdown"],
      ["ip default-gateway 192.168.1.1", function (s) { return s.gw === "192.168.1.1"; }, "(config) ip default-gateway 192.168.1.1"],
      ["enable secret setată", function (s) { return !!s.secret; }, "enable secret <parolă>"],
      ["vty 0 15: parolă + login", function (s) { return s.line.vty.pw && s.line.vty.login; }, "line vty 0 15 → password cisco → login"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "end → copy running-config startup-config"]] },
    { id: "free", dev: "switch", t: "Mod liber (switch)", d: "Exersează orice comandă. Tastează ? pentru ajutor.", g: [] },
    { id: "freer", dev: "router", t: "Mod liber (router)", d: "Exersează orice comandă pe un router. Tastează ? pentru ajutor.", g: [] }
  ];
  function cliNew(dev) {
    var s = { dev: dev, host: dev === "router" ? "Router" : "Switch", mode: "user", ctx: null, secret: "", epw: "", enc: false, banner: "", lookup: true, gw: "", line: { con: { pw: "", login: false }, vty: { pw: "", login: false } }, ifs: {}, vlans: { 1: "default" }, did: {}, saved: null, hist: [], pend: null };
    if (dev === "router") { ["GigabitEthernet0/0", "GigabitEthernet0/1", "Serial0/0/0"].forEach(function (n) { s.ifs[n] = { ip: "", mask: "", shut: true, desc: "" }; }); }
    else { for (var k = 1; k <= 24; k++) s.ifs["FastEthernet0/" + k] = { mode: "", vlan: 1, shut: false, desc: "" }; s.ifs["GigabitEthernet0/1"] = { mode: "", vlan: 1, shut: false, desc: "" }; s.ifs["GigabitEthernet0/2"] = { mode: "", vlan: 1, shut: false, desc: "" }; s.ifs.Vlan1 = { ip: "", mask: "", shut: true, desc: "" }; }
    return s;
  }
  function cfgSnap(s) { return JSON.parse(JSON.stringify({ host: s.host, secret: s.secret, epw: s.epw, enc: s.enc, banner: s.banner, lookup: s.lookup, gw: s.gw, line: s.line, ifs: s.ifs, vlans: s.vlans })); }
  function cfgEq(s) { return JSON.stringify(cfgSnap(s)) === JSON.stringify(s.saved); }
  function enc7(p) { var h = "0822"; for (var i = 0; i < p.length; i++) h += ("0" + ((p.charCodeAt(i) ^ (0x5a + i)) & 255).toString(16).toUpperCase()).slice(-2); return h; }
  function ifName(a, b) {
    var str = (a + (b || "")).replace(/\s+/g, "").toLowerCase(), m;
    if ((m = /^(f|fa|fas|fast|fastethernet|fastether)(\d\/\d+)$/.exec(str))) return "FastEthernet" + m[2];
    if ((m = /^(g|gi|gig|giga|gigabit|gigabitethernet)(\d\/\d+)$/.exec(str))) return "GigabitEthernet" + m[2];
    if ((m = /^(s|se|ser|serial)(\d\/\d\/\d)$/.exec(str))) return "Serial" + m[2];
    if ((m = /^(vl|vla|vlan)(\d+)$/.exec(str))) return "Vlan" + m[2];
    return null;
  }
  function cliPrompt(s) { var m = { user: ">", priv: "#", config: "(config)#", "if": "(config-if)#", "if-range": "(config-if-range)#", line: "(config-line)#", vlan: "(config-vlan)#" }; return s.host + m[s.mode]; }
  function ipOk(ip) { return /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(ip) && ip.split(".").every(function (o) { return +o <= 255; }); }
  function maskOk(m) { if (!ipOk(m)) return false; var b = m.split(".").map(function (o) { return ("0000000" + (+o).toString(2)).slice(-8); }).join(""); return /^1+0*$/.test(b); }
  var CMDS = {
    user: [["enable", "Activează modul privilegiat"], ["exit", "Închide sesiunea"], ["logout", "Închide sesiunea"], ["ping", "Trimite ecou ICMP"], ["show", "Afișează informații"], ["traceroute", "Urmărește ruta"]],
    priv: [["configure", "Intră în modul de configurare"], ["copy", "Copiază configurația"], ["disable", "Înapoi în modul utilizator"], ["erase", "Șterge un fișier"], ["exit", "Închide sesiunea"], ["ping", "Trimite ecou ICMP"], ["reload", "Repornește echipamentul"], ["show", "Afișează informații"], ["traceroute", "Urmărește ruta"], ["write", "Salvează configurația"]],
    config: [["banner", "Mesaj afișat la conectare"], ["do", "Rulează o comandă EXEC"], ["enable", "Parolă pentru modul privilegiat"], ["end", "Ieși în modul privilegiat"], ["exit", "Ieși un nivel"], ["hostname", "Numele echipamentului"], ["interface", "Selectează o interfață"], ["ip", "Setări IP globale"], ["line", "Configurează o linie (consolă/vty)"], ["no", "Anulează o comandă"], ["service", "Servicii (ex. password-encryption)"], ["vlan", "Creează/editează un VLAN"]],
    "if": [["description", "Descrierea interfeței"], ["do", "Rulează o comandă EXEC"], ["end", "Ieși în modul privilegiat"], ["exit", "Ieși un nivel"], ["ip", "Adresa IP a interfeței"], ["no", "Anulează o comandă"], ["shutdown", "Oprește interfața"], ["switchport", "Setări port de switch"]],
    line: [["do", "Rulează o comandă EXEC"], ["end", "Ieși în modul privilegiat"], ["exec-timeout", "Timp de deconectare"], ["exit", "Ieși un nivel"], ["logging", "Mesaje pe linie"], ["login", "Cere parola la conectare"], ["no", "Anulează o comandă"], ["password", "Parola liniei"]],
    vlan: [["do", "Rulează o comandă EXEC"], ["end", "Ieși în modul privilegiat"], ["exit", "Ieși un nivel"], ["name", "Numele VLAN-ului"], ["no", "Anulează o comandă"]]
  };
  CMDS["if-range"] = CMDS["if"];
  function kw(tok, list) { tok = (tok || "").toLowerCase(); if (!tok) return null; if (list.indexOf(tok) >= 0) return tok; var m = list.filter(function (x) { return x.indexOf(tok) === 0; }); return m.length === 1 ? m[0] : m.length > 1 ? "?amb" : null; }
  function pad(x, n) { x = String(x); while (x.length < n) x += " "; return x.slice(0, n); }
