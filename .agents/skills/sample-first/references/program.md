# Sample-First Program

## Goal

Close example-sensitive uncertainty before bootstrap or implementation starts.

The core sequence is:

1. lock upstream inputs
2. identify the smallest set of questions that samples can answer
3. create a compact sample pack
4. classify findings as `locked`, `R&D required`, or `unresolved`
5. hand off to the right next stage

Do not reduce this to "make a few mockups".

---

## What This Stage Is For

A sample is a **representation hypothesis**. It tests how to express what the contract promised so the user experience clears its intent check — before implementation hardens the wrong representation.

The bar is not "content filled in" but "this representation passes the contract intent check". Wireframe, content, and interaction are tools that serve that verification.

The economic case: changing a representation in a sample is far cheaper than changing it after implementation. Pull representation risk forward into samples.

Iteration stop signal: the maker can self-report "this representation satisfies the contract." Until then, keep iterating on whichever layer the current blocker lives in (wireframe, content, or interaction).

Typical reasons a product is still too abstract after contract authoring and engineering profiling:

- source material shape is unclear
- artifact shape is still hypothetical
- expressive surface choices need concrete comparison
- edge cases are easy to ignore in prose but obvious in examples

This stage exists to make those questions tangible before a repo or implementation loop hardens the wrong assumptions.

---

## Modes

### Mode 1. Greenfield

Use when no sample pack exists yet.

Primary job:

- define the question set
- build the first compact sample pack
- expose what changed because of the samples

### Mode 2. Revision

Use when a sample pack exists but major assumptions changed.

Primary job:

- read the current sample pack first
- update only the stale sample set
- re-open findings invalidated by new information

### Mode 3. Handoff

Use when the sample pack answered enough to move forward.

Primary job:

- summarize what is now concrete
- state what remains intentionally open
- hand off to `project-bootstrap`, bootstrap technology selection, or `contract-authoring`

---

## What Counts As A Sample

Use only the kinds of samples that answer the current blocker.

Common kinds:

- source sample
  - real meeting, article, transcript, PDF, dataset, or media example
- artifact sample
  - example JSON, parsed record, evidence structure, or content object
- surface sample
  - low-fidelity layout, comparison board, view sketch, or navigation sketch
- edge sample
  - missing linkage, sparse data, malformed timestamps, or weak evidence
- anti-example
  - something that looks tempting but should not become the product

Do not create every kind if only one kind is necessary.

---

## Sampling Heuristics

Prefer 3-5 samples, not 20.

Each sample should earn its place by answering at least one real question.

Good sample set:

- 1 representative sample
- 1 contrast sample
- 1 edge sample
- optional candidate surface sample if presentation is the real blocker

Bad sample set:

- many near-duplicates
- visually pretty examples with no decision value
- source examples that are unrelated to the approved contract

---

## Output Shape

After a meaningful round, summarize in this order:

1. `question set`
2. `sample set`
3. `locked`
4. `R&D required`
5. `unresolved`
6. `next handoff`

If the repo or template has a canonical `docs/sample-pack.md`, write or update it instead of leaving the pack only in chat.

See [sample-pack-shape.md](sample-pack-shape.md) for the recommended artifact structure.

---

## Handoff Rules

Hand off to:

- `project-bootstrap`
  - when the sample pack makes the product concrete enough to scaffold safely
- bootstrap technology selection
  - when the samples changed architecture or operational constraints
- `contract-authoring`
  - when the samples revealed that the product promise itself is still wrong or incomplete

Do not hand off to `implementation-propagation` directly unless a real scaffold already exists.

---

## Stop Conditions

Stop and escalate when:

- the upstream contract is still too unstable
- the sample questions are vague and not decision-linked
- the team is really asking for implementation, not examples
- no canonical sample artifact path exists and the repo/template choice itself is still unsettled

When stopping, say exactly which decision must move upstream before more samples are worth making.
