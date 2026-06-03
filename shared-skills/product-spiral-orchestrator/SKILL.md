---
name: product-spiral-orchestrator
description: 제품 전체 Spiral Loop를 관장한다. 매 사이클을 기존 산출물 패치가 아니라 새 후보 완성품으로 시작하게 하고, 이전 산출물은 자산/스킬/계약으로만 회수하도록 강제한다.
compatibility: Product domains that build user-facing artifacts with repeated cycles.
---

# Goal

제품 Spiral Loop가 기존 화면을 조금씩 고치는 패치 루프로 퇴행하지 않게 한다.

핵심 규칙: **각 제품 사이클은 새 후보 완성품을 처음부터 만든다.** 이전 후보는 직접 수정하지 않고, 배움만 자산·스킬·데이터 계약·디자인 규칙·비즈니스 로직으로 회수한다.

이 스킬에서 제품 루프의 단위는 항상 **사용자가 실제로 열어볼 수 있는 완제품 후보 1개**다. 문서, 템플릿, 회고, 자산 정비만으로는 제품 루프가 닫히지 않는다. 그런 작업은 완제품 후보를 만들기 위한 preflight 또는 후보 종료 후 recovery이며, 제품 루프 자체가 아니다.

## Terminology

- **Product Spiral**: 하나의 제품 메타 의도를 완성도 높은 대표 후보까지 끌어올리는 전체 반복.
- **Session / Phase**: 사람이 운영상 묶는 큰 구간. 예: `C1 Core Discovery`. 한 Session은 여러 loop를 포함할 수 있다.
- **Loop / Cycle**: 완제품 후보 1개를 만들고 verdict와 asset recovery까지 닫는 단위. 한 loop = 한 candidate.
- **Candidate**: 각 loop의 독립 실행 가능한 완제품 후보. 예: `candidates/c1-1/`, `candidates/c1-2/`.
- **Representative Candidate**: 여러 후보 중 외부 검증 또는 배포 후보로 승격된 것.
- **Asset / Lesson**: 이전 후보에서 얻은 교훈을 다음 후보가 이어받도록 저장한 작동 자산. 후보 파일 자체를 패치하는 것이 아니라, 교훈을 제품 계약·Story Chain·데이터 계약·시각화 규칙·검증 규칙 등으로 회수한다.

`C1` 같은 이름은 loop일 수도 있고 Session일 수도 있으므로 반드시 명시한다. 예를 들어 `C1`이 Session이고 그 안에서 5회 loop를 돈다면 후보는 5개가 필요하다.

```text
C1-1 candidate -> lesson/assets/verdict -> C1-2 candidate
-> lesson/assets/verdict -> C1-3 candidate ...
```

이 흐름의 본질은 **코드 관성은 끊고, 교훈은 이어받는 것**이다.

## Maturity Intent

초기·중기·후기는 같은 loop 형식을 쓰지만 교훈, 자산, 판정을 키우는 목적이 다르다.

- **초기 Discovery**: 진짜 핵심축을 찾는다. 기존 축을 승격·격하·폐기하고, 새 축 후보를 발견한다. 완제품 후보는 각 축 가설을 사용자 표면에서 얇지만 실제로 검증해야 한다.
- **중기 Convergence**: 발견된 핵심축을 결합한다. 시각화, 데이터, 모델, 사용자 행동이 서로 이어지는지 보고, 약한 연결을 자산과 후보에 반영한다.
- **후기 Readiness**: 대표 후보 승격과 외부 검증을 준비한다. 운영 계약, 신뢰 경계, 수요 검증 패키지, mechanical verdict를 강화한다.

어느 단계든 loop 산출물은 완제품 후보여야 한다. 단계 차이는 후보가 검증하는 질문과 회수되는 교훈의 종류에서 난다.

## When To Use

- 새 제품 인스턴스를 시작할 때
- 사용자가 "기대 수준까지 반복", "처음부터 다시", "매번 완성품"을 요구할 때
- 이전 사이클 산출물을 패치하려는 흐름이 보일 때
- 제품 전체를 관장하는 스킬이 필요할 때

