# Domain Layer Activation Guide

product-weaver는 도메인 베이스가 자기 프로젝트에 맞는 하네스를 발견하도록 돕는다.
모든 프로젝트에 같은 문서, 같은 스킬, 같은 gate를 강제하지 않는다. 도메인은
4원리를 자기 상황에 맞는 레이어로 인스턴스화한다.

이 문서는 어떤 레이어를 언제 만들지 판단하는 가이드다. 원리 정본은
`docs/principles.md`다. 이 문서는 원리를 대체하지 않는다.

## 기본 판단

먼저 가장 작은 레이어로 닫는다. 반복되는 의도 이탈, 운영 실패, 검증 실패가
보일 때만 새 레이어를 만든다.

1. 사용자에게 한 약속을 잠글 곳이 없으면 제품 계약 자산을 만든다.
2. 약속과 결과의 갭을 남길 곳이 없으면 Gap Ledger를 만든다.
3. 사람이 확인해야만 하는 상태가 반복되면 기계 gate를 만든다.
4. 내부 invariant가 반복되면 내부 보증 레이어를 만든다.
5. 사람이 반복 실행하는 절차가 생기면 운영 절차 레이어를 만든다.
6. 외부 자료가 의사결정에 영향을 주면 리서치 기록 위치를 만든다.

## 제품 계약 자산

제품 계약 자산은 사용자에게 한 약속을 잠그는 자리다. 이름과 형식은 도메인이
정한다. user story, promise, Hypothesis Stitch, scenario contract 같은 형태가 될
수 있다.

다음 신호가 보이면 만든다.

- 사이클마다 결과물은 나오지만 사용자 약속이 발전하지 않는다.
- "누가 왜 쓰는가"가 코드나 문서에서 사라진다.
- sample, prototype, implementation이 서로 다른 사용자를 가정한다.
- 사람이 승인한 의미와 에이전트가 구현한 의미가 다르다.

제품 계약 자산은 모든 제품 도메인에 필요하다. 다만 형식은 도메인이 결정한다.
베이스가 Story Chain 같은 특정 이름을 강제하지 않는다.

## 내부 보증 레이어

내부 보증 레이어는 사용자 약속을 지탱하는 invariant, lifecycle, control을 다룬다.
사용자가 직접 보지 못해도 깨지면 제품 약속이 나중에 무너지는 상태를 기록한다.

다음 신호가 보이면 만든다.

| 신호 | 의미 |
| --- | --- |
| 같은 invariant가 여러 기능을 지탱한다 | 제품 계약 자산만으로는 내부 실패를 추적하기 어렵다 |
| 상태 전이가 시간에 따라 이어진다 | 생성, 갱신, 만료, 복구 같은 lifecycle이 필요하다 |
| 사람이나 시스템이 반복 확인해야 한다 | control 또는 audit 절차가 필요하다 |
| evidence 종류가 반복된다 | 검증 원장이 같은 증거를 매번 새로 설명하고 있다 |

내부 보증 레이어는 제품 계약을 대체하지 않는다. 사용자-facing 의미가 바뀌면
제품 계약 자산으로 돌아간다.

## 운영 절차 레이어

운영 절차 레이어는 사람이 반복 실행하는 절차를 담는다. local dev, deploy,
rollback, incident, backup, migration, security hardening 같은 절차가 여기에
해당한다.

다음 신호가 보이면 만든다.

- 같은 명령이나 절차를 여러 번 설명한다.
- rollback 가능한 지점과 멈춰야 하는 지점이 헷갈린다.
- incident나 recovery 결과를 어디에 남길지 정해져 있지 않다.
- 운영 절차가 제품 계약, 내부 보증, gate 중 어디를 바꾸는지 모호하다.

운영 절차는 증거가 아니다. 절차를 적었다는 사실만으로 Gap Ledger를 통과시키지
않는다. 실행 결과, 로그, test output, review verdict 같은 증거가 필요하다.

## 기계 gate

기계 gate는 사람이 착각하기 쉬운 상태를 자동으로 차단한다. Preflight Gate와
Mechanical Verdict의 도메인 인스턴스다.

다음 신호가 보이면 만든다.

- "다 됐다"는 보고가 반복해서 실제 결과와 어긋난다.
- 파일은 있지만 필수 연결이 빠진다.
- 사용자 약속, 내부 보증, 운영 절차가 서로 다른 상태를 말한다.
- release 전에 항상 사람이 같은 형식 검사를 반복한다.

처음부터 무거운 gate를 만들지 않는다. 먼저 warning으로 false positive를 관찰한다.
blocking으로 올릴 때는 어떤 false pass를 막는지 명시한다.

