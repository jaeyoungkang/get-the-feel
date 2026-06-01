import { existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const currentCandidate = "r4-representative-radar";
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
  `candidates/${currentCandidate}/index.html`,
  `candidates/${currentCandidate}/styles.css`,
  `candidates/${currentCandidate}/app.js`,
  `candidates/${currentCandidate}/data.json`
];

const missing = required.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error(`Missing required files:\n${missing.join("\n")}`);
  process.exit(1);
}

console.log("asset gate: pass");
