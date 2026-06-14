# Pilot Lifecycle

agentic-base는 클론한 저장소 안에서 새 AI 제품 파일럿을 시작하고, 의도 수렴부터
bootstrap까지 닫기 위한 베이스다. Story Chain 권한 모델을 따르되,
초기 제품 탐색은 **샘플 반복이 먼저 의도 빈틈을 드러낸다**는 전제로 운영한다.

## Canonical Sequence

```text
1. clone agentic-base + initial intent
2. MVP sample iteration -> Story Chain completion
3. bootstrap + technology selection
4. bootstrap event tracking + change logging
5. Mission Control propagation
6. implementation + wiring verification
```

## 1. Clone + Initial Intent

제작자는 agentic-base를 클론한 뒤 최초 의도를 전달한다. 이 단계의 목표는 구현이
아니라, 샘플 작업을 시작할 만큼의 방향을 잠그는 것이다.

| 판단 | Human | Agent | System/Evaluator |
| --- | --- | --- | --- |
| 제품이 풀 문제, 대상 사용자, 쓰지 않을 범위 | 승인·수정 | 질문·요약·초안화 | 없음 |
| 최초 `docs/PRODUCT.md` draft | 승인 | 작성 | 없음 |
| 초기 Story Chain 후보 | 의미 승인 | Experience/Moment/Promise/Aspect 후보 작성 | `mc:*`로 구조 검사 |

Human이 반드시 승인해야 하는 것:

- 제품이 누구를 위한 것인지
- 어떤 순간에 도움이 되어야 하는지
- 어떤 산출물이 “쓸모 있다”고 볼 수 있는지
- 명백히 하지 않을 것

Agent가 기계적으로 처리할 수 있는 것:

- 인터뷰 질문 1-3개씩 진행
- 답변을 `docs/PRODUCT.md`, Story Chain 후보, unresolved list로 구조화
- 기존 템플릿과 용어에 맞춰 문서 초안 작성

## 2. MVP Sample Iteration

최초 의도는 대개 부족하다. 따라서 바로 기술 스택을 고르지 않고, MVP 샘플을 먼저
만든다. 샘플은 구현 코드가 아니라 **의도 검증 artifact**다.

반복 루프:

```text
sample proposal -> sample artifact -> Human review -> gap capture -> Story Chain update
```

샘플은 최소 하나 이상의 실제 artifact를 가져야 한다. 예:

- 화면 HTML, 이미지, JSON, CSV, spreadsheet row
- 입력 캡처, 파싱 결과, 판단 basis, 사용자-facing output
- export/handoff 예시

이 단계에서 닫아야 하는 것:

| 산출물 | Human | Agent | System/Evaluator |
| --- | --- | --- | --- |
| `docs/sample-pack.md` | 샘플 선택과 판정 승인 | representative/contrast/edge 구조화 | start-pilot preflight |
| `samples/*` | “이 방향이 맞다/아니다” 판단 | artifact 제작·수정 | 파일 존재와 참조 검사 |
| Story Chain | Experience/Moment/Promise/Aspect 의미 승인 | 샘플에서 드러난 빈틈을 계약으로 반영 | `mc:validate-story-chain` |
| `docs/design-principles.md` | 표현 원칙 승인 | 샘플에서 반복되는 표현 규칙 추출 | 없음 |

샘플 반복 종료 조건:

- representative sample이 제품 약속을 보여준다.
- contrast/edge sample이 하지 않을 것과 실패 조건을 드러낸다.
- Story Chain의 Promise와 Acceptance Check가 샘플 판단을 설명한다.
- Human이 “이 샘플 방향으로 bootstrap해도 된다”고 승인한다.

## 3. Bootstrap + Technology Selection

세부 기술 선택은 샘플과 Story Chain이 잠긴 뒤 한다. 기술은 취향이 아니라 계약을
실현하는 scaffold decision이다.

| 판단 | Human | Agent | System/Evaluator |
| --- | --- | --- | --- |
| runtime, framework, storage, deployment | 승인·반려 | 2-3개 선택지와 tradeoff 제안 | 없음 |
| `docs/engineering-profile.md` | 최종 승인 | 샘플/Story Chain 기준으로 작성 | 없음 |
| `docs/bootstrap-approval.md` | bootstrap 승인 | 승인 근거 정리 | `scripts/start-pilot.mjs` |
| bootstrap readiness | 없음 | 누락 산출물 보완 | `scripts/start-pilot.mjs` |
| repo scaffold | 없음 | `init-project.sh` 실행 | git initial commit, mc gates |

`scripts/start-pilot.mjs`는 bootstrap 직전 gate다. 기본값은 현재 agentic-base clone을
승인 소스로 보는 것이다. 다른 planning package에서 산출물을 가져올 때만
`--approved-source <dir>`를 지정한다. 이 gate는 다음을 확인한다.

- `docs/PRODUCT.md`
- `docs/design-principles.md`
- `docs/sample-pack.md`
- `samples/` 실제 artifact
- `docs/engineering-profile.md`가 템플릿이 아닌 상태
- `docs/bootstrap-approval.md`의 Human approval checklist 완료

engineering profile은 **sample-first 이전 선결 조건이 아니라 bootstrap 안의 기술
선택 산출물**이다. 따라서 기술 선택은 샘플이 충분히 제품 결을 드러낸 뒤에 한다.

## 3.5 Bootstrap Events + Change Logging

bootstrap부터는 프로젝트가 실제 저장소로 생기므로, 작업 기억과 변경 추적이 파일로
남아야 한다.

| 표면 | 시점 | 쓰는 주체 | 검증 |
| --- | --- | --- | --- |
| `.project-knowledge-local/work-memory.md` | 세션 시작·전환·종료 | Agent | `npm run pk:validate` |
| `.project-knowledge-local/work-memory-log.jsonl` | 중요한 판단·빈틈·다음 처리 | Agent | `npm run pk:validate` |
| `docs/project-events/bootstrap-events.jsonl` | bootstrap/scaffold/system event | Agent 또는 script | `npm run pk:validate` |
| `docs/change-log.md` | material change | Agent, Human review | review + git diff |

기계적으로 기록할 것:

- project initialized
- approved source imported
- skill suite synced
- bootstrap technology profile locked
- validation gate run/result

Human 판단이 필요한 것:

- 변경이 제품 의미를 바꾸는지
- change log에 남길 정도로 material한지 애매한 경우
- 기억에 남기면 안 되는 민감 정보 여부

## 4. Propagation

bootstrap 뒤에는 Mission Control 기준으로 한 Promise 또는 한 Evidence Ledger씩
작게 전파한다.

Agent가 할 수 있는 것:

- approved Promise를 Evidence Ledger와 코드/test target으로 전파
- `fix_plan.md`의 다음 한 항목 처리
- `mc:*` 검증과 wiring 검증 실행

Agent가 하면 안 되는 것:

- Human 승인 없이 새 Promise/Aspect 의미 확정
- Story Chain 없이 코드만 작성
- `unknown`/`not-met`을 통과로 간주

## Skill Mapping

| 단계 | 주 스킬 | 보조 스킬 |
| --- | --- | --- |
| initial intent | `contract-authoring` | `mission-control`, `project-knowledge` |
| sample iteration | `sample-first` | `contract-authoring`, `mission-control`, `project-knowledge` |
| technology selection + bootstrap | `engineering-profile`, `project-bootstrap` | `sample-first`, `project-knowledge` |
| event/change logging | `project-knowledge` | `mission-control` |
| propagation | `mission-control`, `implementation-propagation` | `verify-wiring` |
| completion check | `verify-wiring` | `mission-control` |
