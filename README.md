# product-weaver

**LLM 에이전트로 AI 제품을 만들 때 의도가 코드까지 왜곡 없이 도달하도록 강제하는 최소 골격.**

도메인 베이스들이 위에서 자라는 **베이스의 베이스**.

4원리 + 1개의 메타 프로세스만 들고 있다. 상세는 `docs/principles.md`.

## 진입

- `AGENTS.md` — 에이전트 navigation
- `docs/principles.md` — 4원리 + Refinement Loop 정본 (이게 product-weaver의 전부)
- `shared-skills/` — 핵심 행동의 스킬 정본 (`intent-lock`, `refinement-loop`)
- `fix_plan.md` — 작업 큐

## 관련

- [agentic-base](https://github.com/jaeyoungkang/agentic-base) — 같은 정신을 공유하는 더 무거운 베이스. Story Chain·정합성 CLI·여러 스킬 등 도구를 더 들고 있다. product-weaver의 가벼움이 부족할 때 옵션.
- `docs/domain-layer-activation-guide.md` — 도메인 베이스가 자기 Harness Case를 남길 때 참고하는 짧은 선택 가이드.

## 상태

2026-05-26: 초안 작성 — codex exec 1·2·3·4차 리뷰 반영 + 자기 점검 비대 회수.
