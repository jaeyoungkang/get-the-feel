#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const OUT_DIR = join(ROOT, "out");
const basePathArg = process.argv[process.argv.indexOf("--base-path") + 1];
const basePath = basePathArg || "/get-the-feel";
const failures = [];
const checked = [];

function walk(dir, out) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const child = join(dir, name);
    if (statSync(child).isDirectory()) walk(child, out);
    else out.push(child);
  }
}

const files = [];
walk(OUT_DIR, files);

for (const file of files.filter((entry) => entry.endsWith(".html"))) {
  const rel = relative(ROOT, file);
  const html = readFileSync(file, "utf8");
  checked.push(rel);
  for (const pattern of [/="\/_next\//g, /="\/legacy\//g, /url\("\/_next\//g]) {
    if (pattern.test(html)) failures.push(`${rel}: root-relative asset path ${pattern}`);
  }
}

const joinedHtml = files
  .filter((entry) => entry.endsWith(".html"))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

if (!joinedHtml.includes(`${basePath}/_next/`)) {
  failures.push(`exported HTML does not reference ${basePath}/_next/ assets`);
}

if (!joinedHtml.includes(`${basePath}/legacy/c4-3/index.html`)) {
  failures.push(`exported HTML does not reference ${basePath}/legacy/c4-3/index.html`);
}

if (failures.length > 0) {
  console.error("[FAIL] pages-export-paths");
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log("[PASS] pages-export-paths");
console.log(`  checked ${checked.length} html file(s) under out/`);
