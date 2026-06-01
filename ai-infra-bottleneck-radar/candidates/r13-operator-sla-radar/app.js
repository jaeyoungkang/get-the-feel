const state = {
  data: null,
  selectedStage: "packaging",
  selectedSnapshot: "current",
  selectedRoutine: "monthly-brief",
  selectedPrice: "individual-brief"
};

const map = document.querySelector("#map");
const snapshotControls = document.querySelector("#snapshotControls");
const snapshotNote = document.querySelector("#snapshotNote");
const feedbackSummary = document.querySelector("#feedbackSummary");
const statusLabel = document.querySelector("#statusLabel");
const detailScore = document.querySelector("#detailScore");
const detailTitle = document.querySelector("#detailTitle");
const detailSummary = document.querySelector("#detailSummary");
const impactList = document.querySelector("#impactList");
const trustList = document.querySelector("#trustList");
const routineList = document.querySelector("#routineList");
const routineChoices = document.querySelector("#routineChoices");
const priceChoices = document.querySelector("#priceChoices");
const externalProofPaths = document.querySelector("#externalProofPaths");
const sellableBoundary = document.querySelector("#sellableBoundary");
const operatorSla = document.querySelector("#operatorSla");
const feedbackForm = document.querySelector("#feedbackForm");
const contactInput = document.querySelector("#contactInput");
const useCaseInput = document.querySelector("#useCaseInput");
const feedbackInput = document.querySelector("#feedbackInput");
const feedbackStatus = document.querySelector("#feedbackStatus");
const copyReportButton = document.querySelector("#copyReportButton");
const downloadSignalButton = document.querySelector("#downloadSignalButton");
const exportStatus = document.querySelector("#exportStatus");

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function pressureColor(value) {
  if (value >= 88) return "var(--hot)";
  if (value >= 76) return "var(--warm)";
  return "var(--cool)";
}

function snapshot() {
  return state.data.snapshots.find((item) => item.id === state.selectedSnapshot);
}

function stage(id) {
  return state.data.stages.find((item) => item.id === id);
}

function scoreFor(item) {
  return clamp(item.pressure + (snapshot().delta[item.id] || 0));
}

function weightedScore(item) {
  return clamp(item.formula_components.reduce((sum, part) => sum + part.score * part.weight, 0));
}

function renderControls() {
  snapshotControls.innerHTML = state.data.snapshots.map((item) => `
    <button type="button" class="${item.id === state.selectedSnapshot ? "active" : ""}" data-snapshot="${item.id}">
      ${item.label}
    </button>
  `).join("");

  snapshotControls.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedSnapshot = button.dataset.snapshot;
      render();
    });
  });
}

function renderMap() {
  const edges = state.data.edges.map((edge) => {
    const from = stage(edge.from);
    const to = stage(edge.to);
    return `
      <path class="edge" d="M ${from.x + 76} ${from.y} C ${from.x + 170} ${from.y - 10}, ${to.x - 170} ${to.y - 10}, ${to.x - 76} ${to.y}" stroke="${pressureColor(edge.pressure)}" stroke-width="${6 + edge.pressure * 0.07}"></path>
      <text class="edge-label" x="${(from.x + to.x) / 2}" y="${from.y - 48}">${edge.label} ${edge.pressure}</text>
    `;
  }).join("");

  const nodes = state.data.stages.map((item) => {
    const value = scoreFor(item);
    const selected = item.id === state.selectedStage ? "selected" : "";
    return `
      <g class="node ${selected}" data-stage="${item.id}">
        <circle cx="${item.x}" cy="${item.y}" r="${48 + Math.max(0, value - 70) * 0.22}" fill="${pressureColor(value)}"></circle>
        <text class="node-score" x="${item.x}" y="${item.y + 8}">${value}</text>
        <text class="node-label" x="${item.x}" y="${item.y + 84}">${item.label}</text>
        <text class="node-status" x="${item.x}" y="${item.y + 104}">formula ${weightedScore(item)} · ${item.customer_signal}</text>
      </g>
    `;
  }).join("");

  map.innerHTML = `
    <text class="track-label" x="590" y="70">HBM -> packaging -> systems -> cloud: AI infrastructure bottleneck path</text>
    ${edges}
    ${nodes}
    <text class="snapshot-label" x="590" y="552">${snapshot().label}: ${snapshot().customer_readout}</text>
  `;

  map.querySelectorAll("[data-stage]").forEach((node) => {
    node.addEventListener("click", () => {
      state.selectedStage = node.dataset.stage;
      render();
    });
  });
}

