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

## R1 Official Source Set

- TSMC 2025 Annual Report: advanced packaging, CoWoS, AI/HPC context.
- SK hynix FY2025 results: HBM and AI memory demand context.
- NVIDIA FY2026 Form 10-K and FY2026 results: data center AI demand context.
- Microsoft 2025 Annual Report: cloud and AI infrastructure investment context.
