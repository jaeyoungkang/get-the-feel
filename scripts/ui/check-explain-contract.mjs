#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const explainer = readFileSync(join(ROOT, "app/explain/sentence-explainer.tsx"), "utf8");
const matcher = readFileSync(join(ROOT, "src/content/explanation-index.ts"), "utf8");
const failures = [];

if (explainer.includes('<p className="translation">{item.sentence_ko}</p>')) {
  failures.push("/explain renders sentence_ko before answer feedback");
}

if (!explainer.includes("shufflePracticeChoices")) {
  failures.push("/explain practice choices are not display-shuffled");
}

if (!explainer.includes("choice.originalIndex === item.answer_index")) {
  failures.push("/explain shuffled choices do not remap answer_index");
}

if (!explainer.includes('role="tablist"') || !explainer.includes("aria-selected")) {
  failures.push("/explain detected-target tabs lack selection semantics");
}

if (!matcher.includes("opaque-idiom") || !matcher.includes("look")) {
  failures.push("V+up matcher does not rank opaque/separable idioms");
}

if (!matcher.includes("optionalObject") || !matcher.includes("compose-completion")) {
  failures.push("V+up matcher does not rank separable compose/opaque forms");
}

if (!matcher.includes("excludeItemId")) {
  failures.push("sentence-to-practice bridge can repeat the exact source item");
}

if (failures.length > 0) {
  console.error("[FAIL] explain-contract");
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log("[PASS] explain-contract");
