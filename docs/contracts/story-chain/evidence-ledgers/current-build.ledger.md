---
curated: true
intentAbsorbedIntoAcceptance: false
intentJudgmentRefs: []
verdict: met
evidence:
  kind: runtime-output
  ref: npm run quality:check
gateNotes: Current build ledger for the existing trainer design baseline and sentence explanation MVP.
---

# Current Build — Evidence Ledger

This ledger owns the current user-facing get-the-feel product build. It closes
the promises that are already implemented in the local product surface.

## Source Promises

- promise:sense-training-surface
- promise:sentence-explanation-to-practice
- promise:constrained-production
- promise:weakness-guided-focus

## Applied Aspects

- aspect:content-provenance
- aspect:recognition-production-separation
- aspect:design-baseline-preservation

## Intent Checks

- intent-check:sense-training-surface
  - source promise: promise:sense-training-surface
  - evidence: code-trace: `app/page.tsx`, `app/home-trainer-frame.tsx`, `public/legacy/c4-3/index.html`; runtime-output: `npm run pages:check`
- intent-check:sentence-explanation-to-practice
  - source promise: promise:sentence-explanation-to-practice
  - evidence: code-trace: `app/explain/page.tsx`, `app/explain/sentence-explainer.tsx`, `src/content/explanation-index.ts`; runtime-output: `npm run ui:check`
- intent-check:constrained-production
  - source promise: promise:constrained-production
  - evidence: code-trace: `public/legacy/c4-3/app.js`; runtime-output: `npm run legacy:check`
- intent-check:weakness-guided-focus
  - source promise: promise:weakness-guided-focus
  - evidence: code-trace: `public/legacy/c4-3/app.js`; runtime-output: `npm run legacy:check`

## Acceptance Checks

> check:evidence-coverage
> | promise | check | evidence | scope | run | scenarios |
> | --- | --- | --- | --- | --- | --- |
> | promise:sense-training-surface | acceptance-check:sense-training-surface-current-build | code-trace: `app/page.tsx`, `app/home-trainer-frame.tsx`, `public/legacy/c4-3/index.html`; runtime-output: `npm run pages:check` | Product shell + current trainer design baseline + GitHub Pages path | `npm run pages:check` | scenario:first-training-session |
> | promise:sense-training-surface | acceptance-check:sense-training-cue-discipline | code-trace: `public/legacy/c4-3/app.js` hides answer cues until feedback state; runtime-output: `npm run legacy:check` checks cue-gating structure | Current trainer design baseline | `npm run legacy:check` | scenario:first-training-session |
> | promise:sense-training-surface | acceptance-check:sense-training-corpus-contract | runtime-output: `scripts/content/check.mjs` validates source-backed senses, labels, minimum counts, training/transfer separation, legacy data equivalence, choices, and duplicates | Content corpus | `npm run content:check` | scenario:first-training-session |
> | promise:sentence-explanation-to-practice | acceptance-check:sentence-explanation-route | code-trace: `app/explain/page.tsx`; runtime-output: `npm run build` | Product shell + explanation workspace | `npm run build` | scenario:sentence-to-practice |
> | promise:sentence-explanation-to-practice | acceptance-check:sentence-explanation-supported-scope | code-trace: `src/content/explanation-index.ts`, `app/explain/sentence-explainer.tsx`; runtime-output: `npm run typecheck` | Explanation matcher | `npm run typecheck` | scenario:sentence-to-practice |
> | promise:sentence-explanation-to-practice | acceptance-check:sentence-explanation-practice-link | code-trace: `practiceForSense` in `src/content/explanation-index.ts`, shuffled feedback flow in `app/explain/sentence-explainer.tsx`; runtime-output: `npm run ui:check` | Explanation-to-practice bridge | `npm run ui:check` | scenario:sentence-to-practice |
> | promise:constrained-production | acceptance-check:production-mode-present | code-trace: `public/legacy/c4-3/app.js`; runtime-output: `npm run legacy:check` checks production-mode anchors | Current trainer output mode | `npm run legacy:check` | scenario:first-training-session |
> | promise:constrained-production | acceptance-check:production-evidence-separated | code-trace: `public/legacy/c4-3/app.js`; aspect: `aspect:recognition-production-separation`; runtime-output: `npm run legacy:check` checks separate storage/copy anchors | Output statistics and labels | `npm run legacy:check` | scenario:first-training-session |
> | promise:weakness-guided-focus | acceptance-check:focus-and-stats-present | code-trace: `public/legacy/c4-3/app.js`; runtime-output: `npm run legacy:check` checks progress/focus anchors | Current trainer progress surface | `npm run legacy:check` | scenario:first-training-session |
> | promise:weakness-guided-focus | acceptance-check:stats-do-not-claim-demand | docs: `product/demand-validation.md`, `product/contract.md`; aspect: `aspect:recognition-production-separation` | Product claims and validation docs | `npm run quality:contracts` | scenario:first-training-session |

## Implementation Contracts

- The product shell route `/` wraps the current trainer design baseline under `aspect:design-baseline-preservation`. The source of truth for product work is `app/`, `src/`, `assets/content/`, and `docs/design-assets.md`.
- The sentence explanation route is intentionally corpus-bound. It may detect target words and rank likely senses, but it cannot invent unsupported grammar correction or vocabulary explanation.
- Recognition and production evidence remain separate until a stronger measurement design exists.
- Content provenance applies to both generated training content and user-entered sentence explanation.

