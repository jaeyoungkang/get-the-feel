# Verification Gates

agentic-base keeps only the mechanical gates it actually owns. Heavier gates
are added after bootstrap when a selected stack and real implementation surface
exist.

## Base Gate

```bash
npm run quality:base
```

`quality:base` runs:

- `npm run guard:skills` — generated skills match `shared-skills/`
- `npm run pk:validate` — project memory, event log, and change log shape
- `npm run contract-maps:check` — Contract Map local links and README index
- `npm run mc:audit-surface` — Story Chain surface audit
- `npm run mc:check-new-criticals` — no new critical alignment debt

## Audit Gate

```bash
npm run quality:audit
```

`quality:audit` runs the template integrity checks that are cheap, structural,
and useful as a separate CI job:

- `npm run guard:skills`
- `npm run pk:validate`
- `npm run contract-maps:check`

Do not import dependency-cruiser, knip, or npm audit into the base template
before a real stack exists. Those belong to the bootstrapped project after
runtime dependencies and build surfaces are selected.

## CI Responsibility Split

CI jobs are split by verification responsibility, not by execution convenience.
If every check is accumulated into one job, the PR screen only says "quality
failed" and the responder cannot quickly tell whether the failure is template
integrity, Story Chain trace, release readiness, or post-bootstrap stack drift.

Before adding a new CI check, ask:

1. Which responsibility owns this failure?
2. Does it mean the same thing as an existing job failure?
3. Is it PR-blocking, release-blocking, nightly/manual hardening, or advisory?
4. Does it require secrets, external APIs, long runtime, or a selected stack?

Current split:

| Responsibility | CI location | Representative command | Failure meaning |
| --- | --- | --- | --- |
| Template integrity | `audit` job | `npm run quality:audit` | skill sync, Project Knowledge, or Contract Map drift |
| Template quality | `quality` job | `npm run quality:check` | base gates or skeleton Story Chain validation failed |
| Release boundary | local / release workflow in cloned project | `npm run quality:release` | product-specific non-empty Story Chain is not ready |
| Post-bootstrap stack gates | cloned project CI after stack selection | lint, typecheck, test, coverage, dependency audit | selected runtime/build/dependency surface regressed |

Add a check to the existing `quality` job only when its failure has the same
meaning as template quality failure. Structural template checks belong in
`quality:audit`. Stack, dependency, and supply-chain checks belong after
bootstrap, when the cloned project has real dependencies and build surfaces.

## Release Gate

```bash
npm run quality:release
```

`quality:release` adds:

- `npm run mc:validate-story-chain -- --require-non-empty`

This is the bootstrap/release boundary. A concrete product repo must not claim
release readiness while this gate is blocked. The base template itself may use
`npm run quality:check`; `quality:release` is expected to fail until a real
Story Chain exists.

## Template Check

```bash
npm run quality:check
```

`quality:check` validates the skeleton without requiring product-specific Story
Chain content. Use it for agentic-base template maintenance.

Mission Control also reports optional Engineering Assurance parse-only status
for `docs/contracts/engineering/`. At the current phase, malformed Engineering
Assurance IDs, missing required sections, and missing references are warnings,
not release-blocking failures.

Operations runbooks may name gate commands as procedural evidence, but changing
what a gate means or whether it blocks release belongs here, in `package.json`
scripts, and in `docs/contract-maps/quality-gates.md`. A runbook must not create
a separate release gate definition.

## Deferred Gates

Do not import heavy gates into the base template before there is code that needs
them.

- lint/typecheck after the stack is selected
- test/coverage after a test runner exists
- executable Evidence Ledger after evidence commands exist
- mutation or LLM static judge only after repeated false-pass signals

## Editing Aids

LSP diagnostics and symbol references are useful after a TypeScript stack exists,
but they are not a gate. Use `lsp-assisted-engineering` to inspect definitions,
references, and diagnostics before broad checks, then close with the project's
actual quality scripts and Story Chain/Evidence Ledger gates.
