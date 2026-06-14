---
id: promise:constrained-production
slug: constrained-production
legacyIds:
  - V3
title: Constrained Production
experience: experience:native-sense-training
moment: moment:first-training-session
lane: product
status: active
aspects:
  - aspect:recognition-production-separation
  - aspect:design-baseline-preservation
intentChecks:
  - intent-check:constrained-production
acceptanceChecks:
  - acceptance-check:production-mode-present
  - acceptance-check:production-evidence-separated
coveringLedgers:
  - docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md
verdict: met
evidence:
  kind: runtime-output
  ref: npm run legacy:check
gateNotes: Production remains constrained writing, not speaking.
---

# Constrained Production

## Promise

제품은 사용자가 감각을 고른 뒤 같은 감각을 제한된 형태로 직접 꺼내 쓰게
한다. 현재 산출은 빈칸 타이핑, 어순 재배열, 전문 쓰기와 자가채점이다.
이 흐름은 "보기 없이 한 번 써 본다"는 가치를 제공하지만, 말하기 유창성
또는 자유 작문 실력 검증을 약속하지 않는다.

산출 기록은 인식 정답률과 분리된다. 인식 문제를 잘 푸는 것과 직접 쓰는
것은 다른 학습 신호다. 특히 전문 쓰기는 자가채점이므로 약한 evidence로
표시되어야 한다.

## Intent Checks

### intent-check:constrained-production

- question: 제품이 보기 고르기 이후의 산출 연습을 제공하면서도, 인식 evidence와 산출 evidence를 섞거나 말하기 향상으로 과장하지 않는가?
- evidence: code-trace: `public/legacy/c4-3/app.js`; runtime-output: `npm run legacy:check`.
- why live judge: 자유 쓰기의 품질은 정적 코드만으로 충분히 판단할 수 없다. 제품 문구와 통계 표면이 self-graded output을 약한 evidence로 유지하는지 확인해야 한다.
- linked acceptance checks:
  - acceptance-check:production-mode-present
  - acceptance-check:production-evidence-separated
- answer criteria: 선택형 문제만 있으면 실패한다. 산출 통계가 인식 통계에 섞이거나, 말하기·자유 작문 실력 검증을 암시하면 실패한다.

## Acceptance Checks

### acceptance-check:production-mode-present

- description: The current trainer design baseline includes constrained production self-check using current corpus sentences and model examples.
- evidence: code-trace: `public/legacy/c4-3/app.js`; runtime-output: `npm run legacy:check`.
- run: `npm run legacy:check`

### acceptance-check:production-evidence-separated

- description: Recognition and production records use separate labels/storage and production self-grading remains weak evidence.
- evidence: code-trace: `public/legacy/c4-3/app.js`; aspect: `aspect:recognition-production-separation`; runtime-output: `npm run legacy:check`.
- run: `npm run legacy:check`

## Evidence

```yaml
evidence:
  kind: runtime-output
  ref: npm run legacy:check
```
