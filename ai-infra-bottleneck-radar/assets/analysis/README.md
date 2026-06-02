# AI Infra Bottleneck Radar Analysis

This folder records the R1-R14 completed loop history and the R15-start state for later process analysis. It is intentionally split by audit concern so product decisions, process decisions, monitor behavior, and reusable asset growth can be reviewed independently.

## Documents

- `round-history.md`: round-by-round product decisions and outcomes.
- `major-decisions.md`: major product, process, sellability, and asset decisions.
- `subagent-monitoring.md`: subagent roles, observed behavior, and process impact.
- `lessons-and-assets.md`: major learnings and how they were recovered into assets, skills, and gates.
- `process-analysis.md`: process diagnosis, recurring failure patterns, and remaining audit questions.

## Scope

- Completed candidate range: R1 through R14.
- Started but not completed: R15 `candidates/r15-market-test-radar/`.
- Latest completed URL: `http://localhost:4173/ai-infra-bottleneck-radar/candidates/r14-paid-onboarding-radar/`.
- Latest completed commit: `6f85dde Add paid onboarding radar candidate`.

## Current Verdict

R14 is internally valid but not sellable.

- `quality:check`: pass.
- `quality:final`: expected fail.
- `sellable_status`: blocked.
- `allowed_to_stop`: no.
- Next required candidate: R15 market-test.

## Audit Position

The key finding is not that 15 rounds produced a sellable product. They did not. The key finding is that the loop gradually separated five states that were previously conflated:

- local candidate validity,
- representative demo quality,
- feedback readiness,
- external market proof,
- sellable paid-service readiness.

The process became meaningfully stronger after R8-R10, when stop permission, monitor receipt, exact next-candidate binding, and skill/asset recovery became mechanical rather than narrative.
