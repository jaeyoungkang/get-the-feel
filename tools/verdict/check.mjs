#!/usr/bin/env node
/* get-the-feel · verdict — 단일 기계 검증 스크립트
 *
 *   node tools/verdict/check.mjs <candidate-id>     예) c1-1
 *
 * 검사군 (각 PASS/FAIL):
 *   content-contract   콘텐츠 JSON이 CONTRACT.md 규칙 충족
 *   candidate-files    후보 폴더에 필수 파일 존재
 *   data-sync          data.js의 CONTENT가 후보의 콘텐츠 파일과 의미적 동일
 *                      (후보별 매핑: c1-1→have.json, c1-2→up.json)
 *   separation-surface 전이 문항이 훈련 출제 풀에 섞이지 않는 구조
 *   no-gamification    point/streak/badge 류 식별자 부재
 *   choice-shuffle     후보 app.js에 보기 셔플 구현(shuffleChoices) 존재 (R1·CONTRACT 8)
 *   label-fields       콘텐츠 전 문항에 subject_label/object_label 존재 +
 *                      app.js에 문장 파싱 라벨 추출 부재 (G2·CONTRACT 7)
 *   smoke              data.js 파싱 + CONTENT 스키마 일치
 *
 *   choice-shuffle·label-fields 는 교훈 회수 이후 후보(c1-2~)에만 적용한다.
 *   c1-1 은 회수 전 후보이므로 두 검사를 skip(ok 표기)한다 — 회귀 금지 대상에서 제외.
 *
 * 전체 결과를 exit code로: 모든 검사 PASS → 0, 하나라도 FAIL → 1.
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import vm from "node:vm";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");

const candidateId = process.argv[2];
if (!candidateId) {
  console.error("usage: node tools/verdict/check.mjs <candidate-id>");
  process.exit(2);
}

// ---------- 출력 헬퍼 ----------
const groups = []; // { name, pass, lines: [] }
function group(name) {
  const g = { name, pass: true, lines: [] };
  groups.push(g);
  return {
    ok(msg) { g.lines.push("    ok   " + msg); },
    fail(msg) { g.pass = false; g.lines.push("    FAIL " + msg); },
  };
}

// ---------- 공통 로더 ----------
const CONTENT_DIR = path.join(ROOT, "assets", "content");
const SOURCES_MD = path.join(ROOT, "assets", "content", "sources.md");
function resolveCandidateDir(id) {
  const current = path.join(ROOT, "archive", "training-snapshots", id);
  if (fs.existsSync(current)) return current;
  return path.join(ROOT, "archive", "training-snapshots", "closed", id);
}

const CAND_DIR = resolveCandidateDir(candidateId);

// 후보 ↔ 콘텐츠 파일 매핑. 후보마다 어떤 감각 항목을 싣는지 선언.
// 단일 파일(문자열) 또는 다파일 결합 후보(객체: window.CONTENT_ALL 키 → json).
const CANDIDATE_CONTENT = {
  "c1-1": "have.json",
  "c1-2": "up.json",
  // c2-1 = C2 Convergence 결합 후보. data.js는 window.CONTENT_ALL 의 4키를 노출하고,
  // 출제 풀은 get·phrasal-up, 참조 풀은 have·up. 4키 각각을 해당 json과 의미 비교한다.
  "c2-1": {
    multi: true,
    embed: "CONTENT_ALL",                 // data.js가 노출하는 결합 객체 이름
    keys: {                                // CONTENT_ALL 키 → assets/content json
      "get": "get.json",
      "phrasal-up": "phrasal-up.json",
      "have": "have.json",
      "up": "up.json",
    },
    quiz: ["get.json", "phrasal-up.json"], // 출제 풀 (separation·label 검사 기준)
  },
  // c2-2 = C2 Convergence 두께 후보. data.js는 window.CONTENT_ALL 로 7파일 전부를 노출한다.
  // 출제 풀 = 7파일 전부(일일 공급은 전체 훈련 풀 70문항을 미출제 우선으로 낸다).
  // 7키 각각을 해당 json과 의미 비교한다.
  "c2-2": {
    multi: true,
    embed: "CONTENT_ALL",
    keys: {
      "have": "have.json",
      "get": "get.json",
      "take": "take.json",
      "make": "make.json",
      "up": "up.json",
      "out": "out.json",
      "phrasal-up": "phrasal-up.json",
    },
    quiz: ["have.json", "get.json", "take.json", "make.json", "up.json", "out.json", "phrasal-up.json"],
  },
  // c2-3 = C2 Convergence. 핵심 동사 5번째 keep 합류 → data.js는 window.CONTENT_ALL 로 8파일 전부 노출.
  // 출제 풀 = 8파일 전부. 8키 각각을 해당 json과 의미 비교한다.
  "c2-3": {
    multi: true,
    embed: "CONTENT_ALL",
    keys: {
      "have": "have.json",
      "get": "get.json",
      "take": "take.json",
      "make": "make.json",
      "keep": "keep.json",
      "up": "up.json",
      "out": "out.json",
      "phrasal-up": "phrasal-up.json",
    },
    quiz: ["have.json", "get.json", "take.json", "make.json", "keep.json", "up.json", "out.json", "phrasal-up.json"],
  },
  // c4-1 = C4 출시 후 진화. data.js는 window.CONTENT_ALL 로 8파일 전부 노출 (get.json은 3 sense).
  // 출제 풀 = 8파일 전부. 8키 각각을 해당 json과 의미 비교한다. (c2-3 동결 — c4-1이 새 작업 후보)
  "c4-1": {
    multi: true,
    embed: "CONTENT_ALL",
    keys: {
      "have": "have.json",
      "get": "get.json",
      "take": "take.json",
      "make": "make.json",
      "keep": "keep.json",
      "up": "up.json",
      "out": "out.json",
      "phrasal-up": "phrasal-up.json",
    },
    quiz: ["have.json", "get.json", "take.json", "make.json", "keep.json", "up.json", "out.json", "phrasal-up.json"],
  },
  // c4-2 = C4 진화 #4 (제약형 산출, V3). data.js는 window.CONTENT_ALL 로 8파일 전부 노출 (c4-1과 동일 코퍼스).
  // 출제 풀 = 8파일 전부. 8키 각각을 해당 json과 의미 비교한다. (c4-1 동결 — c4-2가 새 작업 후보)
  // 산출 모드는 같은 코퍼스에서 파생하므로 콘텐츠 매핑은 c4-1과 동일하다.
  "c4-2": {
    multi: true,
    embed: "CONTENT_ALL",
    keys: {
      "have": "have.json",
      "get": "get.json",
      "take": "take.json",
      "make": "make.json",
      "keep": "keep.json",
      "up": "up.json",
      "out": "out.json",
      "phrasal-up": "phrasal-up.json",
    },
    quiz: ["have.json", "get.json", "take.json", "make.json", "keep.json", "up.json", "out.json", "phrasal-up.json"],
  },
  // c4-3 = C4 콘텐츠 확장 후보. c4-2(대표·동결)의 검증된 앱을 계승하되 신규 동사 3개(be·go·come) 노출.
  // data.js는 window.CONTENT_ALL 로 11파일 전부 노출. 출제 풀 = 11파일 전부.
  // 11키 각각을 해당 json과 의미 비교한다. (c4-2 동결 — c4-3가 새 작업 후보)
  "c4-3": {
    multi: true,
    embed: "CONTENT_ALL",
    keys: {
      "have": "have.json",
      "get": "get.json",
      "take": "take.json",
      "make": "make.json",
      "keep": "keep.json",
      "be": "be.json",
      "go": "go.json",
      "come": "come.json",
      "up": "up.json",
      "out": "out.json",
      "phrasal-up": "phrasal-up.json",
    },
    quiz: ["have.json", "get.json", "take.json", "make.json", "keep.json", "be.json", "go.json", "come.json", "up.json", "out.json", "phrasal-up.json"],
  },
};
const CANDIDATE_MAP = CANDIDATE_CONTENT[candidateId] || null;
const IS_MULTI = !!(CANDIDATE_MAP && typeof CANDIDATE_MAP === "object" && CANDIDATE_MAP.multi);
// 단일 후보: 콘텐츠 파일명 문자열. 다파일 후보: null (대신 CANDIDATE_MAP 사용).
const CANDIDATE_CONTENT_FILE = IS_MULTI ? null : (CANDIDATE_MAP || null);
// 출제 풀 파일 목록 — 단일이면 [그 파일], 다파일이면 quiz 목록.
const QUIZ_CONTENT_FILES = IS_MULTI ? CANDIDATE_MAP.quiz : (CANDIDATE_CONTENT_FILE ? [CANDIDATE_CONTENT_FILE] : []);

// 교훈(R1 셔플 / G2 명시 라벨) 회수 이후 후보에만 신규 검사 적용.
// c1-1은 회수 전 후보 — choice-shuffle·label-fields를 skip(ok)한다.
const NEW_CHECKS_FROM = new Set(["c1-2", "c2-1", "c2-2", "c2-3", "c4-1", "c4-2", "c4-3"]);
const APPLY_NEW_CHECKS = NEW_CHECKS_FROM.has(candidateId);

// sentence_ko(CONTRACT 9)·질문단계 단서 차단(G11)은 c2-3부터 적용한다.
// c2-3 전 후보는 회수 전 후보 — 두 검사를 skip(ok)한다 (회귀 금지 대상에서 제외).
const KO_CHECKS_FROM = new Set(["c2-3", "c4-1", "c4-2", "c4-3"]);
const APPLY_KO_CHECKS = KO_CHECKS_FROM.has(candidateId);

function readJsonContentFiles() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({
      name: f,
      path: path.join(CONTENT_DIR, f),
      data: JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8")),
    }));
}

function loadSourceIds() {
  if (!fs.existsSync(SOURCES_MD)) return new Set();
  const md = fs.readFileSync(SOURCES_MD, "utf8");
  const ids = new Set();
  // sources.md는 마크다운 표에서 `id`를 백틱으로 감싼다: | `heine-1997` | ...
  const re = /`([a-z0-9][a-z0-9._-]*)`/gi;
  let m;
  while ((m = re.exec(md)) !== null) ids.add(m[1]);
  return ids;
}

// 문장 정규화: 소문자 + 공백 접기 + 양끝 구두점 제거
function normSentence(s) {
  return String(s)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^[\s"'.,!?]+|[\s"'.,!?]+$/g, "")
    .trim();
}

// data.js를 안전 컨텍스트에서 평가해 window.CONTENT만 회수
function evalDataJs(dataPath) {
  const code = fs.readFileSync(dataPath, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: dataPath, timeout: 2000 });
  return sandbox.window.CONTENT;
}

// data.js를 평가해 window 전체를 회수 (CONTENT / CONTENT_ALL 등 노출 객체 선택용)
function evalDataWindow(dataPath) {
  const code = fs.readFileSync(dataPath, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: dataPath, timeout: 2000 });
  return sandbox.window;
}

// 깊은 의미 비교 (객체 키 순서 무시, 배열 순서는 유지)
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  if (typeof a === "object") {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    if (ka.length !== kb.length) return false;
    for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return false;
    for (const k of ka) if (!deepEqual(a[k], b[k])) return false;
    return true;
  }
  return false;
}

// ===================================================================
//  1. content-contract
// ===================================================================
function checkContentContract() {
  const g = group("content-contract");
  let files;
  try {
    files = readJsonContentFiles();
  } catch (e) {
    g.fail("콘텐츠 JSON 파싱 실패: " + e.message);
    return;
  }
  if (files.length === 0) {
    g.fail("assets/content/*.json 없음");
    return;
  }
  const sourceIds = loadSourceIds();
  if (sourceIds.size === 0) g.fail("assets/content/sources.md에서 source_id를 읽지 못함");

  // 전 코퍼스 문장 중복 검사용 누적
  const allSentences = []; // { norm, where }

  for (const f of files) {
    const d = f.data;
    const tag = f.name;

    // senses ≥ 1
    if (!Array.isArray(d.senses) || d.senses.length < 1) {
      g.fail(tag + ": senses ≥ 1 위반");
      continue;
    } else {
      g.ok(tag + ": senses=" + d.senses.length);
    }

    const senseIds = new Set();
    for (const s of d.senses) {
      senseIds.add(s.id);
      // source_refs ≥ 1, 빈 claim/locator fail
      if (!Array.isArray(s.source_refs) || s.source_refs.length < 1) {
        g.fail(tag + " sense " + s.id + ": source_refs ≥ 1 위반");
      } else {
        for (const ref of s.source_refs) {
          if (!ref.claim || String(ref.claim).trim() === "")
            g.fail(tag + " sense " + s.id + ": 빈 claim");
          if (!ref.locator || String(ref.locator).trim() === "")
            g.fail(tag + " sense " + s.id + ": 빈 locator");
          // source_id가 sources.md에 등재
          if (!sourceIds.has(ref.source_id))
            g.fail(tag + " sense " + s.id + ": source_id '" + ref.source_id + "' 미등재");
        }
      }
      // validation 존재
      if (!s.validation || typeof s.validation !== "object")
        g.fail(tag + " sense " + s.id + ": validation 없음");
    }

    // training ≥ 8, transfer ≥ 4
    const tr = Array.isArray(d.training_items) ? d.training_items : [];
    const xf = Array.isArray(d.transfer_items) ? d.transfer_items : [];
    if (tr.length < 8) g.fail(tag + ": training ≥ 8 위반 (=" + tr.length + ")");
    else g.ok(tag + ": training=" + tr.length);
    if (xf.length < 4) g.fail(tag + ": transfer ≥ 4 위반 (=" + xf.length + ")");
    else g.ok(tag + ": transfer=" + xf.length);

    // sense_id 고아 0
    let orphan = 0;
    for (const it of tr.concat(xf)) {
      if (!senseIds.has(it.sense_id)) {
        orphan++;
        g.fail(tag + " item " + it.id + ": 고아 sense_id '" + it.sense_id + "'");
      }
    }
    if (orphan === 0) g.ok(tag + ": 고아 sense_id 0");

    // 문장 누적 (중복 검사는 전 코퍼스 통합)
    for (const it of tr) allSentences.push({ norm: normSentence(it.sentence), where: tag + "/train/" + it.id });
    for (const it of xf) allSentences.push({ norm: normSentence(it.sentence), where: tag + "/transfer/" + it.id });
  }

  // 문장 중복 0 (정규화 비교, 전 코퍼스)
  const seen = new Map();
  let dup = 0;
  for (const s of allSentences) {
    if (seen.has(s.norm)) {
      dup++;
      g.fail("문장 중복: '" + s.norm + "' (" + seen.get(s.norm) + " ↔ " + s.where + ")");
    } else {
      seen.set(s.norm, s.where);
    }
  }
  if (dup === 0) g.ok("문장 중복 0 (정규화, 전 코퍼스 " + allSentences.length + "문장)");
}

// ===================================================================
//  2. candidate-files
// ===================================================================
function checkCandidateFiles() {
  const g = group("candidate-files");
  if (!fs.existsSync(CAND_DIR)) {
    g.fail("archive/training-snapshots/" + candidateId + "/ 또는 archive/training-snapshots/closed/" + candidateId + "/ 없음");
    return;
  }
  for (const f of ["index.html", "app.js", "data.js", "styles.css"]) {
    if (fs.existsSync(path.join(CAND_DIR, f))) g.ok(f + " 존재");
    else g.fail(f + " 없음");
  }
}

// ===================================================================
//  3. data-sync
// ===================================================================
// 닫힌 후보 — 마감 시점 verdict PASS가 정본 (cycle-record 참조). 코퍼스는 계속
// 진화하므로 닫힌 후보의 data.js와 현 코퍼스의 drift는 결함이 아니다 (c2-2b 운영 결정).
// c2-3 = 동결된 대표 후보(배포 라이브). get.json 확장(3번째 sense)으로 c2-3 data.js와 현
// 코퍼스의 drift는 결함이 아니다 — c2-3은 마감 시점 PASS가 정본. c4-1이 새 작업 후보였다.
// c4-1 = C4 진화 대표 후보·배포 동결 (c4-2 사이클에서 승격·고정). 마감 시점 PASS가 정본 —
// 코퍼스 진화 drift는 결함 아님. c4-2가 새 작업 후보(fresh start, 산출 모드 추가).
// c4-2 = C4 진화 대표 후보·배포 동결 (c4-3 사이클에서 승격·고정). 마감 시점 PASS가 정본 —
// 코퍼스 확장(be·go·come) drift는 결함 아님. c4-3가 새 작업 후보(콘텐츠 확장, 11파일).
const CLOSED_CANDIDATES = new Set(["c1-1", "c1-2", "c2-1", "c2-2", "c2-3", "c4-1", "c4-2"]);

function checkDataSync() {
  const g = group("data-sync");
  if (CLOSED_CANDIDATES.has(candidateId)) {
    g.ok("닫힌 후보 — 마감 시점 PASS가 정본 (코퍼스 진화 drift 허용, c2-2b 운영 결정)");
    return;
  }
  const dataPath = path.join(CAND_DIR, "data.js");
  if (!fs.existsSync(dataPath)) { g.fail("data.js 없음"); return; }
  if (!CANDIDATE_MAP) {
    g.fail("후보 '" + candidateId + "'의 콘텐츠 매핑 미정의 (CANDIDATE_CONTENT에 추가 필요)");
    return;
  }

  // 다파일 결합 후보 (c2-1~): window.CONTENT_ALL 의 각 키를 해당 json과 의미 비교.
  if (IS_MULTI) {
    let win;
    try { win = evalDataWindow(dataPath); }
    catch (e) { g.fail("data.js 평가 실패: " + e.message); return; }
    const all = win[CANDIDATE_MAP.embed];
    if (!all || typeof all !== "object") {
      g.fail("data.js에 window." + CANDIDATE_MAP.embed + " 없음 (결합 후보는 4키 객체 필요)");
      return;
    }
    const wantKeys = Object.keys(CANDIDATE_MAP.keys).sort();
    const gotKeys = Object.keys(all).sort();
    if (wantKeys.join(",") !== gotKeys.join(",")) {
      g.fail("CONTENT_ALL 키 불일치: 기대 [" + wantKeys.join(", ") + "] / 실제 [" + gotKeys.join(", ") + "]");
    } else {
      g.ok("CONTENT_ALL 키 일치 [" + wantKeys.join(", ") + "]");
    }
    for (const k of wantKeys) {
      const file = CANDIDATE_MAP.keys[k];
      const contentPath = path.join(CONTENT_DIR, file);
      if (!fs.existsSync(contentPath)) { g.fail("assets/content/" + file + " 없음"); continue; }
      let source;
      try { source = JSON.parse(fs.readFileSync(contentPath, "utf8")); }
      catch (e) { g.fail(file + " 파싱 실패: " + e.message); continue; }
      if (!(k in all)) { g.fail("CONTENT_ALL['" + k + "'] 없음"); continue; }
      if (deepEqual(all[k], source))
        g.ok("CONTENT_ALL['" + k + "'] ≡ " + file + " (JSON 의미 동일)");
      else
        g.fail("CONTENT_ALL['" + k + "'] 가 " + file + " 과 의미적으로 다름");
    }
    return;
  }

  // 단일 후보 (c1-1·c1-2): window.CONTENT 를 단일 json과 비교 (기존 동작 유지).
  const contentPath = path.join(CONTENT_DIR, CANDIDATE_CONTENT_FILE);
  if (!fs.existsSync(contentPath)) { g.fail("assets/content/" + CANDIDATE_CONTENT_FILE + " 없음"); return; }
  let embedded, source;
  try { embedded = evalDataJs(dataPath); }
  catch (e) { g.fail("data.js 평가 실패: " + e.message); return; }
  try { source = JSON.parse(fs.readFileSync(contentPath, "utf8")); }
  catch (e) { g.fail(CANDIDATE_CONTENT_FILE + " 파싱 실패: " + e.message); return; }
  if (!embedded) { g.fail("data.js에 window.CONTENT 없음"); return; }
  if (deepEqual(embedded, source)) g.ok("data.js CONTENT ≡ " + CANDIDATE_CONTENT_FILE + " (JSON 의미 동일)");
  else g.fail("data.js CONTENT 가 " + CANDIDATE_CONTENT_FILE + " 과 의미적으로 다름");
}

// ===================================================================
//  4. separation-surface
// ===================================================================
// 정적 확인: app.js에서 훈련 출제 풀이 transfer_items를 참조하지 않고,
// 전이 풀이 training_items를 참조하지 않는다.
function checkSeparationSurface() {
  const g = group("separation-surface");
  const appPath = path.join(CAND_DIR, "app.js");
  if (!fs.existsSync(appPath)) { g.fail("app.js 없음"); return; }
  const src = fs.readFileSync(appPath, "utf8");

  // 훈련 풀 함수 본문 추출
  const trainFn = extractFnBody(src, "buildTrainingPool");
  const transferFn = extractFnBody(src, "buildTransferPool");
  if (trainFn === null) { g.fail("buildTrainingPool 함수를 찾지 못함"); }
  if (transferFn === null) { g.fail("buildTransferPool 함수를 찾지 못함"); }

  if (trainFn !== null) {
    if (/transfer_items/.test(trainFn))
      g.fail("훈련 출제 풀(buildTrainingPool)이 transfer_items를 참조 — 분리 위반");
    else if (/training_items/.test(trainFn))
      g.ok("훈련 풀은 training_items만 참조");
    else
      g.fail("훈련 풀이 training_items를 참조하지 않음 — 출제 소스 불명확");
  }
  if (transferFn !== null) {
    if (/training_items/.test(transferFn))
      g.fail("전이 출제 풀(buildTransferPool)이 training_items를 참조 — 분리 위반");
    else if (/transfer_items/.test(transferFn))
      g.ok("전이 풀은 transfer_items만 참조");
    else
      g.fail("전이 풀이 transfer_items를 참조하지 않음 — 출제 소스 불명확");
  }

  // 데이터 차원 보강: 후보 출제 풀의 전이 문장이 훈련 문장 집합과 분리됨.
  // 다파일 결합 후보(c2-1)는 출제 풀(get·phrasal-up)을 *통합한* 훈련/전이 집합 기준으로 본다 —
  // 한 세션이 두 파일을 섞어 내므로, 어느 파일의 전이도 어느 파일의 훈련에 새지 않아야 한다.
  try {
    const files = (QUIZ_CONTENT_FILES && QUIZ_CONTENT_FILES.length) ? QUIZ_CONTENT_FILES : ["have.json"];
    const trainSet = new Set();
    const transfers = []; // { id, norm, file }
    for (const cf of files) {
      const content = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, cf), "utf8"));
      for (const i of content.training_items || []) trainSet.add(normSentence(i.sentence));
      for (const x of content.transfer_items || []) transfers.push({ id: x.id, norm: normSentence(x.sentence), file: cf });
    }
    let leaked = 0;
    for (const x of transfers) {
      if (trainSet.has(x.norm)) { leaked++; g.fail("전이 문장이 훈련 풀에 존재: " + x.file + "/" + x.id); }
    }
    if (leaked === 0)
      g.ok("출제 풀(" + files.join("+") + "): 전이 문장 ∩ 훈련 문장 = 공집합");
  } catch (e) {
    g.fail("콘텐츠 분리 점검 실패: " + e.message);
  }
}

// 함수 본문을 중괄호 균형으로 추출 (function NAME( ... ) { ... })
function extractFnBody(src, name) {
  const sig = new RegExp("function\\s+" + name + "\\s*\\([^)]*\\)\\s*\\{");
  const m = sig.exec(src);
  if (!m) return null;
  let i = m.index + m[0].length;
  let depth = 1;
  const start = i;
  for (; i < src.length && depth > 0; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") depth--;
  }
  return src.slice(start, i - 1);
}

// ===================================================================
//  5. no-gamification
// ===================================================================
function checkNoGamification() {
  const g = group("no-gamification");
  const files = ["index.html", "app.js", "data.js", "styles.css"];
  // 식별자 경계로 매칭 (주석/문자열 포함 — 후보 코드 전체에 부재여야)
  const bannedLabel = ["point", "streak", "badge"];

  // 코퍼스 영어 어휘 carve-out: 출제 콘텐츠가 영어 단어로 banned word를 정당하게
  // 포함하면(예: get "your point"), data.js의 verbatim 임베드에 그 단어가 나타난다.
  // 이는 후보가 더한 게이미피케이션 식별자가 아니라 콘텐츠다 — data.js 한정으로 제외한다.
  // (c1-1·c1-2 코퍼스에는 point/streak/badge 영어 단어가 없어 carve-out이 발동하지 않음 → 회귀 0.
  //  app.js/styles.css/index.html은 carve-out 없음 — 후보가 더한 점수 로직은 그대로 잡힌다.)
  let corpusText = "";
  try {
    for (const cf of readJsonContentFiles()) corpusText += " " + JSON.stringify(cf.data);
  } catch (e) { /* 코퍼스 없으면 carve-out 없이 진행 */ }
  const corpusHas = {};
  for (const w of bannedLabel) corpusHas[w] = new RegExp("\\b" + w + "s?\\b", "i").test(corpusText);

  let hit = 0;
  for (const f of files) {
    const p = path.join(CAND_DIR, f);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, "utf8");
    // SVG 좌표 속성(points="...")은 게이미피케이션 식별자가 아니다 — 오탐 제외 (c1-2 회수)
    const scanned = src.replace(/\bpoints?\s*=\s*"/gi, 'svgcoords="');
    for (let bi = 0; bi < bannedLabel.length; bi++) {
      const word = bannedLabel[bi];
      // data.js에서 코퍼스 영어 어휘로 존재하는 banned word는 콘텐츠 — 제외.
      if (f === "data.js" && corpusHas[word]) continue;
      const re = new RegExp("\\b" + word + "s?\\b", "i");
      if (re.test(scanned)) {
        hit++;
        g.fail(f + ": 게이미피케이션 식별자 '" + word + "' 발견");
      }
    }
  }
  if (hit === 0) g.ok("point/streak/badge 식별자 부재 (4파일)");
}