## Workflow

0. **Skill Load Receipt** — 산출물 또는 cycle record에 남긴다.
   - `skill: shared-skills/product-spiral-orchestrator/SKILL.md`
   - `loaded_at_step`
   - `candidate_id`
   - `previous_candidate_disposition`
   - `required_gates`
   - `blocked_until`

1. **Previous Candidate Disposition** — 이전 후보를 먼저 분류한다.
   - `discard`: 제품 후보로 폐기
   - `archive`: 참고 산출물로 보존
   - `asset-only`: 배움만 자산으로 회수
   - `promote`: 대표 후보로 승격
   승격이 아니면 이전 후보 파일을 수정하지 않는다.

2. **Candidate Fresh Start Gate** — 새 사이클은 새 후보 폴더에서 시작한다.
   - 권장 구조: `<project-name>/candidates/<candidate-id>/`
   - Session 안의 하위 loop라면 `<project-name>/candidates/<session-id>-<loop-no>/`처럼 둘 다 드러낸다.
   - 사용자가 기존 프로젝트 삭제를 명시하면 기존 폴더를 삭제하고 새 이름으로 시작한다.
   - 후보 폴더에는 독립 실행 가능한 완성품이 있어야 한다: `index.html` 또는 앱 entry, 스타일, 데이터, 검증 스크립트.
   - 기존 후보의 `app.js`, `index.html`, `styles.css`를 직접 패치하면 cycle 실패.

3. **Project Control Assets Gate** — 후보 밖 또는 후보 안의 자산 체계를 먼저 둔다.
   - product contract
   - product-specific skill/playbook
   - research/data operations
   - visualization/UX grammar
   - business/sellability logic
   - process/monitor recovery
   - trigger-based engineering decision rule

4. **Candidate Completeness Gate** — 매 후보는 "완성품 후보"여야 한다.
   - 첫 화면에서 original ask가 보인다.
   - 핵심 사용자 행동이 실제로 가능하다.
   - 데이터/상태/시나리오 라벨이 사용자 표면에 보인다.
   - 대표/판매 승격 차단 사유가 있더라도 로컬에서는 끝까지 동작한다.
   - Discovery 단계 후보라도 문서 설명이 아니라 사용자가 경험할 수 있는 표면을 가져야 한다.
   - 핵심축 발견을 목표로 하는 후보는 축 판정 UI 또는 관찰 가능한 사용자 행동을 포함한다. 축 판정은 문서만으로 승격하지 않는다.

5. **Monitor Gate** — 최소 3개 모니터를 둔다.
   - Intent Guardian: 원 의도 보존
   - Asset Steward: 자산/스킬 성장
   - Data/Sellability: 출처·갱신·시나리오·판매 가능성
   모니터 출력이 `repair-before-next`면 다음 후보 전에 자산/스킬/게이트를 먼저 고친다.

6. **Mechanical Verdict** — 후보별 검증 명령을 실행한다.
   - syntax/static check
   - asset check
   - data/source contract check
   - HTTP/smoke check where applicable
   `unknown`은 대표 후보 승격 차단이다.

