---
name: radar-cycle
description: Project-specific skill for AI Infra Bottleneck Radar. Requires fresh candidate folders, macro-map primary surface, source contracts, scenario boundaries, sellability gates, and asset recovery.
---

# Goal

Build one complete candidate per loop for AI infrastructure bottleneck visualization.

## Workflow

0. **Skill Load Receipt** — record this skill path, candidate id, previous candidate disposition, gates, blockers.
1. **Fresh Candidate** — create a new `candidates/<candidate-id>/` with its own `index.html`, `styles.css`, `app.js`, and `data.json`.
2. **Macro Surface** — first viewport is a macro bottleneck map, not cards or a stock picker.
3. **Thin Path** — each candidate has one highlighted operating path with source, freshness, scenario, and paid-job contracts.
4. **Complete Candidate** — local page must be usable end to end even if representative or paid promotion is blocked.
5. **Mechanical Check** — run `npm run quality:check`.
6. **Current Candidate Check** — before verdict, `package.json`, asset check, data check, and syntax check must target the current candidate id.
7. **Representative Demo Surface** — representative-demo data must be visible in the UI as user language, not only present in `data.json`.
8. **Asset Recovery** — move lessons into assets, skill, data contract, design grammar, business logic, or checks.

## Never

- Never patch an older candidate as the next loop.
- Never render future scenarios as facts.
- Never let company/stock cards replace the map.
- Never let launch-review vocabulary replace the investor-facing bottleneck promise.
- Never close a cycle with only chat feedback.
