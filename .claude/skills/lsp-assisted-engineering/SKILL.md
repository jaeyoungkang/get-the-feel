---
name: lsp-assisted-engineering
description: Use when making code changes in Light House where TypeScript symbols, imports, call sites, or file-level diagnostics affect the edit. Guides Codex/Claude to use LSP definition, references, workspace symbols, rename/code actions, and diagnostics as an editing aid while preserving existing quality gates, Story Chain, and Evidence Ledger completion rules.
compatibility: Claude Code, Codex, Cursor-style agents in the Light House repository.
---

# LSP Assisted Engineering Skill

Use this skill for code changes where symbol structure matters: refactors,
renames, import changes, type changes, call-site propagation, component/service
boundary edits, or ambiguous failures that may have multiple callers.

Do not use LSP as a release gate. LSP is an editing aid. Completion still comes
from the smallest honest repo gates: targeted tests, `typecheck`, `lint`,
`quality:fast`, Story Chain, Evidence Ledger, and runtime-flow docs when they
apply.

## Setup

Codex and Claude Code use separate project-level LSP setup paths.

For Codex, use the repo setup script before falling back to a private local
install:

```bash
npm run agent:lsp:install
npm run agent:lsp:check
```

`agent:lsp:install` installs the MCP server and TypeScript language server into
the git-ignored `.agent-tools/lsp-mcp` directory and prints the Codex MCP block
for `~/.codex/config.toml`. Use
`npm run agent:lsp:install -- --write-codex-config` only when it is acceptable
to update the local Codex config. The generated LSP config is derived from
`scripts/agent/lsp-mcp.config.template.json`, so clone/update behavior stays
reproducible for the team.

Claude Code uses the project `.claude/settings.json`
`typescript-lsp@claude-plugins-official` setting when the plugin is available.
Do not point Claude Code at the Codex MCP block unless the host explicitly
supports that route.

## Workflow

1. Define the edit surface.
   - Identify the primary symbol, file, or API being changed.
   - If the change is product-facing, first route through Mission Control and
     the relevant Story Chain skill.
2. Inspect structure before editing.
   - Use `definition` to find the owning declaration.
   - Use `references` to list callers, consumers, tests, and re-export paths.
   - Use `workspace symbols` when the entry point is only partially known.
   - Use `rg` alongside LSP for docs, string contracts, fixtures, i18n keys,
     Story Chain refs, and other non-symbol surfaces.
3. Edit with the symbol graph in mind.
   - Prefer LSP rename/code actions when a TypeScript symbol is being renamed.
   - Keep changes scoped to the affected callers and local conventions.
   - Do not let LSP suggestions introduce new abstractions without repo evidence.
4. Check diagnostics immediately after editing.
   - Read diagnostics for the touched files before running broad gates when the
     host exposes them.
   - Fix real diagnostics at the source. Do not suppress them to reach a green
     local state.
5. Close with normal verification.
   - Run targeted tests for the behavior changed.
   - Run `npm run format:check`, `npm run lint`, and `npm run typecheck` unless
     the change is docs-only.
   - For PR-shaped code work, prefer `npm run quality:fast`.
   - For Story Chain or Evidence Ledger edits, run the required Mission Control
     gates.

## Boundaries

- LSP diagnostics passing does not prove data flow, user-facing behavior, or
  Acceptance Check trace.
- LSP may miss generated types, framework constraints, runtime effects, and
  markdown contracts. Use repo scripts for those.
- If LSP output conflicts with existing repo contracts, trust the contract and
  investigate the mismatch instead of following the tool blindly.
- If the host does not expose LSP tools, use the closest available structure:
  `rg`, TypeScript compiler output, editor diagnostics, and targeted tests.

## Reporting

When LSP materially shaped the edit, mention it briefly in the final response:
which symbol or callers were checked, and which verification commands closed the
work. Do not report raw diagnostic dumps unless the user asked for them.
