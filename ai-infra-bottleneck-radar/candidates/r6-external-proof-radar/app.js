const state = {
  data: null,
  selectedStage: "packaging",
  selectedSnapshot: "current"
};

const map = document.querySelector("#map");
const snapshotControls = document.querySelector("#snapshotControls");
const snapshotNote = document.querySelector("#snapshotNote");
const saleBoundary = document.querySelector("#saleBoundary");
const statusLabel = document.querySelector("#statusLabel");
const detailScore = document.querySelector("#detailScore");
const detailTitle = document.querySelector("#detailTitle");
const detailSummary = document.querySelector("#detailSummary");
const impactList = document.querySelector("#impactList");
const trustList = document.querySelector("#trustList");
const blockerList = document.querySelector("#blockerList");
const externalGate = document.querySelector("#externalGate");

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

  snapshotNote.textContent = snapshot().note;
  saleBoundary.textContent = state.data.external_proof.sale_boundary;
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

  blockerList.innerHTML = state.data.external_proof.blockers.map((blocker) => `
    <div class="item">
      <strong><span>${blocker.label}</span><span>${blocker.status}</span></strong>
      <span>${blocker.reason}</span>
    </div>
  `).join("");
}

function renderExternalGate() {
  externalGate.innerHTML = state.data.external_proof.blockers.map((blocker) => `
    <div class="item">
      <strong><span>${blocker.label}</span><span>${blocker.owner}</span></strong>
      <span>${blocker.required_evidence}</span>
      <span>${blocker.status}</span>
    </div>
  `).join("");
}

function render() {
  renderControls();
  renderMap();
  renderDetail();
  renderExternalGate();
}

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    state.data = data;
    render();
  });
