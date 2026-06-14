# Engineering Profile Program

## Goal

Close the engineering decisions that sit between approved product contract and safe implementation.

The core sequence is:

1. lock upstream contract
2. identify blocking engineering dimensions
3. classify each major decision as `locked`, `R&D required`, or `unresolved`
4. approve the minimum viable engineering profile
5. hand that profile to downstream implementation work

Do not reduce this to "pick a framework and start coding".

---

## What This Profile Is For

Business logic alone does not determine implementation shape.

Before code starts, many projects still need stable answers for:

- where it runs
- how it is deployed
- what data exists and where it lives
- what security and privacy promises are required
- how failures are observed
- what release and rollback discipline exists
- what cost or vendor ceilings apply

This skill exists to close those questions early enough that implementation is not forced to invent them ad hoc.

It also exists to prevent false certainty. Some dimensions should be locked now, some should be marked as R&D, and some should remain unresolved until the product or operating model is clearer.

---

## Modes

### Mode 1. Greenfield

Use when the product contract is mostly stable but no engineering profile exists yet.

Primary job:

- ask the smallest set of engineering questions that actually block implementation
- produce the first approved engineering profile

### Mode 2. Revision

Use when an engineering profile exists but product or operational assumptions changed.

Primary job:

- read the current profile first
- revise only the sections invalidated by new information
- mark downstream implementation as stale when necessary

### Mode 3. Handoff

Use when the engineering profile is approved and the next step is downstream propagation.

Primary job:

- state which dimensions are now locked
- state what remains intentionally unresolved
- hand off to `implementation-propagation`

---

## Interview Method

Ask only what materially changes implementation shape.

Good example:

- "이 제품은 정적 배포가 가능한가, 아니면 서버 런타임이 필요한가"
- "사용자 데이터가 있나, 있으면 어디까지 저장하고 얼마 동안 보관하나"
- "익명 서비스인가, 로그인/권한 경계가 필요한가"
- "문제가 생겼을 때 어디서 먼저 감지해야 하나"
- "시각화가 제품의 핵심이면, 어떤 라이브러리를 쓸지보다 어떤 시각적 읽기 방식과 상호작용이 필요한지 먼저 닫아야 하나"

Bad example:

- asking every possible platform question regardless of scope
- library trivia before runtime or data shape is locked
- performance tuning questions before the base deploy model exists
- locking `d3`, `three.js`, or a chart library before the visualization surface itself is defined when visualization is a product-defining feature

Keep rounds small:

- 1-3 high-signal questions
- or a proposed section draft with approval commands

## Focused Deep Dive Trigger

If a product characteristic is not just cosmetic but technically consequential, stop broad profiling and run a focused deep dive on that surface first.

Examples:

- visualization is central to product identity
- collaboration or multi-user behavior changes data and auth boundaries
- AI generation or judging changes runtime, cost, and governance
- freshness or pipeline latency changes deploy and storage shape
- editorial workflow changes authoring, review, and release process

In that case:

1. name the characteristic explicitly
2. explain why it changes engineering shape
3. ask 1-3 rounds only about that surface
4. lock a surface profile before choosing framework, library, or vendor details

The goal is not "more discussion" in general. The goal is deeper discussion exactly where product identity and technical shape are coupled.

## R&D Required State

Not every consequential dimension can or should be locked during profiling.

Use `R&D required` when:

- the product characteristic is real and important
- it materially changes implementation shape
- shallow defaults would be misleading
- but the team still needs experiments, prototypes, or comparative trials before locking it

Examples:

- visualization grammar
- movement or navigation model
- advanced collaboration behavior
- AI provider or evaluation strategy when quality is not yet understood

When the right next step is not more prose but concrete representative examples, comparison samples, or surface sketches, hand off to `sample-first` instead of leaving the repo trapped in abstract R&D.

`R&D required` is not the same as `unresolved`.

- `R&D required` means "we know this needs structured exploration"
- `unresolved` means "the question remains open but is not yet framed as a dedicated experiment track"

Do not hide R&D as ordinary ambiguity.

---

## Minimum Stable Sections

Do not treat the engineering profile as stable until these are mostly answered:

1. runtime and stack shape
2. deployment topology
3. data/storage profile
4. security/privacy baseline
5. observability and analytics baseline
6. quality gates and release policy

Additional sections become required only when the product needs them.

If a surface is product-defining, add a surface profile before finalizing library choices.
Examples:

- visualization profile
- editorial authoring profile
- AI control-plane profile
- collaboration profile

Do not let these profiles collapse into one-line answers when they materially shape the implementation path.

See [profile-dimensions.md](profile-dimensions.md) for the full dimension catalog.

---

## Output Shape

After a meaningful round, summarize in this order:

1. `locked`
2. `ambiguous`
3. `blocked`
4. `R&D required`
5. `unresolved`
6. `next downstream impact`

`next downstream impact` should say what this profile now enables:

- sample-pack creation
- spec drafting
- fix-plan generation
- concrete implementation
- deploy preparation

If the repository has or needs a canonical profile document, write or update it instead of leaving the result only in chat.

Recommended section shape:

1. purpose and relation to product contract
2. locked now
3. R&D required
4. unresolved
5. downstream implications
6. revision triggers

---

## Stop Conditions

Stop and escalate when:

- the upstream product contract is too unstable
- the missing decision is actually a product promise, not an engineering profile choice
- the repo's canonical engineering doc path is unclear
- implementation pressure is forcing fake certainty where real risk remains

When fake certainty is the main risk, classify the decision as `R&D required` instead of forcing a lock.
When structured examples would resolve the uncertainty better than another interview round, hand off to `sample-first`.
