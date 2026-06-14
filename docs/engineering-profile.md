# Engineering Profile — 가칭 `{{PROJECT_NAME}}`

> 이 문서는 **구현 전 engineering decision의 SSOT**.
> `product/contract.md` 와 Story Chain(`docs/contracts/story-chain/`)이 정의한 제품 계약을, 실제 구현 가능한 공학적 제약으로 바꾸는 중간 계층이다.

이 문서는 모든 engineering choice를 지금 다 확정하려고 쓰는 문서가 아니다.

- **Locked Now** — 지금 잠글 것
- **R&D Required** — 별도 R&D 트랙으로 둘 것
- **Unresolved** — 아직 unresolved로 남길 것

을 분리해, 구현 에이전트가 멋대로 빈칸을 채우지 못하게 하는 것이 목적이다.

## Locked Now

### 1. App Topology

(예: read-only public web app, full-stack with auth, batch pipeline + dashboard 등)

### 2. Three Planes

새 제품이 AI 제품이거나 agentic workflow를 포함하면 세 평면을 분리한다. 세 평면이
필요 없는 제품은 `not applicable`로 닫는다. 이름만 적지 말고 각 평면의 책임과
관측 대상을 한 줄씩 쓴다.

| Plane | 이 프로젝트의 책임 | 관측 대상 |
| --- | --- | --- |
| Product Plane |  |  |
| Agent Plane |  |  |
| Execution Plane |  |  |

### 3. Artifact Strategy

(canonical artifact의 위치·포맷·버저닝 규칙)

### 4. Publish Model

(개발자/운영자가 어떤 흐름으로 결과를 배포하는가)

### 5. Auth / Identity Baseline

(MVP에서 사용자 인증을 두는지, 운영자 권한 경계는 어디에 두는지)

### 6. Security / Privacy Baseline

(PII 저장 여부, secret 관리, 저장소 커밋 규칙)

### 7. Evidence Model

(어떤 데이터가 source-of-truth인가, evidence 닫는 방식)

### 8. Initial Release Floor

아래 조건 중 하나라도 깨지면 validation은 실패다.

-

## R&D Required

(별도 트랙으로 분리할 영역. 지금 닫지 않고 R&D 진행 후 본 profile에 흡수.)

### 1.

## Unresolved

(지금 결정하지 않을 영역. 다음 단계에서 다시 열 수 있다.)

-

## Downstream Implications

지금 상태에서 바로 내려갈 수 있는 것:

-

아직 내려가면 안 되는 것:

-

## Revision Triggers

아래가 바뀌면 이 문서를 다시 열어야 한다.

-

## Story Chain 정합

이 profile의 Locked Now 항목들은 Story Chain의 Aspect로 격상되거나 Promise의 Acceptance Check로 강제된다. 새 Locked 항목이 두 Promise 이상에 영향을 주면 `docs/contracts/story-chain/aspects/<slug>.md` 로 격상한다.