7. **Stop Permission Gate** — local Spiral 종료는 외부 수요 검증 패키지 완성 + core 기여로 판정한다.
   - cycle record에 아래 상태를 명시한다:
     - `local_candidate_status`
     - `representative_status`
     - `primary_user_task` / `core_contribution_this_cycle` / `core_evidence` — 표면/본질 판정 결과 (refinement-loop 표면/본질 판정 규칙)
     - `n_of_N` / `cap_reached_disposition`
     - `local_ready` — 외부 수요 검증 패키지가 존재하는가
     - `demand_status` — demand_unknown / demand_rejected / pivot_required
     - `next_action`
     - `allowed_to_stop`
   - `local_ready`는 제품 레벨 판단이다. 고객에게 보여 피드백을 받을 수 있는가, 반복 사용 이유가 있는가, 가격 제안이 표면에 도달했는가, 원래 제품 약속이 첫 화면에서 작동하는가, 그리고 외부 수요 검증 패키지가 완성됐는가를 본다.
   - **`local_ready: pass` 조건은 둘 다 충족이다:** (a) 수요 검증 패키지 완성, (b) 직전 유효 사이클에 `core_contribution_this_cycle` ≥ 1. surface 기여만으로는 `local_ready` 금지.
   - **수요 검증 패키지 각 항목은 한 줄 라벨이 아니라 구체값이어야 pass다.** target user(누구), 실제 task(무엇을 수행), 최소 artifact(어떤 산출물로), 반증 질문(무엇이 거짓이면 가설 기각), 금지된 claim(무엇을 주장하지 않음), 검증 위치(어디서). 빈 값 또는 라벨만이면 fail.
   - **`local_ready: pass` = local Spiral 종료(terminal).** `allowed_to_stop: yes`는 `local_ready: pass`일 때 허용한다. 추가 local cycle은 새 외부 증거가 들어올 때만 시작한다.
   - `local_candidate_status: pass`만으로는 종료 못 한다.
   - `demand_status: demand_unknown`은 local 종료를 막지 않는다. 수요 검증은 출시 후, 루프 밖이다 — `local_ready`면 demand_unknown이어도 local Spiral은 종료하고 수요 검증으로 handoff한다.
   - 외부 수요가 부정적이면 `demand_rejected` 또는 `pivot_required`로 기록하고 다음 제품 가설로 전환한다. `blocked`로 두고 같은 local cycle을 반복하지 않는다.
   - **`n_of_N` 상한과 `cap_reached_disposition`은 Cycle 1 전에 기록한다.** `local_ready` 미달로 N에 도달하면 무한 `next_action`을 금지하고, `cap_reached_disposition`(외부 검증 부족 / 데이터·사람 손 부족 / pivot_required)으로 분류해 종료한다.
   - **`core_contribution_this_cycle`, `n_of_N`, 수요 검증 패키지 빈값은 기계 검증 대상이다(원리 1 Mechanical Verdict 최소 항목).** 자기보고 값만으로 `local_ready` 통과 금지 — `primary_user_task` 산출물 diff로 core 주장을 교차 확인한다.
   - completion-style final response 전에는 도메인의 final permission gate를 실행한다.

8. **Asset Recovery** — 후보 종료 시 배움을 작동 위치로 이동한다.
   - 스킬
   - 자산 문서
   - 데이터 계약
   - 검증 스크립트
   - 디자인 규칙
   - 비즈니스 로직
   chat transcript나 cycle record에만 남기면 미회수다.
   - 다음 후보는 이전 후보 파일을 직접 이어받지 않아도 되지만, 이전 후보의 교훈·판정·자산은 반드시 읽고 반영해야 한다.
   - 반영하지 않는 교훈은 Refuse First 사유와 함께 폐기한다.

## Output

- Skill Load Receipt
- candidate id and folder
- previous candidate disposition
- asset contribution
- monitor verdicts
- mechanical verdict
- stop permission verdict
- promote/archive/discard decision

## Boundaries

- **Never**
  - 기존 후보를 조금 고쳐서 새 사이클이라고 부르기
  - 문서·게이트·템플릿만 만들고 제품 loop가 닫혔다고 말하기
  - Session 이름(`C1`)과 loop/candidate 이름(`C1-1`)을 섞어 후보 개수를 흐리기
  - 카드/KPI/종목 리스트가 원래 macro map 요구를 대체하게 하기
  - 자산 회수 없이 코드만 누적하기
  - "판매 가능"이라고 말하면서 출처·갱신·시나리오·법적 경계가 unknown인 상태로 두기
- **Always**
  - 새 후보는 새 폴더 또는 명시적 fresh-start 위치에서 시작
  - 한 loop는 한 완제품 후보를 남김
  - 이전 후보의 배움은 자산으로 회수
  - 다음 후보는 회수된 교훈·자산·판정을 입력으로 시작
  - 각 후보는 로컬에서 독립적으로 열리는 완성품 후보
  - 대표 후보 승격과 로컬 후보 통과를 구분
  - `local_ready` 전에는 `next_action` 없이 final completion 금지
