---
name: story-chain-contract-steward
description: Companion to mission-control. Use after Mission Control scopes Story Chain work when adding, editing, splitting, merging, retiring, or reviewing Promises, Acceptance Checks, Evidence Ledger coverage, run:shell evidence, Sufficiency Review entries, surface tags, scenario refs, or Promise-related validation failures. Keeps Promise meaning, deterministic checks, ledgers, reviews, tests, and code synchronized without loading multiple narrow steward skills.
compatibility: Claude Code, Codex, Cursor-style agents in the Light House repository.
---

# Story Chain Contract Steward

Use this skill after Mission Control has established the Story Chain scope and
authority. It covers the vertical contract path:

```text
Promise -> Acceptance Check -> Evidence Ledger -> run evidence -> Sufficiency Review -> code/test/surface tags
```

Use `aspect-steward` separately for Aspect pointcuts, advice, and Aspect verdict
work.

## Non-Negotiables

- Do not create, retire, or materially change Promise meaning without Human
  authority.
- Do not change an Acceptance Check's meaning while keeping the old id.
- Do not add an Acceptance Check without executable evidence in the same change
  unless Human authority explicitly leaves the Promise `unknown`.
- Do not skip, narrow, disable, or rename tests to make validation pass.
- Do not add `legacy: true` to a new or edited Sufficiency Review entry unless
  the user explicitly approves preserving historical prose.
- Do not leave stale refs in Aspect `appliesTo`, Evidence Ledgers, review YAML,
  scenarios, or `// @promise` / `// @check` tags.

## Read First

For any contract change:

```bash
sed -n '1,220p' docs/contracts/story-chain/concepts.md
sed -n '1,180p' shared-skills/mission-control/references/cross-impact-check.md
```

For live Promise modification or retirement:

```bash
sed -n '1,180p' shared-skills/mission-control/references/promise-modification.md
sed -n '1,180p' shared-skills/mission-control/references/promise-retirement.md
```

For quality parity or live judge review stamps, load only when relevant:

```bash
sed -n '1,180p' shared-skills/mission-control/references/quality-parity-evidence.md
sed -n '1,180p' shared-skills/mission-control/references/sufficiency-review-live-judge-stamp.md
```

## Contract Edges

A live Promise change is complete only when these edges are coherent:

1. Promise frontmatter and body: parent refs, aspects, Intent Checks,
   Acceptance Checks, status, lane, and prose.
2. Acceptance Check refs: frontmatter entry, body heading, description,
   evidence, optional `revision`, and semantic slug.
3. Evidence Ledger: source promises, applied aspects where relevant,
   `check:evidence-coverage` rows, `Coverage By Promise`, `run:shell`, and
   review pointer.
4. Evidence target: deterministic test, live judge, or script named by the
   ledger.
5. Sufficiency Review: current YAML entry with matching AC/Intent refs,
   `acReviewedRevision`, fixture, run commit, observed output, gaps, and verdict.
6. Implementation surface: code, tests, scenario refs, and `// @promise` /
   `// @aspect` / `// @check` tags.

## Workflow

1. Classify the change:
   - new Promise or Promise meaning change;
   - Acceptance Check add/rename/delete/revision;
   - Evidence Ledger coverage or scope change;
   - Sufficiency Review entry change;
   - evidence-only propagation after an approved contract.
2. Run a cross-impact scan for sibling Promises, shared ledgers, Aspect
   pointcuts, surfaces, tests, and scenarios.
3. If meaning changes, stop unless Human authority is explicit.
4. Update the Promise and reciprocal refs together. Do not leave a Promise body
   ahead of its ledger, review, or tags.
5. For Acceptance Checks:
   - use semantic ids:
     `acceptance-check:<promise-slug>-<short-kebab-axis>`;
   - increment `revision` only when meaning changes;
   - update every old ref on rename or deletion;
   - avoid embedding Aspect-wide caps in the AC body.
6. For Evidence Ledgers:
   - keep ledgers narrow by coherent Promise group;
   - keep dated reviews in `evidence-ledgers/reviews/<ledger>.reviews.md`;
   - split ledgers that mix unrelated moments, lanes, or historical archives;
   - add parity evidence when an AC claims parity between surfaces.
7. For Sufficiency Reviews:
   - write post-2026-05-06 reviews as real YAML blocks;
   - run the targeted evidence first;
   - preserve old dated entries as history instead of rewriting them to today's
     refs.
8. Search for stale refs before closeout.

## Review YAML Shape

```yaml
date: YYYY-MM-DD
acs:
  - acceptance-check:example-ac
  - intent-check:example-intent
acReviewedRevision:
  - 1
fixtureRef: path/to/test-or-fixture
runCommitSha: abc123def456
observedOutput: Single-line summary of the actual rendered/runtime output, at least 80 chars.
gaps:
  - adopt: Concrete resolved gap and how this change resolves it.
  - reject: Concrete excluded expectation and why it is outside this review.
verdict: met
```

Use `git rev-parse --short=12 HEAD` for `runCommitSha`. `verdict: met` requires
no open or deferred gap in that review.

## Validation

Run the smallest honest set for the changed surface:

```bash
npm run format:check
npm run mc:validate-story-chain
npm run evidence-ledger:dry
npm run mc:audit-surface
npm run mc:audit-story-surface
```

Also run every targeted test or live judge named by changed Evidence Ledger rows.
If review YAML changed, include:

```bash
npx vitest run app/server/services/story-chain/__tests__/review-parser.test.ts
```

If release status or Aspect verdict coupling is affected, also run:

```bash
npm run mc:status
npm run mc:check-new-criticals
```
