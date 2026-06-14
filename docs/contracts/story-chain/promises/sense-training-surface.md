---
id: promise:sense-training-surface
legacyIds:
  - V1
title: Sense Training Surface
experience: experience:native-sense-training
moment: moment:first-training-session
lane: product
status: active
aspects:
  - aspect:content-provenance
intentChecks:
  - intent-check:sense-training-surface
acceptanceChecks:
  - acceptance-check:sense-training-surface-current-build
coveringLedgers:
  - docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md
verdict: met
evidence:
  kind: rendered-dom
  ref: app/page.tsx + public/legacy/c4-3/index.html
gateNotes: c4-3 representative build is served through the Next app shell while migration proceeds.
---

# Sense Training Surface

## 1. Promise

As a Korean English learner,

I want to solve sentence-level questions that ask what a basic English word is doing in context,

So that I can recognize the native-layer sense instead of translating the word one Korean gloss at a time.

## 2. Intent Check

### intent-check:sense-training-surface

- question: Does the first product surface expose an actual sentence training session for native-layer senses rather than a marketing page or generic vocabulary quiz?
- evidence: rendered-dom: `app/page.tsx` embeds `/legacy/c4-3/index.html`, and the representative candidate verdict checks question cue integrity.
- why live judge: A user can still experience the surface as a generic quiz even if files exist; demand-1 remains the external check.
- linked acceptance checks:
  - acceptance-check:sense-training-surface-current-build
- answer criteria: A shallow page that only describes the method, or a quiz where answer cues are visible before answering, fails.

## 3. Acceptance Check

### acceptance-check:sense-training-surface-current-build

- description: The current product route serves the c4-3 representative trainer and the c4-3 verdict passes content, cue, shuffle, label, sentence_ko, and smoke gates.
- evidence: `npm run verdict`, `npm run build`

## 4. Evidence

```yaml
evidence:
  kind: rendered-dom
  ref: app/page.tsx
```
