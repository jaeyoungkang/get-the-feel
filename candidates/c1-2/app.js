/* get-the-feel · c1-2 — up의 감각 익히기 (순수 JS, file:// 안전, 의존성 0)
 *
 * 화면: intro → training(10) → summary → transfer(5) → result → progress
 *
 * 이 후보의 검증 대상 (c1-1 교훈 회수분):
 *   R1  보기 표시 순서를 문항마다 셔플 (shuffleChoices) — 정답 위치 패턴 차단.
 *   G2  SVG 라벨은 subject_label/object_label 명시 필드만 — 문장 파싱 금지.
 *   G1  up의 공간 메타포 2종: up-vertical(아래→위 떠오름), up-completion(그릇이 한계선까지 차오름).
 *   G4  오답 시 미정착 상태(화살표 중간 / 그릇 절반)를 1박자 보여준 뒤 정착.
 *   G3  같은 sense 3회째부터 풀 애니메이션 생략(즉시 정착) + 정답 후 자동 다음 옵션(토글).
 *   G5  사용자 표면 어휘 전면 — 학술·방법론 용어 금지. 상태 정보는 ⓘ 뒤로.
 *   R8  기록 1세션뿐이면 추이 차트 대신 "오늘 잡은 감각" 요약. 2세션부터 추이.
 *   G6  진척 화면 "내 기록 (본인 학습용)" 라벨.
 *   R6  콘텐츠가 1항목임을 정직하게 표시.
 *
 * 분리 계약 (separation-surface):
 *   훈련 출제 풀(buildTrainingPool)은 CONTENT.training_items 에서만.
 *   새 문장 풀(buildTransferPool)은 CONTENT.transfer_items 에서만.
 *   두 함수는 서로의 배열을 절대 참조하지 않는다 — 정적 확인 가능.
 */
