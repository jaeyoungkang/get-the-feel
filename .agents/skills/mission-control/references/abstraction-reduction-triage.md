---
name: mission-control-abstraction-reduction-triage
description: Decide whether an observed mismatch should reduce an abstraction before adding more guards.
---

# Abstraction Reduction Triage

When a mismatch appears, first ask whether the abstraction shape made the wrong
behavior possible. Prefer simplifying or moving the boundary over adding
negative advice and regression guards.

## Decision Path

1. Identify the user-visible mismatch.
2. Trace the producing code path.
3. Ask which abstraction owned the wrong responsibility.
4. If the abstraction has weak purpose, remove or narrow it.
5. If the abstraction is still necessary, add the smallest positive invariant
   and deterministic test.
6. Reflect the decision in the covering Evidence Ledger and, if cross-cutting,
   the relevant Aspect.

Do not add "never do X" advice to an Aspect or Evidence Ledger until reduction has
been considered.
