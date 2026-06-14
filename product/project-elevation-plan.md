# get-the-feel — Prototype → Formal Project Plan

> 작성일: 2026-06-14
> 목적: 프로토타이핑 동안 실험한 가설·결과·자산을 정리하고, 정식 프로젝트로 승급한 뒤의 고도화 순서를 잠근다.

```text
Skill Load Receipt
- skill: docs/principles.md
- loaded_at_step: prototype-retrospective → formal-project-plan
- applied_principles: Intent-Evidence Chain / Preflight Gate / Atomic Step / Refuse First

Skill Load Receipt
- skill: shared-skills/product-spiral-orchestrator/SKILL.md
- loaded_at_step: prototype-retrospective → formal-project-plan
- required_gates: previous candidate disposition / asset recovery / stop permission / demand handoff
- candidate_id: none — this is not a new product candidate
- previous_candidate_disposition: c4-3 = representative candidate, deployed, local_ready pass
- blocked_until: demand-1 results for any claim stronger than local readiness

Skill Load Receipt
- skill: shared-skills/intent-lock/SKILL.md
- loaded_at_step: formalization intent
- required_gates: Refuse First / code-or-artifact reach / asset contribution / product promise relation
- blocked_until: no Primary Promise change without explicit user approval
```

## 승급 결정

get-the-feel은 "버릴 수 있는 화면 프로토타입" 단계를 넘겼다. 현재 대표 후보 `candidates/c4-3/`는 배포되어 있고, 기계 verdict는 `ALL PASS`이며, 코퍼스·UX 규칙·훈련 규칙·검증 도구가 작동 자산으로 분리되어 있다.

정식 프로젝트 승급의 의미는 다음이다.

- 제품 약속은 그대로 유지한다: 한국인 영어 학습자가 영어 토박이 층위 감각을 문장·퀴즈·산출로 체화한다.
- 후보를 계속 찍어내기보다, 수요 검증·콘텐츠 운영·품질 게이트·제품 고도화를 분리해 운영한다.
- 페르소나/자가검증/기계검증은 약한 verdict로 유지하고, 실제 target user 신호를 다음 고도화 우선순위의 1차 입력으로 삼는다.
- "학습 효과 검증됨", "말하기가 는다", "상업성 확인" 같은 claim은 demand-1 전까지 금지한다.

## 현재 기준선

| 항목 | 현재값 |
|---|---|
| 대표 후보 | `candidates/c4-3/` |
| 배포 | https://jaeyoung2026.github.io/get-the-feel/ |
| 코퍼스 | `assets/content/` 11파일, 24 sense, 173문항 |
| 축 | 핵심 동사 8, 불변화사 2, 구동사 1 |
| 모드 | 인식: 오늘의 새 문장/감각 집중, 산출: 빈칸 타이핑/어순 재배열/전문 쓰기, 통계: 인식/산출 분리 |
| 검증 | `node tools/verdict/check.mjs c4-3` → ALL PASS |
| 출처 상태 | strong 17 sense, weak 7 sense (`get-into-state`, `be`, `go`, `come` 계열 사람 리뷰 대기) |
| 수요 상태 | demand_unknown — 출시 후 target user 3~5명 검증 필요 |

## 프로토타입 실험 정리

### C1 Discovery — 감각 훈련이 표면에서 보이는가

- `c1-1 have`: have를 "소유"가 아니라 주어 영역 안의 정적 위치로 그리는 vertical slice를 만들었다.
- `c1-2 up`: 불변화사 축에서도 공간 메타포가 작동하는지 확인했다.
- 회수한 자산: R1~R8, G1~G6, 콘텐츠 데이터 계약의 출처·훈련/전이 분리 원칙.
- 핵심 배움: 정답 위치 고정, 보기의 쉬운 오답, 문장 파싱 라벨은 모두 감각 훈련을 망친다. 앱의 본체는 "문장 + 감각 그림 + 근접 오개념"이다.

### C2 Convergence — 축들이 결합되는가

- `c2-1`: get + up 구동사로 핵심 동사 감각과 불변화사 감각의 합성을 실험했다.
- `c2-2`: have/get/take/make/up/out/phrasal-up로 코퍼스 두께와 일일 공급력을 늘렸다.
- `c2-3`: keep과 한국어 해석 피드백을 추가하고, 대표 후보 승격·수요 검증 패키지를 만들었다.
- 회수한 자산: R9~R12, G7~G14, CLOSED_CANDIDATES 운영, sentence_ko/question-cue verdict.
- 핵심 배움: 축의 나열은 제품이 아니다. 구동사는 두 감각이 합쳐지는 자리여야 하고, 관용 구동사 반례도 정직하게 보여야 한다.

