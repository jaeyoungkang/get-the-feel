const stages = [
  {
    id: "equipment",
    label: "장비·EDA",
    layer: "Upstream",
    x: 115,
    y: 210,
    base: 72,
    summary: "선단 공정과 패키징 증설의 선행 조건이다.",
    micro: [["EUV/검사", 78], ["EDA/IP", 63], ["후공정 장비", 74]],
    watch: ["EUV·검사 장비 리드타임", "파운드리 capex", "패키징 장비 주문"],
    contract: { source_status: "curated", as_of: "2026-06-01", observed_or_scenario: "observed", calculation_status: "example" }
  },
  {
    id: "foundry",
    label: "파운드리",
    layer: "Silicon",
    x: 320,
    y: 145,
    base: 76,
    summary: "AI GPU와 ASIC의 선단 로직 다이를 생산한다.",
    micro: [["선단 웨이퍼", 77], ["수율 안정화", 70], ["지역 증설", 61]],
    watch: ["AI/HPC 매출 비중", "3nm/2nm 가동률", "미국·일본 증설 일정"],
    contract: { source_status: "official", as_of: "2025-12-31", observed_or_scenario: "observed", calculation_status: "example" }
  },
  {
    id: "memory",
    label: "HBM·메모리",
    layer: "Memory",
    x: 320,
    y: 355,
    base: 88,
    summary: "AI 가속기의 처리량과 공급 가능량을 좌우하는 고대역폭 메모리다.",
    micro: [["HBM3E/HBM4", 91], ["TSV/스택", 86], ["고객 인증", 82]],
    watch: ["HBM 장기 계약", "HBM4 양산 준비", "범용 DRAM allocation 변화"],
    contract: { source_status: "official", as_of: "2025-12-31", observed_or_scenario: "observed", calculation_status: "example" }
  },
  {
    id: "packaging",
    label: "고급 패키징",
    layer: "Assembly",
    x: 545,
    y: 250,
    base: 93,
    summary: "로직 다이와 HBM을 실제 AI 가속기로 묶는 대표 병목이다.",
    micro: [["CoWoS", 95], ["인터포저", 90], ["테스트·번인", 83]],
    watch: ["CoWoS 증설 속도", "인터포저 공급", "테스트 capacity"],
    contract: { source_status: "official", as_of: "2025-12-31", observed_or_scenario: "observed", calculation_status: "example" }
  },
  {
    id: "systems",
    label: "서버·네트워크",
    layer: "Systems",
    x: 760,
    y: 165,
    base: 70,
    summary: "GPU를 데이터센터에 투입 가능한 서버, 랙, 네트워크로 조립한다.",
    micro: [["AI 서버", 68], ["랙 통합", 64], ["네트워킹", 77]],
    watch: ["AI 서버 backlog", "랙 단위 납기", "스위치/인터커넥트 공급"],
    contract: { source_status: "curated", as_of: "2026-06-01", observed_or_scenario: "observed", calculation_status: "example" }
  },
  {
    id: "power",
    label: "전력·냉각",
    layer: "Infrastructure",
    x: 760,
    y: 390,
    base: 86,
    summary: "데이터센터 증설 속도를 전력 계약, 송전망, 냉각이 제한한다.",
    micro: [["전력 확보", 90], ["액체 냉각", 82], ["부지·허가", 78]],
    watch: ["전력 구매 계약", "송전망 접속", "액체 냉각 채택"],
    contract: { source_status: "curated", as_of: "2026-06-01", observed_or_scenario: "observed", calculation_status: "example" }
  },
  {
    id: "cloud",
    label: "클라우드",
    layer: "Demand",
    x: 980,
    y: 235,
    base: 74,
    summary: "하이퍼스케일러 capex가 AI 인프라 수요를 실적으로 연결한다.",
    micro: [["GPU 클러스터", 79], ["예약 수요", 68], ["마진 구조", 62]],
    watch: ["AI capex 가이던스", "GPU 임대 가격", "감가상각과 마진"],
    contract: { source_status: "official", as_of: "2026-01-25", observed_or_scenario: "observed", calculation_status: "example" }
  },
  {
    id: "apps",
    label: "모델·앱 수요",
    layer: "Feedback",
    x: 1080,
    y: 450,
    base: 65,
    summary: "학습·추론 수요가 상류 병목을 다시 밀어 올린다.",
    micro: [["학습 수요", 63], ["추론 사용량", 72], ["가격 하락", 55]],
    watch: ["추론 사용량", "토큰 가격", "엔터프라이즈 도입"],
    contract: { source_status: "curated", as_of: "2026-06-01", observed_or_scenario: "observed", calculation_status: "example" }
  }
];

