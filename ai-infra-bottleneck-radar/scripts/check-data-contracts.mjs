import { readFileSync } from "node:fs";

const dataPath = process.argv[2];
if (!dataPath) {
  console.error("Usage: node scripts/check-data-contracts.mjs <data.json>");
  process.exit(1);
}

const data = JSON.parse(readFileSync(dataPath, "utf8"));
const htmlPath = dataPath.replace(/data\.json$/, "index.html");
const html = readFileSync(htmlPath, "utf8");
const requiredContract = [
  "source_id",
  "source_reference",
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

function daysBetween(start, end) {
  return Math.floor((new Date(`${end}T00:00:00Z`) - new Date(`${start}T00:00:00Z`)) / 86400000);
}

function checkFreshness(label, contract) {
  const age = daysBetween(contract.applied_at, data.meta.freshness_today);
  if (age > contract.stale_after_days) {
    throw new Error(`${label} is stale for representative demo`);
  }
}

function assertWeightedFormula(stage) {
  if (!Array.isArray(stage.formula_components) || stage.formula_components.length < 2) {
    throw new Error(`stage:${stage.id} missing formula_components`);
  }
  const weightSum = stage.formula_components.reduce((sum, part) => sum + part.weight, 0);
  if (Math.abs(weightSum - 1) > 0.001) {
    throw new Error(`stage:${stage.id} formula component weights must sum to 1`);
  }
  for (const part of stage.formula_components) {
    for (const key of ["label", "weight", "score"]) {
      if (!(key in part)) throw new Error(`stage:${stage.id} formula component missing ${key}`);
    }
    if (part.score < 0 || part.score > 100) throw new Error(`stage:${stage.id} component score out of range`);
  }
  if (!stage.validation || !stage.validation.status || !Array.isArray(stage.validation.samples) || stage.validation.samples.length === 0) {
    throw new Error(`stage:${stage.id} missing validation samples`);
  }
  const weighted = Math.round(stage.formula_components.reduce((sum, part) => sum + part.score * part.weight, 0));
  if (Math.abs(weighted - stage.pressure) > 3) {
    throw new Error(`stage:${stage.id} displayed pressure differs from weighted formula by more than 3 points`);
  }
}

for (const stage of data.stages) {
  checkContract(`stage:${stage.id}`, stage.contract);
  checkFreshness(`stage:${stage.id}`, stage.contract);
  assertWeightedFormula(stage);
}
for (const edge of data.edges) {
  checkContract(`edge:${edge.id}`, edge.contract);
  checkFreshness(`edge:${edge.id}`, edge.contract);
}
for (const snapshot of data.snapshots) {
  checkContract(`snapshot:${snapshot.id}`, snapshot.contract);
  checkFreshness(`snapshot:${snapshot.id}`, snapshot.contract);
}
for (const path of data.thin_paths) {
  for (const key of ["path_id", "node_ids", "edge_ids", "metric_name", "formula_or_manual_rule", "update_owner", "update_workflow", "scenario_horizon", "scenario_assumptions", "scenario_rule_bindings", "paid_job", "non_advice_boundary", "release_blocker", "service_boundary"]) {
    if (!(key in path)) throw new Error(`thin_path:${path.path_id || "unknown"} missing ${key}`);
  }
  if (path.update_owner === "unassigned_operator" || path.update_owner === "unassigned") {
    throw new Error(`thin_path:${path.path_id} has unassigned update_owner`);
  }
  if (!Array.isArray(path.scenario_rule_bindings) || path.scenario_rule_bindings.length === 0) {
    throw new Error(`thin_path:${path.path_id} missing scenario_rule_bindings`);
  }
  for (const snapshot of data.snapshots.filter((item) => item.contract.snapshot_type === "scenario")) {
    for (const [target_id, expected_delta] of Object.entries(snapshot.delta)) {
      const binding = path.scenario_rule_bindings.find((item) => item.scenario_id === snapshot.id && item.target_id === target_id);
      if (!binding) throw new Error(`scenario:${snapshot.id} missing binding for ${target_id}`);
      if (binding.expected_delta !== expected_delta) {
        throw new Error(`scenario:${snapshot.id} binding delta mismatch for ${target_id}`);
      }
    }
  }
}

if (data.meta.candidate_id !== "r7-feedback-ready-radar") {
  throw new Error("quality gate must target r7-feedback-ready-radar");
}

const stageIds = new Set(data.stages.map((stage) => stage.id));
for (const stageId of stageIds) {
  const sample = data.calibration_samples?.find((item) => item.stage_id === stageId && item.verdict === "pass_representative_sample");
  if (!sample) throw new Error(`stage:${stageId} missing representative calibration sample`);
  if (sample.actual_score < sample.expected_range[0] || sample.actual_score > sample.expected_range[1]) {
    throw new Error(`stage:${stageId} calibration sample outside expected range`);
  }
  const review = data.source_review_queue?.find((item) => item.stage_id === stageId && item.review_status === "pass_representative_demo");
  if (!review) throw new Error(`stage:${stageId} missing source review pass`);
}

const compliance = new Map((data.compliance_checklist || []).map((item) => [item.id, item.status]));
for (const id of ["non-advice-copy", "no-buy-sell", "source-boundary"]) {
  if (compliance.get(id) !== "pass_local_review") throw new Error(`compliance:${id} must pass local review`);
}
if (compliance.get("paid-legal") !== "external_required") {
  throw new Error("paid legal review must remain external_required before paid release");
}
if (data.pricing_hypothesis?.paid_service_status !== "not_launched") {
  throw new Error("pricing hypothesis must remain not_launched for R7");
}
if (data.update_sla?.paid_sla_status !== "candidate_not_launched") {
  throw new Error("paid SLA must remain candidate_not_launched for R7");
}

if (!data.customer_proof || data.customer_proof.proof_status !== "local_feedback_capture_ready") {
  throw new Error("R7 must classify customer proof as local_feedback_capture_ready");
}
if (!data.feedback_surface || data.feedback_surface.capture_storage !== "localStorage.ai-bottleneck-r7-feedback") {
  throw new Error("R7 must include a feedback capture storage path");
}
if (!Array.isArray(data.feedback_surface.repeat_use_workflows) || data.feedback_surface.repeat_use_workflows.length < stageIds.size) {
  throw new Error("R7 must include repeat-use workflows for displayed stages");
}
if (!Array.isArray(data.feedback_surface.pricing_choices) || data.feedback_surface.pricing_choices.length < 2) {
  throw new Error("R7 must include pricing choices");
}
for (const test of data.feedback_surface.pricing_choices) {
  if (test.evidence_status !== "local_choice_only") {
    throw new Error(`pricing choice ${test.id} must remain local_choice_only`);
  }
}
for (const blocker of ["real customer capture", "payment approval", "legal review", "paid SLA approval"]) {
  if (!data.customer_proof.external_blockers?.includes(blocker)) {
    throw new Error(`R6 missing external blocker: ${blocker}`);
  }
}
if (!html.includes("Macro Bottleneck Map") || !html.includes("가장 큰 병목") || !html.includes("전파 경로")) {
  throw new Error("R7 first viewport must preserve the macro bottleneck promise");
}
for (const term of ["Feedback Ready Surface", "로컬 피드백 저장", "가격 실험", "관심 루틴"]) {
  if (!html.includes(term)) throw new Error(`R7 feedback UI missing ${term}`);
}
if (!html.includes("병목과 전파 경로") || !data.feedback_surface.summary.includes("병목과 전파 경로")) {
  throw new Error("R7 feedback copy must support the macro bottleneck promise");
}

console.log("data contract gate: pass");
