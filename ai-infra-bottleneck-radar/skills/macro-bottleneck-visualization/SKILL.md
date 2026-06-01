---
name: macro-bottleneck-visualization
description: Use when designing or implementing an AI Infra Bottleneck Radar candidate surface. Forces a macro-map-first visualization with bottleneck severity, propagation path, scenario snapshots, and micro evidence without drifting into cards, stock pickers, conversion pages, or launch-review dashboards.
---

# Goal

Build the product surface around the original macro bottleneck map promise.

## When To Use

- Before creating a new candidate `index.html`, `styles.css`, or `app.js`.
- When changing first-screen layout, navigation, detail panels, scenarios, pricing, onboarding, or feedback capture.
- When a candidate risks becoming cards, KPI dashboard, stock picker, conversion page, or internal launch review.

## Workflow

0. **Skill Load Receipt** — record this skill path and candidate id in `assets/CYCLE_RECORD.md`.
1. **First Viewport Contract** — first viewport must answer:
   - where is the highest-pressure AI infrastructure bottleneck,
   - how pressure propagates through the chain,
   - what changes under current and future snapshots.
2. **Macro-To-Micro Path** — each node must allow drilldown into source, freshness, formula, and trust status.
3. **Scenario Separation** — future snapshots must be visibly labeled as scenarios, not facts or forecasts.
4. **Support Layer Rule** — trust, pricing, feedback, blockers, and launch evidence must support the map, not replace it.
5. **Reject Drift** — reject candidate surfaces where cards, company lists, pricing, or legal text become the primary surface.

## Output Checks

- macro_map_primary: pass / blocked
- bottleneck_severity_visible: pass / blocked
- propagation_path_visible: pass / blocked
- current_vs_scenario_visible: pass / blocked
- support_layers_subordinate: pass / blocked

## Never

- Never let four KPI cards replace the map.
- Never make a company comparison table the first product surface.
- Never let pricing/customer proof/legal blocker panels become the hero experience.
- Never hide uncertainty; uncertainty is a trust feature.
