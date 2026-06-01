const sources = {
  "tsmc-2025-ar": "TSMC 2025 Annual Report",
  "skhynix-fy25": "SK hynix FY2025 results",
  "nvidia-fy26-10k": "NVIDIA FY2026 Form 10-K",
  "microsoft-ar25": "Microsoft 2025 Annual Report",
  "operator-curated": "Operator curated prototype"
};

const baseContract = {
  source_status: "curated_official_context",
  as_of: "2026-06-01",
  collected_at: "2026-06-01",
  applied_at: "2026-06-01",
  cadence: "manual_monthly_candidate",
  freshness_status: "prototype_current",
  snapshot_type: "source_backed_index",
  calculation_status: "curated_index"
};

const stages = [
  {
    id: "power",
    label: "전력·부지",
    lane: "Inputs",
    x: 115,
    y: 505,
    pressure: 84,
    source_id: "microsoft-ar25",
    summary: "클라우드 AI 인프라 투자는 전력·부지·냉각 확보 속도에 의해 제한된다.",
    micro: [["전력 계약", 88], ["송전 접속", 83], ["냉각 전환", 78]],
    watch: ["AI 데이터센터 capex", "전력 구매 계약", "지역별 허가 지연"],
    contract: { ...baseContract, source_id: "microsoft-ar25" }
  },
  {
    id: "equipment",
    label: "장비·EDA",
    lane: "Inputs",
    x: 115,
    y: 215,
    pressure: 72,
    source_id: "operator-curated",
    summary: "선단 로직과 고급 패키징 증설의 선행 조건이다.",
    micro: [["EUV·검사", 76], ["EDA/IP", 62], ["후공정 장비", 78]],
    watch: ["장비 리드타임", "패키징 장비 주문", "선단 공정 capex"],
    contract: { ...baseContract, source_id: "operator-curated" }
  },
  {
    id: "foundry",
    label: "선단 파운드리",
    lane: "Silicon",
    x: 330,
    y: 185,
    pressure: 79,
    source_id: "tsmc-2025-ar",
    summary: "AI/HPC 수요를 로직 다이와 선단 공정 capacity로 전환한다.",
    micro: [["3nm/2nm", 82], ["HPC mix", 78], ["지역 증설", 68]],
    watch: ["AI/HPC 매출 비중", "2nm ramp", "advanced node utilization"],
    contract: { ...baseContract, source_id: "tsmc-2025-ar" }
  },
  {
    id: "hbm",
    label: "HBM 메모리",
    lane: "Silicon",
    x: 330,
    y: 415,
    pressure: 91,
    source_id: "skhynix-fy25",
    summary: "AI 가속기 공급량과 ASP를 좌우하는 고대역폭 메모리 축이다.",
    micro: [["HBM3E/HBM4", 93], ["고객 인증", 86], ["TSV/스택", 88]],
    watch: ["HBM 장기계약", "HBM4 전환", "범용 DRAM allocation"],
    contract: { ...baseContract, source_id: "skhynix-fy25" }
  },
  {
    id: "packaging",
    label: "고급 패키징",
    lane: "Integration",
    x: 555,
    y: 305,
    pressure: 94,
    source_id: "tsmc-2025-ar",
    summary: "로직 다이와 HBM을 AI 가속기로 묶는 대표 병목 구간이다.",
    micro: [["CoWoS", 96], ["인터포저", 91], ["테스트 capacity", 84]],
    watch: ["CoWoS 증설", "인터포저 공급", "테스트·번인 병목"],
    contract: { ...baseContract, source_id: "tsmc-2025-ar" }
  },
  {
    id: "systems",
    label: "서버·네트워크",
    lane: "Infrastructure",
    x: 785,
    y: 245,
    pressure: 76,
    source_id: "nvidia-fy26-10k",
    summary: "GPU를 랙·네트워크·클러스터 단위의 판매 가능한 인프라로 만든다.",
    micro: [["AI 서버", 77], ["NVLink/네트워크", 81], ["랙 통합", 69]],
    watch: ["GPU 시스템 납기", "네트워크 attach", "OEM/ODM backlog"],
    contract: { ...baseContract, source_id: "nvidia-fy26-10k" }
  },
  {
    id: "cloud",
    label: "클라우드 용량",
    lane: "Platform",
    x: 995,
    y: 315,
    pressure: 82,
    source_id: "microsoft-ar25",
    summary: "하이퍼스케일러의 AI capex와 capacity가 수요를 매출로 바꾼다.",
    micro: [["GPU 클러스터", 85], ["AI capex", 86], ["마진 부담", 74]],
    watch: ["AI capex 가이던스", "Azure/Cloud 성장", "감가상각·전력 비용"],
    contract: { ...baseContract, source_id: "microsoft-ar25" }
  },
  {
    id: "apps",
    label: "모델·앱 수요",
    lane: "Demand",
    x: 1160,
    y: 490,
    pressure: 70,
    source_id: "operator-curated",
    summary: "학습·추론 사용량이 상류 병목을 다시 자극한다.",
    micro: [["추론 사용량", 74], ["엔터프라이즈 도입", 68], ["토큰 가격", 58]],
    watch: ["추론 비용 하락", "기업 도입", "AI 앱 매출화"],
    contract: { ...baseContract, source_id: "operator-curated" }
  }
];

