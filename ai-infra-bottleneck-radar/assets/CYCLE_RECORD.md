# Cycle Record — r4-representative-radar

## Skill Load Receipt

- skill: `shared-skills/product-spiral-orchestrator/SKILL.md`
- loaded_at_step: r4-start
- candidate_id: `r4-representative-radar`
- previous_candidate_disposition: `archive r3-validation-radar as local candidate; recover validation credibility into representative-demo gates`
- required_gates: fresh candidate, current-candidate check, candidate completeness, monitor gate, mechanical verdict, stop permission
- blocked_until: R4 folder exists, current candidate is targeted by scripts, monitor outputs are recovered, and `npm run quality:check` passes

- skill: `shared-skills/intent-lock/SKILL.md`
- loaded_at_step: r4-start
- required_gates: original intent anchor, asset map gate, product contract development
- blocked_until: R4 representative-demo promise is locked without replacing the investor macro-map promise

- skill: `shared-skills/refinement-loop/SKILL.md`
- loaded_at_step: r4-start
- required_gates: Intent Guardian, Process Improvement, Asset Steward, Data/Sellability, asset recovery
- blocked_until: monitor feedback is recovered to assets/checks

- skill: `ai-infra-bottleneck-radar/skills/radar-cycle/SKILL.md`
- loaded_at_step: r4-start
- required_gates: macro surface, thin path, source/freshness contract, validation gate, representative-demo UI visibility, sellability gate
- blocked_until: `npm run quality:check` passes

## Current Candidate

- current_candidate_id: `r4-representative-radar`
- current_candidate_path: `candidates/r4-representative-radar/`
- monitors_before_verdict: yes
- asset_recovery_targets: `assets/ASSET_MAP.md`, `assets/product-contract.md`, `assets/research-data-ops.md`, `assets/visualization-ux.md`, `assets/business-logic.md`, `assets/process-monitoring.md`, `skills/radar-cycle/SKILL.md`, `scripts/check-data-contracts.mjs`, `scripts/check-assets.mjs`, `scripts/check-cycle-record.mjs`, `package.json`

## Original Intent Anchor

- user ask: ordinary stock investors need an easy AI value/supply-chain macro visualization, intuitive bottleneck detection, macro-to-micro switching, regular updates, time changes, and future snapshots.
- current promise: R4 is a fresh complete candidate that keeps the macro AI infrastructure bottleneck map as the primary surface while making representative-demo trust visible through calibration samples, source review, compliance, pricing, and SLA boundaries.
- primary surface: investor-facing macro bottleneck map
- forbidden drift: launch-review dashboard, stock picker, company cards, generic KPI dashboard, buy/sell signal, target price view

## Candidate Disposition

- local_candidate_status: pass
- representative_status: pass-as-demo-candidate
- sellable_status: blocked
- next_action: create `candidates/r5-customer-proof-radar/` as a fresh candidate; do not patch R4
- allowed_to_stop: no
- stop_permission_after_r4: denied
- stop_permission_reason: R4 is a representative demo candidate, not a paid product; customer willingness-to-pay, legal/payment approval, and operating SLA remain missing

## Asset Contribution

- R4 fresh candidate added under `candidates/r4-representative-radar/`
- R4 restores the first-screen copy to the ordinary-investor bottleneck promise
- representative-demo evidence is visible in the UI as why a score can or cannot be trusted
- data contract check now targets R4 and verifies source review queue, calibration samples, scenario delta bindings, freshness, compliance, pricing block, and SLA block
- process gate now requires current candidate id, Process Improvement monitor output, and R4 candidate references before verdict
- radar-cycle skill now requires current-candidate script targeting and representative-demo UI visibility
- engineering remains L0 because the codebase still has small surface area and no recurring implementation defect requiring lint/knip/purity escalation

## Sellability Gate

- buyer: ordinary stock investor
- paid_job: reduce time-to-context for AI infrastructure bottleneck news while showing which bottleneck drives pressure and whether the score is trusted, stale, or unvalidated
- pricing_hypothesis: USD 9-19/month individual research subscription hypothesis, unvalidated
- freshness_promise: monthly operator review candidate; paid SLA not approved
- update_owner: operator_research_desk
- representative_demo: source review, calibration samples, scenario binding, and local compliance checks are present
- release_blockers: no customer willingness-to-pay evidence, no legal review, no payment/pricing approval, no approved paid SLA
- sales_risk_verdict: blocked for paid release