### C3 Readiness — 외부 검증 가능한가

- c2-3를 대표 후보로 승격하고, GitHub Pages 배포와 blind task 패키지를 만들었다.
- `local_ready: pass`를 얻었지만, 이는 수요 검증 완료가 아니라 수요 검증으로 넘길 수 있는 준비 완료다.
- 핵심 배움: local loop는 끝낼 수 있지만 demand는 에이전트가 대체할 수 없다.

### C4 Post-Launch Evolution — 실제 사용 피드백을 반영할 수 있는가

- `c4-1`: 주제 선택, 약점 기반 집중, 감각별 통계.
- `c4-2`: 제약형 산출 V3 — 빈칸 타이핑, 어순 재배열, 전문 쓰기와 자가채점.
- `c4-3`: be/go/come 확장으로 핵심 동사 축을 8개까지 넓혔다.
- 실사용자 버그: 정답 누설, 해석 위치, 모바일 레이아웃, 비문 오답, compose 오답 동사 복붙.
- 회수한 자산: R13~R15, G15~G17.
- 핵심 배움: 실제 사용자는 페르소나·기계·검수 3중 게이트가 놓친 결함을 잡는다. 정식 운영의 품질 게이트는 실제 사용 기록을 중심에 둬야 한다.

## 유지할 것

- Primary Promise: 토박이 감각 체화. 범용 영어앱으로 확장하지 않는다.
- 4축 구조: 핵심 동사, 불변화사/전치사, 구동사, 어순/구문.
- 감각 선택형 + 근접 오개념 + 정답 후 시각 피드백.
- 훈련/전이 분리, 출처 묶인 sense, `sentence_ko` 정답 후 노출.
- 인식 점수와 산출 점수 분리.
- 새 콘텐츠는 content-consensus 경유, weak→strong은 사람 승인 필요.
- verdict `ALL PASS` 없이는 배포하지 않는다.

## 버릴 것 또는 유예할 것

- 포인트, 스트릭, 배지 중심의 게이미피케이션.
- 회화/시험/리스닝 등 범용 영어앱 확장.
- "설명 많이 붙이면 이해된다"식 UX. 그림과 진행 버튼이 먼저다.
- 자동 효과 주장. 현재 수치는 본인 학습용/약한 verdict다.
- 서버·계정·결제·가격 실험. demand_validated 전까지 유예한다.
- 말하기 가치의 과대 표기. 현재 산출은 쓰기 중심이며 발화·시간압박은 별도 가설이다.

## 정식 프로젝트 운영 트랙

### Track 1 — Demand

목표: 실제 target user가 차별점과 훈련 가치를 느끼는지 확인한다.

- `handoff/blind-task-guide.md`를 현재 대표 후보 기준으로 정리한다.
- target user 3~5명에게 10분 blind task를 보낸다.
- 결과를 `demand_validated`, `demand_rejected`, `pivot_required` 중 하나로 판정한다.
- 과반이 "단어 암기/퀴즈 앱"으로만 설명하면 제품 차별은 기각한다.
- 과반이 새로 느낀 감각을 지목하지 못하면 훈련 가치는 기각한다.
- 1명 이상 자발 2회차가 있어야 demand_validated로 본다.

### Track 2 — Content

목표: 재방문을 만드는 공급력과 제품 정체성의 4축 완성을 확보한다.

- 우선순위 1: 축④ 어순·구문 신설. 제품 약속의 빈 칸이므로 폭 확장보다 먼저 검토한다.
- 우선순위 2: down/off/in + 해당 구동사. R6 재방문 동력을 늘린다.
- 우선순위 3: weak sense 7개 사람 출처 리뷰. strong 승격은 Ask first 대상이다.
- 신규 sense는 출처 claim과 이미지가 같은 범위에 있는지 적대적으로 검수한다.

### Track 3 — Learning UX

목표: "알아보는 힘"과 "꺼내 쓰는 힘"을 더 분명히 분리하고, 산출을 실제 사용에 가깝게 만든다.

- 인식 모드는 감각 그림과 전이 테스트의 품질을 높인다.
- 산출 모드는 쓰기 3단계를 유지하되, 전문 쓰기의 자가채점 약한 verdict 라벨을 계속 노출한다.
- 말하기/시간압박은 demand 결과에서 필요가 확인될 때 별도 후보로 설계한다.
- 어순 재배열은 단일 정답 함정을 피하기 위해 rigid order 필터 또는 복수 정답 데이터를 갖춘다.

### Track 4 — Quality & Engineering

목표: 정적 후보 앱에서 운영 가능한 제품 코드로 단계 상승하되, 과설계는 피한다.

