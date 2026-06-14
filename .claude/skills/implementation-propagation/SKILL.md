---
name: implementation-propagation
description: Propagate approved upstream Story Chain contract docs into downstream specs, plans, tests, code targets, Evidence Ledgers, and alignment evidence without rewriting the contract. Use when `PRODUCT`, Story Chain nodes, `feature-specs`, or equivalent contract docs are already approved, the engineering profile is stable enough, a real project scaffold already exists, and implementation work needs the smallest safe next propagation step.
compatibility: Designed for Claude Code and OpenAI Codex. Works best in repositories that keep canonical contract docs, spec files, and a visible review or alignment surface.
---

# Goal

Turn approved contract artifacts into downstream implementation inputs and evidence while preserving meaning.

This is an implementation skill, not a planning skill.

- Primary job: propagate approved contract into lower layers
- Secondary job: surface traceability gaps and send them back upstream when needed
- Not this skill's job: redefine the product contract, invent new top-level promises, or self-assign evaluator verdicts

## When To Use

- Upstream contract docs are approved and implementation should begin
- A real project scaffold already exists, or a canonical bootstrap baseline is already in place
- A repo needs `specs/*.spec.md`, `fix_plan`, tests, code targets, or alignment evidence derived from approved docs
- Existing implementation drifted and needs to be re-grounded in canonical docs
- A user wants the next smallest safe propagation step instead of a broad implementation spree

## Workflow

1. Read [references/program.md](references/program.md).
2. If needed, read [references/integration-surfaces.md](references/integration-surfaces.md).
3. Lock the source contract set first:
   - canonical product docs
   - relevant stories, policies, CIQs, or equivalent IDs
   - any unresolved items that block propagation
4. Verify scaffold readiness:
   - project folder exists
   - canonical bootstrap surface exists
   - if not, stop and route to `project-bootstrap`
5. Choose the smallest propagation unit:
   - one story
   - one policy
   - one CIQ bundle
   - one spec slice
6. Propagate into the nearest downstream artifacts the repo already uses.
7. Report the trace path before calling the work complete.

## Guardrails

- Do not silently rewrite upstream contract docs. If the work needs a contract change, send it back to upstream revision.
- Preserve source IDs and trace links. Do not create fresh identifiers when canonical ones already exist.
- Prefer the smallest stable next artifact. One approved story does not justify rewriting the full backlog.
- Do not smuggle scaffold creation, package installation, or template initialization into propagation work. If the repo is not ready yet, use `project-bootstrap`.
- If the repo has Mission Control, `/admin/alignment`, intent backlog, or similar audit surfaces, use them instead of ad hoc status notes.
- Do not claim evaluator truth or `met` verdicts unless the repo's actual evaluator surface produced them.
