# Feature Specs Ledger

이 파일은 Story Chain Promise별 Acceptance Check와 scenario mapping을 한 곳에서
찾기 위한 얇은 인덱스다. 의미 정본은 각 Promise 문서이고, 실행 근거 정본은
covering Evidence Ledger다.

## Acceptance Check Ledger

| Promise | Acceptance Check | Covering Evidence Ledger | Evidence |
| --- | --- | --- | --- |
| promise:sense-training-surface | acceptance-check:sense-training-surface-current-build | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | rendered-dom: `app/page.tsx`; scenario:first-training-session |
| promise:sense-training-surface | acceptance-check:sense-training-cue-discipline | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | code-trace: `app/trainer.tsx`; scenario:first-training-session |
| promise:sense-training-surface | acceptance-check:sense-training-corpus-contract | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | runtime-output: `npm run content:check`; scenario:first-training-session |
| promise:sentence-explanation-to-practice | acceptance-check:sentence-explanation-route | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | rendered-dom: `app/explain/page.tsx`; scenario:sentence-to-practice |
| promise:sentence-explanation-to-practice | acceptance-check:sentence-explanation-supported-scope | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | code-trace: `src/content/explanation-index.ts`; scenario:sentence-to-practice |
| promise:sentence-explanation-to-practice | acceptance-check:sentence-explanation-practice-link | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | code-trace: `src/content/explanation-index.ts`; rendered-dom: `app/explain/sentence-explainer.tsx`; scenario:sentence-to-practice |
| promise:constrained-production | acceptance-check:production-mode-present | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | rendered-dom: `app/trainer.tsx`; scenario:first-training-session |
| promise:constrained-production | acceptance-check:production-evidence-separated | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | aspect: `aspect:recognition-production-separation`; scenario:first-training-session |
| promise:weakness-guided-focus | acceptance-check:focus-and-stats-present | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | rendered-dom: `app/trainer.tsx`; scenario:first-training-session |
| promise:weakness-guided-focus | acceptance-check:stats-do-not-claim-demand | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | docs: `product/demand-validation.md`, `product/contract.md`; scenario:first-training-session |

## Scenario Catalog

| Scenario | Source Promise | Surface | Evidence |
| -------- | -------------- | ------- | -------- |
| scenario:first-training-session | promise:sense-training-surface | `app/page.tsx`, `app/trainer.tsx` | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` |
| scenario:first-training-session | promise:constrained-production | `app/trainer.tsx` | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` |
| scenario:first-training-session | promise:weakness-guided-focus | `app/trainer.tsx` | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` |
| scenario:sentence-to-practice | promise:sentence-explanation-to-practice | `app/explain/page.tsx`, `app/explain/sentence-explainer.tsx` | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` |
