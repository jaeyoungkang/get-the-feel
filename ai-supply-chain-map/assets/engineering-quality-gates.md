# Engineering Quality Gates

Engineering constraints grow by maturity level only when the loop has evidence that the codebase needs stronger management. A cycle may stay at a lower level if no trigger has fired and the product is not promoted beyond that level.

## Upstream Reference

- repo: `https://github.com/jaeyoungkang/agentic-base.git`
- reference skills:
  - `shared-skills/engineering-profile/SKILL.md`
  - `shared-skills/quality-gate-steward/SKILL.md`
- reference docs:
  - `docs/engineering/principles.md`
  - `docs/engineering/quality-gates.md`

## Ladder

| Level | Product state | Blocking gates | Promotion rule |
| --- | --- | --- | --- |
| L0 | static prototype | `quality:assets`, `quality:syntax` | Can show prototype only. |
| L1 | representative prototype | L0 + lint, format, dependency check | Required before representative promotion. |
| L2 | beta candidate | L1 + knip/dead-code, duplicate detection, pure-function boundary check | Required before beta or repeated development. |
| L3 | sellable release | L2 + tests, coverage, build, CI release gate | Required before selling. |

## Strengthening Triggers

Move up only when at least one trigger fires:

- Promotion trigger: representative, beta, or sellable promotion is requested.
- Size trigger: product logic exceeds one cohesive static file or roughly 300 lines of active JS/TS.
- Dependency trigger: a runtime or build dependency is added.
- Defect trigger: the same code defect class appears in two cycles.
- Release trigger: the product will be deployed for users outside the local prototype.
- Data/ops trigger: update pipelines, scheduled jobs, or data transforms become code instead of curated content.

If no trigger fires, keep the current level and invest in product/data/design learning instead of tooling.

## Current Level

L0. This is intentional because the project is still a static prototype and has no package-managed app stack yet.

## Next Strengthening

When the representative-promotion trigger fires:

- introduce real package-managed lint/format commands
- add dependency and unused-file/dead-code check
- split data calculation into pure functions so purity boundaries can be checked
- add duplicate detection once modules exceed one file of product logic
