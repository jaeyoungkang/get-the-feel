# 상위 약속 작성 도구 — agentic-base의 업스트림 레이어

> 상태: 제안

## 문제

agentic-base는 강한 구현 템플릿이다. 하지만 시작점은 늘 비어 있다.

- `docs/PRODUCT.md`
- `docs/contracts/story-chain/{moments,promises}/<slug>.md`
- `docs/contracts/feature-specs.md` (AC ledger)
- `docs/design-principles.md`

이 네 문서가 채워지기 전까지는, 에이전트가 잘 구현해도 무엇을 향해 가는지 흔들린다. 결국 가장 어려운 일은 코드 생성이 아니라 **상위 약속을 정하는 일**이다.

그래서 agentic-base의 다음 확장 방향은 구현 템플릿 자체가 아니라, 그 앞단에 놓이는 **상위 약속 작성 도구**여야 한다.

한 줄로 줄이면 이렇다.

> 사람은 약속을 승인한다.  
> LLM은 약속을 구조화한다.  
> agentic-base는 승인된 약속을 구현으로 전파한다.

---

## 핵심 주장

궁극적으로 필요한 것은 "LLM이 바로 코드를 만드는 도구"가 아니라, **사람이 상위 계약을 정하도록 돕는 도구**다.

이 도구의 역할은 세 가지다.

1. 오너의 모호한 생각을 제품 계약으로 구조화한다
2. 그 계약을 agentic-base가 바로 받을 수 있는 문서 패키지로 만든다
3. 승인된 계약만 구현 에이전트에게 넘긴다

즉, agentic-base는 구현 시작점이고, 이 도구는 **구현 이전의 계약 정본 생성기**다.

---

## 왜 이 레이어가 필요한가

### 1. 가장 중요한 결정이 제일 비구조적이다

초기 아이디어 단계에서는 Why, 타겟, 거부 신호, 핵심 가치 축, 유저스토리가 대화와 메모 조각으로 흩어진다. 이 상태에서 구현을 시작하면 코드가 사실상 제품 정의를 대신하게 된다.

### 2. 사람은 결정권자이지 문서 노동자가 아니다

오너가 모든 문서를 처음부터 끝까지 손으로 쓰는 방식은 병목을 만든다. 오너의 핵심 역할은 초안 생산이 아니라 **승인과 수정 판단**이다.

### 3. 구현 에이전트는 계약이 명확할수록 강해진다

agentic-base는 하네스와 실행 루프를 제공한다. 이 구조가 잘 작동하려면 입력 문서도 구조화되어 있어야 한다. 상위 약속이 흐리면, 하위 구현은 빨라져도 drift가 커진다.

---

## 도구의 역할 분리

### 사람

- 무엇을 약속할지 결정한다
- 무엇을 만들지 않을지 결정한다
- 초안을 승인하거나 반려한다

### LLM

- 인터뷰, 메모, 시장 가설, 참고 자료를 구조화한다
- 빠진 필드와 충돌을 드러낸다
- 여러 초안 옵션을 제시한다
- 문서 패키지 초안을 생성한다

### 시스템

- 필수 필드 누락을 차단한다
- approval state 없는 문서를 구현 단계로 넘기지 않는다
- 문서 간 ID와 traceability를 강제한다

### agentic-base

- 승인된 문서를 시작점으로 fix_plan, spec, 구현, 검증 체인을 닫는다

핵심은 여기서도 actor가 아니라 **authority 분리**다. LLM은 제안할 수 있지만, 상위 약속을 확정하지는 못한다.

---

## 이상적인 입력과 출력

### 입력

- 오너의 자유 메모
- 해결하려는 문제
- 타겟 사용자 단서
- 경쟁 대안 또는 참고 제품
- 제약 조건
- 만들고 싶지 않은 것

### 출력

최소 출력 패키지는 아래 4개다.

1. `docs/PRODUCT.md`
2. `docs/contracts/story-chain/{moments,promises}/<slug>.md`
3. `docs/contracts/feature-specs.md` (AC ledger)
4. `docs/design-principles.md`

가능하면 아래까지 이어진다.

