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
observedOutput: `npm run quality:check` completed the trainer snapshot sync, c4-3 verdict, TypeScript check, ESLint, Next build including `/explain`, skill drift check, project knowledge validation, contract map check, Story Chain validation, surface audit, and new-critical check with release verdict ready.
gaps:
  - adopt: The current product shell still embeds the legacy c4-3 trainer; this is accepted as a compatibility bridge while new product work moves into `app/` and `src/`.
  - adopt: Sentence explanation is intentionally rule-based and corpus-bound; this prevents unsupported grammar correction claims while still connecting supported senses to practice.
  - reject: Demand validation, long-term learning effect, free writing quality, and speaking improvement are outside this local build verdict.
verdict: met
```

Input: the current Next product surface, c4-3 trainer snapshot evidence,
and `/explain` sentence-to-practice route.

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
