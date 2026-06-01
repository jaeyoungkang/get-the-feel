# AI Infra Bottleneck Radar — Agent Guide

This project is governed by `../shared-skills/product-spiral-orchestrator/SKILL.md`.

## Required Skill Order

Every product cycle must load and receipt:

1. `../shared-skills/product-spiral-orchestrator/SKILL.md`
2. `../shared-skills/intent-lock/SKILL.md`
3. `../shared-skills/refinement-loop/SKILL.md`
4. `skills/radar-cycle/SKILL.md`

Use `../shared-skills/engineering-decision/SKILL.md` only when an engineering trigger fires.

## Candidate Rule

Each loop creates a new complete candidate under `candidates/<candidate-id>/`.

Do not patch a previous candidate and call it a new loop. Previous candidates are archive/reference only unless explicitly promoted.

## Stop Permission Rule

Do not stop after `local_candidate_status: pass`. Continue until `sellable_status: pass` or a concrete `external_blocker` is recorded.

If `sellable_status` is not `pass`, `assets/CYCLE_RECORD.md` must contain `allowed_to_stop: no` and a `next_action` that starts the next fresh candidate.

## Current Candidate

`candidates/r5-customer-proof-radar/`

## Mechanical Enforcement

Run from this project root:

`npm run quality:check`
