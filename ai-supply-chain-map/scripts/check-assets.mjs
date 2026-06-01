import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = [
  "AGENTS.md",
  "assets/ASSET_MAP.md",
  "assets/product-contract.md",
  "assets/engineering-rules.md",
  "assets/engineering-quality-gates.md",
  "assets/research-data-ops.md",
  "assets/visualization-ux.md",
  "assets/business-logic.md",
  "assets/process-monitoring.md",
  "skills/supply-chain-map-cycle/SKILL.md",
  "skills/engineering-harness/SKILL.md"
];

const missing = required.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error(`Missing required assets:\n${missing.join("\n")}`);
  process.exit(1);
}

const assetMap = readFileSync(join(root, "assets/ASSET_MAP.md"), "utf8");
const requiredTerms = [
  "Product-specific skills/playbooks",
  "Engineering rules",
  "engineering-quality-gates",
  "Research and data operations",
  "Visualization and UX design",
  "Business logic and sellability",
  "Process and monitor recovery",
  "skill_receipts_required"
];

const missingTerms = requiredTerms.filter((term) => !assetMap.includes(term));
if (missingTerms.length) {
  console.error(`Asset Map missing required terms:\n${missingTerms.join("\n")}`);
  process.exit(1);
}

const skill = readFileSync(join(root, "skills/supply-chain-map-cycle/SKILL.md"), "utf8");
if (!skill.includes("Skill Load Receipt") || !skill.includes("Asset Preflight")) {
  console.error("Product skill must require Skill Load Receipt and Asset Preflight.");
  process.exit(1);
}

console.log("asset gate: pass");
