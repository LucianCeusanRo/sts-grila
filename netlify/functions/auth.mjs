import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const users = () => getStore({ name: "sts-users", consistency: "strong" });
const sessions = () => getStore({ name: "sts-sessions", consistency: "strong" });
const SESSION_DAYS = 3650; /* practic permanent; se prelungește automat la folosire */

function scrypt(pass, salt) {
  return new Promise((ok, ko) => crypto.scrypt(pass, salt, 64, { N: 16384, r: 8, p: 1 }, (e, k) => (e ? ko(e) : ok(k))));
}
function cleanUser(u) { return String(u || "").trim().toLowerCase(); }
async function newSession(u) {
  const token = crypto.randomBytes(32).toString("hex");
  await sessions().setJSON("s/" + token, { u, exp: Date.now() + SESSION_DAYS * 864e5 });
  return token;
}

export default async (req, context) => {
  const action = context.params.action;
  if (req.method !== "POST") return json({ error: "Metodă nepermisă" }, 405);
  let body = {};
  try { body = await req.json(); } catch (e) { return json({ error: "Cerere invalidă" }, 400); }

  if (action === "logout") {
    const h = req.headers.get("authorization") || "";
    const tok = h.startsWith("Bearer ") ? h.slice(7) : "";
    if (/^[a-f0-9]{64}$/.test(tok)) await sessions().delete("s/" + tok);
    return json({ ok: true });
  }

  const u = cleanUser(body.u), p = String(body.p || "");
  if (!/^[a-z0-9._-]{3,24}$/.test(u)) return json({ error: "Utilizator invalid: 3–24 caractere (litere mici, cifre, . _ -)." }, 400);
  if (p.length < 6 || p.length > 200) return json({ error: "Parola trebuie să aibă cel puțin 6 caractere." }, 400);

  if (action === "register") {
    const salt = crypto.randomBytes(16);
    const hash = await scrypt(p, salt);
    const rec = { salt: salt.toString("hex"), hash: hash.toString("hex"), algo: "scrypt-16384-8-1", created: Date.now() };
    const { modified } = await users().setJSON("u/" + u, rec, { onlyIfNew: true });
    if (!modified) return json({ error: "Numele de utilizator este deja folosit." }, 409);
    return json({ token: await newSession(u), user: u });
  }
  if (action === "login") {
    const rec = await users().get("u/" + u, { type: "json" });
    const salt = rec ? Buffer.from(rec.salt, "hex") : crypto.randomBytes(16);
    const hash = await scrypt(p, salt);
    const good = rec && crypto.timingSafeEqual(hash, Buffer.from(rec.hash, "hex"));
    if (!good) return json({ error: "Utilizator sau parolă greșită." }, 401);
    return json({ token: await newSession(u), user: u });
  }
  return json({ error: "Acțiune necunoscută" }, 404);
};

export const config = {
  path: "/api/auth/:action",
  rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
