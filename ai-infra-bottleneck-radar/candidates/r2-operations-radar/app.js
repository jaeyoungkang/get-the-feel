const state = {
  data: null,
  selectedStage: "packaging",
  selectedSnapshot: "current-index"
};

const map = document.querySelector("#map");
const snapshotControls = document.querySelector("#snapshotControls");
const snapshotNote = document.querySelector("#snapshotNote");
const serviceBoundary = document.querySelector("#serviceBoundary");
const freshnessLabel = document.querySelector("#freshnessLabel");
const detailScore = document.querySelector("#detailScore");
const detailTitle = document.querySelector("#detailTitle");
const detailSummary = document.querySelector("#detailSummary");
const contractList = document.querySelector("#contractList");
const microList = document.querySelector("#microList");
const scenarioRules = document.querySelector("#scenarioRules");
const releaseBoundary = document.querySelector("#releaseBoundary");
const sourceLinks = document.querySelector("#sourceLinks");

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function color(value) {
  if (value >= 88) return "var(--hot)";
  if (value >= 76) return "var(--warm)";
  return "var(--cool)";
}

function selectedSnapshot() {
  return state.data.snapshots.find((snapshot) => snapshot.id === state.selectedSnapshot);
}

function stage(id) {
  return state.data.stages.find((item) => item.id === id);
}

function scoreFor(item) {
  const snap = selectedSnapshot();
  return clamp(item.pressure + (snap.delta[item.id] || 0));
}

function daysBetween(a, b) {
  const start = new Date(`${a}T00:00:00Z`);
  const end = new Date(`${b}T00:00:00Z`);
  return Math.floor((end - start) / 86400000);
}

function freshness(contract) {
  const age = daysBetween(contract.applied_at, state.data.meta.freshness_today);
  if (age > contract.stale_after_days) return "stale";
  if (age > Math.floor(contract.stale_after_days * 0.75)) return "review_required";
  return "fresh";
}

function renderControls() {
  snapshotControls.innerHTML = state.data.snapshots.map((snapshot) => `
    <button type="button" class="${snapshot.id === state.selectedSnapshot ? "active" : ""}" data-snapshot="${snapshot.id}">
      ${snapshot.label}
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
    const stroke = color(edge.pressure);
    return `
      <path class="edge" d="M ${from.x + 74} ${from.y} C ${from.x + 150} ${from.y}, ${to.x - 150} ${to.y}, ${to.x - 74} ${to.y}" stroke="${stroke}" stroke-width="${6 + edge.pressure * 0.08}"></path>
      <text class="edge-label" x="${(from.x + to.x) / 2}" y="${from.y - 42}">${edge.label}</text>
    `;
  }).join("");

  const nodes = state.data.stages.map((item) => {
    const value = scoreFor(item);
    const selected = item.id === state.selectedStage ? "selected" : "";
    return `
      <g class="node ${selected}" data-stage="${item.id}">
        <circle cx="${item.x}" cy="${item.y}" r="${46 + Math.max(0, value - 70) * 0.24}" fill="${color(value)}"></circle>
        <text class="node-score" x="${item.x}" y="${item.y + 7}">${value}</text>
        <text class="node-label" x="${item.x}" y="${item.y + 78}">${item.label}</text>
        <text class="node-fresh" x="${item.x}" y="${item.y + 96}">${freshness(item.contract)}</text>
      </g>
    `;
  }).join("");

  map.innerHTML = `
    <text class="track-label" x="560" y="76">thin path: HBM -> advanced packaging -> cloud capacity</text>
    ${edges}
    ${nodes}
  `;

  map.querySelectorAll("[data-stage]").forEach((node) => {
    node.addEventListener("click", () => {
      state.selectedStage = node.dataset.stage;
      render();
    });
  });
}

function renderDetail() {
  const current = stage(state.selectedStage);
  const snap = selectedSnapshot();
  const path = state.data.thin_paths[0];
  const value = scoreFor(current);
  const status = freshness(current.contract);
  const source = state.data.sources[current.contract.source_id];

  snapshotNote.textContent = snap.note;
  serviceBoundary.textContent = path.service_boundary.representative_demo;
  freshnessLabel.textContent = status;
  detailScore.textContent = value;
  detailTitle.textContent = current.label;
  detailSummary.textContent = current.summary;
  releaseBoundary.textContent = `${path.service_boundary.paid_service}. ${path.non_advice_boundary}`;

  contractList.innerHTML = `
    <div class="contract">
      <strong>${source.label}</strong>
      <span>${current.contract.source_reference}</span>
      <span>owner ${path.update_owner}</span>
      <span>applied ${current.contract.applied_at}</span>
      <span>stale after ${current.contract.stale_after_days}d</span>
      <span>${status}</span>
      <span>${current.contract.formula_status}</span>
    </div>
  `;

  microList.innerHTML = current.micro.map(([label, score]) => `
    <div class="metric">
      <strong><span>${label}</span><span>${score}</span></strong>
      <div class="bar"><span style="width:${score}%; background:${color(score)}"></span></div>
    </div>
  `).join("");

  scenarioRules.innerHTML = path.scenario_rule_bindings.map((binding) => `
    <div class="rule">
      <strong>${binding.target_id}</strong>
      <span>${binding.rule}</span>
    </div>
  `).join("");
}

function renderSources() {
  sourceLinks.innerHTML = Object.values(state.data.sources)
    .filter((source) => source.url.startsWith("https://"))
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
