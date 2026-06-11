# c2-3 Cycle Record (append-only)

> 잠금자: 사용자 지시("시작하라") + 세부 메인-서브 합의

```text
Skill Load Receipt
- skill: shared-skills/product-spiral-orchestrator/SKILL.md
- loaded_at_step: cycle-start (c2-3)
- candidate_id: c2-3
- previous_candidate_disposition: c2-2 = asset-only + 대표 후보 (사용자 기준 4 측정 진행 중 — 무결성 hotfix 1건 기록)
- required_gates: Fresh Start / Candidate Completeness / Monitor / Mechanical Verdict(+sentence_ko 검사) / Stop Permission / Asset Recovery
- blocked_until: c2-2 교훈 입력 (G11·G12, CONTRACT 9, 대비축 수렴 메모) — 충족

Skill Load Receipt
- skill: shared-skills/intent-lock/SKILL.md
- loaded_at_step: cycle-start
- required_gates: 코드 도달 단위 / 제품 계약 발전 / 전달 가치 탐색 / 자산 기여 WHO·WHY
- blocked_until: 아래 의도 잠금 — 충족
```

## 사이클 의도 잠금

- **목적**: C2 졸업선의 에이전트 몫 마감 — 기준 2 완성(동사 5/5) + 기준 3 마감(verb-choice 오답 대비축 수렴) + 운영 피드백 회수(sentence_ko 해석, 정답 후 표시).
- **새 콘텐츠**: 핵심 동사 `keep` — "힘으로 붙들어 영역 안에 유지"의 동적 유지 감각. have(그냥 있음, 힘 없음)와의 force 대비가 본질 (Talmy force dynamics). keep/have/get 3중 대비가 verb-choice의 본진 강화.
- **코드 도달 단위**: `candidates/c2-3/` 독립 웹 앱 — 8파일 120문장, 정답 후 한국어 해석(G12), G11 적용, **c2-2 사용 기록 이어받기**(gtf-c2-2- 읽기 전용 import — 사용자의 기준 4 Day 카운트 연속, 닫힌 후보 패치 아님).
- **제품 계약 발전**: V1 구체화 — 기준 2·3 충족으로 C2 졸업의 에이전트 측 조건 완성. 사용자 피드백 2건(정답 누설·해석)이 같은 사이클에 회수됨을 검증.
- **전달 가치 탐색**: V1 심화 (해석 피드백 — 이해 확인) + V2 유지 (Day 연속성).
- **자산 기여 (WHO·WHY)**: 코퍼스 8파일 120문장 + 전 문항 해석. WHO: 한국인 영어 학습자. WHY: keep을 "유지하다" 번역으로 외워 have와의 힘(force) 차이를 못 느끼는 문제 + 영어 문장 이해 불안(해석 부재)을 정답 후 해석으로 해소.
- **n_of_N**: 3 of 5.

## 콘텐츠 합의 기록 (c2-3b, 2026-06-11)

- 생성: opus 순차 2건 — ① keep.json(force dynamics 유지 감각, keep/have/get 3중 대비 verb-choice 5, 전 문항 sentence_ko 포함) + get.json 대비축 수렴 3건(know/make·give/send → 대비축 동사) ② sentence_ko 백필 105문항 (7파일, 구어체, 빈칸은 완성문 기준)
- 적대적 검수: 독립 opus. **blocking 1 + minor 3**, 회수:
  - B1 get-t9 "Now I ___ the idea" — have가 정답급(결과상태 독해) → "what you mean"으로 교체 (have what you mean 비문 → get 유일)
  - M1 Talmy locator 추상적·langacker keep 사례 단정 — 사람 리뷰(approve-4) 시 확인 항목으로 / M2 keep-hold 의인화 도식(수용 가능한 교육 단순화, keep-state와 통일 권고) / M3 have/keep 단방향 참조 정합 확인
  - 코퍼스 비대칭 note: have·up.json의 type 필드 미백필 (grandfather 유효, 차후 소급 정리 권고)
