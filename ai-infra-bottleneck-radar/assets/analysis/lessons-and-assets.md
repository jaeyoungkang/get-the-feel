# Lessons And Asset Growth

## Product Contract

Path: `assets/product-contract.md`

Growth:
- Macro map acceptance.
- Representative demo acceptance.
- Customer proof acceptance.
- Feedback-ready acceptance.
- Public-test acceptance.
- Subscription-ready local acceptance.
- Paid-proof local acceptance.
- External-proof path acceptance.
- Sellable-boundary acceptance.
- Operator-SLA acceptance.
- Paid-onboarding acceptance.

Main lesson:
- The user promise must stay stable while support surfaces evolve.

## Data Operations

Path: `assets/research-data-ops.md`

Growth:
- Source/freshness display contract.
- Update owner and freshness computation.
- Formula components and validation samples.
- Source review and representative calibration.
- Customer proof data rules.
- Feedback-ready data rules.
- Public-test data rules.
- Subscription data rules.
- Paid-proof data rules.
- External-proof data rules.
- Sellable-boundary data rules.
- Operator-SLA data rules.
- Paid-onboarding data rules.

Main lesson:
- Every UI claim needs a corresponding data contract.

## Visualization UX

Path: `assets/visualization-ux.md`

Growth:
- Map-first visual grammar.
- Rejection of KPI-card primary surface.
- Validation surface rule.
- Representative demo surface rule.
- Customer proof surface rule.
- Feedback surface rule.
- Public-test surface rule.
- Subscription surface rule.
- Paid-proof surface rule.
- External-proof surface rule.
- Sellable-boundary surface rule.
- Operator-SLA surface rule.
- Paid-onboarding surface rule.

Main lesson:
- Support controls are allowed only below or beside the map, never as replacement for macro bottleneck analysis.

## Business Logic

Path: `assets/business-logic.md`

Growth:
- R1-R14 sellability verdicts.
- Clear separation between local candidate, representative demo, customer-testable candidate, and sellable paid service.

Main lesson:
- The product can become increasingly testable while still not sellable.

## Customer Evidence

Path: `assets/customer-evidence.md`

Growth:
- Paid-proof packet rule.
- External-proof path rule.
- Sellable-boundary rule.
- Paid-onboarding boundary rule.

Main lesson:
- Local evidence prepares external proof. It does not replace external proof.

## Process Monitoring

Path: `assets/process-monitoring.md`

Growth:
- Required monitor roles.
- Fresh candidate rules.
- Final response gate.
- Product-level sellability skill rule.
- R7-R14 closure rules.
- Exact next-candidate binding.
- Monitor output receipt and timeout policy.

Main lesson:
- Process rules must be written where the loop actually checks them.

## Skill Registry

Path: `assets/skill-registry.md`

Current registered product skills:
- `skills/radar-cycle/SKILL.md`
- `skills/macro-bottleneck-visualization/SKILL.md`
- `skills/source-backed-bottleneck-data/SKILL.md`
- `skills/feedback-ready-product-surface/SKILL.md`
- `skills/product-level-sellability/SKILL.md`
- `skills/paid-onboarding-boundary/SKILL.md`

Main lesson:
- A repeated decision is not an asset until it has a skill or a mechanical gate.

Skillization history:
- Macro map preservation became `macro-bottleneck-visualization`.
- Source/freshness/formula rules became `source-backed-bottleneck-data`.
- Feedback/routine/pricing readiness became `feedback-ready-product-surface`.
- Stop permission and sellability separation became `product-level-sellability`.
- Paid onboarding boundary became `paid-onboarding-boundary`.
- Fresh candidate and cycle closure discipline became `radar-cycle`.

## Mechanical Gates

Current scripts:
- `scripts/check-assets.mjs`
- `scripts/check-data-contracts.mjs`
- `scripts/check-cycle-record.mjs`
- `scripts/check-final-permission.mjs`

Main lesson:
- The loop needs both candidate validity and stop-permission validity.

What the gates currently enforce:
- Required asset files exist.
- Candidate data contracts are present.
- Cycle record names the current candidate and next candidate correctly.
- Monitor receipt and timeout policy are recorded.
- `quality:final` fails unless sellability and stop permission pass.

## Asset Growth Summary

Early rounds:
- Product and data structure grew.

Middle rounds:
- Sellability and customer evidence boundaries grew.

Later rounds:
- Process gates, exact next-candidate binding, monitor receipt, and skills grew.

Current asset maturity:
- Product contract: strong.
- Data ops: strong for local/demo/proof boundaries.
- UX rules: strong for map-first preservation.
- Business logic: strong for blocked sellability reasoning.
- Process monitoring: strong, but continues to grow when new failure modes appear.
- Skills: useful and growing; paid onboarding is now skillized.

Remaining asset gaps:
- No external evidence capture integration exists yet.
- No browser screenshot or visual regression gate exists yet.
- No staffed operation ledger exists for the update SLA.
- No payment/legal approval asset exists because those are external-required and must not be faked locally.
