---
name: source-backed-bottleneck-data
description: Use when creating or changing AI Infra Bottleneck Radar data.json, formulas, scenarios, source references, freshness, calibration samples, or update operations. Converts research and source lessons into reusable data-contract rules for future candidate loops.
---

# Goal

Make every displayed bottleneck score inspectable, source-backed, time-aware, and scenario-safe.

## When To Use

- Before editing candidate `data.json`.
- When adding nodes, edges, snapshots, source links, formulas, validation samples, or update workflow.
- When a candidate claims representative-demo, customer-proof, or paid readiness.

## Workflow

0. **Skill Load Receipt** — record this skill path and candidate id in `assets/CYCLE_RECORD.md`.
1. **Display Contract** — every displayed node, edge, snapshot, and thin path has source, freshness, calculation, and scenario fields.
2. **Formula Contract** — every pressure score has formula components whose weights sum to 1 and whose weighted score matches the displayed pressure within tolerance.
3. **Freshness Contract** — compute freshness from `applied_at`, `freshness_today`, and `stale_after_days`.
4. **Scenario Contract** — every scenario `delta` must bind to explicit `scenario_rule_bindings`.
5. **Validation Contract** — every displayed stage has validation samples and source review queue entries.
6. **Boundary Contract** — future states are scenarios, pricing tests are hypotheses, and investment advice is explicitly refused.

## Required Data Objects

- `sources`
- `meta`
- `stages`
- `edges`
- `thin_paths`
- `snapshots`
- `calibration_samples`
- `source_review_queue`
- `compliance_checklist`
- pricing or customer-proof fields when claimed

## Never

- Never label a scenario as fact.
- Never display a pressure score without formula components.
- Never cite a source without a source reference location.
- Never imply pricing or customer proof is validated unless actual evidence exists in the data contract.
