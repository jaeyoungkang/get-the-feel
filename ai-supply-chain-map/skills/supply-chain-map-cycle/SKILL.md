---
name: supply-chain-map-cycle
description: AI supply-chain map product cycles. Enforces reusable asset growth, macro-map preservation, data/operations contracts, and sellability gates.
---

# Goal

Make each cycle improve both the AI supply-chain map product and the reusable product-building assets behind it.

## When To Use

- Before any UI, data, research, business, or process cycle in this product.
- Before closing a cycle as representative or sellable.
- When a monitor says the product or process drifted.

## Workflow

0. **Skill Load Receipt** — record:
   - `skill: ai-supply-chain-map/skills/supply-chain-map-cycle/SKILL.md`
   - `loaded_at_step`
   - `required_gates`
   - `blocked_until`

1. **Asset Preflight** — read `assets/ASSET_MAP.md` and identify the asset category this cycle will update.
   - If no category will update, stop.
   - If a skill/playbook should exist but does not, create or repair the skill before product work.
   - If the cycle changes code structure, dependencies, quality gates, build tooling, data validation, or release criteria, load `skills/engineering-harness/SKILL.md` first and record its receipt.

2. **Original Ask Anchor** — keep the primary surface as a macro AI supply-chain bottleneck map for ordinary stock investors.
   - Reject primary pivots to stock cards, company dossiers, or generic dashboards.

3. **Thin Path Choice** — choose one narrow path when data or operations are uncertain.
   - Required for update cadence, time change, and future snapshot work.

4. **Sellability Gate** — answer buyer, paid job, price hypothesis, freshness promise, owner, cost/manual work, release blockers, and sales risk before expanding UI.

5. **Mechanical Gate** — run `npm run quality:check`.

6. **Asset Steward Verdict** — record whether reusable assets actually changed.
   - Missing skill receipt, missing Asset Map update, or stale category means `repair-before-next`.

## Never

- Do not treat a cycle as complete because the screen looks better.
- Do not call example values observed.
- Do not let monitor feedback remain only in chat.
- Do not add features before the blocking asset/gate is repaired.
- Do not make engineering decisions from memory when the agentic-base reference skill is required.
