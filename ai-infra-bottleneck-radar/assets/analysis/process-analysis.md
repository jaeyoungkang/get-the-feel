# Process Analysis

## What Improved

### Stop Permission Became Mechanical

Before:
- The loop could stop after a candidate passed local quality checks.

After:
- `quality:final` fails unless `sellable_status: pass` and `allowed_to_stop: yes`.
- Non-sellable cycles must name the next fresh candidate.

Assessment:
- This is the most important process repair. It directly addresses the repeated failure where the loop stopped after local progress.

### Monitor Feedback Became Process Input

Before:
- Subagent feedback could stay in chat.

After:
- Monitor output must be received.
- Missing monitor output blocks cycle closure.
- Monitor findings are recovered into assets, scripts, or skills.

Assessment:
- This turned subagents from advisory reviewers into sources of process mutations.

### Next Candidate Became Exact

Before:
- `next_action` prose could point to the wrong candidate.

After:
- Exact ID/path/advancement/binding fields are required.
- `check-cycle-record.mjs` verifies them.

### Product Learning Became Assets

Before:
- Learning could live as narrative only.

After:
- Product contract, data ops, UX, business logic, process monitoring, customer evidence, and skill registry are updated.

Assessment:
- Asset growth became the durable output of each round. Without this, later rounds repeated earlier mistakes.

## Recurring Failure Patterns

### Local Validity Confused With Completion

Pattern:
- Candidate passes local checks.
- Agent reports completion.

Repair:
- `quality:final` added.

### External Blockers Used As Stop Reason

Pattern:
- Real customer/payment/legal/SLA dependencies are outside session.
- Agent treats this as reason to stop.

Repair:
- External blockers do not grant stop permission.

### Candidate Substitution Drift

Pattern:
- Mechanical copy/replace creates self-referential next candidate fields.

Repair:
- Exact next-candidate binding fields added.
- Monitor binding checked field added.

### Asset Lag

Pattern:
- Candidate data/scripts evolve faster than assets.

Repair:
- Asset Steward checks stale labels and missing asset updates.
- R14 added a dedicated paid-onboarding skill after Asset Steward flagged the gap.

### UI Drift Toward Conversion

Pattern:
- As product gets closer to paid flow, conversion/onboarding panels become prominent.

Repair:
- Intent Guardian requires macro map first.

## Subagent Effectiveness

Most effective role:
- Process Improvement Monitor.

Reason:
- It caught mechanical stop and next-candidate defects that the main agent repeatedly missed.

Second most effective:
- Asset Steward Monitor.

Reason:
- It prevented data/script-only fixes from being mistaken for process maturity.

Intent Guardian value:
- It maintained original macro-map promise during later sellability/onboarding cycles.

## Weaknesses Still Present

### R15 Is Started But Not Governed Yet

Risk:
- R15 folder exists but is not current candidate and has no verified cycle.

Required:
- Retarget scripts to R15.
- Create R15-specific data contract.
- Run monitors.
- Commit only after gates pass.

### Skills Are Still Reactive

Risk:
- New skills are created after failure patterns appear.

Acceptable for now:
- The user explicitly stated engineering constraints and skill growth should intensify as project size grows, not necessarily from the first round.

### No Browser Screenshot Gate Yet

Risk:
- HTTP and syntax pass do not prove visual quality.

Potential trigger:
- If R15 adds richer market-test UI, introduce a browser smoke/screenshot gate.

### External Evidence Still Absent

Risk:
- Product remains not sellable regardless of local UX sophistication.

Required:
- R15 market test should create a path for real evidence, but must not claim it exists unless it does.

### Sellability Still Blocked

Risk:
- The candidate can be shown to collect customer feedback, but it is not ready to sell as a paid web service.

Required:
- Real market signal outside localStorage.
- Payment route approval.
- Legal/non-advice review.
- Staffed update/SLA operation.

## Audit Questions For Future Review

- Did each round create a fresh candidate folder?
- Did each round preserve the macro map first?
- Did each round add at least one asset contribution?
- Did monitor findings become gates/assets/skills?
- Did any cycle claim sellability without external evidence?
- Did scripts target the current candidate before verdict?
- Did `quality:final` fail whenever sellability was blocked?
- Did next-candidate fields avoid self-reference?
- Did each subagent finding become a changed gate, skill, asset, or explicit rejected non-change?
- Did the candidate become more testable in the market, not merely more visually polished?

## Bottom Line

The spiral loop became effective only after process defects were made mechanical. The product improved, but the stronger result is that the process now catches several failure modes:

- premature stopping,
- stale monitor text,
- self-referential next candidates,
- asset lag,
- local proof mistaken as external proof,
- onboarding mistaken as checkout.

The product is not yet sellable. The process is now better positioned to continue without silently treating non-sellable progress as completion.

## R15 Audit Starting Point

R15 exists only as a started folder at this analysis point. The next legitimate loop must:

- make R15 the current candidate in cycle records and scripts,
- preserve the macro bottleneck map as first viewport,
- add a real market-test surface,
- keep external evidence marked as not captured until it exists,
- run monitors and recover findings before verdict,
- keep `quality:final` failing if sellability remains blocked.
