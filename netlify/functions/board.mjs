import { getStore } from "@netlify/blobs";

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
async function whoami(req) {
  const h = req.headers.get("authorization") || "";
  const tok = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!/^[a-f0-9]{64}$/.test(tok)) return null;
  const s = await getStore({ name: "sts-sessions", consistency: "strong" }).get("s/" + tok, { type: "json" });
  if (!s || s.exp < Date.now()) return null;
  return s.u;
}
const clean = (x) => String(x || "").replace(/[<>&"'`]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
const n = (x, max) => { x = Number(x); return isFinite(x) ? Math.max(0, Math.min(max, x)) : 0; };

/* Clasament privat: doar conturile de pe acest site care au ales să apară, cu numele afișat ales de ele. */
export default async (req) => {
  const u = await whoami(req);
  if (!u) return json({ error: "Autentifică-te ca să vezi clasamentul." }, 401);
  const store = getStore({ name: "sts-board", consistency: "strong" });
  if (req.method === "POST") {
    let b = {};
    try { b = await req.json(); } catch (e) { return json({ error: "JSON invalid" }, 400); }
    if (!b.on) { await store.delete("b/" + u); return json({ ok: true, on: false }); }
    const name = clean(b.name) || u;
    await store.setJSON("b/" + u, { name, pct: n(b.pct, 100), xp: n(b.xp, 1e7), done: n(b.done, 1e5), total: n(b.total, 1e5), t: Date.now() });
    return json({ ok: true, on: true });
  }
  if (req.method === "GET") {
    const { blobs } = await store.list({ prefix: "b/" });
    const rows = [];
    for (const bl of blobs.slice(0, 500)) { const v = await store.get(bl.key, { type: "json" }); if (v) rows.push({ name: v.name, pct: v.pct, xp: v.xp, done: v.done, total: v.total, t: v.t, me: bl.key === "b/" + u }); }
    rows.sort((a, b) => b.pct - a.pct || b.xp - a.xp || a.t - b.t);
    return json({ rows });
  }
  return json({ error: "Metodă nepermisă" }, 405);
};
export const config = { path: "/api/board", rateLimit: { windowLimit: 60, windowSize: 60, aggregateBy: ["ip", "domain"] } };
