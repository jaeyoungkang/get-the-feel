# Project Bootstrap Program

## Goal

Bridge approved upstream docs into a real repository scaffold before implementation-propagation starts.

The core sequence is:

1. lock approved upstream inputs
2. identify the canonical bootstrap entrypoint
3. create or complete the project scaffold
4. verify bootstrap readiness
5. hand off to `implementation-propagation`

Do not reduce this to "run npm install somewhere".

---

## What Bootstrap Means

Bootstrap is the stage where a project stops being an idea package and becomes a real repository with a canonical execution surface.

Typical bootstrap work includes:

- project folder creation
- template instantiation
- initial package installation
- protected bootstrap scripts or docs
- Phase 0 scaffold checks
- readiness to accept downstream specs, plans, and code

This stage exists because implementation-propagation needs a stable landing surface.

---

## Modes

### Mode 1. Greenfield

Use when there is no project folder yet.

Primary job:

- choose the canonical template or init entrypoint
- create the repository
- confirm bootstrap docs and queue surfaces exist

### Mode 2. Completion

Use when the repo exists but bootstrap is not done.

Primary job:

- read the repo's bootstrap contract first
- finish or verify the minimum scaffold baseline
- expose anything still blocking implementation

### Mode 3. Handoff

Use when the scaffold exists and the next step is downstream implementation propagation.

Primary job:

- summarize scaffold readiness
- point to the canonical next surfaces
- hand off to `implementation-propagation`

---

## Inputs To Lock

Before bootstrap work, lock these inputs:

- approved contract docs
- approved engineering profile
- approved sample pack when one exists or the prior stage marked it required
- target project name or repo path
- canonical bootstrap source

If the user did not name a template but the organization clearly uses one, prefer that canonical template instead of inventing a new scaffold.

If the repo already exists, read its actual bootstrap docs before assuming what remains.

---

## Bootstrap Order

Follow the repo's own structure if it has one. Otherwise default to this order.

1. approved contract docs
2. approved engineering profile
3. sample pack when the project still needs concrete representative examples before scaffold or implementation
4. project scaffold creation
5. bootstrap docs or Phase 0 checklist
6. package/runtime installation and baseline verification
7. handoff into `implementation-propagation`

Do not jump from approved docs straight to implementation specs if steps 3-5 are still missing.

---

## Readiness Floor

Do not call bootstrap complete until these are mostly true:

1. the target project folder exists
2. canonical guide files exist
3. canonical bootstrap or Phase 0 path is identified
4. package/runtime baseline is installed or intentionally queued by the repo's bootstrap contract
5. the repo is ready for downstream spec and code work without inventing new setup rules

If the template exposes a stronger definition of readiness, use that instead of this generic list.

---

## Output Shape

After a meaningful bootstrap step, summarize in this order:

1. `target scaffold`
2. `bootstrap source`
3. `readiness status`
4. `blocked`
5. `next surface`
6. `next authority`

`next surface` should name the actual file or checklist the next stage should touch.

---

## Stop Conditions

Stop and escalate when:

- approved contract docs are still too unstable
- the engineering profile is missing for decisions that shape scaffold structure
- a required sample pack is still missing for example-sensitive product or surface questions
- project naming or location ambiguity would create the wrong repo
- the template's canonical bootstrap entrypoint is unclear
- the user is actually asking for feature work, not bootstrap

When stopping, say exactly which input is missing or which canonical bootstrap surface must be clarified.
