# Round History

## R1 — Macro Radar

Candidate: `candidates/r1-macro-radar/`

Primary decision:
- Start from the original ask: ordinary stock investors need an easy macro view of AI infrastructure bottlenecks.
- Use a macro map as the primary product surface.
- Adopt the thin path: HBM memory -> advanced packaging -> systems/network -> cloud capacity.
- Treat the first viewport as the product promise, not as a dashboard summary.

Learning:
- Four cards, company lists, and KPI panels are not enough. The first viewport must be a map-first bottleneck surface.
- Paid release is blocked by manual source review, unvalidated pressure index, missing update owner, and missing compliance boundary.
- The original request was not “show AI stocks”; it was “make the AI supply-chain bottleneck state visible.”

## R2 — Operations Radar

Candidate: `candidates/r2-operations-radar/`

Primary decision:
- Add update owner, computed freshness, source references, and scenario rule bindings.
- Convert the “regularly updated” promise into explicit fields.

Learning:
- Regular update, time change, and future snapshot promises require a data operating contract, not only UI copy.
- Scenario values must be mechanically tied to scenario bindings.
- Freshness without an owner is decorative; it does not support a paid recurring product.

## R3 — Validation Radar

Candidate: `candidates/r3-validation-radar/`

Primary decision:
- Add formula components, weighted pressure checks, and validation samples.
- Make pressure scores inspectable rather than opaque.

Learning:
- Bottleneck pressure scores must be inspectable.
- A local validation sample is useful, but it is not a backtest.
- Paid release remains blocked without historical calibration/backtest and compliance review.
- The product can be easier to understand only if the trust boundary is also easy to inspect.

## R4 — Representative Radar

Candidate: `candidates/r4-representative-radar/`

Primary decision:
- Promote from local candidate to representative demo.
- Add source review queue, representative calibration samples, and non-advice compliance checklist.
- Keep the macro view investor-facing while exposing enough proof machinery for review.

Learning:
- A representative demo must expose why the score can or cannot be trusted.
- Representative demo is still not paid service.
- The first viewport must remain investor-facing, not launch-review language.
- This round established the distinction between demo acceptance and sellability.

## R5 — Customer Proof Radar

Candidate: `candidates/r5-customer-proof-radar/`

Primary decision:
- Add customer proof layer, recurring watch routines, pricing hypotheses, and customer capture blockers.
- Introduce the first explicit customer-behavior surface.

Learning:
- Customer-facing product proof needs a reason to return and a way to test willingness to pay.
- Pricing hypothesis is not validated demand.
- Capturing local feedback is useful for an interview script, not enough for demand proof.

## R6 — External Proof Radar

Candidate: `candidates/r6-external-proof-radar/`

Primary decision:
- Classify real customer capture, payment approval, legal review, and paid SLA as external blockers.
- Refuse the idea that external blockers allow the agent to stop.

Learning:
- External blockers are launch blockers, not stop permission.
- Recording external blockers does not mean the product loop is complete.
- The process failure was more important than the product gap: the agent could hide behind external blockers.

## R7 — Feedback-Ready Radar

Candidate: `candidates/r7-feedback-ready-radar/`

Primary decision:
- Add visible feedback capture, routine choices, pricing choices, and next evidence path.
- Register product-level sellability as a separate skill/asset concern.

Learning:
- Local feedback makes the candidate feedback-ready, not sellable.
- The macro map must remain primary while feedback is subordinate.
- This round made the product showable for feedback while still refusing paid readiness.

## R8 — Conversion/Public-Test Radar

Candidate: `candidates/r8-conversion-ready-radar/`

Primary decision:
- Add public-test signal, report copy, and JSON export.
- Add a final response gate so passing local checks cannot be treated as completion.

Learning:
- Public-test/conversion controls must not replace the macro bottleneck promise.
- Exported local signals are evidence candidates, not validated demand.
- This is where the loop started to become mechanically safer: `quality:check` and `quality:final` diverged.

## R9 — Subscription-Ready Radar

Candidate: `candidates/r9-subscription-ready-radar/`

Primary decision:
- Add saved monthly radar, sample paid report, and subscription-like price intent.
- Make repeat-use and paid job framing more visible.

Learning:
- Subscription UI can make the recurring paid job clearer.
- Local subscription intent is still not paid demand.
- A subscription-shaped interface is only a product hypothesis until external behavior exists.

## R10 — Paid-Proof Radar

Candidate: `candidates/r10-paid-proof-radar/`

Primary decision:
- Add paid-proof packet, proof boundary, and external evidence path.
- Add `assets/customer-evidence.md`.
- Turn proof preparation into a reusable asset instead of one-off UI text.

Learning:
- A packet can prepare customer interview, waitlist, or payment-intent capture.
- It must refuse completed payment, legal approval, and staffed SLA claims.
- The product can package evidence requests, but cannot manufacture evidence.

## R11 — External-Proof Radar

Candidate: `candidates/r11-external-proof-radar/`

Primary decision:
- Add explicit customer interview, waitlist, and payment-intent capture paths.
- Mark each path as `external_required` and `not_captured`.

Learning:
- External proof path is not external proof.
- Each path remains `external_required` and `not_captured` until real evidence exists.
- LocalStorage became an explicit non-proof boundary.

## R12 — Sellable-Boundary Radar

Candidate: `candidates/r12-sellable-boundary-radar/`

Primary decision:
- Add explicit sellable-boundary decision and keep it blocked.
- Force the UI and cycle record to say “not sellable” instead of implying it.

Learning:
- Sellability must be a visible decision, not an implied conclusion.
- Local exports cannot pass sellability.
- Missing external evidence, payment, legal review, and staffed SLA keep the product blocked.
- This round made blocked sellability a product feature: honest boundary display.

## R13 — Operator-SLA Radar

Candidate: `candidates/r13-operator-sla-radar/`

Primary decision:
- Add operator SLA owner/cadence/staffing/review-window boundary.
- Treat monthly update credibility as an operational product requirement.

Learning:
- A recurring update product cannot be sold unless the monthly source review operation is credible.
- Candidate owner/cadence is not staffed paid operation.
- The product promise shifted from “data exists” to “an operation can keep it current.”

## R14 — Paid-Onboarding Radar

Candidate: `candidates/r14-paid-onboarding-radar/`

Primary decision:
- Add paid onboarding steps while keeping payment and SLA blocked.
- Add `skills/paid-onboarding-boundary/SKILL.md`.
- Make checkout-like steps reviewable without allowing them to imply paid launch.

Learning:
- Paid onboarding can be reviewable without being sellable.
- Payment step remains `blocked_external_required`.
- SLA step remains `blocked_not_staffed`.
- Checkout-like UI needs a reusable skill boundary.
- This round recovered a new product-making skill from a repeated risk: onboarding can masquerade as readiness.

## R15 — Market-Test Radar

Candidate: `candidates/r15-market-test-radar/`

Status:
- Folder created.
- Not current candidate yet.
- No R15 data/asset/cycle verification yet.
- Not included in the current committed product verdict.

Required direction:
- Build a market-test surface without claiming sellability unless external evidence exists.
- Use R15 to test market behavior, not to polish local proof again.
