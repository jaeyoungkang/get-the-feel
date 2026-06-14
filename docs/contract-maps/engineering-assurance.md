# Engineering Assurance Contract Map

This map answers: how should a maintainer read the optional Engineering
Assurance layer alongside Story Chain contracts?

It does not create assurance claims, controls, evidence kinds, or release gates.
Those live in the source files linked below.

## Authority Stack

| Question | Read |
| --- | --- |
| Why does this layer exist? | [`docs/contracts/engineering/README.md`](../contracts/engineering/README.md), [`docs/engineering/quality-gates.md`](../engineering/quality-gates.md) |
| Which internal invariants and controls exist? | [`docs/contracts/engineering/`](../contracts/engineering/) |
| Which product Promise needs this support? | [`docs/contracts/story-chain/promises/`](../contracts/story-chain/promises/) |
| Which ledger currently proves or gaps the support? | [`docs/contracts/story-chain/evidence-ledgers/`](../contracts/story-chain/evidence-ledgers/) |
| What does the validator enforce? | [`scripts/mission-control/mc-validate-story-chain.mjs`](../../scripts/mission-control/mc-validate-story-chain.mjs), [`docs/verification-gates.md`](../verification-gates.md) |
| What remains to expand? | [`fix_plan.md`](../../fix_plan.md) in a cloned project, or the owning Evidence Ledger |

## Gate Semantics

Routine template or branch work:

```bash
npm run quality:check
```

This keeps Engineering Assurance references structurally visible without
requiring a cloned project to define any claims.

Release readiness in a cloned project:

```bash
npm run quality:release
```

The base template currently ships Engineering Assurance as parse-only warning
support. A project may later promote `verdict: met` ledger references to scoped
release-blocking gates after at least one closed slice proves the pattern and
false-positive rate.

## Read Path

1. Start with the affected Promise or Evidence Ledger.
2. Follow `assuranceClaims`, `controls`, and `evidenceKinds` frontmatter into
   `docs/contracts/engineering/`.
3. Check whether the source method doc calls the slice complete or pending.
4. Run `npm run mc:status` before stating current computed status.
5. Update `fix_plan.md` or the owning Evidence Ledger for coverage expansion
   rather than overclaiming a whole claim from one slice.

## Do Not Import

Do not put project-specific claims such as VM owner routing, billing webhook
idempotency, or database migration drift into the base template. They belong in
the cloned project that has those surfaces.

Sources:

- [`docs/contracts/engineering/README.md`](../contracts/engineering/README.md)
- [`docs/contracts/story-chain/concepts.md`](../contracts/story-chain/concepts.md)
- [`docs/verification-gates.md`](../verification-gates.md)
