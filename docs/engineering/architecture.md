# 아키텍처

> 전체 맥락은 `agentic-engineering-principles.md` 참조.

## 3-Plane

AI 제품의 아키텍처는 세 평면으로 분리된다. 혼재하면 관측·테스트·책임이 뒤엉킨다.

- **Product Plane** — UX 경험 (진행 표시, 중단, 되돌리기, 부분 재생성, 맥락 누적)
- **Agent Plane** — 정책 집행 (약속 강제, 실행 기록, 안전장치)
- **Execution Plane** — 비동기 실행 (재시도, 비용 통제, 관측, 피드백 루프)

## 관측 체계

1. **에이전트 관측** — plan/audit 결과, 약속 판정, 주의력 프레임, 관계 상태 변화
2. **서비스 관측** — 에러·성능·이상 탐지
3. **비용 관측** — 토큰, API 비용을 세션·모델별 추적
4. **피드백 루프** — audit 결과 → 약속 갱신 → 다음 plan 개선

핵심: 행위뿐 아니라 **판단 과정(why)**도 기록. 왜 그 결정이 나왔는지를 추적할 수 없으면 개선 루프가 닫히지 않는다.

## 검토 surface는 business logic observability다

AI 제품의 비즈니스 로직은 코드 함수 하나에만 있지 않다. 특히 에이전트형 제품에서는 시나리오 계약, runtime path, execution policy, prompt assembly, response schema, surface contract가 함께 결과를 만든다.

따라서 검토 도구는 prompt viewer나 dependency graph로 끝나면 안 된다. 실제로 보이는 결과를 만든 논리 조합과 제약 체인을 읽게 해야 한다.

### 기본 읽기 순서

1. visible result
2. cause chain
3. constraints
4. evidence and edit point

### 설명 보드와 제어 보드 분리

- `Why This Comment` — 왜 이 결과가 나왔는가
- `What Controls It` — 무엇을 바꾸면 이 결과가 달라지는가

섞지 말 것. 설명과 제어가 한 패널에 섞이면 운영자가 "원인 파악"과 "수정"을 구분하지 못한다.

## 웹 도메인 계약

웹 제품은 아래 5가지 계약을 먼저 지킨다 — 에이전트가 만드는 코드도 이 계약 안에 있어야 한다.

1. **주소·복원** — URL = 상태 식별자. 주소만으로 상태 복원 가능
2. **히스토리** — 뒤로가기/앞으로가기가 앱 상태 전이와 일치
3. **HTTP 의미론** — GET=조회, 캐시/멱등성/재시도
4. **상태 경계** — 공유 상태는 URL/서버, 일시적 상태는 로컬
5. **에러·로딩** — 라우트별 명시적 처리
