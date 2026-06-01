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

7. **Asset Recovery** — 후보 종료 시 배움을 작동 위치로 이동한다.
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
