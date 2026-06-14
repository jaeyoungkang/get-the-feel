/* get-the-feel · c4-2 — 8개 감각, 128문장. C4 진화 #4 (제약형 산출, V3).
 *
 * fresh start — c4-1(동결된 대표 후보·배포)에서 코드를 복사하지 않고 *교훈만* 재구현한다.
 * 계승 (c4-1 → 재구현): 인식 모드(오늘의 새 문장 / 감각 골라 집중) · 통계(항목×감각 추이) ·
 *   G11(질문 단서 차단) · G12(정답 후 해석) · G13(라벨 폭 fit) · G14(피드백 위계)
 *   · 공간 메타포(G1·G7·G8·G9·G16) · 분리 계약(separation-surface).
 *
 * c4-2 신규 — "써보기(산출)" 모드 = V3:
 *   기존 코퍼스 128문장에서 산출 과제를 *파생*(새 콘텐츠 저작 없음). 난이도 3단:
 *     ① 빈칸 타이핑(쉬움): verb-choice/sense-cloze 문항의 ___에 보기를 *지우고* 직접 타이핑.
 *        정규화 문자열 일치로 자동 채점. (고르기→인출의 반보)
 *     ② 어순 재배열(중간): 아무 문항 sentence를 단어 토큰으로 쪼개 셔플 → 탭해서 순서 배열.
 *        정규화 후 원문 단어 순서와 일치하면 정답.
 *     ③ 전문 쓰기(어려움): sentence_ko(한국어) + 목표 감각 힌트 → 영어 작성 → 모범문(원문) +
 *        자가채점 rubric 3항. **스스로 채점 — 약한 verdict** 정직 라벨 필수.
 *   인식≠산출 분리: 산출 점수는 인식 통계와 합치지 않는다 — 별도 "꺼내 쓰는 힘".
 *   전문 쓰기 자가점수는 약한 verdict로 명시.
 *
 * 데이터: window.CONTENT_ALL = 8파일 verbatim. localStorage prefix gtf-c4-2-.
 */
