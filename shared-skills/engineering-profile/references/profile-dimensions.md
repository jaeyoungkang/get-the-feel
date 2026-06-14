# Profile Dimensions

Use this file to decide which non-business dimensions actually need to be locked before implementation.

Not every project needs every dimension. The point is to avoid forgetting the ones that materially shape implementation.

## 1. Stack and Runtime

- frontend or backend framework
- static vs server runtime
- language choices
- hosting assumptions
- AI provider or model runtime when relevant

Why it matters:

- it changes folder structure, deploy path, testing, and build assumptions

Do not lock a specific library too early when a product-defining surface is still unresolved.

## 2. Deployment Topology

- single service vs split services
- edge vs regional runtime
- scheduled jobs, workers, queues
- CDN or storage topology
- environment separation: local / preview / prod

Why it matters:

- it changes integration boundaries and failure modes

## 2.5. Visualization and Interaction Surface

Use this when visualization, mapping, timelines, charts, or interactive reading are central to product identity.

- editorial vs exploratory surface
- static vs interactive vs semi-interactive
- density and layering expectations
- narrative flow vs analysis tooling
- motion and transition role
- explainability and source trace needs
- desktop/mobile interaction differences

Why it matters:

- this often decides whether plain DOM/CSS/SVG is enough, or whether d3/canvas/webgl/custom layout logic is actually justified

Rule:

- if this surface is still open, keep the visualization library unresolved instead of pretending the stack decision is already done
- if visualization is product-defining, run a focused deep dive on reading mode, interaction depth, density, source trace, and mobile behavior before selecting libraries

## 3. Data and Storage Profile

- source-of-truth data stores
- cache strategy
- file/object storage needs
- retention windows
- backup/restore expectations
- offline or import/export requirements

Why it matters:

- it decides schema, migration, and operational burden

## 4. Auth, Permissions, and Identity

- anonymous vs logged-in
- role boundaries
- admin-only surfaces
- organization / tenant boundary
- audit needs for sensitive actions

Why it matters:

- it changes route structure, data access, and review surfaces

## 5. Security and Privacy

- secret handling
- PII or sensitive content handling
- encryption expectations
- data minimization
- access control baseline
- abuse or misuse boundaries

Why it matters:

- it changes storage, logging, admin tools, and legal risk

## 6. Compliance and Governance

- policy or regulatory constraints
- human approval requirements
- record retention
- review workflow
- change control for prompts, models, or content

Why it matters:

- it changes release process and operator responsibilities

## 7. Observability and Analytics

- logs, metrics, traces
- product analytics
- business logic observability surfaces
- admin/alignment or review dashboards
- alerting and anomaly detection

Why it matters:

- without this, failures exist but cannot be read

## 8. Quality Gates and Test Strategy

- lint/type/test/build chain
- coverage expectations
- specdown or executable spec path
- live judge or evaluator path
- visual regression or DOM testing

Why it matters:

- it defines what "done" and "safe to ship" mean

## 9. Release, Rollback, and Incident Policy

- release cadence
- preview flow
- rollback boundary
- data migration safety
- incident owner and first response path

Why it matters:

- it changes how much risk a single deployment may carry

## 10. Performance, Capacity, and Cost

- expected traffic shape
- latency or throughput expectations
- compute ceilings
- storage growth
- third-party API cost
- model inference cost

Why it matters:

- architecture that ignores cost or capacity often has to be rewritten

## 11. Accessibility, Localization, and Content Operations

- accessibility target
- locale strategy
- translation workflow
- content review or moderation
- authoring workflow for non-engineers

Why it matters:

- these often reshape UI architecture and editorial tools

## 12. AI-Specific Control Plane

Use this only when the product actually uses LLMs or agent behavior.

- model/provider selection
- prompt asset management
- schema and output contracts
- evaluation and judge path
- human override path
- safety and refusal policy

Why it matters:

- otherwise the "AI part" gets hidden inside implementation and becomes unreviewable

## Heuristic

If a dimension changes:

- code structure
- deploy shape
- operator workflow
- risk profile
- or release gate

then it belongs in the engineering profile.

If it only changes feature semantics or user value, it belongs upstream in product contract docs instead.

If a dimension is tightly coupled to product identity and materially changes the implementation path, do not settle it with a shallow default. Promote it into a dedicated surface profile and discuss it in depth first.

If that deep dive still cannot responsibly lock the choice, move it into `R&D required` rather than pretending it is already decided.
