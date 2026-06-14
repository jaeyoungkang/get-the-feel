---
id: promise:sentence-explanation-to-practice
legacyIds: []
title: Sentence Explanation To Practice
experience: experience:native-sense-training
moment: moment:first-training-session
lane: product
status: active
aspects:
  - aspect:content-provenance
intentChecks:
  - intent-check:sentence-explanation-to-practice
acceptanceChecks:
  - acceptance-check:sentence-explanation-route
coveringLedgers:
  - docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md
verdict: met
evidence:
  kind: rendered-dom
  ref: app/explain/page.tsx + app/explain/sentence-explainer.tsx
gateNotes: Rule-based MVP grounded in current corpus senses; it does not claim open-ended grammar correction.
---

# Sentence Explanation To Practice

## 1. Promise

As a Korean English learner,

I want to paste an English sentence and see which native-layer sense is active,

So that I can move from explanation into practice on the same sense instead of treating the explanation as a one-off answer.

## 2. Intent Check

### intent-check:sentence-explanation-to-practice

- question: Does the product turn a user-provided English sentence into a grounded sense explanation and a practice path, without pretending to explain unsupported English generally?
- evidence: rendered-dom: `app/explain/page.tsx`; code-trace: `src/content/explanation-index.ts`, `app/explain/sentence-explainer.tsx`.
- why live judge: A deterministic route can exist while still overclaiming; the live judgment is whether the explanation is visibly bounded to the approved corpus.
- linked acceptance checks:
  - acceptance-check:sentence-explanation-route
- answer criteria: A generic chatbot-like answer, a freeform grammar correction, or an explanation with no follow-up practice fails.

## 3. Acceptance Check

### acceptance-check:sentence-explanation-route

- description: The `/explain` route accepts a sentence, detects supported target words from the current corpus, shows the matched sense explanation, and renders quiz choices from that sense's training or transfer items.
- evidence: `npm run build`, `npm run quality:check`

## 4. Evidence

```yaml
evidence:
  kind: rendered-dom
  ref: app/explain/page.tsx
```