- 초기 `docs/contracts/story-chain/evidence-ledgers/<slug>.ledger.md` 스켈레톤 (Promise별)
- `fix_plan.md` Phase 1 초안
- 계약 ID 목록 (`experience:<slug>`, `moment:<slug>`, `promise:<slug>`, `aspect:<slug>`)
- unresolved questions 목록

계약 초안만으로 추상을 더 구체화해야 하는 제품이라면, 아래 sample-first 산출물도 이어질 수 있다.

- `docs/sample-pack.md`
- representative sample
- contrast / anti-example
- edge sample
- candidate surface sample

즉, 결과물은 채팅 로그가 아니라 **파일로 고정된 계약 패키지**여야 한다.

---

## built-in skill로 보면 무엇인가

이 도구는 단순 프롬프트 모음이 아니라, agentic-base 안에서 동작하는 **contract-authoring skill** 이다.

핵심 질문은 이것이다.

> 오너가 머릿속에만 갖고 있는 제품 약속을,  
> 어떻게 승인 가능한 문서 패키지로 바꿔서  
> 구현 에이전트에게 넘길 것인가

따라서 이 도구의 본질은 "아이디어 채팅 앱"이 아니라 **계약 작성과 승인 워크벤치**다.

### 핵심 화면

최소한 아래 네 화면이 필요하다.

1. `Intake`
   - 자유 메모, 레퍼런스, 금지하고 싶은 방향, 타겟 단서를 넣는다
2. `Synthesis`
   - LLM이 Why, Target, Non-goals, Value axes, Story, AC 초안을 구조화한다
3. `Approval`
   - 오너가 섹션별로 승인, 수정, 보류, 폐기한다
4. `Export`
   - 승인된 내용을 `agentic-base` 문서 패키지로 쓴다

이 순서를 섞으면 안 된다. 특히 `Approval` 없이 `Export` 로 가면 결국 LLM이 상위 약속을 결정하게 된다.

### 사용자 흐름

1. 오너가 자유 텍스트와 참고 자료를 넣는다
2. 시스템이 빠진 필드와 충돌 후보를 먼저 드러낸다
3. LLM이 여러 초안 옵션을 제시한다
4. 오너가 섹션별로 승인하거나 수정한다
5. 승인 상태가 문서 단위로 기록된다
6. 승인 완료 후에만 `agentic-base` 문서 패키지로 export 된다
7. export 된 저장소에서 구현 에이전트가 Phase 1 이후를 진행한다

즉, 이 앱은 구현 도구가 아니라 **오너의 결정이 파일로 굳어지는 마지막 관문**이다.

---

## 내부 객체 모델

LLM이 안정적으로 다루려면 문서 이전에 내부 계약 객체가 먼저 있어야 한다.

### Product Contract

- product ID
- version
- problem statement
- target users
- value axes
- non-goals
- constraints
- approval state

### Story Contract

- story ID
- parent theme / epic
- story text
- rationale
- owner
- approval state

### Acceptance Contract

- AC ID
- source story ID
- deterministic or evaluative type
- success semantics
- linked spec placeholder
- approval state

### Open Question

- question ID
- related contract IDs
- why unresolved
- blocker severity
- owner decision needed

문서는 이 객체들의 렌더 결과여야 한다. 그래야 나중에 diff, traceability, export, re-generation 이 가능하다.

---

## 승인 모델

이 도구에서 가장 중요한 것은 생성이 아니라 **승인 모델**이다.

승인 상태는 최소 아래 네 가지가 필요하다.

- `draft`
- `needs-review`
- `approved`
- `rejected`

그리고 승인 단위도 문서 전체가 아니라 **섹션 또는 계약 객체 단위**여야 한다. Why만 승인되고, Target은 보류되고, 몇 개 Story만 살아 있는 상태를 표현할 수 있어야 한다.

핵심 규칙:

- `approved` 가 아닌 객체는 export 금지
- `rejected` 객체는 구현 단계로 전파 금지
- `needs-review` 객체가 남아 있으면 Phase 1 fix_plan 초안 생성 금지

---

## agentic-base와의 연결 방식

가장 자연스러운 연결은 두 단계다.

### 1. 문서 export

승인된 계약 객체를 아래 파일로 쓴다.

