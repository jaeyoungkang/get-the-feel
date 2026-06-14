# Product

`product/`는 사람이 빠르게 읽는 제품 전면 문서만 둔다. 운영 정본은
`docs/contracts/story-chain/`이며, 이 디렉터리의 문서는 그 정본을 요약하거나
실사용 수요 검증을 준비한다.

## Files

| File | Role |
| --- | --- |
| `contract.md` | Story Chain promises를 읽기 쉬운 제품 계약으로 요약한다. 새 의미 결정은 먼저 Story Chain에 반영한다. |
| `demand-validation.md` | 실제 target user 3~5명 검증 계획과 demand 판정 임계를 보관한다. |

## Boundaries

- 콘텐츠 스키마와 출처 정본은 `assets/content/CONTRACT.md`와
  `assets/content/sources.md`에 둔다.
- 과거 asset map, elevation plan, principles, domain activation guide는
  archive에 보존한다.
- 새 Promise, Acceptance Check, Aspect, Evidence Ledger는 이 디렉터리에 직접
  만들지 않는다. Story Chain에 만들고 여기에는 필요한 요약만 반영한다.