## Mechanical Verdict

- asset gate: pass candidate targeted by `scripts/check-assets.mjs`
- data contract gate: pass candidate targeted by `scripts/check-data-contracts.mjs`
- cycle gate: pass when current candidate, monitor outputs, stop permission, and next fresh candidate are recorded
- syntax gate: pass candidate app and scripts parse
- HTTP check: required for local smoke at `http://localhost:4173/ai-infra-bottleneck-radar/candidates/r4-representative-radar/`

## Monitor Verdict

- Intent Guardian: restore-cycle, recovered before verdict
- Process Improvement: repair-before-next, recovered before verdict
- Asset Steward: repair-before-next, recovered before verdict
- Data/Sellability: continue-to-r5

### Intent Guardian

- original_ask: ordinary stock investors need an AI supply/value-chain macro bottleneck view with intuitive propagation, macro-to-micro evidence, time changes, and future snapshots.
- current_cycle_promise: R4 adds representative-demo credibility to source review, compliance, pricing, and update SLA boundaries.
- preserved: fresh candidate folder; macro map remains primary; HBM -> packaging -> systems -> cloud thin path and current/future snapshots remain visible.
- narrowed: launch-review language was too prominent and made the surface read like an internal release review tool.
- drift_risk: medium
- required_gate_change: first-screen copy and map must answer the investor's bottleneck question first; representative proof must stay as a support trust layer.
- verdict: restore-cycle, recovered before verdict

### Process Improvement

- process_learning: R4 folder existed before R4 became the mechanically targeted current candidate; quality gates can pass while checking an older candidate unless current-candidate targeting is required.
- missing_gate: R4 pre-verdict monitor output gate, current_candidate gate, R4 asset recovery gate, representative-demo UI render gate.
- template_change: cycle record now requires current_candidate_id, monitors_before_verdict, asset_recovery_targets, and stop_permission_after_r4.
- skill_change_candidate: radar-cycle now requires quality scripts to target the current candidate and representative-demo data to be visible in UI.
- mechanical_verdict_gap: repaired by retargeting package scripts and asset/data/syntax checks to R4.
- next_cycle_process_rule: R5 cannot start until R4 monitor outputs are recovered and quality scripts target R4.
- verdict: repair-before-next, recovered before verdict

### Asset Steward

- asset_map_present: true
- asset_categories_checked: product contract, product-specific skill, research/data ops, visualization/UX, business logic, process monitoring, engineering rules, scripts, R4 candidate
- skill_assets_checked: radar-cycle skill exists; R4 adds representative-demo UI visibility and current-candidate target rules
- skill_receipts_required: yes
- cycle_contributions: R4 concepts were recovered into product contract, data ops, visualization UX, business logic, process monitoring, radar-cycle skill, and quality scripts
- missing_or_stale_assets: repaired before verdict; ASSET_MAP and process assets now mention R4
- next_cycle_asset_rule: R5 must add customer proof assets, not another internal evidence panel
- verdict: repair-before-next, recovered before verdict

### Data/Sellability

- data_contract_risk: medium; representative samples and source review exist, but they are not a historical backtest
- update_cadence_gap: medium; monthly owner review exists, but paid SLA is not approved
- scenario_labeling_gap: low-medium; scenario deltas are bound to rules and labeled as scenarios
- sellability_gap: high; pricing hypothesis, legal review, payment, customer willingness-to-pay, and SLA approval are missing
- required_gate_change: R5 must capture customer-facing proof or classify legal/payment/SLA as external blockers
- stop_or_continue: continue-to-r5

## R5 Required Rule

R5 must create a new candidate folder. It must not patch `candidates/r4-representative-radar/`. Its main advancement must be customer proof: investor-facing onboarding or paid-job surface, saved/recurring update reason, willingness-to-pay capture or external blocker classification, and a clearer path from representative demo to paid product.
