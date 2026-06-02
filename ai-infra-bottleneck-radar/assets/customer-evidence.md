# Customer Evidence

## Purpose

Turn local product intent into an external proof path without pretending that payment, legal approval, or paid operations already exist.

## R10 Paid-Proof Packet Rule

A paid-proof candidate must export a packet that can be used in a real customer interview, waitlist, or payment-intent screen.

Required fields:

- selected bottleneck stage
- selected snapshot
- routine choice
- price intent
- use case
- contact hint
- proof boundary
- external evidence path

## Refusals

- Do not claim validated paid demand from local storage.
- Do not claim payment approval without an approved payment flow.
- Do not claim legal approval without external review.
- Do not claim paid SLA without staffed update operations.

## Next Promotion Boundary

R10 may become a paid-proof local candidate. It cannot become a sellable paid service until at least one external evidence path produces real customer/payment-intent evidence and legal/payment/SLA blockers are resolved or explicitly scoped out.

## R11 External-Proof Path Rule

An external-proof candidate must show where the packet goes next:

- customer interview
- waitlist form
- payment-intent screen

Each path remains `external_required` and `not_captured` until evidence exists outside localStorage.

Sellability cannot pass from a local packet alone. The next promotion boundary requires external evidence outside localStorage plus payment/legal/SLA resolution or explicit product-level narrowing.

## R12 Sellable-Boundary Rule

A sellable-boundary candidate must make the current decision explicit.

Required decision fields:

- current decision
- decision reason
- pass conditions
- blocked conditions

If external evidence is absent or only localStorage exists, the decision must remain `blocked`.

## R14 Paid-Onboarding Boundary Rule

Paid onboarding is evidence preparation, not paid proof.

The candidate may show:

- choose bottleneck,
- choose routine,
- review non-advice/source boundary,
- payment step,
- SLA step.

The payment step remains `blocked_external_required` and the SLA step remains `blocked_not_staffed` until real approval/staffing exists. Local onboarding review cannot make `sellable_status` pass.
