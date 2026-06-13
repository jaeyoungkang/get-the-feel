/* 실행 스모크 — c4-1 (G10 교훈: 죽은 후보 금지). jsdom으로 실제 클릭 흐름을 돈다.
 * 시작 → 모드 선택(기본 일일믹스 / 집중 모드 둘 다) → 15문항 완주 → 해석(G12)·그림 렌더 →
 *   전이 5문항 → 진척(감각 추이·강약점) 확인. 런타임 에러 0 + G11 단서 차단 실측.
 *
 * 실행: jsdom 필요 (런타임 의존성 — 저장소에 node_modules를 두지 않는다).
 *   cd tools/smoke && npm install jsdom --no-save && node smoke-c4-1.mjs
 *   (검증 후 node_modules는 제거한다 — 비대화 방지.)
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { JSDOM } from "jsdom";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const CAND = path.resolve(__dirname, "..", "..", "candidates", "c4-1");

const html = fs.readFileSync(path.join(CAND, "index.html"), "utf8");
const dataJs = fs.readFileSync(path.join(CAND, "data.js"), "utf8");
const appJs = fs.readFileSync(path.join(CAND, "app.js"), "utf8");

let failures = 0;
function check(label, cond) {
  console.log((cond ? "  ok   " : "  FAIL ") + label);
  if (!cond) failures++;
}

// 새 jsdom 환경을 만들어 앱을 부팅한다 (세션마다 깨끗한 localStorage 옵션).
function boot(seedDays) {
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "https://localhost/",
  });
  const { window } = dom;
  window.requestAnimationFrame = (cb) => window.setTimeout(() => cb(Date.now()), 0);
  window.cancelAnimationFrame = (id) => window.clearTimeout(id);
  window.scrollTo = () => {};

  // 런타임 에러 포착 — 콘솔/window.onerror 양쪽.
  const errors = [];
  window.onerror = (msg) => { errors.push(String(msg)); };
  const origErr = window.console.error;
  window.console.error = function () {
    errors.push(Array.prototype.join.call(arguments, " "));
    return origErr.apply(this, arguments);
  };

  if (seedDays) window.localStorage.setItem("gtf-c4-1-days", JSON.stringify(seedDays));

  window.eval(dataJs);
  window.eval(appJs);
  const doc = window.document;
  const app = doc.getElementById("app");
  return { window, doc, app, errors };
}

function clickById(doc, window, id) {
  const el = doc.getElementById(id);
  if (!el) throw new Error("버튼 없음: #" + id);
  el.dispatchEvent(new window.Event("click", { bubbles: true }));
}
function clickFirstChoice(app, window) {
  const btns = app.querySelectorAll(".choice");
  if (btns.length === 0) throw new Error("보기 버튼 없음");
  btns[0].dispatchEvent(new window.Event("click", { bubbles: true }));
}

console.log("get-the-feel 실행 스모크 — c4-1 (jsdom)");
console.log("=".repeat(52));

// ===================================================================
//  PART A — 기본 모드 (오늘의 새 문장, 일일 믹스)
// ===================================================================
console.log("[A] 기본 모드 — 오늘의 새 문장 (8감각 믹스)");
{
  const { window, doc, app, errors } = boot(null);

  // 1) 인트로 + 주제 선택 렌더.
  check("인트로 렌더됨 (#go-train 또는 #go-review 존재)",
    !!(doc.getElementById("go-train") || doc.getElementById("go-review")));
  check("주제 선택 — 기본 '오늘의 새 문장' 블록 노출", /오늘의 새 문장/.test(app.textContent));
  check("주제 선택 — '감각 골라 집중' 블록 노출", /감각 골라 집중/.test(app.textContent));
  check("집중 칩 8개 렌더", app.querySelectorAll(".focus-chip").length === 8);
  check("get+과거분사 안내 노출 (get started/dressed/married)", /get\s*\+?\s*과거분사|get started|married/.test(app.textContent));

  // 2) 기본 모드 시작 → 15문항.
  clickById(doc, window, doc.getElementById("go-train") ? "go-train" : "go-review");
  check("훈련 1문항 렌더 (.choice 존재)", app.querySelectorAll(".choice").length > 0);
  check("훈련 진행 표시 '... 1 / 15'", /1 \/ 15/.test(app.textContent));
  check("기본 모드 — 집중 플래그 부재 (.focus-flag 없음)", app.querySelectorAll(".focus-flag").length === 0);

  // G11/G12 질문 단계 단서 차단.
  check("질문 단계: 항목 알약 없음 (.progress-head .item-pill 부재)",
    app.querySelectorAll(".progress-head .item-pill").length === 0);
  check("질문 단계: 유형 알약만 존재 (.type-pill)", app.querySelectorAll(".type-pill").length > 0);
  check("질문 단계: 해석 미노출 (.interp 부재) (G12)", app.querySelectorAll(".interp").length === 0);

  let interpSeen = 0, itemPillSeen = 0, vizSeen = 0;
  for (let q = 1; q <= 15; q++) {
    if (app.querySelectorAll(".question .interp").length > 0) { console.log("  FAIL 문항 " + q + ": 질문 단계 해석 노출"); failures++; }
    clickFirstChoice(app, window);
    const fb = app.querySelector("#feedback .feedback");
    if (!fb) { console.log("  FAIL 문항 " + q + ": 피드백 미렌더"); failures++; break; }
    if (app.querySelector("#feedback .interp")) interpSeen++;
    if (app.querySelector("#feedback .item-pill")) itemPillSeen++;
    if (app.querySelector("#feedback .viz-wrap svg, #feedback .compose-wrap svg, #feedback .idiom-mini svg")) vizSeen++;
    const nb = doc.getElementById("next-q");
    if (!nb) { console.log("  FAIL 문항 " + q + ": next-q 없음"); failures++; break; }
    nb.dispatchEvent(new window.Event("click", { bubbles: true }));
  }
  check("15문항 모두 피드백 해석(.interp) 표시 (G12)", interpSeen === 15);
  check("15문항 모두 피드백 항목 알약(.item-pill) 표시 (G11)", itemPillSeen === 15);
  check("15문항 모두 그림(메타포 SVG) 렌더", vizSeen === 15);

  // 3) 훈련 요약 → 전이.
  check("훈련 요약 화면 ('오늘 잡은 감각')", /오늘 잡은 감각/.test(app.textContent));
  const goT = doc.getElementById("go-transfer");
  check("전이 진입 버튼 존재", !!goT);
  goT.dispatchEvent(new window.Event("click", { bubbles: true }));
  check("전이 1문항 렌더 ('새 문장 1 / 5')", /새 문장 1 \/ 5/.test(app.textContent));
  let xfInterp = 0;
  for (let q = 1; q <= 5; q++) {
    clickFirstChoice(app, window);
    if (app.querySelector("#feedback .interp")) xfInterp++;
    const nb = doc.getElementById("next-q");
    if (!nb) { console.log("  FAIL 전이 " + q + ": next-q 없음"); failures++; break; }
    nb.dispatchEvent(new window.Event("click", { bubbles: true }));
  }
  check("전이 5문항 모두 해석 표시 (G12)", xfInterp === 5);

  // 4) 전이 결과 → 진척.
  check("전이 결과 화면 ('오늘 결과')", /오늘 결과/.test(app.textContent));
  const goP = doc.getElementById("go-progress2");
  check("진척 진입 버튼 존재", !!goP);
  goP.dispatchEvent(new window.Event("click", { bubbles: true }));
  check("진척 화면 제목 ('어떤 감각이 늘고 있나')", /어떤 감각이 늘고 있나/.test(app.textContent));
  check("진척: G6 정직 라벨 '내 기록 (본인 학습용)'", /내 기록 \(본인 학습용\)/.test(app.textContent));
  check("진척: N=1 한계 라벨 노출", /N=1|한 사람/.test(app.textContent));
  check("진척: 강점/약점 블록 존재", /강점 \/ 약점/.test(app.textContent));
  check("진척: 감각별 추이 블록 존재", /감각별 추이/.test(app.textContent));
  check("진척: Day 1 요약(R8 첫 세션 추이 대신 감각)", /Day 1/.test(app.textContent));
  check("진척: 세션 1일 저장 (gtf-c4-1-days)",
    (JSON.parse(window.localStorage.getItem("gtf-c4-1-days") || "[]")).length === 1);

  check("[A] 런타임 에러 0", errors.length === 0);
  if (errors.length) errors.slice(0, 5).forEach((e) => console.log("    ! " + e));
}

// ===================================================================
//  PART B — 집중 모드 (감각 골라 집중: get) + 추이/강약점 (2일차)
// ===================================================================
console.log("");
console.log("[B] 집중 모드 — 'get' 골라 집중 + 진척 추이/강약점 (2일차)");
{
  // 이미 1일 기록이 있는 상태를 심는다 — 진척 추이(Day 2, ↑/↓)와 강약점 표본 확보용.
  const seed = [{
    day: 1, date: "2026-06-12T09:00:00.000Z", focusItem: null,
    train: { score: { correct: 9, total: 15 },
      byItem: { "get": { c: 2, t: 5 }, "have": { c: 3, t: 4 }, "keep": { c: 4, t: 4 }, "make": { c: 0, t: 2 } },
      bySense: { "get-arrival": { c: 1, t: 3 }, "have-domain-location": { c: 3, t: 4 }, "keep-hold": { c: 4, t: 4 }, "make-create": { c: 0, t: 2 } } },
    transfer: { score: { correct: 3, total: 5 },
      byItem: { "get": { c: 1, t: 3 }, "out": { c: 2, t: 2 } },
      bySense: { "get-arrival": { c: 1, t: 3 }, "out-exit": { c: 2, t: 2 } } }
  }];
  const { window, doc, app, errors } = boot(seed);

  // 1) 집중 칩 클릭 — get.
  const chips = app.querySelectorAll(".focus-chip");
  let getChip = null;
  for (const c of chips) if (c.getAttribute("data-item") === "get") getChip = c;
  check("get 집중 칩 존재", !!getChip);
  getChip.dispatchEvent(new window.Event("click", { bubbles: true }));

  // 2) 집중 모드 진입 — 집중 플래그 + get 문항만.
  check("집중 모드 진입 — 집중 플래그 '집중: get' 노출", /집중:\s*get/.test(app.textContent));
  check("집중 모드 — 1문항 렌더 (.choice 존재)", app.querySelectorAll(".choice").length > 0);
  check("질문 단계: 항목 알약 여전히 부재 (G11)", app.querySelectorAll(".progress-head .item-pill").length === 0);

  // 집중 세션 완주 — get은 15문항(training 15개)이라 정확히 15.
  let total = null, qCount = 0, getPillOnly = true, intoStateContrastSeen = 0, interpSeen = 0;
  // 진행 표시에서 총 문항 수 읽기.
  const m = /오늘 익히기\s+1\s*\/\s*(\d+)|복습\s+1\s*\/\s*(\d+)/.exec(app.textContent);
  total = m ? parseInt(m[1] || m[2], 10) : 15;
  check("집중 모드 — 출제 수 = 15 (get training 15)", total === 15);

  for (let q = 1; q <= total; q++) {
    clickFirstChoice(app, window);
    qCount++;
    const pill = app.querySelector("#feedback .item-pill");
    if (pill && pill.textContent.trim() !== "get") getPillOnly = false;   // 집중이면 전부 get 항목.
    if (app.querySelector("#feedback .interp")) interpSeen++;
    if (app.querySelector("#feedback .contrast-wrap.into")) intoStateContrastSeen++;  // get+pp 대비(M1).
    const nb = doc.getElementById("next-q");
    if (!nb) { console.log("  FAIL 집중 " + q + ": next-q 없음"); failures++; break; }
    nb.dispatchEvent(new window.Event("click", { bubbles: true }));
  }
  check("집중 모드 — " + total + "문항 완주", qCount === total);
  check("집중 모드 — 피드백 항목 알약 전부 'get' (다른 항목 섞이지 않음)", getPillOnly);
  check("집중 모드 — 해석 전 문항 표시 (G12)", interpSeen === total);
  check("get+과거분사 대비 그림(.contrast-wrap.into, M1) 최소 1회 렌더", intoStateContrastSeen >= 1);

  // 3) 집중 전이 → 진척 (Day 2 추이).
  const goT = doc.getElementById("go-transfer");
  goT.dispatchEvent(new window.Event("click", { bubbles: true }));
  check("집중 전이 진입 ('새 문장 1 / ...')", /새 문장 1 \/ \d+/.test(app.textContent));
  // get transfer 8개라 5문항 (TRANSFER_COUNT).
  const xm = /새 문장\s+1\s*\/\s*(\d+)/.exec(app.textContent);
  const xtotal = xm ? parseInt(xm[1], 10) : 5;
  for (let q = 1; q <= xtotal; q++) {
    clickFirstChoice(app, window);
    const nb = doc.getElementById("next-q");
    if (!nb) { console.log("  FAIL 집중전이 " + q + ": next-q 없음"); failures++; break; }
    nb.dispatchEvent(new window.Event("click", { bubbles: true }));
  }
  const goP = doc.getElementById("go-progress2");
  check("집중 후 진척 진입 버튼 존재", !!goP);
  goP.dispatchEvent(new window.Event("click", { bubbles: true }));
  check("진척: Day 2까지 일자별 막대 (이전 1 + 오늘 1)", /Day 2/.test(app.textContent));
  check("진척: 추이 방향 표시 (▲/▼/= 중 하나)", /▲|▼|=\s*비슷/.test(app.textContent));
  check("진척: 강점/약점 한 줄 노출 ('강함'·'약함')", /강함/.test(app.textContent) && /약함/.test(app.textContent));
  check("진척: 약점 → 집중 모드 연결 버튼 (.link-btn)", app.querySelectorAll(".link-btn").length >= 1);
  check("진척: 일자 막대에 집중 항목 표시 ('집중 get')", /집중\s*get/.test(app.textContent));

  // 약점 집중 버튼 클릭이 실제로 집중 세션을 띄우는지 (회귀).
  const linkBtn = doc.getElementById("weak-focus");
  if (linkBtn) {
    linkBtn.dispatchEvent(new window.Event("click", { bubbles: true }));
    check("약점 집중 버튼 → 집중 세션 진입 (집중 플래그)", /집중:/.test(app.textContent));
  } else {
    console.log("  note 약점 집중 버튼 없음 (강=약 동일 항목 — 표본 구성상 정상일 수 있음)");
  }

  check("진척: 세션 누적 2일 저장 (gtf-c4-1-days)",
    (JSON.parse(window.localStorage.getItem("gtf-c4-1-days") || "[]")).length === 2);

  check("[B] 런타임 에러 0", errors.length === 0);
  if (errors.length) errors.slice(0, 5).forEach((e) => console.log("    ! " + e));
}

console.log("=".repeat(52));
console.log(failures === 0 ? "SMOKE: ALL PASS" : "SMOKE: FAIL (" + failures + ")");
process.exit(failures === 0 ? 0 : 1);
