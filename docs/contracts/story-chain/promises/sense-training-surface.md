---
id: promise:sense-training-surface
slug: sense-training-surface
legacyIds:
  - V1
title: Sense Training Surface
experience: experience:native-sense-training
moment: moment:first-training-session
lane: product
status: active
aspects:
  - aspect:content-provenance
intentChecks:
  - intent-check:sense-training-surface
acceptanceChecks:
  - acceptance-check:sense-training-surface-current-build
  - acceptance-check:sense-training-cue-discipline
  - acceptance-check:sense-training-corpus-contract
coveringLedgers:
  - docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md
verdict: met
evidence:
  kind: rendered-dom
  ref: app/page.tsx + app/trainer.tsx
gateNotes: The current surface renders the native trainer from the Next app.
---

# Sense Training Surface

## Promise

제품은 사용자가 첫 세션에서 곧바로 영어 문장 감각 훈련을 시작하게 한다.
사용자는 단어의 한국어 뜻을 고르지 않는다. 문장 속 기본 동사나
불변화사가 어떤 위치·방향·상태 그림을 그리는지 판단한다.

이 약속은 훈련 표면의 존재만 말하지 않는다. 문항은 현재 코퍼스의
감각 설명과 연결되어야 하고, 정답 전 단서가 새지 않아야 하며, 훈련
문장과 전이 문장은 분리되어야 한다. 정답 후에는 한국어 해석과 감각
해설이 나타나 사용자가 오답 이유를 이해할 수 있어야 한다.

## Intent Checks

### intent-check:sense-training-surface

- question: 첫 제품 표면이 마케팅 페이지나 일반 빈칸 퀴즈가 아니라, 영어 토박이 감각을 문장 단위로 훈련하는 실제 세션으로 읽히는가?
- evidence: rendered-dom: `app/page.tsx`, `app/trainer.tsx`; runtime-output: `npm run build`.
- why live judge: 파일과 문항이 있어도 사용자가 단어뜻 암기 앱으로 느끼면 의도는 실패한다. 수요 검증은 demand-1에서 따로 닫는다.
- linked acceptance checks:
  - acceptance-check:sense-training-surface-current-build
  - acceptance-check:sense-training-cue-discipline
  - acceptance-check:sense-training-corpus-contract
- answer criteria: 첫 화면에서 실제 훈련을 시작할 수 있어야 한다. 정답 전 해석·색·라벨이 단서로 새거나, 문항이 감각 그림이 아니라 한국어 뜻 암기로 풀리면 실패한다.

## Acceptance Checks

### acceptance-check:sense-training-surface-current-build

- description: `/` route renders the current product shell and native trainer.
- evidence: rendered-dom: `app/page.tsx`; runtime-output: `npm run build`.
- run: `npm run build`

### acceptance-check:sense-training-cue-discipline

- description: The representative trainer hides sentence Korean, item label, sense label, and feedback cues before the user answers, then reveals them after answer.
- evidence: code-trace: `app/trainer.tsx` answer state gates feedback, Korean text, and sense explanation.
- run: `npm run build`

### acceptance-check:sense-training-corpus-contract

- description: All loaded content files keep source-backed sense records, mandatory labels, separated training/transfer pools, shuffled choices, and no duplicate normalized sentences across the corpus.
- evidence: runtime-output: `npm run content:check`.
- run: `npm run content:check`

## Evidence

```yaml
evidence:
  kind: rendered-dom
  ref: app/page.tsx + app/trainer.tsx
```
