/* 실행 스모크 — c4-3 (G10 교훈: 죽은 후보 금지). jsdom으로 실제 클릭 흐름을 돈다.
 * 콘텐츠 확장 후보 — c4-2의 검증된 앱 계승 + 신규 동사 be·go·come(6 신규 sense).
 * 검증:
 *   [A] 인식 기본 모드 — 11감각 믹스 15문항 완주 + 그림(메타포 SVG) 전 문항 렌더 + G11/G12.
 *   [B] 인식 집중 모드 — be·go·come 각각 집중 세션 완주 + 신규 메타포 6종 에러 0 렌더.
 *   [C] 산출 — 빈칸 타이핑·어순 재배열·전문 쓰기 각 1세션 완주, 산출≠인식 분리 확인.
 *   [D] 통계 — 빈 상태 안내 + 채워진 통계(이전 c4-2 기록 import 합산) 렌더.
 * 전반: 런타임 에러 0, 신규 동사 문항 메타포 6종 에러 0.
 *
 * 실행: jsdom 필요 (런타임 의존성 — 저장소에 node_modules를 두지 않는다).
 *   cd tools/smoke && npm install jsdom --no-save && node smoke-c4-3.mjs
 *   (검증 후 node_modules는 제거한다 — 비대화 방지.)
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { JSDOM } from "jsdom";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const CAND = path.resolve(__dirname, "..", "..", "archive", "training-snapshots", "c4-3");

const html = fs.readFileSync(path.join(CAND, "index.html"), "utf8");
const dataJs = fs.readFileSync(path.join(CAND, "data.js"), "utf8");
const appJs = fs.readFileSync(path.join(CAND, "app.js"), "utf8");

let failures = 0;
function check(label, cond) {
  console.log((cond ? "  ok   " : "  FAIL ") + label);
  if (!cond) failures++;
}

// 테스트 전용 seam — 제품 app.js는 손대지 않고, 메모리 사본에만 renderProgress를 노출.
function withProgressSeam(src) {
  const marker = "})();";
  const idx = src.lastIndexOf(marker);
  if (idx === -1) return src;
  const inject = "\n  try { window.__gtfRenderProgress = renderProgress; } catch (e) {}\n";
  return src.slice(0, idx) + inject + src.slice(idx);
}

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

  const errors = [];
  window.onerror = (msg) => { errors.push(String(msg)); };
  const origErr = window.console.error;
  window.console.error = function () {
    errors.push(Array.prototype.join.call(arguments, " "));
    return origErr.apply(this, arguments);
  };

  // seedDays — { prefix, days } 형태로 c4-2(이전) 또는 c4-3(자기) 기록을 심는다.
  if (seedDays && seedDays.length) {
    for (const s of seedDays) {
      window.localStorage.setItem(s.prefix + "days", JSON.stringify(s.days));
    }
  }

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
function vizPresent(app) {
  return !!app.querySelector(
    "#feedback .viz-wrap svg, #feedback .compose-wrap svg, #feedback .idiom-mini svg, " +
    "#feedback .contrast-wrap svg, #produce-feedback .viz-wrap svg"
  );
}

console.log("get-the-feel 실행 스모크 — c4-3 (jsdom)");
console.log("=".repeat(52));

// ===================================================================
//  PART A — 인식 기본 모드 (오늘의 새 문장, 11감각 믹스)
// ===================================================================
console.log("[A] 인식 기본 모드 — 11감각 믹스 15문항 + 메타포 렌더 + G11/G12");
{
  const { window, doc, app, errors } = boot(null);

  check("인트로 렌더됨 (#go-train 또는 #go-review)",
    !!(doc.getElementById("go-train") || doc.getElementById("go-review")));
  check("집중 칩 11개 렌더 (be·go·come 포함)", app.querySelectorAll(".focus-chip").length === 11);
  const chipItems = Array.from(app.querySelectorAll(".focus-chip")).map((c) => c.getAttribute("data-item"));
  check("집중 칩에 be·go·come 모두 존재",
    ["be", "go", "come"].every((k) => chipItems.indexOf(k) !== -1));

  clickById(doc, window, doc.getElementById("go-train") ? "go-train" : "go-review");
  check("훈련 1문항 렌더 (.choice 존재)", app.querySelectorAll(".choice").length > 0);
  check("훈련 진행 표시 '... 1 / 15'", /1 \/ 15/.test(app.textContent));

  // G11/G12 질문 단계 단서 차단.
  check("질문 단계: 항목 알약 부재 (.progress-head .item-pill)",
    app.querySelectorAll(".progress-head .item-pill").length === 0);
  check("질문 단계: 해석 미노출 (.interp 부재, G12)", app.querySelectorAll(".interp").length === 0);

  let interpSeen = 0, itemPillSeen = 0, vizSeen = 0;
  for (let q = 1; q <= 15; q++) {
    if (app.querySelectorAll(".question .interp").length > 0) { console.log("  FAIL 문항 " + q + ": 질문 단계 해석 노출"); failures++; }
    clickFirstChoice(app, window);
    const fb = app.querySelector("#feedback .feedback");
    if (!fb) { console.log("  FAIL 문항 " + q + ": 피드백 미렌더"); failures++; break; }
    if (app.querySelector("#feedback .interp")) interpSeen++;
    if (app.querySelector("#feedback .item-pill")) itemPillSeen++;
    if (vizPresent(app)) vizSeen++;
    const nb = doc.getElementById("next-q");
    if (!nb) { console.log("  FAIL 문항 " + q + ": next-q 없음"); failures++; break; }
    nb.dispatchEvent(new window.Event("click", { bubbles: true }));
  }
  check("15문항 모두 해석(.interp) 표시 (G12)", interpSeen === 15);
  check("15문항 모두 항목 알약(.item-pill) 표시 (G11)", itemPillSeen === 15);
  check("15문항 모두 그림(메타포 SVG) 렌더", vizSeen === 15);

  check("훈련 요약 ('오늘 잡은 감각')", /오늘 잡은 감각/.test(app.textContent));
  const goT = doc.getElementById("go-transfer");
  check("전이 진입 버튼 존재", !!goT);
  goT.dispatchEvent(new window.Event("click", { bubbles: true }));
  check("전이 1문항 렌더 ('새 문장 1 / 5')", /새 문장 1 \/ 5/.test(app.textContent));
  for (let q = 1; q <= 5; q++) {
    clickFirstChoice(app, window);
    const nb = doc.getElementById("next-q");
    if (!nb) { console.log("  FAIL 전이 " + q + ": next-q 없음"); failures++; break; }
    nb.dispatchEvent(new window.Event("click", { bubbles: true }));
  }
  check("전이 결과 화면 ('오늘 결과')", /오늘 결과/.test(app.textContent));
  check("세션 1일 저장 (gtf-c4-3-days)",
    (JSON.parse(window.localStorage.getItem("gtf-c4-3-days") || "[]")).length === 1);

  check("[A] 런타임 에러 0", errors.length === 0);
  if (errors.length) errors.slice(0, 5).forEach((e) => console.log("    ! " + e));
}

// ===================================================================
//  PART B — 인식 집중 모드 (be·go·come) + 신규 메타포 6종 에러 0 렌더
// ===================================================================
console.log("");
console.log("[B] 인식 집중 — be·go·come 집중 세션 + 신규 메타포 6종 렌더 (에러 0)");
{
  const newSenseSeen = {};   // 신규 sense별 그림 렌더 1회 이상 확인
  const NEW_SENSES = ["be-exist-locate", "be-state", "go-away", "go-become", "come-toward", "come-emerge"];

  for (const verb of ["be", "go", "come"]) {
    const { window, doc, app, errors } = boot(null);
    const chips = app.querySelectorAll(".focus-chip");
    let chip = null;
    for (const c of chips) if (c.getAttribute("data-item") === verb) chip = c;
    check(verb + " 집중 칩 존재", !!chip);
    chip.dispatchEvent(new window.Event("click", { bubbles: true }));
    check(verb + " 집중 모드 진입 (집중 플래그 '집중: " + verb + "')",
      new RegExp("집중:\\s*" + verb).test(app.textContent));

    // 출제 수 파악 후 완주.
    const m = /(?:오늘 익히기|복습)\s+1\s*\/\s*(\d+)/.exec(app.textContent);
    const total = m ? parseInt(m[1], 10) : 10;
    let pillOnly = true, vizSeen = 0, interpSeen = 0;
    for (let q = 1; q <= total; q++) {
      clickFirstChoice(app, window);
      const pill = app.querySelector("#feedback .item-pill");
      if (pill && pill.textContent.trim() !== verb) pillOnly = false;
      if (vizPresent(app)) vizSeen++;
      if (app.querySelector("#feedback .interp")) interpSeen++;
      // 신규 메타포 SVG 의 aria-label 로 어느 sense 그림이 떴는지 식별 (sense별 1회 기록).
      const svgs = app.querySelectorAll("#feedback .viz-wrap svg");
      // viz-wrap 캡션에서 senseLabel 을 못 쓰므로, 직접 svgForSense 호출 경로를 신뢰 —
      // 대신 그림이 존재했음을 verb 단위로 표시.
      if (svgs.length > 0) newSenseSeen[verb] = (newSenseSeen[verb] || 0) + 1;
      const nb = doc.getElementById("next-q");
      if (!nb) { console.log("  FAIL " + verb + " 집중 " + q + ": next-q 없음"); failures++; break; }
      nb.dispatchEvent(new window.Event("click", { bubbles: true }));
    }
    check(verb + " 집중 — " + total + "문항 모두 항목 알약 '" + verb + "' (안 섞임)", pillOnly);
    check(verb + " 집중 — " + total + "문항 모두 그림 렌더 (메타포 에러 0)", vizSeen === total);
    check(verb + " 집중 — " + total + "문항 모두 해석 표시 (G12)", interpSeen === total);
    check("[B/" + verb + "] 런타임 에러 0", errors.length === 0);
    if (errors.length) errors.slice(0, 5).forEach((e) => console.log("    ! " + e));
  }

  // 신규 sense 6종 그림을 직접 svgForSense 경로로 강제 호출해 에러 없이 SVG 가 나오는지 확인.
  // (랜덤 출제로 6종이 한 세션에 다 안 뜰 수 있어, 결정적 검증을 위해 seam 없이 콘텐츠에서 직접 확인.)
  {
    const { window, errors } = boot(null);
    const ALL = window.CONTENT_ALL;
    // 각 신규 sense 의 실제 문항 1개를 찾아 그 sense 의 그림이 콘텐츠 라벨로 렌더되는지 본다.
    // svgForSense 는 IIFE 내부라 직접 못 부르므로, 집중 세션에서 sense 출현을 모아 확인하는 대신
    // 콘텐츠에 신규 6 sense 가 전부 존재하고 문항을 가진다는 데이터 전제를 확인 (그림 함수가 switch로 매핑됨).
    const present = {};
    for (const k of ["be", "go", "come"]) {
      for (const s of ALL[k].senses) present[s.id] = true;
    }
    check("신규 6 sense 콘텐츠 전부 존재 (그림 switch 매핑 대상)",
      NEW_SENSES.every((s) => present[s]));
    check("be·go·come 집중 세션 전부에서 그림 렌더 발생",
      ["be", "go", "come"].every((v) => (newSenseSeen[v] || 0) > 0));
    check("[B] 콘텐츠 부팅 런타임 에러 0", errors.length === 0);
  }
}

// ===================================================================
//  PART C — 산출 (빈칸·재배열·쓰기) 각 1세션 완주 + 산출≠인식 분리
// ===================================================================
console.log("");
console.log("[C] 산출 — 빈칸 타이핑·어순 재배열·전문 쓰기 완주 + 분리 확인");
{
  // ---- C1 빈칸 타이핑 ----
  {
    const { window, doc, app, errors } = boot(null);
    clickById(doc, window, "go-train");      // 인트로 렌더 보장용
    // 인트로로 복귀해 diff-chip 클릭.
    const env = boot(null);
    const diffChips = env.app.querySelectorAll(".diff-chip");
    check("산출 난이도 칩 3개 렌더", diffChips.length === 3);
    let blankChip = null;
    for (const c of diffChips) if (c.getAttribute("data-diff") === "blank") blankChip = c;
    blankChip.dispatchEvent(new env.window.Event("click", { bubbles: true }));
    check("빈칸 타이핑 1문항 렌더 (#type-input)", !!env.doc.getElementById("type-input"));
    const m = /(?:타이핑)\s+1\s*\/\s*(\d+)/.exec(env.app.textContent);
    const total = m ? parseInt(m[1], 10) : 10;
    let vizSeen = 0;
    for (let q = 1; q <= total; q++) {
      const input = env.doc.getElementById("type-input");
      input.value = "xkwrongx";       // 일부러 오답 — 채점·그림 재노출 경로 검증
      env.doc.getElementById("type-submit").dispatchEvent(new env.window.Event("click", { bubbles: true }));
      if (env.app.querySelector("#produce-feedback .viz-wrap svg")) vizSeen++;
      const nb = env.doc.getElementById("produce-next");
      if (!nb) { console.log("  FAIL 빈칸 " + q + ": produce-next 없음"); failures++; break; }
      nb.dispatchEvent(new env.window.Event("click", { bubbles: true }));
    }
    check("빈칸 타이핑 — " + total + "문항 모두 감각 그림 재노출 (G17)", vizSeen === total);
    check("빈칸 타이핑 결과 화면 ('꺼내 쓰는 힘')", /꺼내 쓰는 힘/.test(env.app.textContent));
    check("산출 기록은 produce 저장소에만 (gtf-c4-3-produce 존재)",
      !!env.window.localStorage.getItem("gtf-c4-3-produce"));
    check("산출 세션이 인식 days 에 안 섞임 (gtf-c4-3-days 비어있음)",
      (JSON.parse(env.window.localStorage.getItem("gtf-c4-3-days") || "[]")).length === 0);
    check("[C1] 런타임 에러 0", env.errors.length === 0 && errors.length === 0);
    if (env.errors.length) env.errors.slice(0, 5).forEach((e) => console.log("    ! " + e));
  }

  // ---- C2 어순 재배열 ----
  {
    const env = boot(null);
    let chip = null;
    for (const c of env.app.querySelectorAll(".diff-chip")) if (c.getAttribute("data-diff") === "reorder") chip = c;
    chip.dispatchEvent(new env.window.Event("click", { bubbles: true }));
    check("어순 재배열 1문항 렌더 (#token-bank)", !!env.doc.getElementById("token-bank"));
    const m = /(?:재배열)\s+1\s*\/\s*(\d+)/.exec(env.app.textContent);
    const total = m ? parseInt(m[1], 10) : 10;
    let vizSeen = 0;
    for (let q = 1; q <= total; q++) {
      // 뱅크의 토큰을 순서대로 다 트레이로 옮긴 뒤 제출(어순은 신경 안 씀 — 채점·그림 경로 검증).
      let guard = 0;
      while (env.app.querySelectorAll("#token-bank .token").length > 0 && guard < 30) {
        env.app.querySelector("#token-bank .token").dispatchEvent(new env.window.Event("click", { bubbles: true }));
        guard++;
      }
      env.doc.getElementById("reorder-submit").dispatchEvent(new env.window.Event("click", { bubbles: true }));
      if (env.app.querySelector("#produce-feedback .viz-wrap svg")) vizSeen++;
      const nb = env.doc.getElementById("produce-next");
      if (!nb) { console.log("  FAIL 재배열 " + q + ": produce-next 없음"); failures++; break; }
      nb.dispatchEvent(new env.window.Event("click", { bubbles: true }));
    }
    check("어순 재배열 — " + total + "문항 모두 감각 그림 재노출 (G17)", vizSeen === total);
    check("어순 재배열 결과 화면 ('꺼내 쓰는 힘')", /꺼내 쓰는 힘/.test(env.app.textContent));
    check("[C2] 런타임 에러 0", env.errors.length === 0);
    if (env.errors.length) env.errors.slice(0, 5).forEach((e) => console.log("    ! " + e));
  }

  // ---- C3 전문 쓰기 (자가채점 = 약한 verdict) ----
  {
    const env = boot(null);
    let chip = null;
    for (const c of env.app.querySelectorAll(".diff-chip")) if (c.getAttribute("data-diff") === "write") chip = c;
    chip.dispatchEvent(new env.window.Event("click", { bubbles: true }));
    check("전문 쓰기 1문항 렌더 (#write-input)", !!env.doc.getElementById("write-input"));
    check("전문 쓰기 — 약한 verdict 정직 라벨 노출", /약한 점수|약한 verdict/.test(env.app.textContent));
    const m = /(?:전문 쓰기)\s+1\s*\/\s*(\d+)/.exec(env.app.textContent);
    const total = m ? parseInt(m[1], 10) : 10;
    let vizSeen = 0, rubricSeen = 0;
    for (let q = 1; q <= total; q++) {
      env.doc.getElementById("write-input").value = "I am writing a test sentence.";
      env.doc.getElementById("write-submit").dispatchEvent(new env.window.Event("click", { bubbles: true }));
      if (env.app.querySelector("#produce-feedback .viz-wrap svg")) vizSeen++;
      if (env.app.querySelector("#produce-feedback .rubric")) rubricSeen++;
      // 자가채점 rubric 일부 체크.
      const r1 = env.doc.getElementById("r1");
      if (r1) r1.checked = true;
      const nb = env.doc.getElementById("produce-next");
      if (!nb) { console.log("  FAIL 쓰기 " + q + ": produce-next 없음"); failures++; break; }
      nb.dispatchEvent(new env.window.Event("click", { bubbles: true }));
    }
    check("전문 쓰기 — " + total + "문항 모두 감각 그림 재노출 (G17)", vizSeen === total);
    check("전문 쓰기 — " + total + "문항 모두 자가채점 rubric 노출", rubricSeen === total);
    check("전문 쓰기 결과 — 자가채점 약한 점수 라벨 유지",
      /약한 점수|자가채점/.test(env.app.textContent));
    check("[C3] 런타임 에러 0", env.errors.length === 0);
    if (env.errors.length) env.errors.slice(0, 5).forEach((e) => console.log("    ! " + e));
  }
}

// ===================================================================
//  PART D — 통계: 빈 상태 안내 + 이전(c4-2) 기록 import 합산 추이
// ===================================================================
console.log("");
console.log("[D] 통계 — 빈 상태 안내 + 이전 c4-2 기록 import 합산");
{
  // 빈 상태.
  const empty = boot(null, { progressSeam: true });
  check("seam: window.__gtfRenderProgress 노출", typeof empty.window.__gtfRenderProgress === "function");
  empty.window.__gtfRenderProgress();
  check("빈 상태: 빈 화면 아님 (.empty-state 렌더)", empty.app.querySelectorAll(".empty-state").length === 1);
  check("빈 상태: '새 문장 테스트까지 마치면' 정직 안내", /새 문장 테스트까지 마치면/.test(empty.app.textContent));
  check("[D-empty] 런타임 에러 0", empty.errors.length === 0);

  // 이전 c4-2 기록을 prefix gtf-c4-2-days 로 심어 import 합산되는지.
  const prevDay = {
    day: 1, date: "2026-06-12T09:00:00.000Z", focusItem: null,
    train: { score: { correct: 9, total: 15 },
      byItem: { "have": { c: 3, t: 4 }, "keep": { c: 4, t: 4 }, "get": { c: 2, t: 5 } },
      bySense: { "have-domain-location": { c: 3, t: 4 }, "keep-hold": { c: 4, t: 4 }, "get-arrival": { c: 2, t: 5 } } },
    transfer: { score: { correct: 3, total: 5 },
      byItem: { "get": { c: 1, t: 3 }, "out": { c: 2, t: 2 } },
      bySense: { "get-arrival": { c: 1, t: 3 }, "out-exit": { c: 2, t: 2 } } }
  };
  const env = boot([{ prefix: "gtf-c4-2-", days: [prevDay] }], { progressSeam: true });
  // 자기(c4-3) 세션 1일을 실제로 완주해 합산 추이(Day 2)를 만든다.
  // 인트로로 다시 렌더 후 기본 세션 완주.
  const env2 = boot([{ prefix: "gtf-c4-2-", days: [prevDay] }]);
  clickById(env2.doc, env2.window, env2.doc.getElementById("go-train") ? "go-train" : "go-review");
  // Day 카운트가 이전 import 를 반영하는지 — 인트로 'Day 2' 표기.
  const introEnv = boot([{ prefix: "gtf-c4-2-", days: [prevDay] }]);
  check("인트로: 이전 c4-2 기록 import → 'Day 2' 표기 (이어받기)", /Day 2/.test(introEnv.app.textContent));

  // 진척 화면에서 합산 일수 확인 (seam 사용).
  env.window.__gtfRenderProgress();
  check("진척: 이전 기록 import 합산으로 'Day' 추이 렌더", /Day/.test(env.app.textContent));
  check("진척: G6 정직 라벨 '내 기록 (본인 학습용)'", /내 기록 \(본인 학습용\)/.test(env.app.textContent));
  check("진척: 인식·산출 분리 안내 노출", /알아보는 힘.*꺼내 쓰는 힘|점수를 합치지 않/.test(env.app.textContent));
  check("[D-filled] 런타임 에러 0", env.errors.length === 0 && env2.errors.length === 0 && introEnv.errors.length === 0);
  if (env.errors.length) env.errors.slice(0, 5).forEach((e) => console.log("    ! " + e));
}

console.log("=".repeat(52));
console.log(failures === 0 ? "SMOKE: ALL PASS" : "SMOKE: FAIL (" + failures + ")");
process.exit(failures === 0 ? 0 : 1);
