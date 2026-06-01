import { existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = [
  "AGENTS.md",
  "assets/ASSET_MAP.md",
  "assets/CYCLE_RECORD.md",
  "assets/product-contract.md",
  "assets/research-data-ops.md",
  "assets/visualization-ux.md",
  "assets/business-logic.md",
  "assets/engineering-rules.md",
  "assets/process-monitoring.md",
  "skills/radar-cycle/SKILL.md",
  "candidates/r1-macro-radar/index.html",
  "candidates/r1-macro-radar/styles.css",
  "candidates/r1-macro-radar/app.js",
  "candidates/r1-macro-radar/data.json"
];

const missing = required.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error(`Missing required files:\n${missing.join("\n")}`);
  process.exit(1);
}

console.log("asset gate: pass");

