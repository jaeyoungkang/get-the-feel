# Story Chain

이 디렉토리는 agentic-base 계약의 정본이다.

- `experiences/`
- `moments/`
- `promises/`
- `aspects/`
- `evidence-ledgers/`
- `traceability-cardinality.json`

Story Chain을 지탱하는 내부 invariant, lifecycle, operational control은 필요할 때
[`../engineering/`](../engineering/)에 둔다. 이 README는 사용자/운영자-facing 제품
의미 계층만 다룬다.

## 개념 정본

Story Chain의 개념 모델, 책임 경계, Evidence Ledger 의미, 검토 순서, 예시는
[`concepts.md`](concepts.md)가 유일한 정본이다. 이 README는 디렉토리 navigation과
파일 형식만 다룬다. 개념 문장을 바꿀 때는 README나 Evidence Ledger에 중복 설명을
추가하지 말고 `concepts.md`를 먼저 갱신한다.

## 참조 도메인

| 참조                      | 파일                                  |
| ------------------------- | ------------------------------------- |
| `experience:<slug>`       | `experiences/<slug>.md`               |
| `moment:<slug>`           | `moments/<slug>.md`                   |
| `promise:<slug>`          | `promises/<slug>.md`                  |
| `aspect:<slug>`           | `aspects/<slug>.md`                   |
| `intent-check:<slug>`     | Promise의 `## Intent Checks` 블록     |
| `acceptance-check:<slug>` | Promise의 `## Acceptance Checks` 블록 |

Experience frontmatter에는 `scope:`가 필요하다. 허용값은 다음 세 가지다. 새
최상위 노드 타입을 추가하지 않고, 같은 Experience 그래프 안에서 핵심 제품 경험과
보조·governance surface를 구분하기 위한 메타데이터다.

```yaml
scope: core-product # 또는 support-layer, governance
```

legacy 식별자는 `legacyIds:` frontmatter에만 보존한다. 새 작업의 기본 식별자는
`promise:{slug}`, `intent-check:{slug}`, `acceptance-check:{slug}`,
`aspect:{slug}` 형식을 쓴다.

## Layout

```text
docs/contracts/story-chain/
  README.md
  concepts.md
  traceability-cardinality.json
  experiences/
    _TEMPLATE.md
  moments/
    _TEMPLATE.md
  promises/
    _TEMPLATE.md
  aspects/
    _TEMPLATE.md
  evidence-ledgers/
    _TEMPLATE.ledger.md
  rubrics/         # H authority 전용
  evidence/        # production runtime 자동 생성
../engineering/    # optional Engineering Assurance 하위 계약 계층
```

`experiences/`는 제품이 오래 유지하려는 경험 영역, `moments/`는 그 경험 안에서
약속이 발동되는 workflow 순간, `promises/`는 Moment에서 사용자에게 지키는 종단
약속, `aspects/`는 횡단 제약, `evidence-ledgers/`는 Promise를 실행 가능한 검증
근거로 엮는 원장을 담는다. `docs/contracts/feature-specs.md`는 Acceptance Check
인벤토리와 scenario catalog를 위한 cross-ledger 인덱스다.

## Verdict Defaults

새 Promise, Aspect, Evidence Ledger의 verdict 기본값은 `unknown`이다. `unknown`은
중립이 아니라 blocking verdict다. evaluator가 돌지 않았거나, evidence가
부족하거나, rubric이 빈약하거나, production-equivalent 입력이 아니면 `unknown`으로
남긴다.

`not-met`은 실행된 truth signal이 약속 미달을 보여줄 때 쓴다. `met`은 아래
evidence rule을 만족할 때만 쓴다.

## Curated Evidence Ledger Subtypes

Evidence Ledger는 두 subtype 중 하나로 해석한다.

| Subtype         | frontmatter                                            | 조건                                                                                                                                                                                          |
| --------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default         | `curated: true`                                        | 최소 1개 Intent Check entry와 최소 1개 Acceptance Check entry를 가진다.                                                                                                                       |
| Intent-absorbed | `curated: true` + `intentAbsorbedIntoAcceptance: true` | Intent 질문이 Human Judgment Gate 결정에 의해 Acceptance Check로 흡수됐다. Intent Check entry는 0개일 수 있지만, source Promise마다 Acceptance Check coverage와 H decision ref가 있어야 한다. |

