# Process And Monitor Recovery

Required monitors:

- Intent Guardian
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
