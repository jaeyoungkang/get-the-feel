# Agent Skills

agentic-base keeps repo-local skills for the full pilot lifecycle, so a cloned
copy can plan, bootstrap, propagate, and verify a new AI product without relying
on external workspace-local skills.

The structure is intentionally simple:

- `shared-skills/` is the editable source.
- `.agents/skills/` is the Codex generated target.
- `.claude/skills/` is the Claude Code generated target.
- Generated skill directories contain `.agentic-base-generated` and must not be
  edited directly.

## Canonical Skills

| Skill | Source | Generated targets |
| --- | --- | --- |
| `contract-authoring` | `shared-skills/contract-authoring/` | `.agents/skills/contract-authoring/`, `.claude/skills/contract-authoring/` |
| `engineering-profile` | `shared-skills/engineering-profile/` | `.agents/skills/engineering-profile/`, `.claude/skills/engineering-profile/` |
| `sample-first` | `shared-skills/sample-first/` | `.agents/skills/sample-first/`, `.claude/skills/sample-first/` |
| `project-bootstrap` | `shared-skills/project-bootstrap/` | `.agents/skills/project-bootstrap/`, `.claude/skills/project-bootstrap/` |
| `project-knowledge` | `shared-skills/project-knowledge/` | `.agents/skills/project-knowledge/`, `.claude/skills/project-knowledge/` |
| `jaeyoung-think` | `shared-skills/jaeyoung-think/` | `.agents/skills/jaeyoung-think/`, `.claude/skills/jaeyoung-think/` |
| `implementation-propagation` | `shared-skills/implementation-propagation/` | `.agents/skills/implementation-propagation/`, `.claude/skills/implementation-propagation/` |
| `verify-wiring` | `shared-skills/verify-wiring/` | `.agents/skills/verify-wiring/`, `.claude/skills/verify-wiring/` |
| `mission-control` | `shared-skills/mission-control/` | `.agents/skills/mission-control/`, `.claude/skills/mission-control/` |
| `engineering-assurance-steward` | `shared-skills/engineering-assurance-steward/` | `.agents/skills/engineering-assurance-steward/`, `.claude/skills/engineering-assurance-steward/` |
| `operations-governance-steward` | `shared-skills/operations-governance-steward/` | `.agents/skills/operations-governance-steward/`, `.claude/skills/operations-governance-steward/` |
| `contract-map-steward` | `shared-skills/contract-map-steward/` | `.agents/skills/contract-map-steward/`, `.claude/skills/contract-map-steward/` |
| `glossary-steward` | `shared-skills/glossary-steward/` | `.agents/skills/glossary-steward/`, `.claude/skills/glossary-steward/` |
| `quality-gate-steward` | `shared-skills/quality-gate-steward/` | `.agents/skills/quality-gate-steward/`, `.claude/skills/quality-gate-steward/` |
| `skill-governance-steward` | `shared-skills/skill-governance-steward/` | `.agents/skills/skill-governance-steward/`, `.claude/skills/skill-governance-steward/` |
| `lsp-assisted-engineering` | `shared-skills/lsp-assisted-engineering/` | `.agents/skills/lsp-assisted-engineering/`, `.claude/skills/lsp-assisted-engineering/` |

## Lifecycle

Use the skills in this order when starting a new product from a cloned
agentic-base:

```text
contract-authoring
→ sample-first
→ mission-control
→ jaeyoung-think
→ engineering-profile
→ project-bootstrap
→ project-knowledge
→ implementation-propagation
→ verify-wiring
```

`project-bootstrap` is the first point that may call `scripts/start-pilot.mjs`
and `init-project.sh`. Before that, work stays in initial intent capture, MVP
sample iteration, Story Chain completion, and bootstrap-time technology
selection. From `project-bootstrap` onward, `project-knowledge` records local
memory, bootstrap events, and material changes.

## Steward Routing

Use these stewards when the work changes agent operating surfaces rather than a
single product Promise:

- `skill-governance-steward` for creating, updating, consolidating, retiring, or
  reviewing repo-local skills.
- `engineering-assurance-steward` for internal invariants, lifecycle contracts,
  controls, evidence kinds, and Engineering Assurance coverage expansion.
- `operations-governance-steward` for runnable operation runbooks, rollback
  boundaries, incident procedure routing, and operations-to-contract propagation.
- `contract-map-steward` for derived `docs/contract-maps/**` maps and
  wiki-style reading guidance.
- `glossary-steward` for `docs/glossary.md`, Story Chain terminology, lifecycle
  vocabulary, gate terms, and skill names.
- `quality-gate-steward` for `quality:*` scripts, CI wiring, Project Knowledge
  validation, Contract Map checks, and Story Chain gate documentation.
- `lsp-assisted-engineering` after bootstrap when TypeScript symbols, imports,
  call sites, or diagnostics shape a code change.

LSP is an editing aid, not a release gate. Contract Maps and the glossary are
derived reading surfaces, not approval artifacts.

## Skill Lifecycle

Use `skill-governance-steward` when adding, updating, retiring, consolidating,
or reviewing repo-local skills. Prefer updating an existing skill over creating
a new one. Create a new skill only when the trigger, workflow, and validation
are distinct.

Run a skill review when three or more skills change in one workstream, a new
skill is added, reviewers report trigger gaps or overengineering, generated-copy
drift appears, or Project Knowledge records repeated agent mistakes for the same
workflow.

## Sync

```bash
npm run skills:sync
npm run guard:skills
npm run pk:validate
```

Use prune only when intentionally removing a generated skill:

```bash
python3 scripts/sync-agent-skills.py --prune
npm run guard:skills
npm run pk:validate
```
