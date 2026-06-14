---
id: promise:weakness-guided-focus
slug: weakness-guided-focus
legacyIds:
  - V4
title: Weakness-Guided Focus
experience: experience:native-sense-training
moment: moment:first-training-session
lane: product
status: active
aspects:
  - aspect:recognition-production-separation
intentChecks:
  - intent-check:weakness-guided-focus
acceptanceChecks:
  - acceptance-check:focus-and-stats-present
  - acceptance-check:stats-do-not-claim-demand
coveringLedgers:
  - docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md
verdict: met
evidence:
  kind: rendered-dom
  ref: app/trainer.tsx
gateNotes: Local statistics are personal learning records, not learning-effect or demand proof.
---

# Weakness-Guided Focus

## Promise

제품은 사용자가 세션 뒤 자신의 약한 감각을 보고, 그 감각만 다시 연습할
수 있게 한다. 사용자는 정해진 lesson order를 그대로 따라가는 대신, 자신의
오답과 낮은 감각별 기록을 다음 세션의 출발점으로 삼는다.

이 약속은 통계가 학습 효과를 증명한다는 뜻이 아니다. 현재 기록은 로컬
학습 기록이며, 저자 본인의 사용 기록은 특히 약한 evidence다. 제품은
약점 신호와 집중 연습 경로를 제공하지만, 수요나 장기 학습 효과는 별도
검증 없이는 주장하지 않는다.

## Intent Checks

### intent-check:weakness-guided-focus

- question: 사용자가 세션 결과에서 sense-level 약점을 보고 같은 감각의 집중 연습으로 이동할 수 있는가?
- evidence: rendered-dom: `app/trainer.tsx`; runtime-output: `npm run build`.
- why live judge: 통계 표면이 있어도 사용자가 다음 행동을 찾지 못하면 약점 기반 학습 경로로 작동하지 않는다. 실제 재방문 동기는 demand-1에서 별도로 본다.
- linked acceptance checks:
  - acceptance-check:focus-and-stats-present
  - acceptance-check:stats-do-not-claim-demand
- answer criteria: score-only summary with no sense-specific next action fails. Any copy that treats local stats as demand or learning-effect proof fails.

## Acceptance Checks

### acceptance-check:focus-and-stats-present

- description: The native trainer includes sense-level stats and focused practice entry points.
- evidence: rendered-dom: `app/trainer.tsx`; runtime-output: `npm run build`.
- run: `npm run build`

### acceptance-check:stats-do-not-claim-demand

- description: Product and validation docs keep local stats as weak learning evidence and do not claim demand, speaking improvement, or measured learning effect from them.
- evidence: docs: `product/demand-validation.md`, `product/contract.md`; aspect: `aspect:recognition-production-separation`.
- run: `npm run quality:contracts`

## Evidence

```yaml
evidence:
  kind: rendered-dom
  ref: app/trainer.tsx
```
