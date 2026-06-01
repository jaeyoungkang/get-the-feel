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

## R6 Rule

R6 cannot set `allowed_to_stop: yes` only because external business blockers are recorded. Product-level sellability is judged by the product surface: customer feedback readiness, repeat-use reason, pricing evaluation path, and preservation of the macro bottleneck promise.

## Stop Permission Repair

External business blockers can be recorded, but they do not stop the product loop. If `sellable_status` is not `pass`, the record must keep `allowed_to_stop: no` and name the next fresh candidate.

## Product-Level Sellability Skill Rule

Every cycle verdict must load `skills/product-level-sellability/SKILL.md` before writing `sellable_status` or `allowed_to_stop`.

Required product-level checks:

- feedback readiness,
- repeat-use readiness,
- pricing evaluation readiness,
- macro promise preservation.

## R7 Rule

R7 must create `candidates/r7-feedback-ready-radar/` and all quality scripts must target that candidate before verdict.

R7 cannot close as sellable merely because local feedback capture exists. Local-only feedback is a product learning surface, not a paid product surface.

R7 cannot close until:

- product-making skill receipts are recorded for macro visualization, source-backed data, and feedback-ready surface work,
- Process Improvement Monitor explicitly checks skill registration, exact current-candidate targeting, and stop-permission recurrence,
- feedback capture, repeat-use workflow, pricing choices, and next evidence path are visible in the UI and checked in data,
- stop permission remains denied unless `sellable_status: pass`.

## Final Response Gate

Before a completion-style final response, run `npm run quality:final`.

If it fails, the agent must continue the `next_action` fresh candidate. `npm run quality:check` only proves the current candidate is internally valid; it does not grant permission to stop.

## R8 Rule

R8 must create `candidates/r8-conversion-ready-radar/` and all quality scripts must target that candidate before verdict.

R8 cannot close until:

- product-making skill receipts are recorded for macro visualization, source-backed data, feedback/public-test surface, and product-level sellability,
- the Asset Steward Monitor checks skill assets and asset recovery before verdict,
- public-test signal capture, report copy, JSON export, routine choice, and price intent are visible in the UI and checked in data,
- `CYCLE_RECORD.md` records `final_permission_gate: must_fail_until_sellable_pass`,
- non-sellable cycles record `final_permission_status: denied_continue`,
- non-sellable cycles record `if_quality_final_fails: continue_next_fresh_candidate` and a fresh `final_permission_next_action`.

If `sellable_status` is not `pass`, `quality:final` must fail and the next candidate must start instead of sending a completion-style final response.

## R9 Rule

R9 must create `candidates/r9-subscription-ready-radar/` and all quality scripts must target that candidate before verdict.

R9 cannot close until:

- subscription controls remain subordinate to the macro bottleneck map,
- saved monthly radar, sample paid report copy, subscription price intent, and JSON export are visible in the UI and checked in data,
- Asset Steward verifies product-making skills and records R9 asset contributions,
- `CYCLE_RECORD.md` records `monitor_outputs_received: yes`,
- `CYCLE_RECORD.md` records a `monitor_timeout_policy` where missing monitor output means `cycle_not_closed`,
- `CYCLE_RECORD.md` records `final_permission_status: denied_continue` unless `sellable_status: pass`,
- `final_permission_next_action` names the exact next fresh candidate.

If `quality:final` fails, the agent must proceed to the named next fresh candidate rather than stop at R9.
