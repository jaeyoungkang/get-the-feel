---
name: engineering-profile
description: Define an approved engineering profile before implementation starts. Use when stack choice alone is not enough and the project needs decisions about runtime, deployment, data, security, privacy, observability, quality gates, release, cost, and other non-business constraints that shape implementation.
compatibility: Designed for Claude Code and OpenAI Codex. Works best when product contract docs already exist or are nearly stable.
---

# Goal

Turn a product contract into an approved engineering profile that is safe enough to guide downstream implementation.

This is not a pure stack picker.

- Primary job: close engineering constraints outside business logic
- Secondary job: reveal unresolved operational or governance risks before code starts
- Not this skill's job: implement features or silently redefine product intent

## When To Use

- `PRODUCT` or equivalent contract docs exist, but implementation would still be underspecified
- The team needs more than "React or Next?" and must lock deployment, security, data, or quality assumptions
- The user asks for technical stack and non-business considerations together
- A repo has implementation pressure, but no stable engineering profile yet

## Workflow

1. Read [references/program.md](references/program.md).
2. Read [references/profile-dimensions.md](references/profile-dimensions.md).
3. Lock the upstream contract first:
   - product identity
   - target usage pattern
   - hard constraints
   - known unresolved product questions
4. Identify which engineering dimensions are actually blocking implementation.
5. Run a compact approval loop on those dimensions.
6. Classify outcomes explicitly:
   - `locked`
   - `R&D required`
   - `unresolved`
7. Produce the smallest stable engineering profile the repo can use downstream.

## Output Preference

- Prefer existing repo engineering docs or templates if they already exist.
- If no target template exists, produce a compact profile that covers:
  - stack and runtime
  - deploy topology
  - data and storage
  - security and privacy
  - observability and analytics
  - quality gates and release policy
  - cost, vendor, and ops constraints
- The profile should make `locked`, `R&D required`, and `unresolved` visible instead of hiding uncertainty in prose.

## Guardrails

- Do not ask every dimension if the product clearly does not need it yet. Focus on actual blockers.
- Do not turn missing engineering decisions into random defaults without marking them unresolved.
- Do not let implementation-propagation start from a vague engineering profile if runtime or deployment choices materially affect the code path.
- If the repo already has canonical engineering docs, fit the profile into them instead of inventing a parallel artifact.
- If visualization, interaction, or another expressive surface is product-defining, do not prematurely lock a library choice. Close the surface profile first, then choose the library.
- If a product characteristic materially changes architecture or library choice, run a focused deep dive on that characteristic instead of forcing a shallow stack decision.
- If the profile is mostly stable but still too abstract for safe bootstrap, hand off to `sample-first` instead of pretending more prose alone will close it.
