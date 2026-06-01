import { readFileSync } from "node:fs";

const dataPath = process.argv[2];
if (!dataPath) {
  console.error("Usage: node scripts/check-data-contracts.mjs <data.json>");
  process.exit(1);
}

const data = JSON.parse(readFileSync(dataPath, "utf8"));
const requiredContract = [
  "source_id",
  "source_status",
  "as_of",
  "collected_at",
  "applied_at",
  "cadence",
  "freshness_status",
  "stale_after_days",
  "late_source_handling",
  "snapshot_type",
  "calculation_status",
  "formula_status"
];

function checkContract(label, contract) {
  const missing = requiredContract.filter((key) => !(key in contract));
  if (missing.length) {
    throw new Error(`${label} missing contract fields: ${missing.join(", ")}`);
  }
  if (String(contract.snapshot_type).includes("observed") || String(contract.snapshot_type).includes("fact")) {
    throw new Error(`${label} uses blocked snapshot_type ${contract.snapshot_type}`);
  }
}

for (const stage of data.stages) checkContract(`stage:${stage.id}`, stage.contract);
for (const edge of data.edges) checkContract(`edge:${edge.id}`, edge.contract);
for (const snapshot of data.snapshots) checkContract(`snapshot:${snapshot.id}`, snapshot.contract);
for (const path of data.thin_paths) {
  for (const key of ["path_id", "node_ids", "edge_ids", "metric_name", "formula_or_manual_rule", "update_owner", "scenario_horizon", "scenario_assumptions", "paid_job", "non_advice_boundary", "release_blocker"]) {
    if (!(key in path)) throw new Error(`thin_path:${path.path_id || "unknown"} missing ${key}`);
  }
}

console.log("data contract gate: pass");
