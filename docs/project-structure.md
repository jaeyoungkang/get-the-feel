# get-the-feel — Product Project Structure

> 작성일: 2026-06-14
> 목적: 본격 제품 개발 저장소의 코드·문서 경계를 정의한다.

```text
Skill Load Receipt
- skill: shared-skills/engineering-decision/SKILL.md
- loaded_at_step: production-project-structure
- agentic_base_ref: /Users/jaeyoungkang/youngcompany/agentic-base (local reference)
- lighthouse_ref: /Users/jaeyoungkang/corca/lighthouse (local reference)
- engineering_trigger: change_frequency + release_risk + duplication_risk
- chosen_rung: L1/L2 seed — Next.js app shell, TypeScript content boundary, package scripts, content contract check
- rejected_rung: L3/L4 — unit coverage, CI, server/account/analytics remain deferred until demand evidence
```

## Directory Roles

| Path | Role |
|---|---|
| `app/` | Next.js App Router product surface. Root route wraps the current trainer design baseline; `/explain` is the React sentence explanation flow. |
| `src/content/` | Typed content access layer for `assets/content/*.json`. New app code should read content through this boundary. |
| `public/legacy/c4-3/` | Current trainer design baseline from the deployed product. Protected until React parity exists. |
| `docs/design-assets.md` | Design asset governance and parity rules. |
| `assets/` | Content, training design, and UX grammar source of truth. Do not treat this as app implementation code. |
| `scripts/content/` | Executable content contract checks for the active corpus. |
| `scripts/mission-control/` | Story Chain release verdict, surface audit, critical finding checks, propagation helpers. |
| `scripts/contract-maps/` | Contract map validation scripts. |
| `scripts/project-knowledge.mjs` | Project event/change-log/intent judgment validation and logging entrypoint. |
| `product/` | Human-readable product contract summary and demand validation plan. |
| `docs/` | Engineering and project operation documentation. |
| `docs/contracts/story-chain/` | Experience, moment, promise, aspect, and evidence ledger contracts for product development. |
| `shared-skills/` | Source skill suite used by Codex/Claude agents. |
| `.agents/skills/`, `.claude/skills/` | Generated skill targets. Refresh with `npm run skills:sync`; check drift with `npm run guard:skills`. |

## Active Product Rule

The active product shell is in `app/`, but the current trainer design baseline
is the existing deployed trainer asset under `public/legacy/c4-3/`. Content
remains in `assets/content/` and must pass the content contract before it is used
by the app.

Working order:

1. Update Story Chain contract docs before changing durable product behavior.
2. Preserve the design baseline unless a documented parity replacement exists.
3. Build product code in `app/` and `src/`.
4. Validate content with `npm run content:check`.
5. Validate implementation and contracts with `npm run quality:check`.

## Quality Rung

Current rung is Story Chain-backed but still local-first:

- `npm run content:check` checks the active corpus contract.
- `npm run typecheck`, `npm run lint`, and `npm run build` are the new product gates.
- `npm run quality:contracts` checks skill drift, project knowledge, contract maps, Story Chain release verdict, surface audit, and new critical findings.
- `npm run quality:check` runs all of the above.

Deferred until demand or repeated engineering defects:

- CI workflows.
- Coverage thresholds.
- Dependency-cruiser and dead-code gates.
- Server persistence, account system, analytics SDK.

## Refuse First

- Do not land product behavior that cannot be traced to Story Chain promises/aspects or explicit product contract changes.
- Do not replace the current trainer design baseline without `docs/design-assets.md` parity evidence.
- Do not introduce backend state before demand validation.
- Do not promote weak source senses to strong as part of engineering migration.
