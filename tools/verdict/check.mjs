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
const SOURCES_MD = path.join(ROOT, "product", "sources.md");
const CAND_DIR = path.join(ROOT, "candidates", candidateId);

// 후보 ↔ 콘텐츠 파일 매핑. 후보마다 어떤 감각 항목을 싣는지 선언.
const CANDIDATE_CONTENT = {
  "c1-1": "have.json",
  "c1-2": "up.json",
};
// 매핑이 없으면 후보 폴더 data.js를 단일 권위로 삼되, data-sync는 fail 처리.
const CANDIDATE_CONTENT_FILE = CANDIDATE_CONTENT[candidateId] || null;

// 교훈(R1 셔플 / G2 명시 라벨) 회수 이후 후보에만 신규 검사 적용.
// c1-1은 회수 전 후보 — choice-shuffle·label-fields를 skip(ok)한다.
const NEW_CHECKS_FROM = new Set(["c1-2"]);
const APPLY_NEW_CHECKS = NEW_CHECKS_FROM.has(candidateId);

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
  if (sourceIds.size === 0) g.fail("product/sources.md에서 source_id를 읽지 못함");

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
    g.fail("candidates/" + candidateId + "/ 없음");
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
function checkDataSync() {
  const g = group("data-sync");
  const dataPath = path.join(CAND_DIR, "data.js");
  if (!CANDIDATE_CONTENT_FILE) {
    g.fail("후보 '" + candidateId + "'의 콘텐츠 매핑 미정의 (CANDIDATE_CONTENT에 추가 필요)");
    return;
  }
  const contentPath = path.join(CONTENT_DIR, CANDIDATE_CONTENT_FILE);
  if (!fs.existsSync(dataPath)) { g.fail("data.js 없음"); return; }
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

  // 데이터 차원 보강: 후보 콘텐츠의 전이 문장이 훈련 문장 집합과 분리됨
  try {
    const cf = CANDIDATE_CONTENT_FILE || "have.json";
    const content = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, cf), "utf8"));
    const trainSet = new Set((content.training_items || []).map((i) => normSentence(i.sentence)));
    let leaked = 0;
    for (const x of content.transfer_items || []) {
      if (trainSet.has(normSentence(x.sentence))) { leaked++; g.fail("전이 문장이 훈련에 존재: " + x.id); }
    }
    if (leaked === 0) g.ok("콘텐츠(" + cf + "): 전이 문장 ∩ 훈련 문장 = 공집합");
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
  let hit = 0;
  for (const f of files) {
    const p = path.join(CAND_DIR, f);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, "utf8");
    // SVG 좌표 속성(points="...")은 게이미피케이션 식별자가 아니다 — 오탐 제외 (c1-2 회수)
    const scanned = src.replace(/\bpoints?\s*=\s*"/gi, 'svgcoords="');
    for (let bi = 0; bi < bannedLabel.length; bi++) {
      const re = new RegExp("\\b" + bannedLabel[bi] + "s?\\b", "i");
      if (re.test(scanned)) {
        hit++;
        g.fail(f + ": 게이미피케이션 식별자 '" + bannedLabel[bi] + "' 발견");
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
  // (a) 후보 콘텐츠의 전 문항에 명시 라벨 필드 존재
  const cf = CANDIDATE_CONTENT_FILE;
  if (!cf) { g.fail("후보 콘텐츠 매핑 미정의 — 라벨 검사 불가"); return; }
  let content;
  try { content = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, cf), "utf8")); }
  catch (e) { g.fail(cf + " 파싱 실패: " + e.message); return; }
  let missing = 0;
  for (const it of (content.training_items || []).concat(content.transfer_items || [])) {
    if (!it.subject_label || String(it.subject_label).trim() === "") {
      missing++; g.fail(cf + " item " + (it.id || "?") + ": subject_label 누락");
    }
    if (!it.object_label || String(it.object_label).trim() === "") {
      missing++; g.fail(cf + " item " + (it.id || "?") + ": object_label 누락");
    }
  }
  if (missing === 0) g.ok(cf + ": 전 문항 subject_label/object_label 존재");

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
  let C;
  try { C = evalDataJs(dataPath); }
  catch (e) { g.fail("data.js 유효 JS 파싱 실패: " + e.message); return; }
  g.ok("data.js 유효 JS로 파싱됨");
  if (!C) { g.fail("window.CONTENT 미정의"); return; }

  // 스키마 일치 점검
  const reqTop = ["axis", "item", "senses", "training_items", "transfer_items"];
  for (const k of reqTop) {
    if (!(k in C)) g.fail("CONTENT." + k + " 없음");
  }
  if (Array.isArray(C.senses) && C.senses.length >= 1) {
    let bad = 0;
    for (const s of C.senses) {
      for (const k of ["id", "ko", "image", "source_refs", "validation"]) {
        if (!(k in s)) { bad++; g.fail("sense " + (s.id || "?") + ": 필드 " + k + " 없음"); }
      }
    }
    if (bad === 0) g.ok("senses 스키마 일치 (" + C.senses.length + ")");
  } else {
    g.fail("CONTENT.senses 비어있음");
  }

  const itemFields = ["id", "sense_id", "sentence", "prompt", "choices", "answer_index", "why_ko"];
  for (const [poolName, pool] of [["training_items", C.training_items], ["transfer_items", C.transfer_items]]) {
    if (!Array.isArray(pool) || pool.length === 0) { g.fail("CONTENT." + poolName + " 비어있음"); continue; }
    let bad = 0;
    for (const it of pool) {
      for (const k of itemFields) {
        if (!(k in it)) { bad++; g.fail(poolName + " item " + (it.id || "?") + ": 필드 " + k + " 없음"); }
      }
      // R9/CONTRACT 4 — 유형 시스템. type 없으면 sense-choice(기존 코퍼스 호환).
      const itType = it.type || "sense-choice";
      if (!["sense-choice", "verb-choice", "sense-cloze"].includes(itType)) {
        bad++; g.fail(poolName + " item " + (it.id || "?") + ": 미등록 type '" + itType + "'");
      }
      if (!Array.isArray(it.choices) || it.choices.length < 2 || it.choices.length > 4) {
        bad++; g.fail(poolName + " item " + (it.id || "?") + ": choices 2~4개 아님");
      }
      if (typeof it.answer_index !== "number" || it.answer_index < 0 ||
          (Array.isArray(it.choices) && it.answer_index >= it.choices.length)) {
        bad++; g.fail(poolName + " item " + (it.id || "?") + ": answer_index 범위 밖");
      }
      // 빈칸 유형은 ___ 마커 필수 + 보기는 단어(공백 최소)
      if ((itType === "verb-choice" || itType === "sense-cloze") && !/___/.test(it.sentence || "")) {
        bad++; g.fail(poolName + " item " + (it.id || "?") + ": 빈칸 유형인데 ___ 마커 없음");
      }
      if (itType === "sense-choice" && /___/.test(it.sentence || "")) {
        bad++; g.fail(poolName + " item " + (it.id || "?") + ": sense-choice에 ___ 마커 — type 오분류");
      }
    }
    if (bad === 0) g.ok(poolName + " 스키마 일치 (" + pool.length + ")");
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
