# Pilot Lifecycle Contract Map

This map answers: which files should a new agent read to understand the
agentic-base pilot flow?

It does not approve a product, waive sample-first, or choose a technology stack.

## Flow

| Stage | Main question | Source files |
| --- | --- | --- |
| Initial intent | What is this product trying to become? | [`docs/PRODUCT.md`](../PRODUCT.md), [`docs/contract-authoring-tool.md`](../contract-authoring-tool.md) |
| Sample iteration | Which concrete artifacts expose intent gaps? | [`docs/sample-pack.md`](../sample-pack.md), [`docs/pilot-lifecycle.md`](../pilot-lifecycle.md) |
| Story Chain completion | What promises are approved and checkable? | [`docs/contracts/story-chain/`](../contracts/story-chain/), [`docs/contracts/feature-specs.md`](../contracts/feature-specs.md) |
| Bootstrap choice | Which stack fits the locked contract? | [`docs/engineering-profile.md`](../engineering-profile.md), [`docs/bootstrap-approval.md`](../bootstrap-approval.md) |
| Propagation | Which Promise/Evidence Ledger path is next? | [`fix_plan.md`](../../fix_plan.md), [`docs/contracts/story-chain/evidence-ledgers/`](../contracts/story-chain/evidence-ledgers/) |
| Wiring verification | Did generated data reach consumption and user-visible result? | [`docs/verification-gates.md`](../verification-gates.md), [`shared-skills/verify-wiring/SKILL.md`](../../shared-skills/verify-wiring/SKILL.md) |

## Read Path

For a new cloned project:

1. Product identity draft.
2. Pilot lifecycle.
3. Sample pack and real sample files.
4. Story Chain concepts and affected nodes.
5. Engineering profile and bootstrap approval only after samples are accepted.
6. Mission Control status before claiming release readiness.

Sources:

- [`docs/pilot-lifecycle.md`](../pilot-lifecycle.md)
- [`AGENTS.md`](../../AGENTS.md)

## Blockers

- Missing representative sample blocks bootstrap.
- Missing Human approval blocks new Promise, Aspect, and technology selection.
- `unknown` or `not-met` Story Chain status blocks release claims.
