---
id: promise:weakness-guided-focus
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
coveringLedgers:
  - docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md
verdict: met
evidence:
  kind: rendered-dom
  ref: public/legacy/c4-3/app.js
gateNotes: Local statistics are personal learning records, not learning-effect proof.
---

# Weakness-Guided Focus

## 1. Promise

As a returning learner,

I want to see which senses are weak and start a focused session from that signal,

So that the next session is guided by my own errors rather than by a generic lesson order.

## 2. Intent Check

### intent-check:weakness-guided-focus

- question: Does the product provide a path from sense-level progress to focused practice?
- evidence: rendered-dom: c4-3 carries c4-1 focus mode and sense-level statistics.
- why live judge: Whether this creates actual revisit demand requires demand-1; the local check only proves the surface exists.
- linked acceptance checks:
  - acceptance-check:focus-and-stats-present
- answer criteria: A score-only summary with no sense-specific next action fails.

## 3. Acceptance Check

### acceptance-check:focus-and-stats-present

- description: The representative c4-3 app includes sense-level stats and focused practice entry points.
- evidence: `npm run verdict` plus c4-3 cycle record for V4 verification.

## 4. Evidence

```yaml
evidence:
  kind: rendered-dom
  ref: public/legacy/c4-3/app.js
```
