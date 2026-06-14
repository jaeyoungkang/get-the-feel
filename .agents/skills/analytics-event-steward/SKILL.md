---
name: analytics-event-steward
description: Use when implementing, debugging, reviewing, or validating Light House analytics/event collection, including Amplitude, workspace behavior events, canonical events, docs/analytics/events.yaml, track(...), trackCanonicalEvent(...), /api/analytics-events, event-router, local analytics store, external vendor sink fan-out, session replay identity, or real collected event data. Use after Mission Control scopes the Story Chain/event-contract impact.
compatibility: Claude Code, Codex, Cursor-style agents in the Light House repository.
---

# Analytics Event Steward

Use this skill for the implementation layer of Light House analytics events. It
does not replace Mission Control or Story Chain stewardship. It keeps the event
contract, emit path, router/store/sink behavior, and real vendor data aligned.

## Route First

- If the work mentions `analytics`, `Amplitude`, `events.yaml`,
  `trackCanonicalEvent`, event collection, or workspace behavior events, enter
  Mission Control first.
- Use `story-chain-contract-steward` for Promise, Acceptance Check, Evidence
  Ledger, Sufficiency Review, and run evidence changes.
- Use `quality-gate-steward` only when changing gate wiring, package scripts,
  CI, or validation documentation.
- Use `lsp-assisted-engineering` when TypeScript symbols, imports, call sites,
  or diagnostics shape the edit.

## Read Order

1. `docs/analytics/README.md`
2. `docs/analytics/events.yaml`
3. `docs/contracts/story-chain/promises/story-chain-event-contract.md`
4. `docs/contracts/story-chain/evidence-ledgers/story-chain-event-contract.ledger.md`
5. Relevant emitters and bridge files:
   - `app/lib/track.ts`
   - `app/lib/analytics/client.ts`
   - `app/api/analytics-events/route.ts`
   - `app/lib/analytics/event-router.ts`
   - `app/lib/analytics/sinks/amplitude.ts`
   - `app/server/domain-access/analytics-event-access.ts`
   - `app/server/repository/analytics-events.ts`

## Workflow

1. Classify the event problem:
   - missing contract entry;
   - emitter not firing;
   - client bridge identity missing;
   - route/schema rejection;
   - router validation failure;
   - local store failure;
   - external sink fan-out failure;
   - vendor data interpretation issue.
2. Trace one canonical event end to end:
   - `events.yaml` name, required properties, `privacy.allowExternalSinks`,
     and `sinks.amplitude`;
   - Promise `requiredEvents` and `storyRefs.promiseRef`;
   - `track(...)` or direct `trackCanonicalEvent(...)` call site;
   - client `deviceId` / `sessionId` enrichment;
   - `/api/analytics-events` schema acceptance;
   - router composition, store insert, privacy filter, and sink capture.
3. When checking real data:
   - separate internal testers from beta/external users;
   - distinguish SDK/session replay events from product behavior events;
   - report the exact time window and excluded users;
   - compare vendor data with `.local/analytics-events.jsonl` only when that
     file exists for the same environment. Local JSONL is not the external
     vendor source of truth.
4. For fixes:
   - preserve validation failures for malformed or undeclared events;
   - keep local store failures from suppressing eligible external sink fan-out;
   - keep external sink failures fire-and-forget but observable through
     `sinkErrors`;
   - do not send raw query, PDF text, tokens, or AI output unless the contract
     explicitly allows it and external sink policy is decided.
5. Close through Story Chain:
   - update the relevant Evidence Ledger row when the executable evidence
     changes;
   - add or update a dated Sufficiency Review when a reviewed AC failure mode is
     closed;
   - run the targeted test named by the ledger.

## Boundaries

- Do not add ad hoc vendor-only event names from call sites. Runtime code emits
  canonical event names and payloads; the router maps vendor names from
  `events.yaml`.
- Do not treat Amplitude Session Replay as product behavior evidence by itself.
  Product behavior comes from declared canonical product events.
- Do not expose Amplitude secret keys through `NEXT_PUBLIC_*`. Client bundles
  may use the public API key; secrets belong in server-only env vars.
- Do not mark collection fixed from local tests alone when the user asked about
  real vendor data. Verify the vendor export/query path when credentials are
  available.

## Validation

Use the smallest honest set for the touched path:

```bash
npx vitest run app/lib/analytics/__tests__/event-router.test.ts
npx vitest run app/lib/analytics/__tests__/client.test.ts app/lib/analytics/sinks/__tests__/amplitude.test.ts app/api/analytics-events/__tests__/route.test.ts
npx vitest run app/lib/__tests__/track.test.ts app/lib/__tests__/server-analytics.test.ts
npm run mc:event-impact
npm run mc:validate-story-chain
npm run evidence-ledger:dry
```

If review YAML changed, also run:

```bash
npx vitest run app/server/services/story-chain/__tests__/review-parser.test.ts
```
