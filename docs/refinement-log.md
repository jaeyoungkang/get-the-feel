# Refinement Log

product-weaver 자체 운영의 Refinement Loop 입력·출력 ledger. Append-only.

형식: 날짜 / Trigger / Input / Identified Pattern / Self-gate / Output / Applied to.

---

## 2026-05-26 — 초안 스킬 운영 시뮬레이션

- **Trigger**: 초안 첫 commit (474d871) 직후, 두 스킬(`intent-lock`, `refinement-loop`)을 실제 호출 시뮬레이션해 베이스가 작동하는지 검증.
- **Input** (외부 검증 결과 + 시뮬레이션 진단)
  - `refinement-loop` 첫 호출 시 Preflight 자기 적용이 ledger 부재로 차단됨 → 베이스가 자기 정신에 충실히 작동 확인
  - `intent-lock` 가상 의도 진입 시 Refuse First 모드가 인터뷰 직행을 차단 → 진입 게이트 작동 확인
  - 빈자리 3개 식별:
    1. 첫 회고 trigger 시점 명시 안 됨
    2. product-weaver 자체 운영 ledger 위치 명시 안 됨
    3. 외부 검증(codex exec 리뷰 등) 결과의 입력 회수 경로 명시 안 됨
- **Identified Pattern**: 기존 4원리·메타 프로세스로 모두 표현 가능 (Refinement Loop 인스턴스화 가이드의 빈자리). 새 원리 후보 아님.
- **Self-gate**: N/A — 새 원리·도구·스킬 추가 아닌 인스턴스화 가이드 보강. 셀프 게이트 적용 대상 아님.
- **Output**: Refinement Loop 인스턴스화 가이드 3건 보강.
  - "첫 회고 trigger" 항목 → `shared-skills/refinement-loop/SKILL.md` When To Use
  - "product-weaver 자체 ledger 위치 `docs/refinement-log.md`" → SKILL.md Workflow 1, `AGENTS.md` Always
  - "외부 검증 결과를 입력 5번째 채널로" → SKILL.md Workflow 2
- **Applied to**: `shared-skills/refinement-loop/SKILL.md`, `AGENTS.md`, `docs/refinement-log.md` (이 파일 신설)
