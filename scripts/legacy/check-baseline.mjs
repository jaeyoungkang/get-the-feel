#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const app = readFileSync(join(ROOT, "public/legacy/c4-3/app.js"), "utf8");
const index = readFileSync(join(ROOT, "public/legacy/c4-3/index.html"), "utf8");
const styles = readFileSync(join(ROOT, "public/legacy/c4-3/styles.css"), "utf8");
const data = readFileSync(join(ROOT, "public/legacy/c4-3/data.js"), "utf8");
const failures = [];

function mustInclude(source, token, label) {
  if (!source.includes(token)) failures.push(`${label} missing ${token}`);
}

mustInclude(index, 'id="app"', "trainer index");
mustInclude(index, 'src="data.js"', "trainer index");
mustInclude(index, 'src="app.js"', "trainer index");
mustInclude(data, "window.CONTENT_ALL", "trainer data");

mustInclude(app, "function renderQuestion()", "trainer behavior");
mustInclude(app, "shuffleChoices(item)", "cue discipline");
mustInclude(app, "function renderFeedback", "answer feedback");
mustInclude(app, "item.sentence_ko", "translation-after-answer");
mustInclude(app, "function startProduce", "production mode");
mustInclude(app, "function renderProgress", "weakness stats");
mustInclude(app, "focusChipsHtml", "focused practice");
mustInclude(app, 'STORE_PREFIX + "produce"', "production storage separation");
mustInclude(app, "gtf-c4-3-", "recognition storage prefix");
mustInclude(app, "약한 verdict", "self-graded production copy");
mustInclude(app, "postFrameHeight", "iframe height bridge");
mustInclude(app, "bridgeScrollElement", "iframe scroll bridge");
mustInclude(styles, "prefers-reduced-motion", "trainer CSS");

const questionBody = app.match(/function renderQuestion\(\) \{[\s\S]*?app\.innerHTML = html;/)?.[0] ?? "";
if (questionBody.includes("sentence_ko")) {
  failures.push("renderQuestion leaks sentence_ko before answer feedback");
}
if (questionBody.includes("itemColor(") || questionBody.includes("senseLabel(")) {
  failures.push("renderQuestion leaks item/sense visual labels before answer feedback");
}

if (failures.length > 0) {
  console.error("[FAIL] legacy-baseline");
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log("[PASS] legacy-baseline");
