const state = {
  data: null,
  selectedStage: "packaging",
  selectedSnapshot: "current"
};

const map = document.querySelector("#map");
const snapshotControls = document.querySelector("#snapshotControls");
const snapshotNote = document.querySelector("#snapshotNote");
const promotionBoundary = document.querySelector("#promotionBoundary");
const statusLabel = document.querySelector("#statusLabel");
const detailScore = document.querySelector("#detailScore");
const detailTitle = document.querySelector("#detailTitle");
const detailSummary = document.querySelector("#detailSummary");
const formulaList = document.querySelector("#formulaList");
const validationList = document.querySelector("#validationList");
const representativeGate = document.querySelector("#representativeGate");
const contractList = document.querySelector("#contractList");
const releaseBoundary = document.querySelector("#releaseBoundary");
const sourceLinks = document.querySelector("#sourceLinks");

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
  const delta = snapshot().delta[item.id] || 0;
  return clamp(item.pressure + delta);
}

function weightedScore(item) {
  return clamp(item.formula_components.reduce((sum, part) => sum + part.score * part.weight, 0));
}

function daysBetween(start, end) {
  return Math.floor((new Date(`${end}T00:00:00Z`) - new Date(`${start}T00:00:00Z`)) / 86400000);
}

function freshness(contract) {
  const age = daysBetween(contract.applied_at, state.data.meta.freshness_today);
  if (age > contract.stale_after_days) return "stale";
  if (age > Math.floor(contract.stale_after_days * 0.75)) return "review_required";
  return "fresh";
}

function validationStatus(item) {
  if (item.validation.status === "calibrated_sample") return "sample-calibrated";
  if (item.validation.status === "declared_not_backtested") return "needs-backtest";
  return item.validation.status;
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
    const stroke = pressureColor(edge.pressure);
    return `
      <path class="edge" d="M ${from.x + 76} ${from.y} C ${from.x + 170} ${from.y - 12}, ${to.x - 170} ${to.y - 12}, ${to.x - 76} ${to.y}" stroke="${stroke}" stroke-width="${6 + edge.pressure * 0.07}"></path>
      <text class="edge-label" x="${(from.x + to.x) / 2}" y="${from.y - 48}">${edge.label} ${edge.pressure}</text>
    `;
  }).join("");

  const nodes = state.data.stages.map((item) => {
    const value = scoreFor(item);
    const computed = weightedScore(item);
    const selected = item.id === state.selectedStage ? "selected" : "";
    return `
      <g class="node ${selected}" data-stage="${item.id}">
        <circle cx="${item.x}" cy="${item.y}" r="${48 + Math.max(0, value - 70) * 0.22}" fill="${pressureColor(value)}"></circle>
        <text class="node-score" x="${item.x}" y="${item.y + 8}">${value}</text>
        <text class="node-label" x="${item.x}" y="${item.y + 84}">${item.label}</text>
        <text class="node-status" x="${item.x}" y="${item.y + 104}">${validationStatus(item)} · formula ${computed}</text>
      </g>
    `;
  }).join("");

  map.innerHTML = `
    <text class="track-label" x="590" y="70">macro map with thin path validation: HBM -> packaging -> systems -> cloud</text>
    ${edges}
    ${nodes}
    <text class="validation-label" x="590" y="552">${state.data.meta.release_tier}</text>
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
  const snap = snapshot();
  const source = state.data.sources[item.contract.source_id];
  const status = freshness(item.contract);
  const score = scoreFor(item);

  snapshotNote.textContent = snap.note;
  promotionBoundary.textContent = "현재 화면은 투자 판단이 아니라 병목 맥락을 빠르게 읽기 위한 지도다. 대표 데모와 유료 판매 경계는 우측에서 확인한다.";
  statusLabel.textContent = validationStatus(item);
  detailScore.textContent = score;
  detailTitle.textContent = item.label;
  detailSummary.textContent = item.summary;
  releaseBoundary.textContent = `${state.data.service_boundary.paid_service} ${state.data.meta.non_advice_boundary}`;

  formulaList.innerHTML = item.formula_components.map((part) => `
    <div class="metric">
      <strong><span>${part.label} (${Math.round(part.weight * 100)}%)</span><span>${part.score}</span></strong>
      <div class="bar"><span style="width:${part.score}%; background:${pressureColor(part.score)}"></span></div>
    </div>
  `).join("");

  validationList.innerHTML = item.validation.samples.map((sample) => `
    <div class="sample">
      <strong><span>${sample.label}</span><span>${sample.result}</span></strong>
      <span>${sample.method}</span>
      <span>${sample.status}</span>
    </div>
  `).join("");

  const calibration = state.data.calibration_samples.find((sample) => sample.stage_id === item.id);
  const review = state.data.source_review_queue.find((entry) => entry.stage_id === item.id);
  representativeGate.innerHTML = `
    <div class="contract">
      <strong><span>대표 샘플</span><span>${calibration.verdict}</span></strong>
      <span>${calibration.mapped_component}: ${calibration.actual_score} / expected ${calibration.expected_range.join("-")}</span>
      <span>${calibration.source_reference}</span>
    </div>
    <div class="contract">
      <strong><span>출처 리뷰</span><span>${review.review_status}</span></strong>
      <span>${review.reviewer_role} · ${review.reviewed_at}</span>
      <span>${review.source_reference}</span>
    </div>
    <div class="contract">
      <strong><span>아직 못 믿는 이유</span><span>${state.data.pricing_hypothesis.paid_service_status}</span></strong>
      <span>${state.data.pricing_hypothesis.candidate_price}</span>
      <span>${state.data.update_sla.cadence}; paid SLA ${state.data.update_sla.paid_sla_status}</span>
    </div>
  `;

  contractList.innerHTML = `
    <div class="contract">
      <strong><span>${source.label}</span><span>${status}</span></strong>
      <span>${item.contract.source_reference}</span>
      <span>owner ${state.data.meta.update_owner}</span>
      <span>applied ${item.contract.applied_at}; stale after ${item.contract.stale_after_days}d</span>
      <span>${item.contract.formula_status}</span>
    </div>
  `;
}

function renderSources() {
  sourceLinks.innerHTML = Object.values(state.data.sources)
    .map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>`)
    .join("");
}

function render() {
  renderControls();
  renderMap();
  renderDetail();
  renderSources();
}

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    state.data = data;
    render();
  });
