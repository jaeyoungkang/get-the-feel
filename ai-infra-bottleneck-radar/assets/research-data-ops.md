# Research And Data Operations

## R1 Thin Path

`HBM memory -> advanced packaging -> cloud capacity`

## Required Display Contract

Every displayed node, edge, snapshot, and highlighted path must include:

- `source_id`
- `source_status`
- `as_of`
- `collected_at`
- `applied_at`
- `cadence`
- `freshness_status`
- `stale_after_days`
- `late_source_handling`
- `snapshot_type`
- `calculation_status`
- `formula_status`

Allowed `snapshot_type`:

- `source_backed_index`
- `scenario`
- `unverified`

`fact` and `observed` labels are blocked until there is a measured update workflow.

## R2 Required Operating Repair

- `update_owner` cannot remain `unassigned_operator`.
- Thin-path node and edge sources need reference location, not only `source_id`.
- Freshness status must be computed from `applied_at` and `stale_after_days`.
- Scenario deltas must bind to explicit node/edge rules.
- Paid promotion must fail if formula status remains unvalidated.

## R2 Recovery

- R2 assigns `operator_research_desk` as update owner.
- R2 adds `source_reference` to displayed values.
- R2 computes `fresh | review_required | stale` in the UI from `applied_at` and `stale_after_days`.
- R2 adds `scenario_rule_bindings`.
- R2 keeps paid service blocked until formula validation and compliance review.

## R3 Required Validation Repair

- Every displayed pressure score needs `formula_components`.
- Formula component weights must sum to 1.
- Formula component scores must stay in 0-100 range.
- Displayed pressure must stay within 3 points of the weighted formula unless the candidate explicitly marks it as `manual_override_blocked`.
- Every displayed node needs at least one validation sample.
- Validation sample is not a backtest. It only proves the formula can be inspected.
- Paid release remains blocked until historical calibration or backtest exists.

## R3 Recovery

- R3 adds formula component visibility to the user surface.
- R3 adds validation samples to the user surface.
- `check-data-contracts.mjs` now mechanically checks formula components and validation samples.
- R3 still blocks paid service because it has no historical backtest.

## R4 Representative Demo Repair

- `source_reference` must identify section, table, page, or exact reference location where possible.
- Scenario snapshot `delta` must be mechanically tied to `scenario_rule_bindings`.
- Freshness status must be mechanically checked against `applied_at` and `stale_after_days`.
- Representative promotion must fail if any displayed value is stale or review-required.
- Each displayed stage must have a representative calibration sample inside its expected range.
- Each displayed stage must have a source review queue pass.
- Compliance checklist must pass non-advice, no-buy-sell, and source-boundary checks.
- Paid promotion must remain blocked while customer validation, legal review, payment/pricing approval, and paid SLA are missing.

## R1 Official Source Set

- TSMC 2025 Annual Report: advanced packaging, CoWoS, AI/HPC context.
- SK hynix FY2025 results: HBM and AI memory demand context.
- NVIDIA FY2026 Form 10-K and FY2026 results: data center AI demand context.
- Microsoft 2025 Annual Report: cloud and AI infrastructure investment context.

## R5 Customer Proof Data Rule

- `customer_proof.proof_status` must state that real customer capture is still missing.
- Each displayed stage needs a watchlist or research routine.
- Pricing tests must be present, but each remains `hypothesis_not_sold`.
- External blockers must include real customer capture, payment approval, legal review, and paid SLA approval.
- `check-data-contracts.mjs` must fail if customer proof is implied as validated demand.

## R7 Feedback-Ready Data Rule

- `feedback_surface.capture_storage` must state where local feedback is stored.
- `feedback_surface.repeat_use_workflows` must cover displayed stages.
- `feedback_surface.pricing_choices` must be selectable and marked `local_choice_only`.
- `feedback_surface.next_evidence_path` must say how local feedback becomes the next cycle's evidence.
- `check-data-contracts.mjs` must fail if feedback readiness is only static text.

## R8 Public-Test Data Rule

- `feedback_surface.capture_storage` must use a candidate-specific public-test signal key.
- The UI must expose report copy and JSON export actions for the selected bottleneck readout.
- Exported public-test signals must include selected stage, snapshot, routine, price choice, use case, contact hint, and local evidence status.
- Pricing choices remain `local_choice_only` until real customer conversion evidence exists.
- `check-data-contracts.mjs` must fail if the public-test surface replaces the macro bottleneck promise.

## R9 Subscription Data Rule

- `feedback_surface.capture_storage` must use a candidate-specific subscription context key.
- Subscription intent must include selected stage, snapshot, routine, use case, contact hint, and price intent.
- `subscription_surface.sample_paid_report` must describe a recurring bottleneck report, not a trade idea.
- `customer_proof.proof_status` may be `product_level_sellable_local_candidate`, but external paid-release blockers remain required until real customer/payment/legal/SLA proof exists.
- `check-data-contracts.mjs` must fail if subscription readiness is treated as paid demand validation.

## R10 Paid-Proof Data Rule

- `customer_proof.proof_status` must be `paid_proof_ready_local_candidate`.
- `customer_proof.proof_boundary` must refuse payment, legal, and staffed SLA claims.
- `paid_proof_surface` must define packet name, external evidence path, required fields, payment status, legal status, and SLA status.
- Exported JSON must carry proof boundary and external evidence path.
- `check-data-contracts.mjs` must fail if paid-proof readiness is treated as completed payment or validated demand.

## R11 External-Proof Data Rule

- `customer_proof.proof_status` must be `external_proof_path_candidate`.
- `external_proof_surface.capture_paths` must include customer interview, waitlist, and payment-intent paths.
- Each external path remains `external_required` and `not_captured` until real evidence exists.
- Promotion requires evidence outside localStorage.
- `check-data-contracts.mjs` must fail if external-proof readiness is treated as completed customer proof.
