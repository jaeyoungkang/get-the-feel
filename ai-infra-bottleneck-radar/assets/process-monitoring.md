# Process And Monitor Recovery

Required monitors:

- Intent Guardian
- Process Improvement Monitor
- Asset Steward
- Data/Sellability Monitor

Recovery target:

- skill
- asset
- data contract
- mechanical check
- candidate implementation

Feedback that stays only in chat does not close a candidate cycle.

## R1 Recovery

- Intent Guardian verdict must be recorded before cycle close.
- Asset Steward verdict must be recorded before cycle close.
- Data/Sellability verdict must be recorded before cycle close.
- `scripts/check-cycle-record.mjs` fails if monitor verdicts remain pending.

## R2 Rule

R2 must create a new candidate folder. It may read R1 assets and monitor outputs, but it must not patch `candidates/r1-macro-radar/`.

## R3 Rule

R3 must create `candidates/r3-validation-radar/` or another new `r3-*` folder. It may read R2, but must not patch `candidates/r2-operations-radar/`.

R3 cannot start until R2 monitor verdicts are recovered into:

- `assets/CYCLE_RECORD.md`
- `assets/ASSET_MAP.md`
- `assets/research-data-ops.md`
- `assets/business-logic.md`

## R4 Rule

R4 must create `candidates/r4-representative-radar/` and all quality scripts must target that candidate before verdict.

R4 cannot close until:

- `assets/CYCLE_RECORD.md` contains `current_candidate_id`.
- pre-verdict outputs exist for Intent Guardian, Process Improvement, Asset Steward, and Data/Sellability.
- `assets/CYCLE_RECORD.md` contains `monitors_before_verdict: yes`.
- asset recovery targets are listed.
- representative-demo data is visible in UI, not only in `data.json`.
- stop permission is explicitly denied when `sellable_status` is not `pass`.

## R5 Rule

R5 must create `candidates/r5-customer-proof-radar/` and all quality scripts must target that candidate before verdict.

R5 cannot close as sellable unless real customer capture, payment approval, legal review, and paid SLA approval are no longer missing. If those cannot be performed in-session, they must be recorded as external blockers; otherwise the loop continues with `allowed_to_stop: no`.
