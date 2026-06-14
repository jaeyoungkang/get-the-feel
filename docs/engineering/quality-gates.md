# 품질 게이트: 선언 → 실행 → 검증

> 전체 맥락은 `agentic-engineering-principles.md` 참조.

## 원리

선언→실행→검증은 코드에만 적용되는 것이 아니라, **제품 개발의 모든 층에 재귀적으로 적용**되는 범용 원리다. 에이전트의 구현 품질은 스펙의 품질에 비례한다. 스펙에 구멍이 있으면 에이전트가 아무리 잘 만들어도 그 구멍을 채우지 못한다.

| 층 | 선언 | 실행 | 검증 |
|---|------|------|------|
| **설계** | user stories, ACs, 시나리오 | 플로우 그래프, 시나리오 작성 | spec-scope (구조적·의미적 공백 탐지) |
| **구현** | mc CLI, 타입, 규칙 | 에이전트 코딩 | 품질 게이트 (linter, test, coverage, Story Chain validator) |
| **관심사** | 토큰/카탈로그 (단일 원본) | 사용 지점에서 참조 | concern check (하드코딩 탐지) |

설계 층의 검증은 **구현 전에** 스펙 완전성을 보장한다. 구현 층의 검증은 **구현 후에** 코드 정합성을 보장한다. 두 층이 합쳐져야 제품 개발 루프가 닫힌다.

## 설계 층: 스펙 검증

스펙 문서(user stories, ACs, 시나리오)를 플로우 그래프로 추출하고, 구조적 공백을 기계적으로 탐지한다. 2-phase:

1. **구조적 분석** (코드, 결정적) — orphan node, dead edge, untested error path, uncovered chip. 그래프 순회 문제이므로 LLM이 아니라 코드로 판정
2. **의미적 분석** (LLM) — spec이 실제로 주장하는 것을 테스트하는가? 구조적 발견의 confirm/dismiss/downgrade

이것은 "계산과 효과를 분리한다"의 검증 도구 버전이다.

## 구현 층: 코드 검증

코드, 비즈니스 로직, 프롬프트 모두 같은 패턴으로 관리한다:
- **선언**: 규칙(lint, convention), 정책(Promise, Aspect, 스키마), 프롬프트 템플릿
- **실행**: 에이전트/LLM이 작업
- **검증**: 테스트, 린터, mc CLI(Story Chain validator + AC trace + audit-surface)가 자동 판정

비결정적 영역(프롬프트/응답)의 검증은 exact match가 아니라 **범위 검증**(boundary check)이다.

---

## Mission Control CLI — Story Chain executable contract 레이어

Story Chain(`docs/contracts/story-chain/`)과 Evidence Ledger를 정본으로, 사람의 의도(Experience/Moment/Promise/Aspect)와 코드/검증 사이의 일관성을 강제하는 도구.

### 진입

| 명령 | 역할 |
|---|---|
| `npm run mc:validate-story-chain` | Story Chain 구조·AC trace·Code trace·Aspect 검증 |
| `npm run mc:audit-surface` | 사용자-facing surface가 Story Chain의 Promise에 매핑되는지 감사 |
| `npm run mc:check-new-criticals` | baseline 대비 새 critical 발생 여부 |
| `npm run mc:status` | 전체 release verdict snapshot |
| `npm run mc:add-promise` | 새 Promise 안전 추가 (인터랙티브) |
| `npm run mc:propagate` | Promise → Aspect → Evidence Ledger 변경 전파 |

### 얼라인 체인 (Story Chain)

모든 기능 작업은 아래 단계를 **한 방향으로** 통과해야 한다. 한 단계를 건너뛰면 나머지가 stale 상태로 깨진다.

| 단계 | 정본 | 참조 형식 |
|---|---|---|
| Experience | `docs/contracts/story-chain/experiences/<slug>.md` | `experience:<slug>` |
| Moment | `docs/contracts/story-chain/moments/<slug>.md` | `moment:<slug>` |
| Promise | `docs/contracts/story-chain/promises/<slug>.md` | `promise:<slug>` |
| Aspect | `docs/contracts/story-chain/aspects/<slug>.md` | `aspect:<slug>` |
| Acceptance Check | Promise의 `## Acceptance Checks` 블록 | `acceptance-check:<slug>` |
| Evidence Ledger | `docs/contracts/story-chain/evidence-ledgers/<slug>.ledger.md` | (파일) |
| Code / Tests / Surface tags | `app/**` + `__tests__/*.test.ts` | (경로) |

새 Promise/Acceptance Check 추가 시 **같은 변경 안에서** Promise → Aspect → Evidence Ledger → Code/Test까지 모두 닫는다. 코드만 바꾸면 작업을 멈추고 체인을 먼저 채운다.

