#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pub = path.join(root, "public");

global.window = {};
require(path.join(pub, "questions.js"));
const Q = global.window.QUESTIONS;
const cats = global.window.CATEGORIES;
if (!Array.isArray(Q) || Q.length < 3000) {
  console.error("expected >= 3000 questions, got", Q && Q.length);
  process.exit(1);
}
if (!Array.isArray(cats) || cats.length < 20) {
  console.error("expected >= 20 categories, got", cats && cats.length);
  process.exit(1);
}
const ids = new Set();
let bad = 0;
let dups = 0;
for (const q of Q) {
  if (ids.has(q.id)) dups += 1;
  ids.add(q.id);
  if (!q.a || q.a.length !== 4 || new Set(q.a).size !== 4 || !q.q || !q.e) bad += 1;
}
if (bad || dups) {
  console.error("bad questions:", bad, "duplicate ids:", dups);
  process.exit(1);
}

const html = fs.readFileSync(path.join(pub, "index.html"), "utf8");
const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((m) => m[1]);
const missing = [];
for (const raw of refs) {
  if (/^(https?:|mailto:|\/\/|#)/i.test(raw)) continue;
  const rel = raw.replace(/^\//, "").split("?")[0].split("#")[0];
  if (!rel) continue;
  if (!fs.existsSync(path.join(pub, rel))) missing.push(raw);
}
if (missing.length) {
  console.error("missing public assets:", missing);
  process.exit(1);
}
console.log(`OK ${Q.length} questions, ${cats.length} categories, assets ok`);
