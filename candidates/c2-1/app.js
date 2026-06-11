/* get-the-feel · c2-1 — get + V+up 의 "결합" 익히기 (순수 JS, file:// 안전, 의존성 0)
 *
 * 이 후보의 검증 대상 = 결합 (C2 Convergence 첫 후보):
 *   ① 동사 감각끼리의 대비  — verb-choice (have=영역 안 정적 vs get=밖→안 도달)
 *   ② 동사 × 불변화사의 합성 — phrasal-up 합성 시각화 (get up = 도달 + 위로)
 *
 * 화면: intro → training(섞은 15문항) → summary → transfer(새 문장 9) → result → progress
 *
 * 데이터: window.CONTENT_ALL = { get, "phrasal-up", have, up }
 *   - 출제 풀  : get(.training/.transfer) + phrasal-up(.training/.transfer)
 *   - 참조 풀  : have / up 의 senses (verb-choice 동사 대비, 합성 해설에서 sense 인용)
 *
 * 유형별 렌더러 3종 (R9):
 *   sense-choice : 문장 + 그림 보기 3개 (c1-2 방식)
 *   verb-choice  : 빈칸 박스 + 동사 버튼 → 정답 후 완성 문장 + have/get 그림 나란히 대비
 *   sense-cloze  : 빈칸 + 불변화사 버튼 → 정답 후 up 메타포 + 오답 불변화사 why_ko
 *
 * 합성 시각화 (cross-axis, 이 후보 핵심 신규 UX):
 *   phrasal-up 정답 시 동사 감각 미니 그림 + "+" + up 감각 미니 그림 → 아래에 합쳐진 그림.
 *   캡션 "이미 아는 두 그림의 결합, 통암기 아님".
 *
 * G 규칙:
 *   R1 shuffleChoices — 보기 표시 순서 문항마다 셔플.
 *   G2 subject_label/object_label 명시 필드만 — 문장 파싱 금지.
 *   G4>G3 오답이면 반복 피로여도 미정착 1박자 우선.
 *   G5 생활 어휘 전면 (학술·방법론 용어 금지), 상태 정보는 ⓘ 뒤로.
 *   G6 진척 화면 "내 기록 (본인 학습용)" 라벨.
 *   R8 첫 세션은 추이 대신 "오늘 잡은 감각" 요약.
 *
 * 분리 계약 (separation-surface):
 *   buildTrainingPool 은 *.training_items 에서만, buildTransferPool 은 *.transfer_items 에서만.
 *   두 함수는 서로의 배열을 절대 참조하지 않는다.
 */
