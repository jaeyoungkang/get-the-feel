# Subagent Monitoring History

## Role Model

The loop used subagents as monitors, not product builders.

Core monitor roles:

- Intent Guardian: protect original user intent.
- Process Improvement Monitor: find loop/gate/process defects.
- Asset Steward Monitor: verify asset growth and stale assets.
- Data/Sellability perspective: reflected in data gates and cycle records.

Monitoring objective:
- The monitors were meant to improve the spiral process, not merely critique the candidate UI.
- The strongest monitor output was the kind that changed a gate, skill, or reusable asset.

## Intent Guardian

Primary behavior:
- Checked whether the macro bottleneck map remained primary.
- Watched for drift toward conversion, subscription, proof, onboarding, or checkout pages.

Common verdict:
- `preserve`

Common risk:
- `drift_risk: medium`

Repeated required gate:
- The first viewport must answer highest bottleneck, propagation path, current/future change, and source/trust boundary before any support controls.

Important observations:
- R8/R9: public-test and subscription surfaces risked replacing the map.
- R10/R11: paid-proof and external-proof layers were acceptable only as subordinate evidence paths.
- R12/R13/R14: sellable boundary, operator SLA, and paid onboarding were acceptable only below the map.

Impact:
- Kept the product anchored to the original macro map requirement.
- Prevented paid/conversion surfaces from becoming the product's primary identity.

Process contribution:
- Converted “preserve original intent” from a general reminder into a first-viewport gate.

## Process Improvement Monitor

Primary behavior:
- Checked whether the loop could wrongly stop.
- Audited `quality:final`, `allowed_to_stop`, exact next-candidate fields, and monitor receipts.

Major findings:

1. `quality:check` is not enough.
   - A valid candidate can still be non-sellable.
   - Result: `quality:final` became required before completion-style final response.

2. Monitor timeout cannot count as monitor output.
   - Result: `monitor_outputs_received` and `monitor_timeout_policy` became required.

3. Prose next action is too weak.
   - Result: `next_candidate_id`, `next_candidate_path`, and `next_candidate_primary_advancement` became required.

4. Monitor body can contradict top-level fields.
   - Result: `next_candidate_binding_checked` became required.

5. Non-sellable cycles must bind to a specific next candidate.
   - Result: scripts began checking exact next candidate id/path.

Impact:
- Process Improvement Monitor produced the strongest recurrence-prevention improvements.
- Its most useful feedback was not product UI feedback but gate defects.

Process contribution:
- Produced the mechanical distinction between a valid candidate and a stoppable product loop.

## Asset Steward Monitor

Primary behavior:
- Checked whether learning became reusable assets.
- Audited `ASSET_MAP`, `skill-registry`, product contract, data ops, UX, business logic, process monitoring, and skills.

Major findings:

1. Skills must be assets.
   - Product-making skills were added and registered.

2. Stale labels are process risks.
   - R11/R12/R13 repeatedly surfaced stale R9/R10/R11 text in current candidate or asset docs.

3. Local evidence needs a customer-evidence asset.
   - Result: `assets/customer-evidence.md`.

4. Paid onboarding needs a dedicated skill.
   - Result: `skills/paid-onboarding-boundary/SKILL.md`.

5. Data/script enforcement is not enough.
   - Asset Steward required the same learning to be reflected in product contract, data ops, UX, business logic, process monitoring, skill registry, and Asset Map.

Impact:
- Prevented “code grew but assets did not” failure.
- Forced reusable product knowledge into skills and asset maps.

Process contribution:
- Made asset growth an auditable loop output. The important question became: “What reusable asset did this round create or improve?”

## Data/Sellability Perspective

Primary behavior:
- Checked evidence boundaries, paid claims, source/freshness contracts, and blocked sellability.

Repeated conclusions:
- Local feedback is not paid demand.
- LocalStorage is not external evidence.
- Payment approval must remain external-required.
- Legal review must remain external-required.
- Staffed SLA must remain blocked until real staffing exists.
- Sellability remains blocked despite increasingly sophisticated product surfaces.

Impact:
- Kept the product honest.
- Prevented false paid-launch claims.

Process contribution:
- Forced external proof, payment, legal, and SLA boundaries to remain blocked unless real evidence exists.

## Subagent Failure Patterns

### Timeout And Shutdown

Issue:
- Some monitors timed out or were shut down without output.

Repair:
- Missing monitor output means cycle not closed.
- Timeout can be recorded as blocker, not evidence.

### Stale Monitor Text

Issue:
- A monitor could report the wrong next candidate in its prose.

Repair:
- `next_candidate_binding_checked` was added.

### Base-Vocabulary Convergence

Issue:
- Monitors can echo process vocabulary without judging the actual product.

Repair:
- Prompts emphasized external product surface terms: UI, market, data, customer behavior, visual surface, sellability.

## Overall Effectiveness Assessment

The subagents did not make the early rounds sufficiently strong. Their feedback became effective only after their observations were recovered into mechanical process assets:

- `quality:final` for stop permission,
- monitor receipt fields,
- exact next-candidate fields,
- stale asset checks,
- skill registry updates,
- paid-onboarding boundary skill.

Therefore the process lesson is clear: subagent feedback is not valuable merely because it is collected. It becomes valuable only when the next loop is mechanically forced to obey the recovered learning.
