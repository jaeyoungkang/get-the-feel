# Skill Registry

This project treats skills as first-class assets. A cycle is not governed if the relevant skill exists only as a file but is not registered here and receipted in `assets/CYCLE_RECORD.md`.

| Skill | When to use | Required receipt | Mechanical enforcement | Last contribution |
| --- | --- | --- | --- | --- |
| `skills/radar-cycle/SKILL.md` | Every fresh candidate cycle. | candidate id, previous disposition, current-candidate gates, blockers. | `scripts/check-assets.mjs`, `scripts/check-cycle-record.mjs`, `npm run quality:check`. | Current-candidate binding, macro-map preservation, and fresh candidate rules. |
| `skills/macro-bottleneck-visualization/SKILL.md` | Before creating or changing candidate UI. | macro map primary, propagation path, current/scenario visibility, support layers subordinate. | Asset Steward and Intent Guardian review; future UI smoke gate. | Converts R1-R6 visualization lessons into reusable map-first UI rules. |
| `skills/source-backed-bottleneck-data/SKILL.md` | Before creating or changing candidate `data.json`. | display contract, formula contract, freshness contract, scenario bindings, validation samples. | `scripts/check-data-contracts.mjs`. | Converts R2-R6 source/freshness/formula/scenario lessons into reusable data rules. |
| `skills/feedback-ready-product-surface/SKILL.md` | Before customer proof, onboarding, pricing, waitlist, or feedback UI. | feedback capture, repeat-use workflow, pricing evaluation, macro promise preservation, next evidence path. | `scripts/check-cycle-record.mjs` product-level verdict fields; future feedback UI gate. | Converts R5-R6 customer-proof failure into reusable feedback-ready product rules. |
| `skills/product-level-sellability/SKILL.md` | Before writing `sellable_status` or `allowed_to_stop`. | product feedback readiness, repeat-use readiness, pricing evaluation readiness, macro promise preservation. | `scripts/check-cycle-record.mjs` requires product-level verdict fields. | External business blockers no longer grant stop permission. |

## Skill Asset Rule

- A new behavior rule is not an asset until it has a `SKILL.md`, a row in this registry, and a mechanical or review gate.
- Updating an existing skill is allowed, but repeated or safety-critical behavior must be split into a named skill when it becomes a reusable decision point.
- The Asset Steward Monitor must check this registry before a cycle verdict.
