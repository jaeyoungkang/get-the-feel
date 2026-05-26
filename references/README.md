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

## 도메인 인스턴스 시작 형태

새 도메인 파일럿은 자기 베이스 참조(`AGENTS.md`), 의도 잠금 산출물, 작업 큐, sample artifact를 자기 형식으로 만든다. 파일명·구조는 도메인이 결정한다. 사전에 빈 파일을 두지 않는다 (Preflight Gate 정신).

`claim-cards` (`~/youngcompany/claim-cards/`)가 첫 인스턴스 사례 — 자기 형식을 참고할 수 있다.

## 베이스 ↔ 도메인 인스턴스 관계 모델

베이스(product-weaver)는 도메인 인스턴스에 의해 **참조**된다. 상속이 아니다.

- 방향: **단방향** — 인스턴스 → 베이스. 베이스는 인스턴스 본문을 참조하지 않는다 (Refuse First).
- 참조 방식: 도메인 인스턴스의 `AGENTS.md`에 베이스 경로를 명시 (상대 경로 권장). git submodule, symbolic link, 코드 import는 **쓰지 않는다** — 추상이 인스턴스에 묶이면 비대해진다.
- 베이스 본문은 인스턴스 결과 누적 시 **Refinement Loop**를 통해서만 진화한다.

도메인 인스턴스가 자기 정체성을 잡고 자기 fix_plan을 운영하며 자기 ledger를 둔다 (예: `claim-cards`의 `docs/refinement-log.md`는 product-weaver의 것과 독립).
