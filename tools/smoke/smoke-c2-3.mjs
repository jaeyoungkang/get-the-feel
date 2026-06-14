/* 실행 스모크 — c2-3 (G10 교훈: 죽은 후보 금지). jsdom으로 실제 클릭 흐름을 돈다.
 * 시작 클릭 → 15문항 완주 → 해석(G12) 표시 확인 → 전이 5문항 → 진척(Day 합산) 확인.
 * + G11 단서 차단(질문 단계 DOM에 item-pill·해석 없음) 실측 + keep 메타포 렌더 실측.
 *
 * 실행: jsdom 필요 (런타임 의존성 — 저장소에 node_modules를 두지 않는다).
 *   cd tools/smoke && npm install jsdom --no-save && node smoke-c2-3.mjs
 *   (검증 후 node_modules는 제거한다 — 베이스/도메인 비대화 방지.)
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { JSDOM } from "jsdom";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const CAND = path.resolve(__dirname, "..", "..", "archive", "prototypes", "c2-3");

const html = fs.readFileSync(path.join(CAND, "index.html"), "utf8");
const dataJs = fs.readFileSync(path.join(CAND, "data.js"), "utf8");
const appJs = fs.readFileSync(path.join(CAND, "app.js"), "utf8");

let failures = 0;
function check(label, cond) {
  console.log((cond ? "  ok   " : "  FAIL ") + label);
  if (!cond) failures++;
}

const dom = new JSDOM(html, {
  runScripts: "outside-only",
  pretendToBeVisual: true,
  url: "https://localhost/",
});
const { window } = dom;

// requestAnimationFrame / scrollTo 스텁 (jsdom 미구현 보완 — 애니메이션 콜백 즉시 실행)
window.requestAnimationFrame = (cb) => window.setTimeout(() => cb(Date.now()), 0);
window.cancelAnimationFrame = (id) => window.clearTimeout(id);
window.scrollTo = () => {};

// 이전 버전(c2-2) 기록을 심어 둔다 — Day 합산(import) 검증용. (실제 c2-2 원본 미변경.)
const prevDays = [
  { day: 1, date: "2026-06-01T09:00:00.000Z",
    train: { score: { correct: 11, total: 15 }, bySense: { "have-domain-location": { c: 4, t: 5 } } },
    transfer: { score: { correct: 4, total: 5 }, bySense: { "get-arrival": { c: 2, t: 3 } } } },
  { day: 2, date: "2026-06-02T09:00:00.000Z",
    train: { score: { correct: 13, total: 15 }, bySense: { "up-completion": { c: 3, t: 4 } } },
    transfer: { score: { correct: 5, total: 5 }, bySense: { "out-exit": { c: 2, t: 2 } } } },
];
window.localStorage.setItem("gtf-c2-2-days", JSON.stringify(prevDays));

// data.js → app.js 순서로 평가 (index.html의 로드 순서 모사)
window.eval(dataJs);
window.eval(appJs);

const doc = window.document;
const app = doc.getElementById("app");

function clickById(id) {
  const el = doc.getElementById(id);
  if (!el) throw new Error("버튼 없음: #" + id);
  el.dispatchEvent(new window.Event("click", { bubbles: true }));
}
function clickChoiceCorrect() {
  // 정답 보기를 누른다 (correct 클래스 부여 로직을 우회하지 않고, isAnswer 보기를 찾는다).
  // 화면 셔플로 위치가 매번 다르므로, .choice 중 정답을 app 내부 상태로 못 보니
  // 표시 텍스트로 못 찾는다 → 대신 각 보기를 눌러 보고 correct가 뜨는지로 판정하면 상태가 바뀐다.
  // 정답을 직접 알기 위해 현재 문항을 window 전역에 노출하지 않았으므로,
  // 첫 보기를 눌러 진행한다(정답률은 스모크 목적상 무관 — 흐름 완주가 목적).
  const btns = app.querySelectorAll(".choice");
  if (btns.length === 0) throw new Error("보기 버튼 없음");
  btns[0].dispatchEvent(new window.Event("click", { bubbles: true }));
}

console.log("get-the-feel 실행 스모크 — c2-3 (jsdom)");
console.log("=".repeat(52));

// 1) 인트로 렌더 — 첫 화면에 약속 + 변경점.
check("인트로 렌더됨 (#go-train 또는 #go-review 존재)",
  !!(doc.getElementById("go-train") || doc.getElementById("go-review")));
check("첫 화면에 '8개 감각, 120문장' 노출", /8개 감각, 120문장/.test(app.textContent));
check("첫 화면 변경점 한 줄: '정답 후 해석'", /정답 후 해석/.test(app.textContent));
check("첫 화면에 keep 합류 노출", /keep/.test(app.textContent));

// 2) 시작 클릭 → 훈련 15문항.
clickById(doc.getElementById("go-train") ? "go-train" : "go-review");
check("훈련 1문항 렌더 (.choice 존재)", app.querySelectorAll(".choice").length > 0);
check("훈련 진행 표시 '오늘 익히기 1 / 15'", /오늘 익히기 1 \/ 15|복습 1 \/ 15/.test(app.textContent));

// G11 실측 — 질문 단계 DOM에 단서가 없어야 한다.
function questionHasNoCue() {
  const head = app.querySelector(".question");
  if (!head) return false;
  // 피드백을 아직 안 띄운 시점의 질문 카드.
  const beforeFeedback = app.querySelector("#feedback");
  const fbEmpty = beforeFeedback && beforeFeedback.innerHTML.trim() === "";
  const noItemPill = app.querySelectorAll(".question > .item-pill, .question .progress-head .item-pill").length === 0;
  const hasTypePill = app.querySelectorAll(".type-pill").length > 0;
  return fbEmpty && noItemPill && hasTypePill;
}
check("질문 단계: 항목 알약 없음 + 유형 알약만 + 피드백 비어 있음 (G11)", questionHasNoCue());
check("질문 단계: 해석 미노출 (.interp 부재) (G12)", app.querySelectorAll(".interp").length === 0);

// 15문항 완주 — 각 문항: 보기 클릭 → 피드백(해석·항목 알약) 확인 → 다음.
let interpSeenCount = 0, itemPillSeenCount = 0, keepVizSeen = 0, contrastSeen = 0;
for (let q = 1; q <= 15; q++) {
  // 질문 단계 단서 차단(매 문항) 가볍게 재확인.
  if (app.querySelectorAll(".question .interp").length > 0) {
    console.log("  FAIL 문항 " + q + ": 질문 단계에 해석 노출"); failures++;
  }
  if (app.querySelectorAll(".progress-head .item-pill").length > 0) {
    console.log("  FAIL 문항 " + q + ": 질문 progress-head에 항목 알약 노출"); failures++;
  }
  clickChoiceCorrect();
  // 피드백 떴는지.
  const fb = app.querySelector("#feedback .feedback");
  if (!fb) { console.log("  FAIL 문항 " + q + ": 피드백 미렌더"); failures++; break; }
  if (app.querySelector("#feedback .interp")) interpSeenCount++;
  if (app.querySelector("#feedback .item-pill")) itemPillSeenCount++;
  if (app.querySelector("#feedback .viz-clasp")) keepVizSeen++;        // keep 메타포(손/걸쇠)
  if (app.querySelector("#feedback .contrast-wrap")) contrastSeen++;    // keep↔have 대비
  // 다음 문항(또는 마지막이면 결과 보기).
  const nb = doc.getElementById("next-q");
  if (!nb) { console.log("  FAIL 문항 " + q + ": next-q 버튼 없음"); failures++; break; }
  nb.dispatchEvent(new window.Event("click", { bubbles: true }));
}

check("15문항 모두 피드백에 해석(.interp) 표시 (G12)", interpSeenCount === 15);
check("15문항 모두 피드백에 항목 알약(.item-pill) 표시 (G11 — 단서는 정답 후)", itemPillSeenCount === 15);
check("keep 메타포(손/걸쇠 .viz-clasp) 최소 1회 렌더", keepVizSeen >= 1);
check("keep↔have 대비(.contrast-wrap) 최소 1회 렌더", contrastSeen >= 1);

// 3) 훈련 요약 → 전이 테스트.
check("훈련 요약 화면 ('오늘 잡은 감각')", /오늘 잡은 감각/.test(app.textContent));
const goTransfer = doc.getElementById("go-transfer");
check("전이 진입 버튼 존재", !!goTransfer);
goTransfer.dispatchEvent(new window.Event("click", { bubbles: true }));
check("전이 1문항 렌더 ('새 문장 1 / 5')", /새 문장 1 \/ 5/.test(app.textContent));

let xfInterp = 0;
for (let q = 1; q <= 5; q++) {
  clickChoiceCorrect();
  if (app.querySelector("#feedback .interp")) xfInterp++;
  const nb = doc.getElementById("next-q");
  if (!nb) { console.log("  FAIL 전이 " + q + ": next-q 없음"); failures++; break; }
  nb.dispatchEvent(new window.Event("click", { bubbles: true }));
}
check("전이 5문항 모두 해석 표시 (G12 — 전이에도 적용)", xfInterp === 5);

// 4) 전이 결과 → 진척(Day 합산).
check("전이 결과 화면 ('오늘 결과')", /오늘 결과/.test(app.textContent));
const goProg = doc.getElementById("go-progress2");
check("진척 진입 버튼 존재", !!goProg);
goProg.dispatchEvent(new window.Event("click", { bubbles: true }));

// 이전 2일(import) + 오늘 1일 = Day 3 이어야 한다.
check("진척: 이전 버전 기록 합산 라벨 노출", /이전 버전.*2일 기록 포함|이전 버전\(c2-2\)/.test(app.textContent));
check("진척: Day 추이에 Day 3까지 (이전 2 + 오늘 1)", /Day 3/.test(app.textContent));
check("진척: 이전 버전 막대 흐림 라벨('이전') 노출", /이전/.test(app.textContent));
check("진척: 감각별 추적 블록 존재", /감각별 추적/.test(app.textContent));
check("진척: G6 정직 라벨 '내 기록 (본인 학습용)'", /내 기록 \(본인 학습용\)/.test(app.textContent));

// 5) c2-2 원본 미변경 확인.
const c22 = JSON.parse(window.localStorage.getItem("gtf-c2-2-days"));
check("c2-2 localStorage 원본 미변경 (여전히 2일, import는 읽기 전용)", Array.isArray(c22) && c22.length === 2);
check("c2-3 자체 기록은 별 키(gtf-c2-3-days)에 1일 저장",
  (JSON.parse(window.localStorage.getItem("gtf-c2-3-days") || "[]")).length === 1);

console.log("=".repeat(52));
console.log(failures === 0 ? "SMOKE: ALL PASS" : "SMOKE: FAIL (" + failures + ")");
process.exit(failures === 0 ? 0 : 1);