function renderDetail() {
  const item = stage(state.selectedStage);
  const calibration = state.data.calibration_samples.find((sample) => sample.stage_id === item.id);
  const review = state.data.source_review_queue.find((entry) => entry.stage_id === item.id);
  const routine = state.data.feedback_surface.repeat_use_workflows.find((entry) => entry.stage_id === item.id);

  snapshotNote.textContent = snapshot().note;
  feedbackSummary.textContent = state.data.feedback_surface.summary;
  statusLabel.textContent = item.customer_signal;
  detailScore.textContent = scoreFor(item);
  detailTitle.textContent = item.label;
  detailSummary.textContent = item.summary;

  impactList.innerHTML = item.investor_impact.map((impact) => `
    <div class="item">
      <strong><span>${impact.label}</span><span>${impact.severity}</span></strong>
      <span>${impact.reading}</span>
    </div>
  `).join("");

  trustList.innerHTML = `
    <div class="item">
      <strong><span>대표 샘플</span><span>${calibration.verdict}</span></strong>
      <span>${calibration.mapped_component}: ${calibration.actual_score} / expected ${calibration.expected_range.join("-")}</span>
      <span>${calibration.source_reference}</span>
    </div>
    <div class="item">
      <strong><span>출처 리뷰</span><span>${review.review_status}</span></strong>
      <span>${review.reviewer_role} · ${review.reviewed_at}</span>
      <span>${review.source_reference}</span>
    </div>
  `;

  routineList.innerHTML = routine.triggers.map((trigger) => `
    <div class="item">
      <strong><span>${trigger.label}</span><span>${trigger.frequency}</span></strong>
      <span>${trigger.reason}</span>
    </div>
  `).join("");
}

function renderFeedbackSurface() {
  routineChoices.innerHTML = state.data.feedback_surface.routine_choices.map((item) => `
    <button type="button" class="choice ${item.id === state.selectedRoutine ? "active" : ""}" data-routine="${item.id}">
      <strong><span>${item.label}</span><span>${item.cadence}</span></strong>
      <span>${item.promise}</span>
    </button>
  `).join("");

  priceChoices.innerHTML = state.data.feedback_surface.pricing_choices.map((item) => `
    <button type="button" class="choice ${item.id === state.selectedPrice ? "active" : ""}" data-price="${item.id}">
      <strong><span>${item.label}</span><span>${item.price}</span></strong>
      <span>${item.promise}</span>
      <span>${item.evidence_status}</span>
    </button>
  `).join("");

  externalProofPaths.innerHTML = state.data.external_proof_surface.capture_paths.map((item) => `
    <div class="item">
      <strong><span>${item.label}</span><span>${item.evidence_result}</span></strong>
      <span>${item.status}</span>
    </div>
  `).join("");

  sellableBoundary.innerHTML = `
    <div class="item">
      <strong><span>${state.data.sellable_boundary.current_decision}</span><span>sellable_status</span></strong>
      <span>${state.data.sellable_boundary.decision_reason}</span>
    </div>
    ${state.data.sellable_boundary.pass_conditions.slice(0, 2).map((item) => `
      <div class="item">
        <strong><span>pass condition</span><span>required</span></strong>
        <span>${item}</span>
      </div>
    `).join("")}
  `;

  operatorSla.innerHTML = `
    <div class="item">
      <strong><span>${state.data.operator_sla.paid_sla_decision}</span><span>${state.data.operator_sla.staffing_status}</span></strong>
      <span>${state.data.operator_sla.blocked_reason}</span>
    </div>
    <div class="item">
      <strong><span>${state.data.operator_sla.owner}</span><span>${state.data.operator_sla.cadence}</span></strong>
      <span>source review window ${state.data.operator_sla.source_review_window_days} days · ${state.data.operator_sla.escalation_status}</span>
    </div>
  `;

  useCaseInput.innerHTML = state.data.feedback_surface.use_cases
    .map((item) => `<option value="${item.id}">${item.label}</option>`)
    .join("");

  routineChoices.querySelectorAll("[data-routine]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedRoutine = button.dataset.routine;
      renderFeedbackSurface();
    });
  });

  priceChoices.querySelectorAll("[data-price]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedPrice = button.dataset.price;
      renderFeedbackSurface();
    });
  });
}