(function () {
  "use strict";

  var C = window.CONTENT;
  var STORE_PREFIX = "gtf-c1-2-";
  var TRAIN_COUNT = 10;   // 훈련 출제 수
  var TRANSFER_COUNT = 5; // 새 문장 출제 수

  var app = document.getElementById("app");

  // ===================================================================
  //  sense 메타 (사용자 표면 어휘 — G5: 학술 용어 금지)
  // ===================================================================
  function senseById(id) {
    for (var i = 0; i < C.senses.length; i++) {
      if (C.senses[i].id === id) return C.senses[i];
    }
    return null;
  }
  // 화면에 보이는 sense 이름 — 생활 한국어
  function senseLabel(id) {
    return id === "up-completion" ? "끝까지 차올라 완료" : "아래에서 위로 (방향)";
  }
  function senseColor(id) {
    return id === "up-completion" ? "#8a5a2f" : "#3a6b5c";
  }

  // ===================================================================
  //  유틸
  // ===================================================================
  // R1 — 보기 표시 순서 셔플. 데이터의 answer_index 고정 위치가 화면에
  // 그대로 노출되지 않도록, 문항마다 표시 순서를 무작위로 섞는다.
  // 반환: [{ text, isAnswer }] 형태의 셔플된 보기 배열.
  function shuffleChoices(item) {
    var pairs = [];
    for (var i = 0; i < item.choices.length; i++) {
      pairs.push({ text: item.choices[i], isAnswer: i === item.answer_index });
    }
    // Fisher–Yates
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
  // 영어 문장에서 up 토큰을 강조 래핑 (라벨 추출이 아니라 시선 안내용 — G2 무관)
  function highlightUp(sentence) {
    return esc(sentence).replace(/\b(up)\b/i, '<span class="kw">$1</span>');
  }

  // ===================================================================
  //  localStorage (진척 기록) — prefix gtf-c1-2-
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
    } catch (e) { /* file:// 일부 환경에서 localStorage 비활성 — 진척만 비저장, 훈련은 동작 */ }
  }
  // 자동 다음 옵션 (G3) — 토글 상태 유지
  function loadAutoNext() {
    try { return window.localStorage.getItem(STORE_PREFIX + "autonext") === "1"; }
    catch (e) { return false; }
  }
  function saveAutoNext(on) {
    try { window.localStorage.setItem(STORE_PREFIX + "autonext", on ? "1" : "0"); }
    catch (e) { /* 무시 */ }
  }

  // ===================================================================
  //  공간 메타포 SVG (G1) — up 2종. 장식 아니라 감각 전달 장치.
  //  라벨은 subject_label/object_label 그대로 (G2). 파싱 추출 없음.
  // ===================================================================

  // up-vertical: 세로 축 + 위쪽 화살표를 따라 대상 칩이 아래에서 위로 떠오른다.
  // 흐린 하향 화살표로 반대 방향(down) 성립을 암시한다 (sense의 boundary 정신).
  // settle=true → 칩이 위 목표점에 도달. settle=false → 화살표 중간에 떠 있는 미정착(G4).
  function svgUpVertical(subjectLabel, objectLabel, settle) {
    var cls = settle ? "viz-rise settle" : "viz-rise";
    // 미정착: 화살표 중간(아래쪽)에서 출발, 반투명. settle 시 위 목표로 이동.
    var startStyle = settle ? "" : ' style="transform: translate(0px, 64px); opacity:0.3;"';
    return (
      '<div class="viz-wrap">' +
      '<svg viewBox="0 0 320 200" role="img" aria-label="대상이 세로 화살표를 따라 아래에서 위로 떠오르는 그림">' +
        // 세로 기준 축
        '<line x1="160" y1="24" x2="160" y2="178" stroke="#d8d2c8" stroke-width="2" stroke-dasharray="3 5"/>' +
        // 위로 향하는 주된 화살표 (감각의 방향) — 화살촉은 path 삼각형
        '<line x1="160" y1="170" x2="160" y2="38" stroke="' + senseColor("up-vertical") + '" stroke-width="3"/>' +
        '<path d="M160 24 L152 44 L168 44 Z" fill="' + senseColor("up-vertical") + '"/>' +
        // 반대 방향(down) 성립 암시 — 흐린 하향 화살표
        '<line x1="196" y1="40" x2="196" y2="158" stroke="#c9c2b6" stroke-width="2"/>' +
        '<path d="M196 176 L188 156 L204 156 Z" fill="#c9c2b6"/>' +
        '<text x="214" y="104" font-size="11" fill="#a59e92">down도 됨</text>' +
        // 바닥 (출발 지점) = 주어 영역
        '<rect x="96" y="178" width="128" height="14" rx="4" fill="#ece7dd"/>' +
        '<text x="160" y="172" text-anchor="middle" font-size="11" fill="#8a847d">' +
          esc(subjectLabel) + '</text>' +
        // 떠오르는 대상 칩 — 목표점은 화살표 머리 아래
        '<g class="' + cls + '"' + startStyle + '>' +
          '<rect x="104" y="56" width="112" height="40" rx="10" fill="#ffffff" stroke="' +
            senseColor("up-vertical") + '" stroke-width="2"/>' +
          '<text x="160" y="81" text-anchor="middle" font-size="13" fill="#232020" font-weight="600">' +
            esc(objectLabel) + '</text>' +
        '</g>' +
      '</svg>' +
      '<div class="viz-caption">대상이 아래에서 <b>위로 올라간다</b> — 방향을 뒤집으면 down도 선다</div>' +
      '</div>'
    );
  }

  // up-completion: 세로로 선 그릇(용기)이 바닥부터 차올라 가장자리(한계선)에 닿는다.
  // settle=true → 물이 한계선까지 꽉 참 + 한계선 강조("더 올라갈 데 없음").
  // settle=false → 물이 그릇 절반까지만 차 있는 미정착 상태(G4).
  function svgUpCompletion(subjectLabel, objectLabel, settle) {
    var cls = settle ? "viz-fill settle" : "viz-fill";
    var rimCls = settle ? "viz-rim hit" : "viz-rim";
    // 그릇 내부: x 110~210, 바닥 y=176, 한계선(가장자리) y=44.
    // 미정착이면 물 높이를 절반(y=110)에서 멈춘 인라인 상태로 시작.
    var startStyle = settle ? "" : ' style="transform: translateY(66px);"';
    return (
      '<div class="viz-wrap">' +
      '<svg viewBox="0 0 320 200" role="img" aria-label="세로 그릇이 바닥부터 차올라 가장자리 한계선에 닿는 그림">' +
        // 한계선(가장자리) — 차오름의 끝점
        '<line x1="96" y1="44" x2="224" y2="44" stroke="' + senseColor("up-completion") +
          '" stroke-width="2" stroke-dasharray="6 4" class="' + rimCls + '"/>' +
        '<text x="232" y="48" font-size="11" fill="' + senseColor("up-completion") + '">한계선</text>' +
        // 그릇 벽 (좌·우·바닥)
        '<path d="M108 40 L108 178 L212 178 L212 40" fill="none" stroke="#bdb6a8" stroke-width="3"/>' +
        // 차오르는 물 — clip 영역(110~210, 44~176) 안에서 위로 이동
        '<clipPath id="vessel-clip"><rect x="110" y="44" width="100" height="132"/></clipPath>' +
        '<g clip-path="url(#vessel-clip)">' +
          '<g class="' + cls + '"' + startStyle + '>' +
            '<rect x="110" y="44" width="100" height="132" fill="' + senseColor("up-completion") + '" opacity="0.82"/>' +
          '</g>' +
        '</g>' +
        // 대상 라벨 (그릇 안 = 차오르는 내용)
        '<text x="160" y="120" text-anchor="middle" font-size="13" fill="#ffffff" font-weight="700">' +
          esc(objectLabel) + '</text>' +
        // 주어 라벨 (그릇 아래)
        '<text x="160" y="196" text-anchor="middle" font-size="11" fill="#8a847d">' +
          esc(subjectLabel) + '</text>' +
      '</svg>' +
      '<div class="viz-caption">바닥부터 차올라 <b>한계선에 닿는다</b> — 더 올라갈 데가 없다 (down 안 됨)</div>' +
      '</div>'
    );
  }

  function renderViz(item, settle) {
    var subj = item.subject_label;   // G2 — 명시 필드만
    var obj = item.object_label;     // G2 — 명시 필드만
    if (item.sense_id === "up-completion") {
      return svgUpCompletion(subj, obj, settle);
    }
    return svgUpVertical(subj, obj, settle);
  }

  // ===================================================================
  //  출제 풀 — 분리 계약의 핵심.
  // ===================================================================
  // 훈련 풀: training_items 에서만. transfer_items 를 절대 읽지 않는다.
  function buildTrainingPool() {
    return shuffle(C.training_items).slice(0, TRAIN_COUNT);
  }
  // 새 문장 풀: transfer_items 에서만. training_items 를 절대 읽지 않는다.
  function buildTransferPool() {
    return shuffle(C.transfer_items).slice(0, TRANSFER_COUNT);
  }

  // ===================================================================
  //  세션 상태 머신
  // ===================================================================
  // state.senseSeen: 같은 sense를 이번 세션에서 몇 번째 보고 있는지 (G3 반복 피로).
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
  //  화면 렌더
  // ===================================================================
  function renderIntro() {
    state = null;
    app.innerHTML =
      '<div class="card intro">' +
        '<p class="kicker">하나의 그림으로</p>' +
        '<h1>up, 한 번에 익히기</h1>' +
        '<p class="promise">up을 ‘위’라고만 외우면 eat up, time’s up, fill up이 ' +
          '다 <b>따로 외울 숙어</b>가 돼요. 사실 하나의 그림입니다.</p>' +
        '<p class="why muted">문장을 보고 그 up이 그리는 그림을 고르면, 정답마다 ' +
          '그 그림을 직접 보여 줘요. 그림으로 한 번 보면 다음 문장에서도 알아보게 됩니다.</p>' +
        '<p class="position-note">지금은 <b>up 하나</b>를 깊게 다룹니다 — 다음 감각이 이어집니다.</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="go-train">그림으로 익히기</button>' +
          '<button class="btn secondary" id="go-progress">내 기록 보기</button>' +
        '</div>' +
      '</div>';
    document.getElementById("go-train").onclick = startTraining;
    document.getElementById("go-progress").onclick = renderProgress;
    window.scrollTo(0, 0);
  }

  function renderQuestion() {
    var item = state.items[state.idx];
    var total = state.items.length;
    var n = state.idx + 1;
    var isTransfer = state.mode === "transfer";
    var fill = pct(state.idx, total);

    // R1 — 표시 순서 셔플. 화면 보기는 shuffled 배열을 그대로 쓴다.
    var shuffled = shuffleChoices(item);
    state.currentChoices = shuffled; // onAnswer에서 정답 판정에 쓴다

    var html =
      '<div class="card question">' +
        (isTransfer
          ? '<span class="new-flag">새 문장 테스트 — 익히기에 없던 문장이에요</span>'
          : "") +
        '<div class="progress-head">' +
          '<span>' + (isTransfer ? "새 문장" : "익히기") + " " + n + " / " + total + '</span>' +
          '<span>' + senseLabel(item.sense_id) + '</span>' +
        '</div>' +
        '<div class="progress-track"><div class="progress-fill" style="width:' + fill + '%"></div></div>' +
        '<p class="sentence">' + highlightUp(item.sentence) + '</p>' +
        '<p class="prompt">' + esc(item.prompt) + '</p>' +
        '<ul class="choices" id="choices">';

    var tags = ["a", "b", "c"];
    for (var i = 0; i < shuffled.length; i++) {
      html +=
        '<li><button class="choice" data-i="' + i + '">' +
          '<span class="tag">' + tags[i] + '</span>' +
          '<span class="ctext">' + esc(shuffled[i].text) + '</span>' +
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
    var correct = !!(state.currentChoices[displayIdx] && state.currentChoices[displayIdx].isAnswer);
    state.results.push({ id: item.id, sense_id: item.sense_id, correct: correct });

    // G3 — 같은 sense를 이번 세션에서 몇 번째 보는지. 3회째부터 풀 애니메이션 생략.
    state.senseSeen[item.sense_id] = (state.senseSeen[item.sense_id] || 0) + 1;
    var seenCount = state.senseSeen[item.sense_id];
    var fatigued = seenCount >= 3;

    // 보기 잠그고 정/오 표시
    var buttons = app.querySelectorAll(".choice");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      var di = parseInt(buttons[i].getAttribute("data-i"), 10);
      if (state.currentChoices[di] && state.currentChoices[di].isAnswer) buttons[i].classList.add("correct");
      else if (di === displayIdx) buttons[i].classList.add("wrong");
    }

    var sense = senseById(item.sense_id);
    var isLast = state.idx + 1 >= state.items.length;
    var autoNext = loadAutoNext();

    var fb = document.getElementById("feedback");
    fb.innerHTML =
      '<div class="feedback">' +
        '<p class="verdict ' + (correct ? "ok" : "no") + '">' +
          (correct ? "맞았어요 — 이 그림이에요." : "다시 — 이 그림을 보세요.") + '</p>' +
        '<p class="why">' + esc(item.why_ko) + '</p>' +
        // 메타포: 정답이면 미정착에서 출발해 정착(애니메이션), 오답이면 G4로 미정착 1박자.
        // G4가 G3보다 우선 — 오답이면 반복 피로여도 미정착부터 (ux-grammar G4 우선순위 규칙).
        renderViz(item, (fatigued && correct) ? true : false) +
        (sense && sense.boundary_ko
          ? '<p class="boundary"><b>down이 서는가:</b> ' + esc(sense.boundary_ko) + '</p>'
          : "") +
        '<label class="autonext-toggle">' +
          '<input type="checkbox" id="autonext"' + (autoNext ? " checked" : "") + ' /> ' +
          '맞히면 다음 문항으로 자동 넘기기' +
        '</label>' +
        '<div class="btn-row">' +
          '<button class="btn" id="next-q">' +
            (isLast ? "결과 보기" : "다음 문항") +
          '</button>' +
        '</div>' +
      '</div>';

    document.getElementById("autonext").onchange = function () {
      saveAutoNext(this.checked);
    };
    document.getElementById("next-q").onclick = nextQuestion;

    // ---- 메타포 애니메이션 구동 ----
    if (fatigued) {
      // G3 — 반복 피로: 풀 애니메이션 생략. 이미 settle 상태로 그렸으니 더 안 함.
    } else if (correct) {
      // 정답: 미정착 → 정착으로 transition.
      triggerSettle(fb);
    } else {
      // G4 — 오답: 미정착 상태(화살표 중간 / 그릇 절반)를 1박자 보여준 뒤 정착.
      window.setTimeout(function () { triggerSettle(fb); }, 1000);
    }

    // G3 — 자동 다음(정답일 때만). 미정착 그림이 한 번 정착하는 걸 본 뒤 넘긴다.
    if (autoNext && correct) {
      window.setTimeout(function () {
        var btn = document.getElementById("next-q");
        if (btn) nextQuestion();
      }, 1200);
    }
  }

  // 미정착 그림을 정착 상태로 전환 (transition 발화)
  function triggerSettle(scope) {
    var rise = scope.querySelector(".viz-rise");
    var fillEl = scope.querySelector(".viz-fill");
    var rim = scope.querySelector(".viz-rim");
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if (rise) { rise.classList.add("settle"); rise.removeAttribute("style"); }
        if (fillEl) { fillEl.classList.add("settle"); fillEl.removeAttribute("style"); }
        if (rim) { rim.classList.add("hit"); }
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
  //  집계
  // ===================================================================
  function scoreBySense(results) {
    var out = {};
    for (var i = 0; i < C.senses.length; i++) out[C.senses[i].id] = { correct: 0, total: 0 };
    for (var r = 0; r < results.length; r++) {
      var s = results[r].sense_id;
      if (!out[s]) out[s] = { correct: 0, total: 0 };
      out[s].total++;
      if (results[r].correct) out[s].correct++;
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
    var bySense = scoreBySense(state.results);

    if (state.mode === "training") {
      window.__gtf_pending = {
        date: new Date().toISOString(),
        training: { results: state.results, score: sc, bySense: bySense }
      };
      renderTrainingSummary(sc, bySense);
    } else {
      var pending = window.__gtf_pending || { date: new Date().toISOString(), training: null };
      pending.transfer = { results: state.results, score: sc, bySense: bySense };
      saveSession(pending);
      window.__gtf_pending = null;
      renderTransferResult(sc, bySense, pending.training);
    }
  }

  function senseBreakdownHtml(bySense) {
    var h = "";
    for (var i = 0; i < C.senses.length; i++) {
      var id = C.senses[i].id;
      var d = bySense[id] || { correct: 0, total: 0 };
      if (d.total === 0) continue;
      h += '<div class="split-cell">' +
        '<div class="label"><span class="dot" style="background:' + senseColor(id) + '"></span>' +
          senseLabel(id) + '</div>' +
        '<div class="val">' + d.correct + " / " + d.total + '</div>' +
        '<div class="small muted">' + pct(d.correct, d.total) + '%</div>' +
      '</div>';
    }
    return h;
  }

  function renderTrainingSummary(sc, bySense) {
    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">익히기 끝</p>' +
        '<h2>오늘 익힌 결과</h2>' +
        '<div class="score-big">' + pct(sc.correct, sc.total) + '%</div>' +
        '<div class="score-sub">' + sc.correct + " / " + sc.total + " 문항 — 알아보는 힘 점수</div>" +
        '<div class="split-row">' + senseBreakdownHtml(bySense) + '</div>' +
        '<p class="muted">감각이 잡혔는지, 익히기에 없던 <b>새 문장</b>으로 확인해 보세요.</p>' +
        '<p class="position-note small">지금은 up 하나를 깊게 — 다음 감각이 이어집니다.</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="go-transfer">새 문장 테스트</button>' +
          '<button class="btn secondary" id="go-home">처음으로</button>' +
        '</div>' +
      '</div>';
    document.getElementById("go-transfer").onclick = startTransfer;
    document.getElementById("go-home").onclick = renderIntro;
    window.scrollTo(0, 0);
  }

  function renderTransferResult(sc, bySense, training) {
    var trainPct = training ? pct(training.score.correct, training.score.total) : null;
    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">새 문장 테스트 끝</p>' +
        '<h2>결과</h2>' +
        '<div class="split-row">' +
          '<div class="split-cell">' +
            '<div class="label">익히기</div>' +
            '<div class="val">' + (trainPct === null ? "—" : trainPct + "%") + '</div>' +
            '<div class="small muted">' +
              (training ? training.score.correct + " / " + training.score.total : "이번 익히기 기록 없음") +
            '</div>' +
          '</div>' +
          '<div class="split-cell">' +
            '<div class="label">새 문장</div>' +
            '<div class="val">' + pct(sc.correct, sc.total) + '%</div>' +
            '<div class="small muted">' + sc.correct + " / " + sc.total + '</div>' +
          '</div>' +
        '</div>' +
        '<h3>감각별</h3>' +
        '<div class="split-row">' + senseBreakdownHtml(bySense) + '</div>' +
        '<p class="honesty">이 점수는 ‘<b>알아보는 힘</b>’이에요 — 고르기를 잘해도 ' +
          '직접 말하기·쓰기는 따로 늘어요.</p>' +
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
  //  진척 화면 — R8: 1세션이면 추이 대신 "오늘 잡은 감각" 요약.
  // ===================================================================
  function renderProgress() {
    state = null;
    var hist = loadHistory();

    var body;
    if (hist.length === 0) {
      body = '<p class="empty-note">아직 기록이 없어요. 한 번 익히고 새 문장 테스트까지 마치면 ' +
        '여기에 쌓입니다.</p>';
    } else if (hist.length === 1) {
      // R8 — 첫 세션: 추이 차트(막대 1개) 대신 오늘 잡은 감각 요약.
      body = firstSessionSummary(hist[0]);
    } else {
      // 2세션부터 추이.
      body =
        trendBlock("익히기 추이", hist, "train") +
        '<div class="section-gap"></div>' +
        trendBlock("새 문장 추이", hist, "transfer") +
        '<div class="section-gap"></div>' +
        senseRecentBlock(hist);
    }

    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">내 기록 (본인 학습용)</p>' +  // G6 — 정직 라벨
        '<h2>내가 잡아 가는 감각</h2>' +
        body +
        '<p class="honesty">이 기록은 ‘알아보는 힘’이 자라는 모습이에요 — ' +
          '말하기·쓰기 실력을 그대로 증명하지는 않아요.</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="pg-train">그림으로 익히기</button>' +
          '<button class="btn secondary" id="pg-home">처음으로</button>' +
        '</div>' +
      '</div>';
    document.getElementById("pg-train").onclick = startTraining;
    document.getElementById("pg-home").onclick = renderIntro;
    window.scrollTo(0, 0);
  }

  // R8 — 첫 세션 요약: sense별 정답 수 + 그림 한 번 더(작은 미니 카드).
  function firstSessionSummary(sess) {
    var train = sess.training;
    var transfer = sess.transfer;
    // 두 단계를 합친 sense별 정답 수
    var combined = {};
    for (var i = 0; i < C.senses.length; i++) combined[C.senses[i].id] = { correct: 0, total: 0 };
    [train, transfer].forEach(function (slot) {
      if (!slot || !slot.bySense) return;
      for (var id in slot.bySense) {
        if (!combined[id]) combined[id] = { correct: 0, total: 0 };
        combined[id].correct += slot.bySense[id].correct;
        combined[id].total += slot.bySense[id].total;
      }
    });

    var cards = "";
    for (var s = 0; s < C.senses.length; s++) {
      var id = C.senses[s].id;
      var d = combined[id] || { correct: 0, total: 0 };
      // 그림 한 번 더 — 정착 상태(완성된 그림)로 미니 표시. 라벨은 sense image의 요지.
      var mini = id === "up-completion"
        ? svgUpCompletion("내용", "끝까지", true)
        : svgUpVertical("바닥", "위로", true);
      cards += '<div class="today-cell">' +
        '<div class="today-head"><span class="dot" style="background:' + senseColor(id) + '"></span>' +
          senseLabel(id) + ' — <b>' + d.correct + ' / ' + d.total + '</b> 맞힘</div>' +
        mini +
      '</div>';
    }
    return '<p class="muted">오늘 처음이라 추이 대신 ‘오늘 잡은 감각’을 보여 드려요. ' +
      '두 번째부터는 추이가 그려집니다.</p>' +
      '<div class="today-grid">' + cards + '</div>';
  }

  // kind: 'train' | 'transfer'
  function trendBlock(title, hist, kind) {
    var cols = "";
    var any = false;
    for (var i = 0; i < hist.length; i++) {
      var slot = kind === "train" ? hist[i].training : hist[i].transfer;
      if (!slot || !slot.score || slot.score.total === 0) {
        cols += '<div class="bar-col"><div class="bar ' + kind + '" style="height:0%"></div>' +
          '<div class="bar-x">' + (i + 1) + '</div></div>';
        continue;
      }
      any = true;
      var p = pct(slot.score.correct, slot.score.total);
      cols += '<div class="bar-col">' +
        '<div class="bar ' + kind + '" style="height:' + p + '%"><span class="bar-val">' + p + '%</span></div>' +
        '<div class="bar-x">' + (i + 1) + '</div>' +
      '</div>';
    }
    if (!any) {
      return '<div class="chart-block"><h3>' + esc(title) + '</h3>' +
        '<p class="empty-note small">아직 이 기록이 없어요.</p></div>';
    }
    return '<div class="chart-block">' +
      '<h3>' + esc(title) + '</h3>' +
      '<div class="bars">' + cols + '</div>' +
      '<div class="small muted" style="margin-top:8px;">가로축: 세션 순서</div>' +
    '</div>';
  }

  function senseRecentBlock(hist) {
    var rows = "";
    for (var s = 0; s < C.senses.length; s++) {
      var id = C.senses[s].id;
      var lastTrain = null, lastTransfer = null;
      for (var i = hist.length - 1; i >= 0; i--) {
        if (lastTrain === null && hist[i].training && hist[i].training.bySense[id] && hist[i].training.bySense[id].total > 0) {
          var t = hist[i].training.bySense[id];
          lastTrain = pct(t.correct, t.total);
        }
        if (lastTransfer === null && hist[i].transfer && hist[i].transfer.bySense[id] && hist[i].transfer.bySense[id].total > 0) {
          var x = hist[i].transfer.bySense[id];
          lastTransfer = pct(x.correct, x.total);
        }
      }
      rows += '<div class="split-cell">' +
        '<div class="label"><span class="dot" style="background:' + senseColor(id) + '"></span>' +
          senseLabel(id) + '</div>' +
        '<div class="small" style="margin-top:8px;">최근 익히기 ' +
          (lastTrain === null ? "—" : "<b>" + lastTrain + "%</b>") + '</div>' +
        '<div class="small">최근 새 문장 ' +
          (lastTransfer === null ? "—" : "<b>" + lastTransfer + "%</b>") + '</div>' +
      '</div>';
    }
    return '<div class="chart-block"><h3>감각별 (최근 세션)</h3>' +
      '<div class="split-row">' + rows + '</div></div>';
  }

  // ===================================================================
  //  ⓘ 정보 패널 토글 (G5 — 상태·검증 정보는 첫 화면에서 치우고 뒤로)
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
  if (!C || !C.training_items || !C.transfer_items || !C.senses) {
    app.innerHTML = '<div class="card"><h2>콘텐츠를 불러오지 못했어요</h2>' +
      '<p class="muted">data.js가 같은 폴더에 있는지 확인해 주세요.</p></div>';
    return;
  }
  renderIntro();
})();