## Executable Checks

```run:shell
# Full product, content, Story Chain, and contract gates.
npm run quality:check
```

```run:shell
# GitHub Pages export path check for the live project URL.
npm run pages:check
```

```run:shell
# Protected trainer baseline syntax check.
npm run legacy:check
```

```run:shell
# /explain practice and design-baseline source guard.
npm run ui:check
```

```run:shell
# Active corpus contract check.
npm run content:check
```

```run:shell
# Contract-only verification after documentation or Story Chain changes.
npm run quality:contracts
```

## Traceability

- Source Promises: `promise:sense-training-surface`, `promise:sentence-explanation-to-practice`, `promise:constrained-production`, `promise:weakness-guided-focus`
- Applied Aspects: `aspect:content-provenance`, `aspect:recognition-production-separation`, `aspect:design-baseline-preservation`
- Scenarios: `scenario:first-training-session`, `scenario:sentence-to-practice`
- Review log: [`reviews/current-build.reviews.md`](./reviews/current-build.reviews.md)

## Coverage By Promise

- `promise:sense-training-surface#acceptance-check:sense-training-surface-current-build`: `app/page.tsx` exposes the product shell, `app/home-trainer-frame.tsx` provides base-path-aware iframe and scroll/height bridge, and `npm run pages:check` verifies `/get-the-feel` export paths.
- `promise:sense-training-surface#acceptance-check:sense-training-cue-discipline`: `public/legacy/c4-3/app.js` keeps feedback, Korean sentence text, and sense explanation behind answer state; `scripts/legacy/check-baseline.mjs` fails if the question renderer leaks those cues.
- `promise:sense-training-surface#acceptance-check:sense-training-corpus-contract`: `scripts/content/check.mjs` checks corpus counts, source references, training/transfer separation, no duplicate normalized sentences, choices, explicit labels, and `public/legacy/c4-3/data.js` equivalence with `assets/content/*.json`.
- `promise:sentence-explanation-to-practice#acceptance-check:sentence-explanation-route`: `app/explain/page.tsx` renders the explanation workspace and seed example.
- `promise:sentence-explanation-to-practice#acceptance-check:sentence-explanation-supported-scope`: `src/content/explanation-index.ts` builds matches from `CURRENT_CONTENT`; unsupported input falls to an explicit empty state.
- `promise:sentence-explanation-to-practice#acceptance-check:sentence-explanation-practice-link`: `practiceForSense` returns same-`sense_id` items without repeating an exact source item, preserves `verb_label`, and `SentenceExplainer` shuffles displayed choices while keeping Korean translation inside answer feedback.
- `promise:constrained-production#acceptance-check:production-mode-present`: `public/legacy/c4-3/app.js` provides production self-check against model sentences; `scripts/legacy/check-baseline.mjs` checks production-mode anchors.
- `promise:constrained-production#acceptance-check:production-evidence-separated`: production records and recognition records stay separate under `aspect:recognition-production-separation`; `scripts/legacy/check-baseline.mjs` checks separate storage/copy anchors.
- `promise:weakness-guided-focus#acceptance-check:focus-and-stats-present`: `public/legacy/c4-3/app.js` provides sense focus selection and separate recognition/production statistics; `scripts/legacy/check-baseline.mjs` checks progress/focus anchors.
- `promise:weakness-guided-focus#acceptance-check:stats-do-not-claim-demand`: product and demand docs keep local stats below demand/effect claims.

## Intent Verification

Inherited Intent Checks:

- `intent-check:sense-training-surface` — first product surface is actual sentence-level native-layer sense training, not a generic vocabulary quiz.
- `intent-check:sentence-explanation-to-practice` — user-provided sentence explanation stays grounded in supported corpus senses and flows into practice.
- `intent-check:constrained-production` — output practice exists without merging recognition and production evidence.
- `intent-check:weakness-guided-focus` — sense-level progress leads to focused practice without claiming demand or learning effect.

## Sufficiency Review

### 2026-06-14 — current build contracts and aspects

Verdict: met

Evidence: runtime-output: `npm run quality:check`, `npm run pages:check`,
`npm run ui:check`, `npm run legacy:check`; code-trace: `app/page.tsx`,
`app/home-trainer-frame.tsx`, `public/legacy/c4-3/index.html`,
`app/explain/page.tsx`; review log
[`reviews/current-build.reviews.md`](./reviews/current-build.reviews.md).

polId: aspect:content-provenance, aspect:recognition-production-separation, aspect:design-baseline-preservation

This ledger is sufficient for the current build because all four active
Promises have check:evidence-coverage rows, executable commands, scenarios, and
code or rendered-surface references. `aspect:content-provenance` is met because
the corpus contract and explanation matcher stay bound to `assets/content/*`
source references and unsupported sentence input is rejected instead of
invented. `aspect:recognition-production-separation` is met because recognition
and production checks remain separate in both product behavior and claim prose.
`aspect:design-baseline-preservation` is met because `/` preserves the existing
trainer design baseline and `/explain` reuses the existing SVG metaphor grammar
rather than replacing it with a new visual system.

See [`reviews/current-build.reviews.md`](./reviews/current-build.reviews.md).
