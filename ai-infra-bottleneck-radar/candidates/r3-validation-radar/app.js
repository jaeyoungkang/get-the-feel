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
  promotionBoundary.textContent = state.data.service_boundary.representative_demo;
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
