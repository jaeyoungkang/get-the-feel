import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const currentCandidate = "r13-operator-sla-radar";
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
  "skills/product-level-sellability/SKILL.md",
  "assets/skill-registry.md",
  "product_feedback_readiness:",
  "repeat_use_readiness:",
  "pricing_evaluation_readiness:",
  "macro_promise_preserved:",
  "product_level_sellable_status:",
  `- current_candidate_id: \`${currentCandidate}\``,
  "- monitors_before_verdict: yes",
  "monitor_outputs_received:",
  "monitor_timeout_policy:",
  "asset_recovery_targets:",
  "local_candidate_status:",
  "representative_status:",
  "sellable_status:",
  "next_action:",
  "next_candidate_id:",
  "next_candidate_path:",
  "next_candidate_primary_advancement:",
  "next_candidate_binding_checked:",
  "allowed_to_stop:",
  "stop_permission_after_r13:",
  "final_permission_status:",
  "final_permission_next_action:",
  "asset_map_present:",
  "asset_categories_checked:",
  "skill_assets_checked:",
  "skill_receipts_required:",
  "cycle_contributions:",
  "missing_or_stale_assets:",
  "next_cycle_asset_rule:"
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
  ["local_candidate_status", "representative_status", "sellable_status", "next_action", "next_candidate_id", "next_candidate_path", "next_candidate_primary_advancement", "next_candidate_binding_checked", "allowed_to_stop", "final_permission_status", "final_permission_next_action"]
    .map((key) => [key, field(key)])
);

if (!status.local_candidate_status || !status.representative_status || !status.sellable_status || !status.next_action || !status.next_candidate_id || !status.next_candidate_path || !status.next_candidate_primary_advancement || !status.next_candidate_binding_checked || !status.allowed_to_stop || !status.final_permission_status || !status.final_permission_next_action) {
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

if (field("monitor_outputs_received") !== "yes") {
  console.error("Cycle record must show monitor_outputs_received: yes.");
  process.exit(1);
}

if (!field("monitor_timeout_policy").includes("cycle_not_closed")) {
  console.error("Cycle record must define monitor_timeout_policy with cycle_not_closed.");
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

if (status.sellable_status !== "pass" && !status.next_action.includes("candidates/r")) {
  console.error("Non-sellable cycle must specify the next fresh candidate action.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && status.next_candidate_id !== "r14-paid-onboarding-radar") {
  console.error("R13 non-sellable cycle must bind next_candidate_id to r14-paid-onboarding-radar.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && status.next_candidate_path !== "candidates/r14-paid-onboarding-radar/") {
  console.error("R13 non-sellable cycle must bind next_candidate_path to candidates/r14-paid-onboarding-radar/.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && !status.next_candidate_primary_advancement.includes("paid onboarding")) {
  console.error("R13 non-sellable cycle must define next_candidate_primary_advancement as paid onboarding.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && !status.next_action.includes(status.next_candidate_path)) {
  console.error("next_action must include exact next_candidate_path.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && !status.next_candidate_binding_checked.includes(status.next_candidate_id)) {
  console.error("next_candidate_binding_checked must include exact next_candidate_id.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && !status.next_candidate_binding_checked.includes(status.next_candidate_path)) {
  console.error("next_candidate_binding_checked must include exact next_candidate_path.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && !record.includes("allowed_to_stop: no")) {
  console.error("Non-sellable cycle must explicitly deny stop permission.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && !record.includes("final_permission_gate: must_fail_until_sellable_pass")) {
  console.error("Non-sellable cycle must mark final_permission_gate: must_fail_until_sellable_pass.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && !record.includes("if_quality_final_fails: continue_next_fresh_candidate")) {
  console.error("Non-sellable cycle must define the quality:final failure action.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && status.final_permission_status !== "denied_continue") {
  console.error("Non-sellable cycle must record final_permission_status: denied_continue.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && !status.final_permission_next_action.includes("candidates/r")) {
  console.error("Non-sellable cycle must bind final_permission_next_action to a fresh candidate.");
  process.exit(1);
}

if (status.sellable_status !== "pass" && !status.final_permission_next_action.includes(status.next_candidate_path)) {
  console.error("final_permission_next_action must include exact next_candidate_path.");
  process.exit(1);
}

console.log("cycle record gate: pass");
