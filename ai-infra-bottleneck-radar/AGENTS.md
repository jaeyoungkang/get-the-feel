# AI Infra Bottleneck Radar — Agent Guide

This project is governed by `../shared-skills/product-spiral-orchestrator/SKILL.md`.

## Required Skill Order

Every product cycle must load and receipt:

1. `../shared-skills/product-spiral-orchestrator/SKILL.md`
2. `../shared-skills/intent-lock/SKILL.md`
3. `../shared-skills/refinement-loop/SKILL.md`
4. `skills/radar-cycle/SKILL.md`
5. Product-making skills as applicable:
   - `skills/macro-bottleneck-visualization/SKILL.md` before UI work
   - `skills/source-backed-bottleneck-data/SKILL.md` before data work
   - `skills/feedback-ready-product-surface/SKILL.md` before customer feedback/pricing/onboarding work
6. `skills/product-level-sellability/SKILL.md` before verdict/stop decisions

Use `../shared-skills/engineering-decision/SKILL.md` only when an engineering trigger fires.

Registered skill assets live in `assets/skill-registry.md`. A skill is not considered recovered as an asset unless it is listed there and receipted in `assets/CYCLE_RECORD.md`.

## Candidate Rule

Each loop creates a new complete candidate under `candidates/<candidate-id>/`.

Do not patch a previous candidate and call it a new loop. Previous candidates are archive/reference only unless explicitly promoted.

## Stop Permission Rule

Do not stop after `local_candidate_status: pass`. Continue until product-level `sellable_status: pass`.

If `sellable_status` is not `pass`, `assets/CYCLE_RECORD.md` must contain `allowed_to_stop: no` and a `next_action` that starts the next fresh candidate.

External business blockers can be recorded, but they do not grant stop permission. Use `skills/product-level-sellability/SKILL.md` before writing `sellable_status` or `allowed_to_stop`.

## Current Candidate

`candidates/r6-external-proof-radar/`

## Mechanical Enforcement

Run from this project root:

`npm run quality:check`
