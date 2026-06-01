import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const record = readFileSync(join(root, "assets/CYCLE_RECORD.md"), "utf8");

const required = [
  "Intent Guardian: pass-as-local-candidate",
  "Asset Steward: repair-before-next",
  "Data/Sellability: continue-only-as-r2-repair",
  "R2 must create a new candidate folder",
  "local_candidate_status:",
  "representative_status:",
  "sellable_status:",
  "next_action:",
  "allowed_to_stop:"
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

const status = Object.fromEntries(
  ["local_candidate_status", "representative_status", "sellable_status", "next_action", "allowed_to_stop"]
    .map((key) => {
      const match = record.match(new RegExp(`- ${key}:\\s*(.+)`));
      return [key, match ? match[1].trim() : ""];
    })
);

if (!status.local_candidate_status || !status.representative_status || !status.sellable_status || !status.next_action || !status.allowed_to_stop) {
  console.error("Cycle record stop-permission fields are incomplete.");
  process.exit(1);
}

if (status.allowed_to_stop === "yes" && status.sellable_status !== "pass" && !record.includes("external_blocker:")) {
  console.error("allowed_to_stop yes requires sellable_status pass or external_blocker.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && status.allowed_to_stop !== "no" && !record.includes("external_blocker:")) {
  console.error("Non-sellable cycle must keep allowed_to_stop: no unless external_blocker is recorded.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && !status.next_action.includes("candidates/r2-")) {
  console.error("Non-sellable cycle must specify the next fresh candidate action.");
  process.exit(1);
}

console.log("cycle record gate: pass");
