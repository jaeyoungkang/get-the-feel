# get-the-feel — Agent Guide

**한국인 영어 학습자가 영어의 게르만 토박이 층위 감각(have/get/take/make/keep/be/go/come · up/out · 구동사 · 어순)을 문장·퀴즈·산출로 체화하는 트레이닝 웹 앱.**

product-weaver의 fork-style 도메인 인스턴스. 베이스 파일(`docs/principles.md`, `shared-skills/`)은 **수정 금지** — 베이스 갱신은 product-weaver 저장소에서 별 사이클로 처리, 여기선 fetch + merge (Ask first).

---

## 현재 상태 (2026-06-13 — 새 세션은 여기부터)

- **단계**: C1 Discovery → C2 Convergence 졸업 → C3 Readiness(local_ready: pass) → **C4 출시 후 진화** 진행 중.
- **대표 후보**: `candidates/c4-3/` — 배포 라이브 **https://jaeyoung2026.github.io/get-the-feel/**
- **코퍼스**: `assets/content/` 11파일 24 sense 173문항 — 핵심 동사 8(have·get·take·make·keep·be·go·come), 불변화사 2(up·out), 구동사(V+up). 출처 strong 17 sense + weak 7 sense(get-into-state·be·go·come 계열 — 사람 출처 리뷰 대기).
- **모드**: 인식(오늘의 새 문장 / 감각 골라 집중) + 산출(써보기 — 빈칸 타이핑·어순 재배열·전문 쓰기) + 통계(감각별 추이·강약점). 인식≠산출 통계 분리.
- **사용자 피드백 4건 반영 완료**: 주제 선택·get started(get+pp)·숙련도 통계·작문(제약형 산출 V3).
- **실사용 검증의 위력**: 실사용자가 페르소나·기계·검수 3중 게이트가 놓친 결함을 **5건** 적발(정답 누설→해석→레이아웃→비문 오답→오답 동사 복붙). **실제 사용이 최강 검증 채널.**

### 열린 일 (다음 후보 방향)
1. **demand-1 (최우선·사용자 손)** — 출시 후 실제 target user 3~5명 수요 검증. `handoff/blind-task-guide.md`로 URL 전달 → demand_validated/rejected/pivot_required 판정. **에이전트가 못 하는 유일한 것.** `product/demand-validation-package.md` 참조.
2. **축④ 어순·구문 신설** — 제품이 약속한 4축 중 유일한 빈 칸(정체성 완성 > 폭 확장).
3. **콘텐츠 폭** — 불변화사 down/off/in + 그 구동사 (R6 재방문 동력).
4. **말하기(발화) 가치** — 산출이 "쓰기 8할"까지 갔으나 발화·시간압박은 미해결(차기 가설).

---

## Read Order

1. `product/contract.md` — 제품 계약 정본 (Primary Promise·4축·거부 신호·전달 가치 V1~V4·**승격 6기준**·미승인·빈틈)
2. `product/asset-map.md` — 자산 지도 (5 trunk + 명시 거부 + 각 trunk last_cycle_contribution)
3. `product/project-elevation-plan.md` — 프로토타입 실험 정리 + 정식 프로젝트 고도화 계획
4. `docs/project-structure.md` — 본격 제품 개발용 app/src/public/scripts 경계와 legacy 후보 이관 규칙
5. `fix_plan.md` — 작업 큐 + 사후 승인 큐 (approve-1~6 처리 상태)
6. `assets/` — **자산 정본**: `content/CONTRACT.md`(데이터 계약 9규칙), `training-design.md`(R1~R15), `ux-grammar.md`(G1~G17), `misconceptions.md`(오개념 카탈로그), `content/sources.md`(출처 9건)
7. `skills/content-consensus/SKILL.md` — 콘텐츠 3자 합의 도메인 스킬
8. `docs/principles.md` + `shared-skills/` — 베이스 정본. 핵심 행동은 스킬 경유 + Skill Load Receipt 필수.

---

## 한 사이클 작업 레시피 (새 후보 만들 때)

후보 폴더 `candidates/<id>/` — **독립 실행 완제품**(index.html·styles.css·app.js·data.js). 이전 후보 패치 금지(fresh start). 직전 대표는 `tools/verdict/check.mjs`의 `CLOSED_CANDIDATES`에 등재(동결).

