---
id: aspect:content-provenance
legacyIds: []
applies-to:
  - promise:sense-training-surface
  - promise:sentence-explanation-to-practice
covering-ledger: docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md
verdict: met
evidence:
  kind: runtime-output
  ref: npm run content:check
gateNotes: Weak senses remain marked weak; this aspect blocks source-free content and unsupported explanation overclaim, not weak-to-strong promotion.
---

# Content Provenance

## 1. Why

제품이 잘못된 감각을 자신 있게 훈련하면 사용자의 영어 감각을 고치는 것이
아니라 더 망친다. get-the-feel의 콘텐츠는 "그럴듯한 설명"이 아니라
출처와 검수 상태가 있는 감각 설명이어야 한다.

이 Aspect는 훈련 화면과 문장 해설 화면 모두에 걸린다. 훈련 문항은
source_refs와 validation이 있는 sense를 사용해야 한다. 문장 해설도 현재
코퍼스가 보증하는 target word와 sense 범위를 넘어서 일반 영어 해설처럼
행동하면 안 된다.

## 2. Pointcut

- applies to:
  - promise:sense-training-surface
  - promise:sentence-explanation-to-practice
- excludes:
  - 운영 문서나 status 화면처럼 사용자에게 새 감각 설명을 제공하지 않는 표면
  - demand validation 문서처럼 학습 효과나 수요 판정만 다루는 표면

## 3. Advice

- 새 sense와 새 문항은 `skills/content-consensus/SKILL.md`를 거친다.
- `source_refs`와 `validation` 필드는 삭제하지 않는다.
- weak sense는 유지할 수 있지만, 사람 승인 전 strong으로 승격하지 않는다.
- 문장 해설은 현재 `assets/content/`의 sense 설명과 practice item을 재사용한다.
- 지원하지 않는 단어·구문·문법 교정을 제품이 아는 척하지 않는다.

## 4. Verification

- coverage: `scripts/content/check.mjs` checks content schema, source-bearing sense records, training/transfer separation, labels, choices, and duplicate normalized sentences.
- coverage: `src/content/explanation-index.ts` builds explanation matches only from `CURRENT_CONTENT` and practice items tied to the same `sense_id`.
- wovenness: This aspect is cited by both covered promises and `current-build.ledger.md`.
- verdict: `met` for the current build.
