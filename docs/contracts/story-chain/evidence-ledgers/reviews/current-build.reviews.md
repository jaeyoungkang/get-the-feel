# Current Build — Sufficiency Reviews

This file stores dated Sufficiency Review entries for
[`current-build.ledger.md`](../current-build.ledger.md). The ledger keeps the
executable coverage table; this review log records why the current evidence is
sufficient for the declared product intent.

### Sufficiency Review

#### 2026-06-14 — current Story Chain backfill and sentence explanation MVP

```yaml
date: 2026-06-14
acs:
  - acceptance-check:sense-training-surface-current-build
  - acceptance-check:sense-training-cue-discipline
  - acceptance-check:sense-training-corpus-contract
  - acceptance-check:sentence-explanation-route
  - acceptance-check:sentence-explanation-supported-scope
  - acceptance-check:sentence-explanation-practice-link
  - acceptance-check:production-mode-present
  - acceptance-check:production-evidence-separated
  - acceptance-check:focus-and-stats-present
  - acceptance-check:stats-do-not-claim-demand
acReviewedRevision:
  - 1
  - 1
  - 1
  - 1
  - 1
  - 1
  - 1
  - 1
  - 1
  - 1
fixtureRef: docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md
runCommitSha: worktree-run-2026-06-14-story-chain-hardening
observedOutput: `npm run quality:check` completed the content contract check, TypeScript check, ESLint, Next build including `/` and `/explain`, skill drift check, project knowledge validation, contract map check, Story Chain validation, surface audit, and new-critical check with release verdict ready.
gaps:
  - adopt: The current product shell preserves the existing trainer design baseline while React surfaces reuse its visual grammar.
  - adopt: Sentence explanation is intentionally rule-based and corpus-bound; this prevents unsupported grammar correction claims while still connecting supported senses to practice.
  - reject: Demand validation, long-term learning effect, free writing quality, and speaking improvement are outside this local build verdict.
verdict: met
```

Input: the current Next product surface, existing trainer design baseline evidence, and
`/explain` sentence-to-practice route.

Evidence:

- `npm run quality:check` passed.
- `npm run quality:contracts` passed.
- Server-rendered `/explain` response showed the default sentence input,
  corpus exact `get` match, sense explanation blocks, and `get-arrival`
  practice cards.

Gaps observed:

- Adopt-resolved — Story Chain docs now split the first training session from
  sentence inquiry and route each Promise to the correct Moment.
- Adopt-resolved — Content provenance applies to both training content and
  sentence explanation.
- Reject — user demand remains outside this local evidence and must be
  collected through `demand-1`.

Verdict: met.

Aspect verdict: `aspect:design-baseline-preservation` is met because the current
root trainer uses the existing deployed trainer design baseline and the React
sentence explanation surface reuses the same SVG metaphor grammar.
