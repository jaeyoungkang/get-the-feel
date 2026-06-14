# Quality Gates Contract Map

This map answers: which gate should a template maintainer or cloned project run?

It does not replace `docs/verification-gates.md` or package scripts.

## Gate Stack

| Layer | Main command or artifact | Catches |
| --- | --- | --- |
| Skill sync | `npm run guard:skills` | generated skill drift |
| Project Knowledge | `npm run pk:validate` | local memory, event log, and change log shape drift |
| Contract Maps | `npm run contract-maps:check` | missing local map links and README index drift |
| Template audit | `npm run quality:audit` | cheap structural drift in skills, Project Knowledge, and Contract Maps |
| Content contract | `npm run content:check` | schema, source refs, minimum counts, training/transfer separation, legacy data equivalence |
| Legacy trainer baseline | `npm run legacy:check` | syntax drift in protected `public/legacy/c4-3/*.js` |
| UI/design contract | `npm run ui:check` | `/explain` answer-leak/shuffle guard and design baseline presence |
| GitHub Pages export | `npm run pages:check` | `/get-the-feel` base path and root-relative asset regressions |
| Surface audit | `npm run mc:audit-surface` | untagged user-facing `app/` surfaces and current trainer baseline after bootstrap |
| Alignment debt | `npm run mc:check-new-criticals` | new critical alignment debt |
| Story Chain graph | `npm run mc:validate-story-chain` | parent refs, weaving, cardinality, ledger shape |
| Engineering Assurance parse-only | `npm run mc:validate-story-chain` | malformed engineering IDs, missing sections, and missing references as warnings |
| Release boundary | `npm run quality:release` | non-empty Story Chain readiness |

Sources:

- [`package.json`](../../package.json)
- [`docs/verification-gates.md`](../verification-gates.md)

## Template Maintenance

For this product repo, use:

```bash
npm run quality:check
```

This runs content, legacy trainer, UI/design, TypeScript, ESLint, Next build,
GitHub Pages export, and Story Chain contract gates.

CI also runs `npm run quality:audit` as a separate audit job. This mirrors the
Lighthouse split between regular quality and structural audit, but keeps
agentic-base lightweight by auditing only the template-owned surfaces.

## Release Boundary

For a real cloned project that claims bootstrap or release readiness, use:

```bash
npm run quality:release
```

`quality:release` must fail until real Story Chain content exists and validates.

## Change Rule

If a new Contract Map documents a gate relationship, link to the command and the
owning source. Do not invent a new validation obligation in a map; add or change
gates through the quality-gate steward first, then map the relationship.

Operational runbooks may name gate commands, but changing gate semantics belongs
to `docs/verification-gates.md`, package scripts, and `quality-gate-steward`.
