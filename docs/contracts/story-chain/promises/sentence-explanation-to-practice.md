---
id: promise:sentence-explanation-to-practice
slug: sentence-explanation-to-practice
legacyIds: []
title: Sentence Explanation To Practice
experience: experience:native-sense-training
moment: moment:sentence-inquiry-practice
lane: product
status: active
aspects:
  - aspect:content-provenance
  - aspect:design-baseline-preservation
intentChecks:
  - intent-check:sentence-explanation-to-practice
acceptanceChecks:
  - acceptance-check:sentence-explanation-route
  - acceptance-check:sentence-explanation-supported-scope
  - acceptance-check:sentence-explanation-practice-link
coveringLedgers:
  - docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md
verdict: met
evidence:
  kind: rendered-dom
  ref: app/explain/page.tsx + app/explain/sentence-explainer.tsx
gateNotes: Rule-based MVP grounded in current corpus senses; it does not claim open-ended grammar correction.
---

# Sentence Explanation To Practice

## Promise

제품은 사용자가 영어 문장을 넣으면 현재 코퍼스가 다루는 target word를
찾아 감각 해설로 연결한다. 사용자는 문장 전체의 자유 번역이나 문법
첨삭을 받는 것이 아니라, 문장 안의 기본 동사·불변화사가 어떤 감각으로
작동하는지 확인한다.

해설은 현재 코퍼스의 감각 문장, 이미지 설명, 경계 설명을 사용한다. 같은
단어에 여러 감각이 가능하면 후보를 보여 주고, 현재 휴리스틱으로 가까운
감각을 먼저 둔다. 지원하지 않는 범위에서는 모르는 것을 아는 척하지
않고, 현재 지원 대상어 범위를 드러낸다.

해설은 곧바로 연습으로 이어진다. 사용자는 해설에서 본 감각과 같은
sense_id의 training 또는 transfer 문항을 풀어 보며, 설명을 읽는 데서
멈추지 않고 감각 판단을 다시 수행한다.

## Intent Checks

### intent-check:sentence-explanation-to-practice

- question: 사용자가 준 문장이 현재 코퍼스에 근거한 감각 해설과 같은 감각의 연습으로 이어지는가, 그리고 제품이 지원하지 않는 영어 일반 해설을 과장하지 않는가?
- evidence: rendered-dom: `app/explain/page.tsx`; code-trace: `src/content/explanation-index.ts`, `app/explain/sentence-explainer.tsx`.
- why live judge: route와 휴리스틱이 존재해도 사용자에게 일반 챗봇처럼 보이면 의도는 실패한다. 해설이 코퍼스 범위를 드러내는지 사람이 확인해야 한다.
- linked acceptance checks:
  - acceptance-check:sentence-explanation-route
  - acceptance-check:sentence-explanation-supported-scope
  - acceptance-check:sentence-explanation-practice-link
- answer criteria: 해설이 unsupported grammar correction이나 자유 번역으로 흐르면 실패한다. 해설 뒤 같은 감각 연습이 없거나, 코퍼스 출처와 무관한 설명을 만들면 실패한다.

## Acceptance Checks

### acceptance-check:sentence-explanation-route

- description: `/explain` route renders a sentence input workspace with sample sentences, analysis result area, and practice area.
- evidence: rendered-dom: `app/explain/page.tsx`; server-rendered response at `curl -fsS http://127.0.0.1:3000/explain`.
- run: `npm run build`

### acceptance-check:sentence-explanation-supported-scope

- description: `explainSentence` detects only supported target words from the current corpus, returns exact corpus matches when available, and otherwise exposes detected target-word matches without claiming unsupported general English explanation.
- evidence: code-trace: `src/content/explanation-index.ts`; rendered-dom: empty state copy in `app/explain/sentence-explainer.tsx`.
- run: `npm run typecheck`

### acceptance-check:sentence-explanation-practice-link

- description: The active explanation renders practice cards sourced from the same sense's `training_items` and `transfer_items`, including choices, answer feedback, and Korean why explanation.
- evidence: code-trace: `practiceForSense` in `src/content/explanation-index.ts`; rendered-dom: `app/explain/sentence-explainer.tsx`.
- run: `npm run build`

## Evidence

```yaml
evidence:
  kind: rendered-dom
  ref: app/explain/page.tsx
```
