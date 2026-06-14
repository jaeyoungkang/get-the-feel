# Integration Surfaces

Use this file when the repo already has recognizable downstream surfaces and you need to anchor propagation to the right ones.

## Goal

Map approved contract artifacts to the canonical downstream surfaces the project already treats as real.

## Default Surface Types

- contract docs
- spec files
- execution queue
- tests
- code targets
- alignment or review surface

Do not invent a parallel surface if one already exists.

## Agentic-base Shape

Typical canonical sources:

- `docs/PRODUCT.md`
- `docs/PRODUCT.md`
- `docs/contracts/feature-specs.md`
- `docs/contracts/story-chain/`
- `docs/design-principles.md`

Typical propagation targets:

- `specs/*.spec.md`
- `fix_plan.md`
- implementation files
- quality checks

Recommended use:

- derive the smallest spec skeleton from an approved story
- derive the next queue item from that spec
- only then move into code

## Lighthouse Shape

Typical canonical sources:

- `docs/contracts/feature-specs.md`
- `docs/intent-traceability.md`
- `docs/intent-backlog.md`

Typical propagation targets:

- `specs/*.spec.md`
- `run:shell` checks
- app code targets
- `/admin/alignment`
- Mission Control snapshot or kanban

Recommended use:

- preserve story, policy, and CIQ references
- propagate into specs before code
- reflect blocker and next-authority state in alignment surfaces instead of private notes

## Heuristic

If a repo exposes a deterministic status surface such as alignment dashboard, mission control, backlog audit, or traceability snapshot, treat that as part of the propagation target set.

If a repo only has docs and code, stop at the nearest explicit queue/spec layer and note the missing operational surface.
