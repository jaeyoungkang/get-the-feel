# Contract Maps

Contract Maps are curated reading maps over the current agentic-base contract
system.

They are not source of truth. Product meaning lives in Story Chain and approved
product docs. Verification state lives in Mission Control, Evidence Ledgers, and
release gates. Operations runbooks live in `docs/operations/`. Project Knowledge
stores work handoff memory.

Contract Maps answer a narrower question: when a product or engineering concern
crosses many files, which current sources should a human or agent read together?

## Authority Boundary

| Layer | Owns | Contract Map relationship |
| --- | --- | --- |
| `product/contract.md` | Human-readable product contract summary | Read as a summary after Story Chain |
| `docs/contracts/story-chain/` | Experience, Moment, Promise, Aspect, Evidence Ledger | Read as source |
| `docs/contracts/engineering/` | Optional internal invariant, lifecycle, control, evidence-kind contracts | Read as source when enabled |
| `docs/operations/` | Runnable operational procedures and rollback boundaries | Read as source after bootstrap operations exist |
| `npm run mc:status` | Current computed Story Chain and release status | Read as source |
| `docs/project-knowledge/` | Work handoff memory | Read as source when a map touches workflow continuity |
| `docs/contract-maps/` | Cross-document reading maps | Derived only |

Do not change Promise, Aspect, Evidence Ledger, or bootstrap authority in this
directory. If a map reveals stale evidence or a missing contract edge, update the
owning source through Mission Control or the relevant steward.

## Current Maps

- [`story-chain-authority.md`](story-chain-authority.md) — how product meaning,
  propagation, evidence, evaluator, and system gate authority are split.
- [`quality-gates.md`](quality-gates.md) — how template maintenance and release
  gates relate to Story Chain, Project Knowledge, skills, and Contract Maps.
- [`engineering-assurance.md`](engineering-assurance.md) — how optional internal
  invariant/control contracts relate to Story Chain and Evidence Ledgers.
- [`operations.md`](operations.md) — how operational runbooks route into Story
  Chain, Engineering Assurance, Evidence Ledgers, and gates.
- [`skill-routing.md`](skill-routing.md) — how repo-local skills route common
  agentic-base work.

## Maintenance

When updating a map:

1. Read the owning source files before editing the map.
2. Check computed status with `npm run mc:status` when the map discusses current
   verdict or release state.
3. Link to source files instead of duplicating long contract text.
4. Keep maps navigational: question, source cluster, read path, blocker.
5. Run `npm run contract-maps:check`, `npm run guard:skills`, and
   `npm run pk:validate` for docs-only map changes.