// ===================================================================
//  6. choice-shuffle  (R1 / CONTRACT 8 — c1-2~)
// ===================================================================
// 후보 app.js에 보기 표시 순서 셔플 구현이 존재하는가.
//   - shuffleChoices 함수 정의 존재
//   - 그 함수가 실제로 호출(사용)됨
//   - 함수 본문에 무작위 셔플 알고리즘 흔적(Math.random) 존재
function checkChoiceShuffle() {
  const g = group("choice-shuffle");
  if (!APPLY_NEW_CHECKS) {
    g.ok("후보 '" + candidateId + "'는 교훈 회수 전 후보 — 셔플 검사 skip (c1-2~ 적용)");
    return;
  }
  const appPath = path.join(CAND_DIR, "app.js");
  if (!fs.existsSync(appPath)) { g.fail("app.js 없음"); return; }
  const src = fs.readFileSync(appPath, "utf8");

  const body = extractFnBody(src, "shuffleChoices");
  if (body === null) {
    g.fail("shuffleChoices 함수 정의를 찾지 못함 — 보기 셔플 미구현 (R1 위반)");
    return;
  }
  g.ok("shuffleChoices 함수 정의 존재");

  // 호출처: 정의를 제외한 곳에서 shuffleChoices( 가 등장하는지
  const calls = (src.match(/\bshuffleChoices\s*\(/g) || []).length;
  if (calls >= 2) g.ok("shuffleChoices 사용처 존재 (정의 외 호출 발견)");
  else g.fail("shuffleChoices가 정의만 있고 사용되지 않음 — 셔플이 화면에 적용 안 됨");

  if (/Math\.random\s*\(/.test(body)) g.ok("shuffleChoices 본문에 무작위 셔플(Math.random) 존재");
  else g.fail("shuffleChoices 본문에 무작위화 흔적(Math.random) 없음 — 고정 순서 의심");
}

// ===================================================================
//  7. label-fields  (G2 / CONTRACT 7 — c1-2~)
// ===================================================================
// 콘텐츠 전 문항에 subject_label/object_label 명시 필드 존재 +
// app.js가 문장에서 정규식으로 주어/대상을 파싱 추출하지 않음.
function checkLabelFields() {
  const g = group("label-fields");
  if (!APPLY_NEW_CHECKS) {
    g.ok("후보 '" + candidateId + "'는 교훈 회수 전 후보 — 라벨 검사 skip (c1-2~ 적용)");
    return;
  }
  // (a) 후보 출제 풀 콘텐츠의 전 문항에 명시 라벨 필드 존재.
  // 다파일 결합 후보는 출제 풀 전부(get·phrasal-up)를 검사한다.
  const cfs = (QUIZ_CONTENT_FILES && QUIZ_CONTENT_FILES.length) ? QUIZ_CONTENT_FILES : [];
  if (cfs.length === 0) { g.fail("후보 콘텐츠 매핑 미정의 — 라벨 검사 불가"); return; }
  let missing = 0;
  for (const cf of cfs) {
    let content;
    try { content = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, cf), "utf8")); }
    catch (e) { g.fail(cf + " 파싱 실패: " + e.message); continue; }
    for (const it of (content.training_items || []).concat(content.transfer_items || [])) {
      if (!it.subject_label || String(it.subject_label).trim() === "") {
        missing++; g.fail(cf + " item " + (it.id || "?") + ": subject_label 누락");
      }
      if (!it.object_label || String(it.object_label).trim() === "") {
        missing++; g.fail(cf + " item " + (it.id || "?") + ": object_label 누락");
      }
    }
  }
  if (missing === 0) g.ok(cfs.join("+") + ": 전 문항 subject_label/object_label 존재");

  // (b) app.js가 명시 라벨 필드를 실제로 사용
  const appPath = path.join(CAND_DIR, "app.js");
  if (!fs.existsSync(appPath)) { g.fail("app.js 없음"); return; }
  const src = fs.readFileSync(appPath, "utf8");
  if (/subject_label/.test(src) && /object_label/.test(src))
    g.ok("app.js가 subject_label/object_label 명시 필드를 참조");
  else
    g.fail("app.js가 명시 라벨 필드를 참조하지 않음 — 라벨 출처 불명확");

  // (c) 문장 파싱 라벨 추출 부재.
  // have|has|had|up 주변을 정규식으로 잘라 주어/대상을 뽑아내는 패턴을 금지.
  // 강조 하이라이트(highlightUp 등)는 라벨 추출이 아니므로 허용 — 캡처 그룹을
  // 라벨로 쓰는 추출형 패턴만 잡는다: \b(has|have|had|up)\b 를 포함하면서
  // sentence를 .match/.exec/.split 로 분해하는 코드.
  const parseSignals = [
    /\.match\([^)]*\b(has|have|had|having|up)\b[^)]*\)/i,
    /\.exec\([^)]*\b(has|have|had|having|up)\b[^)]*\)/i,
    /\b(has|have|had|having)\b\s*\)\s*\\s\+\s*\(\.\*\)/i, // c1-1식 ^(.+?)\b(have)\b\s+(.*)$ 류
    /\^\(\.\+\?\)\\b\(?(has|have|had|up)/i,                 // ^(.+?)\b(have... 패턴 문자열
    /function\s+deriveLabels/i,                            // c1-1의 파싱 라벨 추출 함수명
  ];
  let parseHit = null;
  for (const re of parseSignals) {
    const m = re.exec(src);
    if (m) { parseHit = m[0].slice(0, 60); break; }
  }
  // 추가: subject/object 변수를 sentence.match 결과에서 끌어오는 구조
  if (!parseHit) {
    const m = /(subj|subject|obj|object)\s*=\s*m\s*\?/i.exec(src);
    if (m) parseHit = m[0];
  }
  if (parseHit) g.fail("app.js에 문장 파싱 라벨 추출 흔적: '" + parseHit + "' (G2 위반)");
  else g.ok("app.js에 문장 파싱 라벨 추출 부재 (G2 충족)");
}

