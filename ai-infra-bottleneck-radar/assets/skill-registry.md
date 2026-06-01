# Skill Registry

This project treats skills as first-class assets. A cycle is not governed if the relevant skill exists only as a file but is not registered here and receipted in `assets/CYCLE_RECORD.md`.

| Skill | When to use | Required receipt | Mechanical enforcement | Last contribution |
| --- | --- | --- | --- | --- |
| `skills/radar-cycle/SKILL.md` | Every fresh candidate cycle. | candidate id, previous disposition, current-candidate gates, blockers. | `scripts/check-assets.mjs`, `scripts/check-cycle-record.mjs`, `npm run quality:check`. | Current-candidate binding, macro-map preservation, and fresh candidate rules. |
| `skills/product-level-sellability/SKILL.md` | Before writing `sellable_status` or `allowed_to_stop`. | product feedback readiness, repeat-use readiness, pricing evaluation readiness, macro promise preservation. | `scripts/check-cycle-record.mjs` requires product-level verdict fields. | External business blockers no longer grant stop permission. |

## Skill Asset Rule

- A new behavior rule is not an asset until it has a `SKILL.md`, a row in this registry, and a mechanical or review gate.
- Updating an existing skill is allowed, but repeated or safety-critical behavior must be split into a named skill when it becomes a reusable decision point.
- The Asset Steward Monitor must check this registry before a cycle verdict.
