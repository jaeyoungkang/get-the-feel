---
name: mission-control
description: "Light House Mission Control workflow for current Story Chain work. Use for Mission Control / MC board / Story Chain work; Promise, 약속, contract, 계약, Experience, Moment, 모먼트, Intent Check, 의도, Acceptance Check, AC, Aspect, 횡단, 종단, Evidence Ledger additions, changes, retirements, splits, merges, reviews, duplicate concept work, UI intent, intent traceability, rendered DOM evidence, live judge, UI quality tied to a Promise, runtime-flow/runtime ordering/fallback/execution-policy/respond boundary changes, analytics/event collection, 이벤트 수집, 이벤트 계약, canonical event, events.yaml, trackCanonicalEvent, mc:event-impact, and Story Chain validation. Treats docs/contracts/story-chain/concepts.md as concept authority and validates with current Story Chain and surface gates."
---

# Mission Control Skill

Mission Control is the operating workflow for Light House's current Story
Chain. It reads and writes only the canonical Story Chain and current product
contract files:

- `docs/contracts/story-chain/experiences/`
- `docs/contracts/story-chain/moments/`
- `docs/contracts/story-chain/promises/`
- `docs/contracts/story-chain/aspects/`
- `docs/contracts/story-chain/evidence-ledgers/` (current path for Evidence Ledgers)
- `docs/contracts/story-chain/concepts.md`
- `docs/contracts/story-chain/traceability-cardinality.json`
- `docs/contracts/story-chain/deferred-verification-triggers.md`
- `docs/contracts/story-chain/scenario-catalog.md`
- `docs/mission-control.md`
- `docs/runtime-flows/` when runtime ordering, fallback order, programmatic
  inspect/respond boundaries, persistence/sync ownership, or debugging signals
  change

The old history ledgers were retired after the Story Chain reset. Do not create
or update external backlog, judgment, or reality-feedback markdown ledgers.
Snapshot state is derived from Story Chain and Evidence Ledger coverage.

Activate this skill whenever the user message contains Story Chain contract
vocabulary such as "약속", "promise", "계약", "contract", "의도", "모먼트",
"AC", "횡단", or "종단", even if the user does not explicitly say
"Mission Control" or "mc". Also activate it for:

- UI intent/quality terms such as "intent traceability", "rendered DOM",
  "live judge", or UI quality changes tied to a Promise;
- runtime-flow terms such as runtime ordering, fallback order,
  execution-policy, respond boundary, persistence, sync ownership, or debugging
  signals;
- analytics/event-collection contract vocabulary such as "이벤트 수집",
  "이벤트 계약", "analytics", "canonical event", "events.yaml",
  "trackCanonicalEvent", "Amplitude", or "event-impact".

Product-facing behavior instrumentation and runtime ordering both close through
Story Chain coverage when they affect user-visible behavior.

## Vocabulary

Use `docs/contracts/story-chain/concepts.md` as the vocabulary authority for
Story Chain concept boundaries, responsibility boundaries, Evidence Ledger
meaning, and review order.
Do not duplicate the full concept model in skill output or new docs; link or
point back to `concepts.md` unless the task is specifically to edit that file.
Use current terms in all new work:

| Current                                    | Operational note                                                    |
| ------------------------------------------ | ------------------------------------------------------------------- |
| Experience                                 | Human-approved durable experience boundary                          |
| Moment                                     | Human-approved workflow moment where Promises fire                  |
| Promise                                    | Human-approved terminal user/operator promise                       |
| Intent Check                               | Qualitative live-judge question                                     |
| Acceptance Check                           | Deterministic contract                                              |
| Aspect                                     | Constraint on how a Moment is realized through Promises             |
| Evidence Ledger                            | Executable evidence ledger for the Promise under Aspect constraints |
| `// @promise` / `// @aspect` / `// @check` | Surface trace tags                                                  |

Current storage and tooling names are canonical: `Evidence Ledger`,
`docs/contracts/story-chain/evidence-ledgers/*.ledger.md`, and
`npm run evidence-ledger`. The rename record at
`docs/contracts/story-chain/evidence-ledger-rename-record.md` is historical
documentation, not an open migration plan.

Responsibility model summary:

- Human owns Experience, Moment, Promise existence/meaning, and new Aspect
  meaning.