// ===================================================================
//  8. smoke
// ===================================================================
function checkSmoke() {
  const g = group("smoke");
  const dataPath = path.join(CAND_DIR, "data.js");
  if (!fs.existsSync(dataPath)) { g.fail("data.js 없음"); return; }

  // 평가해 점검 대상 CONTENT 객체(들)을 회수.
  // 단일 후보: window.CONTENT 하나. 결합 후보(c2-1): window.CONTENT_ALL 의 각 키.
  let win;
  try { win = evalDataWindow(dataPath); }
  catch (e) { g.fail("data.js 유효 JS 파싱 실패: " + e.message); return; }
  g.ok("data.js 유효 JS로 파싱됨");

  const targets = []; // { tag, content }
  if (IS_MULTI) {
    const all = win[CANDIDATE_MAP.embed];
    if (!all || typeof all !== "object") { g.fail("window." + CANDIDATE_MAP.embed + " 미정의"); return; }
    for (const k of Object.keys(CANDIDATE_MAP.keys)) {
      if (k in all) targets.push({ tag: CANDIDATE_MAP.embed + "['" + k + "']", content: all[k] });
      else g.fail(CANDIDATE_MAP.embed + "['" + k + "'] 없음");
    }
  } else {
    if (!win.CONTENT) { g.fail("window.CONTENT 미정의"); return; }
    targets.push({ tag: "CONTENT", content: win.CONTENT });
  }

  for (const { tag, content: C } of targets) smokeOne(g, tag, C);
}

