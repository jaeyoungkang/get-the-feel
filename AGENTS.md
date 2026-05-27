# product-weaver — Agent Guide

**LLM 에이전트로 AI 제품을 만들 때 의도가 코드까지 왜곡 없이 도달하도록 강제하는 최소 골격.**

도메인 베이스들이 위에서 자라는 **베이스의 베이스**. 4원리 + 1개의 메타 프로세스만 들고 있다.

이 파일은 세션 진입용 navigation이다. 본질은 `docs/principles.md` 가 정본.

## Read Order

1. `docs/principles.md` — **4원리 + Refinement Loop 정본** (이게 product-weaver의 전부)
2. `shared-skills/` — 핵심 행동의 스킬 정본 (`intent-lock`, `refinement-loop`)

## 핵심 행동은 스킬을 통해

product-weaver의 핵심 행동(새 의도 잠금, 다듬기 루프 운영)은 반드시 `shared-skills/<skill>/SKILL.md` 절차를 통해 수행한다. 스킬 호출 없이 자유 형식으로 4원리를 적용하면 절차가 누락된다.

- 새 의도가 들어왔다 → `shared-skills/intent-lock/SKILL.md`
- 회고·셀프 게이트·인스턴스화 가이드 갱신 → `shared-skills/refinement-loop/SKILL.md`

Refuse First는 별도 스킬이 아니라 두 스킬의 절차 안에 모드로 흐른다. AGENTS.md Boundaries 와 합쳐서 베이스 전체의 호흡이다.

## 도메인 인스턴스 시작 형태

새 도메인 파일럿이 product-weaver 위에서 출발할 때는 자기 베이스 참조(`AGENTS.md`), 의도 잠금 산출물, 작업 큐, sample artifact를 자기 형식으로 만든다. 파일명·구조는 도메인이 결정한다. 사전에 빈 파일을 두지 않는다 (Preflight Gate 정신).

베이스(product-weaver)는 도메인 인스턴스에 의해 **참조**된다. 상속이 아니다. 참조는 **단방향** — 인스턴스 → 베이스. 베이스는 인스턴스 본문을 참조하지 않는다 (Refuse First). git submodule, symbolic link, 코드 import는 쓰지 않는다 — 추상이 인스턴스에 묶이면 비대해진다.

## 세션 진입 절차 (baseline-only로 진입한 에이전트)

전 세션 history 없이 product-weaver만 들고 진입한 에이전트는 다음 순서로 시작한다:

1. **베이스 정독** — 본 AGENTS.md → `docs/principles.md` → `shared-skills/intent-lock/SKILL.md` → `shared-skills/refinement-loop/SKILL.md`. 베이스 자체가 *모든 절차의 SSOT*.
2. **모드 식별** — 사용자 발화가 있나? 위임 발화인가 자율 trigger인가? `intent-lock` SKILL Workflow 3 "위임 모드 / 자율 모드" 참조.
3. **도메인 컨셉 입력** — 사용자가 도메인 이름·컨셉을 한 줄이라도 줬는가? 안 줬으면 *그 한 줄부터 합의*. 자율 모드면 메인이 1차 draft + 서브 비판.
4. **제품 계약 1차 잠금** — `intent-lock` SKILL Workflow 3 "제품 계약 발전"이 *모든 자산보다 먼저*. 약속 한 줄 + 검증 trigger 박을 때까지 cycle 1 진입 금지.
5. **자산 체계 발견** — Workflow 3 "자산 기여" 질문 4개에 답. 다른 도메인 카테고리 모방 금지. *제품 계약 자산*만 필수, 나머지는 빈자리 발견 시 추가.
6. **Spiral Loop 운영 파라미터** — 사다리·상한·검증 신호·learning 회수처. 도메인 결정, 자율 모드면 메인-서브 합의.
7. **cycle 1 진입** — 의도 잠금 → 결과물 → 자가 점검 3종(거부 신호·Forward Momentum·자산 기여·계약 발전) → 서브에이전트 검증 → commit.

## Boundaries (Refuse First)

- **Never**
  - 4원리를 깎거나 풀어 쓰지 않는다. 4원리는 공리.
  - Refinement Loop 없이 4원리를 추가·변경하지 않는다.
  - 도메인 인스턴스를 베이스에 끌어올리지 않는다. **베이스는 추상만, 인스턴스는 도메인.**
  - 비대화 방지 셀프 게이트(`docs/principles.md` 참조) 통과 없이 새 원리·도구·문서·스킬을 추가하지 않는다.
  - 합의 없이 `docs/principles.md` 본문 수정.
- **Ask first**
  - 새 원리 신설 또는 4원리 본문 갱신
  - 새 메타 프로세스 추가
  - Refinement Loop 주기·입력·출력 명세 변경
- **Always**
  - 변경 검토는 `docs/principles.md` 의 비대화 방지 셀프 게이트를 따른다
  - 핵심 행동은 `shared-skills/<skill>/SKILL.md` 를 통해 수행한다
  - 운영 발견 사항은 *SKILL/원리 변경 자체*로 회수한다(commit log가 변경 사유를 잡는다). 별도 누적 텍스트 ledger를 베이스에 두지 않는다 — clone 받는 사용자에게 운영 흔적은 *역사*일 뿐이다.

## Inheritance

이 저장소는 **독립**이다. 외부 AGENTS.md를 상속하지 않는다.

이유: product-weaver는 다른 베이스들의 **상위 추상**이므로 상속이 거꾸로 가면 추상이 도메인에 오염된다.

## Validation

product-weaver 자체는 **정본 문서 집합**이고 실행 코드를 들고 있지 않다. 검증은 사람 리뷰 + codex exec 리뷰로 한다. **기계 검증 CLI는 의도적으로 두지 않는다** — 베이스에 CLI가 늘어나는 순간 비대화가 시작된다.
