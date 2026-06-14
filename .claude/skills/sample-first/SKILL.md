---
name: sample-first
description: Create a concrete sample pack before bootstrap or implementation when initial intent and Story Chain candidates need representative examples, counterexamples, or candidate surfaces to close consequential decisions. Use when real samples should validate product shape, artifact shape, or expressive surfaces before technology selection and project bootstrap begin.
compatibility: Designed for Claude Code and OpenAI Codex. Works best after initial intent and Story Chain candidates exist.
---

# Goal

Turn approved upstream thinking into a small sample pack that makes important decisions concrete before scaffold or implementation work begins.

This is a pre-implementation validation skill.

- Primary job: build a minimal but useful sample pack
- Secondary job: turn sample findings into `locked`, `R&D required`, and `unresolved`
- Not this skill's job: bootstrap a repo, write feature code, or silently rewrite the product contract

## Core Premise

A sample is a **representation hypothesis** — a fast test of how to express what the contract promised so the user experience clears its intent check.

- The bar is not "content filled in" but "this representation passes the contract intent check". Wireframe, content, and interaction are tools that serve that verification.
- Use the cost gap. Changing a representation in a sample is far cheaper than changing it after implementation. Pull representation risk forward into samples instead of letting it harden in code.
- Stop signal. Iteration ends when the maker can self-report: "this representation satisfies the contract." Until then, keep iterating on wireframe, content, or interaction — whichever the current blocker lives in.

## When To Use

- Contract docs are mostly approved, but the product is still too abstract to implement safely
- Story Chain candidates contain `R&D required` areas that need structured examples instead of more discussion
- Real source examples, artifact examples, or surface examples would reveal whether the current direction is sound
- The team wants to validate data shape, sample content shape, or expressive surface shape before `project-bootstrap`

## Workflow

1. Read [references/program.md](references/program.md).
2. Read [references/sample-pack-shape.md](references/sample-pack-shape.md).
3. Lock the upstream input set first:
   - approved contract docs
   - current Story Chain candidates
   - the specific questions the samples must answer
   - any real source or reference artifacts already available
4. Choose the current mode:
   - `greenfield`
   - `revision`
   - `handoff`
5. Build the smallest sample set that can answer the current blocker questions.
6. Record what the samples changed:
   - `locked`
   - `R&D required`
   - `unresolved`
7. Hand off either to:
   - `project-bootstrap`
   - `contract-authoring`
   - Story Chain nodes

## Output Preference

- Prefer an existing `docs/sample-pack.md` or equivalent canonical sample artifact if the repo or template already has one.
- If no template exists, produce a compact sample pack that covers:
  - the question set
  - representative samples
  - contrast or anti-examples
  - edge or failure samples
  - candidate surface samples when relevant
  - findings and next handoff
- The pack should make uncertainty explicit instead of hiding it inside prose.

## Guardrails

- Do not balloon into a research dump. Every sample should answer a known question.
- Do not confuse samples with final product contract. If samples reveal a contract gap, send it back upstream.
- Do not drift into scaffold or feature implementation just because the samples are concrete.
- Do not invent synthetic samples when real source-backed examples already exist and matter.
- If the key blocker is still a product promise rather than an example-sensitive decision, go back to `contract-authoring` instead of forcing a sample pack.
- If the key blocker is a hard technology decision with no sample value, move to bootstrap technology selection instead of pretending examples will solve it.
