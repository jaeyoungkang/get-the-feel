import { existsSync, readFileSync } from "node:fs";
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
  "skills/ai-value-chain-cycle/SKILL.md"
];

const missing = required.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error(`Missing assets:\n${missing.join("\n")}`);
  process.exit(1);
}

const assetMap = readFileSync(join(root, "assets/ASSET_MAP.md"), "utf8");
for (const term of ["Product-specific skills", "Research and data operations", "Visualization and UX design", "Business logic and sellability"]) {
  if (!assetMap.includes(term)) {
    console.error(`Asset map missing ${term}`);
    process.exit(1);
  }
}

console.log("asset gate: pass");