- Agent may draft wording, but only propagates and implements after Human
  meaning is explicit.
- Agent owns Evidence Ledger propagation, code/tests, and surface tags for
  approved Promises under applied Aspect constraints.
- Evaluator owns deterministic check and live-judge execution.
- System owns CI and release blocking gates.

When reviewing Story Chain content, use this order:

1. Experience — is the durable experience boundary correct?
2. Moment — is the workflow moment narrower than the Experience and broader
   than one Promise?
3. Aspect — is the cross-cutting rule strict enough and backed by a covering
   Evidence Ledger?
4. Promise — is the vertical promise and its Acceptance Check set correct?
5. Evidence Ledger — does the executable evidence close the declaration?

Dated audit entries may quote older `historical` refs when preserving past
decisions. New Story Chain prose and guidance should use canonical refs.

## Boundaries

- **Always** run `npm run mc:status` or `npm run mc:next -- --authority A/E`
  before choosing Mission Control work.
- **Always** keep the approved Promise, applied Aspect constraints, covering
  Evidence Ledger, code/tests, and surface tags synchronized in the same change.
- **Always** when user-facing behavior, `// @promise` surfaces, Promise meaning,
  or Acceptance Checks change, run `npm run mc:event-impact` and update
  analytics coverage with `npm run mc:event-impact -- --sync` when missing,
  stale, or moved event contract entries need to be added, removed, or updated.
  Use `npm run mc:event-impact -- --update` only when the generated coverage
  inventory is stale but `events.yaml` itself is already correct. If the changed
  behavior creates or changes a user action, committed document state, failure
  state, or operator-observable reality signal, refine `docs/analytics/events.yaml`
  and the emitting `track(...)` / canonical analytics bridge in the same change.
  Name product events by observable behavior, not Promise names or implementation
  states: use `<owner>.<object>.<past_tense_action>` with action verbs such as
  `clicked`, `viewed`, `submitted`, `queued`, or `failed`. Keep the Promise
  relationship machine-verifiable in `storyRefs.promiseRef`; do not encode it
  only in the event name.
- **Always** when a change alters runtime ordering, fallback order,
  programmatic inspect/respond boundaries, persistence/sync ownership, or
  debugging signals, inspect `docs/runtime-flows/README.md` and update the
  relevant `docs/runtime-flows/*` document in the same change.
- **Always** write Evidence Ledger Acceptance Checks as the
  `> check:evidence-coverage` table, with every table row also prefixed by
  `>` so Markdown renders the table correctly; list/object blocks are invalid.
- **Always** name newly created or meaning-changed Acceptance Checks with a
  semantic kebab-case slug, not a positional `ac1` / `ac2` suffix. Follow
  `promise:alignment-coherence-gate#acceptance-check:alignment-coherence-gate-ac-slug-rule`:
  the slug should name the assertion axis, be unique within the Promise, stay
  short (≤ 4 words / ≤ 30 chars after the Promise prefix), and avoid encoding
  brittle values (`cap-block` is acceptable; `initial-ten` is not). Existing
  numeric AC ids may remain only when their meaning is unchanged.
- **Always** when adding scenario catalog entries, choose a semantic
  kebab-case `scenario:<slug>` that names the user/runtime situation or
  transition, for example `scenario:search-provider-failure-degraded`.
  Existing numeric journey-style ids such as `scenario:presence-01-01-03` may
  remain as historical refs; new entries should read like stable concept names,
  not coordinates in a sequence.
- **Always** decompose an Acceptance Check into the runtime invariants needed to
  make the user-visible behavior true. If a rendered state depends on generated
  payload, persisted snapshot shape, branch selection, or another upstream key,
  add evidence for that dependency; fixture-only UI evidence does not close the
  contract by itself.
- **Always** when an Acceptance Check body promises parity between two
  surfaces — two sources feeding the same builder, a fallback that mirrors a
  primary path, a refactor that should keep output shape — name the parity
  invariant in the AC body and lock it with fixture-based evidence (a single
  test that runs both surfaces against the same logical scenario and asserts
  a comparable output metric) or with an Intent Check (live judge) when the
  parity claim is qualitative. Per-path deterministic helper tests passing
  individually do not lock parity; they each test a single context, not the
  shared output. Follow `references/quality-parity-evidence.md`. Extend the
  existing simulation surface (`s2-fetch` mock, inline-analysis fixture,
  gap-network test seam) when the parity test needs a mock provider response,
  instead of inventing a one-off mocking style.
