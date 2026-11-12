import { getStore } from "@netlify/blobs";
import merge from "../../shared/merge.js";

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const MAX_BYTES = 2_000_000;

async function whoami(req) {
  const h = req.headers.get("authorization") || "";
  const tok = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!/^[a-f0-9]{64}$/.test(tok)) return null;
  const ss = getStore({ name: "sts-sessions", consistency: "strong" });
  const s = await ss.get("s/" + tok, { type: "json" });
  if (!s || s.exp < Date.now()) return null;
  /* sesiune glisantă: dacă mai are sub ~8 ani, o prelungim la 10 ani – utilizatorul rămâne logat permanent */
  if (s.exp - Date.now() < 3000 * 864e5) { try { await ss.setJSON("s/" + tok, { u: s.u, exp: Date.now() + 3650 * 864e5 }); } catch (e) {} }
  return s.u;
}


export default async (req) => {
  const u = await whoami(req);
  if (!u) return json({ error: "Sesiune expirată. Autentifică-te din nou." }, 401);
  const store = getStore({ name: "sts-progress", consistency: "strong" });
  const key = "p/" + u;
  const cur = (await store.get(key, { type: "json" })) || merge.empty();
  if (req.method === "GET") return json({ user: u, progress: cur });
  if (req.method === "PUT" || req.method === "POST") {
    const text = await req.text();
    if (text.length > MAX_BYTES) return json({ error: "Date prea mari" }, 413);
    let body;
    try { body = JSON.parse(text); } catch (e) { return json({ error: "JSON invalid" }, 400); }
    const merged = merge(cur, body && body.progress);
    merged.t = Date.now();
    await store.setJSON(key, merged);
    return json({ user: u, progress: merged });
  }
  if (req.method === "DELETE") {
    const fresh = merge.empty();
    fresh.t = Date.now();
    await store.setJSON(key, fresh);
    return json({ user: u, progress: fresh });
  }
  return json({ error: "Metodă nepermisă" }, 405);
};

export const config = { path: "/api/progress" };
