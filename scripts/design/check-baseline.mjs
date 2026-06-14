#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const required = [
  "public/legacy/c4-3/index.html",
  "public/legacy/c4-3/styles.css",
  "public/legacy/c4-3/app.js",
  "public/legacy/c4-3/data.js",
  "app/sense-visual.tsx",
  "docs/design-assets.md",
  "docs/contracts/story-chain/aspects/design-baseline-preservation.md",
];
const failures = [];

for (const rel of required) {
  if (!existsSync(join(ROOT, rel))) failures.push(`${rel} missing`);
}

const globals = readFileSync(join(ROOT, "app/globals.css"), "utf8");
const legacyStyles = readFileSync(join(ROOT, "public/legacy/c4-3/styles.css"), "utf8");
const visual = readFileSync(join(ROOT, "app/sense-visual.tsx"), "utf8");

if (!globals.includes("prefers-reduced-motion")) {
  failures.push("React visual grammar lacks prefers-reduced-motion handling");
}

if (!legacyStyles.includes("prefers-reduced-motion")) {
  failures.push("trainer baseline CSS lacks prefers-reduced-motion handling");
}

for (const token of ["compositionViz", "idiomViz", "contrast-wrap", "compose-wrap"]) {
  if (!visual.includes(token)) failures.push(`React visual bridge missing ${token}`);
}

if (failures.length > 0) {
  console.error("[FAIL] design-baseline");
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log("[PASS] design-baseline");
