---
name: mission-control-promise-retirement
description: Current Story Chain workflow for retiring a Promise or removing a user-facing feature.
---

# Promise Retirement

Retirement removes a Promise because the product no longer intends to provide
that behavior. It is not a bug fix and not a temporary feature flag.

## Entry Conditions

Proceed only when all are true:

- Human authority has approved the retirement.
- The target Promise or feature is not merely broken; it is no longer intended.
- Cross-impact has identified sibling Promises, Aspects, surfaces, and tests.

If any condition is uncertain, stop and ask.

## Steps

1. Run `references/cross-impact-check.md`.
2. Remove or update user-facing code paths and tests that only served the
   retired Promise.
3. Remove or retag affected `// @promise`, `// @aspect`, and `// @check`
   surface markers.
4. Update covering Evidence Ledgers:
   - `## Source Promises`
   - `## Applied Aspects`
   - `## Intent Checks`
   - `## Acceptance Checks`
   - `## Coverage By Promise`
   - `run:shell` evidence
   - review/verdict sections when they mention the retired ref
5. Update Aspect `appliesTo` lists and reciprocal weaving.
6. Remove the Promise file only after references are gone, or keep a deliberate
   historical identifier only when current validators allow it.
7. Re-anchor any surviving evidence that moved from the retired surface:
   - If an Acceptance Check or Evidence Ledger still says UI/admin surface,
     verify the replacement route actually renders the component or state.
   - Component-only tests are not enough when the Promise says a page or route
     shows the behavior. Add or update a route/page render test that asserts
     the replacement surface contains the relevant `data-testid`, text, or
     state.
   - Search for retired component names, route names, test titles, and surface
     nouns in Promise prose, Evidence Ledger rows, Sufficiency Review entries,
     i18n keys, and run:shell filters.
8. Run validation and targeted tests.

## Closeout

Run:

```bash
npm run mc:validate-story-chain
npm run mc:audit-surface
npm run mc:audit-story-surface
npm run mc:status
```

Confirm the retired Promise no longer appears as an actionable row or stale
surface tag.
