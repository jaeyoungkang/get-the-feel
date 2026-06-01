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
8. **Customer Proof Surface** — if a candidate claims customer proof, pricing/watchlist/capture proof must support the macro map and must remain marked as unvalidated until real customer capture exists.
9. **Cycle Record Binding** — cycle record must bind `current_candidate_id`, `current_candidate_path`, monitor outputs, and stop permission by exact fields before verdict.
10. **Product-Level Stop** — launch/legal/payment blockers cannot stop the product loop. Stop only when the product surface itself is ready for customer feedback, repeat use, and pricing evaluation.
11. **Final Permission Gate** — if `sellable_status` is not `pass`, `npm run quality:final` must fail and the cycle record must name the next fresh candidate plus `if_quality_final_fails: continue_next_fresh_candidate`.
12. **Asset Recovery** — move lessons into assets, skill, data contract, design grammar, business logic, or checks.

## Never

- Never patch an older candidate as the next loop.
- Never render future scenarios as facts.
- Never let company/stock cards replace the map.
- Never let launch-review vocabulary replace the investor-facing bottleneck promise.
- Never let conversion or pricing surfaces replace the macro bottleneck map.
- Never stop because business/legal/payment approval is outside the session when the product surface still needs iteration.
- Never close a cycle with only chat feedback.
- Never send a completion-style final response after a non-sellable cycle; continue the next fresh candidate instead.
