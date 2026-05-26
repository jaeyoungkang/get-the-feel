# References — 도메인 인스턴스 경로

product-weaver는 4원리의 도메인 구현체를 **베이스에 복제하지 않는다**. 대신 이 디렉토리에서 **경로 참조**로 가리킨다.

## 참조 인스턴스

| 참조 | 경로 | 역할 |
|---|---|---|
| Light House | `~/corca/lighthouse/` | 4원리의 도메인 검증 구현체. |
| agentic-base | `~/youngcompany/agentic-base/` | 도메인-중립 베이스 이식 시도. 비대화 진단의 출발점. |

## 매핑 노트

각 인스턴스가 4원리 + Refinement Loop를 어떻게 구체화했는지는 **별도 매핑 노트**로 작성한다 (이 디렉토리 안 `lighthouse.md`, `agentic-base.md` 등). 매핑 노트가 아직 비어 있는 상태가 정상이다. **사전에 추측으로 채우지 않는다** — 도메인 운영 결과가 누적된 뒤 Refinement Loop의 산출물로 작성된다.

참조 규칙(복제 금지, 셀프 게이트)은 `docs/principles.md` 와 `AGENTS.md` 가 정본.
