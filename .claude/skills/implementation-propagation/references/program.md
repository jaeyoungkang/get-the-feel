# Implementation Propagation Program

## Goal

Move from approved contract to executable downstream artifacts without semantic drift.

The core sequence is:

1. lock source contract
2. confirm scaffold readiness
3. pick the smallest approved unit
4. map downstream targets
5. propagate
6. expose trace path and blocker state

Do not collapse this into "read docs -> code whatever seems useful".

---

## Authority Boundary

This skill operates in the `Agent-owned propagation` layer.

- Human owns approval and normative change
- Agent owns translation and propagation
- Evaluator owns verdict
- System owns enforcement and release gates

If the work requires a new top-level promise, a new policy, or a changed CIQ, stop and send it back upstream.

---

## Inputs To Lock

Before changing anything downstream, identify the canonical source set.

Minimum source set:

- `PRODUCT`
- Story Chain nodes
- `feature-specs`
- `design-principles`

If the repository depends on runtime, deploy, security, or observability choices to shape implementation, include the approved engineering profile in the locked source set too.

If the repo uses additional traceability units, lock them too:

- policy IDs
- CIQ IDs
- backlog item IDs
- existing spec IDs

If any of these are missing or clearly unresolved, say so before propagating.

Also verify that implementation has a real place to land:

- project folder exists
- canonical bootstrap surface exists
- required Phase 0 or equivalent scaffold baseline is already done

If these are not true, stop and route to `project-bootstrap` instead of improvising setup work here.

---

## Modes

### Mode 1. Fresh Propagation

Use when approved contract exists but downstream implementation surfaces are still missing or skeletal.

Primary job:

- derive spec skeletons
- derive fix-plan or execution queue items
- define the first traceable path into tests and code

### Mode 2. Drift Repair

Use when downstream artifacts exist but no longer clearly follow canonical contract.

Primary job:

- compare contract vs downstream artifacts
- identify mismatch or stale propagation
- repair the smallest broken link first

### Mode 3. Evidence Closing

Use when code/spec/test already exist and the missing piece is auditability.

Primary job:

- close trace links
- attach evidence paths
- update alignment or review surfaces

---

## Propagation Order

Follow the repo's own structure if it has one. Otherwise default to this order.

1. source contract docs
2. `specs/*.spec.md` or equivalent execution spec
3. implementation queue (`fix_plan`, backlog, tasks)
4. tests or `run:shell` checks
5. code targets
6. alignment / mission control / review evidence

Do not skip from contract docs straight to code if the repo clearly uses specs or queues as an intermediate layer.

---

## Smallest Safe Unit

Prefer one stable unit at a time:

- one story and its ACs
- one policy cluster
- one CIQ bundle
- one spec file

Bad pattern:

- "The docs are approved, so I rewrote ten specs and half the app."

Good pattern:

- "US-X is approved, so I derived `specs/x.spec.md`, one queue item, and the minimum evidence path."

---

## Output Shape

After a meaningful propagation step, summarize in this order:

1. `source unit`
2. `downstream targets`
3. `trace path`
4. `blocked`
5. `needs upstream revision`
6. `next authority`

`next authority` should be one of:

- `Human`
- `Agent`
- `Evaluator`
- `System`

Do not mark `System` or `Evaluator` unless an actual gate or judge run is the real next step.

---

## Stop Conditions

Stop and escalate when:

- the approved contract is missing or contradictory
- the project scaffold does not exist yet
- the bootstrap baseline is still incomplete
- the requested change would implicitly rewrite approved intent
- the repo's canonical downstream surfaces are unclear
- the work needs evaluator truth, not agent propagation

When stopping, say exactly which upstream artifact must be revised, or that `project-bootstrap` is the real next stage.