1. **사이클 의도 잠금** — `shared-skills/product-spiral-orchestrator/SKILL.md` + `shared-skills/intent-lock/SKILL.md` receipt를 `candidates/<id>/cycle-record.md`에. 축/제품계약 발전 한 줄/전달 가치 탐색/자산 기여 WHO·WHY.
2. **콘텐츠(신규·변경 시)** — `skills/content-consensus/SKILL.md` 경유: 생성 ≠ 독립 적대 검수 ≠ 수정 (권한 분리). 검수 5관점 + receipt를 cycle-record에.
3. **빌드** — 후보 앱. data.js는 `assets/content/*.json` verbatim 임베드. G1~G17·R1~R15 전부 계승. 헬퍼(itemColor 등) 정의 확인(미정의 헬퍼=죽은 후보 사고).
4. **기계 검증** — `node tools/verdict/check.mjs <id>` ALL PASS + 직전 후보 회귀 0. 빌드 후 **jsdom 실행 스모크**(돌아간다≠작동한다 — 죽은 후보 차단).
5. **평가** — 페르소나 blind task(배포 URL을 playwright로 실구동, 회의론자 포함) + 모니터 3종(Intent Guardian·Asset Steward·Data/Sellability). repair-before-next면 다음 후보 전 수리.
6. **자산 회수** — 배움을 `product/`·`assets/`·`tools/`로. 평가 질문: **"다음 후보의 약속 전달력을 올리는가"** (속도 아닌 효과). cycle record·transcript에만 남으면 미회수.
7. **stop permission** — cycle-record에 local_candidate_status·representative_status·core_contribution·local_ready·next_action·allowed_to_stop.
8. **배포** — `tools/deploy/deploy-pages.sh <id>` (verdict PASS 아니면 차단). 대표 갱신 시 contract.md "대표 후보" 줄·README 갱신.

콘텐츠만 확장하는 후보는 4·5를 콘텐츠 검수 중심으로 축소 가능(앱 기능 불변 시).

---

## 명령

```bash
npm run dev                               # Next.js 제품 앱
npm run quality:check                     # legacy sync + verdict + typecheck + lint + build
node tools/verdict/check.mjs <candidate-id>      # 기계 검증 (예: c4-3). ALL PASS여야 진행
tools/deploy/deploy-pages.sh <candidate-id>       # GitHub Pages 배포 (verdict 통과 시만)
# 페르소나/모니터: /tmp 에 playwright로 배포 URL을 chromium(390x844) 구동, 화면만 근거
```
배포 저장소: `github.com/jaeyoung2026/get-the-feel` (공개 — 배포 산출물 4파일만. 방법론·기록은 이 로컬 저장소에 비공개).

---

## 운영 원칙 (지속 — 사용자 지침에서)

- **자산은 속도가 아니라 약속 전달력으로 평가한다** ("더 효과적으로"). 루프 목적은 완성도 높은 자산의 고도화이지 히스토리 축적이 아니다.
- **하위 작업(탐색·생성·검수·평가)은 서브에이전트 적극 활용** (탐색=Explore, 비판=적대적 프롬프트·베이스 밖 어휘 강제). 메인은 의도 보존에 집중.
- **실사용자 검증이 최강 게이트** — 페르소나·시뮬·자가채점은 *약한 verdict*, 수요 근거로 승격 금지. 실제 사용자 신호가 다음 콘텐츠 방향을 정한다.
- **닫힌 후보는 마감 시점 PASS가 정본** — 코퍼스 진화 drift는 결함 아님(CLOSED_CANDIDATES).

---

## Harness Case

| 항목 | 선택 |
|---|---|
| Intent Lock | `product/contract.md` — 인터뷰 기반, 미승인은 별도 섹션 + `fix_plan.md` 사후 승인 큐 |
| Gap Ledger | `candidates/<id>/cycle-record.md` (append-only — 판정 덮어쓰기 금지) + git commit log |
| Mechanical Verdict | `tools/verdict/check.mjs` — content-contract·adversarial-review·data-sync·separation·no-gamification·choice-shuffle·label-fields·sentence-ko·question-cue·smoke. unknown/not-met은 승격 차단 |
| 모니터 | Intent Guardian / Asset Steward / Data·Sellability — 후보 종료마다, repair-before-next면 다음 후보 전 수리 |
| 도메인 스킬 | `skills/content-consensus/` (콘텐츠 3자 합의 — 2회+ 반복으로 승격) |
| 의도적 거부 | 게이미피케이션 중심 / 범용 영어 학습앱 확장 / 엔지니어링 front-load / 선제 스킬 신설 |

---

## Boundaries (Refuse First)

- **Never**: 베이스 파일 수정 / 이전 후보 패치해 새 사이클 칭하기 / 출처 없는 감각 콘텐츠 승격 / 훈련·전이 문장 중복 / verb-choice 오답에 비문 동사(R15) / 게이미피케이션·범용화 확장
- **Ask first**: 4축 경계·Primary Promise 변경 / Spiral 도달 기준(승격 6기준·졸업선) 변경 / 과금·새 외부 노출 / weak→strong 출처 승격
- **Always**: 핵심 행동은 스킬 경유 + Skill Load Receipt / 한 turn = 한 항목 = 한 commit / 후보마다 cycle-record stop permission / 사후 승인 큐는 trigger 시점 사용자 승인 / 콘텐츠 변경은 content-consensus 경유

## Inheritance

베이스(product-weaver) 정본을 단방향 참조. 인스턴스 → 베이스 방향만. 도메인 산출물을 베이스로 끌어올리지 않는다.
