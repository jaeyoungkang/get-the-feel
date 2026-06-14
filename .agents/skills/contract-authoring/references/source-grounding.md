# Source Grounding

Use this file when the user provides a real source artifact and wants the contract to reflect that source.

## Goal

Anchor the product contract in actual source metadata before further drafting.

## Workflow

1. confirm the source identifier
2. extract or verify source metadata
3. correct stale assumptions such as wrong date or title
4. identify usable structure markers
5. continue drafting on top of those facts

## Facts to lock

- title
- date
- publisher or channel
- duration or length when relevant
- section markers such as timestamps, headings, agenda items, or tables

## Rules

- If the user states a source date that conflicts with the actual source metadata, correct it explicitly.
- Prefer primary metadata over memory.
- If usable structure exists in the source, use it as a candidate backbone for scenarios and summary slices.
- Do not overfit the whole product to one example source, but do use the source to pressure-test the draft.

## Example use

For a YouTube meeting source:

- verify title
- verify upload date
- inspect description timestamps
- inspect subtitle availability
- then revise the `PRODUCT` and `docs/contracts/feature-specs.md` draft with those facts