function buildPublicSignal() {
  const selected = stage(state.selectedStage);
  const selectedRoutine = state.data.feedback_surface.routine_choices.find((item) => item.id === state.selectedRoutine);
  const selectedPrice = state.data.feedback_surface.pricing_choices.find((item) => item.id === state.selectedPrice);
  return {
    candidate_id: state.data.meta.candidate_id,
    product_surface: "external_proof_path_candidate",
    selected_stage: selected.id,
    selected_stage_label: selected.label,
    selected_stage_score: scoreFor(selected),
    selected_snapshot: state.selectedSnapshot,
    routine: state.selectedRoutine,
    routine_label: selectedRoutine?.label,
    price: state.selectedPrice,
    price_label: selectedPrice?.label,
    use_case: useCaseInput.value,
    requested_bottleneck: feedbackInput.value.trim(),
    contact_hint: contactInput.value.trim(),
    proof_boundary: state.data.customer_proof.proof_boundary,
    external_evidence_path: state.data.paid_proof_surface.external_evidence_path,
    external_capture_paths: state.data.external_proof_surface.capture_paths.map((item) => item.id),
    sellable_boundary_decision: state.data.sellable_boundary.current_decision,
    sellable_boundary_reason: state.data.sellable_boundary.decision_reason,
    operator_sla_decision: state.data.operator_sla.paid_sla_decision,
    operator_sla_reason: state.data.operator_sla.blocked_reason,
    evidence_status: "external_proof_packet_local_export",
    captured_at: new Date().toISOString()
  };
}

function buildReportText() {
  const item = stage(state.selectedStage);
  return [
    "AI Infra Bottleneck Radar",
    `현재 스냅샷: ${snapshot().label}`,
    `선택 병목: ${item.label} ${scoreFor(item)}`,
    `전파 경로: ${state.data.thin_paths[0].node_ids.join(" -> ")}`,
    `사용 루틴: ${state.selectedRoutine}`,
    `결제 의향: ${state.selectedPrice}`,
    `고객 검증 패킷: ${state.data.paid_proof_surface.packet_name}`,
    `운영 SLA 판정: ${state.data.sellable_boundary.current_decision}`,
    `판정 이유: ${state.data.sellable_boundary.decision_reason}`,
    `외부 증거 경로: ${state.data.paid_proof_surface.external_evidence_path}`,
    `샘플 리포트: ${state.data.subscription_surface.sample_paid_report}`,
    "경계: 투자 조언이 아니라 공급망 맥락 리서치다."
  ].join("\n");
}

feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const signal = buildPublicSignal();
  localStorage.setItem("ai-bottleneck-r13-operator-sla-context", JSON.stringify(signal));
  feedbackStatus.textContent = "외부 고객 검증용 증거 패킷이 저장됐다. 인터뷰, 대기자, 결제 의향 화면으로 옮길 수 있다.";
});

copyReportButton.addEventListener("click", () => {
  navigator.clipboard.writeText(buildReportText()).then(() => {
    exportStatus.textContent = "현재 병목 리포트를 클립보드에 복사했다.";
  }).catch(() => {
    exportStatus.textContent = buildReportText();
  });
});

downloadSignalButton.addEventListener("click", () => {
  const signal = buildPublicSignal();
  const blob = new Blob([JSON.stringify(signal, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ai-bottleneck-r13-operator-sla-intent.json";
  link.click();
  URL.revokeObjectURL(url);
  exportStatus.textContent = "결제 의향 증거 패킷 JSON을 다운로드했다.";
});

function render() {
  renderControls();
  renderMap();
  renderDetail();
  renderFeedbackSurface();
}

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    state.data = data;
    render();
  });