- 기각: keep 시한부 유일성, sense 분할 작위성, get-t7 take 오답, get-x3 keep 오답
- sentence_ko 표본 15 합격 (번역투 0, why_ko 역할 분리, 누설 0)
- 기계 재검증: 120문장 중복 0, keep 스키마 완비, answer_index 5/5/5

## 후보 빌드 기록 (c2-3 app, 2026-06-11)

- **Fresh start**: c2-2 `app.js`/`index.html`/`styles.css` 직접 패치 없음. 일일 공급 구조를 코드로 재구현(복사 아님). c2-2 localStorage(`gtf-c2-2-days`)는 *읽기 전용 import*만 — 원본 미변경.
- **data.js**: `window.CONTENT_ALL` 8파일 verbatim 임베드(have/get/take/make/keep/up/out/phrasal-up). 생성 시 8키 전부 원본 json과 deep-equal 확인.
- **G12 (이 후보 신규 검증 대상)**: 질문 단계에는 영어 문장만. 정답 확인 후 피드백에 `sentence_ko`를 완성 문장 아래 "해석" 라벨(작게)로 표시. 질문 렌더 경로에 `sentence_ko` 미참조.
- **G11**: 질문 렌더(`renderQuestion`)와 피드백 렌더(`renderFeedback`)를 *별 함수로 분리*. 질문 카드는 유형 알약(`typeLabel`)만 — `item-pill`/`itemColor`/`senseLabel` 호출은 피드백 함수에만 존재(정적 검사 가능하도록 구조화).
- **keep 메타포 (G9 계열, 신규)**: `svgKeep` — 원 안 칩이 경계 밖으로 향하는 *점선 화살표(나가려는 흐름, tendency)*를 손/걸쇠(누르는 손가락 두 개 + 손바닥 곡선)가 눌러 붙드는 그림. `keepContrastViz`로 have(누르는 손 없이 그냥 놓임)와 나란히 배치해 force 대비를 한 화면에서 가른다. (적대적 검수 blocking-1 회수의 구현체.)
- **Day 이어받기**: `loadAllDays` = `loadPrevDays`(gtf-c2-2-, 읽기 전용, `__imported` 태그) + `loadOwnDays`(gtf-c2-3-). Day 카운트·추이·sense 추적에 합산. 추이 막대는 이전 버전 Day를 흐리게(`imported`) 표시 + "이전 버전 N일 기록 포함" 라벨. ⓘ에 한 줄.
- **첫 화면**: "8개 감각, 120문장" + 변경점 한 줄("이제 정답 후 해석을 보여드려요" + keep 합류).

## 자가 한계 (빌드)

1. **keep "손" 도식의 가독성** — 실제 손이 아니라 곡선+손가락 두 개의 추상이라, 단독 노출 시 "걸쇠"인지 "손"인지 첫 읽힘이 약할 수 있음(N=1 저자 오염). keep↔have 나란히 대비가 보완하도록 설계했으나 실사용 검증 필요.
2. **Day 합산의 거친 근사** — c2-2(105문장)와 c2-3(120문장, keep 추가)은 콘텐츠 풀이 달라, 두 버전 정답률을 한 추이 축에 올리는 것은 추세 비교로는 근사다. "이전"으로 흐리게 구분했으나 빈틈 7(저자 오염)과 같은 계열의 한계.

## Stop Permission (요약)

- `local_candidate_status`: pass 목표 (verdict ALL PASS + 실행 스모크) — 아래 검증 결과로 확정.
- `representative_status`: c2-2가 대표. c2-3은 C2 기준 2(동사 5/5)·3 마감용 후보 — 승격 판단은 사용자 몫(기준 4·5는 달력 시간·사람 리뷰).
- `core_contribution_this_cycle`: keep 코퍼스(새 동사 풀) + G12 해석 피드백 + G11 단서 차단 구조 — primary 산출물(감각 퀴즈 화면)에 묶임.
- `n_of_N`: 3 of 5. `next_action`: 사용자 대기(기준 4 실사용·기준 5 출처 리뷰). `allowed_to_stop`: 빌드 단위 종료 — local Spiral 종료는 사용자 판단.