// 단일 CONTENT 객체의 스키마 점검 (smoke 본체 — 다파일 후보는 키마다 호출).
function smokeOne(g, tag, C) {
  const reqTop = ["axis", "item", "senses", "training_items", "transfer_items"];
  for (const k of reqTop) {
    if (!(k in C)) g.fail(tag + "." + k + " 없음");
  }
  if (Array.isArray(C.senses) && C.senses.length >= 1) {
    let bad = 0;
    for (const s of C.senses) {
      for (const k of ["id", "ko", "image", "source_refs", "validation"]) {
        if (!(k in s)) { bad++; g.fail(tag + " sense " + (s.id || "?") + ": 필드 " + k + " 없음"); }
      }
    }
    if (bad === 0) g.ok(tag + " senses 스키마 일치 (" + C.senses.length + ")");
  } else {
    g.fail(tag + ".senses 비어있음");
  }

  const itemFields = ["id", "sense_id", "sentence", "prompt", "choices", "answer_index", "why_ko"];
  for (const [poolName, pool] of [["training_items", C.training_items], ["transfer_items", C.transfer_items]]) {
    if (!Array.isArray(pool) || pool.length === 0) { g.fail(tag + "." + poolName + " 비어있음"); continue; }
    let bad = 0;
    for (const it of pool) {
      for (const k of itemFields) {
        if (!(k in it)) { bad++; g.fail(tag + " " + poolName + " item " + (it.id || "?") + ": 필드 " + k + " 없음"); }
      }
      // R9/CONTRACT 4 — 유형 시스템. type 없으면 sense-choice(기존 코퍼스 호환).
      const itType = it.type || "sense-choice";
      if (!["sense-choice", "verb-choice", "sense-cloze"].includes(itType)) {
        bad++; g.fail(tag + " " + poolName + " item " + (it.id || "?") + ": 미등록 type '" + itType + "'");
      }
      if (!Array.isArray(it.choices) || it.choices.length < 2 || it.choices.length > 4) {
        bad++; g.fail(tag + " " + poolName + " item " + (it.id || "?") + ": choices 2~4개 아님");
      }
      if (typeof it.answer_index !== "number" || it.answer_index < 0 ||
          (Array.isArray(it.choices) && it.answer_index >= it.choices.length)) {
        bad++; g.fail(tag + " " + poolName + " item " + (it.id || "?") + ": answer_index 범위 밖");
      }
      // 빈칸 유형은 ___ 마커 필수 + 보기는 단어(공백 최소)
      if ((itType === "verb-choice" || itType === "sense-cloze") && !/___/.test(it.sentence || "")) {
        bad++; g.fail(tag + " " + poolName + " item " + (it.id || "?") + ": 빈칸 유형인데 ___ 마커 없음");
      }
      if (itType === "sense-choice" && /___/.test(it.sentence || "")) {
        bad++; g.fail(tag + " " + poolName + " item " + (it.id || "?") + ": sense-choice에 ___ 마커 — type 오분류");
      }
    }
    if (bad === 0) g.ok(tag + " " + poolName + " 스키마 일치 (" + pool.length + ")");
  }
}

