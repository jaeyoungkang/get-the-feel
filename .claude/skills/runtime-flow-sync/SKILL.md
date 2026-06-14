---
name: runtime-flow-sync
description: Use when changing, reviewing, or explaining Light House runtime processing flows, especially `docs/runtime-flows/**`, search mechanism, 검색 메커니즘, follow-up actions like `비슷한 논문` / `다른 입장`, provider/API boundaries, entrypoints, fallback order, persistence/sync ownership, or when a code/product change should keep runtime-flow docs aligned.
compatibility: Claude Code, Codex, Cursor-style agents in the Light House repository.
---

# Runtime Flow Sync Skill

Use this skill when a task changes or investigates how Light House executes a
runtime flow. The purpose is to keep implementation, Story Chain, Evidence
Ledger, and `docs/runtime-flows/**` from drifting apart.

This skill does not replace Mission Control. If the work changes
user-facing behavior, Promise meaning, Aspect advice, Acceptance Checks, or
Evidence Ledger coverage, load the relevant Mission Control steward first.

## Read First

- `docs/runtime-flows/README.md`
- the relevant runtime-flow document under `docs/runtime-flows/**`
- the implementation entrypoints named by that runtime-flow document
- the related Story Chain Promise, Aspect, and Evidence Ledger files when
  user-facing behavior or executable coverage changes

For search work, also search the current code for the named surface:

```bash
rg -n "search|seedPaper|differentPositionSeed|비슷한 논문|다른 입장|paper-neighborhood|co-cited|coupled" app docs/contracts/story-chain docs/runtime-flows
```

## Sync Triggers

Update or verify runtime-flow docs when any of these change:

- entrypoint, route handler, hook, store, or service order
- provider/API boundary, request/response shape, hydration path, graph endpoint,
  or fallback behavior
- client/server ownership of persistence, metadata, availability seed, or
  background-task sync
- visible follow-up action flow, including `비슷한 논문`, `다른 입장`, citation
  lineage, gap-network handoff, or agent reaction input
- public explanation of a runtime mechanism, when that explanation relies on a
  concrete flow in `docs/runtime-flows/**`
- Story Chain or Evidence Ledger text that describes runtime sequencing

Do not update a runtime-flow doc only to echo marketing copy. The doc should
state how the system runs.

## Workflow

1. Identify the relevant runtime-flow document. If none exists, decide whether
   the change is large enough to ask before adding a new one.
2. Read the current implementation before editing prose. Prefer `rg`, LSP, and
   narrow file reads over memory.
3. Classify the state:
   - current implemented behavior;
   - documented fallback or degrade path;
   - future issue or planned provider/API improvement.
4. Update the runtime-flow doc so it distinguishes current behavior from future
   follow-up work.
5. If public prose changed, state the boundary between internal runtime terms
   and user-facing terms.
6. If user-facing behavior changed, update Story Chain and Evidence Ledger in
   the same workstream.
7. Record durable follow-up issues by link or stable identifier when runtime
   docs mention planned external API work.

## Search-Specific Checks

For `비슷한 논문`, confirm whether the implementation is:

- keyword-prefill search via `buildSimilarPaperQuery`;
- graph-neighbor retrieval via Episteme or citation-lineage helpers;
- a hybrid of both.

For `다른 입장`, confirm whether candidates come from:

- inline analysis `stanceProfile.counterSearchQueries`;
- provider/API-returned stance/debate candidates;
- a future issue only.

Do not imply graph or stance APIs are already used when the code still opens a
regular search tab with seeded metadata.

## Validation

For docs-only runtime-flow sync, run:

```bash
npm run format:check
```

When Story Chain or Evidence Ledger changed, also run the relevant Story Chain
and ledger gates:

```bash
npm run mc:validate-story-chain
npm run evidence-ledger:dry
```

If the runtime-flow change also changes a Promise, Acceptance Check, or
Evidence Ledger row, run the impacted ledger evidence for real:

```bash
npm run evidence-ledger -- --ledger <ledger>
```

When code changed, run the smallest tests that cover the edited runtime path,
plus `npm run typecheck` when TypeScript contracts moved.