## 외부 리서치

인터넷, vendor docs, 논문, benchmark, issue tracker, release note는 도메인 베이스에
도움이 될 수 있다. 다만 외부 자료는 바로 제품 계약이나 검증 증거가 되지 않는다.
먼저 역할을 분류한다.

| 외부 자료의 역할 | 연결되는 원리 | 처리 |
| --- | --- | --- |
| 사용자 문제 이해 | Intent Lock | 사람에게 의미 있는 약속으로 번역하고 승인받는다 |
| 기술 선택 근거 | Intent Lock, Preflight Gate | 날짜, 버전, 대안, 되돌림 비용을 남긴다 |
| 현재 API나 플랫폼 동작 확인 | Mechanical Verdict | 공식 문서를 우선하고 조회일을 남긴다 |
| 규제, 보안, 운영 제약 확인 | Gap Ledger | 내부 보증이나 운영 절차 후보로 기록한다 |
| 검증 근거 보강 | Mechanical Verdict | 프로젝트 안에서 재현 가능한 command나 artifact로 바꾼다 |

다음 신호가 보이면 외부 리서치를 한다.

- 기억만으로 현재 API, SDK, model, browser, cloud 동작을 판단하고 있다.
- 법, 정책, 결제, 보안, 배포, 플랫폼 제한이 제품 약속에 닿는다.
- 사용자 기대나 시장 관행을 추정하고 있다.
- 외부 문서의 최신 버전이 release 가능성을 좌우한다.
- 출처가 서로 충돌한다.

외부 리서치는 출처, 날짜, 버전을 남긴다. 공식 문서와 표준 문서를 우선한다.
blog, forum, issue comment는 보조 근거로만 쓴다. 충돌이 있으면 결론을 서두르지
말고 Gap Ledger나 작업 큐에 빈자리로 남긴다.

## UP/RUP에서 가져올 점

Unified Process와 Rational Unified Process는 단일 절차라기보다 프로젝트에 맞게
tailoring하는 process framework로 설명된다. RUP의 development case는 특정
프로젝트, 제품, 조직에 맞춰 선택한 프로세스 구성을 뜻한다. 이 관점은
product-weaver와 잘 맞는다.

product-weaver가 가져올 점은 세 가지다.

- 전체 방법론을 강제하지 않고, 도메인이 필요한 부분집합을 고르게 한다.
- 선택한 부분집합은 명시된 산출물로 남긴다. 암묵 tailoring은 에이전트에게 보이지 않는다.
- 반복, 위험 우선, architecture 또는 harness 중심, 지속 검증을 가볍게 유지한다.

가져오지 않을 점도 명확하다.

- 역할, 산출물, phase를 베이스에 대량으로 들여오지 않는다.
- 모든 도메인에 같은 lifecycle을 강제하지 않는다.
- 문서 milestone을 실제 작동 증거보다 위에 두지 않는다.

이 가이드는 process template이다. 도메인은 이 문서를 그대로 복사해 체크리스트로
쓰지 않는다. 자기 프로젝트에서 어떤 레이어를 켰고 무엇을 거부했는지 AGENTS.md나
작업 큐에 명시한다.

## 켜지 말아야 할 때

다음 경우에는 새 레이어를 만들지 않는다.

- 한 번 나온 특수 케이스다.
- 기존 제품 계약 자산이나 Gap Ledger로 충분히 표현된다.
- 다른 도메인 베이스가 썼다는 이유만으로 가져오려 한다.
- 외부 자료를 읽었다는 사실만으로 검증을 통과시키려 한다.
- 절차를 늘리면 에이전트가 무엇을 해야 하는지 더 흐려진다.

## 참고한 외부 자료

- IBM/Rational RUP 계열 공개 자료는 RUP를 tailoring 가능한 software
  engineering process로 설명한다.
- Eclipse Process Framework와 OpenUP 자료는 UP/RUP의 핵심을 더 가볍게 줄이는
  흐름을 보여준다.
- UP/RUP 공개 요약들은 반복·증분 개발, use-case driven,
  architecture-centric, risk-driven 개발을 공통 특성으로 설명한다.

읽은 자료:

- `https://swi.cs.vsb.cz/RUPSmall/core.base_rup/guidances/concepts/tailoring_rup_F8F0EB23.html`
- `https://swi.cs.vsb.cz/RUPSmall/core.base_rup/guidances/concepts/characteristics_of_rup_38FF74F6.html`
- `https://martinfowler.com/articles/newMethodology.html`
- `https://www.eclipse.org/epf/`
