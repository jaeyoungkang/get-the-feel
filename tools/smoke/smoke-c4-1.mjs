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

// 테스트 전용 seam — 제품 app.js는 손대지 않고, 메모리 사본에만 IIFE 내부 renderProgress를
// window로 노출한다. 빈 통계 화면(첫 방문 전엔 인트로 링크가 가려져 클릭 도달 불가)을 직접 렌더해
// 마크업·안내를 검증하기 위함. on-disk app.js는 그대로다 (비대화 방지: 제품에 테스트 훅 미주입).
function withProgressSeam(src) {
  const marker = "})();";
  const idx = src.lastIndexOf(marker);
  if (idx === -1) return src;
  const inject = "\n  try { window.__gtfRenderProgress = renderProgress; } catch (e) {}\n";
  return src.slice(0, idx) + inject + src.slice(idx);
}

// 새 jsdom 환경을 만들어 앱을 부팅한다 (세션마다 깨끗한 localStorage 옵션).
function boot(seedDays, opts) {
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
  window.eval((opts && opts.progressSeam) ? withProgressSeam(appJs) : appJs);
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

  // #2 — 무거운 랜딩 수리: 행동(모드 선택·주 버튼)이 설명 산문보다 위 (G14 행동 먼저).
  {
    const html = app.innerHTML;
    const modeIdx = html.indexOf("mode-select");
    const aboutIdx = html.indexOf("intro-about");
    check("#2 랜딩: 모드 선택이 설명 접기(intro-about)보다 위에 위치",
      modeIdx > -1 && aboutIdx > -1 && modeIdx < aboutIdx);
    check("#2 랜딩: 설명 산문이 <details>(intro-about)로 접힘",
      app.querySelectorAll("details.intro-about").length === 1);
    const aboutEl = app.querySelector("details.intro-about");
    check("#2 랜딩: 설명 접기는 기본 닫힘 (open 아님)", !!aboutEl && !aboutEl.hasAttribute("open"));
    check("#2 랜딩: 주 시작 버튼이 접기보다 위 (#go-train/#go-review DOM 순서)", (() => {
      const btn = doc.getElementById("go-train") || doc.getElementById("go-review");
      if (!btn || !aboutEl) return false;
      // compareDocumentPosition: 4 = btn precedes aboutEl
      return !!(btn.compareDocumentPosition(aboutEl) & window.Node.DOCUMENT_POSITION_FOLLOWING);
    })());
  }

  // #1 — 첫 세션 전(기록 0): 인트로에 통계 링크를 노출하지 않고 안내 힌트만 (빈 통계로 새지 않게).
  check("#1 랜딩: 첫 세션 전 통계 링크(#go-progress) 미노출", !doc.getElementById("go-progress"));
  check("#1 랜딩: 첫 세션 전 통계 안내 힌트 노출(.stats-hint)", app.querySelectorAll(".stats-hint").length === 1);

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
  // #1 — 요약 주 CTA가 '새 문장 테스트로 마무리'로 명확 + 세션 미완료 알림.
  check("#1 요약: 주 CTA '새 문장 테스트로 마무리'", /새 문장 테스트로 마무리/.test(app.textContent));
  check("#1 요약: 세션 미완료 알림 ('오늘 세션이 끝나지 않았')", /오늘 세션이 끝나지 않았/.test(app.textContent));
  // #1 — 요약 화면 자체엔 통계 링크가 없다 (통계는 세션 완료 후에만).
  check("#1 요약: 요약 화면에 통계 링크 부재 (#go-progress/#go-progress2 없음)",
    !doc.getElementById("go-progress") && !doc.getElementById("go-progress2"));
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

// ===================================================================
//  PART C — 통계 빈 상태 (#1: 세션 미완료 → 기록 0). 정직한 안내 + 다시 시작 CTA, 빈 화면 아님.
// ===================================================================
console.log("");
console.log("[C] 통계 빈 상태 — 세션 미완료(기록 0) 정직 안내 (#1)");
{
  // 기록 0인 채로 진척 화면을 직접 렌더(테스트 seam) — 첫 방문 전엔 인트로 링크가 가려져
  // 클릭으로 도달 불가하므로, 화면 마크업·안내 자체를 검증.
  const { window, doc, app, errors } = boot(null, { progressSeam: true });
  check("seam: window.__gtfRenderProgress 노출됨", typeof window.__gtfRenderProgress === "function");
  window.__gtfRenderProgress();

  check("빈 상태: 빈 화면 아님 — 안내 블록(.empty-state) 렌더", app.querySelectorAll(".empty-state").length === 1);
  check("빈 상태: '새 문장 테스트까지 마치면' 정직 안내 노출",
    /새 문장 테스트까지 마치면/.test(app.textContent));
  check("빈 상태: 익히기만으론 저장 안 됨을 명시",
    /익히기 15문항만으로는 아직 저장되지 않/.test(app.textContent));
  check("빈 상태: 옛 '아직 기록이 없어요' 막다른 문구 부재",
    !/아직 기록이 없어요/.test(app.textContent));
  check("빈 상태: 다시 시작 CTA 존재(#empty-train 또는 #empty-review)",
    !!(doc.getElementById("empty-train") || doc.getElementById("empty-review")));
  // CTA 클릭이 실제 세션을 띄우는지 (막다른 길 아님).
  const startBtn = doc.getElementById("empty-train") || doc.getElementById("empty-review");
  startBtn.dispatchEvent(new window.Event("click", { bubbles: true }));
  check("빈 상태: 시작 CTA → 익히기 세션 진입 (.choice 존재)", app.querySelectorAll(".choice").length > 0);

  check("[C] 런타임 에러 0", errors.length === 0);
  if (errors.length) errors.slice(0, 5).forEach((e) => console.log("    ! " + e));
}

// ===================================================================
//  PART D — get+pp 라벨 폭 fit (#4) + 추이 과밀 접기 (#3). 채워진 통계에서 실측.
// ===================================================================
console.log("");
console.log("[D] get+pp 라벨 fit (#4) + 추이 접기 (#3)");
{
  // get 집중 1문항만 풀어 get-into-state 대비 그림의 도착 칸 라벨이 잘리지 않는지 본다.
  const { window, doc, app, errors } = boot(null);
  const chips = app.querySelectorAll(".focus-chip");
  let getChip = null;
  for (const c of chips) if (c.getAttribute("data-item") === "get") getChip = c;
  getChip.dispatchEvent(new window.Event("click", { bubbles: true }));

  // get-into-state 대비 그림이 나오는 문항까지 진행하며 도착 칸 라벨을 수집.
  let intoLabelTexts = [];
  let intoContrastSeen = 0;
  for (let q = 0; q < 15; q++) {
    app.querySelectorAll(".choice")[0].dispatchEvent(new window.Event("click", { bubbles: true }));
    const into = app.querySelector("#feedback .contrast-wrap.into");
    if (into) {
      intoContrastSeen++;
      // 대비 그림 안 get 칸(.contrast-cell.into) SVG의 모든 text 수집.
      const cell = into.querySelector(".contrast-cell.into");
      if (cell) cell.querySelectorAll("text").forEach((t) => intoLabelTexts.push(t.textContent));
    }
    const nb = doc.getElementById("next-q");
    if (!nb) break;
    nb.dispatchEvent(new window.Event("click", { bubbles: true }));
  }
  check("#4 get+pp 대비 그림 최소 1회 렌더", intoContrastSeen >= 1);
  // 'into a ... state' 류 라벨이 단어 중간(…)에서 잘리지 않았는지: 말줄임표 포함된 'into …' 라벨 부재.
  const truncatedInto = intoLabelTexts.filter((t) => /into a .*…/.test(t) || /into a [a-z]+ st…/.test(t));
  check("#4 도착 칸 'into a ... state' 라벨이 잘리지 않음 (… 말줄임 부재)",
    truncatedInto.length === 0);
  if (truncatedInto.length) truncatedInto.slice(0, 4).forEach((t) => console.log("    ! 잘린 라벨: " + JSON.stringify(t)));
  // 완전한 'state'로 끝나는 라벨이 실제로 그려졌는지 (fit가 통째로 담았다는 양성 신호).
  check("#4 도착 칸에 완전한 'state' 라벨 렌더(양성 신호)",
    intoLabelTexts.some((t) => /into a .*state$/.test(t)));

  // #3 — 추이 과밀 접기: 여러 세션 누적 시 t==1 잡음 줄이 '전체 감각 보기' 접기 뒤로.
  // 8감각이 한 문항씩 스친 1일 + 본 세션을 합쳐 t==1 감각 다수 → 접기 노출 기대.
  const seedMany = [{
    day: 1, date: "2026-06-11T09:00:00.000Z", focusItem: null,
    train: { score: { correct: 8, total: 15 },
      byItem: { "have": { c: 3, t: 4 }, "keep": { c: 3, t: 4 }, "get": { c: 1, t: 3 }, "make": { c: 1, t: 1 }, "take": { c: 0, t: 1 }, "up": { c: 0, t: 1 }, "out": { c: 0, t: 1 } },
      bySense: { "have-domain-location": { c: 3, t: 4 }, "keep-hold": { c: 3, t: 4 }, "get-arrival": { c: 1, t: 3 }, "make-create": { c: 1, t: 1 }, "take-grasp": { c: 0, t: 1 }, "up-vertical": { c: 0, t: 1 }, "out-exit": { c: 0, t: 1 } } },
    transfer: { score: { correct: 2, total: 5 },
      byItem: { "get": { c: 1, t: 3 }, "out": { c: 1, t: 2 } },
      bySense: { "get-arrival": { c: 1, t: 3 }, "out-reveal": { c: 1, t: 2 } } }
  }];
  const env2 = boot(seedMany, { progressSeam: true });
  env2.window.__gtfRenderProgress();
  check("#3 추이: 강점/약점 요약은 상단 유지", /강점 \/ 약점/.test(env2.app.textContent));
  check("#3 추이: '한 번만 풀어 본 감각은 접어' 안내 노출", /한 번만 풀어 본 감각은 접어/.test(env2.app.textContent));
  check("#3 추이: t==1 잡음 줄이 '전체 감각 보기' 접기(.trend-more)로 이동",
    env2.app.querySelectorAll("details.trend-more").length === 1);
  const moreEl = env2.app.querySelector("details.trend-more");
  check("#3 추이: 접기는 기본 닫힘", !!moreEl && !moreEl.hasAttribute("open"));
  // 기본 노출(접기 밖) 줄 수 < 전체 줄 수 (즉 일부가 접혔다).
  const mainRows = env2.app.querySelectorAll(".chart-block > .trend-list .trend-row").length;
  const hiddenRows = moreEl ? moreEl.querySelectorAll(".trend-row").length : 0;
  check("#3 추이: 기본 노출 줄(t>=2)만, 일부(t==1)는 접힘 (hidden>0)",
    hiddenRows > 0 && mainRows >= 1);
  console.log("    note 기본 노출 " + mainRows + "줄 · 접힘 " + hiddenRows + "줄");
  check("[D] 런타임 에러 0", errors.length === 0 && env2.errors.length === 0);
  if (env2.errors.length) env2.errors.slice(0, 5).forEach((e) => console.log("    ! " + e));
}

console.log("=".repeat(52));
console.log(failures === 0 ? "SMOKE: ALL PASS" : "SMOKE: FAIL (" + failures + ")");
process.exit(failures === 0 ? 0 : 1);
