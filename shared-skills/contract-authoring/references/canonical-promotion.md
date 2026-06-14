# Canonical Promotion

Use this file when draft artifacts exist and the next step is to land them into canonical repository docs.

## Goal

Move approved contract drafts into canonical files without pretending draft completion equals repository completion.

## Workflow

1. read the canonical target files
2. compare draft vs canonical state
3. check whether canonical files are empty templates, partial drafts, or meaningful existing docs
4. if meaningful existing docs exist, stop and ask for review direction
5. if canonical files are safe to replace, promote the approved draft
6. remove or update stale promotion notes or proposals
7. summarize which canonical files changed

## Safety rule

Draft promotion is not a blind copy operation. The main risk is overwriting meaningful existing intent.

Before promotion, answer:

- are canonical files just templates
- are canonical files partially filled
- are canonical files already carrying meaningful product intent

Only the first case is safe to replace without extra review.

## Completion rule

After promotion, report:

- promoted files
- still-open questions
- any draft files intentionally left in place
- the next downstream artifact
