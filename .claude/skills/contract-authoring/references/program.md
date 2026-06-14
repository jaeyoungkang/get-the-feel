# Contract Authoring Program

## Goal

Convert a loose product idea into a small set of approved contract documents that can safely drive downstream specs and implementation.

The core sequence is:

1. interview
2. structure
3. approve
4. draft documents
5. hand off to implementation

Do not reorder this into "idea -> code".
Do not treat source grounding as a license to drift into implementation work. Real sources are inputs to contract quality, not substitutes for downstream propagation.

---

## Modes

### Mode 1. Greenfield

Use when the user has a rough idea and little or no existing contract documentation.

Primary job:

- discover intent
- stabilize `PRODUCT`
- draft the first contract package

### Mode 2. Revision

Use when drafts or partial docs already exist.

Primary job:

- read existing docs first
- identify approved vs stale vs missing parts
- revise only what the user is changing
- re-open any upstream artifact invalidated by the new change

### Mode 3. Handoff

Use when upstream docs are approved and the next step is to prepare downstream implementation inputs.

Primary job:

- derive spec skeletons
- derive fix plan items
- surface any unresolved blockers before implementation starts

At the start of each round, know which mode you are in and say it implicitly or explicitly through the next action.

### When to switch modes

- Switch from `greenfield` to `revision` when a new feature or policy materially changes already-drafted artifacts.
- Stay in `revision` until the affected upstream artifacts are stable again.
- Switch to `handoff` only after upstream docs are explicitly approved.

---

## Default Output Package

If the repository already has target templates, use them. If not, produce the package below in this order.

1. `PRODUCT`
2. `Story Chain nodes`
3. `docs/contracts/feature-specs.md`
4. `design-principles`

The package can be partial. If only `PRODUCT` is stable, stop there and surface unresolved questions before drafting the next layer.

---

## Interview Method

### Round size

Ask 1-3 high-signal questions per round. Never dump the full information architecture as a giant checklist.

Each round should do exactly one of these:

1. remove a blocker
2. stabilize the current artifact
3. win approval for a drafted artifact

If a question does not do one of those, do not ask it yet.

### Question priority

Ask in this order unless the user already answered it:

1. problem and why now
2. target user and context
3. non-goals / refusal signals
4. value axes
5. critical user outcome
6. hard constraints
7. candidate MVP scope

### Good questions

- "이 제품이 아니면 해결 안 되는 문제가 뭐냐"
- "누가 언제 이걸 쓰는지 한 장면으로 말해봐"
- "절대 만들고 싶지 않은 형태가 뭐냐"
- "기본 성공 상태를 한 문장으로 말하면 뭐냐"
- "지금 당장 안 풀리면 구현 에이전트가 멋대로 정할 위험이 큰 공백이 뭐냐"

### Bad questions

- implementation-first questions before the product contract exists
- exhaustive taxonomy questions in round one
- questions the agent can infer from existing answers
- questions that ignore a user-provided real source when the source is supposed to shape the product contract

### Round output shape

After every meaningful round, summarize in this order:

1. `approved`
2. `ambiguous`
3. `blocked`
4. `unresolved`
5. `next artifact`
6. `next question(s)`

`blocked` is for items that stop drafting the next artifact right now.

---

## Working State Model

Keep an explicit mental ledger with four buckets:

- `approved`
- `ambiguous`
- `blocked`
- `unresolved`

After each interview round, summarize the current state in those buckets before asking the next questions or drafting docs.

### Approved

Information the user has clearly affirmed.

### Ambiguous

Information that has a direction but is still underspecified or internally inconsistent.

### Blocked

Information gaps that stop the next artifact from being drafted responsibly.

### Unresolved

Questions that materially affect downstream docs and must not be silently invented.

### Source-locked facts

When the user provides an actual source artifact such as a URL, meeting, PDF, transcript, or dataset, lock these facts early:

- source title
- source date
- source owner or publisher
- usable structure markers such as timestamps, sections, or tables

Do not continue with stale assumptions once a real source overrides them.

---

## Drafting Rules

### PRODUCT

Draft this first. It should stabilize:

- one-line identity
- why
- target
- value axes
- non-goals
- constraints
- high-level user flow
- out-of-scope

If these are not stable, do not draft `Story Chain nodes` yet. See [artifact-gates.md](artifact-gates.md) if you need the explicit gate.

### Story Chain nodes

Only draft after `PRODUCT` is mostly approved.

Structure:

- Themes
- Epics
- User Stories
- Acceptance Criteria
- Policies if they are clearly cross-cutting

Prefer a thin MVP set. Do not create a bloated backlog just because the user has many ideas.

### feature-specs

Only draft after at least some user stories are stable.

Structure:

- mapping from user story to scenario bundle
- Given / When / Then scenarios
- validation hints
- top-level data model if needed
- implementation order by dependency

If the product is explicitly source-backed, feature specs should anchor at least one scenario to a real source example before handoff when feasible.

### design-principles

Only draft principles that are durable enough to survive implementation detail churn.

Good principles:

- source-first
- mobile-first
- verifiability
- personalization-as-option
- domain-specific reading or interaction rules

Bad principles:

- arbitrary hex colors
- library choices that are not identity-level
- temporary layout details

---

## Approval Protocol

Before presenting a document as "ready", explicitly separate:

- what looks approved
- what needs confirmation
- what remains unresolved

Use direct approval language such as:

- "이 상태로 PRODUCT 초안 내려도 되나"
- "이 둘 중 어느 방향이 맞나"
- "이건 unresolved로 남기고 다음 문서로 넘어갈지"
- "승인 / 보류 / 폐기 중 뭐로 둘지"

Do not treat user silence as approval.

---

## Handoff Rule

Once the contract package is approved, the next downstream step can be one of:

- draft `specs/*.spec.md` skeletons
- draft `fix_plan` items
- start implementation work in another workflow
- promote draft docs into canonical docs

But not before approval. The contract-authoring workflow ends when upstream intent is stable enough to hand off.

---

## File Writing Guidance

If the user wants actual files:

1. find existing templates first
2. draft into those files
3. keep unresolved items visible instead of hiding them
4. if the repo uses draft paths first, treat canonical promotion as a separate step

If the user wants discussion only:

1. keep outputs in chat
2. still organize them as contract artifacts

---

## Final Deliverable Shape

When you finish a round or a package, prefer this summary order:

1. current approved contract
2. blocked items
3. unresolved items
4. drafted artifacts
5. next approval decision

This keeps the user in the role of approver rather than manual document writer.

If canonical promotion happened, also say:

6. which canonical files were updated
