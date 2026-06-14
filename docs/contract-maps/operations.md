# Operations Governance Map

This map answers: when an operational source document changes, which contract,
evidence, or gate surfaces must be read or updated with it?

It does not create an Operations Chain. `docs/operations/` owns runnable
procedures. Story Chain owns product meaning. Engineering Assurance owns
release-critical internal invariants and controls.

## Source Cluster

| Source | Operational role | Contract and evidence route |
| --- | --- | --- |
| [`docs/operations/README.md`](../operations/README.md) | Operations governance and runbook routing | This map, skill routing, and the owning contract/gate source |
| [`docs/operations/_RUNBOOK_TEMPLATE.md`](../operations/_RUNBOOK_TEMPLATE.md) | Template for new operational runbooks | Use for project-specific runbooks after bootstrap |
| Project-specific runbooks under `docs/operations/` | Local dev, deployment, recovery, incident, backup, security, migration, or service operations | Route behavior to Story Chain, release-critical invariants to Engineering Assurance, and gate semantics to verification gates |

## Routing Rules

| If the operational change says... | Then update... |
| --- | --- |
| "Run this command or sequence differently" | The runbook, this map if the read path changes, and validation evidence if a gate is affected |
| "The product now promises different behavior" | Story Chain Promise, Acceptance Check inventory, Evidence Ledger, and downstream code/tests |
| "This internal invariant must always hold" | Engineering Assurance claim/control/evidence-kind and the covering Evidence Ledger row |
| "A release gate should pass or fail differently" | Verification gate docs, scripts/package wiring, and quality gate map |
| "We observed a real incident or recovery result" | Evidence Ledger, Project Knowledge event, change log, and any affected runbook |

## Read Path

1. Start with [`docs/operations/README.md`](../operations/README.md) to classify
   the change.
2. Read the target runbook.
3. If the change affects user-visible behavior, load Mission Control and the
   owning Story Chain Promise or Evidence Ledger.
4. If the change affects an internal release-critical invariant, load
   Engineering Assurance and the owning claim/control.
5. If the change affects a gate or deployment path, load Quality Gate Steward and
   the gate source.

## Guardrails

- Do not mark a ledger `met` from runbook text alone.
- Do not create a duplicate operational contract namespace.
- Do not hide incomplete runtime proof in prose; record it as a ledger or
  `fix_plan.md` gap.
- Keep commands executable and environment assumptions explicit.
