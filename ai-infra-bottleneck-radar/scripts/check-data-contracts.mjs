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

if (data.meta.candidate_id !== "r14-paid-onboarding-radar") {
  throw new Error("quality gate must target r14-paid-onboarding-radar");
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
  throw new Error("pricing hypothesis must remain not_launched for R14");
}
if (data.update_sla?.paid_sla_status !== "operator_boundary_candidate") {
  throw new Error("paid SLA must remain operator_boundary_candidate for R14");
}

if (!data.customer_proof || data.customer_proof.proof_status !== "paid_onboarding_candidate") {
  throw new Error("R14 must classify customer proof as paid_onboarding_candidate");
}
if (!data.customer_proof.proof_boundary || !data.customer_proof.proof_boundary.includes("sellability denied until external customer/payment evidence exists outside localStorage")) {
  throw new Error("R14 must include customer proof boundary denying sellability until external evidence exists");
}
if (!data.feedback_surface || data.feedback_surface.capture_storage !== "localStorage.ai-bottleneck-r14-paid-onboarding-context") {
  throw new Error("R14 must include paid-onboarding context storage path");
}
if (!Array.isArray(data.feedback_surface.repeat_use_workflows) || data.feedback_surface.repeat_use_workflows.length < stageIds.size) {
  throw new Error("R14 must include repeat-use workflows for displayed stages");
}
if (!Array.isArray(data.feedback_surface.pricing_choices) || data.feedback_surface.pricing_choices.length < 2) {
  throw new Error("R14 must include pricing choices");
}
for (const test of data.feedback_surface.pricing_choices) {
  if (test.evidence_status !== "local_choice_only") {
    throw new Error(`pricing choice ${test.id} must remain local_choice_only`);
  }
}
for (const blocker of ["real customer capture", "payment approval", "legal review", "paid SLA approval"]) {
  if (!data.customer_proof.external_blockers?.includes(blocker)) {
    throw new Error(`R14 missing external blocker: ${blocker}`);
  }
}
if (!html.includes("Macro Bottleneck Map") || !html.includes("가장 큰 병목") || !html.includes("전파 경로")) {
  throw new Error("R14 first viewport must preserve the macro bottleneck promise");
}
for (const term of ["Paid Onboarding Surface", "유료 온보딩 경계 저장", "유료 온보딩 판정", "결제 의향", "유료 온보딩 경계 복사", "유료 온보딩 경계 JSON 다운로드"]) {
  if (!html.includes(term)) throw new Error(`R14 paid-onboarding UI missing ${term}`);
}
if (!html.includes("병목과 전파 경로") || !data.feedback_surface.summary.includes("병목과 전파 경로")) {
  throw new Error("R14 paid-onboarding copy must support the macro bottleneck promise");
}
if (!data.subscription_surface || !data.subscription_surface.sample_paid_report || !data.subscription_surface.upgrade_decision) {
  throw new Error("R14 must include subscription surface sample report and upgrade decision");
}
if (!data.paid_proof_surface || !data.paid_proof_surface.packet_name || !data.paid_proof_surface.external_evidence_path) {
  throw new Error("R14 must include paid_proof_surface packet and external evidence path");
}
for (const key of ["selected_stage", "selected_snapshot", "routine", "price", "use_case", "contact_hint", "proof_boundary"]) {
  if (!data.paid_proof_surface.required_packet_fields?.includes(key)) {
    throw new Error(`R14 paid-onboarding packet missing required field ${key}`);
  }
}
if (data.paid_proof_surface.payment_status !== "not_collected" || data.paid_proof_surface.legal_status !== "external_required" || data.paid_proof_surface.sla_status !== "candidate_not_launched") {
  throw new Error("R14 paid-onboarding surface must refuse payment/legal/SLA completion claims");
}
if (!data.external_proof_surface || !Array.isArray(data.external_proof_surface.capture_paths) || data.external_proof_surface.capture_paths.length < 3) {
  throw new Error("R14 must include external proof capture paths");
}
for (const path of data.external_proof_surface.capture_paths) {
  if (path.status !== "external_required" || path.evidence_result !== "not_captured") {
    throw new Error(`R14 external path ${path.id} must remain external_required and not_captured`);
  }
}
if (!data.external_proof_surface.promotion_rule?.includes("outside localStorage")) {
  throw new Error("R14 promotion rule must require external evidence outside localStorage");
}
if (!data.sellable_boundary || data.sellable_boundary.current_decision !== "blocked") {
  throw new Error("R14 must keep sellable_boundary.current_decision blocked until evidence exists");
}
if (!data.sellable_boundary.decision_reason?.includes("external evidence is not captured")) {
  throw new Error("R14 sellable boundary must explain missing external evidence");
}
if (!data.sellable_boundary.pass_conditions?.some((item) => item.includes("outside localStorage"))) {
  throw new Error("R14 pass conditions must require evidence outside localStorage");
}
if (!data.sellable_boundary.blocked_conditions?.includes("local export only")) {
  throw new Error("R14 blocked conditions must include local export only");
}
if (!data.operator_sla || data.operator_sla.paid_sla_decision !== "blocked") {
  throw new Error("R14 must include blocked operator_sla decision");
}
if (data.operator_sla.staffing_status !== "not_staffed") {
  throw new Error("R14 operator_sla staffing_status must be not_staffed");
}
if (!data.operator_sla.pass_conditions?.some((item) => item.includes("named operator"))) {
  throw new Error("R14 operator_sla pass conditions must require named operator acceptance");
}
if (!data.paid_onboarding || data.paid_onboarding.onboarding_status !== "blocked_before_payment") {
  throw new Error("R14 must keep paid_onboarding blocked_before_payment");
}
if (!data.paid_onboarding.steps?.some((item) => item.id === "payment" && item.status === "blocked_external_required")) {
  throw new Error("R14 payment onboarding step must be externally blocked");
}
if (!data.paid_onboarding.steps?.some((item) => item.id === "sla" && item.status === "blocked_not_staffed")) {
  throw new Error("R14 SLA onboarding step must be blocked_not_staffed");
}

console.log("data contract gate: pass");