- **Always** before closeout, run a role-separated review for Story Chain work
  that changes context preservation, recovery, history, previous-state
  snapshots, workspace/document lifecycle, analytics event contracts, AC
  rename/retire, Sufficiency Review entries, or new Aspect/Skill policy. When
  the active host and user authorization allow subagents, delegate the review to
  non-writing reviewers with explicit roles. Otherwise perform the same review
  locally and report the role names. Use at least:
  - `lifecycle reviewer` for store, hydration, workspace switch, id reuse,
    deletion, stale snapshot, invalid restore, and post-restore cleanup.
  - `contract-history reviewer` for Promise/Aspect/AC weaving, Evidence Ledger
    coverage, analytics refs, and dated Sufficiency Review integrity.
  - For analytics event contract changes, include the runtime reviewer question:
    do all user-visible emit paths preserve the same analytics context, pass
    through the canonical/legacy bridge expected by the contract, and fire
    before navigation, focus, early return, or other lifecycle exits can skip
    tracking?
- **Always** read `docs/contracts/story-chain/concepts.md` before reviewing or
  changing Experience, Moment, Promise, Aspect, or Evidence Ledger meaning.
- **Always** when authoring or editing Human-authority prose (Experience,
  Moment, Promise, Aspect) under `docs/contracts/story-chain/`, follow the
  per-node 본문 작성 기준 in `concepts.md` where defined (e.g. Subject &
  situation, What happens, Boundary for Experience). Prose must describe what
  the node actually means and how the product behaves there, not act as a
  scope tag or routing label. For Korean prose style rules across all
  Human-authority docs, plus the current post-hoc authoring exception (active
  at Experience level — upper prose is faithfully reconstructed from
  already-declared lower nodes rather than driving them), follow
  `references/human-authority-prose.md`.
- **Always** validate with `npm run mc:validate-story-chain`,
  `npm run mc:audit-surface`, and `npm run mc:audit-story-surface` before
  closeout.
- **Ask first** before changing `docs/mission-control.md`, contract policy,
  execution policy, tool surface, `respond` format, or adding a new
  runtime-flow document.
- **Never** bypass gates, add disable comments to hide validation, or validate
  Intent Check behavior through simulation wrappers. Live judges must evaluate
  actual runtime `respond` tool-call output or actual rendered DOM.

## 4 Authority Model

| Chip | Authority | Agent advance? | Role                                                   |
| ---- | --------- | -------------- | ------------------------------------------------------ |
| H    | Human     | No             | Normative approval and product interpretation          |
| A    | Agent     | Yes            | Propagation, implementation, and semantic preservation |
| E    | Evaluator | Yes            | Live judge or deterministic truth signal execution     |
| S    | System    | No             | CI/release gates and constraints                       |

Agents stop on H/S work. Agents may advance A/E work when the next action is
fully determined by current contracts.

## Workflow

1. Inspect status:
   - `npm run mc:status`
   - `npm run mc:next -- --authority A --json`
   - `npm run mc:next -- --authority E --json`
2. Pick one A/E item and inspect its Promise, covering Evidence Ledger, tests, and
   tagged surface files.
   - Use `npm run mc:trace-ledger -- --ledger <name-or-path>` to follow the
     covering Evidence Ledger into `run:shell` commands, execution targets, and
     imported `app/` code before manual searching.
3. Apply the smallest chain-closing change:
   - Promise declaration or cleanup under `docs/contracts/story-chain/promises/`
   - Evidence Ledger propagation under
     `docs/contracts/story-chain/evidence-ledgers/`, including
     `check:evidence-coverage` rows for Acceptance Checks
   - deterministic test / live judge / implementation updates under `app/`
   - analytics event contract updates under `docs/analytics/events.yaml`,
     `track(...)` emission updates, and `npm run mc:event-impact -- --sync`
     when user-facing behavior changes observable product actions or states
   - runtime procedure docs under `docs/runtime-flows/` when ordering,
     fallback, programmatic inspect/respond, or sync ownership changes
   - surface tags with `// @promise`, plus `// @aspect` or `// @check` when
     relevant
