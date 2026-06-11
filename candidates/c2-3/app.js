/* get-the-feel · c2-3 — 8개 감각, 120문장. 정답 후 해석(G12)이 이 후보의 신규 검증 대상.
 *
 * 계승 (c2-2 일일 공급 구조 — 코드는 fresh, 교훈만 이어받음):
 *   ① 매 세션 15문항을 전체 훈련 풀에서 *미출제 우선*으로 공급 (다시 열면 새 문장).
 *   ② 8개 감각(have/get/take/make/keep/up/out/구동사)을 세션마다 골고루(최소 4항목) +
 *      유형 3종(sense-choice/verb-choice/sense-cloze) 보장 + R10 관용 반례 자연 주입.
 *   ③ 진척 화면 "Day N" — 일자별 정답률 + sense별 추적(항목×감각) + 남은 미출제 수.
 *   ④ 전이 테스트는 분리된 전이 풀에서 세션당 5문항, 미출제 우선.
 *   ⑤ 풀 소진 시 완주 화면 + 복습 모드(틀린 문항 우선). R8 첫 세션 요약. G5·G6·ⓘ.
 *
 * c2-3 신규 (검증 대상):
 *   G12 — 정답 확인 후 피드백에 sentence_ko 표시 ("해석" 라벨, 완성 문장 아래). 질문 단계 노출 금지.
 *   G11 — 질문 카드에 항목명·감각명·항목색 단서 없음 (유형 알약만). 항목 알약은 피드백에서.
 *         이를 위해 *질문 렌더(renderQuestion)와 피드백 렌더(renderFeedback)를 분리*한다 —
 *         item-pill / itemColor / senseLabel 호출은 피드백 함수에만 산다 (정적 검사 가능).
 *   keep 메타포 (G9 계열, 신규) — 원 안 칩이 흘러나가려는 점선 화살표를 *손/걸쇠가 붙들고* 있는 그림.
 *         have(그냥 놓임, 누르는 손 없음)와의 force 대비를 피드백에서 나란히.
 *   Day 기록 이어받기 — 시작 시 gtf-c2-2- 의 days 기록을 읽기 전용 import 해 Day 카운트·추이에 합산
 *         (c2-2 원본은 절대 수정 안 함). ⓘ에 "이전 버전 기록 포함" 한 줄.
 *
 * 데이터: window.CONTENT_ALL = 8파일 verbatim (have/get/take/make/keep/up/out/phrasal-up).
 *
 * 분리 계약 (separation-surface):
 *   buildTrainingPool 은 *.training_items 에서만, buildTransferPool 은 *.transfer_items 에서만.
 */
