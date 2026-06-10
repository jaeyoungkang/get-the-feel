# get-the-feel — Agent Guide

**한국인 영어 학습자가 영어의 게르만 토박이 층위 감각(have/get/be, up/out/off, 구동사, 어순)을 문장·퀴즈로 체화하는 트레이닝 웹 앱.**

product-weaver의 fork-style 도메인 인스턴스. 베이스 파일(`docs/principles.md`, `shared-skills/`, `CLAUDE.md`)은 **수정 금지** — 베이스 갱신은 product-weaver 저장소에서 별 사이클로 처리하고 여기서는 fetch + merge (Ask first).

## Read Order

1. `product/contract.md` — 제품 계약 정본 (잠긴 의도 + Spiral 도달 기준 + 미승인·빈틈)
2. `product/asset-map.md` — 자산 지도 (5 trunk + 명시 거부)
3. `fix_plan.md` — 작업 큐 + 사후 승인 큐
4. `docs/principles.md` + `shared-skills/` — 베이스 정본. 핵심 행동은 스킬 경유 + Skill Load Receipt 필수.

## Harness Case

| 항목 | 선택 |
|---|---|
| Intent Lock | `product/contract.md` — 인터뷰 기반 잠금, 미승인은 별도 섹션 + `fix_plan.md` 사후 승인 큐 |
| Gap Ledger | `candidates/<id>/cycle-record.md` (후보별, append-only — 판정을 덮어쓰지 않는다) + git commit log |
| Mechanical Verdict | `tools/verdict/` 스크립트 (c1-1에서 생성) — 콘텐츠 계약 검사(출처 필수), 훈련/전이 분리 검사, 빌드/스모크, 산출물 diff. unknown/not-met은 승격 차단 |
| 모니터 | Intent Guardian / Asset Steward / Data·Sellability — 후보 종료마다 출력, `repair-before-next`면 다음 후보 전에 자산·게이트 수리 |
| 의도적 거부 | 게이미피케이션 중심 / 범용 영어 학습 앱 확장 / 엔지니어링 제약 front-load / 선제 도메인 스킬 신설 (`product/asset-map.md` 거부 섹션) |

## Spiral 운영

- Session **C1 = Discovery**. 후보 상한 `n_of_N` **N=5**, 도달 실패 시 `cap_reached_disposition` 분류 후 종료 (`product/contract.md` 상한 섹션).
- 후보 폴더: `candidates/c1-<n>/` — **독립 실행 가능한 완제품** (entry, 스타일, 데이터, 검증 결과). 이전 후보 파일 직접 패치 금지 — fresh start.
- 후보 시작 전: `shared-skills/product-spiral-orchestrator/SKILL.md` receipt + 사이클 의도 잠금(축 선택, 제품 계약 발전 한 줄, 전달 가치 탐색 한 줄, 자산 기여 WHO·WHY).
- 후보 종료 시: 배움을 `product/`·`assets/`·`tools/`로 회수. 평가 질문: **"다음 후보의 약속 전달력을 올리는가"** — 더 빨리가 아니라 더 효과적으로. transcript·cycle record에만 남으면 미회수.

## Boundaries (Refuse First)

- **Never**
  - 베이스 파일(`docs/principles.md`, `shared-skills/`, `CLAUDE.md`) 수정
  - 이전 후보를 조금 고쳐 새 사이클이라 부르기
  - 출처 없는 감각 설명을 콘텐츠로 승격
  - 훈련 문장과 전이 문장의 중복
  - 게이미피케이션 중심·범용 영어 학습 방향의 확장
- **Ask first**
  - 4축 경계·Primary Promise 변경
  - Spiral 도달 기준(승격 5기준, N=5) 변경
  - 배포·과금·타인 사용자 노출
- **Always**
  - 핵심 행동은 스킬 경유 + Skill Load Receipt
  - 한 turn = 한 항목 = 한 commit (`fix_plan.md`)
  - 후보마다 `cycle-record.md`에 stop permission 필드 기록
  - 사후 승인 큐 항목은 trigger 시점에 사용자에게 승인 요청

## Inheritance

베이스(product-weaver) 정본을 단방향 참조한다. 인스턴스 → 베이스 방향만. 도메인 산출물을 베이스로 끌어올리지 않는다.
