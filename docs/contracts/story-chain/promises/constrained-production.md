---
id: promise:constrained-production
legacyIds:
  - V3
title: Constrained Production
experience: experience:native-sense-training
moment: moment:first-training-session
lane: product
status: active
aspects:
  - aspect:recognition-production-separation
intentChecks:
  - intent-check:constrained-production
acceptanceChecks:
  - acceptance-check:production-mode-present
coveringLedgers:
  - docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md
verdict: met
evidence:
  kind: rendered-dom
  ref: public/legacy/c4-3/app.js
gateNotes: Production remains constrained writing, not speaking.
---

# Constrained Production

## 1. Promise

As a learner who has recognized a sense,

I want to type, reorder, or rewrite a constrained sentence with the same target sense,

So that I can practice pulling the sense out without claiming that speaking fluency has been proven.

## 2. Intent Check

### intent-check:constrained-production

- question: Does the product provide an output practice path while keeping recognition and production evidence separate?
- evidence: rendered-dom: c4-3 includes write mode and separate output statistics inherited from c4-2.
- why live judge: Free writing quality cannot be fully checked by static code; the product must label self-graded output as weak evidence.
- linked acceptance checks:
  - acceptance-check:production-mode-present
- answer criteria: A single multiple-choice flow, or merged recognition/output statistics, fails.

## 3. Acceptance Check

### acceptance-check:production-mode-present

- description: The representative c4-3 app includes constrained output modes and does not merge self-graded output with recognition statistics.
- evidence: `npm run verdict` plus c4-3 cycle record for V3 output verification.

## 4. Evidence

```yaml
evidence:
  kind: rendered-dom
  ref: public/legacy/c4-3/app.js
```
