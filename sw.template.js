/* Service worker: aplicația funcționează și offline. */
var V = "dev";
var CACHE = "sts-grila-" + V;
var CORE = ["/", "/index.html", "/style.css?v=" + V, "/questions.js?v=" + V, "/lessons.js?v=" + V, "/merge.js?v=" + V, "/app.js?v=" + V, "/apt.js?v=" + V, "/game.css?v=" + V, "/game.js?v=" + V, "/jg3d.js?v=" + V, "/vendor/three.min.js?v=" + V, "/vendor/three-x.min.js?v=" + V, "/vendor/three-post.min.js?v=" + V, "/jgnpc.js?v=" + V, "/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener("fetch", function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || url.pathname.indexOf("/api/") === 0) return;
  if (req.mode === "navigate" && url.pathname !== "/" && url.pathname !== "/index.html") return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(function (r) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put("/index.html", cp); }); return r; }).catch(function () { return caches.match("/index.html").then(function (r) { return r || caches.match("/"); }); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) {
    var net = fetch(req).then(function (r) { if (r.ok) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); }); } return r; });
    return hit || net;
  }));
});
