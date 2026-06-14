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
  ref: public/legacy/c4-3/app.js
gateNotes: Self-graded writing remains weak evidence.
---

# Recognition Production Separation

## 1. Why

Recognition scores and output scores answer different learning questions. Merging them would make the product claim more learning evidence than it has.

## 2. Pointcut

- applies to:
  - promise:constrained-production
  - promise:weakness-guided-focus
- excludes:
  - static content source review

## 3. Advice

- Recognition statistics and production statistics use separate labels and storage.
- Self-graded writing stays marked as weak evidence.
- The product does not claim speaking improvement from writing tasks.

## 4. Verification

- coverage: c4-3 inherits the c4-2 output separation and V3 weak-evidence labeling.
- wovenness: This aspect is cited by output and progress promises and by `current-build.ledger.md`.
- verdict: `met` for the current representative build.