const defaultEdgeContract = { source_status: "curated", as_of: "2026-06-01", observed_or_scenario: "observed", calculation_status: "example" };
const edges = [
  ["equipment", "foundry", 74, "선단 증설", defaultEdgeContract],
  ["equipment", "packaging", 82, "후공정 장비", defaultEdgeContract],
  ["foundry", "packaging", 86, "로직 다이", { source_status: "official", as_of: "2025-12-31", observed_or_scenario: "observed", calculation_status: "example" }],
  ["memory", "packaging", 94, "HBM attach", { source_status: "official", as_of: "2025-12-31", observed_or_scenario: "observed", calculation_status: "example" }],
  ["packaging", "systems", 88, "GPU 출하", defaultEdgeContract],
  ["systems", "cloud", 73, "랙 납기", defaultEdgeContract],
  ["power", "cloud", 91, "전력 확보", defaultEdgeContract],
  ["cloud", "apps", 68, "컴퓨트 공급", defaultEdgeContract],
  ["apps", "memory", 78, "추론 수요", defaultEdgeContract],
  ["apps", "power", 84, "전력 수요", defaultEdgeContract]
].map(([from, to, pressure, label, contract]) => ({ from, to, pressure, label, contract, id: `${from}-${to}` }));

const snapshots = [
  {
    id: "2025q4",
    label: "2025 Q4",
    state: "observed",
    contract: { source_status: "curated", as_of: "2025-12-31", observed_or_scenario: "observed", calculation_status: "example" },
    note: "과거 관측 예시. 값은 프로토타입용이며 공식 출처 링크로 맥락만 고정한다.",
    delta: { memory: -6, packaging: -5, power: -8, apps: -2 },
    edgeDelta: { "memory-packaging": -5, "power-cloud": -8 }
  },
  {
    id: "2026q2",
    label: "2026 Q2",
    state: "observed",
    contract: { source_status: "curated", as_of: "2026-06-01", observed_or_scenario: "observed", calculation_status: "example" },
    note: "현재 관측 예시. 자동 갱신 전이며 병목 점수는 설명형 프로토타입 값이다.",
    delta: {},
    edgeDelta: {}
  },
  {
    id: "2026q4",
    label: "2026 Q4 시나리오",
    state: "scenario",
    contract: { source_status: "curated", as_of: "2026-06-01", observed_or_scenario: "scenario", calculation_status: "modeled" },
    note: "미래 시나리오. AI capex와 전력 수요가 높게 유지된다는 가정이며 예측이 아니다.",
    delta: { memory: 5, packaging: 2, systems: 4, power: 8, cloud: 5, apps: 7 },
    edgeDelta: { "power-cloud": 9, "apps-power": 9, "cloud-apps": 5 }
  },
  {
    id: "2027q2",
    label: "2027 Q2 시나리오",
    state: "scenario",
    contract: { source_status: "curated", as_of: "2026-06-01", observed_or_scenario: "scenario", calculation_status: "modeled" },
    note: "미래 시나리오. 패키징은 일부 완화되지만 전력·냉각이 계속 병목이라는 가정이다.",
    delta: { memory: -4, packaging: -7, power: 10, apps: 8 },
    edgeDelta: { "memory-packaging": -7, "packaging-systems": -6, "power-cloud": 11 }
  }
];

const state = {
  selectedStage: "packaging",
  selectedEdge: "memory-packaging",
  snapshot: snapshots[1]
};

const svg = document.querySelector("#macroMap");
const snapshotButtons = document.querySelector("#snapshotButtons");
const snapshotNote = document.querySelector("#snapshotNote");
const detailState = document.querySelector("#detailState");
const detailScore = document.querySelector("#detailScore");
const detailTitle = document.querySelector("#detail-title");
const detailSummary = document.querySelector("#detailSummary");
const microNodes = document.querySelector("#microNodes");
const watchList = document.querySelector("#watchList");
const trendList = document.querySelector("#trendList");
const dataStatus = document.querySelector("#dataStatus");
const contractList = document.querySelector("#contractList");

function node(id) {
  return stages.find((stage) => stage.id === id);
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function stageScore(stage, snapshot = state.snapshot) {
  return clamp(stage.base + (snapshot.delta[stage.id] || 0));
}

function edgeScore(edge, snapshot = state.snapshot) {
  return clamp(edge.pressure + (snapshot.edgeDelta[edge.id] || 0));
}

function colorFor(value) {
  if (value >= 84) return "var(--red)";
  if (value >= 68) return "var(--amber)";
  return "var(--green)";
}

function curve(from, to) {
  const dx = Math.max(60, Math.abs(to.x - from.x) * 0.46);
  return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
}

function renderButtons() {
  snapshotButtons.innerHTML = snapshots.map((snapshot) => `
    <button type="button" class="${snapshot.id === state.snapshot.id ? "active" : ""}" data-snapshot="${snapshot.id}">
      ${snapshot.label}
    </button>
  `).join("");
  snapshotButtons.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.snapshot = snapshots.find((snapshot) => snapshot.id === button.dataset.snapshot);
      render();
    });
  });
}

