# Operations Governance

`docs/operations/` owns executable operational procedures for an
agentic-base-derived project. It is a runbook layer, not a separate contract
system.

Operational docs may describe how to run, recover, deploy, secure, or verify the
project. Product meaning still lives in Story Chain. Release-critical internal
invariants still live in Engineering Assurance contracts. Evidence still lands
in Evidence Ledgers or quality gate output.

## Authority Boundary

| Concern | Owning surface |
| --- | --- |
| Runnable procedure, operator checklist, rollback path | `docs/operations/` |
| User or operator-visible product behavior | `docs/contracts/story-chain/` |
| Internal invariant, control, evidence-kind vocabulary | `docs/contracts/engineering/` |
| Release, CI, and local quality semantics | `docs/verification-gates.md`, `package.json`, `scripts/` |
| Engineering method and governance rationale | `docs/engineering/` |
| Cross-source navigation | `docs/contract-maps/operations.md` |

## Change Routing

| Change type | Required route |
| --- | --- |
| Procedure wording or operator clarification only | Update the runbook and contract map if the read path changes. |
| New or changed user/operator-visible behavior | Use Mission Control, update the owning Promise or Evidence Ledger, then link back from the runbook. |
| Release-critical invariant or control | Use Engineering Assurance, update the claim/control/evidence-kind or ledger row, then link back from the runbook. |
| Gate, CI, deployment, or release semantics | Use Quality Gate Steward, update gate docs/scripts, then link back from the runbook. |
| Incident or recovery procedure with incomplete proof | Record the gap in the relevant Evidence Ledger or `fix_plan.md`; do not mark it release-ready from procedure text alone. |

## Required Runbook Shape

New operational runbooks should follow
[`_RUNBOOK_TEMPLATE.md`](_RUNBOOK_TEMPLATE.md) unless an existing format is
already more precise.

Every current runbook should make these questions answerable:

- Purpose: what operational outcome the procedure protects.
- Trigger: when a human or agent should use it.
- Owner: who or what role owns the procedure.
- Procedure: the executable steps.
- Rollback or irreversible boundary: when it is safe to retry and when it is not.
- Evidence to record: command output, test result, ledger row, deployment log, or
  incident note.
- Contract links: Story Chain Promise, Aspect, Evidence Ledger, Engineering
  Assurance control, or quality gate source when applicable.

## Validation

For docs-only operations governance changes:

```bash
npm run contract-maps:check
npm run guard:skills
npm run pk:validate
npm run quality:check
```

For code, gate, deployment, or release-affecting changes, also run the owning
test/build/release gates named by the modified runbook, Story Chain ledger, or
Engineering Assurance control.
