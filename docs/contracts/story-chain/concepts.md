# Story Chain Concepts

Story Chain은 제품이 지키려는 약속을 세 축으로 읽는다. 첫째는 사람의 의도를 점점
구체화하는 축이고, 둘째는 그 의도가 제품에서 실현되는 방식을 제약하는 축이며,
셋째는 그 결과를 검증 근거로 닫는 축이다.

```text
의도 선언 축

Experience
  -> Moment
    -> Promise

실현 제약 축

Aspect
  -> Moment를 실현하는 Promise에 적용

검증 축

Promise -> Evidence Ledger -> Code / Tests / Surface tags
           ^
           |
         Aspect
```

Moment와 Aspect가 Promise를 자동 생성하지는 않는다. Moment는 Promise가 발동되는
상황을 정하고, Aspect는 그 Moment가 제품에서 실현되는 방식에 공통 제약을 건다.
Promise는 그 맥락 안에서 명시적으로 선언되는 종단 약속이다. Evidence Ledger는
Aspect 제약 아래 선언된 Promise를 실행 가능한 evidence로 닫는다. Promise의 각
Acceptance Check는 Evidence Ledger의 `check:evidence-coverage` 표 row로 내려가며,
Story Chain validator는 `traceability-cardinality.json`이 선언한 최소 연결 수로
Experience, Moment, Promise, Acceptance Check, Evidence row 사이를 검증한다.

## Responsibility Boundary

Story Chain은 의미 승인과 전파·구현 책임을 분리한다.

| 단계                                  | 주 책임   | 설명                                                                                                          |
| ------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| Experience                            | Human     | 제품이 오래 유지할 경험 영역을 정한다.                                                                        |
| Moment                                | Human     | 그 경험 안에서 약속이 발동되는 workflow 순간을 정한다.                                                        |
| Promise 존재와 의미                   | Human     | 제품이 실제로 지킬 종단 약속인지 승인한다. Agent가 초안을 쓸 수는 있지만 승인 없이 정본 의미가 되지는 않는다. |
| Aspect 신설과 의미                    | Human     | Moment를 실현하는 방식을 바꿀 수 있는 횡단 제약이므로 의미 승인이 필요하다.                                   |
| 기존 Aspect 적용 전파                 | Agent     | 승인된 Aspect를 관련 Promise, Evidence Ledger, evidence로 일관되게 엮는다.                                    |
| Evidence Ledger 작성과 갱신           | Agent     | 승인된 Promise를 Aspect 제약과 함께 실행 가능한 검증 원장으로 내린다.                                         |
| Code / Tests / Surface tags           | Agent     | Evidence Ledger가 요구하는 evidence를 구현하고 trace tag를 닫는다.                                            |
| deterministic check / live judge 실행 | Evaluator | Acceptance Check와 Intent Check evidence를 실행해 verdict 근거를 만든다.                                      |
| CI / release gate                     | System    | `unknown`이나 `not-met` 상태를 release blocking으로 강제한다.                                                 |

짧게 말하면 사람은 "무엇을 약속할지"를 정하고, 에이전트는 "그 약속을 무엇으로
증명하고 어떻게 구현할지"를 닫는다. 에이전트가 Promise나 Aspect 문장을 제안할
수는 있지만, 존재와 의미를 확정하는 권한은 Human 쪽에 있다.

## Experience

Experience는 제품이 오래 유지하려는 경험 영역이다. 사용자가 어떤 큰 맥락에서
제품을 쓰는지, 운영자가 어떤 운영 경험을 유지해야 하는지를 나눈다. 하나의
Experience는 여러 Moment를 품을 수 있다.

Experience는 새 최상위 노드 타입을 만들지 않고 `scope`로만 분류한다. 이 분류는
그래프 구조를 늘리지 않으면서, 실제 사용자 workflow와 운영·검증 surface가 같은
레벨처럼 읽히는 문제를 막기 위한 읽기 보조축이다.

| scope           | 의미                                                                             |
| --------------- | -------------------------------------------------------------------------------- |
| `core-product`  | 사용자가 제품에서 직접 수행하는 핵심 제품 경험                                   |
| `support-layer` | 핵심 제품 경험 위에 얹히는 보조 presence 또는 feedback layer                     |
| `governance`    | 제품 약속, 검증, release 상태를 설명하거나 운영하는 내부/외부 governance surface |

검토 기준:

