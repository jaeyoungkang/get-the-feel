import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const record = readFileSync(join(root, "assets/CYCLE_RECORD.md"), "utf8");

const required = [
  "Intent Guardian: pass-as-local-candidate",
  "Asset Steward: repair-before-next",
  "Data/Sellability: continue-only-as-r2-repair",
  "R2 must create a new candidate folder"
];

const missing = required.filter((term) => !record.includes(term));
if (missing.length) {
  console.error(`Cycle record missing monitor recovery terms:\n${missing.join("\n")}`);
  process.exit(1);
}

if (record.includes("pending")) {
  console.error("Cycle record still contains pending.");
  process.exit(1);
}

console.log("cycle record gate: pass");
