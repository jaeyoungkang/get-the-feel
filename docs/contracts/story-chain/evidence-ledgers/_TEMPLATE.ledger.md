---
curated:
intentAbsorbedIntoAcceptance: false
intentJudgmentRefs: []
verdict: unknown
evidence:
gateNotes:
---

# {Ledger Name} Evidence Ledger

## Source Promises

- promise:{promise-slug}

## Applied Aspects

- aspect:{aspect-slug}

## Intent Checks

- intent-check:{semantic-slug}
  - source promise: promise:{promise-slug}
  - evidence: unknown

## Acceptance Checks

> check:evidence-coverage
> | promise | check | evidence | scope | run | scenarios |
> | --- | --- | --- | --- | --- | --- |
> | promise:{promise-slug} | acceptance-check:{semantic-slug} | unknown | Evidence runner | (pending) | |

## Executable Evidence

```run:shell
$ test -f docs/contracts/story-chain/evidence-ledgers/_TEMPLATE.ledger.md
```

## Sufficiency Review

### YYYY-MM-DD - intent-check:{semantic-slug}

- Input: {production-equivalent fixture, runtime output, or rendered DOM}
- Evidence: {runtime-output or rendered-dom ref}
- Gaps observed:
  - Adopt-resolved - {gap and resolution}
  - Reject - {gap and why it is outside this surface}
- Verdict: unknown
