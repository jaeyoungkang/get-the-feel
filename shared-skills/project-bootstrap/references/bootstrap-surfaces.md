# Bootstrap Surfaces

Use this file when a repository already has a recognizable scaffold or template flow and bootstrap should attach to that surface instead of improvising setup.

## Goal

Map approved upstream docs to the canonical bootstrap entrypoints the project or template already treats as real.

## Agentic-base Shape

Typical upstream inputs:

- `docs/PRODUCT.md`
- `docs/PRODUCT.md`
- `docs/contracts/feature-specs.md`
- `docs/contracts/story-chain/`
- `docs/design-principles.md`
- `docs/engineering-profile.md`
- `docs/sample-pack.md` when sample-first was used

Canonical bootstrap entrypoints:

- `bash agentic-base/init-project.sh <project-name>`
- project `AGENTS.md`
- `docs/BOOTSTRAP.md`
- `fix_plan.md` Phase 0

Typical bootstrap outputs:

- real project repository
- Phase 0 baseline or clearly identified next bootstrap item
- a scaffold that `implementation-propagation` can safely target

Recommended use:

- instantiate the repo through `init-project.sh`
- treat `docs/BOOTSTRAP.md` and `fix_plan.md` as the canonical bootstrap contract
- carry `docs/sample-pack.md` into the new repo when the upstream stage produced one
- keep package installation and scaffold setup here instead of hiding them inside implementation work

## Generic Shape

If a repo already exists, look for:

- scaffold scripts
- setup docs
- bootstrap or install checklists
- protected hook files
- Phase 0 or equivalent queue items

Do not create a second bootstrap process if the repo already has one.

## Handoff Heuristic

`implementation-propagation` should begin only after:

- a real repo exists
- canonical bootstrap surfaces are in place
- the next downstream landing surface is explicit

If any of those are false, stay in `project-bootstrap`.
If the repo is real but the sample-dependent product questions are still abstract, route back to `sample-first` instead of forcing downstream propagation.