const edges = [
  ["equipment", "foundry", 72, "공정 capacity"],
  ["equipment", "packaging", 83, "후공정 장비"],
  ["foundry", "packaging", 86, "로직 다이"],
  ["hbm", "packaging", 95, "HBM attach"],
  ["packaging", "systems", 89, "가속기 출하"],
  ["systems", "cloud", 78, "랙 전개"],
  ["power", "cloud", 91, "전력 제약"],
  ["cloud", "apps", 73, "컴퓨트 공급"],
  ["apps", "hbm", 79, "수요 피드백"],
  ["apps", "power", 82, "전력 수요"]
].map(([from, to, pressure, label]) => ({
  id: `${from}-${to}`,
  from,
  to,
  pressure,
  label,
  contract: { ...baseContract, source_id: "operator-curated" }
}));

const snapshots = [
  {
    id: "current",
    label: "2026 현재 지수",
    snapshot_type: "source_backed_index",
    assumption: "공식 출처의 2025/FY2026 맥락을 수동 큐레이션한 현재형 압력 지수다. 측정값 자체가 아니라 운영 전 prototype index다.",
    delta: {},
    edgeDelta: {}
  },
  {
    id: "scenario-packaging-relief",
    label: "2026 H2 패키징 완화",
    snapshot_type: "scenario",
    assumption: "고급 패키징 증설이 일부 반영되지만 HBM과 전력 제약은 유지된다는 가정이다.",
    delta: { packaging: -8, systems: 4, cloud: 3 },
    edgeDelta: { "hbm-packaging": -6, "packaging-systems": -7, "power-cloud": 5 }
  },
  {
    id: "scenario-power-squeeze",
    label: "2027 전력 압박",
    snapshot_type: "scenario",
    assumption: "추론 수요와 클라우드 capex가 지속되어 전력·냉각이 value chain의 상단 병목이 된다는 가정이다.",
    delta: { power: 11, cloud: 7, apps: 8, packaging: -3 },
    edgeDelta: { "power-cloud": 10, "apps-power": 8, "cloud-apps": 5 }
  }
].map((snapshot) => ({
  ...snapshot,
  contract: {
    ...baseContract,
    source_id: snapshot.snapshot_type === "scenario" ? "operator-curated" : "operator-curated",
    snapshot_type: snapshot.snapshot_type,
    calculation_status: snapshot.snapshot_type === "scenario" ? "scenario_model" : "curated_index"
  }
}));

const state = {
  snapshot: snapshots[0],
  selectedStage: "packaging",
  selectedEdge: "hbm-packaging"
};

const svg = document.querySelector("#chainMap");
const snapshotControls = document.querySelector("#snapshotControls");
const snapshotText = document.querySelector("#snapshotText");
const detailType = document.querySelector("#detailType");
const detailScore = document.querySelector("#detailScore");
const detailTitle = document.querySelector("#detailTitle");
const detailSummary = document.querySelector("#detailSummary");
const microList = document.querySelector("#microList");
const watchList = document.querySelector("#watchList");
const contractList = document.querySelector("#contractList");
const assumptionText = document.querySelector("#assumptionText");

