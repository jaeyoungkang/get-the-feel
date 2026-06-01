import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const app = readFileSync(join(root, "app.js"), "utf8");

const requiredTerms = [
  "source_id",
  "source_status",
  "as_of",
  "collected_at",
  "applied_at",
  "cadence",
  "freshness_status",
  "snapshot_type",
  "calculation_status"
];

const missing = requiredTerms.filter((term) => !app.includes(term));
if (missing.length) {
  console.error(`Missing data contract terms:\n${missing.join("\n")}`);
  process.exit(1);
}

if (app.includes("observed")) {
  console.error("Do not render observed in this prototype. Use source_backed_index or scenario.");
  process.exit(1);
}

console.log("data contract gate: pass");