- `docs/PRODUCT.md`
- `docs/contracts/story-chain/{moments,promises}/<slug>.md`
- `docs/contracts/feature-specs.md` (AC ledger)
- `docs/design-principles.md`

### 2. 초기 구현 큐 export

가능하면 아래까지 같이 생성한다.

- `docs/contracts/story-chain/evidence-ledgers/<slug>.ledger.md` 스켈레톤
- `fix_plan.md` 의 Phase 1 초안
- unresolved questions 목록

즉, export 버튼의 의미는 "문서 저장"이 아니라 **구현 시작 조건 충족**이다.

### 3. sample-first bridge

계약 문서만으로는 아직 제품이 너무 추상적일 수 있다. 특히 source-heavy, data-heavy, expressive surface 제품은 본구현 전에 representative·contrast·edge sample을 먼저 만들어야 drift를 줄일 수 있다.

이때 `sample-first` 스킬은 `docs/sample-pack.md` 를 만들어 아래를 고정한다.

- 어떤 샘플이 대표 케이스인가
- 어떤 샘플이 경계를 선명하게 만드는가
- 어떤 edge case가 이후 구현을 흔드는가
- 어떤 surface sample이 실제 읽기 방식 판단에 쓰이는가

즉 흐름은 점점 이렇게 된다.

`대화 -> 계약 문서 -> sample pack -> engineering profile -> bootstrap -> 구현`

---

## 첫 MVP 범위

처음부터 거대한 시스템으로 만들 필요는 없다. 첫 MVP는 아래면 충분하다.

1. 자유 메모 입력
2. LLM 기반 PRODUCT 초안 생성
3. Why / Target / Non-goals / Value axes 섹션 승인
4. Experience → Moment → Promise → Acceptance Check 초안 생성
5. `docs/PRODUCT.md` + `docs/contracts/story-chain/{moments,promises}/<slug>.md` export
6. unresolved question 목록 생성

이 정도만 돼도 "오너가 상위 약속을 정하게 돕는 도구"라는 본질은 검증할 수 있다.

`feature-specs`, `design-principles`, `spec skeleton`, `fix_plan` 자동 초안은 2단계로 미뤄도 된다.

---

## 비목표

이 도구가 처음부터 맡지 말아야 하는 것도 분명히 둬야 한다.

- 바로 코드 생성하기
- 승인 없는 자동 구현 위임
- 문서 없이 대화 로그만 남기기
- PM 툴처럼 일정 관리까지 다 맡기기
- 시장 조사나 경쟁 분석을 자동 진실처럼 확정하기

이 앱은 실행 자동화보다 **상위 약속 명시화**에 집중해야 한다.

---

## 권장 작업 흐름

1. 오너가 문제와 목표를 자유롭게 말한다
2. LLM이 Why, 타겟, 거부 신호, 핵심 가치 축을 구조화한다
3. LLM이 Experience → Moment → Promise → Acceptance Check 초안을 제안한다
4. 오너가 승인, 수정, 삭제를 반복한다
5. 시스템이 필수 필드와 문서 간 연결을 검사한다
6. 승인된 문서 패키지를 agentic-base 저장소에 쓴다
7. 구현 에이전트가 그 문서를 시작점으로 Phase 1 이후를 진행한다

이 흐름의 핵심은 "대화에서 곧바로 코드"가 아니라, **대화 → 계약 문서 → sample pack → 구현** 순서를 강제하는 데 있다.

---

## agentic-base에 어떻게 연결되는가

이 도구는 agentic-base를 대체하지 않는다. agentic-base 앞단의 빈칸을 메운다.

### 현재 agentic-base가 맡는 것

- 하네스
- 품질 게이트
- 구현 루프
- Story Chain 기반 실행 계약 (Promise → Aspect → Evidence Ledger → Code/Test)

### 앞으로 이 도구가 맡아야 하는 것

- PRODUCT 초안 구조화
- Experience / Moment / Promise / Aspect 초안화
- Acceptance Check 초안화
- 디자인 원칙 초안화
- 구현 전에 unresolved question을 표면화

즉, 둘의 관계는 아래와 같다.

> Contract Authoring Tool → agentic-base → 구현 에이전트

---

