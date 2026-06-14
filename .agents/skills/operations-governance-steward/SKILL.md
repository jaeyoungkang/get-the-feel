---
name: operations-governance-steward
description: Use when adding, editing, reviewing, or routing operations runbooks under docs/operations, including operational procedure, runbook, rollback, incident, backup, local dev, deployment, security hardening, Evidence To Record, or deciding whether an operational change should propagate to Story Chain, Engineering Assurance, Evidence Ledger, or quality gates.
compatibility: Claude Code and OpenAI Codex in agentic-base-derived repositories.
---

# Operations Governance Steward

Use this skill when operational procedure changes need to stay connected to the
contract and evidence system.

The goal is to keep `docs/operations/` runnable and current without creating a
separate Operations Chain. Operations runbooks describe how to act. Story Chain
describes user/operator-visible promises. Engineering Assurance describes
release-critical internal invariants and controls.

## Owns

- `docs/operations/README.md`
- `docs/operations/_RUNBOOK_TEMPLATE.md`
- runbooks under `docs/operations/`
- `docs/contract-maps/operations.md`
- operations rows in related Contract Maps

## Boundaries

- Do not create or change product promises directly from a runbook. Route through
  Mission Control.
- Do not create or change assurance claims, controls, or evidence kinds directly
  from a runbook. Route through Engineering Assurance.
- Do not change release gate semantics without Quality Gate Steward.
- Do not mark Evidence Ledger rows `met` from procedure prose alone. Require
  executable, runtime, review, or other release-eligible evidence.

## Read First

1. `docs/operations/README.md`
2. The target runbook under `docs/operations/`
3. `docs/contract-maps/operations.md`
4. The related Story Chain Promise, Evidence Ledger, Engineering Assurance
   control, or quality gate source if the change routes beyond procedure text

## Workflow

1. Classify the operational change:

| Route | Use when |
| --- | --- |
| runbook-only | Procedure wording, environment note, command correction, or operator checklist change |
| Story Chain | User or operator-visible behavior changes |
| Engineering Assurance | Release-critical internal invariant, control, evidence-kind, or runtime safety condition changes |
| Quality Gate | CI, local quality, deployment, release, or validation command semantics change |
| Project Knowledge | Incident, handoff, or durable project memory without a contract change |

2. Keep the runbook executable:

- State trigger, owner, procedure, rollback or irreversible boundary, evidence to
  record, and contract links.
- Prefer updating the existing runbook shape. Use
  `docs/operations/_RUNBOOK_TEMPLATE.md` for new runbooks.
- Make environment assumptions explicit.

3. Propagate only through the owning route:

- Story Chain changes go through Mission Control.
- Assurance control changes go through Engineering Assurance Steward.
- Gate changes go through Quality Gate Steward.
- Navigation changes update Contract Maps.
- Remaining work goes into `fix_plan.md` or the relevant Evidence Ledger.

4. Record durable changes:

- Update `docs/change-log.md` for material governance changes.
- Append `docs/project-events/bootstrap-events.jsonl` when the change affects
  ongoing project continuity.

## Validation

For docs-only operations governance changes:

```bash
npm run contract-maps:check
npm run guard:skills
npm run pk:validate
npm run quality:check
```

If the change affects code, gates, deployment, or release readiness, also run
the owning `npm run quality:release`, `npm run quality:check`, or targeted
runtime control command named by the changed source.
