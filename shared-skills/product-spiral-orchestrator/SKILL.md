---
name: product-spiral-orchestrator
description: 제품 전체 Spiral Loop를 관장한다. 매 사이클을 기존 산출물 패치가 아니라 새 후보 완성품으로 시작하게 하고, 이전 산출물은 자산/스킬/계약으로만 회수하도록 강제한다.
compatibility: Product domains that build user-facing artifacts with repeated cycles.
---

# Goal

제품 Spiral Loop가 기존 화면을 조금씩 고치는 패치 루프로 퇴행하지 않게 한다.

핵심 규칙: **각 제품 사이클은 새 후보 완성품을 처음부터 만든다.** 이전 후보는 직접 수정하지 않고, 배움만 자산·스킬·데이터 계약·디자인 규칙·비즈니스 로직으로 회수한다.

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

7. **Stop Permission Gate** — 제품 레벨 판매 가능 전에는 멈출 수 없다.
   - cycle record에 아래 상태를 명시한다:
     - `local_candidate_status`
     - `representative_status`
     - `sellable_status`
     - `next_action`
     - `allowed_to_stop`
   - `sellable_status`는 법무·결제·조직 승인 상태가 아니라 **제품 레벨 판단**이다. 고객에게 보여 피드백을 받을 수 있는가, 반복 사용 이유가 있는가, 가격 제안이 표면에 도달했는가, 원래 제품 약속이 첫 화면에서 작동하는가를 본다.
   - `allowed_to_stop: yes`는 `sellable_status: pass`일 때만 허용한다.
   - `local_candidate_status: pass`는 멈춤 사유가 아니다. `sellable_status`가 pass가 아니면 다음 후보 생성 또는 외부 blocker 분류가 필요하다.
   - 외부 blocker는 법무·결제·운영 승인 같은 **출시/사업 blocker**로 기록할 수 있지만, 제품 루프 정지 사유가 아니다. 제품 표면이 고객 피드백을 받을 수준이 아니면 blocker가 아니라 다음 루프 입력이다.
   - 제품 레벨에서 아직 약하면 `external_blocker`를 적어도 `allowed_to_stop: yes`로 둘 수 없다. 다음 후보의 제품 가설로 전환한다.

8. **Asset Recovery** — 후보 종료 시 배움을 작동 위치로 이동한다.
   - 스킬
   - 자산 문서
   - 데이터 계약
   - 검증 스크립트
   - 디자인 규칙
   - 비즈니스 로직
   chat transcript나 cycle record에만 남기면 미회수다.

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
  - 카드/KPI/종목 리스트가 원래 macro map 요구를 대체하게 하기
  - 자산 회수 없이 코드만 누적하기
  - "판매 가능"이라고 말하면서 출처·갱신·시나리오·법적 경계가 unknown인 상태로 두기
- **Always**
  - 새 후보는 새 폴더 또는 명시적 fresh-start 위치에서 시작
  - 이전 후보의 배움은 자산으로 회수
  - 각 후보는 로컬에서 독립적으로 열리는 완성품 후보
  - 대표 후보 승격과 로컬 후보 통과를 구분
  - 제품 레벨 판매 가능 전에는 `next_action` 없이 final completion 금지
