---
id: aspect:recognition-production-separation
legacyIds: []
applies-to:
  - promise:constrained-production
  - promise:weakness-guided-focus
covering-ledger: docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md
verdict: met
evidence:
  kind: rendered-dom
  ref: app/trainer.tsx
gateNotes: Self-graded writing remains weak evidence; speaking improvement is not claimed.
---

# Recognition Production Separation

## 1. Why

인식 문제를 맞히는 것과 직접 써보는 것은 다른 학습 신호다. 둘을 한
통계로 합치면 제품은 사용자가 실제로 얻은 evidence보다 강한 학습 효과를
말하게 된다.

이 Aspect는 통계와 산출 표면에 걸린다. 사용자는 자신이 감각을 알아보는
능력과 꺼내 쓰는 능력을 따로 봐야 한다. 특히 전문 쓰기처럼 사용자가
스스로 채점하는 과제는 약한 evidence로 남아야 한다.

## 2. Pointcut

- applies to:
  - promise:constrained-production
  - promise:weakness-guided-focus
- excludes:
  - source review and corpus provenance checks
  - sentence explanation before the user starts a practice item

## 3. Advice

- Recognition statistics and production statistics use separate labels and storage.
- Self-graded writing stays marked as weak evidence.
- Product copy does not claim speaking improvement from writing tasks.
- Demand or learning-effect claims require demand/effect evidence outside this local statistic surface.

## 4. Verification

- coverage: `app/trainer.tsx` keeps recognition and production statistics in separate state and labels self-check production as weak evidence.
- coverage: `product/demand-validation.md` and `product/contract.md` keep local stats below demand/effect claims.
- wovenness: This aspect is cited by output and progress promises and by `current-build.ledger.md`.
- verdict: `met` for the current build.