### Evidence Ledger 문법

`evidence-ledgers/<slug>.ledger.md` 는 frontmatter + `check:evidence-coverage` 표 + Sufficiency Review로 구성된다. 자세한 형식은 `docs/contracts/story-chain/evidence-ledgers/_TEMPLATE.ledger.md`.

### Engineering Assurance 계층

Story Chain Promise가 사용자/운영자-facing 제품 의미를 소유하고, 그 Promise를
지탱하는 내부 invariant는 필요할 때 `docs/contracts/engineering/`에 둔다.

| 노드 | 역할 | 참조 형식 |
|---|---|---|
| Assurance Claim | 여러 Promise를 지탱하는 내부 invariant | `assurance-claim:<slug>` |
| Lifecycle | 시간에 따른 상태 전이와 금지 전이 | `lifecycle:<slug>` |
| Operational Control | 실행하거나 감사해야 하는 절차/runbook | `control:<slug>` |
| Evidence Kind | release evidence vocabulary 확장 | `runtime-output`, `deploy-health-output` 등 |

Mission Control은 이 계층을 parse-only warning으로 시작한다. malformed ID, duplicate
ID, missing required section, missing reference를 warning으로 보고하되 release를
바로 차단하지 않는다. 최소 하나의 closed slice로 false positive와 작성 부담을
확인한 뒤, `met` verdict를 주장하는 Promise/Evidence Ledger의 깨진
claim/control/evidence-kind에 한해서만 blocking 승격을 검토한다.

### 주의

- Promise의 Acceptance Check는 Evidence Ledger의 `check:evidence-coverage` 표 row로 내려가야 한다.
- traceability-cardinality.json 의 최소 연결 수가 강제된다 — 누락 시 `mc:validate-story-chain` 이 critical로 발사.
- unknown verdict는 release blocking. baseline에 frozen 시킨 unknown은 newCriticals로 잡히지 않는다.
- Engineering Assurance의 draft/unknown 노드는 release blocking이 아니다. release
  blocking은 `met` 주장과 깨진 보증 참조가 함께 있을 때만 의미가 있다.

---

## 검증 단계 체인

단계별로 깊이를 다르게 해 빠른 피드백 + CI 안전을 양립한다.

| 단계 | 트리거 | 포함 내용 | 목적 |
|---|---|---|---|
| **`quality:guards`** | 수동/모든 단계 선행 | 하드코딩 탈출구 스캔 (한글/escape/test-ratio) | 가장 가볍고 빠른 방어선 |
| **`quality:commit`** | Husky `pre-commit` | `quality:guards` + `lint-staged` (변경 파일만 eslint+prettier) | 커밋 속도 유지 |
| **`quality:prepush`** | Husky `pre-push` | `quality:check` (전체) | 로컬에서 CI 통과 예측 |
| **`quality:check`** | 수동 전체 검증 | `guards` + format:check + lint + typecheck + dep:check + dup:check + knip + test:coverage + **mc:validate-story-chain** + **mc:audit-surface** + **mc:check-new-criticals** + build | 로컬 전체 검증 |
| **`quality:ci`** | GitHub Actions | `quality:check` + lint:report (JSON 출력) | CI 공식 판정 |

```
guards ⊂ commit   (얕고 빠름)
       ⊂ prepush
       ⊂ check   (깊고 느림)
       ⊂ ci
```

### 원칙

- `pre-commit`은 **변경 파일만** — 속도 중시
- `pre-push`는 **전체 검증** — CI 실패 방지
- CI는 `pre-push`와 **동일 내용 + 리포트 포맷**만 차이

---

## 커버리지 기준선

수치는 제품 성격에 따라 조정한다. 아래는 높은 자동화 제품의 참고선이다.

| 지표 | 기준 | 의미 |
|---|---|---|
| lines | 97% | 거의 모든 라인 실행 |
| statements | 97% | — |
| functions | 95% | 작은 유틸까지 커버 |
| branches | 90% | 분기는 상대적 여유 |

### 커버리지 대상 선택

전체 파일 일률 적용이 아니라 **비즈니스 로직의 순수 부분**에 집중:
- `*.helpers.ts` 파일들 (순수 함수 모음)
- 핵심 정책 모듈 (예: `execution-policy.ts`)
- 스트리밍·agent 핵심 헬퍼

UI 컴포넌트는 별도 정책. E2E가 필요한 영역은 unit 커버리지보다 **행동 시나리오**가 우선.

### 커버리지의 한계

- 높은 커버리지가 품질을 보장하지 않는다 — assertion 없는 테스트로도 커버리지는 오른다
- 임계치는 **회귀 방지선**이지 달성 목표가 아님
- 새 코드를 기존 임계치 아래로 내리는 PR을 차단하는 게 본 기능
