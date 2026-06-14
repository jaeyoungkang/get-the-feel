/* get-the-feel · c1-1 — 감각 훈련 앱 (순수 JS, file:// 안전)
 *
 * 화면: intro → training(10) → summary → transfer(5) → result → progress
 * 차별점: 각 sense를 인라인 SVG 공간 메타포로 그린다.
 *
 * 분리 계약 (separation-surface):
 *   훈련 출제 풀은 CONTENT.training_items 에서만 만든다.
 *   전이 출제 풀은 CONTENT.transfer_items 에서만 만든다.
 *   두 함수는 서로의 배열을 절대 참조하지 않는다 — 정적 확인 가능.
 */
(function () {
  "use strict";

  var C = window.CONTENT;
  var STORE_PREFIX = "gtf-c1-1-";
  var TRAIN_COUNT = 10;   // 훈련 출제 수 (셔플)
  var TRANSFER_COUNT = 5; // 전이 출제 수

  var app = document.getElementById("app");

  // ---------- sense 메타 (색·라벨) ----------
  function senseById(id) {
    for (var i = 0; i < C.senses.length; i++) {
      if (C.senses[i].id === id) return C.senses[i];
    }
    return null;
  }
  function senseLabel(id) {
    return id === "have-event-in-domain" ? "사건이 영역 안에" : "대상이 영역 안에";
  }
  function senseColor(id) {
    return id === "have-event-in-domain" ? "#8a6d2f" : "#3a6b5c";
  }

  // ---------- 유틸 ----------
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
  // 영어 문장에서 have/has/had/having 토큰을 강조 래핑
  function highlightVerb(sentence) {
    return esc(sentence).replace(/\b(has|have|had|having)\b/i, '<span class="kw">$1</span>');
  }

  // ---------- localStorage (진척) ----------
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

  // ===================================================================
  //  공간 메타포 SVG — 차별점. 장식 아니라 감각 전달 장치.
  // ===================================================================

  // have-domain-location: 주어를 나타내는 원(영역) + 그 안에 정적으로 놓이는 대상.
  // settle=true 면 대상이 원 안 제자리에 내려앉는 애니메이션(정답 시).
  function svgDomainLocation(subjectLabel, objectLabel, settle) {
    var cls = settle ? "viz-target settle" : "viz-target";
    // 미정착 상태: 원 바깥(위)에서 출발 → settle 시 transform 0,0 으로 들어옴
    var startTransform = settle ? "" : ' style="transform: translate(0px,-46px); opacity:0.25;"';
    return (
      '<div class="viz-wrap">' +
      '<svg viewBox="0 0 320 180" role="img" aria-label="주어 영역 안에 대상이 정적으로 놓인 그림">' +
        // 주어 영역 = 큰 원
        '<ellipse cx="160" cy="100" rx="120" ry="62" fill="#e8f0ec" stroke="#3a6b5c" stroke-width="2"/>' +
        '<text x="160" y="160" text-anchor="middle" font-size="13" fill="#3a6b5c" font-weight="700">' +
          esc(subjectLabel) + ' (영역)</text>' +
        // 대상 = 원 안에 자리하는 칩
        '<g class="' + cls + '"' + startTransform + '>' +
          '<rect x="118" y="78" width="84" height="44" rx="10" fill="#ffffff" stroke="#3a6b5c" stroke-width="2"/>' +
          '<text x="160" y="105" text-anchor="middle" font-size="14" fill="#232020" font-weight="600">' +
            esc(objectLabel) + '</text>' +
        '</g>' +
      '</svg>' +
      '<div class="viz-caption">대상이 주어의 영역 안에 <b>정적으로 자리한다</b></div>' +
      '</div>'
    );
  }

  // have-event-in-domain: 하루를 나타내는 가로 띠 + 사건 블록이 한 칸 차지.
  // settle 시 해당 칸이 채워지는 애니메이션(정답 시).
  function svgEventInDomain(subjectLabel, objectLabel, settle) {
    var slotX = [40, 110, 180, 250]; // 4칸 중
    var fillIdx = 2;                  // 사건이 들어갈 칸
    var blocks = "";
    for (var i = 0; i < slotX.length; i++) {
      if (i === fillIdx) {
        var cls = settle ? "viz-block settle" : "viz-block";
        var st = settle ? "" : ' style="opacity:0.2; transform: translate(0px,12px);"';
        blocks +=
          '<g class="' + cls + '"' + st + '>' +
          '<rect x="' + slotX[i] + '" y="64" width="58" height="40" rx="8" fill="#8a6d2f" />' +
          '<text x="' + (slotX[i] + 29) + '" y="89" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">' +
            esc(objectLabel) + '</text>' +
          '</g>';
      } else {
        blocks +=
          '<rect x="' + slotX[i] + '" y="64" width="58" height="40" rx="8" fill="#ffffff" stroke="#d9cba8" stroke-width="1.5" stroke-dasharray="4 4"/>';
      }
    }
    return (
      '<div class="viz-wrap">' +
      '<svg viewBox="0 0 320 180" role="img" aria-label="하루라는 가로 띠 안에 사건 블록이 한 칸 차지한 그림">' +
        // 하루 = 가로 띠
        '<rect x="24" y="52" width="288" height="64" rx="12" fill="#faf4e6" stroke="#8a6d2f" stroke-width="2"/>' +
        '<text x="168" y="40" text-anchor="middle" font-size="13" fill="#8a6d2f" font-weight="700">' +
          esc(subjectLabel) + '의 하루 (영역)</text>' +
        blocks +
        '<text x="168" y="142" text-anchor="middle" font-size="12" fill="#8a847d">시간 →</text>' +
      '</svg>' +
      '<div class="viz-caption">사건 한 칸이 영역 안에 자리해 주어가 그것을 <b>겪는다</b></div>' +
      '</div>'
    );
  }

  // 문장에서 주어/대상 단어를 거칠게 추출해 라벨로 쓴다.
  // (장식이 아니라 감각 라벨 — 완벽 파싱이 아니라 "누가/무엇" 단서면 충분)
  function deriveLabels(item) {
    var s = item.sentence.replace(/[.?!]$/, "");
    var m = s.match(/^(.+?)\b(has|have|had|having)\b\s+(.*)$/i);
    var subj = m ? m[1].trim() : s;
    var obj = m ? m[3].trim() : "";
    // 대상은 너무 길면 핵심 명사구로 줄인다 (앞 3단어)
    var objWords = obj.split(/\s+/).slice(0, 3).join(" ");
    if (objWords.length > 20) objWords = objWords.slice(0, 20) + "…";
    if (subj.length > 16) subj = subj.slice(0, 16) + "…";
    return { subject: subj || "주어", object: objWords || "대상" };
  }

  function renderViz(item, reveal) {
    var labels = deriveLabels(item);
    if (item.sense_id === "have-event-in-domain") {
      return svgEventInDomain(labels.subject, labels.object, reveal);
    }
    return svgDomainLocation(labels.subject, labels.object, reveal);
  }

  // ===================================================================
  //  출제 풀 — 분리 계약의 핵심.
  // ===================================================================
  // 훈련 풀: training_items 에서만. transfer_items 를 절대 읽지 않는다.
  function buildTrainingPool() {
    return shuffle(C.training_items).slice(0, TRAIN_COUNT);
  }
  // 전이 풀: transfer_items 에서만. training_items 를 절대 읽지 않는다.
  function buildTransferPool() {
    return shuffle(C.transfer_items).slice(0, TRANSFER_COUNT);
  }

  // ===================================================================
  //  세션 상태 머신
  // ===================================================================
  var state = null; // { mode: 'training'|'transfer', items, idx, results: [] }

  function startTraining() {
    state = { mode: "training", items: buildTrainingPool(), idx: 0, results: [] };
    renderQuestion();
  }
  function startTransfer() {
    state = { mode: "transfer", items: buildTransferPool(), idx: 0, results: [] };
    renderQuestion();
  }

  // ===================================================================
  //  화면 렌더
  // ===================================================================
  function renderIntro() {
    state = null;
    app.innerHTML =
      '<div class="card intro">' +
        '<p class="kicker">get-the-feel · core verbs</p>' +
        '<h1>have의 감각 훈련</h1>' +
        '<p class="promise">번역(가지다)이 아니라 <b>그림</b>으로 — have를 ' +
          '"주어의 영역 안에 무언가가 놓여 있다"는 공간 감각으로 몸에 붙인다.</p>' +
        '<p class="why muted">규칙 암기가 아니라 감각 체화가 목표입니다. ' +
          '감각 선택형 문항을 풀면서, 정답마다 그 감각을 그림으로 봅니다.</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="go-train">훈련 시작</button>' +
          '<button class="btn secondary" id="go-progress">진척 보기</button>' +
        '</div>' +
      '</div>';
    document.getElementById("go-train").onclick = startTraining;
    document.getElementById("go-progress").onclick = renderProgress;
  }

  function renderQuestion() {
    var item = state.items[state.idx];
    var total = state.items.length;
    var n = state.idx + 1;
    var isTransfer = state.mode === "transfer";
    var fill = pct(state.idx, total);

    var html =
      '<div class="card question">' +
        (isTransfer
          ? '<span class="transfer-flag">전이 테스트 — 훈련에 없던 새 문장입니다</span>'
          : "") +
        '<div class="progress-head">' +
          '<span>' + (isTransfer ? "전이" : "훈련") + " " + n + " / " + total + '</span>' +
          '<span>' + senseLabel(item.sense_id) + '</span>' +
        '</div>' +
        '<div class="progress-track"><div class="progress-fill" style="width:' + fill + '%"></div></div>' +
        '<p class="sentence">' + highlightVerb(item.sentence) + '</p>' +
        '<p class="prompt">' + esc(item.prompt) + '</p>' +
        '<ul class="choices" id="choices">';

    var tags = ["a", "b", "c"];
    for (var i = 0; i < item.choices.length; i++) {
      html +=
        '<li><button class="choice" data-i="' + i + '">' +
          '<span class="tag">' + tags[i] + '</span>' +
          '<span class="ctext">' + esc(item.choices[i]) + '</span>' +
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

  function onAnswer(chosen) {
    var item = state.items[state.idx];
    var correct = chosen === item.answer_index;
    state.results.push({ id: item.id, sense_id: item.sense_id, correct: correct });

    // 보기 잠그고 정/오 표시
    var buttons = app.querySelectorAll(".choice");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      var idx = parseInt(buttons[i].getAttribute("data-i"), 10);
      if (idx === item.answer_index) buttons[i].classList.add("correct");
      else if (idx === chosen) buttons[i].classList.add("wrong");
    }

    var sense = senseById(item.sense_id);
    var fb = document.getElementById("feedback");
    fb.innerHTML =
      '<div class="feedback">' +
        '<p class="verdict ' + (correct ? "ok" : "no") + '">' +
          (correct ? "맞았어요 — 이 그림이에요." : "다시 — 이 감각을 보세요.") + '</p>' +
        '<p class="why">' + esc(item.why_ko) + '</p>' +
        renderViz(item, false) +
        (sense && sense.boundary_ko
          ? '<p class="boundary"><b>경계:</b> ' + esc(sense.boundary_ko) + '</p>'
          : "") +
        '<div class="btn-row">' +
          '<button class="btn" id="next-q">' +
            (state.idx + 1 < state.items.length ? "다음 문항" : "결과 보기") +
          '</button>' +
        '</div>' +
      '</div>';

    // 정답일 때 메타포 애니메이션 트리거 (대상이 영역 안에 자리하는 동작)
    if (correct) {
      var vt = fb.querySelector(".viz-target, .viz-block");
      if (vt) {
        // 다음 프레임에 settle 클래스를 붙여 transition을 발화시킨다
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            var t = fb.querySelector(".viz-target");
            var bl = fb.querySelector(".viz-block");
            if (t) { t.classList.add("settle"); t.removeAttribute("style"); }
            if (bl) { bl.classList.add("settle"); bl.removeAttribute("style"); }
          });
        });
      }
    } else {
      // 오답이어도 감각은 보여준다 — 단, 정착된 정답 상태로 그린다(학습 목적)
      var t2 = fb.querySelector(".viz-target");
      var bl2 = fb.querySelector(".viz-block");
      if (t2) { t2.classList.add("settle"); t2.removeAttribute("style"); }
      if (bl2) { bl2.classList.add("settle"); bl2.removeAttribute("style"); }
    }

    document.getElementById("next-q").onclick = nextQuestion;
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

  // sense별 정답 집계
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
      // 훈련 결과를 세션 단위로 임시 보관 → 전이까지 마치면 합쳐 저장
      window.__gtf_pending = {
        date: new Date().toISOString(),
        training: { results: state.results, score: sc, bySense: bySense }
      };
      renderTrainingSummary(sc, bySense);
    } else {
      // 전이 결과 — 훈련과 분리해 보관 후 저장
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
        '<div class="label"><span class="dot" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' +
          senseColor(id) + ';margin-right:6px;"></span>' + senseLabel(id) + '</div>' +
        '<div class="val">' + d.correct + " / " + d.total + '</div>' +
        '<div class="small muted">' + pct(d.correct, d.total) + '%</div>' +
      '</div>';
    }
    return h;
  }

  function renderTrainingSummary(sc, bySense) {
    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">훈련 완료</p>' +
        '<h2>이번 세션 훈련 결과</h2>' +
        '<div class="score-big">' + pct(sc.correct, sc.total) + '%</div>' +
        '<div class="score-sub">' + sc.correct + " / " + sc.total + " 문항 정답</div>" +
        '<div class="split-row">' + senseBreakdownHtml(bySense) + '</div>' +
        '<p class="muted">감각이 잡혔는지 확인하려면, 훈련에 없던 새 문장으로 전이 테스트를 보세요.</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="go-transfer">전이 테스트</button>' +
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
        '<p class="kicker">전이 테스트 완료</p>' +
        '<h2>결과 — 훈련과 전이는 따로 봅니다</h2>' +
        '<div class="split-row">' +
          '<div class="split-cell">' +
            '<div class="label">훈련 정답률</div>' +
            '<div class="val">' + (trainPct === null ? "—" : trainPct + "%") + '</div>' +
            '<div class="small muted">' +
              (training ? training.score.correct + " / " + training.score.total : "이번 세션 훈련 기록 없음") +
            '</div>' +
          '</div>' +
          '<div class="split-cell">' +
            '<div class="label">전이 정답률 (새 문장)</div>' +
            '<div class="val">' + pct(sc.correct, sc.total) + '%</div>' +
            '<div class="small muted">' + sc.correct + " / " + sc.total + '</div>' +
          '</div>' +
        '</div>' +
        '<h3>sense별 전이</h3>' +
        '<div class="split-row">' + senseBreakdownHtml(bySense) + '</div>' +
        '<p class="honesty">전이 성적은 감각 체화의 <b>근사 증거</b>입니다 — ' +
          '선택형 정답은 알아보는 능력의 프록시이지, 말하기·쓰기에서 감각이 작동함을 직접 증명하지 않습니다.</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="go-progress2">성장 보기</button>' +
          '<button class="btn secondary" id="go-home2">처음으로</button>' +
        '</div>' +
      '</div>';
    document.getElementById("go-progress2").onclick = renderProgress;
    document.getElementById("go-home2").onclick = renderIntro;
    window.scrollTo(0, 0);
  }

  // ===================================================================
  //  성장 가시화 (V2) — 진척 화면
  // ===================================================================
  function renderProgress() {
    state = null;
    var hist = loadHistory();

    var body;
    if (hist.length === 0) {
      body = '<p class="empty-note">아직 기록이 없습니다. 훈련을 한 세션 마치면 ' +
        '여기에 정답률 추이가 쌓입니다.</p>';
    } else {
      body =
        chartBlock("훈련 정답률 추이", hist, "train") +
        '<div class="section-gap"></div>' +
        chartBlock("전이 정답률 추이 (새 문장)", hist, "transfer") +
        '<div class="section-gap"></div>' +
        senseTrendBlock(hist);
    }

    app.innerHTML =
      '<div class="card">' +
        '<p class="kicker">성장 가시화 · V2</p>' +
        '<h2>감각이 자라는 게 보이는가</h2>' +
        body +
        '<p class="honesty">측정은 수용(알아봄) 능력의 <b>근사치</b>입니다 — 산출(말·글)에서의 감각 작동을 직접 증명하지는 않습니다.</p>' +
        '<div class="btn-row">' +
          '<button class="btn" id="pg-train">훈련 시작</button>' +
          '<button class="btn secondary" id="pg-home">처음으로</button>' +
        '</div>' +
      '</div>';
    document.getElementById("pg-train").onclick = startTraining;
    document.getElementById("pg-home").onclick = renderIntro;
    window.scrollTo(0, 0);
  }

  // kind: 'train' | 'transfer'
  function chartBlock(title, hist, kind) {
    var cols = "";
    var any = false;
    for (var i = 0; i < hist.length; i++) {
      var slot = kind === "train" ? hist[i].training : hist[i].transfer;
      if (!slot || !slot.score || slot.score.total === 0) {
        cols += '<div class="bar-col"><div class="bar ' + (kind === "train" ? "train" : "transfer") +
          '" style="height:0%"></div><div class="bar-x">' + (i + 1) + '</div></div>';
        continue;
      }
      any = true;
      var p = pct(slot.score.correct, slot.score.total);
      cols += '<div class="bar-col">' +
        '<div class="bar ' + (kind === "train" ? "train" : "transfer") + '" style="height:' + p + '%">' +
          '<span class="bar-val">' + p + '%</span>' +
        '</div>' +
        '<div class="bar-x">' + (i + 1) + '</div>' +
      '</div>';
    }
    if (!any) {
      return '<div class="chart-block"><h3>' + esc(title) + '</h3>' +
        '<p class="empty-note small">아직 이 항목 기록이 없습니다.</p></div>';
    }
    return '<div class="chart-block">' +
      '<h3>' + esc(title) + '</h3>' +
      '<div class="bars">' + cols + '</div>' +
      '<div class="small muted" style="margin-top:8px;">가로축: 세션 순서</div>' +
    '</div>';
  }

  // sense별 추이 — 마지막 세션 기준 분리 표기 (간단 바)
  function senseTrendBlock(hist) {
    // 각 sense의 최근 훈련·전이 정답률을 보여준다
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
        '<div class="label"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' +
          senseColor(id) + ';margin-right:6px;"></span>' + senseLabel(id) + '</div>' +
        '<div class="small" style="margin-top:8px;">최근 훈련 ' +
          (lastTrain === null ? "—" : "<b>" + lastTrain + "%</b>") + '</div>' +
        '<div class="small">최근 전이 ' +
          (lastTransfer === null ? "—" : "<b>" + lastTransfer + "%</b>") + '</div>' +
      '</div>';
    }
    return '<div class="chart-block"><h3>sense별 (최근 세션)</h3>' +
      '<div class="split-row">' + rows + '</div></div>';
  }

  // ===================================================================
  //  부팅
  // ===================================================================
  if (!C || !C.training_items || !C.transfer_items || !C.senses) {
    app.innerHTML = '<div class="card"><h2>콘텐츠를 불러오지 못했습니다</h2>' +
      '<p class="muted">data.js가 같은 폴더에 있는지 확인해 주세요.</p></div>';
    return;
  }
  renderIntro();
})();
