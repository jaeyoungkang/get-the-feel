# AI Supply Chain Map — Agent Guide

This product instance follows product-weaver, but its reusable assets live in this folder.

## Required Product Skills

Before any product cycle, load these in order and leave a Skill Load Receipt in the cycle record:

1. `../shared-skills/intent-lock/SKILL.md`
2. `../shared-skills/refinement-loop/SKILL.md`
3. `skills/supply-chain-map-cycle/SKILL.md`
4. `skills/engineering-harness/SKILL.md` — required only when an engineering-strengthening trigger fires: code structure changes, new dependencies, build tooling, release gates, repeated code defects, representative/beta/sellable promotion, or codebase size crossing the threshold in `assets/engineering-quality-gates.md`.

No new UI, data, research, or business-logic work can start without the relevant receipt. Lightweight prototype code can stay at L0; engineering-harness is loaded when the loop decides stronger code management is now needed.

## External Engineering Base

Engineering decisions reference `agentic-base` as the upstream engineering harness:

- repo: `https://github.com/jaeyoungkang/agentic-base.git`
- required reference skill source: `shared-skills/engineering-profile/SKILL.md`
- required quality gate source: `shared-skills/quality-gate-steward/SKILL.md`
- required docs: `docs/engineering/principles.md`, `docs/engineering/quality-gates.md`

If the repo cannot be reached or read, mark the engineering decision `unresolved` and do not strengthen or bypass gates by guesswork.

## Asset Map Gate

`assets/ASSET_MAP.md` is a blocking asset. Every cycle must update at least one asset category and must not close unless the Asset Steward fields are complete.

Required categories:

- product contract
- product-specific skills/playbooks
- engineering rules
- research and data operations
- visualization and UX design
- business logic and sellability
- process and monitor recovery

If a category is intentionally unused, record the refusal reason in `assets/ASSET_MAP.md`.

## Mechanical Enforcement

Run `node scripts/check-assets.mjs` before closing any cycle.
Run `npm run quality:check` before closing a cycle. Higher engineering levels become blocking only when their trigger in `assets/engineering-quality-gates.md` has fired.