- 구현 방식이나 화면 이름이 아니라 지속되는 제품 경험을 말한다.
- 한 번의 행동보다 넓고, 여러 workflow moment를 포함할 수 있다.
- Experience가 바뀌면 그 아래 Moment와 Promise의 해석도 바뀐다.
- `scope`는 Experience를 대체하지 않는다. 새 hierarchy를 만들지 않고 사람이 core
  product와 governance/support 항목을 구분해 읽게 하는 classification이다.

## Moment

Moment는 Experience 안에서 약속이 실제로 발동되는 workflow 순간이다. 사용자나
운영자가 어떤 일을 하다가 제품의 반응을 기대하는 지점을 잡는다. 하나의 Moment는
여러 Promise를 품을 수 있다.

검토 기준:

- Experience보다 좁고, Promise보다 넓다.
- 사용자의 관찰 가능한 흐름이나 운영자의 점검 장면으로 설명된다.
- Promise를 자동 생성하지 않고, Promise가 어떤 상황에서 발동되는지 결정한다.
- 하나의 기술 작업, 컴포넌트, 테스트 케이스만을 뜻하지 않는다.
- 여러 Promise가 같은 상황에서 발동되면 같은 Moment 아래에 둘 수 있다.

## Promise

Promise는 특정 Moment에서 제품이 사용자나 운영자에게 지키겠다고 선언한 종단
약속이다. 사람이 승인한 기대를 하나의 검증 가능한 계약으로 만든다. Promise는
하나의 Experience와 하나의 Moment에 속하고, 적용된 Aspect와 함께 Evidence
Ledger에서 닫힌다.

검토 기준:

- 사용자가 기대하는 결과나 운영자가 기대하는 상태를 직접 말한다.
- 하나의 약속은 검증 가능한 Acceptance Check 목록을 가진다.
- Moment가 정한 상황과 Aspect가 건 제약을 모두 읽어도 약속의 핵심 의미가
  유지되어야 한다.
- 특정 화면이나 API가 아니라 그 표면이 지켜야 하는 사용자 기대를 적는다.
- 여러 흐름을 가로지르는 규칙이면 Promise가 아니라 Aspect 후보로 본다.

내부 invariant는 사용자나 운영자가 결과를 합리적으로 기대하고 평가할 수 있을 때만
Promise로 올린다. 여러 Promise를 지탱하지만 그 자체가 관찰 가능한 제품 약속이
아닌 VM routing, payment idempotency, migration drift, deploy health 같은 보증은
`docs/contracts/engineering/`의 Engineering Assurance 계층에 둔다. 반대로 `met`
Promise를 지탱하는 release-critical invariant를 prose-only 운영 문서 안에 숨기지
않는다.

## Aspect

Aspect는 여러 Promise에 동시에 적용되는 횡단 규약이다. 보안, 반응 속도, 설명
충분성, runtime 제약처럼 한 Promise에만 묶으면 중복되거나 약해지는 규칙을
Aspect로 둔다. 제품 관점에서 Aspect는 Moment를 실현하는 방식에 걸리는 제약이다.
Aspect가 달라지면 같은 Moment와 Promise라도 화면, 문구, runtime 경로, 테스트
기준 같은 제품의 실제 모습이 달라질 수 있다.

검토 기준:

- 둘 이상의 Promise에 적용될 수 있는 pointcut이 있다.
- 어떤 표면에 적용되는지와 어떤 행동만 허용하는지 advice가 분명하다.
- Promise의 핵심 의미를 바꾸지 않고, 그 Promise가 지켜져야 하는 조건과 검증
  기준을 더 엄격하게 만든다.
- 단일 Promise의 Acceptance Check로 닫을 수 있으면 Aspect로 올리지 않는다.
- Promise만큼 엄격해야 하며, covering Evidence Ledger와 verification 근거를
  가진다.

반복 실패를 막을 때만 살아 있다. 같은 실패가 여러 surface에서 반복되고, 규칙을
한 곳에 두면 다음 구현이 같은 실패를 피하며, 적용 지점이 명확한 Aspect만 graph에
남긴다. 슬로건형 Aspect는 graph를 흐릴 뿐이므로 retire한다.

## Evidence Ledger