- 현재는 후보별 독립 앱 구조를 유지한다.
- 반복되는 수동 data.js 임베드, smoke, deploy 단계는 도구화 후보로 둔다.
- 같은 클래스의 결함이 한 번 더 반복되면 verdict에 승격한다.
- jsdom smoke는 대표 후보 배포 전 필수로 유지한다.
- 서버, 로그인, DB, 분석 SDK는 demand_validated 전에는 도입하지 않는다.

### Track 5 — Ops & Documentation

목표: 실제 사용자 피드백이 들어왔을 때 어디에 기록하고 무엇을 고칠지 흐름을 고정한다.

- 수요 검증 결과는 append-only로 cycle record 또는 별도 demand ledger에 남긴다.
- 콘텐츠 오류는 `assets/content/` 수정 → content-consensus → verdict → deploy 순서로만 처리한다.
- 문서 기준선은 c4-3/173문항/24 sense로 맞춘다.
- 공개 저장소에는 배포 산출물만 둔다. 방법론·기록은 로컬 비공개를 유지한다.

## 단계별 고도화 로드맵

### P0 — Formalization Cleanup 완료

목표: 정식 프로젝트의 기준 문서가 현재 대표 후보와 맞게 정렬된다.

- 완료일: 2026-06-14.
- `handoff/blind-task-guide.md`: c4-3 기준으로 갱신.
- `product/demand-validation-package.md`: 173문항/24 sense 기준으로 정정.
- `AGENTS.md`/`README.md`: 코퍼스 숫자와 read order에 이 문서를 반영.
- 완료 기준 충족: 현재 안내 문서 drift 0, `node tools/verdict/check.mjs c4-3` ALL PASS 유지.

### P1 — Demand Validation

목표: 정식 프로젝트의 다음 투자 방향을 실제 사용자 신호로 결정한다.

- 3~5명 blind task 진행.
- 응답을 rubric으로 판정.
- 결과에 따라 다음으로 간다:
  - `demand_validated`: P2 콘텐츠/UX 고도화.
  - `pivot_required`: 차별은 살았지만 재방문/형식 문제를 고친다.
  - `demand_rejected`: Primary Promise 또는 전달 형식 재검토.

### P2 — Identity Completion

목표: 제품이 약속한 4축 중 비어 있는 어순·구문 축을 실제 훈련으로 만든다.

- word-order axis 콘텐츠 계약 세부화.
- 어순 문항 유형 설계: 재배열, chunk 선택, contrastive order feedback.
- content-consensus 경유로 최소 vertical slice 생성.
- 후보는 `candidates/c5-axis4/` 같은 새 폴더에서 fresh start로 만든다.

### P3 — Retention Supply

목표: 다시 열 이유를 콘텐츠 공급으로 만든다.

- down/off/in과 그 구동사 확장.
- 새 문장 소진/복습 모드의 사용자 표면 점검.
- 통계에서 약점→집중 연결의 실제 재방문 효과를 관찰한다.

### P4 — Production Shape

목표: demand가 살아 있을 때만 엔지니어링 레벨을 올린다.

- 후보 구조에서 앱 구조로 전환할지 결정한다.
- 콘텐츠 빌드 파이프라인, 배포 자동화, regression smoke를 정리한다.
- 사용자 데이터는 로컬 우선으로 유지하되, 필요가 검증되면 계정/동기화/분석을 별도 승인으로 검토한다.

## 승급 게이트

정식 프로젝트 운영에서 다음 claim은 각각 별도 증거 없이는 금지한다.

| claim | 필요한 증거 |
|---|---|
| 수요가 있다 | target user 3~5명 중 과반이 차별·훈련가치 통과 + 1명 이상 자발 2회차 |
| 학습 효과가 있다 | N을 늘린 반복 사용 기록 + 전이/산출 지표 개선. 현재는 효과 연구 아님 |
| 말하기에 도움된다 | 발화/시간압박 task를 실제로 수행한 증거 |
| 출처 strong | 사람 출처 리뷰와 승인 |
| 운영 가능하다 | 콘텐츠 수정→검수→verdict→deploy 흐름이 반복 성공 |
| 유료화 가능하다 | demand_validated 이후 가격/구매 의향 별도 실험 |

## 다음 작업

1. 바로 `demand-1`을 실행한다.
2. demand 결과 전에는 새 기능 후보를 만들지 않는다. 단, 문서 drift·명백한 버그·배포 차단 문제는 수리한다.
3. demand 결과가 들어오면 `c5-axis4`, `c5-particles`, `v-speak` 중 하나만 다음 후보로 잠근다.