// ===================================================================
//  적대적 콘텐츠 검수 게이트 — "출처 붙은 오개념" 2회 반복(c1-1 B1, c1-2 B2)으로 승격.
//  형식 검사: 후보 cycle-record에 독립 검수 기록 섹션이 존재해야 한다.
//  (검수의 '품질'은 기계가 못 본다 — 존재·형식만. 내용은 리뷰 권한.)
// ===================================================================
function checkAdversarialReview() {
  const g = group("adversarial-review");
  const rec = path.join(CAND_DIR, "cycle-record.md");
  if (!fs.existsSync(rec)) { g.fail("cycle-record.md 없음"); return; }
  const txt = fs.readFileSync(rec, "utf8");
  if (/적대적\s*검수/.test(txt) && /blocking/i.test(txt)) {
    g.ok("적대적 검수 기록 존재 (blocking 판정 포함)");
  } else {
    g.fail("cycle-record에 적대적 검수 기록 없음 — 콘텐츠 후보 탑재 차단 (CONTRACT 규칙 2)");
  }
}

// ===================================================================
//  9. sentence-ko  (CONTRACT 9 — c2-3~)
//  전 콘텐츠 문항(training + transfer)에 비지 않은 sentence_ko 한 줄이 존재해야 한다.
//  (앱의 "정답 후 표시"는 별도 G11/G12 관심사 — 여기서는 데이터 계약(존재)만 본다.)
// ===================================================================
function checkSentenceKo() {
  const g = group("sentence-ko");
  if (!APPLY_KO_CHECKS) {
    g.ok("후보 '" + candidateId + "'는 해석 회수 전 후보 — sentence_ko 검사 skip (c2-3~ 적용)");
    return;
  }
  let files;
  try { files = readJsonContentFiles(); }
  catch (e) { g.fail("콘텐츠 JSON 파싱 실패: " + e.message); return; }
  if (files.length === 0) { g.fail("assets/content/*.json 없음"); return; }

  let missing = 0, total = 0;
  for (const f of files) {
    const d = f.data;
    const pool = (Array.isArray(d.training_items) ? d.training_items : [])
      .concat(Array.isArray(d.transfer_items) ? d.transfer_items : []);
    for (const it of pool) {
      total++;
      if (!it.sentence_ko || String(it.sentence_ko).trim() === "") {
        missing++;
        g.fail(f.name + " item " + (it.id || "?") + ": sentence_ko 누락");
      }
    }
  }
  if (missing === 0) g.ok("전 콘텐츠 문항 sentence_ko 존재 (" + total + "문항, " + files.length + "파일)");
}