(function () {
  "use strict";

  var ALL = window.CONTENT_ALL;
  var STORE_PREFIX = "gtf-c4-2-";
  var TRAIN_COUNT = 15;            // 인식 일일/집중 세션 출제 수
  var TRANSFER_COUNT = 5;          // 인식 전이 세션 출제 수
  var MIN_ITEMS_PER_SESSION = 4;   // 일일 믹스 — 세션마다 골고루 최소 항목 수
  var PRODUCE_COUNT = 10;          // 산출 한 세션 10문항

  var app = document.getElementById("app");

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

  // ---- 표시 헬퍼 (G10: 호출부보다 먼저 정의) ----
  // itemColor·itemShort·senseLabel·senseColor 는 *피드백/진척/산출 결과 화면 전용*.
  // 인식 질문 렌더(renderQuestion)에서는 호출하지 않는다 (G11 단서 차단).
  var ITEM_COLOR = {
    "have": "#8a5a8f", "get": "#2f6db0", "take": "#b07b2f", "make": "#9c4f6e",
    "keep": "#15786b", "up": "#3a6b5c", "out": "#3b7b86", "phrasal-up": "#5a59a8"
  };
  var ITEM_SHORT = {
    "have": "have", "get": "get", "take": "take", "make": "make",
    "keep": "keep", "up": "up", "out": "out", "phrasal-up": "V+up"
  };
  var ITEM_LABEL = {
    "have": "have — 영역 안에 있음", "get": "get — 밖에서 안으로 도달",
    "take": "take — 손 뻗어 잡아옴", "make": "make — 새로 빚어냄",
    "keep": "keep — 붙들어 유지", "up": "up — 위로 / 끝까지",
    "out": "out — 안에서 밖으로", "phrasal-up": "구동사 — 그림의 합"
  };
  var SENSE_LABEL = {
    "have-domain-location": "대상이 영역 안에", "have-event-in-domain": "사건이 영역 안에",
    "get-arrival": "밖에서 안으로 도달", "get-state-change": "상태로 옮겨 감",
    "get-into-state": "결과 상태로 진입(get+과거분사)",
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
  function itemLabel(key) { return ITEM_LABEL[key] || key; }
  function typeLabel(type) {
    if (type === "verb-choice") return "동사 고르기";
    if (type === "sense-cloze") return "불변화사 고르기";
    return "그림 고르기";
  }
  function senseLabel(id) { return SENSE_LABEL[id] || id; }
  function senseColor(id) {
    if (id === "opaque-idiom") return "#5d5650";
    if (id.indexOf("compose-") === 0) return ITEM_COLOR["phrasal-up"];
    var key = itemOfSense(id);
    return itemColor(key || String(id).split("-")[0]);
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
  // 문장 정규화 — 소문자, 공백 접기, 양끝 구두점 제거 (verdict normSentence와 동일 정신).
  function normWord(s) {
    return String(s).toLowerCase().replace(/[.,!?;:"'’]/g, "").trim();
  }
  function normSentenceCmp(s) {
    return String(s).toLowerCase().replace(/[.,!?;:"'’]/g, " ").replace(/\s+/g, " ").trim();
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
  //  localStorage — prefix gtf-c4-2-
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
    catch (e) { /* file:// localStorage 비활성 — 진척만 비저장 */ }
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
  function loadDays() {
    try {
      var raw = window.localStorage.getItem(STORE_PREFIX + "days");
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveDay(rec) {
    try {
      var days = loadDays();
      days.push(rec);
      window.localStorage.setItem(STORE_PREFIX + "days", JSON.stringify(days));
    } catch (e) { /* 무시 */ }
  }
  // 산출 기록 — 인식과 *분리된* 저장소(별 키). "꺼내 쓰는 힘".
  function loadProduceLog() {
    try {
      var raw = window.localStorage.getItem(STORE_PREFIX + "produce");
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveProduceSession(rec) {
    try {
      var log = loadProduceLog();
      log.push(rec);
      window.localStorage.setItem(STORE_PREFIX + "produce", JSON.stringify(log));
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
  //  buildTrainingPool 은 training_items 만, buildTransferPool 은 transfer_items 만.
  // ===================================================================
  function allTrainingItems() {
    var out = [];
    for (var ci = 0; ci < ITEM_ORDER.length; ci++) {
      var key = ITEM_ORDER[ci];
      var content = ALL[key];
      if (!content || !content.training_items) continue;
      for (var i = 0; i < content.training_items.length; i++) {
        out.push({ item: content.training_items[i], srcKey: key, axis: content.axis });
      }
    }
    return out;
  }
  function allTransferItems() {
    var out = [];
    for (var ci = 0; ci < ITEM_ORDER.length; ci++) {
      var key = ITEM_ORDER[ci];
      var content = ALL[key];
      if (!content || !content.transfer_items) continue;
      for (var i = 0; i < content.transfer_items.length; i++) {
        out.push({ item: content.transfer_items[i], srcKey: key, axis: content.axis });
      }
    }
    return out;
  }

  // 일일 훈련 공급(기본, R6 믹스): 미출제 우선 → 골고루 + 유형 3종 + 구동사 시 관용 반례.
  function buildTrainingPool(review, focusItem) {
    var pool = allTrainingItems();   // training_items 전용 (분리 계약: 전이 배열 미참조)
    if (focusItem) pool = pool.filter(function (e) { return e.srcKey === focusItem; });

    var seenKey = focusItem ? ("seen-train-" + focusItem) : "seen-train";
    var seen = loadSet(seenKey);
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
    if (!focusItem) {
      sel = ensureItemSpread(sel, pool, TRAIN_COUNT);
      sel = ensureIdiomCounterexample(sel, pool, TRAIN_COUNT);
    }
    sel = ensureTypeCoverage(sel, pool, TRAIN_COUNT);
    return shuffle(sel);
  }

  // 일일 전이 공급: 미출제 우선 5문항.
  function buildTransferPool(focusItem) {
    var pool = allTransferItems();   // transfer_items 전용 (분리 계약: 훈련 배열 미참조)
    if (focusItem) pool = pool.filter(function (e) { return e.srcKey === focusItem; });
    var seenKey = focusItem ? ("seen-trans-" + focusItem) : "seen-trans";
    var seen = loadSet(seenKey);
    var unseen = pool.filter(function (e) { return !seen[e.item.id]; });
    var seenAgain = pool.filter(function (e) { return seen[e.item.id]; });
    var ranked = shuffle(unseen).concat(shuffle(seenAgain));
    var sel = ranked.slice(0, TRANSFER_COUNT);
    sel = ensureTypeCoverage(sel, pool, sel.length);
    return shuffle(sel);
  }

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

  // R10 — 구동사(phrasal-up) 문항이 세션에 있으면 관용 반례(opaque-idiom) 1개 포함.
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

  function unseenTrainCount(focusItem) {
    var pool = allTrainingItems();
    if (focusItem) pool = pool.filter(function (e) { return e.srcKey === focusItem; });
    var seen = loadSet(focusItem ? ("seen-train-" + focusItem) : "seen-train");
    var n = 0;
    for (var i = 0; i < pool.length; i++) if (!seen[pool[i].item.id]) n++;
    return n;
  }
  function unseenTransferCount(focusItem) {
    var pool = allTransferItems();
    if (focusItem) pool = pool.filter(function (e) { return e.srcKey === focusItem; });
    var seen = loadSet(focusItem ? ("seen-trans-" + focusItem) : "seen-trans");
    var n = 0;
    for (var i = 0; i < pool.length; i++) if (!seen[pool[i].item.id]) n++;
    return n;
  }
  function totalTrainCount(focusItem) {
    var pool = allTrainingItems();
    if (focusItem) pool = pool.filter(function (e) { return e.srcKey === focusItem; });
    return pool.length;
  }

  // ===================================================================
  //  공간 메타포 SVG (G1·G7·G8·G9·G16). 라벨 폭 fit (G13). *피드백 단계에서만 호출*.
  // ===================================================================
  function fitText(label, maxW, baseSize) {
    var s = String(label);
    var size = baseSize;
    var est = function (n, fs) { return n * fs * 0.58; };
    if (est(s.length, size) > maxW) size = Math.max(9, Math.floor(baseSize * maxW / est(s.length, baseSize)));
    if (size <= 9 && est(s.length, 9) > maxW) {
      var keep = Math.max(4, Math.floor(maxW / (9 * 0.58)) - 1);
      s = s.slice(0, keep) + "…";
      size = 9;
    }
    return { text: s, size: size };
  }
  function chip(x, y, w, h, col, label) {
    var f = fitText(label, w - 12, 12);
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" fill="#ffffff" stroke="' + col + '" stroke-width="2"/>' +
      '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 5) + '" text-anchor="middle" font-size="' + f.size + '" fill="#232020" font-weight="600">' + esc(f.text) + '</text>';
  }

  function svgHave(subjectLabel, objectLabel, settle, compact) {
    var col = itemColor("have");
    var cls = settle ? "viz-settle settle" : "viz-settle";
    var startStyle = settle ? "" : ' style="transform: translateY(-46px); opacity:0.35;"';
    var vb = compact ? '0 0 200 160' : '0 0 320 200';
    var cx = compact ? 100 : 160, cy = compact ? 86 : 104, rx = compact ? 74 : 96, ry = compact ? 54 : 64;
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="대상 칩이 영역 원 안에 정적으로 자리한 그림">' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#f3edf4" stroke="' + col + '" stroke-width="2"/>' +
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(fitText(subjectLabel, rx * 1.5, 11).text) + ' 영역</text>' +
        '<g class="' + cls + '"' + startStyle + '>' +
          chip(cx - 52, cy - 16, 104, 36, col, objectLabel) +
        '</g>' +
        '<text x="' + cx + '" y="' + (cy + ry - 4) + '" text-anchor="middle" font-size="10" fill="#a89aa9">힘 없이 그냥 놓임</text>' +
      '</svg>'
    );
  }
  function svgKeep(subjectLabel, objectLabel, settle, compact) {
    var col = itemColor("keep");
    var claspCls = settle ? "viz-clasp settle" : "viz-clasp";
    var handCls = settle ? "viz-hand settle" : "viz-hand";
    var chipStart = settle ? "" : ' style="transform: translateX(40px); opacity:0.55;"';
    var handStart = settle ? "" : ' style="transform: translateY(-26px) rotate(-14deg); opacity:0.4;"';
    var vb = compact ? '0 0 200 160' : '0 0 320 200';
    var cx = compact ? 96 : 150, cy = compact ? 90 : 110, rx = compact ? 70 : 94, ry = compact ? 54 : 64;
    var edgeX = cx + rx;
    var outX = compact ? 188 : 300;
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="영역 안 대상이 밖으로 흘러나가려는데 손이 눌러 붙드는 그림">' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#e3f2ef" stroke="' + col + '" stroke-width="2"/>' +
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(fitText(subjectLabel, rx * 1.5, 11).text) + ' 영역</text>' +
        '<line x1="' + (edgeX - 14) + '" y1="' + (cy - 22) + '" x2="' + (outX - 6) + '" y2="' + (cy - 22) + '" stroke="#bf6b5a" stroke-width="2" stroke-dasharray="4 4" opacity="0.85"/>' +
        '<path d="M' + outX + ' ' + (cy - 22) + ' L' + (outX - 12) + ' ' + (cy - 28) + ' L' + (outX - 12) + ' ' + (cy - 16) + ' Z" fill="#bf6b5a" opacity="0.85"/>' +
        '<text x="' + (outX - 2) + '" y="' + (cy - 32) + '" font-size="9.5" fill="#bf6b5a" text-anchor="end">나가려는 흐름</text>' +
        '<g class="' + claspCls + '"' + chipStart + '>' +
          chip(cx - 44, cy - 12, 96, 36, col, objectLabel) +
        '</g>' +
        '<g class="' + handCls + '"' + handStart + '>' +
          '<path d="M' + (cx - 30) + ' ' + (cy - 24) + ' q30 -22 64 0" fill="none" stroke="' + col + '" stroke-width="4" stroke-linecap="round"/>' +
          '<line x1="' + (cx - 12) + '" y1="' + (cy - 28) + '" x2="' + (cx - 12) + '" y2="' + (cy - 14) + '" stroke="' + col + '" stroke-width="4" stroke-linecap="round"/>' +
          '<line x1="' + (cx + 14) + '" y1="' + (cy - 28) + '" x2="' + (cx + 14) + '" y2="' + (cy - 14) + '" stroke="' + col + '" stroke-width="4" stroke-linecap="round"/>' +
        '</g>' +
        '<text x="' + cx + '" y="' + (cy + ry - 4) + '" text-anchor="middle" font-size="10" fill="' + col + '">손이 눌러 붙듦 (대항력)</text>' +
      '</svg>'
    );
  }
  function svgGet(subjectLabel, objectLabel, settle, compact) {
    var col = itemColor("get");
    var cls = settle ? "viz-slide settle" : "viz-slide";
    var startStyle = settle ? "" : ' style="transform: translateX(-104px); opacity:0.4;"';
    var vb = compact ? '0 0 200 150' : '0 0 320 200';
    var cx = compact ? 118 : 188, cy = compact ? 80 : 104, rx = compact ? 60 : 86, ry = compact ? 48 : 62;
    var ax = compact ? 8 : 18;
    var chipW = compact ? 150 : 160;
    return (
      '<svg viewBox="' + vb + '" role="img" aria-label="대상이 영역 원 밖에서 화살표를 따라 안으로 들어와 닿는 그림">' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#eef4fa" stroke="' + col + '" stroke-width="2"/>' +
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(fitText(subjectLabel, rx * 1.5, 11).text) + ' 영역</text>' +
        '<line x1="' + ax + '" y1="' + cy + '" x2="' + (cx - 6) + '" y2="' + cy + '" stroke="' + col + '" stroke-width="3" stroke-dasharray="4 4"/>' +
        '<path d="M' + cx + ' ' + cy + ' L' + (cx - 16) + ' ' + (cy - 8) + ' L' + (cx - 16) + ' ' + (cy + 8) + ' Z" fill="' + col + '"/>' +
        '<text x="' + (ax + 6) + '" y="' + (cy - 12) + '" font-size="10" fill="#8d867d">밖</text>' +
        '<g class="' + cls + '"' + startStyle + '>' +
          chip(cx - chipW / 2, cy - 16, chipW, 36, col, objectLabel) +
        '</g>' +
      '</svg>'
    );
  }
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
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(fitText(subjectLabel, rx * 1.5, 11).text) + ' 영역</text>' +
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
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(fitText(subjectLabel, rx * 1.5, 11).text) + ' 손끝</text>' +
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
        '<text x="' + cx + '" y="' + (fillTop + fillH / 2 + 4) + '" text-anchor="middle" font-size="12" fill="#ffffff" font-weight="700">' + esc(fitText(objectLabel, wWidth - 8, 12).text) + '</text>' +
      '</svg>'
    );
  }
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
        '<text x="' + cx + '" y="' + (cy - ry + 16) + '" text-anchor="middle" font-size="11" fill="' + col + '">' + esc(fitText(subjectLabel, rx * 1.5, 11).text) + ' (안)</text>' +
        '<line x1="' + (cx + rx - 6) + '" y1="' + cy + '" x2="' + (outX - 6) + '" y2="' + cy + '" stroke="' + col + '" stroke-width="3" stroke-dasharray="4 4"/>' +
        '<path d="M' + outX + ' ' + cy + ' L' + (outX - 16) + ' ' + (cy - 8) + ' L' + (outX - 16) + ' ' + (cy + 8) + ' Z" fill="' + col + '"/>' +
        '<text x="' + (outX - 2) + '" y="' + (cy - 12) + '" font-size="10" fill="#8d867d" text-anchor="end">밖</text>' +
        '<g class="' + cls + '"' + startStyle + '>' +
          chip(cx + rx - 20, cy - 16, 92, 36, col, objectLabel) +
        '</g>' +
      '</svg>'
    );
  }
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
      case "get-into-state":
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
  function getIntoStateContrastViz(item, startSettle) {
    var subj = item.subject_label, obj = item.object_label;
    return (
      '<div class="contrast-wrap into">' +
        '<div class="contrast-label">get + 과거분사 ↔ be — 진입 사건인가, 상태에 머묾인가</div>' +
        '<div class="contrast-row">' +
          '<div class="contrast-cell into">' +
            '<div class="contrast-mini">' + svgGet(subj, obj, startSettle, true) + '</div>' +
            '<div class="contrast-cap"><b>get + pp</b> — 결과 상태로 스스로 들어가 닿음</div>' +
          '</div>' +
          '<div class="contrast-cell have">' +
            '<div class="contrast-mini">' + svgHave(subj, obj, true, true) + '</div>' +
            '<div class="contrast-cap"><b>be + pp</b> — 그 상태에 그냥 머물러 있음</div>' +
          '</div>' +
        '</div>' +
        '<div class="contrast-note">get married는 결혼한 상태로 <b>막 진입</b>(스스로 그 상태가 됨), ' +
          'be married는 부부인 <b>상태에 머묾</b>이에요.</div>' +
      '</div>'
    );
  }

  function compositionViz(item) {
    var senseId = item.sense_id;
    var isVertical = senseId === "compose-vertical";
    var verbWord = item.verb_label || "(동사)";
    var verbMini =
      '<svg viewBox="0 0 140 120" role="img" aria-label="동사의 동작 그림">' +
        '<rect x="22" y="48" width="96" height="34" rx="9" fill="#ffffff" stroke="#574f47" stroke-width="2"/>' +
        '<text x="70" y="70" text-anchor="middle" font-size="12" fill="#232020" font-weight="600">' + esc(fitText(verbWord, 88, 12).text) + '</text>' +
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
          '<text x="120" y="66" text-anchor="middle" font-size="12" fill="#232020" font-weight="600">' + esc(fitText(item.object_label, 96, 12).text) + '</text>' +
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
        '<text x="110" y="92" text-anchor="middle" font-size="12" fill="#ffffff" font-weight="700">' + esc(fitText(item.object_label, 96, 12).text) + '</text>' +
        '<text x="110" y="158" text-anchor="middle" font-size="10" fill="#8d867d">동작 + 끝까지가 한 장면에</text>' +
      '</svg>'
    );
  }
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
          '<b>굳은 관용 표현</b>이에요. 통째로 익히는 게 정직합니다.</div>' +
        '<div class="idiom-warn">모든 구동사가 두 그림의 합은 아니에요. 합으로 풀리는 것(drink up, pack up)과 ' +
          '통째로 외울 것(make up, bring up, look up)을 구분하는 눈이 진짜 실력이에요.</div>' +
      '</div>'
    );
  }

  // ===================================================================
  //  세션 상태 머신 (인식 + 산출 공용 슬롯)
  // ===================================================================
  var state = null;

  function startTraining(review, focusItem) {
    state = {
      kind: "recognition",
      mode: "training", review: !!review, focusItem: focusItem || null,
      focusShort: focusItem ? itemShort(focusItem) : null,
      entries: buildTrainingPool(review, focusItem || null),
      idx: 0, results: [], senseSeen: {}, currentChoices: null
    };
    renderQuestion();
  }
  function startTransfer(focusItem) {
    state = {
      kind: "recognition",
      mode: "transfer", focusItem: focusItem || null,
      focusShort: focusItem ? itemShort(focusItem) : null,
      entries: buildTransferPool(focusItem || null),
      idx: 0, results: [], senseSeen: {}, currentChoices: null
    };
    renderQuestion();
  }

  // ===================================================================
  //  인트로 + 모드 선택 — 알아보기(인식) / 써보기(산출)
  // ===================================================================
  function renderIntro() {
    state = null;
    var days = loadDays();
    var produceLog = loadProduceLog();
    var unseen = unseenTrainCount(null);
    var total = totalTrainCount(null);
    var done = total - unseen;
    var dayNo = days.length + 1;

    var status;
    if (days.length === 0) {
      status = '<p class="position-note">처음이시네요. 오늘이 <b>Day 1</b>이에요. ' +
        '8개 감각을 먼저 <b>그림으로 알아보고</b>, 익숙해지면 <b>직접 써 보며</b> 꺼내 쓰는 힘을 길러요.</p>';
    } else if (unseen > 0) {
      status = '<p class="position-note"><b>Day ' + dayNo + '</b> · 지금까지 ' + done + ' / ' + total +
        '문장을 봤어요. <b>아직 안 본 새 문장이 ' + unseen + '개</b> 남아 있어요.</p>';
    } else {
      status = '<p class="position-note"><b>전체 한 바퀴 완주</b>를 마쳤어요. 복습 + <b>써보기</b>로 ' +
        '감각을 꺼내 쓰는 연습을 할 때예요.</p>';
    }

    var recognitionBlock =
      '<div class="mode-block primary">' +
        '<div class="mode-title">① 알아보기 — 고르기 <span class="mode-tag">기본</span></div>' +
        '<p class="mode-desc">8개 감각을 그림으로 고르며 익혀요. 미출제 우선으로 15문항. ' +
          '<span class="mode-hint">매일 오면 새 문장이에요. 약한 감각만 골라 집중할 수도 있어요.</span></p>' +
        (unseen > 0
          ? '<button class="btn" id="go-train">오늘 새 문장 익히기</button>'
          : '<button class="btn" id="go-review">복습 모드 (틀린 문장 우선)</button>') +
        '<div class="focus-chips" id="focus-chips" style="margin-top:10px">' + focusChipsHtml() + '</div>' +
      '</div>';

    // 신규 — 써보기(산출) 모드. 난이도 3단.
    var produceBlock =
      '<div class="mode-block produce">' +
        '<div class="mode-title">② 써보기 — 써서 익히기 <span class="mode-tag new">새 기능</span></div>' +
        '<p class="mode-desc">고를 줄 알게 됐다면, 이제 <b>직접 써 보며</b> 감각을 꺼내 써요. ' +
          '같은 문장으로 만드는 산출 연습이에요 (한 세션 10문항).' +
          '<span class="mode-hint">‘알아보는 힘’과 ‘꺼내 쓰는 힘’은 따로 늘어요 — 점수도 따로 봅니다.</span></p>' +
        '<div class="diff-row">' +
          '<button class="diff-chip" data-diff="blank">' +
            '<span class="diff-name">빈칸 타이핑 <span class="lvl">쉬움</span></span>' +
            '<span class="diff-desc">보기 없이 빈칸에 들어갈 단어를 직접 쳐 넣어요.</span></button>' +
          '<button class="diff-chip" data-diff="reorder">' +
            '<span class="diff-name">어순 재배열 <span class="lvl">중간</span></span>' +
            '<span class="diff-desc">섞인 단어 카드를 올바른 순서로 놓아 문장을 만들어요.</span></button>' +
          '<button class="diff-chip" data-diff="write">' +
            '<span class="diff-name">전문 쓰기 <span class="lvl">어려움</span></span>' +
            '<span class="diff-desc">한국어 뜻과 감각 힌트만 보고 영어 문장을 직접 써요. (스스로 채점)</span></button>' +
        '</div>' +
      '</div>';

    var statsLink =
      (days.length > 0 || produceLog.length > 0
        ? '<div class="btn-row">' +
            '<button class="btn secondary" id="go-progress">내 기록 · 감각 통계 보기</button>' +
          '</div>'
        : '<p class="muted small stats-hint">오늘 세션을 <b>새 문장 테스트까지</b> 마치면 ' +
            '‘어떤 감각이 늘고 있는지’ 통계가 여기 쌓여요.</p>');

    var aboutDetails =
      '<details class="intro-about">' +
        '<summary>이 도구가 뭐예요? · 이번에 바뀐 점</summary>' +
        '<p class="promise">단어를 뜻으로 외우는 대신, 그 단어가 <b>그리는 그림</b>으로 감각을 잡아요. ' +
          'get은 ‘밖에서 안으로 도달’ — get a text(도착), get tired(상태로), get married(결과 상태로 진입)까지 한 그림이에요.</p>' +
        '<div class="whatsnew">이번에 바뀐 점: <b>‘써보기’가 생겼어요.</b> 고르기(알아보기)만으론 입이 잘 안 열려요 — ' +
          '같은 문장을 <b>직접 써 보는</b> 산출 연습을 난이도 3단(빈칸 타이핑·어순 재배열·전문 쓰기)으로 더했어요. ' +
          '꺼내 쓰는 힘은 알아보는 힘과 따로 자라요.</div>' +
      '</details>';

    app.innerHTML =
      '<div class="card intro">' +
        '<p class="kicker">8개 감각, 128문장</p>' +
        '<h1>8개 감각을 <b>알아보고</b>, 이제 <b>써 봅니다</b></h1>' +
        status +
        '<div class="mode-select">' + recognitionBlock + produceBlock + '</div>' +
        statsLink +
        aboutDetails +
      '</div>';

    var t = document.getElementById("go-train");
    if (t) t.onclick = function () { startTraining(false, null); };
    var r = document.getElementById("go-review");
    if (r) r.onclick = function () { startTraining(true, null); };
    wireFocusChips();
    wireDiffChips();
    var gp = document.getElementById("go-progress");
    if (gp) gp.onclick = renderProgress;
    window.scrollTo(0, 0);
  }

  function focusChipsHtml() {
    var h = "";
    for (var ci = 0; ci < ITEM_ORDER.length; ci++) {
      var key = ITEM_ORDER[ci];
      var un = unseenTrainCount(key);
      var tot = totalTrainCount(key);
      var sub = un > 0 ? ("새 문장 " + un + "개") : "완주 · 복습";
      h += '<button class="focus-chip" data-item="' + esc(key) + '" style="border-color:' + itemColor(key) + '">' +
        '<span class="fc-dot" style="background:' + itemColor(key) + '"></span>' +
        '<span class="fc-name">' + esc(itemLabel(key)) + '</span>' +
        '<span class="fc-sub">' + sub + ' · 총 ' + tot + '</span>' +
      '</button>';
    }
    return h;
  }
  function wireFocusChips() {
    var wrap = document.getElementById("focus-chips");
    if (!wrap) return;
    var chips = wrap.querySelectorAll(".focus-chip");
    for (var i = 0; i < chips.length; i++) {
      chips[i].onclick = function () {
        var key = this.getAttribute("data-item");
        var review = unseenTrainCount(key) === 0;
        startTraining(review, key);
      };
    }
  }
  function wireDiffChips() {
    var chips = app.querySelectorAll(".diff-chip");
    for (var i = 0; i < chips.length; i++) {
      chips[i].onclick = function () {
        startProduce(this.getAttribute("data-diff"));
      };
    }
  }

  // ===================================================================
  //  인식 질문 렌더 (G11) — 단서 차단: 항목명/감각명/항목색/sentence_ko 미노출.
  //    이 함수는 itemColor / itemShort / senseLabel / senseColor / item-pill 을 호출하지 않는다.
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

    var focusTag = state.focusShort
      ? '<span class="focus-flag">집중: ' + esc(state.focusShort) + '</span>'
      : "";
    var headLabel = isTransfer ? "새 문장" : (state.review ? "복습" : "오늘 익히기");
    var isWord = (type === "verb-choice" || type === "sense-cloze");

    var html =
      '<div class="card question">' +
        focusTag +
        (isTransfer
          ? '<span class="new-flag">새 문장 테스트 — 익히기에 없던 문장이에요</span>'
          : (state.review
            ? '<span class="review-flag">복습 — 전에 틀린 문장 우선</span>'
            : "")) +
        '<div class="progress-head">' +
          '<span>' + headLabel + " " + n + " / " + total + '</span>' +
          '<span class="type-pill">' + typeLabel(type) + '</span>' +
        '</div>' +
        '<div class="progress-track"><div class="progress-fill" style="width:' + fill + '%"></div></div>' +
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
  //  인식 피드백 렌더 (정답 후) — item-pill·sentence_ko·메타포가 사는 유일한 곳 (G11·G12·G14).
  // ===================================================================
  function renderFeedback(entry, correct, fatigued) {
    var item = entry.item;
    var type = itemType(item);
    var answerWord = item.choices[item.answer_index];
    var isWord = (type === "verb-choice" || type === "sense-cloze");
    var isLast = state.idx + 1 >= state.entries.length;
    var autoNext = loadAutoNext();

    var sentenceBlock = isWord
      ? '<p class="filled-sentence">' + renderFilledSentence(item, answerWord) + '</p>'
      : "";
    var interpBlock = item.sentence_ko
      ? '<p class="interp"><span class="interp-label">해석</span>' +
          '<span class="interp-text">' + esc(item.sentence_ko) + '</span></p>'
      : "";

    var boundary = boundaryHtml(item);
    var detailBlock =
      '<details class="why-details">' +
        '<summary>왜 그런지 / 문법 메모</summary>' +
        '<p class="why">' + esc(item.why_ko) + '</p>' +
        boundary +
      '</details>';

    var fb = document.getElementById("feedback");
    fb.innerHTML =
      '<div class="feedback">' +
        '<div class="feedback-head">' +
          '<span class="item-pill" style="background:' + itemColor(entry.srcKey) + '">' + esc(itemShort(entry.srcKey)) + '</span>' +
          '<p class="verdict ' + (correct ? "ok" : "no") + '">' +
            (correct ? "맞았어요 — 이 그림이에요." : "다시 — 이 그림을 보세요.") + '</p>' +
        '</div>' +
        sentenceBlock +
        interpBlock +
        feedbackViz(item, type, correct, fatigued) +
        '<div class="btn-row">' +
          '<button class="btn" id="next-q">' + (isLast ? "결과 보기" : "다음 문항") + '</button>' +
          '<label class="autonext-toggle">' +
            '<input type="checkbox" id="autonext"' + (autoNext ? " checked" : "") + ' /> 맞히면 자동 넘기기' +
          '</label>' +
        '</div>' +
        detailBlock +
      '</div>';

    document.getElementById("autonext").onchange = function () { saveAutoNext(this.checked); };
    document.getElementById("next-q").onclick = nextQuestion;

    try {
      var head = fb.querySelector(".feedback-head");
      if (head && head.scrollIntoView) head.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) { /* 무시 */ }

    if (fatigued && correct) { /* 이미 settle */ }
    else if (correct) { triggerSettle(fb); }
    else { window.setTimeout(function () { triggerSettle(fb); }, 1000); }

    if (autoNext && correct) {
      window.setTimeout(function () {
        var btn = document.getElementById("next-q");
        if (btn) nextQuestion();
      }, 1300);
    }
  }

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
    if (isKeep(senseId)) {
      return vizBox(senseId, subj, obj, startSettle, "이 그림 — " + senseLabel(senseId)) + keepContrastViz(item, startSettle);
    }
    if (senseId === "get-into-state") {
      return vizBox(senseId, subj, obj, startSettle, "이 그림 — " + senseLabel(senseId)) + getIntoStateContrastViz(item, startSettle);
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
    else if (id === "get-into-state") head = "be와 갈리는 자리 (진입 vs 머묾):";
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
    var raf = window.requestAnimationFrame || function (f) { return window.setTimeout(f, 16); };
    raf(function () {
      raf(function () {
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
    var focusItem = state.focusItem;
    if (state.mode === "training") {
      var seenKey = focusItem ? ("seen-train-" + focusItem) : "seen-train";
      addToSet(seenKey, state.results.map(function (r) { return r.id; }));
      window.__gtf_pending = {
        review: state.review, focusItem: focusItem,
        train: {
          score: sc, byItem: byItemScore(state.results),
          bySense: bySenseScore(state.results), byType: byTypeScore(state.results)
        }
      };
      renderTrainingSummary(sc, state.results, state.review, focusItem);
    } else {
      var seenKeyX = focusItem ? ("seen-trans-" + focusItem) : "seen-trans";
      addToSet(seenKeyX, state.results.map(function (r) { return r.id; }));
      var pending = window.__gtf_pending || { train: null, focusItem: focusItem };
      pending.transfer = {
        score: sc, byItem: byItemScore(state.results),
        bySense: bySenseScore(state.results), byType: byTypeScore(state.results)
      };
      var days = loadDays();
      saveDay({
        day: days.length + 1,
        date: new Date().toISOString(),
        focusItem: pending.focusItem || focusItem || null,
        train: pending.train,
        transfer: pending.transfer
      });
      window.__gtf_pending = null;
      renderTransferResult(sc, state.results, pending.train, focusItem);
    }
  }

  // ===================================================================
  //  인식 요약 화면
  // ===================================================================
  function senseBreakdownHtml(bySense) {
    var ids = Object.keys(bySense);
    ids.sort(function (a, b) {
      return (ITEM_ORDER.indexOf(itemOfSense(a)) - ITEM_ORDER.indexOf(itemOfSense(b)));
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

  function renderTrainingSummary(sc, results, review, focusItem) {
    var bySense = bySenseScore(results);
    var unseen = unseenTrainCount(focusItem);
    var modeLabel = focusItem ? ("집중: " + itemShort(focusItem)) : (review ? "복습" : "오늘 익히기");
    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">' + esc(modeLabel) + ' 끝</p>' +
        '<h2>오늘 잡은 감각</h2>' +
        '<div class="score-big">' + pct(sc.correct, sc.total) + '%</div>' +
        '<div class="score-sub">' + sc.correct + " / " + sc.total + " 문항</div>" +
        '<h3>감각별 (오늘 푼 문항 기준)</h3>' +
        '<div class="sense-list">' + senseBreakdownHtml(bySense) + '</div>' +
        '<p class="muted">위 막대는 <b>항목×감각 단위</b>예요. 오늘 어느 감각이 단단했고 어디가 흔들렸는지 보여요.</p>' +
        (unseen > 0
          ? '<p class="supply-note">' + (focusItem ? "이 항목" : "전체") + '에 아직 안 본 <b>새 문장이 ' + unseen + '개</b> 남아 있어요.</p>'
          : '<p class="supply-note"><b>' + (focusItem ? "이 항목 새 문장을" : "새 문장을") + ' 전부 봤어요.</b></p>') +
        '<p class="muted">아직 <b>오늘 세션이 끝나지 않았어요.</b> 익히기에 없던 <b>새 문장 테스트</b>까지 마쳐야 기록이 쌓여요.</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="go-transfer">새 문장 테스트로 마무리 →</button>' +
          '<button class="btn secondary" id="go-home">나중에 (처음으로)</button>' +
        '</div>' +
      '</div>';
    document.getElementById("go-transfer").onclick = function () { startTransfer(focusItem); };
    document.getElementById("go-home").onclick = renderIntro;
    window.scrollTo(0, 0);
  }

  function renderTransferResult(sc, results, train, focusItem) {
    var trainPct = train ? pct(train.score.correct, train.score.total) : null;
    var bySense = bySenseScore(results);
    var transUnseen = unseenTransferCount(focusItem);
    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">새 문장 테스트 끝' + (focusItem ? ' · 집중 ' + esc(itemShort(focusItem)) : "") + '</p>' +
        '<h2>오늘 결과 — 알아보는 힘</h2>' +
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
        '<p class="honesty">이 점수는 ‘<b>알아보는 힘</b>’이에요 — 고르기를 잘해도 직접 쓰기는 따로 늘어요. ' +
          '<b>써보기</b>로 ‘꺼내 쓰는 힘’을 길러 보세요.</p>' +
        '<div class="btn-row">' +
          '<button class="btn produce" id="go-produce-after">써보기로 꺼내 쓰기 →</button>' +
          '<button class="btn secondary" id="go-progress2">내 기록 보기</button>' +
          '<button class="btn secondary" id="go-home2">처음으로</button>' +
        '</div>' +
      '</div>';
    document.getElementById("go-produce-after").onclick = function () { startProduce("blank"); };
    document.getElementById("go-progress2").onclick = renderProgress;
    document.getElementById("go-home2").onclick = renderIntro;
    window.scrollTo(0, 0);
  }

  // ===================================================================
  //  진척 화면 — "어떤 감각이 늘고 있는지" + 산출(꺼내 쓰는 힘) 별도 섹션.
  // ===================================================================
  function renderProgress() {
    state = null;
    var days = loadDays();
    var produceLog = loadProduceLog();
    var unseen = unseenTrainCount(null);
    var total = totalTrainCount(null);
    var done = total - unseen;

    var body;
    if (days.length === 0 && produceLog.length === 0) {
      var hasUnseen = unseen > 0;
      body = '<div class="empty-state">' +
        '<p class="empty-note">오늘 세션을 <b>새 문장 테스트까지 마치면</b> 여기에 기록이 쌓여요. ' +
          '<b>써보기</b>를 한 번 끝내도 ‘꺼내 쓰는 힘’ 기록이 생겨요.</p>' +
        '<div class="btn-row">' +
          (hasUnseen
            ? '<button class="btn" id="empty-train">오늘 새 문장 익히기 시작</button>'
            : '<button class="btn" id="empty-review">복습 모드로 시작</button>') +
          '<button class="btn produce" id="empty-produce">써보기 시작</button>' +
        '</div>' +
      '</div>';
    } else {
      var supply =
        '<div class="supply-card">' +
          '<div class="supply-head">새 문장 공급 (전체)</div>' +
          '<div class="supply-bar"><div class="supply-fill" style="width:' + pct(done, total) + '%"></div></div>' +
          '<div class="supply-meta"><b>' + done + ' / ' + total + '문장</b>을 봤어요 · ' +
            (unseen > 0 ? '아직 <b>새 문장 ' + unseen + '개</b> 남음' : '<b>한 바퀴 완주</b>') + '</div>' +
        '</div>';
      var recognitionBody;
      if (days.length === 0) {
        recognitionBody = '<div class="chart-block"><h3>알아보는 힘</h3>' +
          '<p class="muted small">아직 ‘알아보기’ 세션 기록이 없어요 — 새 문장 테스트까지 마치면 쌓여요.</p></div>';
      } else {
        var summary = strengthWeaknessBlock(days);
        var senseTrend = senseTrendBlock(days);
        var dayTrend = (days.length === 1) ? firstDaySummary(days[0]) : dayCourseBlock(days);
        recognitionBody = summary + '<div class="section-gap"></div>' + senseTrend +
          '<div class="section-gap"></div>' + dayTrend;
      }
      // 인식≠산출 분리 — 꺼내 쓰는 힘은 별도 섹션, 점수를 합치지 않는다.
      var produceBody = produceProgressBlock(produceLog);
      body = supply + '<div class="section-gap"></div>' +
        '<h3>① 알아보는 힘 (고르기)</h3>' + recognitionBody +
        '<div class="section-gap"></div>' +
        '<h3 class="produce-score-label">② 꺼내 쓰는 힘 (써보기 · 산출)</h3>' + produceBody;
    }

    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">내 기록 (본인 학습용)</p>' +
        '<h2>어떤 힘이 늘고 있나</h2>' +
        '<p class="muted small">이 기록은 본인 한 사람(N=1)의 학습 기록이에요 — 효과의 증거가 아니라 ' +
          '‘내가 어디서 늘고 어디가 약한지’를 보는 거예요.</p>' +
        '<div class="separation-note"><b>알아보는 힘</b>(고르기)과 <b>꺼내 쓰는 힘</b>(써보기)은 ' +
          '서로 다른 능력이라 <b>점수를 합치지 않고 따로</b> 보여 드려요.</div>' +
        body +
        '<p class="honesty">이 기록은 학습 과정의 모습이에요 — 실제 말하기·쓰기 실력을 그대로 증명하지는 않아요.</p>' +
        '<div class="btn-row">' +
          (days.length === 0 && produceLog.length === 0
            ? ''
            : (unseen > 0
              ? '<button class="btn" id="pg-train">오늘 새 문장 익히기</button>'
              : '<button class="btn" id="pg-review">복습 모드</button>') +
              '<button class="btn produce" id="pg-produce">써보기</button>') +
          '<button class="btn secondary" id="pg-home">처음으로</button>' +
        '</div>' +
      '</div>';
    var pt = document.getElementById("pg-train");
    if (pt) pt.onclick = function () { startTraining(false, null); };
    var pr = document.getElementById("pg-review");
    if (pr) pr.onclick = function () { startTraining(true, null); };
    var pp = document.getElementById("pg-produce");
    if (pp) pp.onclick = function () { startProduce("blank"); };
    var et = document.getElementById("empty-train");
    if (et) et.onclick = function () { startTraining(false, null); };
    var er = document.getElementById("empty-review");
    if (er) er.onclick = function () { startTraining(true, null); };
    var ep = document.getElementById("empty-produce");
    if (ep) ep.onclick = function () { startProduce("blank"); };
    document.getElementById("pg-home").onclick = renderIntro;
    wireWeaknessFocus();
    window.scrollTo(0, 0);
  }

  function cumulativeByItem(days) {
    var acc = {};
    for (var i = 0; i < days.length; i++) {
      var d = days[i];
      mergeItemInto(acc, (d.train && d.train.byItem) || {});
      mergeItemInto(acc, (d.transfer && d.transfer.byItem) || {});
    }
    return acc;
  }
  function mergeItemInto(acc, byItem) {
    var keys = Object.keys(byItem);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (!acc[k]) acc[k] = { c: 0, t: 0 };
      acc[k].c += byItem[k].c;
      acc[k].t += byItem[k].t;
    }
  }
  function strengthWeaknessBlock(days) {
    var byItem = cumulativeByItem(days);
    var rows = [];
    var keys = Object.keys(byItem);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var d = byItem[k];
      if (d.t < 2) continue;
      rows.push({ key: k, p: pct(d.c, d.t), c: d.c, t: d.t });
    }
    if (rows.length === 0) {
      return '<div class="sw-card"><div class="sw-head">강점 / 약점</div>' +
        '<p class="muted small">아직 항목별 표본이 적어요 — 몇 번 더 풀면 짚어 드릴게요.</p></div>';
    }
    rows.sort(function (a, b) { return b.p - a.p; });
    var strong = rows[0];
    var weak = rows[rows.length - 1];
    var strongLine = '<b style="color:' + itemColor(strong.key) + '">' + esc(itemShort(strong.key)) + '</b> 강함 ' +
      strong.p + '% (' + strong.c + '/' + strong.t + ')';
    var weakLine, weakBtn = "";
    if (weak.key === strong.key) {
      weakLine = '아직 한 항목만 충분히 풀어 봤어요.';
    } else {
      weakLine = '<b style="color:' + itemColor(weak.key) + '">' + esc(itemShort(weak.key)) + '</b> 약함 ' +
        weak.p + '% (' + weak.c + '/' + weak.t + ')';
      weakBtn = ' <button class="link-btn" id="weak-focus" data-item="' + esc(weak.key) + '">' +
        esc(itemShort(weak.key)) + ' 집중 모드로 연습 →</button>';
    }
    return '<div class="sw-card">' +
      '<div class="sw-head">강점 / 약점 (누적)</div>' +
      '<p class="sw-line">' + strongLine + ' · ' + weakLine + '</p>' +
      (weakBtn ? '<p class="sw-action">' + weakBtn + '</p>' : "") +
      '<p class="muted small">충분히 풀어 본 항목만 비교해요 (한 사람 기록이라 어림이에요).</p>' +
      '</div>';
  }
  function wireWeaknessFocus() {
    var b = document.getElementById("weak-focus");
    if (!b) return;
    b.onclick = function () {
      var key = this.getAttribute("data-item");
      var review = unseenTrainCount(key) === 0;
      startTraining(review, key);
    };
  }
  function senseTrendBlock(days) {
    var acc = {};
    for (var i = 0; i < days.length; i++) {
      acc = mergeSense(acc, (days[i].train && days[i].train.bySense) || {});
      acc = mergeSense(acc, (days[i].transfer && days[i].transfer.bySense) || {});
    }
    var lastDay = days[days.length - 1];
    var lastSense = mergeSense(
      (lastDay.train && lastDay.train.bySense) || {},
      (lastDay.transfer && lastDay.transfer.bySense) || {}
    );
    var priorAcc = {};
    for (var j = 0; j < days.length - 1; j++) {
      priorAcc = mergeSense(priorAcc, (days[j].train && days[j].train.bySense) || {});
      priorAcc = mergeSense(priorAcc, (days[j].transfer && days[j].transfer.bySense) || {});
    }
    if (Object.keys(acc).length === 0) {
      return '<div class="chart-block"><h3>감각별 추이</h3><p class="empty-note small">아직 기록이 없어요.</p></div>';
    }
    var ids = Object.keys(acc);
    ids.sort(function (a, b) { return (ITEM_ORDER.indexOf(itemOfSense(a)) - ITEM_ORDER.indexOf(itemOfSense(b))); });

    function trendRowHtml(id, d) {
      var p = pct(d.c, d.t);
      var col = senseColor(id);
      var arrow = "", arrowCls = "flat";
      if (days.length >= 2 && lastSense[id] && lastSense[id].t > 0 && priorAcc[id] && priorAcc[id].t > 0) {
        var lp = pct(lastSense[id].c, lastSense[id].t);
        var ppv = pct(priorAcc[id].c, priorAcc[id].t);
        if (lp > ppv + 4) { arrow = "▲ 늘고 있어요"; arrowCls = "up"; }
        else if (lp < ppv - 4) { arrow = "▼ 흔들렸어요"; arrowCls = "down"; }
        else { arrow = "= 비슷"; arrowCls = "flat"; }
      } else if (lastSense[id] && lastSense[id].t > 0) {
        arrow = "새로"; arrowCls = "flat";
      }
      var weakCls = (d.t >= 3 && p < 60) ? " weak" : "";
      return '<div class="trend-row' + weakCls + '">' +
        '<span class="sense-dot" style="background:' + col + '"></span>' +
        '<span class="sense-name">' + esc(senseLabel(id)) + '</span>' +
        '<span class="sense-bar"><span class="sense-bar-fill" style="width:' + p + '%;background:' + col + '"></span></span>' +
        '<span class="sense-val">' + p + '%</span>' +
        '<span class="trend-arrow ' + arrowCls + '">' + arrow + '</span>' +
      '</div>';
    }
    var mainRows = "", thinRows = "", thinCount = 0;
    for (var k = 0; k < ids.length; k++) {
      var id = ids[k];
      var d = acc[id];
      if (d.t === 0) continue;
      if (d.t >= 2) mainRows += trendRowHtml(id, d);
      else { thinRows += trendRowHtml(id, d); thinCount++; }
    }
    if (mainRows === "" && thinRows !== "") { mainRows = thinRows; thinRows = ""; thinCount = 0; }
    var thinBlock = thinCount > 0
      ? '<details class="trend-more"><summary>한 번만 본 감각 ' + thinCount + '개 더 보기</summary>' +
          '<div class="trend-list">' + thinRows + '</div></details>'
      : "";
    return '<div class="chart-block">' +
      '<h3>감각별 추이 (코스 누적 · 최근 세션과 비교)</h3>' +
      '<p class="muted small"><b>▲</b>는 최근 세션에서 늘었다는 뜻 — ' +
        '<span class="weak-legend">붉게 강조된 줄</span>이 지금 가장 약한 감각이에요.</p>' +
      '<div class="trend-list">' + mainRows + '</div>' + thinBlock +
      '</div>';
  }
  function firstDaySummary(day) {
    var combined = mergeSense(
      (day.train && day.train.bySense) || {},
      (day.transfer && day.transfer.bySense) || {}
    );
    return '<div class="chart-block">' +
      '<h3>일자별 정답률</h3>' +
      '<p class="muted">오늘이 <b>Day 1</b>이라 일자 추이 대신 ‘오늘 잡은 감각’을 보여 드려요.</p>' +
      '<div class="sense-list">' + senseBreakdownHtml(combined) + '</div>' +
      '</div>';
  }
  function dayCourseBlock(days) {
    var cols = "";
    for (var i = 0; i < days.length; i++) {
      var d = days[i];
      var tp = (d.train && d.train.score && d.train.score.total) ? pct(d.train.score.correct, d.train.score.total) : 0;
      var xp = (d.transfer && d.transfer.score && d.transfer.score.total) ? pct(d.transfer.score.correct, d.transfer.score.total) : 0;
      var foc = d.focusItem ? ('<br><span class="prev-mark">집중 ' + esc(itemShort(d.focusItem)) + '</span>') : "";
      cols +=
        '<div class="day-col">' +
          '<div class="day-bars">' +
            '<div class="day-bar train" style="height:' + tp + '%" title="익히기 ' + tp + '%"><span class="day-bar-val">' + tp + '</span></div>' +
            '<div class="day-bar transfer" style="height:' + xp + '%" title="새 문장 ' + xp + '%"><span class="day-bar-val">' + xp + '</span></div>' +
          '</div>' +
          '<div class="day-x">Day ' + (i + 1) + foc + '</div>' +
        '</div>';
    }
    return '<div class="chart-block">' +
      '<h3>일자별 정답률</h3>' +
      '<div class="day-grid">' + cols + '</div>' +
      '<div class="legend"><span class="lg train"></span>익히기 <span class="lg transfer"></span>새 문장</div>' +
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

  // 산출 진척 — 인식과 분리된 "꺼내 쓰는 힘" 섹션. 난이도별·자가채점 정직 라벨.
  function produceProgressBlock(log) {
    if (!log || log.length === 0) {
      return '<div class="chart-block"><p class="muted small">아직 ‘써보기’ 기록이 없어요. ' +
        '빈칸 타이핑부터 시작해 보세요 — 한 세션 끝내면 여기 쌓여요.</p></div>';
    }
    var diffName = { blank: "빈칸 타이핑 (쉬움)", reorder: "어순 재배열 (중간)", write: "전문 쓰기 (어려움)" };
    var agg = {};
    for (var i = 0; i < log.length; i++) {
      var s = log[i];
      if (!agg[s.diff]) agg[s.diff] = { c: 0, t: 0, sessions: 0, selfGraded: false };
      agg[s.diff].c += s.correct;
      agg[s.diff].t += s.total;
      agg[s.diff].sessions++;
      if (s.selfGraded) agg[s.diff].selfGraded = true;
    }
    var rows = "";
    var order = ["blank", "reorder", "write"];
    for (var o = 0; o < order.length; o++) {
      var dk = order[o];
      if (!agg[dk]) continue;
      var a = agg[dk];
      var weak = a.selfGraded ? ' <span class="weak-verdict-label" style="display:inline-block;padding:1px 8px;margin:0">자가채점 · 약한 점수</span>' : "";
      rows += '<div class="sense-row">' +
        '<span class="sense-dot" style="background:var(--produce)"></span>' +
        '<span class="sense-name">' + esc(diffName[dk] || dk) + '</span>' +
        '<span class="sense-bar"><span class="sense-bar-fill" style="width:' + pct(a.c, a.t) + '%;background:#6b4fa0"></span></span>' +
        '<span class="sense-val">' + a.c + ' / ' + a.t + '</span>' +
      '</div>' + (weak ? '<p class="muted small" style="margin:0 0 4px 18px">' + weak + '</p>' : "");
    }
    return '<div class="chart-block">' +
      '<div class="sense-list">' + rows + '</div>' +
      '<p class="muted small">난이도별 ‘꺼내 쓴’ 정확도예요. <b>전문 쓰기</b>는 본인이 스스로 매긴 ' +
        '<b>약한 점수</b>라 알아보기 통계와 섞지 않아요.</p>' +
      '</div>';
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

  // 산출 모드는 별도 파일이 아니라 같은 IIFE 안의 produce-* 함수가 맡는다 (아래).
  window.__gtf_startProduce = function (diff) { startProduce(diff); };

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

  (function bindExport() {
    var btn = document.getElementById("export-log");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var dump = { candidate: "c4-2", exported_at: new Date().toISOString(), note: "본인 실사용 기록 (N=1)", keys: {} };
      for (var i = 0; i < window.localStorage.length; i++) {
        var k = window.localStorage.key(i);
        if (k.indexOf(STORE_PREFIX) === 0) { try { dump.keys[k] = JSON.parse(window.localStorage.getItem(k)); } catch (e) { dump.keys[k] = window.localStorage.getItem(k); } }
      }
      var blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "get-the-feel-c4-2-sessions-" + new Date().toISOString().slice(0, 10) + ".json";
      a.click();
      URL.revokeObjectURL(a.href);
    });
  })();

  // 산출 모드 구현은 아래 produce.part 영역에서 이 스코프 변수를 직접 쓴다.
  // (startProduce 등은 hoist된 function 선언이므로 위 호출부에서 참조 가능.)

  // ===================================================================
  //  ②  써보기 (산출) 모드 — V3. 기존 코퍼스에서 파생, 새 콘텐츠 저작 없음.
  //     난이도 3단: blank(빈칸 타이핑) / reorder(어순 재배열) / write(전문 쓰기).
  //     인식≠산출 분리: produce 결과는 produce 저장소(loadProduceLog)에만 쌓인다.
  // ===================================================================

  // 한 단어로 떨어지는 답을 가진 문항(빈칸 유형)만 빈칸 타이핑에 파생한다.
  function blankCandidates() {
    var out = [];
    var pools = allTrainingItems().concat(allTransferItems());
    for (var i = 0; i < pools.length; i++) {
      var e = pools[i];
      var t = itemType(e.item);
      if ((t === "verb-choice" || t === "sense-cloze") && /___/.test(e.item.sentence || "")) {
        var ans = e.item.choices[e.item.answer_index];
        if (ans && normWord(ans).split(" ").length === 1) out.push(e);
      }
    }
    return out;
  }
  // 어순 재배열 — 토큰 5~9개의 sentence(빈칸 없는)면 잘 작동. 너무 길면 제외.
  // 어순이 고정된 문장만 재배열에 쓴다. 분리형 입자(구동사·불변화사)와 전치 가능 부사로
  // 시작하는 문장은 *복수의 정답 어순*이 있어 단일 모범문 채점이 거짓 오답을 낸다 —
  // 특히 제품이 가르치는 그 축(구동사·입자)에서 거짓 제약을 학습시키므로 제외 (모니터 Data/Sellability 회수).
  function isRigidOrder(e) {
    var axis = (e.fileAxis || e.axis || "");
    if (axis === "particles" || axis === "phrasal-verbs") return false;  // 입자 위치 이동 가능
    var s = " " + String(e.item.sentence || "").toLowerCase() + " ";
    // 분리형 입자 토큰 (전치사가 아니라 이동 가능한 particle)
    if (/ (up|out|down|off|back|away|over|around) /.test(s)) return false;
    // 전치 가능 부사·시간구로 시작 → 복수 어순
    if (/^\s*(usually|sometimes|often|always|finally|suddenly|yesterday|today|tonight|now|then|soon|later|this morning|last night|every day|after lunch)\b/i.test(e.item.sentence || "")) return false;
    return true;
  }
  function reorderCandidates() {
    var out = [];
    var pools = allTrainingItems().concat(allTransferItems());
    for (var i = 0; i < pools.length; i++) {
      var e = pools[i];
      if (/___/.test(e.item.sentence || "")) continue;       // 빈칸 문항 제외
      if (!isRigidOrder(e)) continue;                        // 복수 정답 어순 문장 제외
      var toks = tokenizeSentence(e.item.sentence);
      if (toks.length >= 4 && toks.length <= 9) out.push(e);
    }
    return out;
  }
  // 전문 쓰기 — sentence_ko가 있고 sentence가 완성문(빈칸 없는)인 문항.
  function writeCandidates() {
    var out = [];
    var pools = allTrainingItems().concat(allTransferItems());
    for (var i = 0; i < pools.length; i++) {
      var e = pools[i];
      if (/___/.test(e.item.sentence || "")) continue;
      if (e.item.sentence_ko && String(e.item.sentence_ko).trim() !== "") out.push(e);
    }
    return out;
  }
  // 문장 → 단어 토큰 (구두점은 단어에 붙여 보존; 비교는 정규화로).
  function tokenizeSentence(sentence) {
    return String(sentence).trim().split(/\s+/).filter(function (w) { return w.length > 0; });
  }

  function startProduce(diff) {
    var pool;
    if (diff === "reorder") pool = reorderCandidates();
    else if (diff === "write") pool = writeCandidates();
    else { diff = "blank"; pool = blankCandidates(); }

    var seenKey = "produce-seen-" + diff;
    var seen = loadSet(seenKey);
    var unseen = pool.filter(function (e) { return !seen[e.item.id]; });
    var seenAgain = pool.filter(function (e) { return seen[e.item.id]; });
    var ranked = shuffle(unseen).concat(shuffle(seenAgain));
    var entries = ranked.slice(0, Math.min(PRODUCE_COUNT, ranked.length));

    state = {
      kind: "produce", diff: diff,
      entries: entries, idx: 0,
      results: [],                 // { id, srcKey, sense_id, correct(=null for self) }
      selfGraded: (diff === "write")
    };
    renderProduceQuestion();
  }

  function produceCurrent() { return state.entries[state.idx]; }

  function produceHead(label) {
    var n = state.idx + 1, total = state.entries.length;
    var fill = pct(state.idx, total);
    var diffLabel = state.diff === "reorder" ? "어순 재배열" : (state.diff === "write" ? "전문 쓰기" : "빈칸 타이핑");
    return (
      '<span class="produce-flag">써보기 — 꺼내 쓰는 연습</span>' +
      '<div class="progress-head">' +
        '<span>' + label + " " + n + " / " + total + '</span>' +
        '<span class="diff-pill">' + diffLabel + '</span>' +
      '</div>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + fill + '%"></div></div>'
    );
  }

  function renderProduceQuestion() {
    if (!state.entries || state.entries.length === 0) {
      app.innerHTML = '<div class="card"><h2>이 난이도에 낼 문항이 없어요</h2>' +
        '<p class="muted">코퍼스에서 이 난이도로 파생할 문장이 부족해요.</p>' +
        '<div class="btn-row"><button class="btn secondary" id="pq-home">처음으로</button></div></div>';
      document.getElementById("pq-home").onclick = renderIntro;
      return;
    }
    if (state.diff === "blank") renderBlankQuestion();
    else if (state.diff === "reorder") renderReorderQuestion();
    else renderWriteQuestion();
    window.scrollTo(0, 0);
  }

  // ---- ① 빈칸 타이핑 (쉬움) ----
  function renderBlankQuestion() {
    var entry = produceCurrent();
    var item = entry.item;
    app.innerHTML =
      '<div class="card produce-mode produce-q-card">' +
        produceHead("타이핑") +
        '<p class="sentence has-blank">' + renderSentence(item) + '</p>' +
        '<p class="prompt">' + esc(item.prompt) + ' (보기 없이 <b>직접 쳐 넣어요</b>)</p>' +
        '<input class="type-field" id="type-input" type="text" autocomplete="off" autocapitalize="none" ' +
          'spellcheck="false" placeholder="빈칸에 들어갈 단어를 입력" />' +
        '<p class="hint-line">힌트: 한 단어예요. 대소문자·구두점은 신경 쓰지 않아도 돼요.</p>' +
        '<div class="btn-row"><button class="btn produce" id="type-submit">제출</button></div>' +
        '<div id="produce-feedback"></div>' +
      '</div>';
    var input = document.getElementById("type-input");
    var submit = document.getElementById("type-submit");
    function go() { gradeBlank(entry, input.value); }
    submit.onclick = go;
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
    if (input.focus) input.focus();
  }
  function gradeBlank(entry, raw) {
    var item = entry.item;
    var answer = item.choices[item.answer_index];
    var correct = normWord(raw) === normWord(answer);
    state.results.push({ id: item.id, srcKey: entry.srcKey, sense_id: item.sense_id, correct: correct });

    var input = document.getElementById("type-input");
    var submit = document.getElementById("type-submit");
    if (input) input.disabled = true;
    if (submit) submit.disabled = true;

    var fb = document.getElementById("produce-feedback");
    var filled = renderFilledSentence(item, answer);
    fb.innerHTML =
      '<div class="feedback">' +
        '<div class="feedback-head">' +
          '<span class="item-pill" style="background:' + itemColor(entry.srcKey) + '">' + esc(itemShort(entry.srcKey)) + '</span>' +
          '<p class="verdict ' + (correct ? "ok" : "no") + '">' +
            (correct ? "맞게 꺼냈어요!" : "아쉬워요 — 정답은 ‘" + esc(answer) + "’예요.") + '</p>' +
        '</div>' +
        '<p class="filled-sentence">' + filled + '</p>' +
        (item.sentence_ko ? '<p class="interp"><span class="interp-label">해석</span><span class="interp-text">' + esc(item.sentence_ko) + '</span></p>' : "") +
        // 산출을 감각에 묶는다 — 감각 그림(메타포) 재노출.
        vizBox(item.sense_id, item.subject_label, item.object_label, false, "이 단어가 그리는 그림 — " + senseLabel(item.sense_id)) +
        '<details class="why-details"><summary>왜 이 단어인지</summary><p class="why">' + esc(item.why_ko) + '</p></details>' +
        '<div class="btn-row"><button class="btn produce" id="produce-next">' +
          (state.idx + 1 >= state.entries.length ? "결과 보기" : "다음 문항") + '</button></div>' +
      '</div>';
    document.getElementById("produce-next").onclick = produceNext;
    triggerSettle(fb);
  }

  // ---- ② 어순 재배열 (중간) ----
  function renderReorderQuestion() {
    var entry = produceCurrent();
    var item = entry.item;
    var tokens = tokenizeSentence(item.sentence);
    // 셔플 — 원순서와 같으면 한 번 더 (한 단어면 그대로).
    var order = shuffle(tokens.map(function (_, i) { return i; }));
    if (tokens.length > 1 && order.join(",") === tokens.map(function (_, i) { return i; }).join(",")) {
      order = shuffle(order);
    }
    state.reorder = { tokens: tokens, bankOrder: order, tray: [] };

    app.innerHTML =
      '<div class="card produce-mode produce-q-card">' +
        produceHead("재배열") +
        '<p class="prompt">섞인 단어를 <b>올바른 순서</b>로 놓아 문장을 만들어요. ' +
          (item.sentence_ko ? '뜻: <b>' + esc(item.sentence_ko) + '</b>' : "") + '</p>' +
        '<p class="reorder-current" id="reorder-current"></p>' +
        '<div class="token-tray empty" id="token-tray" aria-label="만든 문장"></div>' +
        '<div class="token-bank" id="token-bank" aria-label="단어 카드"></div>' +
        '<div class="btn-row">' +
          '<button class="btn produce" id="reorder-submit">제출</button>' +
          '<button class="btn secondary small" id="reorder-clear">처음부터</button>' +
        '</div>' +
        '<div id="produce-feedback"></div>' +
      '</div>';
    renderReorderTokens();
    document.getElementById("reorder-submit").onclick = function () { gradeReorder(entry); };
    document.getElementById("reorder-clear").onclick = function () { state.reorder.tray = []; renderReorderTokens(); };
  }
  function renderReorderTokens() {
    var R = state.reorder;
    var bank = document.getElementById("token-bank");
    var tray = document.getElementById("token-tray");
    var current = document.getElementById("reorder-current");
    if (!bank || !tray) return;
    // 트레이 (놓은 단어, 탭하면 빼기)
    var trayHtml = "";
    for (var i = 0; i < R.tray.length; i++) {
      trayHtml += '<button class="token in-tray" data-tray="' + i + '">' + esc(R.tokens[R.tray[i]]) + '</button>';
    }
    tray.innerHTML = trayHtml;
    tray.className = "token-tray" + (R.tray.length === 0 ? " empty" : "");
    // 뱅크 (남은 단어, 탭하면 트레이로)
    var bankHtml = "";
    for (var b = 0; b < R.bankOrder.length; b++) {
      var ti = R.bankOrder[b];
      if (R.tray.indexOf(ti) !== -1) continue;
      bankHtml += '<button class="token" data-bank="' + ti + '">' + esc(R.tokens[ti]) + '</button>';
    }
    bank.innerHTML = bankHtml;
    if (current) current.textContent = R.tray.map(function (ti) { return R.tokens[ti]; }).join(" ");

    var bankBtns = bank.querySelectorAll(".token");
    for (var j = 0; j < bankBtns.length; j++) {
      bankBtns[j].onclick = function () {
        state.reorder.tray.push(parseInt(this.getAttribute("data-bank"), 10));
        renderReorderTokens();
      };
    }
    var trayBtns = tray.querySelectorAll(".token");
    for (var k = 0; k < trayBtns.length; k++) {
      trayBtns[k].onclick = function () {
        var pos = parseInt(this.getAttribute("data-tray"), 10);
        state.reorder.tray.splice(pos, 1);
        renderReorderTokens();
      };
    }
  }
  function gradeReorder(entry) {
    var item = entry.item;
    var R = state.reorder;
    var built = R.tray.map(function (ti) { return R.tokens[ti]; }).join(" ");
    // 문장부호 제거하고 단어 순서만 비교 (정규화).
    var correct = normSentenceCmp(built) === normSentenceCmp(item.sentence);
    state.results.push({ id: item.id, srcKey: entry.srcKey, sense_id: item.sense_id, correct: correct });

    var submit = document.getElementById("reorder-submit");
    var clear = document.getElementById("reorder-clear");
    if (submit) submit.disabled = true;
    if (clear) clear.disabled = true;
    var bankBtns = app.querySelectorAll("#token-bank .token, #token-tray .token");
    for (var i = 0; i < bankBtns.length; i++) bankBtns[i].disabled = true;

    var fb = document.getElementById("produce-feedback");
    fb.innerHTML =
      '<div class="feedback">' +
        '<div class="feedback-head">' +
          '<span class="item-pill" style="background:' + itemColor(entry.srcKey) + '">' + esc(itemShort(entry.srcKey)) + '</span>' +
          '<p class="verdict ' + (correct ? "ok" : "no") + '">' +
            (correct ? "어순을 맞게 세웠어요!" : "어순이 달라요. 원문을 보세요.") + '</p>' +
        '</div>' +
        '<p class="your-answer"><span class="label">내가 만든 문장</span><br>' + esc(built || "(빈칸)") + '</p>' +
        '<p class="model-answer"><span class="label">원문</span><br><span class="text">' + esc(item.sentence) + '</span></p>' +
        (item.sentence_ko ? '<p class="interp"><span class="interp-label">해석</span><span class="interp-text">' + esc(item.sentence_ko) + '</span></p>' : "") +
        vizBox(item.sense_id, item.subject_label, item.object_label, false, "이 문장이 그리는 그림 — " + senseLabel(item.sense_id)) +
        '<div class="btn-row"><button class="btn produce" id="produce-next">' +
          (state.idx + 1 >= state.entries.length ? "결과 보기" : "다음 문항") + '</button></div>' +
      '</div>';
    document.getElementById("produce-next").onclick = produceNext;
    triggerSettle(fb);
  }

  // ---- ③ 전문 쓰기 (어려움) — 자가채점 = 약한 verdict ----
  function renderWriteQuestion() {
    var entry = produceCurrent();
    var item = entry.item;
    var senseHint = senseLabel(item.sense_id);
    var itemHint = itemShort(entry.srcKey);
    app.innerHTML =
      '<div class="card produce-mode produce-q-card">' +
        produceHead("전문 쓰기") +
        '<p class="prompt">아래 뜻을 <b>영어 문장</b>으로 직접 써 보세요.</p>' +
        '<p class="write-prompt-ko">' + esc(item.sentence_ko || item.sentence) + '</p>' +
        '<div class="write-sense-hint">' + esc(itemHint) + '의 ‘' + esc(senseHint) + '’ 감각으로</div>' +
        '<textarea class="write-area" id="write-input" placeholder="여기에 영어 문장을 쓰세요"></textarea>' +
        '<div class="weak-verdict-label"><b>스스로 채점 — 약한 점수예요.</b> ' +
          '자동으로 못 매겨요. 제출하면 모범문을 보고 본인이 직접 체크합니다. ' +
          '이 점수는 ‘알아보는 힘’ 통계와 합치지 않아요.</div>' +
        '<div class="btn-row"><button class="btn produce" id="write-submit">다 썼어요 — 모범문 보기</button></div>' +
        '<div id="produce-feedback"></div>' +
      '</div>';
    document.getElementById("write-submit").onclick = function () {
      var val = document.getElementById("write-input").value;
      revealWriteModel(entry, val);
    };
  }
  function revealWriteModel(entry, written) {
    var item = entry.item;
    var ta = document.getElementById("write-input");
    if (ta) ta.disabled = true;
    var sub = document.getElementById("write-submit");
    if (sub) sub.disabled = true;

    var fb = document.getElementById("produce-feedback");
    fb.innerHTML =
      '<div class="feedback">' +
        '<p class="your-answer"><span class="label">내가 쓴 문장</span><br>' + esc(written || "(빈칸)") + '</p>' +
        '<p class="model-answer"><span class="label">모범문</span><br><span class="text">' + esc(item.sentence) + '</span></p>' +
        (item.sentence_ko ? '<p class="interp"><span class="interp-label">해석</span><span class="interp-text">' + esc(item.sentence_ko) + '</span></p>' : "") +
        vizBox(item.sense_id, item.subject_label, item.object_label, false, "이 문장이 그리는 그림 — " + senseLabel(item.sense_id)) +
        '<div class="weak-verdict-label"><b>스스로 채점하세요 (약한 verdict).</b> 모범문과 비교해 아래 3가지를 체크해요.</div>' +
        '<div class="rubric">' +
          rubricItem("r1", "① 목표 감각(‘" + senseLabel(item.sense_id) + "’)을 그 단어로 썼다") +
          rubricItem("r2", "② 어순이 자연스럽다 (주어·동사·목적어 자리)") +
          rubricItem("r3", "③ 동사형(시제·수·과거분사 등)이 맞다") +
        '</div>' +
        '<details class="why-details"><summary>왜 그런지</summary><p class="why">' + esc(item.why_ko) + '</p></details>' +
        '<div class="btn-row"><button class="btn produce" id="produce-next">' +
          (state.idx + 1 >= state.entries.length ? "결과 보기" : "다음 문항 (자가채점 반영)") + '</button></div>' +
      '</div>';
    document.getElementById("produce-next").onclick = function () {
      var checks = 0;
      ["r1", "r2", "r3"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el && el.checked) checks++;
      });
      // 자가채점: 3항 중 모두 맞으면 정답으로 (약한 verdict — 본인 표기).
      state.results.push({
        id: item.id, srcKey: entry.srcKey, sense_id: item.sense_id,
        correct: checks === 3, selfChecks: checks, self: true
      });
      produceNext();
    };
    triggerSettle(fb);
  }
  function rubricItem(id, label) {
    return '<div class="rubric-item"><input type="checkbox" id="' + id + '" />' +
      '<label for="' + id + '">' + esc(label) + '</label></div>';
  }

  function produceNext() {
    state.idx++;
    if (state.idx < state.entries.length) {
      renderProduceQuestion();
    } else {
      finishProduce();
    }
  }

  function finishProduce() {
    var c = 0;
    for (var i = 0; i < state.results.length; i++) if (state.results[i].correct) c++;
    var total = state.results.length;
    var diff = state.diff;
    // produce 저장소에만 — 인식 통계(days)와 분리.
    addToSet("produce-seen-" + diff, state.results.map(function (r) { return r.id; }));
    saveProduceSession({
      diff: diff, date: new Date().toISOString(),
      correct: c, total: total, selfGraded: !!state.selfGraded
    });
    renderProduceResult(c, total, diff, state.selfGraded);
  }

  function renderProduceResult(correct, total, diff, selfGraded) {
    var diffLabel = diff === "reorder" ? "어순 재배열 (중간)" : (diff === "write" ? "전문 쓰기 (어려움)" : "빈칸 타이핑 (쉬움)");
    var honesty = selfGraded
      ? '<div class="weak-verdict-label"><b>이 점수는 ‘약한 점수’예요.</b> 본인이 모범문과 비교해 스스로 매긴 것이라 ' +
          '정확한 채점이 아니에요. ‘알아보는 힘(고르기)’ 통계와는 <b>섞지 않습니다</b>.</div>'
      : '<div class="produce-honesty">이 점수는 <b>꺼내 쓰는 힘</b>(산출)이에요 — ' +
          '고르는 힘(알아보기)과 <b>다른 능력</b>이라 통계에서 따로 봐요.</div>';
    app.innerHTML =
      '<div class="card produce-mode">' +
        '<div class="produce-result-head"><p class="kicker produce-score-label">써보기 끝 · ' + esc(diffLabel) + '</p>' +
          '<h2>꺼내 쓰는 힘</h2></div>' +
        '<div class="score-big produce">' + pct(correct, total) + '%</div>' +
        '<div class="score-sub">' + correct + ' / ' + total + ' 문항 ' + (selfGraded ? '(자가채점)' : '(자동 채점)') + '</div>' +
        honesty +
        '<p class="muted small">같은 문장을 <b>고르기</b>가 아니라 <b>직접 만들어</b> 봤어요. ' +
          '난이도를 올려 가며(빈칸 → 어순 → 전문 쓰기) 꺼내 쓰는 힘을 키워요.</p>' +
        '<div class="btn-row">' +
          (diff === "blank" ? '<button class="btn produce" id="pr-next-diff">어순 재배열(중간)로 →</button>' :
           diff === "reorder" ? '<button class="btn produce" id="pr-next-diff">전문 쓰기(어려움)로 →</button>' :
           '<button class="btn produce" id="pr-again">전문 쓰기 더 하기</button>') +
          '<button class="btn secondary" id="pr-progress">내 기록 보기</button>' +
          '<button class="btn secondary" id="pr-home">처음으로</button>' +
        '</div>' +
      '</div>';
    var nd = document.getElementById("pr-next-diff");
    if (nd) nd.onclick = function () { startProduce(diff === "blank" ? "reorder" : "write"); };
    var ag = document.getElementById("pr-again");
    if (ag) ag.onclick = function () { startProduce("write"); };
    document.getElementById("pr-progress").onclick = renderProgress;
    document.getElementById("pr-home").onclick = renderIntro;
    window.scrollTo(0, 0);
  }

})();
