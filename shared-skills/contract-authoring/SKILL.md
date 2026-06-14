---
name: contract-authoring
description: Turn a rough product idea into approved upstream Story Chain contract docs through guided Q&A. Use when the user wants the agent to interview them, structure answers, and produce `PRODUCT`, `design-principles`, Experience, Moment, Promise, Aspect, Acceptance Check, and `feature-specs` style outputs before bootstrap or code. If the user already has a real source, ground the contract in that source without turning this skill into implementation work.
compatibility: Designed for Claude Code and OpenAI Codex. Works best when the repository already has product doc templates or a clear target package.
---

# Goal

Help the user move from vague idea to approved upstream contract docs before implementation starts.

This is still an upstream planning skill.

- Primary job: define and revise contract docs
- Optional extension: ground those docs in a real source when the product idea already depends on one
- Not this skill's job: implement the product, write downstream code, or act as a general project operator

## When To Use

- The user has an idea but not a stable product definition
- The user wants the agent to ask questions and structure the answers
- The user wants contract docs before specs or code
- The user wants approval-driven drafting instead of direct implementation

## Workflow

1. Read [references/program.md](references/program.md).
2. If needed, read these references:
   - [references/rounds.md](references/rounds.md) for question sequencing
   - [references/artifact-gates.md](references/artifact-gates.md) for draft sufficiency and stop conditions
   - [references/approval-language.md](references/approval-language.md) for how to run approval loops compactly
   - [references/source-grounding.md](references/source-grounding.md) when the user provides a real source link, meeting, article, or dataset to ground the contract
   - [references/canonical-promotion.md](references/canonical-promotion.md) when draft artifacts need to be promoted into canonical docs
3. Identify the target output package:
   - Prefer existing repo templates if present
   - In agentic-base, prefer `PRODUCT`, `design-principles`, Story Chain nodes, and `feature-specs`
   - Do not produce legacy `user-stories` unless the user explicitly targets a non-Story-Chain repository
4. Choose the current mode:
   - `greenfield`
   - `revision`
   - `handoff`
5. Run a guided interview in small rounds.
6. Summarize what is approved, ambiguous, blocked, and still unresolved.
7. Draft only the artifacts supported by current evidence.
8. Ask for explicit approval before treating draft content as final input to implementation work.

## Guardrails

- Do not jump to code or implementation plans before the product contract is coherent.
- Do not ask a giant questionnaire in one message. Ask 1-3 high-signal questions per round.
- Do not silently fill major gaps with confident invention. Mark unresolved items explicitly.
- Treat the user as approver, not as a transcription clerk. The agent should draft; the user should approve or redirect.
- If templates exist in the repo, follow them instead of inventing a new output shape.
- Always declare the current stage before a new round: `discover`, `draft`, `approve`, or `handoff`.
- Prefer the smallest stable next artifact. If `PRODUCT` is not stable, do not draft Story Chain nodes.
- When the user gives terse approvals like `이건 승인`, `이건 빼`, `보류`, or `다음으로`, treat them as approval commands rather than asking the same question again.
- When the user provides a real source, lock the source metadata first before continuing the draft.
- When a large new feature appears midstream, switch to `revision` mode instead of pretending the original package is still stable.
- If draft docs were written outside canonical paths, do not assume the job is done. Run a separate promotion step or leave an explicit handoff.
