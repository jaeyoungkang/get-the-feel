# get-the-feel — Agent Guide

**한국인 영어 학습자가 영어의 게르만 토박이 층위 감각(have/get/take/make/keep/be/go/come · up/out · 구동사 · 어순)을 문장·해설·퀴즈·산출로 체화하는 트레이닝 웹 앱.**

이 저장소의 현재 운영 정본은 **Story Chain + Mission Control + engineering assurance**다. product-weaver/Spiral Loop는 프로토타입을 만들 때 쓴 과거 방법론이며, 새 제품 개발의 운영 기준이 아니다. 과거 후보와 cycle record는 `archive/prototypes/`에 증거로만 보존한다.

---

## 현재 상태 (2026-06-14)

- **제품 단계**: 정식 제품 개발 기준선. 프로토타입 대표 증거 c4-3는 보관 상태이며, 새 기능은 `app/`·`src/`와 Story Chain 계약으로 진행한다.
- **라이브 배포**: https://jaeyoung2026.github.io/get-the-feel/
- **현재 제품 표면**: `/`는 legacy c4-3 trainer를 임베드하고, `/explain`은 사용자가 준 영어 문장을 현재 코퍼스 감각 해설과 연습 문항으로 연결한다.
- **코퍼스**: `assets/content/` 11파일 24 sense 173문항. 핵심 동사 8, 불변화사 2, 구동사 V+up. weak sense는 사람 출처 리뷰 전까지 strong으로 올리지 않는다.
- **Story Chain 상태**: `npm run mc:status` 기준 release ready. 1 experience, 2 moments, 4 active promises, 2 aspects, `current-build.ledger.md` evidence.
- **프로토타입 증거**: `archive/prototypes/c4-3/`는 현재 legacy trainer의 근거다. 직접 수정하지 않는다.

### 열린 일

1. **demand-1** — 실제 target user 3~5명 수요 검증. 에이전트가 대체할 수 없는 사용자/시간 작업.
2. **축④ 어순·구문** — 제품이 약속한 4축 중 아직 정식 훈련으로 부족한 영역.
3. **콘텐츠 폭** — down/off/in 및 그 구동사 확장.
4. **말하기 가치** — 현재 산출은 쓰기 중심이다. 발화·시간압박은 별도 evidence가 필요하다.

---

## Read Order

1. `docs/contracts/story-chain/README.md` + `docs/contracts/story-chain/concepts.md` — Story Chain 개념·책임·검증 정본.
2. `docs/contracts/story-chain/experiences/native-sense-training.md` — 오래 유지할 제품 경험.
3. `docs/contracts/story-chain/moments/first-training-session.md` — 현재 약속들이 발동되는 workflow 순간.
4. `docs/contracts/story-chain/promises/` — 제품이 사용자에게 지키는 active promises.
5. `docs/contracts/story-chain/aspects/` — 출처·통계 분리 같은 횡단 제약.
6. `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` + `docs/contracts/story-chain/evidence-ledgers/reviews/current-build.reviews.md` — 현재 evidence와 Sufficiency Review.
7. `docs/contracts/feature-specs.md` + `docs/contracts/story-chain/scenario-catalog.md` — AC와 scenario 인덱스.
8. `product/README.md` + `product/contract.md` — 제품 계약 요약과 product 디렉터리 경계.
9. `assets/` — 콘텐츠 정본: `content/CONTRACT.md`, `content/sources.md`, `training-design.md`, `ux-grammar.md`, `misconceptions.md`.
10. `docs/project-structure.md`, `docs/engineering/`, `docs/operations/`, `docs/verification-gates.md` — 엔지니어링/운영 경계.
11. `fix_plan.md` — 작업 큐.

---

## 정식 제품 작업 레시피

정식 제품 변경은 Story Chain에서 시작한다. 새 기능·흐름·검증장치 변경은 최소 하나의 Promise, Acceptance Check, Evidence Ledger row, code trace와 연결한다.

1. **Mission Control 확인** — `npm run mc:status`를 먼저 실행한다. Story Chain 변경이면 `shared-skills/mission-control/SKILL.md`와 관련 companion skill을 로드한다.
2. **계약 범위 결정** — 새 의미면 Human authority가 필요하다. 이미 승인된 의미의 보강·전파·evidence 정리는 Agent가 진행할 수 있다.
3. **Promise/Aspect 갱신** — `docs/contracts/story-chain/promises/`와 `aspects/`를 먼저 정리한다. Acceptance Check는 관찰 가능한 deterministic contract로 쓴다.
4. **Evidence Ledger 연결** — `check:evidence-coverage` row, run command, scenario, Sufficiency Review를 같은 변경에 맞춘다.
5. **구현** — 제품 코드는 `app/`·`src/`에 둔다. `public/legacy/c4-3/`는 `npm run prototype:sync`의 산출물이다.
6. **검증** — 코드 변경은 `npm run quality:check`, 문서/계약 변경만 있어도 `npm run quality:contracts`를 통과시킨다.
7. **기록** — 운영상 의미 있는 결정은 `docs/change-log.md`, `docs/project-events/`, 필요 시 project knowledge에 남긴다.
8. **커밋** — 한 turn = 한 항목 = 한 commit.

---

## 명령

```bash
npm run dev
npm run quality:check
npm run quality:contracts
npm run mc:status
npm run mc:validate-story-chain
npm run mc:audit-surface
npm run mc:check-new-criticals
npm run guard:skills
npm run pk:validate
```

Legacy/prototype compatibility commands:

```bash
npm run prototype:sync
npm run verdict
node tools/verdict/check.mjs c4-3
tools/deploy/deploy-pages.sh c4-3
```

---

## Operating Boundaries

- **Never**: 출처 없는 감각 콘텐츠 승격 / weak→strong 무단 승격 / 훈련·전이 문장 중복 / 인식 통계와 산출 통계 병합 / 게이미피케이션 중심 확장 / 범용 영어앱 확장 / `archive/prototypes/` 또는 `public/legacy/c4-3/`를 새 source로 사용.
- **Ask first**: Primary Promise 변경 / 4축 경계 변경 / 과금·새 외부 노출 / 서버·계정·분석 SDK 도입 / weak sense의 strong 승격.
- **Always**: Story Chain Promise·AC·Evidence·code trace 유지 / 콘텐츠 변경은 `skills/content-consensus/SKILL.md` 경유 / 실제 사용자 검증은 demand evidence로 별도 취급 / `unknown` verdict는 release blocking으로 본다.

## Legacy Policy

`archive/product-weaver/principles.md`, `archive/product-weaver/asset-map.md`, `archive/prototypes/*/cycle-record.md`는 과거 프로토타입 운영의 배경 자료다. `product-spiral-orchestrator`, `refinement-loop`, `intent-lock` 스킬은 활성 skill suite에서 제거했다. 새 작업의 1차 기준으로 사용하지 않는다. 새 작업은 Mission Control과 Story Chain을 따른다.
