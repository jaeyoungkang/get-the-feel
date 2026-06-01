---
name: engineering-harness
description: Engineering decision and quality-gate skill for this product. Requires agentic-base as the upstream reference and strengthens lint, dependency, duplication, purity, and release gates by maturity level.
---

# Goal

Make engineering constraints grow mechanically when the product has enough code, dependency, release, or repeated-defect pressure to need them.

The upstream reference is:

- repo: `https://github.com/jaeyoungkang/agentic-base.git`
- reference commit observed: `cc4b26b36ff06de6b7bb37a855aa966fed0070d8`

## When To Use

- When code structure changes, dependencies, build tooling, validation, release criteria, or quality scripts are being changed.
- When adding a new engineering rule.
- When promoting the product from prototype to representative, beta, or sellable.
- When `assets/engineering-quality-gates.md` says a size, complexity, dependency, or repeated-defect trigger has fired.

Do not use this skill to front-load heavy engineering machinery into a throwaway or very small prototype. L0 is valid while the product remains small and unpromoted.

## Workflow

0. **Skill Load Receipt** — record:
   - `skill: ai-supply-chain-map/skills/engineering-harness/SKILL.md`
   - `agentic_base_repo: https://github.com/jaeyoungkang/agentic-base.git`
   - `agentic_base_reference_checked`
   - `loaded_at_step`
   - `required_gates`
   - `blocked_until`

1. **agentic-base Reference Gate** — read or fetch the upstream reference before deciding.
   - Required skills: `shared-skills/engineering-profile/SKILL.md`, `shared-skills/quality-gate-steward/SKILL.md`
   - Required docs: `docs/engineering/principles.md`, `docs/engineering/quality-gates.md`
   - If unavailable, mark the decision `unresolved`.

2. **Trigger Gate** — decide whether strengthening is required now.
   - If no trigger fired, keep or return to L0/L-current and record why.
   - If a trigger fired, continue to Quality Ladder Gate.

3. **Quality Ladder Gate** — choose the current level from `assets/engineering-quality-gates.md`.
   - L0: asset check + syntax check.
   - L1: lint/format/dependency check.
   - L2: knip/dead-code, duplication, pure-function boundary checks.
   - L3: tests/coverage/build/CI release gate.
   - Do not claim a higher maturity level until its commands exist and pass.

4. **Constraint Strengthening Rule** — when a defect class repeats or a promotion target requires it, add a mechanical gate or stricter script.
   - Preferred order: existing canonical script -> repo quality script -> focused local script.
   - Do not add a prose-only rule for a defect that can be checked mechanically.

5. **Decision Output** — record:
   - `decision`
   - `agentic_base_reference`
   - `trigger_status`
   - `quality_level_before`
   - `quality_level_after`
   - `new_or_changed_gate`
   - `commands_run`
   - `unresolved_risks`

## Never

- Do not bypass a failing gate to continue UI/product work.
- Do not add dependencies without dependency-check or unused-dependency follow-up.
- Do not treat lint, knip, duplicate detection, purity checks, dependency checks, tests, or CI as optional after their maturity level is reached.
- Do not silently copy agentic-base content into this product. Reference the repo and instantiate only what this product can enforce.
