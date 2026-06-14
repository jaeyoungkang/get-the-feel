---
id: aspect:content-provenance
legacyIds: []
applies-to:
  - promise:sense-training-surface
covering-ledger: docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md
verdict: met
evidence:
  kind: runtime-output
  ref: npm run verdict
gateNotes: Weak senses remain marked weak; this aspect blocks source-free content, not weak-to-strong promotion.
---

# Content Provenance

## 1. Why

The product can harm learners if it trains a false sense with confident feedback. Every sense must carry source references and validation state before it appears in the product surface.

## 2. Pointcut

- applies to:
  - promise:sense-training-surface
- excludes:
  - purely operational docs with no training content

## 3. Advice

- New or changed content goes through `skills/content-consensus/SKILL.md`.
- `source_refs` and `validation` fields stay mandatory.
- Weak validation state must remain visible to maintainers and cannot be promoted to strong without human approval.

## 4. Verification

- coverage: `node tools/verdict/check.mjs c4-3` checks content contract fields and data sync.
- wovenness: This aspect is cited by `promise:sense-training-surface` and `current-build.ledger.md`.
- verdict: `met` for the current representative build.