function byId(id) {
  return stages.find((stage) => stage.id === id);
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function stageScore(stage, snapshot = state.snapshot) {
  return clamp(stage.pressure + (snapshot.delta[stage.id] || 0));
}

function edgeScore(edge, snapshot = state.snapshot) {
  return clamp(edge.pressure + (snapshot.edgeDelta[edge.id] || 0));
}

function color(value) {
  if (value >= 84) return "var(--hot)";
  if (value >= 70) return "var(--warm)";
  return "var(--cool)";
}

function curve(from, to) {
  const lift = (to.y - from.y) * 0.18;
  const dx = Math.max(90, Math.abs(to.x - from.x) * 0.48);
  return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y + lift}, ${to.x - dx} ${to.y - lift}, ${to.x} ${to.y}`;
}

function renderControls() {
  snapshotControls.innerHTML = snapshots.map((snapshot) => `
    <button type="button" class="${snapshot.id === state.snapshot.id ? "active" : ""}" data-snapshot="${snapshot.id}">
      ${snapshot.label}
    </button>
  `).join("");

  snapshotControls.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.snapshot = snapshots.find((snapshot) => snapshot.id === button.dataset.snapshot);
      render();
    });
  });
}

function renderMap() {
  const laneLabels = [...new Set(stages.map((stage) => stage.lane))].map((lane) => {
    const members = stages.filter((stage) => stage.lane === lane);
    const x = members.reduce((sum, stage) => sum + stage.x, 0) / members.length;
    return `<text class="lane" x="${x}" y="58">${lane}</text>`;
  }).join("");

  const edgeMarkup = edges.map((edge) => {
    const from = byId(edge.from);
    const to = byId(edge.to);
    const score = edgeScore(edge);
    const selected = edge.id === state.selectedEdge ? "selected" : "";
    return `
      <path class="edge ${selected}" data-edge="${edge.id}" d="${curve(from, to)}" stroke="${color(score)}" stroke-width="${5 + score * 0.11}"></path>
      <text class="edge-label" x="${(from.x + to.x) / 2}" y="${(from.y + to.y) / 2 - 16}">${edge.label} ${score}</text>
    `;
  }).join("");

  const stageMarkup = stages.map((stage) => {
    const score = stageScore(stage);
    const radius = 40 + Math.max(0, score - 60) * 0.27;
    const selected = stage.id === state.selectedStage ? "selected" : "";
    return `
      <g class="stage ${selected}" data-stage="${stage.id}">
        <circle cx="${stage.x}" cy="${stage.y}" r="${radius}" fill="${color(score)}"></circle>
        <text class="score" x="${stage.x}" y="${stage.y + 7}">${score}</text>
        <text class="stage-label" x="${stage.x}" y="${stage.y + radius + 24}">${stage.label}</text>
        <text class="stage-type" x="${stage.x}" y="${stage.y + radius + 42}">${state.snapshot.snapshot_type}</text>
      </g>
    `;
  }).join("");

  svg.innerHTML = `${laneLabels}${edgeMarkup}${stageMarkup}`;

  svg.querySelectorAll("[data-stage]").forEach((node) => {
    node.addEventListener("click", () => {
      state.selectedStage = node.dataset.stage;
      const incoming = edges.find((edge) => edge.to === state.selectedStage);
      state.selectedEdge = incoming ? incoming.id : state.selectedEdge;
      render();
    });
  });

  svg.querySelectorAll("[data-edge]").forEach((edgeElement) => {
    edgeElement.addEventListener("click", () => {
      state.selectedEdge = edgeElement.dataset.edge;
      state.selectedStage = edges.find((edge) => edge.id === state.selectedEdge).to;
      render();
    });
  });
}

function renderDetail() {
  const selected = byId(state.selectedStage);
  const selectedEdge = edges.find((edge) => edge.id === state.selectedEdge);
  const score = stageScore(selected);
  const contracts = [
    ["node", selected.contract],
    ["edge", selectedEdge.contract],
    ["snapshot", state.snapshot.contract]
  ];

  snapshotText.textContent = state.snapshot.assumption;
  detailType.textContent = state.snapshot.snapshot_type;
  detailScore.textContent = score;
  detailTitle.textContent = selected.label;
  detailSummary.textContent = selected.summary;
  assumptionText.textContent = state.snapshot.assumption;

  microList.innerHTML = selected.micro.map(([label, value]) => {
    const adjusted = clamp(value + (state.snapshot.delta[selected.id] || 0));
    return `
      <div class="metric">
        <strong><span>${label}</span><span>${adjusted}</span></strong>
        <div class="bar"><span style="width:${adjusted}%; background:${color(adjusted)}"></span></div>
      </div>
    `;
  }).join("");

  watchList.innerHTML = selected.watch.map((item) => `<li>${item}</li>`).join("");

  contractList.innerHTML = contracts.map(([label, contract]) => `
    <div class="contract">
      <strong>${label}: ${sources[contract.source_id]}</strong>
      <span>${contract.source_status}</span>
      <span>${contract.as_of}</span>
      <span>${contract.cadence}</span>
      <span>${contract.freshness_status}</span>
      <span>${contract.snapshot_type}</span>
      <span>${contract.calculation_status}</span>
    </div>
  `).join("");
}

function render() {
  renderControls();
  renderMap();
  renderDetail();
}

render();

