---
name: quality-gate-steward
description: Use when adding, editing, reviewing, or debugging Light House verification gates, quality gates, CI gate wiring, `quality:*` scripts, `mc:judge-static`, mutation testing, negative-test markers, hardening-tier policy, evidence-ledger dry/full gate behavior, or validation documentation. Keeps gate changes scoped, non-bypassable, and aligned with Story Chain release semantics.
compatibility: Claude Code, Codex, Cursor-style agents in the Light House repository.
---

# Quality Gate Steward Skill

Use this skill when the work changes how Light House proves a contract, blocks a
release, or validates agent output. This includes package scripts, CI workflow
gate order, static judges, mutation configs, negative-test markers, hardening
policy, and verification documentation.

## Read First

- `docs/verification-gates.md`
- `docs/contract-maps/quality-gates.md`
- `docs/mission-control.md`
- `package.json` scripts
- relevant files under `scripts/mission-control/`, `scripts/quality/`,
  `.github/workflows/`, or mutation config files

If the gate changes Story Chain meaning, use Mission Control first.

## Workflow

1. Classify the gate:
   - formatting/static code;
   - Story Chain graph;
   - Evidence Ledger dry/full runner;
   - surface/event audit;
   - static/live judge;
   - mutation or negative test;
   - Project Knowledge or skill sync guard.
2. Identify what false pass the gate prevents.
3. Decide whether this is a new gate, a stricter existing gate, a docs-only
   explanation, or a repair to stale wiring.
4. Prefer strengthening the canonical gate over adding an ad hoc script.
5. Keep PR-local, full, and nightly gate costs explicit.
6. Update docs and contract maps when gate relationships change.
7. Run the smallest command set that proves the changed gate path.

## Boundaries

- Do not disable, narrow, or skip a gate to make a change pass.
- Do not mark a gate green from simulated output when the contract requires
  real runtime output, rendered DOM, or executable evidence.
- Do not silently move a blocking gate from `quality:fast` to a non-blocking
  path.
- Do not update baselines except through the documented explicit baseline
  command.

## Validation

Always run the gate you changed. Also run:

```bash
npm run format:check
npm run mc:validate-story-chain
```

When package quality scripts or skill sync are touched, include:

```bash
npm run quality:guards
```
