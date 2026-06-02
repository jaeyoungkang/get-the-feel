# Major Decisions

## Product Decisions

### Macro Map Must Stay Primary

Decision:
- The first viewport must answer the original investor question before any feedback, conversion, subscription, proof, SLA, or onboarding control appears.

Why:
- The original ask was a macro AI supply/value-chain bottleneck visualization for ordinary stock investors.
- Earlier versions drifted toward cards, proof panels, or conversion surfaces.

Operational rule:
- Highest bottleneck, propagation path, current/future snapshot, and source/trust boundary are required first-viewport signals.

### Thin Path As Product Spine

Decision:
- Use HBM -> advanced packaging -> systems/network -> cloud capacity as the initial AI infrastructure bottleneck path.

Why:
- It is concrete enough for data contracts and broad enough for macro-to-micro drilldown.

### Data Contracts Before Paid Claims

Decision:
- Every displayed node, edge, snapshot, and path requires source/freshness/formula/scenario contract fields.

Why:
- Without a contract, pressure scores become persuasive UI without evidence.

### Local Candidate, Representative Demo, Paid Service Are Separate

Decision:
- R3/R4 introduced explicit separation between local candidate, representative demo, and paid service.

Why:
- The loop repeatedly risked treating a polished demo as sellable product.

### Customer Proof Is Not Demand Proof

Decision:
- Watchlists, routines, pricing choices, local feedback, and local exports can support customer testing but cannot prove demand.

Why:
- LocalStorage and local UI choices are not external customer behavior.

Consequence:
- Customer proof surfaces may prepare interview, waitlist, and payment-intent capture, but all such paths remain `external_required` until evidence exists outside the local candidate.

### Sellability Must Be Explicitly Blocked

Decision:
- R12 introduced explicit sellable-boundary decision with `current_decision: blocked`.

Why:
- If sellability is not explicit, the agent may infer completion from improving surfaces.

Consequence:
- A better product surface increases feedback readiness, not stop permission, unless sellability passes.

### Paid Onboarding Is Reviewable, Not Sellable

Decision:
- R14 added paid onboarding steps but kept payment and SLA blocked.

Why:
- Checkout-like UI can falsely imply paid launch readiness.

Consequence:
- Payment, legal, and staffed SLA claims require external approval or real operation. The candidate can display their blocked state but cannot convert them to pass locally.

## Process Decisions

### `quality:check` Is Not Stop Permission

Decision:
- Keep `quality:check` for internal candidate validity.
- Add `quality:final` for completion permission.

Why:
- Several candidates were locally valid but not sellable.

Result:
- `quality:check` can pass while `quality:final` fails. This is the intended state for a non-sellable but internally consistent candidate.

### Stop Permission Requires Sellability

Decision:
- If `sellable_status` is not `pass`, then:
  - `allowed_to_stop: no`
  - `final_permission_status: denied_continue`
  - `quality:final` fails
  - next fresh candidate must be named

### Monitor Output Must Be Real

Decision:
- `monitor_outputs_received: yes` and timeout policy are required.

Why:
- Earlier monitor attempts timed out or were shut down; placeholder monitor compliance is not compliance.

Result:
- Missing monitor output keeps the cycle open. Timeout is a blocker, not a substitute verdict.

### Exact Next-Candidate Binding

Decision:
- Add:
  - `next_candidate_id`
  - `next_candidate_path`
  - `next_candidate_primary_advancement`
  - `next_candidate_binding_checked`

Why:
- Mechanical substitutions repeatedly made the next candidate point to the current candidate.

Result:
- Non-sellable closure now requires an exact next candidate id/path and an explicit binding check.

### Assets Must Grow With Product

Decision:
- Every product learning must be recovered into asset files, scripts, or skills.

Why:
- Text-only reflections did not prevent recurrence.

Result:
- Repeated product-making decisions were converted into skill files, asset registry entries, and script checks where possible.

## Skill Decisions

### Product-Making Skills Are Assets

Decision:
- Product-making knowledge became skills, not only documentation.

Current skills:
- `macro-bottleneck-visualization`
- `source-backed-bottleneck-data`
- `feedback-ready-product-surface`
- `product-level-sellability`
- `paid-onboarding-boundary`
- `radar-cycle`

### Engineering Constraints Rise With Need

Decision:
- Keep early engineering gates lightweight.
- Add stronger gates as product scope and recurrence risks grow.

Implemented:
- Data contract checks.
- Cycle record checks.
- Asset existence checks.
- Final permission checks.
- Exact next-candidate checks.

Deferred trigger:
- Stronger gates such as browser screenshot checks, visual regression checks, dependency audits, duplicate detection, and dead-code checks should be introduced when the product surface or codebase becomes large enough that manual inspection stops being reliable.
