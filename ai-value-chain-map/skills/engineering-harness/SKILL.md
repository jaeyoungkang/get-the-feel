---
name: engineering-harness
description: Trigger-based engineering strengthening for AI value-chain map. References agentic-base when code management pressure appears.
---

# Goal

Keep prototypes light, but strengthen engineering gates when the loop has evidence they are needed.

## Upstream

- repo: `https://github.com/jaeyoungkang/agentic-base.git`
- required references when triggered:
  - `shared-skills/engineering-profile/SKILL.md`
  - `shared-skills/quality-gate-steward/SKILL.md`
  - `docs/engineering/principles.md`
  - `docs/engineering/quality-gates.md`

## Triggers

- dependency added
- build tooling added
- code exceeds one cohesive file or roughly 300 lines of active JS
- repeated defect class appears twice
- deployment or representative/beta/sellable promotion
- scheduled data pipeline or transform code appears

## Rule

If no trigger fired, stay lightweight. If a trigger fired, consult agentic-base and add the smallest mechanical gate that prevents the false pass.

