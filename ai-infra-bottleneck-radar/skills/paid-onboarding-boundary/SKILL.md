---
name: paid-onboarding-boundary
description: Use before adding paid onboarding, checkout-like, payment-intent, or subscription-start surfaces. Keeps onboarding reviewable while refusing completed payment, launch approval, or staffed SLA claims.
compatibility: AI infra bottleneck radar product cycles.
---

# Goal

Paid onboarding can make the product easier to test, but it can also falsely imply that the service is sellable. This skill keeps paid onboarding as a blocked review path unless payment, legal, market evidence, and operator SLA are actually ready.

## Required Receipt

- skill: `skills/paid-onboarding-boundary/SKILL.md`
- loaded_at_step
- candidate_id
- onboarding_status
- blocked_payment_status
- blocked_sla_status
- non_advice_ack_required

## Gates

- Paid onboarding stays below the macro bottleneck map.
- Payment step remains `blocked_external_required` unless an approved payment flow exists.
- SLA step remains `blocked_not_staffed` unless a staffed operation exists.
- Non-advice/source-boundary acknowledgement is required.
- `sellable_status` remains blocked when onboarding is reviewable but payment/SLA are blocked.

## Refusals

- Do not present paid onboarding as completed checkout.
- Do not imply legal, payment, or SLA approval from local UI.
- Do not let onboarding replace bottleneck severity, propagation, snapshots, or source/trust evidence.
