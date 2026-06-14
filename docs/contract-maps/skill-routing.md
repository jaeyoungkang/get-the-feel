# Skill Routing Contract Map

This map answers: which repo-local skill owns a recurring agentic-base workflow?

It does not replace `docs/agent-skills.md`; that file owns skill inventory and
sync rules.

## Routes

| Work | Primary skill | Source |
| --- | --- | --- |
| Product contract interview and approval docs | `contract-authoring` | [`shared-skills/contract-authoring/`](../../shared-skills/contract-authoring/) |
| Concrete sample artifacts before bootstrap | `sample-first` | [`shared-skills/sample-first/`](../../shared-skills/sample-first/) |
| Story Chain navigation and Mission Control | `mission-control` | [`shared-skills/mission-control/`](../../shared-skills/mission-control/) |
| Engineering Assurance claims, controls, evidence kinds, and coverage expansion | `engineering-assurance-steward` | [`shared-skills/engineering-assurance-steward/`](../../shared-skills/engineering-assurance-steward/) |
| Operations runbooks, rollback boundaries, incident procedure routing, and operations-to-contract propagation | `operations-governance-steward` | [`shared-skills/operations-governance-steward/`](../../shared-skills/operations-governance-steward/) |
| Technology profile and bootstrap readiness | `engineering-profile`, `project-bootstrap` | [`shared-skills/engineering-profile/`](../../shared-skills/engineering-profile/), [`shared-skills/project-bootstrap/`](../../shared-skills/project-bootstrap/) |
| Repo-local skill lifecycle | `skill-governance-steward` | [`shared-skills/skill-governance-steward/`](../../shared-skills/skill-governance-steward/) |
| Contract Maps / wiki-style reading maps | `contract-map-steward` | [`shared-skills/contract-map-steward/`](../../shared-skills/contract-map-steward/) |
| Glossary and terminology | `glossary-steward` | [`shared-skills/glossary-steward/`](../../shared-skills/glossary-steward/) |
| Quality gate changes | `quality-gate-steward` | [`shared-skills/quality-gate-steward/`](../../shared-skills/quality-gate-steward/) |
| TypeScript symbol/call-site edits after bootstrap | `lsp-assisted-engineering` | [`shared-skills/lsp-assisted-engineering/`](../../shared-skills/lsp-assisted-engineering/) |
| Data field generation -> consumption -> UI verification | `verify-wiring` | [`shared-skills/verify-wiring/`](../../shared-skills/verify-wiring/) |

## Read Path

1. Read `docs/agent-skills.md` for inventory and sync rules.
2. Read the specific skill.
3. Read source docs named by that skill.
4. Run the validation block named by that skill.

Source:

- [`docs/agent-skills.md`](../agent-skills.md)
