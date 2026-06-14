---
name: aspect-steward
description: Companion to mission-control. Use after Mission Control scopes the Story Chain work when adding, editing, reviewing, retiring, or repairing Aspects under docs/contracts/story-chain/aspects, including Aspect frontmatter, appliesTo pointcuts, Why/Pointcut/Advice/Verification prose, covering Evidence Ledgers, reciprocal Promise weaving, surface tags, Aspect verdicts, or aspect-related validation failures. Keeps cross-cutting rules synchronized with Promises, ledgers, tests, and release verdict.
---

# Aspect Steward

Use this skill before changing any `aspect:*` declaration, pointcut, or
cross-cutting rule.

This is a Mission Control companion skill. Load Mission Control first for Story
Chain scope and authority. Use `story-chain-contract-steward` when covering
ledger shape, Promise weaving, or Sufficiency Review entries change.

## Non-Negotiables

- Do not add or materially change Aspect meaning without Human authority.
- Do not update an Aspect `appliesTo` list without reciprocal Evidence Ledger
  weaving.
- Do not treat Aspect prose as a label. It must define Why, Pointcut, Advice,
  and Verification when touched for meaning or pointcut changes.
- Do not leave release verdict stuck at `unverified`, `unknown`, or stale due to
  missing covering review evidence.

## Required Pre-Check

Before editing an Aspect:

```bash
sed -n '1,220p' docs/contracts/story-chain/concepts.md
sed -n '1,180p' shared-skills/mission-control/references/aspect-graduation.md
rg -n "aspect:<target-slug>|<target-slug>" docs/contracts/story-chain app
```

Also inspect every target Promise named by `appliesTo`.

## Aspect Shape

Use this target body shape for new or meaning-touched Aspects:

1. `## Why`
2. `## Pointcut`
3. `## Advice`
4. `## Verification`

Frontmatter must keep:

- `id: aspect:<slug>`
- `slug`
- `title`
- `appliesTo`
- `coveringLedger`
- `verdict`

The covering Evidence Ledger must list the Aspect under `## Applied Aspects`
when reciprocal weaving holds.

## Add Or Change Procedure

1. Decide whether this is a new cross-cutting rule, pointcut update, prose-only
   clarification, or retirement.
2. Confirm Human authority for new or meaning-changed Aspect advice.
3. Update Aspect frontmatter and body.
4. Propagate every new or changed Advice clause.
   - Build an advice-to-evidence matrix before marking the Aspect `met`.
   - For each changed advice clause, name the affected Promise(s), surface(s),
     ledger row(s), and deterministic or live-judge evidence that proves it.
   - If a clause is only partially covered, write the Sufficiency Review verdict
     as `unknown` and list the missing propagation paths. Do not claim `met`
     from a shared format/schema test when the advice is surface-specific.
   - Treat static UI copy, prompt-generated reaction prose, deterministic
     fallback copy, and provider/source wording as separate propagation paths.
5. Update reciprocal Evidence Ledger `## Applied Aspects`, source Promise set,
   AC coverage, and review/verdict evidence.
6. Update affected `// @aspect` tags in rendered or user-facing surfaces.
7. If the Aspect affects release verdict, add or update the Sufficiency Review
   entry using `story-chain-contract-steward`.
   - The dated review entry must include the exact `aspect:<slug>` ref in the
     heading or body. The Aspect verdict reader only treats exact Aspect refs as
     verdict-bearing entries.
   - After editing the review, run `npm run mc:status` or
     `npx tsx -e "import { buildAspectVerdictReport } from './app/server/services/aspect-verdict'; console.log(buildAspectVerdictReport(process.cwd()))"`
     and verify the changed Aspect status is the intended one.
   - A changed Aspect may legitimately leave release blocked while propagation
     work is pending. Do not force green by writing an over-broad `met` review.

## Pointcut Changes

For every added or removed Promise in `appliesTo`:

- inspect the Promise file,
- inspect the covering Evidence Ledger,
- update reciprocal weaving,
- update affected surface tags,
- run Story Chain validation.

If a Promise no longer follows the Aspect advice but still has the Aspect in
`appliesTo`, do not patch tests around it. Fix the pointcut or implementation.

## Validation

Run the smallest honest set:

```bash
npm run mc:validate-story-chain
npm run mc:audit-surface
npm run mc:audit-story-surface
npm run evidence-ledger:dry
npm run format:check
```

Also run targeted evidence for the covering ledger and any live judge that
contributes to the Aspect verdict.
