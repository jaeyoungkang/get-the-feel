---
curated: true
intentAbsorbedIntoAcceptance: false
intentJudgmentRefs: []
verdict: met
evidence:
  kind: rendered-dom
  ref: app/page.tsx + public/legacy/c4-3/index.html
gateNotes: Initial Story Chain backfill from product/contract.md and c4-3 representative build.
---

# Current Build Evidence Ledger

## Source Promises

- promise:sense-training-surface
- promise:constrained-production
- promise:weakness-guided-focus

## Applied Aspects

- aspect:content-provenance
- aspect:recognition-production-separation

## Intent Checks

- intent-check:sense-training-surface
  - source promise: promise:sense-training-surface
  - evidence: rendered-dom: `app/page.tsx`, runtime-output: `npm run verdict`
- intent-check:constrained-production
  - source promise: promise:constrained-production
  - evidence: rendered-dom: `public/legacy/c4-3/app.js`
- intent-check:weakness-guided-focus
  - source promise: promise:weakness-guided-focus
  - evidence: rendered-dom: `public/legacy/c4-3/app.js`

## Acceptance Checks

> check:evidence-coverage
> | promise | check | evidence | scope | run | scenarios |
> | --- | --- | --- | --- | --- | --- |
> | promise:sense-training-surface | acceptance-check:sense-training-surface-current-build | runtime-output: `npm run verdict`; rendered-dom: `app/page.tsx` | Product shell + representative trainer | `npm run quality:check` | scenario:first-training-session |
> | promise:constrained-production | acceptance-check:production-mode-present | rendered-dom: `public/legacy/c4-3/app.js`; record: `candidates/c4-3/cycle-record.md` | Representative trainer | `npm run quality:check` | scenario:first-training-session |
> | promise:weakness-guided-focus | acceptance-check:focus-and-stats-present | rendered-dom: `public/legacy/c4-3/app.js`; record: `candidates/c4-3/cycle-record.md` | Representative trainer | `npm run quality:check` | scenario:first-training-session |

## Executable Evidence

```run:shell
$ npm run quality:check -- --trace docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md src/content/corpus-summary.ts app/page.tsx
```

## Sufficiency Review

### 2026-06-14 - intent-check:sense-training-surface

- Input: c4-3 representative build served through the Next app shell.
- Evidence: rendered-dom: `app/page.tsx`; runtime-output: `npm run verdict`.
- Gaps observed:
  - Adopt-resolved - c4-3 remains the legacy trainer while typed React migration starts.
  - Reject - demand validation is not claimed by this local evidence.
- Verdict: met

### 2026-06-14 - intent-check:constrained-production

- Input: c4-3 representative build with c4-2 constrained output mode.
- Evidence: rendered-dom: `public/legacy/c4-3/app.js`; runtime-output: `npm run verdict`.
- Gaps observed:
  - Adopt-resolved - writing output is available and separated from recognition statistics.
  - Reject - speaking improvement is outside this promise.
- Verdict: met

### 2026-06-14 - intent-check:weakness-guided-focus

- Input: c4-3 representative build with c4-1 focus and statistics flow.
- Evidence: rendered-dom: `public/legacy/c4-3/app.js`; runtime-output: `npm run verdict`.
- Gaps observed:
  - Adopt-resolved - sense-level statistics and focused practice entry points exist.
  - Reject - revisit demand remains a demand-1 question.
- Verdict: met

### 2026-06-14 - aspect:content-provenance

- polId: aspect:content-provenance
- Input: c4-3 content corpus and verdict output.
- Evidence: runtime-output: `npm run verdict`.
- Gaps observed:
  - Adopt-resolved - source fields and validation states are mechanically checked.
  - Reject - weak-to-strong promotion is outside this engineering migration.
- Verdict: met

### 2026-06-14 - aspect:recognition-production-separation

- polId: aspect:recognition-production-separation
- Input: c4-3 output and statistics surfaces.
- Evidence: rendered-dom: `public/legacy/c4-3/app.js`; runtime-output: `npm run verdict`.
- Gaps observed:
  - Adopt-resolved - recognition and production are documented as separate evidence.
  - Reject - automatic scoring of free writing remains out of scope.
- Verdict: met
