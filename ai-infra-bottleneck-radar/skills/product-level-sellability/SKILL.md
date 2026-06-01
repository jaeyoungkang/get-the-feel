---
name: product-level-sellability
description: Use for AI Infra Bottleneck Radar cycles when deciding whether a candidate is sellable enough to stop or must continue. Forces product-level judgment only: customer feedback readiness, repeat-use workflow, pricing evaluation path, and macro-map promise preservation. Business/legal/payment blockers can be recorded but cannot stop the product loop.
---

# Goal

Prevent the product loop from stopping because external launch blockers were recorded.

This skill judges product-level sellability only. A candidate can mention legal, payment, or SLA blockers, but those are launch blockers, not proof that the product surface is sellable.

## When To Use

- Before writing `sellable_status`.
- Before writing `allowed_to_stop`.
- When a cycle claims customer proof, pricing, onboarding, feedback, or paid readiness.
- When the agent is tempted to stop because legal/payment/customer capture is outside the session.

## Workflow

0. **Skill Load Receipt** — record this skill path, candidate id, and required gates in `assets/CYCLE_RECORD.md`.
1. **Product Surface Check** — first viewport must preserve the macro AI bottleneck map promise.
2. **Feedback Readiness Check** — the product must include a user-visible way to capture or structure feedback. Static blocker text is not enough.
3. **Repeat-Use Check** — the product must show why an ordinary investor would return on a cadence.
4. **Pricing Evaluation Check** — pricing must be testable by the product surface, not only described as a hypothesis.
5. **Stop Rule** — set `allowed_to_stop: yes` only if product-level `sellable_status: pass`.
6. **Continue Rule** — if any product-level check fails, set `allowed_to_stop: no` and name the next fresh candidate folder.
7. **Business Blocker Rule** — legal, payment, SLA, and human customer-capture blockers may be recorded, but they cannot turn `allowed_to_stop` to `yes`.

## Required Verdict Fields

- product_feedback_readiness: pass / blocked
- repeat_use_readiness: pass / blocked
- pricing_evaluation_readiness: pass / blocked
- macro_promise_preserved: pass / blocked
- product_level_sellable_status: pass / blocked
- allowed_to_stop: yes / no
- next_action:

## Never

- Never mark `allowed_to_stop: yes` while product-level sellability is blocked.
- Never use external business blockers as product-loop stop permission.
- Never let a pricing or blocker panel replace the macro bottleneck map.
- Never close a cycle without a next fresh candidate when product-level sellability is blocked.
