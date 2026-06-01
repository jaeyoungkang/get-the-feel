# AI Value Chain Map — Agent Guide

This product instance exists to build a sellable visual AI value-chain service without losing reusable assets.

## Required Skills

Before any product cycle, load these and leave receipts in `assets/CYCLE_RECORD.md`:

1. `../shared-skills/intent-lock/SKILL.md`
2. `../shared-skills/refinement-loop/SKILL.md`
3. `skills/ai-value-chain-cycle/SKILL.md`

Use `skills/engineering-harness/SKILL.md` only when a strengthening trigger fires: new dependencies, build tooling, release gates, repeated defects, deployment, or promotion beyond local prototype.

## Primary Surface

The first screen must be a macro AI value-chain flow map. Detail panels, contracts, and business logic support the map; they do not replace it.

## Mechanical Enforcement

Run `npm run quality:check` before closing a cycle.

