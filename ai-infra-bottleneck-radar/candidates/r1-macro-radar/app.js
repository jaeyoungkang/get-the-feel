const state = {
  data: null,
  selectedStage: "packaging",
  selectedSnapshot: "current-index"
};

const radar = document.querySelector("#radar");
const snapshotControls = document.querySelector("#snapshotControls");
const snapshotNote = document.querySelector("#snapshotNote");
const detailType = document.querySelector("#detailType");
const detailScore = document.querySelector("#detailScore");
const detailTitle = document.querySelector("#detailTitle");
const detailSummary = document.querySelector("#detailSummary");
const pathSummary = document.querySelector("#pathSummary");
const microList = document.querySelector("#microList");
const watchList = document.querySelector("#watchList");
const contractList = document.querySelector("#contractList");
const sourceLinks = document.querySelector("#sourceLinks");

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function color(value) {
  if (value >= 86) return "var(--hot)";
  if (value >= 72) return "var(--warm)";
  return "var(--cool)";
}

function snapshot() {
  return state.data.snapshots.find((item) => item.id === state.selectedSnapshot);
}

function stage(id) {
  return state.data.stages.find((item) => item.id === id);
}

function scoreFor(item) {
  const snap = snapshot();
  return clamp(item.pressure + (snap.delta[item.id] || 0));
}

function polar(angle, radius) {
  const radians = (angle - 90) * Math.PI / 180;
  return {
    x: 450 + Math.cos(radians) * radius,
    y: 382 + Math.sin(radians) * radius
  };
}

function isThinPathEdge(edge) {
  return state.data.thin_paths[0].edge_ids.includes(edge.id);
}

function isThinPathNode(node) {
  return state.data.thin_paths[0].node_ids.includes(node.id);
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

function renderRadar() {
  const rings = [120, 205, 290].map((radius) => `<circle class="ring" cx="450" cy="382" r="${radius}"></circle>`).join("");
  const center = `
    <circle class="center" cx="450" cy="382" r="74"></circle>
    <text class="center-title" x="450" y="375">AI 인프라</text>
    <text class="center-sub" x="450" y="397">수요 압력</text>
  `;

  const edges = state.data.edges.map((edge) => {
    const from = polar(stage(edge.from).angle, 275);
    const to = polar(stage(edge.to).angle, 275);
    const active = isThinPathEdge(edge) ? "thin" : "";
    return `
      <path class="edge ${active}" d="M ${from.x} ${from.y} Q 450 382 ${to.x} ${to.y}" stroke="${color(edge.pressure)}" stroke-width="${isThinPathEdge(edge) ? 11 : 5 + edge.pressure * 0.06}"></path>
      <text class="edge-label" x="${(from.x + to.x + 450) / 3}" y="${(from.y + to.y + 382) / 3}">${edge.label}</text>
    `;
  }).join("");

  const nodes = state.data.stages.map((item) => {
    const point = polar(item.angle, 275);
    const value = scoreFor(item);
    const radius = 38 + Math.max(0, value - 65) * 0.28;
    const selected = item.id === state.selectedStage ? "selected" : "";
    const thin = isThinPathNode(item) ? "thin" : "";
    return `
      <g class="node ${selected} ${thin}" data-stage="${item.id}">
        <circle cx="${point.x}" cy="${point.y}" r="${radius}" fill="${color(value)}"></circle>
        <text class="node-score" x="${point.x}" y="${point.y + 7}">${value}</text>
        <text class="node-label" x="${point.x}" y="${point.y + radius + 22}">${item.label}</text>
      </g>
    `;
  }).join("");

  radar.innerHTML = `${rings}${edges}${center}${nodes}`;
  radar.querySelectorAll("[data-stage]").forEach((node) => {
    node.addEventListener("click", () => {
      state.selectedStage = node.dataset.stage;
      render();
    });
  });
}

function renderDetail() {
  const selected = stage(state.selectedStage);
  const snap = snapshot();
  const value = scoreFor(selected);
  const path = state.data.thin_paths[0];
  const contracts = [
    ["node", selected.contract],
    ["snapshot", snap.contract]
  ];

  detailType.textContent = snap.contract.snapshot_type;
  detailScore.textContent = value;
  detailTitle.textContent = selected.label;
  detailSummary.textContent = selected.summary;
  snapshotNote.textContent = snap.note;
  pathSummary.textContent = `${path.label}. ${path.metric_name}. ${path.non_advice_boundary}`;

  microList.innerHTML = selected.micro.map(([label, score]) => `
    <div class="metric">
      <strong><span>${label}</span><span>${score}</span></strong>
      <div class="bar"><span style="width:${score}%; background:${color(score)}"></span></div>
    </div>
  `).join("");

  watchList.innerHTML = selected.watch.map((item) => `<li>${item}</li>`).join("");

  contractList.innerHTML = contracts.map(([label, contract]) => {
    const source = state.data.sources[contract.source_id];
    return `
      <div class="contract">
        <strong>${label}: ${source.label}</strong>
        <span>${contract.source_status}</span>
        <span>as_of ${contract.as_of}</span>
        <span>${contract.cadence}</span>
        <span>${contract.freshness_status}</span>
        <span>stale ${contract.stale_after_days}d</span>
        <span>${contract.snapshot_type}</span>
        <span>${contract.formula_status}</span>
      </div>
    `;
  }).join("");
}

function renderSources() {
  sourceLinks.innerHTML = Object.values(state.data.sources)
    .filter((source) => source.url.startsWith("https://"))
    .map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>`)
    .join("");
}

function render() {
  renderControls();
  renderRadar();
  renderDetail();
  renderSources();
}

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    state.data = data;
    render();
  });