(function () {
  "use strict";

  var ALL = window.CONTENT_ALL;
  var GET = ALL.get;
  var PUP = ALL["phrasal-up"];
  var HAVE = ALL.have;
  var UP = ALL.up;

  var STORE_PREFIX = "gtf-c2-1-";
  var TRAIN_COUNT = 15;     // 혼합 세션 출제 수 (get 10 + phrasal-up 8 에서 15 선발)

  var app = document.getElementById("app");

  // ===================================================================
  //  sense 메타 — 생활 한국어 라벨 (G5: 학술 용어 금지)
  // ===================================================================
  // 출제 풀(get·phrasal-up)과 참조 풀(have·up)을 통합한 sense 사전.
  var SENSE_INDEX = {};
  function indexSenses(content) {
    if (!content || !content.senses) return;
    for (var i = 0; i < content.senses.length; i++) {
      SENSE_INDEX[content.senses[i].id] = content.senses[i];
    }
  }
  indexSenses(GET); indexSenses(PUP); indexSenses(HAVE); indexSenses(UP);

  function senseById(id) { return SENSE_INDEX[id] || null; }

  // 화면에 보이는 생활 라벨 — sense id별
  var SENSE_LABEL = {
    "get-arrival": "밖에서 안으로 도달",
    "get-state-change": "상태 자리로 옮겨 가 닿음",
    "compose-vertical": "동사 + 위로 (수직 합성)",
    "compose-completion": "동사 + 끝까지 (완료 합성)",
    "have-domain-location": "영역 안에 정적으로",
    "have-event-in-domain": "사건을 영역 안에서 겪음",
    "up-vertical": "아래에서 위로 (방향)",
    "up-completion": "끝까지 차올라 완료"
  };
  function senseLabel(id) { return SENSE_LABEL[id] || id; }

  // 색상 — get(도달) 계열 vs up(합성) 계열 vs have(정적) 대비를 색으로 구분
  var SENSE_COLOR = {
    "get-arrival": "#2f6db0",        // get — 블루(밖→안 이동)
    "get-state-change": "#2f6db0",
    "compose-vertical": "#3a6b5c",   // up-vertical — 그린
    "compose-completion": "#8a5a2f", // up-completion — 브론즈
    "have-domain-location": "#8a5a8f", // have — 정적 퍼플
    "have-event-in-domain": "#8a5a8f",
    "up-vertical": "#3a6b5c",
    "up-completion": "#8a5a2f"
  };
  function senseColor(id) { return SENSE_COLOR[id] || "#574f47"; }

  // 유형 라벨 (화면 표시 — G5 생활 어휘)
  function typeLabel(type) {
    if (type === "verb-choice") return "동사 고르기";
    if (type === "sense-cloze") return "불변화사 고르기";
    return "그림 고르기";
  }
  function itemType(item) { return item.type || "sense-choice"; }


  // ===================================================================
  //  유틸
  // ===================================================================
  // R1 — 보기 표시 순서 셔플 (Fisher–Yates). answer_index 고정 위치 차단.
  function shuffleChoices(item) {
    var pairs = [];
    for (var i = 0; i < item.choices.length; i++) {
      pairs.push({ text: item.choices[i], isAnswer: i === item.answer_index });
    }
    for (var j = pairs.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var t = pairs[j]; pairs[j] = pairs[k]; pairs[k] = t;
    }
    return pairs;
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pct(n, d) { return d === 0 ? 0 : Math.round((n / d) * 100); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // 문장 강조: 빈칸(___)은 빈칸 박스로, up 토큰은 강조 (시선 안내용, 라벨 추출 아님 — G2 무관)
  function renderSentence(item) {
    var safe = esc(item.sentence);
    // 빈칸 마커 → 빈칸 박스
    safe = safe.replace(/___/g, '<span class="blank-box" aria-label="빈칸"></span>');
    // up 강조 (빈칸 유형이 아닌 경우의 문자 up)
    safe = safe.replace(/\b(up)\b/i, '<span class="kw">$1</span>');
    return safe;
  }
  // 정답 후 빈칸을 채워 완성한 문장 (verb-choice / sense-cloze)
  function renderFilledSentence(item, answerWord) {
    var filled = item.sentence.replace(/___/g, answerWord);
    var safe = esc(filled);
    safe = safe.replace(new RegExp('\\b(' + esc(answerWord) + ')\\b'), '<span class="kw filled">$1</span>');
    return safe;
  }

  // ===================================================================
  //  localStorage (진척 기록) — prefix gtf-c2-1-
  // ===================================================================
  function loadHistory() {
    try {
      var raw = window.localStorage.getItem(STORE_PREFIX + "history");
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveSession(rec) {
    try {
      var hist = loadHistory();
      hist.push(rec);
      window.localStorage.setItem(STORE_PREFIX + "history", JSON.stringify(hist));
    } catch (e) { /* file:// 일부 환경 localStorage 비활성 — 진척만 비저장 */ }
  }
  function loadAutoNext() {
    try { return window.localStorage.getItem(STORE_PREFIX + "autonext") === "1"; }
    catch (e) { return false; }
  }
  function saveAutoNext(on) {
    try { window.localStorage.setItem(STORE_PREFIX + "autonext", on ? "1" : "0"); }
    catch (e) { /* 무시 */ }
  }

  // ===================================================================
  //  공간 메타포 SVG — 감각 전달 장치 (G1). 라벨은 명시 필드만 (G2).
  // ===================================================================

  // --- have: 칩이 원(영역) 안에 내려앉아 정적으로 자리한다 (정적 위치) ---
  // settle=true → 칩이 원 안 정착. settle=false → 칩이 원 위에 떠 있는 미정착(G4).
  function svgHave(subjectLabel, objectLabel, settle, compact) {
    var col = senseColor("have-domain-location");
    var cls = settle ? "viz-have settle" : "viz-have";
    var startStyle = settle ? "" : ' style="transform: translateY(-46px); opacity:0.35;"';
    var vb = compact ? '0 0 200 150' : '0 0 320 200';
    var cx = compact ? 100 : 160, cy = compact ? 80 : 104, rx = compact ? 72 : 96, ry = compact ? 50 : 64;
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="대상 칩이 영역 원 안에 정적으로 자리한 그림">' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#f3edf4" stroke="' + col + '" stroke-width="2"/>' +
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(subjectLabel) + ' 영역</text>' +
        '<g class="' + cls + '"' + startStyle + '>' +
          '<rect x="' + (cx - 52) + '" y="' + (cy - 16) + '" width="104" height="36" rx="9" fill="#ffffff" stroke="' + col + '" stroke-width="2"/>' +
          '<text x="' + cx + '" y="' + (cy + 7) + '" text-anchor="middle" font-size="12" fill="#232020" font-weight="600">' + esc(objectLabel) + '</text>' +
        '</g>' +
      '</svg>'
    );
  }

  // --- get: 원(영역) 밖에서 화살표를 따라 칩이 안으로 들어와 닿는다 (밖→안 도달) ---
  // get 메타포는 신규 설계. have(정적)와의 대비가 verb-choice 의 본진.
  // settle=true → 칩이 원 안 도착. settle=false → 칩이 원 밖(화살표 시작점) 미정착(G4).
  function svgGet(subjectLabel, objectLabel, settle, compact) {
    var col = senseColor("get-arrival");
    var cls = settle ? "viz-get settle" : "viz-get";
    // 미정착: 원 밖 왼쪽(화살표 시작)에서 출발. settle 시 원 안 중앙으로 이동.
    var startStyle = settle ? "" : ' style="transform: translateX(-104px); opacity:0.4;"';
    var vb = compact ? '0 0 200 150' : '0 0 320 200';
    var cx = compact ? 118 : 188, cy = compact ? 80 : 104, rx = compact ? 60 : 86, ry = compact ? 48 : 62;
    var arrowStartX = compact ? 8 : 18;
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="대상이 영역 원 밖에서 화살표를 따라 원 안으로 들어와 닿는 그림">' +
        // 영역 원
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#eef4fa" stroke="' + col + '" stroke-width="2"/>' +
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(subjectLabel) + ' 영역</text>' +
        // 밖→안 화살표 (도달의 경로)
        '<line x1="' + arrowStartX + '" y1="' + cy + '" x2="' + (cx - 6) + '" y2="' + cy + '" stroke="' + col + '" stroke-width="3" stroke-dasharray="4 4"/>' +
        '<path d="M' + cx + ' ' + cy + ' L' + (cx - 16) + ' ' + (cy - 8) + ' L' + (cx - 16) + ' ' + (cy + 8) + ' Z" fill="' + col + '"/>' +
        '<text x="' + (arrowStartX + 6) + '" y="' + (cy - 12) + '" font-size="10" fill="#8d867d">밖</text>' +
        // 들어오는 칩 — 미정착이면 원 밖에서 출발해 settle 시 원 안으로
        '<g class="' + cls + '"' + startStyle + '>' +
          '<rect x="' + (cx - 50) + '" y="' + (cy - 16) + '" width="100" height="36" rx="9" fill="#ffffff" stroke="' + col + '" stroke-width="2"/>' +
          '<text x="' + cx + '" y="' + (cy + 7) + '" text-anchor="middle" font-size="12" fill="#232020" font-weight="600">' + esc(objectLabel) + '</text>' +
        '</g>' +
      '</svg>'
    );
  }

  // --- up-vertical: 칩이 아래에서 위로 떠오른다 ---
  function svgUpVertical(_subjectLabel, objectLabel, settle, compact) {
    var col = senseColor("up-vertical");
    var cls = settle ? "viz-rise settle" : "viz-rise";
    var startStyle = settle ? "" : ' style="transform: translateY(56px); opacity:0.3;"';
    var vb = compact ? '0 0 200 150' : '0 0 320 200';
    var cx = compact ? 100 : 160;
    var topY = compact ? 22 : 38, botY = compact ? 128 : 170, chipY = compact ? 50 : 56;
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="대상이 세로 화살표를 따라 아래에서 위로 떠오르는 그림">' +
        '<line x1="' + cx + '" y1="' + botY + '" x2="' + cx + '" y2="' + (topY + 10) + '" stroke="' + col + '" stroke-width="3"/>' +
        '<path d="M' + cx + ' ' + topY + ' L' + (cx - 8) + ' ' + (topY + 18) + ' L' + (cx + 8) + ' ' + (topY + 18) + ' Z" fill="' + col + '"/>' +
        '<rect x="' + (cx - 60) + '" y="' + (botY + 2) + '" width="120" height="12" rx="4" fill="#ece7dd"/>' +
        '<g class="' + cls + '"' + startStyle + '>' +
          '<rect x="' + (cx - 52) + '" y="' + chipY + '" width="104" height="36" rx="9" fill="#ffffff" stroke="' + col + '" stroke-width="2"/>' +
          '<text x="' + cx + '" y="' + (chipY + 23) + '" text-anchor="middle" font-size="12" fill="#232020" font-weight="600">' + esc(objectLabel) + '</text>' +
        '</g>' +
      '</svg>'
    );
  }

  // --- up-completion: 그릇이 바닥부터 한계선까지 차오른다 ---
  function svgUpCompletion(_subjectLabel, objectLabel, settle, compact) {
    var col = senseColor("up-completion");
    var cls = settle ? "viz-fill settle" : "viz-fill";
    var rimCls = settle ? "viz-rim hit" : "viz-rim";
    var startStyle = settle ? "" : ' style="transform: translateY(60px);"';
    var vb = compact ? '0 0 200 150' : '0 0 320 200';
    var cx = compact ? 100 : 160;
    var rimY = compact ? 34 : 44, botY = compact ? 128 : 176;
    var wLeft = cx - 52, wWidth = 104, fillTop = rimY, fillH = botY - rimY;
    var clipId = "vc-" + Math.random().toString(36).slice(2, 8);
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="그릇이 바닥부터 차올라 가장자리 한계선에 닿는 그림">' +
        '<line x1="' + (cx - 64) + '" y1="' + rimY + '" x2="' + (cx + 64) + '" y2="' + rimY + '" stroke="' + col + '" stroke-width="2" stroke-dasharray="6 4" class="' + rimCls + '"/>' +
        '<path d="M' + (cx - 54) + ' ' + (rimY - 4) + ' L' + (cx - 54) + ' ' + (botY + 2) + ' L' + (cx + 54) + ' ' + (botY + 2) + ' L' + (cx + 54) + ' ' + (rimY - 4) + '" fill="none" stroke="#bdb6a8" stroke-width="3"/>' +
        '<clipPath id="' + clipId + '"><rect x="' + wLeft + '" y="' + fillTop + '" width="' + wWidth + '" height="' + fillH + '"/></clipPath>' +
        '<g clip-path="url(#' + clipId + ')"><g class="' + cls + '"' + startStyle + '>' +
          '<rect x="' + wLeft + '" y="' + fillTop + '" width="' + wWidth + '" height="' + fillH + '" fill="' + col + '" opacity="0.82"/>' +
        '</g></g>' +
        '<text x="' + cx + '" y="' + (fillTop + fillH / 2 + 4) + '" text-anchor="middle" font-size="12" fill="#ffffff" font-weight="700">' + esc(objectLabel) + '</text>' +
      '</svg>'
    );
  }

  // sense_id → 그 sense의 메타포 SVG. compact=작은 미니용.
  function svgForSense(senseId, subj, obj, settle, compact) {
    switch (senseId) {
      case "get-arrival":
      case "get-state-change":
        return svgGet(subj, obj, settle, compact);
      case "have-domain-location":
      case "have-event-in-domain":
        return svgHave(subj, obj, settle, compact);
      case "compose-completion":
      case "up-completion":
        return svgUpCompletion(subj, obj, settle, compact);
      case "compose-vertical":
      case "up-vertical":
      default:
        return svgUpVertical(subj, obj, settle, compact);
    }
  }

  // 단일 sense 메타포 박스 (sense-choice / sense-cloze 정답 후)
  function vizBox(senseId, subj, obj, settle, caption) {
    return '<div class="viz-wrap">' + svgForSense(senseId, subj, obj, settle) +
      '<div class="viz-caption">' + caption + '</div></div>';
  }

  // ===================================================================
  //  have/get 나란히 대비 (verb-choice 정답 후 — 동사 감각 대비)
  // ===================================================================
  function haveGetContrast(item) {
    var subj = item.subject_label;
    return (
      '<div class="contrast-row">' +
        '<div class="contrast-cell have">' +
          '<div class="contrast-head"><span class="dot" style="background:' + senseColor("have-domain-location") + '"></span>have — 이미 안</div>' +
          svgHave(subj, "obj", true, true) +
          '<div class="contrast-cap">원 안에 가만히 — 정적</div>' +
        '</div>' +
        '<div class="contrast-vs">vs</div>' +
        '<div class="contrast-cell get">' +
          '<div class="contrast-head"><span class="dot" style="background:' + senseColor("get-arrival") + '"></span>get — 들어오는 순간</div>' +
          svgGet(subj, "obj", true, true) +
          '<div class="contrast-cap">밖에서 안으로 도달 — 동적</div>' +
        '</div>' +
      '</div>'
    );
  }

  // ===================================================================
  //  합성 시각화 (cross-axis — 이 후보 핵심 신규 UX)
  // ===================================================================
  // phrasal-up 정답 시: [동사 감각 미니] + "+" + [up 감각 미니] → 아래에 합쳐진 그림.
  // 동사 감각: phrasal-up 문항은 V+up 이므로, 동사 쪽 그림은 "동작" 미니로 단순화하고
  // up 쪽은 sense_id(compose-vertical→up 수직 / compose-completion→up 완료)로 고른다.
  function compositionViz(item) {
    var senseId = item.sense_id;
    var subj = item.subject_label;
    var obj = item.object_label;
    var isVertical = senseId === "compose-vertical";

    // 왼쪽: 동사 감각 미니 — 동사의 "동작"을 단순 화살표/움직임으로.
    var verbMini =
      '<svg viewBox="0 0 140 120" role="img" aria-label="동사의 동작 그림">' +
        '<rect x="22" y="48" width="96" height="34" rx="9" fill="#ffffff" stroke="#574f47" stroke-width="2"/>' +
        '<text x="70" y="70" text-anchor="middle" font-size="12" fill="#232020" font-weight="600">' + esc(verbOf(item)) + '</text>' +
        '<path d="M40 96 H100" stroke="#8d867d" stroke-width="2.5"/>' +
        '<path d="M100 96 L92 91 L92 101 Z" fill="#8d867d"/>' +
        '<text x="70" y="30" text-anchor="middle" font-size="10" fill="#8d867d">동사의 동작</text>' +
      '</svg>';

    // 오른쪽: up 감각 미니 (수직 또는 완료)
    var upMini = isVertical
      ? svgUpVertical("바닥", "up", true, true).replace('viewBox="0 0 200 150"', 'viewBox="0 0 200 150"')
      : svgUpCompletion("내용", "up", true, true);

    // 아래: 합쳐진 그림 — get up이면 도달 화살표가 안으로 들어오며 동시에 위로.
    var combined = combinedSvg(item, isVertical);

    var capWord = isVertical ? "위로" : "끝까지";
    return (
      '<div class="compose-wrap">' +
        '<div class="compose-label">구동사 = 그림 두 개의 합</div>' +
        '<div class="compose-row">' +
          '<div class="compose-cell"><div class="compose-mini">' + verbMini + '</div>' +
            '<div class="compose-cap">' + esc(verbOf(item)) + ' (동작)</div></div>' +
          '<div class="compose-plus">+</div>' +
          '<div class="compose-cell"><div class="compose-mini">' + upMini + '</div>' +
            '<div class="compose-cap">up (' + capWord + ')</div></div>' +
          '<div class="compose-eq">=</div>' +
        '</div>' +
        '<div class="compose-result">' +
          '<div class="compose-mini big">' + combined + '</div>' +
          '<div class="compose-cap result-cap"><b>' + esc(verbWithUp(item)) + '</b> — ' + esc(subj) + ' / ' + esc(obj) + '</div>' +
        '</div>' +
        '<div class="compose-note">이미 아는 두 그림의 결합, 통암기 아님</div>' +
      '</div>'
    );
  }

  // 합쳐진 그림: 동사 동작(밖→안 또는 가로) + up 방향이 한 장면에 겹친다.
  function combinedSvg(item, isVertical) {
    if (isVertical) {
      // get up 류: 들어오는(가로) 도달 + 위로(세로)가 한 화살표 코너로 겹친다.
      return (
        '<svg viewBox="0 0 220 170" role="img" aria-label="동작이 진행되며 동시에 위로 향하는 합성 그림">' +
          '<rect x="10" y="120" width="200" height="12" rx="4" fill="#ece7dd"/>' +
          // 가로(동작) 화살표
          '<line x1="24" y1="126" x2="120" y2="126" stroke="#574f47" stroke-width="3"/>' +
          // 위로 꺾이는 화살표 (up)
          '<path d="M120 126 Q120 80 120 44" stroke="' + senseColor("compose-vertical") + '" stroke-width="3" fill="none"/>' +
          '<path d="M120 30 L112 50 L128 50 Z" fill="' + senseColor("compose-vertical") + '"/>' +
          // 올라간 칩
          '<rect x="68" y="44" width="104" height="34" rx="9" fill="#ffffff" stroke="' + senseColor("compose-vertical") + '" stroke-width="2"/>' +
          '<text x="120" y="66" text-anchor="middle" font-size="12" fill="#232020" font-weight="600">' + esc(item.object_label) + '</text>' +
          '<text x="60" y="150" text-anchor="middle" font-size="10" fill="#8d867d">동작 + 위로가 한 장면에</text>' +
        '</svg>'
      );
    }
    // 완료 합성: 동사 동작이 진행되다 그릇이 끝까지 차오른다.
    return (
      '<svg viewBox="0 0 220 170" role="img" aria-label="동작이 끝점까지 차올라 완료되는 합성 그림">' +
        '<line x1="44" y1="34" x2="176" y2="34" stroke="' + senseColor("compose-completion") + '" stroke-width="2" stroke-dasharray="6 4"/>' +
        '<text x="180" y="38" font-size="9" fill="' + senseColor("compose-completion") + '">끝</text>' +
        '<path d="M56 30 L56 140 L164 140 L164 30" fill="none" stroke="#bdb6a8" stroke-width="3"/>' +
        '<rect x="58" y="34" width="104" height="104" fill="' + senseColor("compose-completion") + '" opacity="0.82"/>' +
        '<text x="110" y="92" text-anchor="middle" font-size="12" fill="#ffffff" font-weight="700">' + esc(item.object_label) + '</text>' +
        '<text x="110" y="158" text-anchor="middle" font-size="10" fill="#8d867d">동작 + 끝까지가 한 장면에</text>' +
      '</svg>'
    );
  }

  // phrasal-up 문항에서 동사(첫 단어 또는 V+up의 V)만 뽑는다 — 표시용(라벨 추출 G2 무관: 시각화 캡션).
  // 빈칸 유형이면 정답 불변화사 앞 동사를, 평문이면 ... up 앞 동사를 찾는다. 실패 시 object_label.
  function verbOf(item) {
    var s = item.sentence;
    // "<verb> up" 또는 "<verb> ___" 패턴에서 verb 후보.
    var m = s.match(/([A-Za-z]+)\s+(?:up\b|___)/);
    if (m) return m[1].toLowerCase();
    // get up / sit up 같이 분리된 경우 — object_label 의존
    return (item.object_label || "동작").split(/\s+/)[0];
  }
  function verbWithUp(item) {
    return verbOf(item) + " up";
  }

  // ===================================================================
  //  출제 풀 — 분리 계약의 핵심 (separation-surface).
  // ===================================================================
  // 혼합 훈련 풀: get.training_items + phrasal-up.training_items 를 한 큐로 섞어 15문항.
  // 세 유형(sense-choice/verb-choice/sense-cloze)이 반드시 모두 포함되게 보정.
  // transfer_items 는 절대 참조하지 않는다.
  function buildTrainingPool() {
    var get = GET.training_items;
    var pup = PUP.training_items;
    var merged = get.concat(pup);            // get 10 + phrasal-up 8 = 18
    var shuffled = shuffle(merged);
    return ensureTypeCoverage(shuffled, merged, TRAIN_COUNT);
  }
  // 새 문장 풀: get.transfer_items + phrasal-up.transfer_items 전부 (5 + 4 = 9).
  // training_items 는 절대 참조하지 않는다.
  function buildTransferPool() {
    var get = GET.transfer_items;
    var pup = PUP.transfer_items;
    return shuffle(get.concat(pup));
  }

  // 유형 혼합 보장: count개를 뽑되 sense-choice/verb-choice/sense-cloze 가 모두 1개 이상이도록 보정.
  function ensureTypeCoverage(picked, fullPool, count) {
    var sel = picked.slice(0, count);
    var need = ["sense-choice", "verb-choice", "sense-cloze"];
    for (var t = 0; t < need.length; t++) {
      var has = sel.some(function (it) { return itemType(it) === need[t]; });
      if (has) continue;
      // 풀에서 해당 유형 하나를 찾아, sel 안에서 그 유형이 가장 흔한(또는 임의) 자리를 교체.
      var cand = fullPool.find(function (it) {
        return itemType(it) === need[t] && sel.indexOf(it) === -1;
      });
      if (!cand) continue;
      // 교체 대상: 현재 sel에서 2개 이상인 유형의 마지막 항목.
      var counts = {};
      sel.forEach(function (it) { counts[itemType(it)] = (counts[itemType(it)] || 0) + 1; });
      var replaceIdx = -1;
      for (var i = sel.length - 1; i >= 0; i--) {
        if (counts[itemType(sel[i])] > 1) { replaceIdx = i; counts[itemType(sel[i])]--; break; }
      }
      if (replaceIdx === -1) replaceIdx = sel.length - 1;
      sel[replaceIdx] = cand;
    }
    return sel;
  }

  // ===================================================================
  //  세션 상태 머신
  // ===================================================================
  var state = null;

  function startTraining() {
    state = { mode: "training", items: buildTrainingPool(), idx: 0, results: [], senseSeen: {} };
    renderQuestion();
  }
  function startTransfer() {
    state = { mode: "transfer", items: buildTransferPool(), idx: 0, results: [], senseSeen: {} };
    renderQuestion();
  }

  // ===================================================================
  //  인트로 — 결합 약속 (30초 이해) + 유형 3종 아이콘 미리보기
  // ===================================================================
  function renderIntro() {
    state = null;
    app.innerHTML =
      '<div class="card intro">' +
        '<p class="kicker">두 그림의 결합으로</p>' +
        '<h1>have는 ‘이미 안’, get은 ‘들어오는 순간’ —<br>그리고 get up은 그 둘의 합입니다</h1>' +
        '<p class="promise">have를 ‘가지다’, get을 ‘얻다’로 따로 외우면 둘이 어떻게 ' +
          '갈리는지 안 보여요. <b>have = 원 안에 가만히, get = 밖에서 안으로 도달</b> — 한 그림 차이예요.</p>' +
        '<p class="promise">구동사는 더 그래요. <b>get up = 도달(get) + 위로(up)</b>. ' +
          '통째로 외울 숙어가 아니라 <b>이미 아는 두 그림의 합</b>입니다.</p>' +
        '<div class="type-preview">' +
          '<div class="type-chip"><span class="type-ico">' + miniIconSenseChoice() + '</span>' +
            '<span class="type-name">그림 고르기</span><span class="type-desc">단어가 그리는 그림</span></div>' +
          '<div class="type-chip"><span class="type-ico">' + miniIconVerbChoice() + '</span>' +
            '<span class="type-name">동사 고르기</span><span class="type-desc">have / get 감각 대비</span></div>' +
          '<div class="type-chip"><span class="type-ico">' + miniIconCloze() + '</span>' +
            '<span class="type-name">불변화사 고르기</span><span class="type-desc">합성 그림으로</span></div>' +
        '</div>' +
        '<p class="position-note">get(동사)과 V+up(구동사)을 <b>한 세션에서 섞어</b> 익힙니다 — 결합이 실전에서 작동하는지 봅니다.</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="go-train">그림으로 익히기</button>' +
          '<button class="btn secondary" id="go-progress">내 기록 보기</button>' +
        '</div>' +
      '</div>';
    document.getElementById("go-train").onclick = startTraining;
    document.getElementById("go-progress").onclick = renderProgress;
    window.scrollTo(0, 0);
  }

  // 유형 3종 아이콘 미리보기 (단순 SVG)
  function miniIconSenseChoice() {
    return '<svg viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="15" ry="11" fill="none" stroke="#8a5a8f" stroke-width="2"/><rect x="12" y="15" width="16" height="10" rx="3" fill="#8a5a8f" opacity="0.3"/></svg>';
  }
  function miniIconVerbChoice() {
    return '<svg viewBox="0 0 40 40"><line x1="4" y1="20" x2="24" y2="20" stroke="#2f6db0" stroke-width="2.5" stroke-dasharray="3 3"/><path d="M30 20 L22 15 L22 25 Z" fill="#2f6db0"/><circle cx="32" cy="20" r="6" fill="none" stroke="#2f6db0" stroke-width="2"/></svg>';
  }
  function miniIconCloze() {
    return '<svg viewBox="0 0 40 40"><line x1="20" y1="32" x2="20" y2="10" stroke="#3a6b5c" stroke-width="2.5"/><path d="M20 6 L15 16 L25 16 Z" fill="#3a6b5c"/></svg>';
  }

  // ===================================================================
  //  문항 렌더 — 유형별 분기
  // ===================================================================
  function renderQuestion() {
    var item = state.items[state.idx];
    var total = state.items.length;
    var n = state.idx + 1;
    var isTransfer = state.mode === "transfer";
    var fill = pct(state.idx, total);
    var type = itemType(item);

    var shuffled = shuffleChoices(item);
    state.currentChoices = shuffled;

    var html =
      '<div class="card question">' +
        (isTransfer
          ? '<span class="new-flag">새 문장 테스트 — 익히기에 없던 문장이에요</span>'
          : "") +
        '<div class="progress-head">' +
          '<span>' + (isTransfer ? "새 문장" : "익히기") + " " + n + " / " + total + '</span>' +
          '<span class="type-pill ' + type + '">' + typeLabel(type) + '</span>' +
        '</div>' +
        '<div class="progress-track"><div class="progress-fill" style="width:' + fill + '%"></div></div>' +
        '<p class="sentence ' + (type === "verb-choice" || type === "sense-cloze" ? "has-blank" : "") + '">' +
          renderSentence(item) + '</p>' +
        '<p class="prompt">' + esc(item.prompt) + '</p>' +
        '<ul class="choices ' + (type === "verb-choice" || type === "sense-cloze" ? "word-choices" : "") + '" id="choices">';

    var tags = ["a", "b", "c", "d"];
    for (var i = 0; i < shuffled.length; i++) {
      var isWord = (type === "verb-choice" || type === "sense-cloze");
      html +=
        '<li><button class="choice ' + (isWord ? "word" : "") + '" data-i="' + i + '">' +
          (isWord
            ? '<span class="ctext word-text">' + esc(shuffled[i].text) + '</span>'
            : '<span class="tag">' + tags[i] + '</span><span class="ctext">' + esc(shuffled[i].text) + '</span>') +
        '</button></li>';
    }
    html += "</ul><div id=\"feedback\"></div></div>";

    app.innerHTML = html;

    var buttons = app.querySelectorAll(".choice");
    for (var b = 0; b < buttons.length; b++) {
      buttons[b].onclick = function () {
        onAnswer(parseInt(this.getAttribute("data-i"), 10));
      };
    }
  }

  function onAnswer(displayIdx) {
    var item = state.items[state.idx];
    var type = itemType(item);
    var picked = state.currentChoices[displayIdx];
    var correct = !!(picked && picked.isAnswer);
    var answerWord = item.choices[item.answer_index];
    state.results.push({ id: item.id, sense_id: item.sense_id, type: type, correct: correct });

    // G3 — 같은 sense 반복 횟수 (3회째부터 풀 애니메이션 생략)
    state.senseSeen[item.sense_id] = (state.senseSeen[item.sense_id] || 0) + 1;
    var fatigued = state.senseSeen[item.sense_id] >= 3;

    // 보기 잠그고 정/오 표시
    var buttons = app.querySelectorAll(".choice");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      var di = parseInt(buttons[i].getAttribute("data-i"), 10);
      if (state.currentChoices[di] && state.currentChoices[di].isAnswer) buttons[i].classList.add("correct");
      else if (di === displayIdx) buttons[i].classList.add("wrong");
    }

    var isLast = state.idx + 1 >= state.items.length;
    var autoNext = loadAutoNext();

    var fb = document.getElementById("feedback");
    fb.innerHTML =
      '<div class="feedback">' +
        '<p class="verdict ' + (correct ? "ok" : "no") + '">' +
          (correct ? "맞았어요 — 이 그림이에요." : "다시 — 이 그림을 보세요.") + '</p>' +
        // 빈칸 유형이면 채워진 완성 문장
        ((type === "verb-choice" || type === "sense-cloze")
          ? '<p class="filled-sentence">' + renderFilledSentence(item, answerWord) + '</p>'
          : "") +
        '<p class="why">' + esc(item.why_ko) + '</p>' +
        // 유형별 시각화 (G4 우선: 오답이면 미정착 1박자 — settle 인자에 반영)
        feedbackViz(item, type, correct, fatigued) +
        boundaryHtml(item) +
        '<label class="autonext-toggle">' +
          '<input type="checkbox" id="autonext"' + (autoNext ? " checked" : "") + ' /> ' +
          '맞히면 다음 문항으로 자동 넘기기' +
        '</label>' +
        '<div class="btn-row">' +
          '<button class="btn" id="next-q">' + (isLast ? "결과 보기" : "다음 문항") + '</button>' +
        '</div>' +
      '</div>';

    document.getElementById("autonext").onchange = function () { saveAutoNext(this.checked); };
    document.getElementById("next-q").onclick = nextQuestion;

    // ---- 메타포 애니메이션 구동 (G4 > G3) ----
    if (fatigued && correct) {
      // G3 — 반복 피로 + 정답: 풀 애니메이션 생략 (이미 settle 상태로 그림).
    } else if (correct) {
      triggerSettle(fb);
    } else {
      // G4 — 오답이면 반복 피로여도 미정착 1박자 우선.
      window.setTimeout(function () { triggerSettle(fb); }, 1000);
    }

    if (autoNext && correct) {
      window.setTimeout(function () {
        var btn = document.getElementById("next-q");
        if (btn) nextQuestion();
      }, 1300);
    }
  }

  // 유형별 정답 후 시각화.
  //   sense-choice : 단일 sense 메타포 박스.
  //   verb-choice  : have/get 두 그림 나란히 대비.
  //   sense-cloze  : up 메타포 박스. + phrasal-up 이면 합성 시각화도 함께.
  // settle 규칙: 오답이면 미정착(false)으로 그려 1박자 뒤 triggerSettle 이 정착시킨다 (G4).
  function feedbackViz(item, type, correct, fatigued) {
    // 정답이지만 비-피로면 미정착(false)에서 출발해 애니메이션으로 정착. 피로+정답이면 즉시 settle.
    // G4 > G3: 오답이면 피로여도 미정착 1박자.
    var startSettle = (fatigued && correct) ? true : false;
    var subj = item.subject_label, obj = item.object_label;

    if (type === "verb-choice") {
      // have/get 동사 대비 — 두 그림은 정적 비교라 항상 정착 상태로 나란히.
      return '<div class="viz-wrap contrast">' + haveGetContrast(item) +
        '<div class="viz-caption">같은 자리에 <b>have</b>와 <b>get</b> — 한쪽은 정적, 한쪽은 도달</div></div>';
    }

    if (type === "sense-cloze") {
      var isPup = item.sense_id === "compose-vertical" || item.sense_id === "compose-completion";
      var capWord = (item.sense_id === "compose-completion" || item.sense_id === "up-completion")
        ? "끝까지 차올라 완료" : "아래에서 위로";
      var box = vizBox(item.sense_id, subj, obj, startSettle, "이 불변화사가 그리는 그림 — " + capWord);
      // phrasal-up 의 cloze 면 합성 시각화도 (cross-axis).
      return box + (isPup ? compositionViz(item) : "");
    }

    // sense-choice
    // phrasal-up 의 sense-choice(합성 sense)면 합성 시각화를 본체로.
    if (item.sense_id === "compose-vertical" || item.sense_id === "compose-completion") {
      return compositionViz(item);
    }
    var cap = senseLabel(item.sense_id);
    return vizBox(item.sense_id, subj, obj, startSettle, "이 그림 — " + cap);
  }

  function boundaryHtml(item) {
    var sense = senseById(item.sense_id);
    if (!sense || !sense.boundary_ko) return "";
    var head = "감각 경계:";
    if (item.sense_id === "compose-vertical" || item.sense_id === "up-vertical") head = "down이 서는가:";
    else if (item.sense_id === "compose-completion" || item.sense_id === "up-completion") head = "down이 안 서는 이유:";
    else if (item.sense_id === "have-domain-location" || item.sense_id === "have-event-in-domain") head = "진행형이 되는가:";
    else if (item.sense_id === "get-arrival" || item.sense_id === "get-state-change") head = "have와 갈리는 자리:";
    return '<p class="boundary"><b>' + head + '</b> ' + esc(sense.boundary_ko) + '</p>';
  }

  // 미정착 그림을 정착 상태로 전환
  function triggerSettle(scope) {
    var nodes = scope.querySelectorAll(".viz-have, .viz-get, .viz-rise, .viz-fill");
    var rims = scope.querySelectorAll(".viz-rim");
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].classList.add("settle");
          nodes[i].removeAttribute("style");
        }
        for (var r = 0; r < rims.length; r++) rims[r].classList.add("hit");
      });
    });
  }

  function nextQuestion() {
    state.idx++;
    if (state.idx < state.items.length) {
      renderQuestion();
      window.scrollTo(0, 0);
    } else {
      finishSession();
    }
  }

  // ===================================================================
  //  집계 — 유형별 정답률 분리 (요구 6). verb-choice = "꺼내 쓰는 힘".
  // ===================================================================
  function scoreByType(results) {
    var out = { "sense-choice": { c: 0, t: 0 }, "verb-choice": { c: 0, t: 0 }, "sense-cloze": { c: 0, t: 0 } };
    for (var i = 0; i < results.length; i++) {
      var ty = results[i].type || "sense-choice";
      if (!out[ty]) out[ty] = { c: 0, t: 0 };
      out[ty].t++;
      if (results[i].correct) out[ty].c++;
    }
    return out;
  }
  function totalScore(results) {
    var c = 0;
    for (var i = 0; i < results.length; i++) if (results[i].correct) c++;
    return { correct: c, total: results.length };
  }

  function finishSession() {
    var sc = totalScore(state.results);
    var byType = scoreByType(state.results);

    if (state.mode === "training") {
      window.__gtf_pending = {
        date: new Date().toISOString(),
        training: { results: state.results, score: sc, byType: byType }
      };
      renderTrainingSummary(sc, byType);
    } else {
      var pending = window.__gtf_pending || { date: new Date().toISOString(), training: null };
      pending.transfer = { results: state.results, score: sc, byType: byType };
      saveSession(pending);
      window.__gtf_pending = null;
      renderTransferResult(sc, byType, pending.training);
    }
  }

  // 유형별 분리 카드 — verb-choice 는 "꺼내 쓰는 힘" 라벨 (능동 인출).
  var TYPE_DISPLAY = {
    "sense-choice": { name: "그림 알아보기", sub: "알아보는 힘" },
    "verb-choice": { name: "동사 꺼내 쓰기", sub: "꺼내 쓰는 힘 (능동 인출)" },
    "sense-cloze": { name: "불변화사 채우기", sub: "합성 감각" }
  };
  function typeBreakdownHtml(byType) {
    var order = ["sense-choice", "verb-choice", "sense-cloze"];
    var h = "";
    for (var i = 0; i < order.length; i++) {
      var ty = order[i];
      var d = byType[ty] || { c: 0, t: 0 };
      if (d.t === 0) continue;
      var disp = TYPE_DISPLAY[ty];
      h += '<div class="split-cell ' + (ty === "verb-choice" ? "highlight" : "") + '">' +
        '<div class="label">' + disp.name + '</div>' +
        '<div class="val">' + d.c + " / " + d.t + '</div>' +
        '<div class="small muted">' + pct(d.c, d.t) + '% · ' + disp.sub + '</div>' +
      '</div>';
    }
    return h;
  }

  function renderTrainingSummary(sc, byType) {
    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">익히기 끝</p>' +
        '<h2>오늘 익힌 결과</h2>' +
        '<div class="score-big">' + pct(sc.correct, sc.total) + '%</div>' +
        '<div class="score-sub">' + sc.correct + " / " + sc.total + " 문항 — get과 V+up을 섞어서</div>" +
        '<h3>유형별</h3>' +
        '<div class="split-row triple">' + typeBreakdownHtml(byType) + '</div>' +
        '<p class="muted">‘동사 꺼내 쓰기’는 빈칸에 직접 동사를 골라 넣는 <b>능동 인출</b>이라, ' +
          '고르기보다 한 걸음 더 쓰기에 가까워요.</p>' +
        '<p class="muted">감각이 잡혔는지 익히기에 없던 <b>새 문장</b>으로 확인해 보세요.</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="go-transfer">새 문장 테스트</button>' +
          '<button class="btn secondary" id="go-home">처음으로</button>' +
        '</div>' +
      '</div>';
    document.getElementById("go-transfer").onclick = startTransfer;
    document.getElementById("go-home").onclick = renderIntro;
    window.scrollTo(0, 0);
  }

  function renderTransferResult(sc, byType, training) {
    var trainPct = training ? pct(training.score.correct, training.score.total) : null;
    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">새 문장 테스트 끝</p>' +
        '<h2>결과</h2>' +
        '<div class="split-row">' +
          '<div class="split-cell">' +
            '<div class="label">익히기</div>' +
            '<div class="val">' + (trainPct === null ? "—" : trainPct + "%") + '</div>' +
            '<div class="small muted">' + (training ? training.score.correct + " / " + training.score.total : "기록 없음") + '</div>' +
          '</div>' +
          '<div class="split-cell">' +
            '<div class="label">새 문장</div>' +
            '<div class="val">' + pct(sc.correct, sc.total) + '%</div>' +
            '<div class="small muted">' + sc.correct + " / " + sc.total + '</div>' +
          '</div>' +
        '</div>' +
        '<h3>새 문장 — 유형별</h3>' +
        '<div class="split-row triple">' + typeBreakdownHtml(byType) + '</div>' +
        '<p class="honesty">이 점수는 ‘<b>알아보는 힘</b>’이에요 — 고르기를 잘해도 ' +
          '직접 말하기·쓰기는 따로 늘어요. (‘동사 꺼내 쓰기’는 그 중간 다리예요.)</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="go-progress2">내 기록 보기</button>' +
          '<button class="btn secondary" id="go-home2">처음으로</button>' +
        '</div>' +
      '</div>';
    document.getElementById("go-progress2").onclick = renderProgress;
    document.getElementById("go-home2").onclick = renderIntro;
    window.scrollTo(0, 0);
  }

  // ===================================================================
  //  진척 화면 — R8: 1세션이면 추이 대신 "오늘 잡은 감각" 요약. G6 정직 라벨.
  // ===================================================================
  function renderProgress() {
    state = null;
    var hist = loadHistory();
    var body;
    if (hist.length === 0) {
      body = '<p class="empty-note">아직 기록이 없어요. 한 번 익히고 새 문장 테스트까지 마치면 여기에 쌓입니다.</p>';
    } else if (hist.length === 1) {
      body = firstSessionSummary(hist[0]);
    } else {
      body =
        trendBlock("익히기 추이", hist, "train") +
        '<div class="section-gap"></div>' +
        trendBlock("새 문장 추이", hist, "transfer") +
        '<div class="section-gap"></div>' +
        typeRecentBlock(hist);
    }
    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">내 기록 (본인 학습용)</p>' +
        '<h2>내가 잡아 가는 감각</h2>' +
        body +
        '<p class="honesty">이 기록은 ‘알아보는 힘’이 자라는 모습이에요 — 말하기·쓰기 실력을 그대로 증명하지는 않아요.</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="pg-train">그림으로 익히기</button>' +
          '<button class="btn secondary" id="pg-home">처음으로</button>' +
        '</div>' +
      '</div>';
    document.getElementById("pg-train").onclick = startTraining;
    document.getElementById("pg-home").onclick = renderIntro;
    window.scrollTo(0, 0);
  }

  // R8 — 첫 세션 요약: 유형별 정답 수 + 결합 그림 한 번 더.
  function firstSessionSummary(sess) {
    var combined = scoreByType((sess.training ? sess.training.results : []).concat(sess.transfer ? sess.transfer.results : []));
    var order = ["sense-choice", "verb-choice", "sense-cloze"];
    var cards = "";
    for (var i = 0; i < order.length; i++) {
      var ty = order[i];
      var d = combined[ty] || { c: 0, t: 0 };
      if (d.t === 0) continue;
      var disp = TYPE_DISPLAY[ty];
      // 유형 대표 미니 그림
      var mini;
      if (ty === "verb-choice") mini = svgGet("내", "도달", true, true);
      else if (ty === "sense-cloze") mini = svgUpVertical("바닥", "up", true, true);
      else mini = svgHave("영역", "정착", true, true);
      cards += '<div class="today-cell">' +
        '<div class="today-head"><b>' + disp.name + '</b> — ' + d.c + ' / ' + d.t + ' 맞힘</div>' +
        '<div class="viz-wrap">' + mini + '</div>' +
      '</div>';
    }
    return '<p class="muted">오늘 처음이라 추이 대신 ‘오늘 잡은 감각’을 보여 드려요. 두 번째부터는 추이가 그려집니다.</p>' +
      '<div class="today-grid">' + cards + '</div>';
  }

  function trendBlock(title, hist, kind) {
    var cols = "", any = false;
    for (var i = 0; i < hist.length; i++) {
      var slot = kind === "train" ? hist[i].training : hist[i].transfer;
      if (!slot || !slot.score || slot.score.total === 0) {
        cols += '<div class="bar-col"><div class="bar ' + kind + '" style="height:0%"></div><div class="bar-x">' + (i + 1) + '</div></div>';
        continue;
      }
      any = true;
      var p = pct(slot.score.correct, slot.score.total);
      cols += '<div class="bar-col"><div class="bar ' + kind + '" style="height:' + p + '%"><span class="bar-val">' + p + '%</span></div><div class="bar-x">' + (i + 1) + '</div></div>';
    }
    if (!any) return '<div class="chart-block"><h3>' + esc(title) + '</h3><p class="empty-note small">아직 이 기록이 없어요.</p></div>';
    return '<div class="chart-block"><h3>' + esc(title) + '</h3><div class="bars">' + cols + '</div><div class="small muted" style="margin-top:8px;">가로축: 세션 순서</div></div>';
  }

  // 유형별 최근 세션 정답률 (분리 표시 — verb-choice 강조).
  function typeRecentBlock(hist) {
    var order = ["sense-choice", "verb-choice", "sense-cloze"];
    var rows = "";
    for (var o = 0; o < order.length; o++) {
      var ty = order[o];
      var disp = TYPE_DISPLAY[ty];
      var lastTrain = null, lastTransfer = null;
      for (var i = hist.length - 1; i >= 0; i--) {
        if (lastTrain === null && hist[i].training && hist[i].training.byType && hist[i].training.byType[ty] && hist[i].training.byType[ty].t > 0) {
          var t = hist[i].training.byType[ty]; lastTrain = pct(t.c, t.t);
        }
        if (lastTransfer === null && hist[i].transfer && hist[i].transfer.byType && hist[i].transfer.byType[ty] && hist[i].transfer.byType[ty].t > 0) {
          var x = hist[i].transfer.byType[ty]; lastTransfer = pct(x.c, x.t);
        }
      }
      rows += '<div class="split-cell ' + (ty === "verb-choice" ? "highlight" : "") + '">' +
        '<div class="label">' + disp.name + '</div>' +
        '<div class="small" style="margin-top:8px;">최근 익히기 ' + (lastTrain === null ? "—" : "<b>" + lastTrain + "%</b>") + '</div>' +
        '<div class="small">최근 새 문장 ' + (lastTransfer === null ? "—" : "<b>" + lastTransfer + "%</b>") + '</div>' +
        '<div class="small muted">' + disp.sub + '</div>' +
      '</div>';
    }
    return '<div class="chart-block"><h3>유형별 (최근 세션)</h3><div class="split-row triple">' + rows + '</div></div>';
  }

  // ===================================================================
  //  ⓘ 정보 패널 토글 (G5)
  // ===================================================================
  (function wireInfoPanel() {
    var btn = document.getElementById("info-btn");
    var panel = document.getElementById("info-panel");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var open = panel.hasAttribute("hidden");
      if (open) { panel.removeAttribute("hidden"); btn.setAttribute("aria-expanded", "true"); }
      else { panel.setAttribute("hidden", ""); btn.setAttribute("aria-expanded", "false"); }
    });
  })();

  // ===================================================================
  //  부팅
  // ===================================================================
  if (!ALL || !GET || !PUP || !GET.training_items || !PUP.training_items) {
    app.innerHTML = '<div class="card"><h2>콘텐츠를 불러오지 못했어요</h2>' +
      '<p class="muted">data.js가 같은 폴더에 있는지 확인해 주세요.</p></div>';
    return;
  }
  renderIntro();
})();
