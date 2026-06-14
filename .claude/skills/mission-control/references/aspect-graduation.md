---
name: mission-control-aspect-authoring
description: Current Aspect authoring rules for Story Chain aspects and their covering Evidence Ledgers.
---

# Aspect Authoring

Aspects are current Story Chain cross-cutting rules. They live under
`docs/contracts/story-chain/aspects/<slug>.md` and are verified through a
covering Evidence Ledger.

## Frontmatter

```yaml
---
id: aspect:<slug>
slug: <slug>
title: <title>
appliesTo:
  - promise:<slug>
coveringSpec: docs/contracts/story-chain/evidence-ledgers/<name>.ledger.md
verdict: met | not-met | unknown | unverified
---
```

## Body

Use this four-section target shape for new or normalized Aspects:

1. `## Why`
2. `## Pointcut`
3. `## Advice`
4. `## Verification`

Older Aspect files may still have only `## Why`; do not describe that as the
standard. When touching an Aspect for content review or pointcut changes, move
it toward the four-section target shape unless the user explicitly scopes the
work to wording only.

The Aspect is valid only when every `appliesTo` Promise exists and reciprocal
weaving is reflected in the covering Evidence Ledger.

## Covering Evidence Ledger

The ledger must list:

- the relevant source Promises;
- the Aspect under `## Applied Aspects` when reciprocal weaving holds;
- deterministic Acceptance Check evidence for the behavior the Aspect
  constrains;
- a review/verdict entry when the Aspect contributes to release verdict.

Run `npm run mc:validate-story-chain` and `npm run mc:audit-story-surface`
after changing Aspect pointcuts or tagged surfaces.
