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
const feedbackForm = document.querySelector("#feedbackForm");
const useCaseInput = document.querySelector("#useCaseInput");
const feedbackInput = document.querySelector("#feedbackInput");
const feedbackStatus = document.querySelector("#feedbackStatus");

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

feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const signal = {
    routine: state.selectedRoutine,
    price: state.selectedPrice,
    use_case: useCaseInput.value,
    requested_bottleneck: feedbackInput.value.trim(),
    captured_at: new Date().toISOString()
  };
  localStorage.setItem("ai-bottleneck-r7-feedback", JSON.stringify(signal));
  feedbackStatus.textContent = "로컬 피드백이 저장됐다. 이 신호는 다음 루프의 고객 증거 후보로 회수된다.";
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
