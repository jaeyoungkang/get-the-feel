---
name: engineering-assurance-steward
description: Use when adding, editing, reviewing, or propagating Engineering Assurance docs under docs/contracts/engineering, including assurance-claim, lifecycle, control, evidence-kind, internal invariant, release-critical operational control, or coverage expansion work.
compatibility: Claude Code and OpenAI Codex in agentic-base-derived repositories.
---

# Engineering Assurance Steward

Use this skill for the subordinate Engineering Assurance layer that supports
Story Chain without turning internal invariants into user-facing Promises.

## Owns

- `docs/contracts/engineering/`
- Assurance Claims: `assurance-claim:<slug>`
- Lifecycles: `lifecycle:<slug>`
- Operational Controls: `control:<slug>`
- Engineering evidence kinds in `docs/contracts/engineering/evidence-kinds.md`
- Propagation between Promise frontmatter, Evidence Ledger frontmatter, control
  docs, executable evidence, and Mission Control gates.

## Boundaries

- Do not create a Story Chain Promise for an internal invariant unless the user
  or operator can directly observe and evaluate the outcome.
- Do not mark a whole claim closed from one slice. Record the exact covered
  surface and keep remaining surfaces in `fix_plan.md` or the owning Evidence
  Ledger.
- Do not treat conditional evidence kinds as release-eligible until minimum
  fields and validator rules exist.
- Do not use this skill to change gate semantics alone. If validator, package
  scripts, or CI behavior changes, use `quality-gate-steward` too.
- Do not rewrite Product, Promise, or Aspect meaning. If meaning changes, route
  through `mission-control` and Human authority.

## Read First

1. `docs/contracts/engineering/README.md`
2. relevant files under `docs/contracts/engineering/`
3. affected Promise files under `docs/contracts/story-chain/promises/`
4. affected Evidence Ledger files under
   `docs/contracts/story-chain/evidence-ledgers/`
5. `docs/contract-maps/engineering-assurance.md`
6. `fix_plan.md` when it exists in the cloned project

## Workflow

1. Classify the work:
   - new internal invariant;
   - new lifecycle;
   - new operational control;
   - evidence-kind definition;
   - coverage expansion for an existing claim/control;
   - review fix for overclaiming or stale propagation.
2. Pick the smallest slice:
   - one route/proxy surface;
   - one webhook/scheduler behavior;
   - one migration/deploy command;
   - one ledger row or tightly related row set.
3. Keep source and ledger synchronized:
   - claim `supports` lists real Promise IDs;
   - control `claimRefs` points to existing claims;
   - Promise frontmatter cites needed `assuranceClaims`;
   - Evidence Ledger frontmatter cites `assuranceClaims`, `controls`, and only
     release-eligible `evidenceKinds` when `verdict: met`;
   - ledger rows cite concrete runtime-output, command output, or a clearly
     marked partial/unknown gap.
4. Update planning and maps:
   - close only the slice that is actually evidenced;
   - record remaining coverage expansion in `fix_plan.md` or the relevant
     Evidence Ledger;
   - update `docs/contract-maps/engineering-assurance.md` and related maps when
     read paths or gate semantics change.
5. Validate with the smallest honest gate set.

## Validation

For docs-only Engineering Assurance changes:

```bash
npm run mc:validate-story-chain
npm run contract-maps:check
npm run pk:validate
```

For control/evidence changes that touch tests, scripts, or gates:

```bash
npm run quality:check
```

If release readiness is claimed, also run:

```bash
npm run quality:release
```

`quality:release` may remain blocked by unrelated unknown ledgers. Report that
explicitly instead of weakening the gate.
