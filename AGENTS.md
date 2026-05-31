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

**기본 권고: fork-style `git clone`.** product-weaver를 통째로 새 도메인 폴더로 clone하고, 그 위에서 도메인 측 파일(`AGENTS.md`, `README.md`, `fix_plan.md`, 제품 계약 자산 등)을 *갈아엎거나 추가*한다. 베이스 파일(`docs/principles.md`, `shared-skills/`, `CLAUDE.md`)은 *수정 금지* — 베이스 갱신이 필요하면 product-weaver 저장소에서 별 사이클로 처리하고 도메인 측은 fetch + merge (Ask first).

```bash
git clone <product-weaver-url> ~/youngcompany/<도메인>
cd ~/youngcompany/<도메인>
# 이후 도메인 측 파일 갈아엎기 + 새 자산 폴더 신설
```

**대안 (가벼운 도메인): 참조 방식.** 새 폴더에 자체 `AGENTS.md` 두고 product-weaver를 *상대 경로*로 단방향 참조 (예: `../product-weaver/docs/principles.md`). 베이스 사본 없음. 무게가 더 가볍지만 *베이스 절차가 다른 폴더에 살아있다*는 가정 필요.

두 방식 모두에서:
- 참조는 **단방향** — 인스턴스 → 베이스. 베이스는 인스턴스 본문을 참조하지 않는다 (Refuse First).
- git submodule, symbolic link, 코드 import는 쓰지 않는다 — 추상이 인스턴스에 *살아있는 연결*로 묶이면 비대해진다. fork-style clone은 *시작점 복제*라 살아있는 연결 아님 — 허용.
- 도메인 폴더는 자기 git history로 진화. baseline 갱신과 도메인 작업의 lineage 분리.
- 사전에 빈 파일을 두지 않는다 (Preflight Gate 정신).
- 도메인은 필요하면 자기 **Harness Case**를 남긴다. 어떤 산출물·ledger·gate를 켰고 무엇을 의도적으로 거부했는지 적는 도메인별 선택 기록이다. 상세 판단은 `docs/domain-layer-activation-guide.md`를 참고한다.


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
