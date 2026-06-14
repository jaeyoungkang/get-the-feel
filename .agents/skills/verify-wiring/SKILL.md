---
name: verify-wiring
description: Verify implementation wiring after code changes. Use when new fields, params, schema entries, prompt return values, or feedback loops were added and you need to confirm generation-to-consumption paths are fully connected.
compatibility: Designed for Claude Code and OpenAI Codex. Requires git and rg for best results.
---

# Goal

Confirm that a change is not only defined or generated, but actually consumed in behavior.

## Inputs

- Default scope: current working tree diff against `HEAD`
- If the user provides paths, modules, or a commit range, narrow the search to that scope first

## Workflow

1. Read [references/program.md](references/program.md) for the full checklist.
2. Extract newly added fields, params, state entries, prompt contracts, or loop edges from the chosen diff or files.
3. Trace each item from creation to first meaningful consumption.
4. Treat logging, persistence, or pass-through plumbing alone as insufficient consumption unless they change later behavior.
5. For LLM-returned fields, verify the prompt contract still asks for the field and that schema or examples match.
6. For cyclic flows, verify the value comes back into later planning, control flow, or decision-making.
7. Produce a compact report table:

| item | generated | consumed | verdict | note |
|------|-----------|----------|---------|------|

## Search Hints

- Prefer `rg` for code search.
- Start from `git diff`, schema files, types, adapters, prompt templates, and orchestrator edges.
- Check both production code and tests. Test-only references do not prove runtime wiring.
- When the same value is renamed across layers, trace the mapping before calling it missing.

## Output Rules

- Findings come first, ordered by severity.
- Include file and line references when available.
- Use these verdicts:
  - `missing-consumer`
  - `prompt-contract-missing`
  - `feedback-loop-broken`
  - `logging-only`
  - `connected`
- If everything is connected, say that explicitly and note any residual uncertainty.
