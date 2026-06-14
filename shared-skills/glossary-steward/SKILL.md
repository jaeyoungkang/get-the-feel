---
name: glossary-steward
description: Use when adding, editing, reviewing, or retiring Light House glossary terms, especially `/admin/intent` glossary entries, Story Chain concept terms, product surface vocabulary, tooltip definitions, term grouping, owning surface hints, or Promise/Evidence Ledger references connected to glossary wording. Keeps glossary changes aligned with Story Chain concepts, product surface contracts, i18n, tests, and Evidence Ledger coverage.
compatibility: Claude Code, Codex, Cursor-style agents in the Light House repository.
---

# Glossary Steward Skill

Use this skill when glossary or terminology work affects `/admin/intent`,
Story Chain concept wording, product surface vocabulary, tooltip definitions, or
the references that explain where a term is owned.

The glossary is a derived internal reading surface. It explains current
contracts; it does not create product meaning by itself.

## Read First

Read only the files needed for the target term, but start from these anchors:

- `docs/contracts/story-chain/concepts.md` for Story Chain concept terms.
- `docs/contracts/story-chain/promises/internal-intent-audit-page.md` for the
  `/admin/intent` glossary contract.
- `docs/contracts/story-chain/evidence-ledgers/commitment-pages.ledger.md` for
  glossary evidence coverage.
- `docs/contracts/story-chain/evidence-ledgers/reviews/commitment-pages.reviews.md`
  for the latest glossary Sufficiency Review.
- `app/(admin)/admin/intent/IntentInventoryView.tsx` and adjacent components for
  the rendered internal surface.
- `app/i18n/messages/commitment.ts` and related partials for visible glossary
  copy.
- `app/about/__tests__/intent-page.test.tsx` for render expectations.

If the request changes product meaning, Promise scope, Acceptance Checks,
Evidence Ledger coverage, or Story Chain concept definitions, use Mission
Control and the relevant steward skill before editing.

## Workflow

1. Classify the term.
   - `Story Chain concept`: Experience, Moment, Promise, Aspect, Acceptance
     Check, Intent Check, Evidence Ledger, verdict, stage, and related
     governance terms.
   - `Product surface vocabulary`: Light House-specific surface terms such as
     AI comment body, visual navigator, reactionPreparation, first card, owning
     UI/code surfaces, and related Promise/Evidence Ledger refs.
   - `Status / verdict vocabulary`: met, not-met, unknown, unverified, next,
     reality, 검증 근거, and similar state labels.
2. Choose the authority.
   - Story Chain concept meaning comes from `concepts.md`.
   - Product surface vocabulary comes from the owning Promise, Evidence Ledger,
     runtime-flow doc, code surface, or test.
   - UI labels and tooltip prose live in i18n files.
3. Keep grouping explicit.
   - Do not mix Story Chain concepts and product surface vocabulary in one
     unlabelled list.
   - Include owning surface hints and contract refs for product surface terms.
   - Keep tooltip definitions short; longer explanations belong in the glossary
     body or source contract.
4. Preserve canonical names.
   - Do not rename canonical glossary terms for style.
   - Do not introduce aliases unless the source contract explicitly requires
     migration wording.
   - Do not expose implementation details as product promises. Explain their
     owning surface and contract reference.
5. Update evidence when visible glossary behavior changes.
   - Update the relevant Promise Acceptance Check only when the contract changes.
   - Update `commitment-pages.ledger.md` coverage and run evidence when the
     rendered glossary expectation changes.
   - Add or refresh a Sufficiency Review entry when the Acceptance Check meaning
     or evidence coverage changes.
6. Validate the rendered surface.
   - Prefer the targeted glossary test:
     `npx vitest run app/about/__tests__/intent-page.test.tsx -t "renders glossary dictionary and tooltips for key status terms"`.
   - Run `npm run mc:validate-story-chain` and `npm run evidence-ledger:dry`
     when Story Chain or Evidence Ledger files change.
   - Run `npm run format:check` for edited docs/code.

## Boundaries

- Do not use the glossary to approve a new product concept. Route new meaning to
  Mission Control first.
- Do not duplicate long Story Chain definitions inside `/admin/intent`; point to
  the canonical concept or contract.
- Do not remove tooltip accessibility affordances. The glossary contract expects
  custom tooltip behavior without native `title` duplication.
- Do not collapse product surface vocabulary into Story Chain concept terms.
  The distinction is part of the `/admin/intent` contract.

## Reporting

In the final response, name the changed terms, the authority source used, and
the validation commands run. If no contract files changed, say that the work was
glossary/i18n/test-only and did not alter Story Chain meaning.