function renderMap() {
  const layers = [...new Set(stages.map((stage) => stage.layer))].map((layer) => {
    const members = stages.filter((stage) => stage.layer === layer);
    const x = members.reduce((sum, stage) => sum + stage.x, 0) / members.length;
    return `<text class="layer-label" x="${x}" y="48">${layer}</text>`;
  }).join("");

  const edgeMarkup = edges.map((edge) => {
    const from = node(edge.from);
    const to = node(edge.to);
    const score = edgeScore(edge);
    const selected = edge.id === state.selectedEdge ? "selected" : "";
    return `
      <path class="map-edge ${selected}" data-edge="${edge.id}" d="${curve(from, to)}" stroke="${colorFor(score)}" stroke-width="${4 + score * 0.13}"></path>
      <text class="edge-label" x="${(from.x + to.x) / 2}" y="${(from.y + to.y) / 2 - 18}">${edge.label} ${score}</text>
    `;
  }).join("");

  const nodeMarkup = stages.map((stage) => {
    const score = stageScore(stage);
    const selected = stage.id === state.selectedStage ? "selected" : "";
    const radius = 43 + Math.max(0, score - 65) * 0.23;
    return `
      <g class="node ${selected}" data-stage="${stage.id}">
        <circle cx="${stage.x}" cy="${stage.y}" r="${radius}" fill="${colorFor(score)}"></circle>
        <text class="score" x="${stage.x}" y="${stage.y + 6}">${score}</text>
        <text x="${stage.x}" y="${stage.y + radius + 22}">${stage.label}</text>
        <text class="state" x="${stage.x}" y="${stage.y + radius + 39}">${state.snapshot.state}</text>
      </g>
    `;
  }).join("");

  svg.innerHTML = `${layers}${edgeMarkup}${nodeMarkup}`;

  svg.querySelectorAll("[data-stage]").forEach((el) => {
    el.addEventListener("click", () => {
      state.selectedStage = el.dataset.stage;
      const incoming = edges.find((edge) => edge.to === state.selectedStage);
      state.selectedEdge = incoming ? incoming.id : state.selectedEdge;
      render();
    });
  });
  svg.querySelectorAll("[data-edge]").forEach((el) => {
    el.addEventListener("click", () => {
      state.selectedEdge = el.dataset.edge;
      state.selectedStage = edges.find((edge) => edge.id === el.dataset.edge).to;
      render();
    });
  });
}

function renderDetail() {
  const selected = node(state.selectedStage);
  const score = stageScore(selected);
  detailState.textContent = state.snapshot.state;
  detailScore.textContent = score;
  detailTitle.textContent = selected.label;
  detailSummary.textContent = selected.summary;
  snapshotNote.textContent = state.snapshot.note;
  dataStatus.textContent = `${state.snapshot.label}: ${state.snapshot.state}. 현재 수치는 프로토타입 설명값이며, 실제 서비스 전 월간 갱신 소스와 산식 승인이 필요하다.`;
  const selectedEdge = edges.find((edge) => edge.id === state.selectedEdge);
  const contracts = [
    ["node", selected.contract],
    ["edge", selectedEdge.contract],
    ["snapshot", state.snapshot.contract]
  ];
  contractList.innerHTML = contracts.map(([label, contract]) => `
    <div class="contract-item">
      <strong>${label}</strong>
      <span>${contract.source_status}</span>
      <span>${contract.as_of}</span>
      <span>${contract.observed_or_scenario}</span>
      <span>${contract.calculation_status}</span>
    </div>
  `).join("");

  microNodes.innerHTML = selected.micro.map(([label, value]) => {
    const adjusted = clamp(value + (state.snapshot.delta[selected.id] || 0));
    return `
      <div class="micro-item">
        <strong><span>${label}</span><span>${adjusted}</span></strong>
        <div class="bar"><span style="width:${adjusted}%; background:${colorFor(adjusted)}"></span></div>
      </div>
    `;
  }).join("");

  watchList.innerHTML = selected.watch.map((item) => `<li>${item}</li>`).join("");

  trendList.innerHTML = snapshots.map((snapshot) => {
    const scoreAt = stageScore(selected, snapshot);
    return `
      <div class="trend-item">
        <strong><span>${snapshot.label}</span><span>${scoreAt}</span></strong>
        <div class="bar"><span style="width:${scoreAt}%; background:${colorFor(scoreAt)}"></span></div>
      </div>
    `;
  }).join("");
}

function render() {
  renderButtons();
  renderMap();
  renderDetail();
}

render();