(function () {
  "use strict";

  var ALL = window.CONTENT_ALL;
  var STORE_PREFIX = "gtf-c2-3-";
  var PREV_PREFIX = "gtf-c2-2-";   // 이전 버전 — 읽기 전용 import 대상 (수정 금지)
  var TRAIN_COUNT = 15;            // 일일 세션 출제 수
  var TRANSFER_COUNT = 5;          // 전이 세션 출제 수
  var MIN_ITEMS_PER_SESSION = 4;   // 세션마다 골고루 — 최소 항목 수

  var app = document.getElementById("app");

  // 콘텐츠 항목 순서 (화면·집계 안정 정렬용). keep을 핵심 동사 5번째로.
  var ITEM_ORDER = ["have", "get", "take", "make", "keep", "up", "out", "phrasal-up"];

  // ===================================================================
  //  sense / 항목 메타 — 생활 한국어 라벨 (G5: 학술 용어 금지)
  // ===================================================================
  var SENSE_INDEX = {};       // sense_id → sense
  var ITEM_OF_SENSE = {};     // sense_id → 콘텐츠 항목 키
  function indexContent() {
    for (var ci = 0; ci < ITEM_ORDER.length; ci++) {
      var key = ITEM_ORDER[ci];
      var content = ALL[key];
      if (!content || !content.senses) continue;
      for (var i = 0; i < content.senses.length; i++) {
        SENSE_INDEX[content.senses[i].id] = content.senses[i];
        ITEM_OF_SENSE[content.senses[i].id] = key;
      }
    }
  }
  indexContent();
  function senseById(id) { return SENSE_INDEX[id] || null; }
  function itemOfSense(id) { return ITEM_OF_SENSE[id] || null; }

  function itemType(item) { return item.type || "sense-choice"; }

  // ---- 표시 헬퍼 (G10: 호출부보다 먼저 정의 — c2-2 죽은 헬퍼 사고 회수) ----
  // 이 헬퍼들(itemColor·itemShort·senseLabel·senseColor)은 *피드백/진척 화면 전용*이다.
  // 질문 렌더(renderQuestion)에서는 호출하지 않는다 (G11 단서 차단).
  var ITEM_COLOR = {
    "have": "#8a5a8f", "get": "#2f6db0", "take": "#b07b2f", "make": "#9c4f6e",
    "keep": "#15786b", "up": "#3a6b5c", "out": "#3b7b86", "phrasal-up": "#5a59a8"
  };
  var ITEM_SHORT = {
    "have": "have", "get": "get", "take": "take", "make": "make",
    "keep": "keep", "up": "up", "out": "out", "phrasal-up": "V+up"
  };
  var SENSE_LABEL = {
    "have-domain-location": "대상이 영역 안에", "have-event-in-domain": "사건이 영역 안에",
    "get-arrival": "밖에서 안으로 도달", "get-state-change": "상태로 옮겨 감",
    "take-grasp": "손 뻗어 점유", "take-carry": "잡아 데려감",
    "make-create": "새로 빚어냄", "make-cause": "상태를 빚어냄",
    "keep-hold": "흘러나가려는 것을 붙듦", "keep-state": "상태를 붙들어 이어 감",
    "up-vertical": "아래에서 위로", "up-completion": "끝까지 차오름",
    "out-exit": "안에서 밖으로", "out-reveal": "가려진 것이 드러남",
    "compose-vertical": "합성 — 위로", "compose-completion": "합성 — 끝까지",
    "opaque-idiom": "관용 — 통째로"
  };
  function itemColor(key) { return ITEM_COLOR[key] || "#574f47"; }
  function itemShort(key) { return ITEM_SHORT[key] || key; }
  function typeLabel(type) {
    if (type === "verb-choice") return "동사 고르기";
    if (type === "sense-cloze") return "불변화사 고르기";
    return "그림 고르기";
  }
  function senseLabel(id) { return SENSE_LABEL[id] || id; }
  function senseColor(id) {
    if (id === "opaque-idiom") return "#5d5650";
    if (id.indexOf("compose-") === 0) return ITEM_COLOR["phrasal-up"];
    return itemColor(String(id).split("-")[0]);
  }

  function isOpaque(senseId) { return senseId === "opaque-idiom"; }
  function isCompose(senseId) {
    return senseId === "compose-vertical" || senseId === "compose-completion";
  }
  function isKeep(senseId) { return senseId === "keep-hold" || senseId === "keep-state"; }

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
  // 문장 렌더: 빈칸(___)은 빈칸 박스. (라벨 추출 아님 — G2 무관)
  function renderSentence(item) {
    var safe = esc(item.sentence);
    safe = safe.replace(/___/g, '<span class="blank-box" aria-label="빈칸"></span>');
    return safe;
  }
  function renderFilledSentence(item, answerWord) {
    var filled = item.sentence.replace(/___/g, answerWord);
    var safe = esc(filled);
    safe = safe.replace(new RegExp('(' + answerWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ')'),
      '<span class="kw filled">$1</span>');
    return safe;
  }

  // ===================================================================
  //  localStorage — 출제 이력·일자 기록·복습 오답·설정. prefix gtf-c2-3-
  // ===================================================================
  function loadSet(key) {
    try {
      var raw = window.localStorage.getItem(STORE_PREFIX + key);
      var arr = raw ? JSON.parse(raw) : [];
      var set = {};
      for (var i = 0; i < arr.length; i++) set[arr[i]] = true;
      return set;
    } catch (e) { return {}; }
  }
  function saveSet(key, set) {
    try { window.localStorage.setItem(STORE_PREFIX + key, JSON.stringify(Object.keys(set))); }
    catch (e) { /* file:// 일부 환경 localStorage 비활성 — 진척만 비저장 */ }
  }
  function addToSet(key, ids) {
    var set = loadSet(key);
    for (var i = 0; i < ids.length; i++) set[ids[i]] = true;
    saveSet(key, set);
  }
  function removeFromSet(key, ids) {
    var set = loadSet(key);
    for (var i = 0; i < ids.length; i++) delete set[ids[i]];
    saveSet(key, set);
  }
  // 이 버전(c2-3)에서 쌓인 날들.
  function loadOwnDays() {
    try {
      var raw = window.localStorage.getItem(STORE_PREFIX + "days");
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  // 이전 버전(c2-2) 날들 — 읽기 전용 import. 절대 쓰지 않는다.
  function loadPrevDays() {
    try {
      var raw = window.localStorage.getItem(PREV_PREFIX + "days");
      var arr = raw ? JSON.parse(raw) : [];
      // import 표시를 달아 둔다 (추이 화면에서 '이전 버전'으로 구분).
      for (var i = 0; i < arr.length; i++) arr[i].__imported = true;
      return arr;
    } catch (e) { return []; }
  }
  // Day 카운트·추이에 합산할 전체 코스 = 이전 버전 + 이번 버전 (시간순).
  function loadAllDays() {
    var prev = loadPrevDays();
    var own = loadOwnDays();
    return prev.concat(own);
  }
  function prevDayCount() { return loadPrevDays().length; }

  function saveDay(rec) {
    try {
      var days = loadOwnDays();
      days.push(rec);
      window.localStorage.setItem(STORE_PREFIX + "days", JSON.stringify(days));
    } catch (e) { /* 무시 */ }
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
  //  공급 풀 — 분리 계약의 핵심 (separation-surface).
  // ===================================================================
  // 전체 훈련 풀: 8파일 training_items 전부에 출처 항목 키를 붙여 평탄화 (80문항).
  // transfer_items 는 절대 참조하지 않는다.
  function allTrainingItems() {
    var out = [];
    for (var ci = 0; ci < ITEM_ORDER.length; ci++) {
      var key = ITEM_ORDER[ci];
      var content = ALL[key];
      if (!content || !content.training_items) continue;
      for (var i = 0; i < content.training_items.length; i++) {
        out.push({ item: content.training_items[i], srcKey: key });
      }
    }
    return out;
  }
  // 전체 전이 풀: 8파일 transfer_items 전부 (40문항).
  // training_items 는 절대 참조하지 않는다.
  function allTransferItems() {
    var out = [];
    for (var ci = 0; ci < ITEM_ORDER.length; ci++) {
      var key = ITEM_ORDER[ci];
      var content = ALL[key];
      if (!content || !content.transfer_items) continue;
      for (var i = 0; i < content.transfer_items.length; i++) {
        out.push({ item: content.transfer_items[i], srcKey: key });
      }
    }
    return out;
  }

  // 일일 훈련 공급: 미출제 우선 → 8항목 골고루 + 유형 3종 + 구동사 시 관용 반례 자연 포함.
  function buildTrainingPool(review) {
    var pool = allTrainingItems();   // training_items 전용 풀 (분리 계약: 전이 배열 미참조)
    var seen = loadSet("seen-train");
    var wrong = loadSet("wrong");

    var ranked;
    if (review) {
      var wrongFirst = pool.filter(function (e) { return wrong[e.item.id]; });
      var rest = pool.filter(function (e) { return !wrong[e.item.id]; });
      ranked = shuffle(wrongFirst).concat(shuffle(rest));
    } else {
      var unseen = pool.filter(function (e) { return !seen[e.item.id]; });
      var seenAgain = pool.filter(function (e) { return seen[e.item.id]; });
      ranked = shuffle(unseen).concat(shuffle(seenAgain));
    }

    var sel = ranked.slice(0, TRAIN_COUNT);
    sel = ensureItemSpread(sel, pool, TRAIN_COUNT);
    sel = ensureTypeCoverage(sel, pool, TRAIN_COUNT);
    sel = ensureIdiomCounterexample(sel, pool, TRAIN_COUNT);
    return shuffle(sel);
  }

  // 일일 전이 공급: 미출제 우선 5문항.
  function buildTransferPool() {
    var pool = allTransferItems();   // transfer_items 전용 풀 (분리 계약: 훈련 배열 미참조)
    var seen = loadSet("seen-trans");
    var unseen = pool.filter(function (e) { return !seen[e.item.id]; });
    var seenAgain = pool.filter(function (e) { return seen[e.item.id]; });
    var ranked = shuffle(unseen).concat(shuffle(seenAgain));
    var sel = ranked.slice(0, TRANSFER_COUNT);
    sel = ensureTypeCoverage(sel, pool, TRANSFER_COUNT);
    return shuffle(sel);
  }

  // 8항목 골고루 — 최소 MIN_ITEMS_PER_SESSION 항목이 세션에 들어오게 보정.
  function ensureItemSpread(sel, fullPool, count) {
    function itemsIn(list) {
      var set = {};
      for (var i = 0; i < list.length; i++) set[list[i].srcKey] = true;
      return Object.keys(set);
    }
    var present = itemsIn(sel);
    var guard = 0;
    while (present.length < MIN_ITEMS_PER_SESSION && guard < 50) {
      guard++;
      var missingItem = null;
      for (var ci = 0; ci < ITEM_ORDER.length; ci++) {
        if (present.indexOf(ITEM_ORDER[ci]) === -1) { missingItem = ITEM_ORDER[ci]; break; }
      }
      if (!missingItem) break;
      var cand = fullPool.find(function (e) {
        return e.srcKey === missingItem && sel.indexOf(e) === -1;
      });
      if (!cand) { present.push(missingItem); continue; }
      var counts = {};
      sel.forEach(function (e) { counts[e.srcKey] = (counts[e.srcKey] || 0) + 1; });
      var replaceIdx = -1, maxC = 1;
      for (var i = sel.length - 1; i >= 0; i--) {
        if (counts[sel[i].srcKey] > maxC) { replaceIdx = i; maxC = counts[sel[i].srcKey]; }
      }
      if (replaceIdx === -1) {
        for (var j = sel.length - 1; j >= 0; j--) {
          if (counts[sel[j].srcKey] >= 2) { replaceIdx = j; break; }
        }
      }
      if (replaceIdx === -1) break;
      sel[replaceIdx] = cand;
      present = itemsIn(sel);
    }
    return sel.slice(0, count);
  }

  // 유형 3종 모두 1개 이상 보정.
  function ensureTypeCoverage(sel, fullPool, count) {
    var need = ["sense-choice", "verb-choice", "sense-cloze"];
    for (var t = 0; t < need.length; t++) {
      var has = sel.some(function (e) { return itemType(e.item) === need[t]; });
      if (has) continue;
      var cand = fullPool.find(function (e) {
        return itemType(e.item) === need[t] && sel.indexOf(e) === -1;
      });
      if (!cand) continue;
      var counts = {};
      sel.forEach(function (e) { counts[itemType(e.item)] = (counts[itemType(e.item)] || 0) + 1; });
      var replaceIdx = -1;
      for (var i = sel.length - 1; i >= 0; i--) {
        if (counts[itemType(sel[i].item)] > 1) { counts[itemType(sel[i].item)]--; replaceIdx = i; break; }
      }
      if (replaceIdx === -1) replaceIdx = sel.length - 1;
      sel[replaceIdx] = cand;
    }
    return sel.slice(0, count);
  }

  // R10 — 구동사(phrasal-up) 문항이 세션에 있으면 관용 반례(opaque-idiom) 1개 자연 포함.
  function ensureIdiomCounterexample(sel, fullPool, count) {
    var hasPhrasal = sel.some(function (e) { return e.srcKey === "phrasal-up"; });
    if (!hasPhrasal) return sel.slice(0, count);
    var hasIdiom = sel.some(function (e) { return isOpaque(e.item.sense_id); });
    if (hasIdiom) return sel.slice(0, count);
    var cand = fullPool.find(function (e) {
      return isOpaque(e.item.sense_id) && sel.indexOf(e) === -1;
    });
    if (!cand) return sel.slice(0, count);
    var replaceIdx = -1;
    for (var i = sel.length - 1; i >= 0; i--) {
      if (sel[i].srcKey === "phrasal-up" && isCompose(sel[i].item.sense_id)) { replaceIdx = i; break; }
    }
    if (replaceIdx === -1) {
      var counts = {};
      sel.forEach(function (e) { counts[e.srcKey] = (counts[e.srcKey] || 0) + 1; });
      for (var j = sel.length - 1; j >= 0; j--) {
        if (counts[sel[j].srcKey] >= 2 && sel[j].srcKey !== "phrasal-up") { replaceIdx = j; break; }
      }
    }
    if (replaceIdx === -1) replaceIdx = sel.length - 1;
    sel[replaceIdx] = cand;
    return sel.slice(0, count);
  }

  function unseenTrainCount() {
    var pool = allTrainingItems();
    var seen = loadSet("seen-train");
    var n = 0;
    for (var i = 0; i < pool.length; i++) if (!seen[pool[i].item.id]) n++;
    return n;
  }
  function unseenTransferCount() {
    var pool = allTransferItems();
    var seen = loadSet("seen-trans");
    var n = 0;
    for (var i = 0; i < pool.length; i++) if (!seen[pool[i].item.id]) n++;
    return n;
  }
  function totalTrainCount() { return allTrainingItems().length; }

  // ===================================================================
  //  공간 메타포 SVG — 감각 전달 장치 (G1·G7·G8·G9). 라벨은 명시 필드만 (G2).
  //  *모두 피드백 단계에서만 호출된다.*
  // ===================================================================

  // 공통 칩 (둥근 사각 + 라벨)
  function chip(x, y, w, h, col, label) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" fill="#ffffff" stroke="' + col + '" stroke-width="2"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 5) + '" text-anchor="middle" font-size="12" fill="#232020" font-weight="600">' + esc(label) + '</text>';
  }

  // --- have: 칩이 원(영역) 안에 내려앉아 정적으로 자리한다 (G1). 누르는 손 없음. ---
  function svgHave(subjectLabel, objectLabel, settle, compact) {
    var col = itemColor("have");
    var cls = settle ? "viz-settle settle" : "viz-settle";
    var startStyle = settle ? "" : ' style="transform: translateY(-46px); opacity:0.35;"';
    var vb = compact ? '0 0 200 160' : '0 0 320 200';
    var cx = compact ? 100 : 160, cy = compact ? 86 : 104, rx = compact ? 74 : 96, ry = compact ? 54 : 64;
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="대상 칩이 영역 원 안에 정적으로 자리한 그림">' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#f3edf4" stroke="' + col + '" stroke-width="2"/>' +
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(subjectLabel) + ' 영역</text>' +
        '<g class="' + cls + '"' + startStyle + '>' +
          chip(cx - 52, cy - 16, 104, 36, col, objectLabel) +
        '</g>' +
        '<text x="' + cx + '" y="' + (cy + ry - 4) + '" text-anchor="middle" font-size="10" fill="#a89aa9">힘 없이 그냥 놓임</text>' +
      '</svg>'
    );
  }

  // --- keep: 원 안의 칩이 밖으로 흘러나가려는데(점선 화살표), 손/걸쇠가 눌러 붙든다 (G9 신규). ---
  // have와의 핵심 차이 = force. have는 누르는 손이 없고, keep은 빠져나가려는 흐름에 맞서는 손이 있다.
  function svgKeep(subjectLabel, objectLabel, settle, compact) {
    var col = itemColor("keep");
    var claspCls = settle ? "viz-clasp settle" : "viz-clasp";
    var handCls = settle ? "viz-hand settle" : "viz-hand";
    // 미정착: 칩이 경계 쪽으로 밀려나 있고 손이 아직 안 눌림. settle: 칩이 안으로 끌려와 손이 누름.
    var chipStart = settle ? "" : ' style="transform: translateX(40px); opacity:0.55;"';
    var handStart = settle ? "" : ' style="transform: translateY(-26px) rotate(-14deg); opacity:0.4;"';
    var vb = compact ? '0 0 200 160' : '0 0 320 200';
    var cx = compact ? 96 : 150, cy = compact ? 90 : 110, rx = compact ? 70 : 94, ry = compact ? 54 : 64;
    var edgeX = cx + rx;       // 원 경계 (오른쪽)
    var outX = compact ? 188 : 300;
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="영역 안 대상이 밖으로 흘러나가려는데 손이 눌러 붙드는 그림">' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#e3f2ef" stroke="' + col + '" stroke-width="2"/>' +
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(subjectLabel) + ' 영역</text>' +
        // 흘러나가려는 경향: 칩 → 경계 밖 점선 화살표 (빠져나가려는 흐름)
        '<line x1="' + (edgeX - 14) + '" y1="' + (cy - 22) + '" x2="' + (outX - 6) + '" y2="' + (cy - 22) + '" stroke="#bf6b5a" stroke-width="2" stroke-dasharray="4 4" opacity="0.85"/>' +
        '<path d="M' + outX + ' ' + (cy - 22) + ' L' + (outX - 12) + ' ' + (cy - 28) + ' L' + (outX - 12) + ' ' + (cy - 16) + ' Z" fill="#bf6b5a" opacity="0.85"/>' +
        '<text x="' + (outX - 2) + '" y="' + (cy - 32) + '" font-size="9.5" fill="#bf6b5a" text-anchor="end">나가려는 흐름</text>' +
        // 붙들리는 칩 (settle 시 안으로 끌려옴)
        '<g class="' + claspCls + '"' + chipStart + '>' +
          chip(cx - 44, cy - 12, 96, 36, col, objectLabel) +
        '</g>' +
        // 손/걸쇠 — 칩 위에서 눌러 붙듦 (대항력). settle 시 칩 위로 내려와 누름.
        '<g class="' + handCls + '"' + handStart + '>' +
          // 손바닥(걸쇠) 곡선
          '<path d="M' + (cx - 30) + ' ' + (cy - 24) + ' q30 -22 64 0" fill="none" stroke="' + col + '" stroke-width="4" stroke-linecap="round"/>' +
          // 누르는 손가락 두 개
          '<line x1="' + (cx - 12) + '" y1="' + (cy - 28) + '" x2="' + (cx - 12) + '" y2="' + (cy - 14) + '" stroke="' + col + '" stroke-width="4" stroke-linecap="round"/>' +
          '<line x1="' + (cx + 14) + '" y1="' + (cy - 28) + '" x2="' + (cx + 14) + '" y2="' + (cy - 14) + '" stroke="' + col + '" stroke-width="4" stroke-linecap="round"/>' +
        '</g>' +
        '<text x="' + cx + '" y="' + (cy + ry - 4) + '" text-anchor="middle" font-size="10" fill="' + col + '">손이 눌러 붙듦 (대항력)</text>' +
      '</svg>'
    );
  }

  // --- get: 원 밖에서 화살표를 따라 칩이 안으로 들어와 닿는다 (G7) ---
  function svgGet(subjectLabel, objectLabel, settle, compact) {
    var col = itemColor("get");
    var cls = settle ? "viz-slide settle" : "viz-slide";
    var startStyle = settle ? "" : ' style="transform: translateX(-104px); opacity:0.4;"';
    var vb = compact ? '0 0 200 150' : '0 0 320 200';
    var cx = compact ? 118 : 188, cy = compact ? 80 : 104, rx = compact ? 60 : 86, ry = compact ? 48 : 62;
    var ax = compact ? 8 : 18;
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="대상이 영역 원 밖에서 화살표를 따라 안으로 들어와 닿는 그림">' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#eef4fa" stroke="' + col + '" stroke-width="2"/>' +
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(subjectLabel) + ' 영역</text>' +
        '<line x1="' + ax + '" y1="' + cy + '" x2="' + (cx - 6) + '" y2="' + cy + '" stroke="' + col + '" stroke-width="3" stroke-dasharray="4 4"/>' +
        '<path d="M' + cx + ' ' + cy + ' L' + (cx - 16) + ' ' + (cy - 8) + ' L' + (cx - 16) + ' ' + (cy + 8) + ' Z" fill="' + col + '"/>' +
        '<text x="' + (ax + 6) + '" y="' + (cy - 12) + '" font-size="10" fill="#8d867d">밖</text>' +
        '<g class="' + cls + '"' + startStyle + '>' +
          chip(cx - 50, cy - 16, 100, 36, col, objectLabel) +
        '</g>' +
      '</svg>'
    );
  }

  // --- take: 손(화살표)이 원 밖 대상을 집어 원 안으로 끌어들인다 (G9) ---
  function svgTake(subjectLabel, objectLabel, settle, compact) {
    var col = itemColor("take");
    var cls = settle ? "viz-slide settle" : "viz-slide";
    var startStyle = settle ? "" : ' style="transform: translateX(86px); opacity:0.4;"';
    var vb = compact ? '0 0 200 150' : '0 0 320 200';
    var cx = compact ? 86 : 132, cy = compact ? 80 : 104, rx = compact ? 60 : 86, ry = compact ? 48 : 62;
    var reach = compact ? 178 : 296;
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="주어의 손이 영역 밖 대상을 붙잡아 원 안으로 끌어들이는 그림">' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#f6efe2" stroke="' + col + '" stroke-width="2"/>' +
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(subjectLabel) + ' 영역</text>' +
        '<line x1="' + (cx + 4) + '" y1="' + cy + '" x2="' + (reach - 8) + '" y2="' + cy + '" stroke="' + col + '" stroke-width="3"/>' +
        '<path d="M' + (reach - 10) + ' ' + (cy - 12) + ' A 12 12 0 1 0 ' + (reach - 10) + ' ' + (cy + 12) + '" fill="none" stroke="' + col + '" stroke-width="3"/>' +
        '<path d="M' + (cx + 30) + ' ' + cy + ' L' + (cx + 46) + ' ' + (cy - 7) + ' L' + (cx + 46) + ' ' + (cy + 7) + ' Z" fill="' + col + '"/>' +
        '<text x="' + (reach - 6) + '" y="' + (cy - 16) + '" font-size="10" fill="#8d867d" text-anchor="end">밖의 대상</text>' +
        '<g class="' + cls + '"' + startStyle + '>' +
          chip(cx - 48, cy - 16, 96, 36, col, objectLabel) +
        '</g>' +
      '</svg>'
    );
  }

  // --- make: 원 안에서 새 형체가 점으로 생겨나 커진다 (G9) ---
  function svgMake(subjectLabel, objectLabel, settle, compact) {
    var col = itemColor("make");
    var cls = settle ? "viz-grow settle" : "viz-grow";
    var vb = compact ? '0 0 200 150' : '0 0 320 200';
    var cx = compact ? 100 : 160, cy = compact ? 80 : 104, rx = compact ? 72 : 96, ry = compact ? 50 : 64;
    var growStyle = settle
      ? ' style="transform-origin: ' + cx + 'px ' + cy + 'px;"'
      : ' style="transform: scale(0.12); opacity:0.2; transform-origin: ' + cx + 'px ' + cy + 'px;"';
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="영역 안에서 없던 형체가 새로 생겨나 커지는 그림">' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#f7edf1" stroke="' + col + '" stroke-width="2"/>' +
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(subjectLabel) + ' 손끝</text>' +
        '<circle cx="' + (cx - 38) + '" cy="' + (cy - 30) + '" r="2.5" fill="' + col + '" opacity="0.6"/>' +
        '<circle cx="' + (cx + 40) + '" cy="' + (cy - 24) + '" r="2" fill="' + col + '" opacity="0.5"/>' +
        '<circle cx="' + (cx + 30) + '" cy="' + (cy + 30) + '" r="2.5" fill="' + col + '" opacity="0.6"/>' +
        '<g class="' + cls + '"' + growStyle + '>' +
          chip(cx - 52, cy - 16, 104, 36, col, objectLabel) +
          '<text x="' + cx + '" y="' + (cy - 24) + '" text-anchor="middle" font-size="10" fill="' + col + '">새로 생겨남</text>' +
        '</g>' +
      '</svg>'
    );
  }

  // --- up-vertical ---
  function svgUpVertical(_subjectLabel, objectLabel, settle, compact) {
    var col = itemColor("up");
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
          chip(cx - 52, chipY, 104, 36, col, objectLabel) +
        '</g>' +
      '</svg>'
    );
  }

  // --- up-completion ---
  function svgUpCompletion(_subjectLabel, objectLabel, settle, compact) {
    var col = itemColor("up");
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

  // --- out-exit ---
  function svgOutExit(subjectLabel, objectLabel, settle, compact) {
    var col = itemColor("out");
    var cls = settle ? "viz-slide settle" : "viz-slide";
    var startStyle = settle ? "" : ' style="transform: translateX(-110px); opacity:0.5;"';
    var vb = compact ? '0 0 200 150' : '0 0 320 200';
    var cx = compact ? 78 : 120, cy = compact ? 80 : 104, rx = compact ? 56 : 80, ry = compact ? 48 : 62;
    var outX = compact ? 168 : 280;
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="용기 안에 있던 칩이 경계를 넘어 바깥으로 나가는 그림">' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#e9f3f4" stroke="' + col + '" stroke-width="2"/>' +
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(subjectLabel) + ' (안)</text>' +
        '<line x1="' + (cx + rx - 6) + '" y1="' + cy + '" x2="' + (outX - 6) + '" y2="' + cy + '" stroke="' + col + '" stroke-width="3" stroke-dasharray="4 4"/>' +
        '<path d="M' + outX + ' ' + cy + ' L' + (outX - 16) + ' ' + (cy - 8) + ' L' + (outX - 16) + ' ' + (cy + 8) + ' Z" fill="' + col + '"/>' +
        '<text x="' + (outX - 2) + '" y="' + (cy - 12) + '" font-size="10" fill="#8d867d" text-anchor="end">밖</text>' +
        '<g class="' + cls + '"' + startStyle + '>' +
          chip(cx + rx - 20, cy - 16, 92, 36, col, objectLabel) +
        '</g>' +
      '</svg>'
    );
  }

  // --- out-reveal ---
  function svgOutReveal(_subjectLabel, objectLabel, settle, compact) {
    var col = itemColor("out");
    var cls = settle ? "viz-reveal settle" : "viz-reveal";
    var startStyle = settle ? "" : ' style="transform: translateY(14px); opacity:0.18;"';
    var vb = compact ? '0 0 200 150' : '0 0 320 200';
    var cx = compact ? 100 : 160, cy = compact ? 86 : 116;
    var coverY = compact ? 40 : 52, coverH = compact ? 46 : 60, coverW = compact ? 150 : 230;
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="가려져 있던 칩이 덮개 밖으로 나와 보이게 되는 그림">' +
        '<g class="' + cls + '"' + startStyle + '>' +
          chip(cx - 52, cy - 18, 104, 36, col, objectLabel) +
        '</g>' +
        '<rect x="' + (cx - coverW / 2) + '" y="' + coverY + '" width="' + coverW + '" height="' + coverH + '" rx="10" fill="#9fb6bb" opacity="0.5"/>' +
        '<text x="' + cx + '" y="' + (coverY + 18) + '" text-anchor="middle" font-size="10" fill="#3b5a60">가려져 안 보이던 것</text>' +
        '<text x="' + cx + '" y="' + (cy + 34) + '" text-anchor="middle" font-size="10" fill="' + col + '">밖으로 드러나 보임</text>' +
      '</svg>'
    );
  }

  // sense_id → 그 sense의 메타포 SVG.
  function svgForSense(senseId, subj, obj, settle, compact) {
    switch (senseId) {
      case "have-domain-location":
      case "have-event-in-domain":
        return svgHave(subj, obj, settle, compact);
      case "keep-hold":
      case "keep-state":
        return svgKeep(subj, obj, settle, compact);
      case "get-arrival":
      case "get-state-change":
        return svgGet(subj, obj, settle, compact);
      case "take-grasp":
      case "take-carry":
        return svgTake(subj, obj, settle, compact);
      case "make-create":
      case "make-cause":
        return svgMake(subj, obj, settle, compact);
      case "out-exit":
        return svgOutExit(subj, obj, settle, compact);
      case "out-reveal":
        return svgOutReveal(subj, obj, settle, compact);
      case "up-completion":
      case "compose-completion":
        return svgUpCompletion(subj, obj, settle, compact);
      case "up-vertical":
      case "compose-vertical":
      default:
        return svgUpVertical(subj, obj, settle, compact);
    }
  }

  function vizBox(senseId, subj, obj, settle, caption) {
    return '<div class="viz-wrap">' + svgForSense(senseId, subj, obj, settle) +
      '<div class="viz-caption">' + caption + '</div></div>';
  }

  // keep ↔ have 대비 (G9 신규) — 붙듦(force 있음) vs 그냥 놓임(force 없음)을 나란히.
  function keepContrastViz(item, startSettle) {
    var subj = item.subject_label, obj = item.object_label;
    return (
      '<div class="contrast-wrap">' +
        '<div class="contrast-label">keep ↔ have — 붙드는 힘이 있나, 그냥 있나</div>' +
        '<div class="contrast-row">' +
          '<div class="contrast-cell keep">' +
            '<div class="contrast-mini">' + svgKeep(subj, obj, startSettle, true) + '</div>' +
            '<div class="contrast-cap"><b>keep</b> — 나가려는 걸 손이 눌러 붙듦</div>' +
          '</div>' +
          '<div class="contrast-cell have">' +
            '<div class="contrast-mini">' + svgHave(subj, obj, true, true) + '</div>' +
            '<div class="contrast-cap"><b>have</b> — 누르는 손 없이 그냥 놓임</div>' +
          '</div>' +
        '</div>' +
        '<div class="contrast-note">대항력(붙드는 손)이 느껴지면 keep, 그냥 있으면 have예요.</div>' +
      '</div>'
    );
  }

  // ===================================================================
  //  합성 시각화 (G8) — 구동사 투명 합성: [동사]+[불변화사]=[합쳐진 그림]
  // ===================================================================
  function compositionViz(item) {
    var senseId = item.sense_id;
    var isVertical = senseId === "compose-vertical";
    var verbWord = item.verb_label || "(동사)";

    var verbMini =
      '<svg viewBox="0 0 140 120" role="img" aria-label="동사의 동작 그림">' +
        '<rect x="22" y="48" width="96" height="34" rx="9" fill="#ffffff" stroke="#574f47" stroke-width="2"/>' +
        '<text x="70" y="70" text-anchor="middle" font-size="12" fill="#232020" font-weight="600">' + esc(verbWord) + '</text>' +
        '<path d="M40 96 H100" stroke="#8d867d" stroke-width="2.5"/>' +
        '<path d="M100 96 L92 91 L92 101 Z" fill="#8d867d"/>' +
        '<text x="70" y="30" text-anchor="middle" font-size="10" fill="#8d867d">동사의 동작</text>' +
      '</svg>';

    var upMini = isVertical
      ? svgUpVertical("바닥", "up", true, true)
      : svgUpCompletion("내용", "up", true, true);

    var combined = combinedSvg(item, isVertical);
    var capWord = isVertical ? "위로" : "끝까지";
    return (
      '<div class="compose-wrap">' +
        '<div class="compose-label">구동사 = 그림 두 개의 합</div>' +
        '<div class="compose-row">' +
          '<div class="compose-cell"><div class="compose-mini">' + verbMini + '</div>' +
            '<div class="compose-cap">' + esc(verbWord) + ' (동작)</div></div>' +
          '<div class="compose-plus">+</div>' +
          '<div class="compose-cell"><div class="compose-mini">' + upMini + '</div>' +
            '<div class="compose-cap">up (' + capWord + ')</div></div>' +
          '<div class="compose-eq">=</div>' +
        '</div>' +
        '<div class="compose-result">' +
          '<div class="compose-mini big">' + combined + '</div>' +
          '<div class="compose-cap result-cap"><b>' + esc(verbWord) + ' up</b> — ' +
            esc(item.subject_label) + ' / ' + esc(item.object_label) + '</div>' +
        '</div>' +
        '<div class="compose-note">이미 아는 두 그림의 결합, 통암기 아님</div>' +
      '</div>'
    );
  }

  function combinedSvg(item, isVertical) {
    if (isVertical) {
      return (
        '<svg viewBox="0 0 220 170" role="img" aria-label="동작이 진행되며 동시에 위로 향하는 합성 그림">' +
          '<rect x="10" y="120" width="200" height="12" rx="4" fill="#ece7dd"/>' +
          '<line x1="24" y1="126" x2="120" y2="126" stroke="#574f47" stroke-width="3"/>' +
          '<path d="M120 126 Q120 80 120 44" stroke="' + itemColor("up") + '" stroke-width="3" fill="none"/>' +
          '<path d="M120 30 L112 50 L128 50 Z" fill="' + itemColor("up") + '"/>' +
          '<rect x="68" y="44" width="104" height="34" rx="9" fill="#ffffff" stroke="' + itemColor("up") + '" stroke-width="2"/>' +
          '<text x="120" y="66" text-anchor="middle" font-size="12" fill="#232020" font-weight="600">' + esc(item.object_label) + '</text>' +
          '<text x="60" y="150" text-anchor="middle" font-size="10" fill="#8d867d">동작 + 위로가 한 장면에</text>' +
        '</svg>'
      );
    }
    return (
      '<svg viewBox="0 0 220 170" role="img" aria-label="동작이 끝점까지 차올라 완료되는 합성 그림">' +
        '<line x1="44" y1="34" x2="176" y2="34" stroke="' + itemColor("up") + '" stroke-width="2" stroke-dasharray="6 4"/>' +
        '<text x="180" y="38" font-size="9" fill="' + itemColor("up") + '">끝</text>' +
        '<path d="M56 30 L56 140 L164 140 L164 30" fill="none" stroke="#bdb6a8" stroke-width="3"/>' +
        '<rect x="58" y="34" width="104" height="104" fill="' + itemColor("up") + '" opacity="0.82"/>' +
        '<text x="110" y="92" text-anchor="middle" font-size="12" fill="#ffffff" font-weight="700">' + esc(item.object_label) + '</text>' +
        '<text x="110" y="158" text-anchor="middle" font-size="10" fill="#8d867d">동작 + 끝까지가 한 장면에</text>' +
      '</svg>'
    );
  }

  // ===================================================================
  //  관용(opaque-idiom) 시각화 (R10) — 합성 3칸 대신 자물쇠.
  // ===================================================================
  function idiomViz(item) {
    var verbWord = item.verb_label || "(동사)";
    var lock =
      '<svg viewBox="0 0 200 170" role="img" aria-label="두 그림을 합쳐도 뜻이 안 나오는 자물쇠 그림">' +
        '<rect x="62" y="74" width="76" height="62" rx="10" fill="#efe7d8" stroke="#7a6f5c" stroke-width="3"/>' +
        '<path d="M76 74 V58 a24 24 0 0 1 48 0 V74" fill="none" stroke="#7a6f5c" stroke-width="6"/>' +
        '<circle cx="100" cy="100" r="8" fill="#7a6f5c"/>' +
        '<rect x="96" y="100" width="8" height="18" fill="#7a6f5c"/>' +
        '<text x="100" y="32" text-anchor="middle" font-size="13" fill="#7a6f5c" font-weight="700">' +
          esc(verbWord) + ' + up = ?</text>' +
        '<text x="100" y="156" text-anchor="middle" font-size="10" fill="#8d867d">합쳐도 뜻이 안 나온다</text>' +
      '</svg>';
    return (
      '<div class="idiom-wrap">' +
        '<div class="idiom-label">이건 합으로 안 풀린다</div>' +
        '<div class="idiom-mini">' + lock + '</div>' +
        '<div class="idiom-note"><b>' + esc(verbWord) + ' up</b>은 두 그림(동사 + up)을 합쳐도 뜻이 안 나오는 ' +
          '<b>굳은 관용 표현</b>이에요. 열쇠는 합성이 아니라 그 표현이 굳어진 역사 — ' +
          '<b>통째로 익히는 게 정직</b>합니다.</div>' +
        '<div class="idiom-warn">모든 구동사가 두 그림의 합은 아니에요. 합으로 풀리는 것(drink up, pack up)과 ' +
          '통째로 외울 것(make up, bring up, look up)을 구분하는 눈이 진짜 실력이에요.</div>' +
      '</div>'
    );
  }

  // ===================================================================
  //  세션 상태 머신
  // ===================================================================
  var state = null;

  function startTraining(review) {
    state = {
      mode: "training", review: !!review,
      entries: buildTrainingPool(review),
      idx: 0, results: [], senseSeen: {}, currentChoices: null
    };
    renderQuestion();
  }
  function startTransfer() {
    state = {
      mode: "transfer",
      entries: buildTransferPool(),
      idx: 0, results: [], senseSeen: {}, currentChoices: null
    };
    renderQuestion();
  }

  // ===================================================================
  //  인트로 — 첫 화면: "8개 감각, 120문장" + 변경점 한 줄.
  // ===================================================================
  function renderIntro() {
    state = null;
    var allDays = loadAllDays();
    var unseen = unseenTrainCount();
    var total = totalTrainCount();
    var done = total - unseen;
    var dayNo = allDays.length + 1;
    var prevN = prevDayCount();

    var status;
    if (allDays.length === 0) {
      status = '<p class="position-note">처음이시네요. 오늘이 <b>Day 1</b>이에요. ' +
        '8개 감각을 매일 조금씩 — 오늘은 그중 새 문장 15개를 골라 드려요.</p>';
    } else if (unseen > 0) {
      status = '<p class="position-note"><b>Day ' + dayNo + '</b> · 지금까지 ' + done + ' / ' + total +
        '문장을 봤어요. <b>아직 안 본 새 문장이 ' + unseen + '개</b> 남아 있어요 — 오늘 또 새 문장으로 만나요.' +
        (prevN > 0 ? ' (이전 버전 ' + prevN + '일 기록 포함 — 콘텐츠가 늘어 추세 비교는 근사예요)' : '') + '</p>';
    } else {
      status = '<p class="position-note"><b>전체 한 바퀴 완주</b>를 마쳤어요. 이제 ' +
        '틀렸던 문장을 다시 보는 <b>복습 모드</b>로 감각을 단단히 할 수 있어요.</p>';
    }

    app.innerHTML =
      '<div class="card intro">' +
        '<p class="kicker">8개 감각, 120문장</p>' +
        '<h1>have·get·take·make·<b>keep</b>·up·out·구동사 —<br>8개 감각을 <b>매일 새 문장으로</b> 익힙니다</h1>' +
        '<div class="whatsnew">이번에 바뀐 점: <b>이제 정답 후 해석을 보여드려요.</b> ' +
          '문제를 풀 때는 영어 문장만 보고 감각으로 고르고, 답을 맞힌 뒤에 한국어 해석을 함께 확인해요. ' +
          '그리고 다섯 번째 동사 <b>keep</b>(붙들어 유지)이 새로 들어왔어요.</div>' +
        '<p class="promise">단어를 뜻으로 외우는 대신, 그 단어가 <b>그리는 그림</b>으로 감각을 잡아요. ' +
          'get은 ‘밖에서 안으로 도달’, keep은 ‘나가려는 걸 붙들어 둠’ — have(그냥 있음)와 keep(붙듦)은 ' +
          '<b>붙드는 힘</b>이 있느냐로 갈려요.</p>' +
        '<p class="promise">핵심은 <b>매일 새 문장</b>이에요. 어제 푼 문제 셔플이 아니라, ' +
          '아직 안 본 문장을 먼저 꺼내 드려요. 120개를 다 보면 <b>한 바퀴 완주</b> — 그다음은 복습이에요.</p>' +
        status +
        '<div class="type-preview">' +
          '<div class="type-chip"><span class="type-ico">' + miniIconSenseChoice() + '</span>' +
            '<span class="type-name">그림 고르기</span><span class="type-desc">단어가 그리는 그림</span></div>' +
          '<div class="type-chip"><span class="type-ico">' + miniIconVerbChoice() + '</span>' +
            '<span class="type-name">동사 고르기</span><span class="type-desc">감각이 갈리는 동사</span></div>' +
          '<div class="type-chip"><span class="type-ico">' + miniIconCloze() + '</span>' +
            '<span class="type-name">불변화사 고르기</span><span class="type-desc">합성 그림으로</span></div>' +
        '</div>' +
        '<div class="btn-row">' +
          (unseen > 0
            ? '<button class="btn" id="go-train">오늘 새 문장 익히기</button>'
            : '<button class="btn" id="go-review">복습 모드 (틀린 문장 우선)</button>') +
          '<button class="btn secondary" id="go-progress">내 코스 보기</button>' +
        '</div>' +
      '</div>';
    var t = document.getElementById("go-train");
    if (t) t.onclick = function () { startTraining(false); };
    var r = document.getElementById("go-review");
    if (r) r.onclick = function () { startTraining(true); };
    document.getElementById("go-progress").onclick = renderProgress;
    window.scrollTo(0, 0);
  }

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
  //  질문 렌더 (G11) — 질문 카드. 단서 차단:
  //    - 항목명/감각명/항목색 노출 금지. 유형 알약(typeLabel)만 OK.
  //    - sentence_ko 노출 절대 금지 (G12 — 해석은 정답 후).
  //  이 함수는 itemColor / senseLabel / item-pill 을 호출하지 않는다 (정적 검사 대상).
  //  맥락 정보(항목 알약·해석·메타포)는 전부 renderFeedback 에 있다.
  // ===================================================================
  function currentEntry() { return state.entries[state.idx]; }

  function renderQuestion() {
    var entry = currentEntry();
    var item = entry.item;
    var total = state.entries.length;
    var n = state.idx + 1;
    var isTransfer = state.mode === "transfer";
    var fill = pct(state.idx, total);
    var type = itemType(item);

    var shuffled = shuffleChoices(item);
    state.currentChoices = shuffled;

    var headLabel = isTransfer ? "새 문장" : (state.review ? "복습" : "오늘 익히기");
    var isWord = (type === "verb-choice" || type === "sense-cloze");

    var html =
      '<div class="card question">' +
        (isTransfer
          ? '<span class="new-flag">새 문장 테스트 — 익히기에 없던 문장이에요</span>'
          : (state.review
            ? '<span class="review-flag">복습 — 전에 틀린 문장 우선</span>'
            : "")) +
        '<div class="progress-head">' +
          '<span>' + headLabel + " " + n + " / " + total + '</span>' +
          // 유형 알약만 — 단서 아님 (어떤 형식의 문제인지). 항목/감각/색 알약은 여기 없음.
          '<span class="type-pill">' + typeLabel(type) + '</span>' +
        '</div>' +
        '<div class="progress-track"><div class="progress-fill" style="width:' + fill + '%"></div></div>' +
        // 영어 문장만 — 한국어 해석은 정답 후 피드백에서만 (G12).
        '<p class="sentence ' + (isWord ? "has-blank" : "") + '">' + renderSentence(item) + '</p>' +
        '<p class="prompt">' + esc(item.prompt) + '</p>' +
        '<ul class="choices ' + (isWord ? "word-choices" : "") + '" id="choices">';

    var tags = ["a", "b", "c", "d"];
    for (var i = 0; i < shuffled.length; i++) {
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

  // 정답 처리 — 채점·기록만. 화면 단서(항목·해석·메타포)는 renderFeedback 으로 위임.
  function onAnswer(displayIdx) {
    var entry = currentEntry();
    var item = entry.item;
    var type = itemType(item);
    var picked = state.currentChoices[displayIdx];
    var correct = !!(picked && picked.isAnswer);

    state.results.push({
      id: item.id, sense_id: item.sense_id, srcKey: entry.srcKey, type: type, correct: correct
    });
    if (correct) removeFromSet("wrong", [item.id]);
    else addToSet("wrong", [item.id]);

    state.senseSeen[item.sense_id] = (state.senseSeen[item.sense_id] || 0) + 1;
    var fatigued = state.senseSeen[item.sense_id] >= 3;

    var buttons = app.querySelectorAll(".choice");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      var di = parseInt(buttons[i].getAttribute("data-i"), 10);
      if (state.currentChoices[di] && state.currentChoices[di].isAnswer) buttons[i].classList.add("correct");
      else if (di === displayIdx) buttons[i].classList.add("wrong");
    }

    renderFeedback(entry, correct, fatigued);
  }

  // ===================================================================
  //  피드백 렌더 (정답 후 단계) — 단서·해석·메타포가 사는 유일한 곳.
  //    - item-pill (itemColor·itemShort) : 어떤 항목이었는지 (G11 — 여기서만).
  //    - sentence_ko : "해석" 라벨로 완성 문장 아래 (G12 — 정답 후에만).
  //    - 메타포 / keep↔have 대비 / 합성 / 자물쇠 : 감각 그림 (senseLabel 포함).
  // ===================================================================
  function renderFeedback(entry, correct, fatigued) {
    var item = entry.item;
    var type = itemType(item);
    var answerWord = item.choices[item.answer_index];
    var isWord = (type === "verb-choice" || type === "sense-cloze");
    var isLast = state.idx + 1 >= state.entries.length;
    var autoNext = loadAutoNext();

    // G12 — 완성 문장(빈칸 채운 형태 또는 원문) + 그 아래 한국어 해석 ("해석" 라벨, 작게).
    var sentenceBlock;
    if (isWord) {
      sentenceBlock = '<p class="filled-sentence">' + renderFilledSentence(item, answerWord) + '</p>';
    } else {
      sentenceBlock = '<p class="filled-sentence">' + esc(item.sentence) + '</p>';
    }
    var interpBlock = item.sentence_ko
      ? '<p class="interp"><span class="interp-label">해석</span>' +
          '<span class="interp-text">' + esc(item.sentence_ko) + '</span></p>'
      : "";

    var fb = document.getElementById("feedback");
    fb.innerHTML =
      '<div class="feedback">' +
        '<div class="feedback-head">' +
          // 항목 알약 — G11: 질문이 아니라 *여기서* 어떤 감각 항목이었는지 밝힌다.
          '<span class="item-pill" style="background:' + itemColor(entry.srcKey) + '">' + esc(itemShort(entry.srcKey)) + '</span>' +
          '<p class="verdict ' + (correct ? "ok" : "no") + '">' +
            (correct ? "맞았어요 — 이 그림이에요." : "다시 — 이 그림을 보세요.") + '</p>' +
        '</div>' +
        sentenceBlock +
        interpBlock +
        '<p class="why">' + esc(item.why_ko) + '</p>' +
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
      // 반복 피로 + 정답: 풀 애니메이션 생략 (이미 settle).
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

  // 유형별 정답 후 시각화. senseLabel 호출은 피드백 경로에서만 일어난다.
  function feedbackViz(item, type, correct, fatigued) {
    var startSettle = (fatigued && correct) ? true : false;
    var subj = item.subject_label, obj = item.object_label;
    var senseId = item.sense_id;

    if (isOpaque(senseId)) return idiomViz(item);

    if (isCompose(senseId)) {
      var base = "";
      if (type === "sense-cloze") {
        var capWord = senseId === "compose-completion" ? "끝까지 차올라 완료" : "아래에서 위로";
        base = vizBox(senseId, subj, obj, startSettle, "이 불변화사가 그리는 그림 — " + capWord);
      }
      return base + compositionViz(item);
    }

    // keep — 메타포 + have와의 force 대비를 나란히 (G9 신규).
    if (isKeep(senseId)) {
      var keepCap = "이 그림 — " + senseLabel(senseId);
      return vizBox(senseId, subj, obj, startSettle, keepCap) + keepContrastViz(item, startSettle);
    }

    if (type === "verb-choice") {
      return vizBox(senseId, subj, obj, startSettle, "이 동사가 그리는 그림 — " + senseLabel(senseId));
    }
    if (type === "sense-cloze") {
      return vizBox(senseId, subj, obj, startSettle, "이 불변화사가 그리는 그림 — " + senseLabel(senseId));
    }
    return vizBox(senseId, subj, obj, startSettle, "이 그림 — " + senseLabel(senseId));
  }

  function boundaryHtml(item) {
    var sense = senseById(item.sense_id);
    if (!sense || !sense.boundary_ko) return "";
    var head = "감각 경계:";
    var id = item.sense_id;
    if (id === "have-domain-location" || id === "have-event-in-domain") head = "진행형이 되는가:";
    else if (id === "keep-hold") head = "have와 갈리는 자리:";
    else if (id === "keep-state") head = "be·stay와 갈리는 자리:";
    else if (id === "get-arrival" || id === "get-state-change") head = "have·be와 갈리는 자리:";
    else if (id === "take-grasp") head = "get과 갈리는 자리:";
    else if (id === "take-carry") head = "bring과 갈리는 방향:";
    else if (id === "make-create" || id === "make-cause") head = "do와 갈리는 자리:";
    else if (id === "up-vertical" || id === "compose-vertical") head = "down이 서는가:";
    else if (id === "up-completion" || id === "compose-completion") head = "down이 안 서는 이유:";
    else if (id === "out-exit") head = "in으로 뒤집히는가:";
    else if (id === "out-reveal") head = "in이 안 서는 이유:";
    else if (id === "opaque-idiom") head = "합성 테스트:";
    return '<p class="boundary"><b>' + head + '</b> ' + esc(sense.boundary_ko) + '</p>';
  }

  function triggerSettle(scope) {
    var nodes = scope.querySelectorAll(".viz-settle, .viz-slide, .viz-rise, .viz-fill, .viz-grow, .viz-reveal, .viz-clasp, .viz-hand");
    var rims = scope.querySelectorAll(".viz-rim");
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].classList.add("settle");
          if (nodes[i].classList.contains("viz-grow")) {
            nodes[i].style.transform = "scale(1)";
            nodes[i].style.opacity = "1";
          } else {
            nodes[i].removeAttribute("style");
          }
        }
        for (var r = 0; r < rims.length; r++) rims[r].classList.add("hit");
      });
    });
  }

  function nextQuestion() {
    state.idx++;
    if (state.idx < state.entries.length) {
      renderQuestion();
      window.scrollTo(0, 0);
    } else {
      finishSession();
    }
  }

  // ===================================================================
  //  집계 — sense별 추적 (항목×감각 단위 정답률).
  // ===================================================================
  function byItemScore(results) {
    var out = {};
    for (var i = 0; i < results.length; i++) {
      var k = results[i].srcKey;
      if (!out[k]) out[k] = { c: 0, t: 0 };
      out[k].t++;
      if (results[i].correct) out[k].c++;
    }
    return out;
  }
  function bySenseScore(results) {
    var out = {};
    for (var i = 0; i < results.length; i++) {
      var k = results[i].sense_id;
      if (!out[k]) out[k] = { c: 0, t: 0, srcKey: results[i].srcKey };
      out[k].t++;
      if (results[i].correct) out[k].c++;
    }
    return out;
  }
  function byTypeScore(results) {
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
    if (state.mode === "training") {
      addToSet("seen-train", state.results.map(function (r) { return r.id; }));
      window.__gtf_pending = {
        review: state.review,
        train: {
          score: sc, byItem: byItemScore(state.results),
          bySense: bySenseScore(state.results), byType: byTypeScore(state.results)
        }
      };
      renderTrainingSummary(sc, state.results, state.review);
    } else {
      addToSet("seen-trans", state.results.map(function (r) { return r.id; }));
      var pending = window.__gtf_pending || { train: null };
      pending.transfer = {
        score: sc, byItem: byItemScore(state.results),
        bySense: bySenseScore(state.results), byType: byTypeScore(state.results)
      };
      var ownDays = loadOwnDays();
      var allCount = loadAllDays().length;
      saveDay({
        day: allCount + 1,                  // 이전 버전 + 이번 버전 합산 카운트
        ownDay: ownDays.length + 1,
        date: new Date().toISOString(),
        train: pending.train,
        transfer: pending.transfer
      });
      window.__gtf_pending = null;
      renderTransferResult(sc, state.results, pending.train);
    }
  }

  // ===================================================================
  //  요약 화면 (R8: 첫 세션은 추이 대신 오늘 잡은 감각)
  // ===================================================================
  function senseBreakdownHtml(bySense) {
    var ids = Object.keys(bySense);
    ids.sort(function (a, b) {
      return ITEM_ORDER.indexOf(itemOfSense(a)) - ITEM_ORDER.indexOf(itemOfSense(b));
    });
    var h = "";
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      var d = bySense[id];
      if (d.t === 0) continue;
      var col = senseColor(id);
      h += '<div class="sense-row">' +
        '<span class="sense-dot" style="background:' + col + '"></span>' +
        '<span class="sense-name">' + esc(senseLabel(id)) + '</span>' +
        '<span class="sense-bar"><span class="sense-bar-fill" style="width:' + pct(d.c, d.t) + '%;background:' + col + '"></span></span>' +
        '<span class="sense-val">' + d.c + ' / ' + d.t + '</span>' +
      '</div>';
    }
    return h;
  }

  function renderTrainingSummary(sc, results, review) {
    var bySense = bySenseScore(results);
    var unseen = unseenTrainCount();
    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">' + (review ? "복습 끝" : "오늘 익히기 끝") + '</p>' +
        '<h2>오늘 잡은 감각</h2>' +
        '<div class="score-big">' + pct(sc.correct, sc.total) + '%</div>' +
        '<div class="score-sub">' + sc.correct + " / " + sc.total + " 문항</div>" +
        '<h3>감각별 (오늘 푼 문항 기준)</h3>' +
        '<div class="sense-list">' + senseBreakdownHtml(bySense) + '</div>' +
        '<p class="muted">위 막대는 <b>항목×감각 단위</b>예요 — 예: ‘keep·붙듦’과 ‘get·도달’을 따로 봅니다. ' +
          '오늘 어느 감각이 단단했고 어디가 흔들렸는지 보여요.</p>' +
        (unseen > 0
          ? '<p class="supply-note">아직 안 본 <b>새 문장이 ' + unseen + '개</b> 남아 있어요. 내일 또 새 문장으로 만나요.</p>'
          : '<p class="supply-note"><b>새 문장을 전부 봤어요.</b> 이제 익히기는 복습 모드(틀린 문장 우선)로 돌아가요.</p>') +
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

  function renderTransferResult(sc, results, train) {
    var trainPct = train ? pct(train.score.correct, train.score.total) : null;
    var bySense = bySenseScore(results);
    var transUnseen = unseenTransferCount();
    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">새 문장 테스트 끝</p>' +
        '<h2>오늘 결과</h2>' +
        '<div class="split-row">' +
          '<div class="split-cell">' +
            '<div class="label">익히기</div>' +
            '<div class="val">' + (trainPct === null ? "—" : trainPct + "%") + '</div>' +
            '<div class="small muted">' + (train ? train.score.correct + " / " + train.score.total : "기록 없음") + '</div>' +
          '</div>' +
          '<div class="split-cell highlight">' +
            '<div class="label">새 문장</div>' +
            '<div class="val">' + pct(sc.correct, sc.total) + '%</div>' +
            '<div class="small muted">' + sc.correct + " / " + sc.total + '</div>' +
          '</div>' +
        '</div>' +
        '<h3>새 문장 — 감각별</h3>' +
        '<div class="sense-list">' + senseBreakdownHtml(bySense) + '</div>' +
        (transUnseen > 0
          ? '<p class="supply-note">테스트할 새 문장이 <b>' + transUnseen + '개</b> 더 남아 있어요.</p>'
          : '<p class="supply-note">새 문장 테스트도 한 바퀴 다 돌았어요.</p>') +
        '<p class="honesty">이 점수는 ‘<b>알아보는 힘</b>’이에요 — 고르기를 잘해도 ' +
          '직접 말하기·쓰기는 따로 늘어요. (‘동사 꺼내 쓰기’는 그 중간 다리예요.)</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="go-progress2">내 코스 보기</button>' +
          '<button class="btn secondary" id="go-home2">처음으로</button>' +
        '</div>' +
      '</div>';
    document.getElementById("go-progress2").onclick = renderProgress;
    document.getElementById("go-home2").onclick = renderIntro;
    window.scrollTo(0, 0);
  }

  // ===================================================================
  //  진척 화면 — "Day N" 코스. 이전 버전(c2-2) 기록 합산. G6 정직 라벨.
  // ===================================================================
  function renderProgress() {
    state = null;
    var allDays = loadAllDays();
    var prevN = prevDayCount();
    var unseen = unseenTrainCount();
    var total = totalTrainCount();
    var done = total - unseen;

    var body;
    if (allDays.length === 0) {
      body = '<p class="empty-note">아직 기록이 없어요. 오늘 한 번 익히고 새 문장 테스트까지 마치면 ' +
        'Day 1이 여기 쌓입니다.</p>';
    } else {
      var supply =
        '<div class="supply-card">' +
          '<div class="supply-head">새 문장 공급</div>' +
          '<div class="supply-bar"><div class="supply-fill" style="width:' + pct(done, total) + '%"></div></div>' +
          '<div class="supply-meta"><b>' + done + ' / ' + total + '문장</b>을 봤어요 · ' +
            (unseen > 0 ? '아직 <b>새 문장 ' + unseen + '개</b> 남음' : '<b>한 바퀴 완주</b> — 복습 모드로') + '</div>' +
        '</div>';
      var dayTrend = (allDays.length === 1)
        ? firstDaySummary(allDays[0])
        : dayCourseBlock(allDays, prevN);
      var senseTrack = senseTrackBlock(allDays);
      body = supply + '<div class="section-gap"></div>' + dayTrend +
        '<div class="section-gap"></div>' + senseTrack;
    }

    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">내 기록 (본인 학습용)</p>' +
        '<h2>내 코스</h2>' +
        (prevN > 0
          ? '<p class="muted small">이전 버전(c2-2)에서 익힌 ' + prevN + '일 기록을 함께 담았어요 — Day 카운트와 추이에 합산됩니다.</p>'
          : "") +
        body +
        '<p class="honesty">이 기록은 ‘알아보는 힘’이 자라는 모습이에요 — 말하기·쓰기 실력을 그대로 증명하지는 않아요.</p>' +
        '<div class="btn-row">' +
          (unseen > 0
            ? '<button class="btn" id="pg-train">오늘 새 문장 익히기</button>'
            : '<button class="btn" id="pg-review">복습 모드</button>') +
          '<button class="btn secondary" id="pg-home">처음으로</button>' +
        '</div>' +
      '</div>';
    var pt = document.getElementById("pg-train");
    if (pt) pt.onclick = function () { startTraining(false); };
    var pr = document.getElementById("pg-review");
    if (pr) pr.onclick = function () { startTraining(true); };
    document.getElementById("pg-home").onclick = renderIntro;
    window.scrollTo(0, 0);
  }

  function firstDaySummary(day) {
    var combined = mergeSense(
      (day.train && day.train.bySense) || {},
      (day.transfer && day.transfer.bySense) || {}
    );
    return '<p class="muted">오늘이 <b>Day 1</b>이라 추이 대신 ‘오늘 잡은 감각’을 보여 드려요. ' +
      'Day 2부터는 일자별 추이가 그려집니다.</p>' +
      '<div class="sense-list">' + senseBreakdownHtml(combined) + '</div>';
  }

  // 일자별 코스 추이 — 이전 버전 Day는 흐리게(imported) 표시해 구분.
  function dayCourseBlock(days, prevN) {
    var cols = "";
    for (var i = 0; i < days.length; i++) {
      var d = days[i];
      var imported = !!d.__imported;
      var tp = (d.train && d.train.score && d.train.score.total) ? pct(d.train.score.correct, d.train.score.total) : 0;
      var xp = (d.transfer && d.transfer.score && d.transfer.score.total) ? pct(d.transfer.score.correct, d.transfer.score.total) : 0;
      var label = "Day " + (i + 1) + (imported ? '<br><span class="prev-mark">이전</span>' : "");
      cols +=
        '<div class="day-col">' +
          '<div class="day-bars">' +
            '<div class="day-bar train' + (imported ? " imported" : "") + '" style="height:' + tp + '%" title="익히기 ' + tp + '%"><span class="day-bar-val">' + tp + '</span></div>' +
            '<div class="day-bar transfer' + (imported ? " imported" : "") + '" style="height:' + xp + '%" title="새 문장 ' + xp + '%"><span class="day-bar-val">' + xp + '</span></div>' +
          '</div>' +
          '<div class="day-x">' + label + '</div>' +
        '</div>';
    }
    return '<div class="chart-block">' +
      '<h3>일자별 정답률</h3>' +
      '<div class="day-grid">' + cols + '</div>' +
      '<div class="legend"><span class="lg train"></span>익히기 <span class="lg transfer"></span>새 문장' +
        (prevN > 0 ? ' <span class="lg imported"></span>흐린 막대 = 이전 버전 기록' : "") + '</div>' +
      '</div>';
  }

  function senseTrackBlock(days) {
    var acc = {};
    for (var i = 0; i < days.length; i++) {
      var d = days[i];
      acc = mergeSense(acc, (d.train && d.train.bySense) || {});
      acc = mergeSense(acc, (d.transfer && d.transfer.bySense) || {});
    }
    if (Object.keys(acc).length === 0) {
      return '<div class="chart-block"><h3>감각별 추적</h3><p class="empty-note small">아직 기록이 없어요.</p></div>';
    }
    return '<div class="chart-block">' +
      '<h3>감각별 추적 (코스 누적)</h3>' +
      '<p class="muted small">항목×감각 단위 정답률이에요 — 예: ‘keep·붙듦’ 80% / ‘get·도달’ 60%처럼 어느 감각이 자랐는지 따로 봅니다.</p>' +
      '<div class="sense-list">' + senseBreakdownHtml(acc) + '</div>' +
      '</div>';
  }

  function mergeSense(a, b) {
    var out = {};
    var keys = Object.keys(a).concat(Object.keys(b));
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (out[k]) continue;
      var da = a[k] || { c: 0, t: 0 };
      var db = b[k] || { c: 0, t: 0 };
      out[k] = { c: da.c + db.c, t: da.t + db.t };
    }
    return out;
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
  if (!ALL || !ALL.have || !ALL.get || !ALL.take || !ALL.make || !ALL.keep ||
      !ALL.up || !ALL.out || !ALL["phrasal-up"]) {
    app.innerHTML = '<div class="card"><h2>콘텐츠를 불러오지 못했어요</h2>' +
      '<p class="muted">data.js가 같은 폴더에 있는지 확인해 주세요.</p></div>';
    return;
  }
  renderIntro();
})();
