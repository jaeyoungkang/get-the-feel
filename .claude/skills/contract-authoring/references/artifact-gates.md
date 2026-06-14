# Artifact Gates

Use these gates before moving to the next artifact.

## PRODUCT Gate

Do not draft Story Chain nodes until these are mostly stable:

- one-line identity
- why now
- concrete target user or scene
- value axes
- non-goals
- constraints
- out-of-scope

If 2 or more of these are still blocked, stay in discovery.

## Story Chain Node Gate

Do not move to `docs/contracts/feature-specs.md` until these are mostly stable:

- themes are not contradictory
- MVP scope is thin
- each story has a user, intent, and outcome
- ACs are concrete enough to test
- cross-cutting policies are separated from stories

If stories are bloated, collapse scope before drafting specs.

## feature-specs Gate

Do not move to implementation handoff until these are mostly stable:

- stable mapping from US to scenario bundle
- each scenario has Given / When / Then
- validation hint exists
- top-level data model is declared if needed
- implementation order is explicit enough to avoid random build order

## design-principles Gate

Only keep principles that are durable and identity-level.

Reject principles that are:

- temporary implementation details
- arbitrary aesthetic choices without rationale
- library decisions that are not product-defining

## Handoff Gate

Do not hand off to specs or code until:

- upstream docs have explicit approval
- blocked items are resolved or intentionally deferred
- unresolved items are visible, not hidden
- the next downstream artifact is unambiguous enough to draft

## Canonical Promotion Gate

Do not claim the contract package is fully landed in the repo until:

- canonical file paths are identified
- canonical files are safe to overwrite or intentionally preserved
- any draft-only paths are clearly marked as draft
- promotion side effects such as stale proposals or temporary notes are cleaned up or explicitly left for review
