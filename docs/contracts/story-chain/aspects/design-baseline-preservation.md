---
id: aspect:design-baseline-preservation
legacyIds: []
applies-to:
  - promise:sense-training-surface
  - promise:sentence-explanation-to-practice
  - promise:constrained-production
  - promise:weakness-guided-focus
covering-ledger: docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md
verdict: met
evidence:
  kind: rendered-dom
  ref: public/legacy/c4-3/index.html + app/sense-visual.tsx + docs/design-assets.md
gateNotes: Design is a cross-cutting product asset. The current trainer design baseline remains authoritative until documented React parity exists.
---

# Design Baseline Preservation

## 1. Why

get-the-feel의 차별점은 설명 텍스트만이 아니라 감각을 그림으로 보게 하는
화면 경험이다. 카드 리듬, 색 분리, 정답 후 피드백 위계, SVG 메타포, 보강
그림이 사라지면 제품은 같은 코퍼스를 써도 "감각 훈련"이 아니라 평범한
퀴즈 앱으로 읽힌다.

이 Aspect는 디자인을 장식이 아니라 제품 약속의 실현 조건으로 다룬다.
디자인 기준선을 잃으면 첫 훈련 세션, 문장 해설, 산출, 약점 기반 집중
경로가 모두 같은 방식으로 약해진다.

## 2. Pointcut

- applies to:
  - promise:sense-training-surface
  - promise:sentence-explanation-to-practice
  - promise:constrained-production
  - promise:weakness-guided-focus
- excludes:
  - 내부 status, 운영 문서, 계약 문서처럼 사용자가 감각 훈련을 직접 수행하지 않는 표면
  - 디자인 기준선 변경 없이 텍스트 계약만 보강하는 문서 작업

## 3. Advice

- 현재 배포판 트레이너 화면은 React parity 전까지 디자인 기준선이다.
- 감각 그림, contrast 그림, compose 그림, opaque idiom 그림은 기능 자산과 같은 수준으로 보존한다.
- 새 React 표면은 기존 SVG 메타포와 UX 문법을 재사용하거나, 대체 이유와 parity evidence를 남긴다.
- `/` 트레이너 기준선을 바꿀 때는 `docs/design-assets.md`의 parity checklist를 통과해야 한다.
- 디자인 변경은 Story Chain evidence와 연결해야 하며, 단순 미감 변경으로 몰래 제품 약속을 바꾸지 않는다.

## 4. Verification

- coverage: `public/legacy/c4-3/index.html`, `styles.css`, `app.js`, `data.js` preserve the current trainer design baseline.
- coverage: `app/page.tsx` wraps the current trainer design baseline for `/`.
- coverage: `app/sense-visual.tsx` reuses the existing SVG metaphor grammar for `/explain`.
- coverage: `docs/design-assets.md` defines the design asset baseline, preservation rules, and parity checklist.
- wovenness: This aspect is cited by all covered promises and `current-build.ledger.md`.
- verdict: `met` for the current build.