Evidence Ledger는 Aspect 제약 아래 선언된 Promise를 실행 가능한 검증 근거로
엮는 원장이다. Source Promise, Applied Aspect, Acceptance Check, run:shell
evidence를 한 곳에 모아 Story Chain과 코드 사이의 audit trail을 만든다.
Acceptance Checks는 자유 bullet list가 아니라 `> check:evidence-coverage` 표다.
표의 각 row는 하나의 `Promise#AcceptanceCheck`가 어떤 evidence, scope, run
command, scenario로 닫히는지 나타낸다.

Evidence Ledger는 흔히 말하는 "앞으로 만들 기능을 설명하는 스펙 문서"가 아니다.
agentic-base에서 Evidence Ledger는 Promise가 현재 어떤 evidence로 증명되는지를
적는 검증 원장이다. 개발자는 Promise만 보고 바로 코드를 작성할 수도 있지만,
release 판단에는 "그 약속이 무엇으로 닫혔는가"가 남아야 한다. Evidence Ledger는
그 질문에 답한다.

```text
Promise
  = 무엇을 지킬 것인가

Evidence Ledger
  = 그 약속이 지금 무엇으로 증명되는가
```

`evidence-ledgers/*.ledger.md` 파일은 설계 의도를 길게 풀어 쓰는 곳이 아니라,
Source Promise, Applied Aspect, Intent Check, Acceptance Check, Evidence,
Verdict가 서로 빠지지 않았는지 확인하는 장부다.

Evidence Ledger는 Engineering Assurance를 인용할 수 있다. `assuranceClaims`,
`controls`, `evidenceKinds` frontmatter나 `## Supporting Assurance Claims`,
`## Supporting Controls` 섹션은 제품 의미를 바꾸지 않고, 현재 verdict를 지탱하는
내부 보증과 운영 절차를 audit trail에 붙인다.

검토 기준:

- 어떤 Promise와 Aspect를 닫는지 명시한다.
- 각 Acceptance Check가 어떤 테스트나 deterministic evidence로 닫히는지
  연결한다.
- `check:evidence-coverage` 표로 Promise, Check, Evidence, Scope, Run, Scenario를
  한 row에 둔다.
- UI intent가 있으면 Intent Verification과 Sufficiency Review를 포함한다.
- `unknown`이나 `not-met`은 중립 상태가 아니라 release blocking 상태다.

Evidence Ledger의 단위는 검증 책임이다. 큰 omnibus ledger는 책임을 흐리고, 좁은
ledger는 source Promise, check row, 실행 명령, review surface를 선명하게 만든다.
ledger 분할은 steward workflow나 validator와 함께 닫혀야 의미가 있다.

## Traceability Cardinality

Traceability cardinality는 "문서가 존재한다"보다 강한 검증이다. 각 노드가 최소
몇 개의 다음 노드와 연결되어야 하는지를 정책 파일로 선언하고,
`mc:validate-story-chain`이 실제 Story Chain을 세어 검증한다. 정책은
[`traceability-cardinality.json`](traceability-cardinality.json)이 정본이다.

## Review Order

내용 중심 검토는 다음 순서가 좋다.

1. Experience: 큰 제품 경험의 경계가 맞는지 본다.
2. Moment: 각 경험 안의 workflow 순간이 적절히 나뉘었는지 본다.
3. Aspect: 여러 Promise를 가로지르는 규칙이 충분히 엄격한지 본다.
4. Promise: 각 순간의 종단 약속과 Acceptance Check가 맞는지 본다.
5. Evidence Ledger: 선언된 약속과 횡단 규약이 실행 근거로 닫혔는지 본다.

이 순서를 따르면 Promise를 고치기 전에 상위 분류가 맞는지 확인할 수 있고,
Aspect를 Promise의 부속 문장으로 낮추거나 단일 Promise를 Aspect로 과하게 올리는
실수를 줄일 수 있다.

## Verdict Evidence Rule

`verdict: unknown`은 blocking 상태다. Promise, Aspect, Evidence Ledger는 현재
evidence가 실행 가능하고 실제 runtime output, rendered DOM, deterministic test,
script, explicit guard를 가리킬 때만 `met`으로 이동한다.

`met`을 선언하려면 `runtime-output` 또는 `rendered-dom` evidence ref가 필요하다.
simulation wrapper, prompt 조각 직접 호출, production 경로 밖의 LLM 응답은 `met`
evidence가 아니다. evidence가 이 기준을 만족하지 않으면 verdict는 `unknown`으로
남긴다.