// ===================================================================
//  10. question-cue  (G11 — c2-3~)
//  질문 렌더 블록에 정답 단서(항목 알약/항목색/감각 라벨) 호출이 없어야 한다.
//  - 질문 함수(renderQuestion)와 피드백 함수가 분리돼 있어야 검사 가능 (그렇게 구조화함).
//  - renderQuestion 본문에 item-pill / itemColor( / senseLabel( 가 없는지 정적 확인.
//    (유형 알약 typeLabel/type-pill 은 허용 — 단서가 아니다.)
// ===================================================================
function checkQuestionCue() {
  const g = group("question-cue");
  if (!APPLY_KO_CHECKS) {
    g.ok("후보 '" + candidateId + "'는 단서 차단 회수 전 후보 — question-cue 검사 skip (c2-3~ 적용)");
    return;
  }
  const appPath = path.join(CAND_DIR, "app.js");
  if (!fs.existsSync(appPath)) { g.fail("app.js 없음"); return; }
  const src = fs.readFileSync(appPath, "utf8");

  // 질문 렌더 함수가 피드백 렌더와 분리돼 존재해야 한다.
  const qBody = extractFnBody(src, "renderQuestion");
  if (qBody === null) {
    g.fail("renderQuestion 함수를 찾지 못함 — 질문/피드백 분리 구조가 아님 (G11 정적 검사 불가)");
    return;
  }
  g.ok("renderQuestion 함수 분리 존재");

  // 피드백 함수도 분리돼 있어야(단서가 질문이 아니라 피드백에 산다는 것을 확인).
  const fbBody = extractFnBody(src, "renderFeedback");
  if (fbBody === null) {
    g.fail("renderFeedback 함수를 찾지 못함 — 단서(항목 알약·해석)가 질문과 섞였을 위험");
  } else {
    g.ok("renderFeedback 함수 분리 존재");
  }

  // 질문 블록에 금지 단서 호출이 없는지.
  const banned = [
    { re: /item-pill/, name: "item-pill (항목 알약)" },
    { re: /\bitemColor\s*\(/, name: "itemColor( (항목색)" },
    { re: /\bitemShort\s*\(/, name: "itemShort( (항목 약칭)" },
    { re: /\bsenseLabel\s*\(/, name: "senseLabel( (감각명)" },
    { re: /\bsenseColor\s*\(/, name: "senseColor( (감각색)" },
    { re: /sentence_ko/, name: "sentence_ko (정답 전 해석 — G12 위반)" },
  ];
  let hit = 0;
  for (const b of banned) {
    if (b.re.test(qBody)) { hit++; g.fail("renderQuestion 본문에 단서 호출: " + b.name + " (G11/G12 위반)"); }
  }
  if (hit === 0) g.ok("renderQuestion 본문에 단서 호출 부재 (항목/감각/색/해석 — G11·G12 충족)");

  // 단서가 실제로 피드백 경로에 *살아 있는지* 보강 확인 (분리만 하고 누락하면 의미 상실).
  if (fbBody !== null) {
    if (/item-pill/.test(fbBody)) g.ok("피드백 경로에 item-pill 존재 (항목 정보는 정답 후에)");
    else g.fail("renderFeedback에 item-pill 없음 — 항목 단서가 사라짐 (G11 의도와 어긋남)");
    if (/sentence_ko/.test(fbBody)) g.ok("피드백 경로에 sentence_ko 존재 (해석은 정답 후 — G12)");
    else g.fail("renderFeedback에 sentence_ko 없음 — 정답 후 해석 미표시 (G12 미구현)");
  }
}

// ===================================================================
//  실행
// ===================================================================
checkContentContract();
checkAdversarialReview();
checkCandidateFiles();
checkDataSync();
checkSeparationSurface();
checkNoGamification();
checkChoiceShuffle();
checkLabelFields();
checkSmoke();
checkSentenceKo();
checkQuestionCue();

console.log("");
console.log("get-the-feel verdict — candidate: " + candidateId);
console.log("=".repeat(52));
let allPass = true;
for (const g of groups) {
  const status = g.pass ? "PASS" : "FAIL";
  if (!g.pass) allPass = false;
  console.log("");
  console.log("[" + status + "] " + g.name);
  for (const line of g.lines) console.log(line);
}
console.log("");
console.log("=".repeat(52));
console.log(allPass ? "RESULT: ALL PASS" : "RESULT: FAIL");
process.exit(allPass ? 0 : 1);