## 설계 원칙

### 문서가 정본이다

결과물은 노션 요약이나 채팅 답변이 아니라 저장소에 들어가는 실제 문서여야 한다.

### 승인 없는 자동 전파 금지

LLM이 만든 초안은 승인 전까지 구현 단계로 내려가면 안 된다.

### 여러 초안을 허용한다

초기 단계에서는 단일 정답보다 대안 비교가 중요하다. 이 도구는 정답 기계가 아니라 **계약 비교 보조기**여야 한다.

### unresolved question을 남긴다

모든 공백을 억지로 메우지 않는다. 불확실한 부분은 문서에 남겨 구현 에이전트가 멋대로 결정하지 못하게 한다.

### 파일 패키지로 끝난다

최종 산출물은 사람이 읽고 git으로 추적 가능한 파일이어야 한다.

---

## 장기적으로 생길 수 있는 기능

- 계약 인터뷰 UI
- Why / Target / Non-goals 품질 체크
- 유저스토리 중복 및 충돌 감지
- AC와 spec skeleton 자동 생성
- 승인 상태 관리
- agentic-base `init-project.sh` 와의 연결
- 승인된 계약 패키지로 새 프로젝트 초기화
- 계약 객체 diff viewer
- 섹션 단위 승인 이력
- approved contract 기준 `fix_plan` 초안 자동 생성

---

## 내장 스킬 묶음 방향

이 도구는 agentic-base 안의 **프로젝트 전반 스킬 묶음**으로 내장된다.

최소 묶음은 아래 여섯 가지다.

1. `contract-authoring`
   - upstream 계약 작성
   - `PRODUCT` · Story Chain(`experiences/`, `moments/`, `promises/`, `aspects/`) · `feature-specs.md` (AC ledger) · `design-principles` 수렴
2. `engineering-profile`
   - 기술 스택뿐 아니라 deploy, data, security/privacy, observability, quality gate, release, cost 같은 non-business constraints를 구현 전에 닫음
3. `sample-first`
   - representative·contrast·edge·surface sample을 묶어 본구현 전 추상을 구체화
   - 계약 문서에서 남은 example-sensitive blocker를 sample pack으로 검증
4. `project-bootstrap`
   - 승인된 계약 문서와 engineering profile을 실제 프로젝트 저장소로 연결
   - `init-project.sh`, `docs/BOOTSTRAP.md`, `fix_plan.md` 같은 bootstrap 표면을 따라 초기 패키지 설치와 scaffold baseline을 닫음
5. `implementation-propagation`
   - 승인된 계약을 `docs/contracts/story-chain/evidence-ledgers/<slug>.ledger.md` · `fix_plan.md` · 구현 레이어(코드/테스트)로 전파
   - 계약을 멋대로 다시 쓰지 않고 가장 작은 전파 단위를 선택
6. `current-state-query`
   - 지금 어떤 계약이 어느 stage에 있고, blocker와 next authority가 무엇인지 읽기 전용으로 설명

핵심은 "만능 에이전트 하나"가 아니라, 계약 작성·구현 전파·상태 조회를 서로 다른 책임으로 쪼개는 것이다.

여기서 중요한 건 `engineering-profile` 이다. 많은 프로젝트는 비즈니스 로직은 정의됐는데, 실제로는 stack보다 더 큰 구현 제약이 deploy 모델, 보안/프라이버시, 관측, quality gate, 비용 구조에서 나온다.

즉 장기 구조는 아래에 가깝다.

> built-in skills inside agentic-base  
> = contract authoring + engineering profile + sample-first + project bootstrap + implementation propagation + state query

---

## 결론

agentic-base가 진짜 강해지려면, 구현 루프만 제공하는 템플릿에서 멈추면 안 된다.

그 앞단에서 **사람이 상위 약속을 정하도록 돕는 도구**가 붙어야 한다. LLM은 그 과정을 구조화하고 문서화하는 조력자여야 하고, 구현 에이전트는 승인된 문서를 받아 하위 레이어를 전파해야 한다.

한 줄 결론:

> 좋은 에이전트 개발 흐름은 `대화 → 코드`가 아니라 `대화 → 계약 문서 → sample pack → 구현`이다.