Skeleton ledger는 `curated:`를 비워 둘 수 있다. `curated: true`로 올리는 순간에는
위 subtype 중 하나를 명시적으로 만족해야 한다.

## Acceptance Checks 표 형식

Acceptance Checks 섹션은 자유 bullet list가 아니라 정확히 하나의
`> check:evidence-coverage` blockquote 표를 가진다. 표의 각 row는 하나의
`Promise#AcceptanceCheck`가 어떤 evidence, scope, run command, scenario로
닫히는지 나타낸다.

```markdown
## Acceptance Checks

> check:evidence-coverage
> | promise | check | evidence | scope | run | scenarios |
> | --- | --- | --- | --- | --- | --- |
> | promise:example | acceptance-check:example-ac1 | vitest @ `...` | Evidence runner | `npx vitest run ...` | scenario:example |
```

이전의 list/object block 형식은 더 이상 canonical 형식이 아니다. parser는
Acceptance Checks 섹션에서 정확히 하나의 `> check:evidence-coverage` 표를
요구한다.

## Human Judgment Gate Refs

Intent-absorbed subtype은 `docs/intent-judgments.md`의 H decision을 인용해야
한다. ref 형식은 아래를 기본으로 한다.

```yaml
intentJudgmentRefs:
  - promise:{promise-slug} -> HJG-YYYY-MM-DD-{decision-slug}
```

`docs/intent-judgments.md`에는 같은 ID를 H3 heading으로 기록한다.

```markdown
### HJG-YYYY-MM-DD-{decision-slug}
```

legacy story를 가져온 경우에는 `legacyIds:`에 legacy ID를 보존하고, H decision
entry의 `Legacy refs` 필드에 같이 적는다. Human Judgment Gate ref 없이 Intent를
Acceptance Check에 흡수했다고 주장하지 않는다.

## `met` Flip Evidence Rule

`met`으로 verdict를 바꾸려면 production-equivalent evidence가 필요하다. 허용되는
evidence kind는 둘뿐이다.

| kind             | 의미                                              |
| ---------------- | ------------------------------------------------- |
| `runtime-output` | 실제 runtime 경로가 만든 출력 또는 tool-call 인자 |
| `rendered-dom`   | 실제 UI 컴포넌트가 렌더한 DOM                     |

simulation wrapper, prompt 조각 직접 호출, production 경로 밖의 LLM 응답은 `met`
evidence가 아니다. evidence가 이 기준을 만족하지 않으면 verdict는 `unknown`으로
남긴다.

Schema level evidence shape:

```yaml
evidence:
  kind: runtime-output | rendered-dom
  ref: <test path, DOM dump, run output, or artifact ref>
```

프로젝트가 Engineering Assurance를 켠 경우 Evidence Ledger는 아래 frontmatter와
섹션으로 내부 보증을 인용할 수 있다.

```yaml
assuranceClaims:
  - assurance-claim:{slug}
controls:
  - control:{slug}
evidenceKinds:
  - runtime-output
```

```markdown
## Supporting Assurance Claims

- assurance-claim:{slug}

## Supporting Controls

- control:{slug}
```

`not-met`과 `unknown`은 `gateNotes:`로 사유를 남긴다. `met`은 `evidence:` 없이
선언하지 않는다.

## Traceability Cardinality

`traceability-cardinality.json`은 chain의 최소 연결 수를 선언한다. 현재
validator가 강제하는 관계는 다음과 같다.

- Experience 하나는 Moment 하나 이상을 가진다. Moment 하나는 Experience 하나에
  속한다.
- Moment 하나는 Promise 하나 이상을 가진다. Promise 하나는 Moment 하나에 속한다.
- Promise 하나는 Acceptance Check 하나 이상을 가진다.
- Promise 하나는 Evidence Ledger 하나 이상에 인용된다.
- Promise의 각 Acceptance Check는 Evidence Ledger `check:evidence-coverage` 표
  row 하나 이상에 인용된다.
