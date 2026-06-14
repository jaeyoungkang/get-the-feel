# Scenario Catalog

> Story Chain과 Evidence Ledger가 참조하는 scenario id catalog.
> 이 문서는 Promise/Acceptance Check의 의미를 대체하지 않고, alignment audit이
> scenario lane과 label을 안정적으로 읽기 위한 보조 정본이다.

## Format

각 시나리오는 다음 형식으로 등록한다.

```markdown
### scenario:<slug>: <한 줄 제목>

상황: <어떤 사용자/운영자 상태에서 발동되는지>

기대 행동: <제품이 무엇을 해야 하는지 — observable 단위>

연결:
- promise:<slug>
- aspect:<slug> (있으면)
- evidence-ledger: `<slug>.ledger.md`
```

## 등록 시점

- Promise를 새로 추가하면서 그 Acceptance Check 중 하나가 별개 시나리오로 식별 가능할 때
- alignment audit이 같은 lane을 여러 번 참조하기 시작할 때
- admin journey가 같은 상황을 다른 promise에서 재인용할 때

## Lanes (도메인-중립 시드)

도메인을 채우는 파일럿이 정의한다. agentic-base는 기본 lane을 정의하지 않는다.

---

> 이 baseline은 도메인-중립으로 비워둔다. lane 사례가 필요하면 프로젝트 안의 실제 Story Chain에서 새로 정의한다.

### scenario:first-training-session: 대표 후보 첫 세션

상황: target user가 배포 URL 또는 로컬 Next 앱을 열고 한 세션을 시작한다.

기대 행동: 제품은 c4-3 대표 훈련 화면을 제공하고, 정답 전 단서를 숨기며, 정답 후 감각 그림·해석·해설을 보여준다. 사용자는 세션 후 약점 통계와 집중 연습 경로를 볼 수 있다.

연결:
- promise:sense-training-surface
- promise:constrained-production
- promise:weakness-guided-focus
- aspect:content-provenance
- aspect:recognition-production-separation
- evidence-ledger: `current-build.ledger.md`

### scenario:sentence-to-practice: 문장 해설 후 감각 연습

상황: target user가 영어 문장을 입력해 get/have/up 같은 지원 대상의 감각을 확인한다.

기대 행동: 제품은 현재 코퍼스가 보증하는 대상어를 탐지하고, 해당 감각의 설명·그림·경계를 보여준 뒤 같은 감각의 기존 훈련 문항으로 연습하게 한다.

연결:
- promise:sentence-explanation-to-practice
- aspect:content-provenance
- evidence-ledger: `current-build.ledger.md`
