---
name: project-bootstrap
description: Create or complete the initial project scaffold after approved contract docs and engineering profile exist but before implementation propagation begins. Use when there is no project folder yet, no canonical bootstrap baseline, or package installation and template setup should be handled through a repo bootstrap flow such as `init-project.sh` and `docs/BOOTSTRAP.md`.
compatibility: Designed for Claude Code and OpenAI Codex. Works best with templates that expose a canonical scaffold entrypoint and a bootstrap checklist such as `fix_plan.md` or `docs/BOOTSTRAP.md`.
---

# Goal

Turn approved upstream docs into a real repository scaffold that is safe for downstream implementation work.

This is a scaffold/bootstrap skill, not a planning skill and not a feature implementation skill.

- Primary job: create or complete the canonical project scaffold
- Secondary job: make bootstrap readiness explicit before implementation starts
- Not this skill's job: redefine contract, pick random defaults, or jump straight into product feature code

## When To Use

- Contract docs and engineering profile are approved, but there is no project folder yet
- A project folder exists, but the canonical bootstrap baseline is still missing
- A template like `agentic-base` should be instantiated before specs or code work begin
- Someone is trying to use `implementation-propagation` before scaffold/package/bootstrap setup exists

## Workflow

1. Read [references/program.md](references/program.md).
2. If needed, read [references/bootstrap-surfaces.md](references/bootstrap-surfaces.md).
3. Lock the upstream input set first:
   - approved contract docs
   - approved engineering profile
   - approved sample pack when one exists or is required
   - target project name or repo location
   - canonical template or bootstrap entrypoint
4. Choose the current mode:
   - `greenfield`
   - `completion`
   - `handoff`
5. Use the repo's canonical bootstrap surface instead of ad hoc setup.
6. Report scaffold readiness before handing off to `implementation-propagation`.

## Guardrails

- Do not treat package installation as incidental prework hidden inside implementation. Bootstrap is its own stage.
- Do not invent a new scaffold path if the template already exposes `init-project.sh`, `docs/BOOTSTRAP.md`, `fix_plan.md`, or equivalent canonical entrypoints.
- Do not rewrite approved contract docs during bootstrap. If the scaffold reveals a contract gap, send it back upstream.
- Do not ignore a required sample pack. If material example-sensitive gaps remain, go back to `sample-first` before treating the repo as bootstrap-ready.
- Do not start feature code just because the repo now exists. Stop at scaffold readiness unless the user explicitly asks for the next stage.
- If the project folder already exists, prefer finishing its canonical bootstrap path over creating a second repo.
