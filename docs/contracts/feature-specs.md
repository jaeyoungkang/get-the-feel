# Feature Specs Ledger

이 파일은 Promise별 Acceptance Check와 Evidence Ledger를 한 곳에서 인벤토리하는 얇은 정본이다. 새 프로젝트는 Story Chain이 승인된 뒤 이 표를 채운다.

## Acceptance Check Ledger

| Promise | Acceptance Check | Covering Evidence Ledger | Evidence |
| --- | --- | --- | --- |
| promise:sense-training-surface | acceptance-check:sense-training-surface-current-build | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | runtime-output: `npm run verdict`; rendered-dom: `app/page.tsx`; scenario:first-training-session |
| promise:sentence-explanation-to-practice | acceptance-check:sentence-explanation-route | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | rendered-dom: `app/explain/page.tsx`; code-trace: `src/content/explanation-index.ts`; scenario:sentence-to-practice |
| promise:constrained-production | acceptance-check:production-mode-present | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | rendered-dom: `public/legacy/c4-3/app.js`; scenario:first-training-session |
| promise:weakness-guided-focus | acceptance-check:focus-and-stats-present | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` | rendered-dom: `public/legacy/c4-3/app.js`; scenario:first-training-session |

## Scenario Catalog

| Scenario | Source Promise | Surface | Evidence |
| -------- | -------------- | ------- | -------- |
| scenario:first-training-session | promise:sense-training-surface | `app/page.tsx`, `public/legacy/c4-3/index.html` | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` |
| scenario:sentence-to-practice | promise:sentence-explanation-to-practice | `app/explain/page.tsx`, `app/explain/sentence-explainer.tsx` | `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md` |
