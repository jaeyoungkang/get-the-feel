# Scenario Catalog

> Story Chain과 Evidence Ledger가 참조하는 scenario id catalog.
> 이 문서는 Promise나 Acceptance Check의 의미를 대체하지 않고, 같은 사용자
> 상황을 안정적으로 재인용하기 위한 보조 정본이다.

## Format

```markdown
### scenario:<slug>: <한 줄 제목>

상황: <어떤 사용자/운영자 상태에서 발동되는지>

기대 행동: <제품이 무엇을 해야 하는지 — observable 단위>

연결:
- moment:<slug>
- promise:<slug>
- aspect:<slug> (있으면)
- evidence-ledger: `<slug>.ledger.md`
```

## Scenarios

### scenario:first-training-session: 첫 감각 훈련 세션

상황: target user가 배포 URL 또는 로컬 Next 앱을 열고 제품이 제공하는 훈련
세션을 시작한다.

기대 행동: 제품은 native trainer를 제공한다. 사용자는 정답 전 단서 없이
문장 속 감각을 고르고, 정답 후 감각 그림·한국어 해석·해설을 본다. 세션
뒤에는 감각별 약점과 집중 연습 경로를 볼 수 있다. 산출 연습은 인식
기록과 분리된다.

연결:
- moment:first-training-session
- promise:sense-training-surface
- promise:constrained-production
- promise:weakness-guided-focus
- aspect:content-provenance
- aspect:recognition-production-separation
- evidence-ledger: `current-build.ledger.md`

### scenario:sentence-to-practice: 문장 해설 후 감각 연습

상황: target user가 자신이 만난 영어 문장을 넣고 get/have/up 같은 지원
대상어의 감각을 확인한다.

기대 행동: 제품은 현재 코퍼스가 보증하는 대상어를 탐지한다. 사용자는
감각 설명·그림·경계를 보고, 같은 감각의 training/transfer 문항을 바로
풀 수 있다. 지원하지 않는 영어 일반 해설은 약속하지 않는다.

연결:
- moment:sentence-inquiry-practice
- promise:sentence-explanation-to-practice
- aspect:content-provenance
- evidence-ledger: `current-build.ledger.md`