4. Run targeted tests for the touched contract.
5. Run the role-separated review when a trigger from Boundaries applies.
   - Keep review agents read-only unless the work has been explicitly split
     into disjoint write scopes.
   - Apply concrete findings before the final gate pass.
   - If no subagent can be used, record the local reviewer roles in the final
     response.
6. Run gates:
   - `npm run mc:validate-story-chain`
   - `npm run mc:validate-events`
   - `npm run mc:event-impact`
   - `npm run mc:audit-surface`
   - `npm run mc:audit-story-surface`
   - plus `npm run typecheck`, `npm run test:unit`, and `npm run format:check`
     when code or broad docs changed.

## Companion Skills

Mission Control remains the parent workflow. Load these repo-local companion
skills only after Mission Control has established the Story Chain scope:

- `story-chain-contract-steward` — when adding, changing, splitting, merging,
  retiring, or reviewing a `promise:*` declaration, `acceptance-check:*` ref,
  Evidence Ledger coverage row, AC revision, `run:shell` evidence, Sufficiency
  Review entry, scenario ref, or `// @promise` / `// @check` tag.
- `aspect-steward` — when adding, changing, reviewing, retiring, or repairing
  an `aspect:*` declaration, pointcut, covering ledger weaving, or Aspect
  verdict.

Do not use companion skills as an alternate route around Mission Control gates;
they narrow a subtask after the Promise/Aspect/Authority boundary is known.

## Work Modes

- **Forward work**: after Human approval of Promise meaning, propagate the
  Promise under applied Aspect constraints into Evidence Ledger evidence,
  code/tests, and surface tags.
- **Modification work**: keep an existing Promise alive while changing prose,
  Intent Checks, Acceptance Checks, parent refs, or split/merge shape. Use
  `references/promise-modification.md`.
- **Concept adjustment work**: when alignment audit surfaces
  `duplicate_high_level_concept` or a human reports overlapping Experience /
  Moment concepts, first decide the semantic operation (merge, split, rename,
  or retire) under Human authority, then propagate parent refs, Evidence Ledger
  coverage, and surface tags. Use `references/concept-adjustment.md`.
- **Retirement work**: remove a Promise or user-facing feature after Human
  approval. Use `references/promise-retirement.md`.
- **Cross-impact pre-check**: before changing any existing Promise, inspect
  sibling Promises, shared Evidence Ledgers, Aspect pointcuts, feature specs, code
  surfaces, and shared tests. Use `references/cross-impact-check.md`.
- **Content review work**: when a human reviews Experiences, Moments, Aspects,
  or Promises by meaning, keep `docs/contracts/story-chain/concepts.md` open
  and apply the review order above. Agents may propose wording, but may only
  propagate wording and evidence after the human decision is explicit.
- **Role-separated review work**: before finalizing risky Story Chain changes,
  separate implementation from review. Ask lifecycle reviewers to find
  cross-workspace, hydration, stale-state, and cleanup failures. Ask
  contract-history reviewers to find stale refs, false dated verdicts, missing
  reciprocal weaving, and analytics coverage drift.
- **Deferred verification work**: adapter protocol and Alloy-style model
  checking stay deferred until the thresholds in
  `docs/contracts/story-chain/deferred-verification-triggers.md` are reached.

## References

- `references/workflows.md` — current A/E workflow details.
- `references/cross-impact-check.md` — current Story Chain impact scan before
  changing existing Promises.
- `references/concept-adjustment.md` — Experience/Moment duplicate concept
  adjustment workflow.
- `references/promise-modification.md` — live Promise modification workflow.
- `references/promise-retirement.md` — Promise/feature retirement workflow.
- `references/live-judge-authoring.md` — live judge authoring contract.
- `references/sufficiency-review-live-judge-stamp.md` — Sufficiency Review stamp.
- `references/aspect-graduation.md` — current Aspect authoring rules.
- `references/abstraction-reduction-triage.md` — abstraction-first fix triage.
- `references/human-authority-prose.md` — Korean prose style rules for
  Human-authority docs (Experience/Moment/Promise/Aspect) plus the current
  post-hoc authoring exception.
- `references/quality-parity-evidence.md` — locking quality parity between
  two surfaces that share a builder, fallback, or refactor — with fixture or
  Intent Check evidence, plus simulation/fixture extension guidance.
