# Research And Data Operations

## Source Set For Restart Cycle

- `tsmc-2025-ar`: TSMC 2025 Annual Report, advanced packaging/CoWoS and AI/HPC capacity context.
- `skhynix-fy25`: SK hynix FY2025 results, HBM and AI memory context.
- `nvidia-fy26-10k`: NVIDIA FY2026 Form 10-K, data center demand/customer concentration context.
- `microsoft-ar25`: Microsoft 2025 Annual Report, cloud and AI infrastructure cost/capex context.

## Required Contract Per Displayed Value

- `source_id`
- `source_status`
- `as_of`
- `collected_at`
- `applied_at`
- `cadence`
- `freshness_status`
- `snapshot_type`
- `calculation_status`

Allowed `snapshot_type`:

- `source_backed_index`
- `scenario`
- `unverified`

## Blocking Rule

Do not render `observed` unless a measured value and source workflow exist. This prototype uses `source_backed_index` and `scenario` only.

