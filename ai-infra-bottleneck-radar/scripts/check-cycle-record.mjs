import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const currentCandidate = "r6-external-proof-radar";
const record = readFileSync(join(root, "assets/CYCLE_RECORD.md"), "utf8");

function field(name) {
  const match = record.match(new RegExp(`^- ${name}:\\s*(.+)$`, "m"));
  return match ? match[1].trim().replace(/^`|`$/g, "") : "";
}

const required = [
  `# Cycle Record — ${currentCandidate}`,
  "Intent Guardian:",
  "Process Improvement:",
  "Asset Steward:",
  "Data/Sellability:",
  `- current_candidate_id: \`${currentCandidate}\``,
  "- monitors_before_verdict: yes",
  "asset_recovery_targets:",
  "local_candidate_status:",
  "representative_status:",
  "sellable_status:",
  "next_action:",
  "allowed_to_stop:",
  "stop_permission_after_r6:"
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
    .map((key) => [key, field(key)])
);

if (!status.local_candidate_status || !status.representative_status || !status.sellable_status || !status.next_action || !status.allowed_to_stop) {
  console.error("Cycle record stop-permission fields are incomplete.");
  process.exit(1);
}

if (field("current_candidate_id") !== currentCandidate) {
  console.error("Cycle record current_candidate_id does not match current candidate.");
  process.exit(1);
}

if (field("current_candidate_path") !== `candidates/${currentCandidate}/`) {
  console.error("Cycle record current_candidate_path does not match current candidate.");
  process.exit(1);
}

if (field("monitors_before_verdict") !== "yes") {
  console.error("Cycle record must show monitors_before_verdict: yes.");
  process.exit(1);
}

if (status.allowed_to_stop === "yes" && status.sellable_status !== "pass") {
  console.error("allowed_to_stop yes requires product-level sellable_status pass.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && status.allowed_to_stop !== "no") {
  console.error("Non-sellable cycle must keep allowed_to_stop: no.");
  process.exit(1);
}

const hasExternalBlocker = record.includes("external_blocker:");

if (status.sellable_status !== "pass" && !status.next_action.includes("candidates/r")) {
  console.error("Non-sellable cycle must specify the next fresh candidate action.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && !record.includes("allowed_to_stop: no")) {
  console.error("Non-sellable cycle must explicitly deny stop permission.");
  process.exit(1);
}

console.log("cycle record gate: pass");
