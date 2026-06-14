---
name: refinement-loop
description: 4원리를 시간 축에서 다듬는 메타 프로세스의 직접 실행. 정기 회고 운영, 비대화 방지 셀프 게이트 4문항 적용, 인스턴스화 가이드 갱신을 담당한다. Refuse First가 게이트에 "1·2 통과 못 하면 거부"로 내장되어 있다.
compatibility: Domain-neutral. 도메인 베이스가 자기 운영 주기와 입력 ledger 형식에 맞춰 인스턴스화한다.
---

# Goal

product-weaver의 4원리는 정적 명세다. 도메인 학습이 누적되고 새로운 LLM 이탈 패턴이 식별되면 정적 명세는 부정확해진다. 이 스킬은 **4원리 자체를 평가·갱신하는 루프를 실행** 한다.

`docs/principles.md` 의 Refinement Loop 섹션이 정본. 이 스킬은 그 정본을 실제 회고에서 어떻게 운영하는가의 절차 명세.

## When To Use

- 정기 회고 주기에 도달했을 때
- 새 LLM 이탈 패턴이 임시로 식별되어 임시 회고가 필요할 때
- 새 원리·도구·문서·스킬 추가 요청이 들어왔을 때 (셀프 게이트 적용 자리)
- `intent-lock` 등 다른 스킬의 출력으로 의도 빈틈이 누적되어 검토 시점이 된 때

**첫 회고 trigger**: 첫 commit 직후가 아니다. 입력 ledger에 항목이 누적되었을 때 비로소 시작. 운영 누적 없이 호출하면 Workflow 1 Preflight가 자기 차단한다.

## Workflow

0. **Skill Load Receipt** — 이 파일을 실제로 읽었음을 산출물 또는 진행 메시지에 남긴다.
   - `skill: shared-skills/refinement-loop/SKILL.md`
   - `loaded_at_step`
   - 이번 회고/Spiral에 적용할 required gates
   - 진행 전 차단 조건(`blocked_until`)
   Receipt 없이 회고·Spiral Loop·프로세스 변경·사이클 산출물로 넘어가면 Preflight 실패.

1. **Preflight 자기 적용** — 회고에 들어가기 전 선행 산출물 확인.
   - 입력 ledger가 비어 있지 않은가
   - 이전 회고의 출력이 인스턴스화 가이드에 실제 반영되었는가
   - 비어 있다면 회고를 시작하지 않는다 (의도 없는 회고 금지)

   **베이스 자체 운영 ledger는 git commit log + SKILL/원리 변경 자체**. 별도 누적 텍스트 문서(예: `refinement-log.md`)를 베이스 안에 두지 않는다 — 새로 clone 받는 사용자에게 운영 흔적은 *역사*일 뿐 *작동*이 아니다. 회고 결과는 SKILL.md / 원리 본문의 변경으로 즉시 회수되고, 변경 사유는 commit message가 잡는다. 도메인 베이스는 자기 ledger 위치·형식을 별도로 결정하되, 같은 정신(누적 텍스트가 아닌 코드/스킬/계약 회수)을 따른다.

2. **입력 수집** — 다음 5종을 모은다.
   - Intent-Evidence Chain의 운영 결과 (증거 누적, 검증 실패 패턴)
   - Preflight Gate 통과 후 발생한 의도 이탈
   - Atomic Step에서 무너진 단위 기록
   - Refuse First로 거부된 변경의 사후 평가
   - **외부 검증 결과** (codex exec 리뷰, 사람 리뷰, CI gate 등 Mechanical Verdict가 짚은 사후 발견)

3. **패턴 식별** — 입력에서 반복되는 LLM 이탈 패턴을 명시.
   - 기존 4원리로 표현 가능한가? → 인스턴스화 가이드 갱신 후보
   - 기존 4원리로 표현 불가한가? → 셀프 게이트로 넘김

4. **셀프 게이트 4문항 적용** (Refuse First 모드 내장)

   아래 4문항은 `docs/principles.md` 정본의 실행 복사이며, 충돌 시 `docs/principles.md` 가 우선한다.

   1. 이것은 LLM 불확실성 규제의 **동형 원리** 인가, 특정 도메인의 인스턴스인가?
   2. 4원리 중 하나의 인스턴스로 충분히 표현되는가? 그렇다면 베이스에 올리지 않고 도메인에 둔다.
   3. 기존 4원리로 표현할 수 없는 LLM 이탈 패턴이 새로 식별되었는가? 그 패턴은 어떤 운영 증거로 뒷받침되는가?
   4. 추가했을 때 베이스의 무게가 늘어나는 만큼, 어떤 의도 이탈 패턴이 막히는가?

   **1·2를 통과하지 못하면 거부.**

5. **출력 결정** — 다음 중 하나:
   - 인스턴스화 가이드 갱신 (원리 본문은 거의 안 건드린다 — 가이드가 진화의 본 자리)
   - 도메인 인스턴스의 폐기·승격 (`references/` 참조 변경)
   - 셀프 게이트 통과한 새 원리·도구의 명시적 승격 + lineage 기록
   - 거부 결정 + 사유 기록

6. **Atomic Step 자기 적용** — 한 회고 = 한 commit. 여러 회고를 묶지 않는다.

## Refuse First Mode

- 셀프 게이트 4문항이 본질적으로 거부 우선 게이트. "통과하지 못하면 거부"
- 새 원리·도구 추가 요청은 "추가할 사유"보다 "거부할 사유"를 먼저 검토
- 거부된 항목도 사후 평가의 입력으로 회수 (왜 거부했는가 → 미래의 패턴 재식별 자료)

## Output

- 갱신된 인스턴스화 가이드 (해당 원리 섹션)
- 또는 폐기·승격 결정 + 사유
- 또는 거부 결정 + 사유
- 회고 ledger entry (입력 4종, 식별된 패턴, 게이트 결과, 출력)

## Boundaries

- **Never**
  - 입력 ledger 비어 있는 상태에서 회고 시작 (의도 없는 회고)
  - 한 회고에 여러 결정 묶기 (Atomic Step 자기 적용)
  - 셀프 게이트 1·2 통과 못한 항목을 베이스에 추가
  - 원리 본문 자체를 회고 한 번으로 변경 (본문은 거의 안 건드린다 — 가이드만 갱신)
- **Ask first**
  - 원리 본문 변경이 필요할 때 (베이스 변경은 사람 합의)
  - 새 원리 신설 (셀프 게이트 통과해도 사람 최종 승인 필요)
  - 도메인 인스턴스의 폐기 결정
- **Always**
  - **Skill Load Receipt 먼저 남김** — receipt 없이는 다음 단계 진행 금지
  - 회고 시작 전 Preflight 자기 적용
  - 셀프 게이트 4문항 명시 적용
  - 회고 결과 lineage 또는 change log에 기록

## 자기 적용

Refinement Loop 자신도 4원리를 따른다.
- Intent-Evidence Chain: 회고 입력·식별 패턴·출력이 한 사슬
- Preflight Gate: 입력 ledger 확인 (Workflow 1)
- Atomic Step: 한 회고 한 commit (Workflow 6)
- Refuse First: 셀프 게이트가 본질 (Workflow 4)

## Spiral Loop — 도메인 차원 적용

Refinement Loop는 본래 *베이스 자체*를 다듬는 메타 프로세스다. 도메인이 *자기 제품*을 만들 때 같은 패턴을 *자기 차원에 닮은꼴로* 적용할 수 있다. 이를 **Spiral Loop**라 부른다 — 같은 자리를 도는 듯하지만 위로 올라간다.

**대상이 되는 의도**: *메타 의도* (사이클들을 통해 명확화·수렴되는 큰 의도). intent-lock으로 한 번에 잠기지 않는 종류. 사이클 의도는 매 사이클 시작 시 intent-lock으로 별도 잠근다.

**막는 LLM 패턴**
- 메타 의도를 사이클 의도인 양 한 번에 잠그고 진행 → 결과물에 집착, 첫 의도와 멀어짐
- 결과물 누적으로 인한 코드 관성이 의도 이탈을 만듦
- 종료 조건 없이 무한 반복

**핵심 형태**
- **결과물은 폐기 가능, 배움은 *자산 체계*로 회수, 그중 *제품 계약*이 최우선** — 매 사이클 zero에서 시작. *배움(learning)은 마크다운 누적 문서로 두지 않는다.* 매 사이클 종료 시 learning은 **작동하는 자산 체계의 한 카테고리**에 1조각 기여로 회수된다. **자산 체계는 도메인이 발견하되, *제품 계약 자산*(사용자에게 한 약속의 잠금처)은 모든 제품 도메인에 필수다 — 형식은 도메인 결정(Hypothesis Stitch · user story · promise · contract 등), 존재 자체는 강제.** 매 사이클 배움은 다른 자산뿐 아니라 *제품 계약에 추가·수정·검증·반증 1조각*으로 회수되어야 한다 (intent-lock SKILL Workflow 3 "제품 계약 발전" 항목). 제품 계약 발전 0인 사이클은 *약속 휘발 함정* — 사이클 부분 폐기. *제품을 만드는 데 필요한 모든 자산*이 매 사이클 자라야 한다 — 코드만 자라고 계약·spec·design이 안 자라면 *기능 더미* 함정. 누적 ledger(learnings.md 등)는 임시 적재함일 뿐이며, 자산으로 회수 안 된 learning은 사이클 종료 못 함. 자산은 *코드와 같은 저장소*에 산다 — 별도 ledger 아니라 *제품의 일부*.
- **코드 관성은 끊고, 교훈은 이어받는다** — 매 사이클 zero 시작은 이전 후보 파일을 계속 패치하지 않는다는 뜻이지, 이전 후보에서 얻은 교훈을 버린다는 뜻이 아니다. 다음 사이클은 직전 verdict, 격하·승격된 자산, 폐기 사유를 입력으로 시작한다.
- **외부 검증을 종료 조건으로** — 사람·외부 에이전트·기계 검증 중 도메인이 명시한 신호로 루프 종료
- **명시 상한** — 무한 반복 방지를 위한 N회 상한 + 조기 종료 조건
- **사이클 안에서 intent-lock 재호출** — 매 사이클 시작 시 그 사이클의 *사이클 의도*를 잠근다 (메타 의도와 구분)
- **Forward Momentum — 결과물 형식이 사이클마다 코드 방향으로 한 단계 오른다** — Spiral Loop는 *같은 자리를 도는 듯하지만 위로 올라간다*가 본질. 매 사이클 결과물 형식은 *직전 사이클보다 코드(혹은 도메인의 종착 산출물)에 한 단계 더 가까운 단계*여야 한다. 같은 단계 두 사이클 연속 머물기 금지. 이 규칙이 *의도 정밀화 함정* — 사이클이 의도·문서·명제를 더 다듬는 방향으로만 돌아 코드로 전진 못 하는 패턴 — 을 막는다.

## Spiral Loop — 사이클 형식 사다리 (Forward Momentum 운영)

매 사이클은 *사다리의 한 단계*에 해당한다. 사다리는 도메인이 자기 결정하되, **사다리 자체는 반드시 명시되어야 한다** (묵시적 사다리 금지). 베이스 권고 사다리:

```
추상 의도 → 한 줄 명제 → 구조 명세(스키마·동선) → 종이 표면(스케치·와이어) → 데이터/콘텐츠 1건 → 작동 prototype → 사용자 검증
```

**운영 규칙**

- 사용자 표면 제품 도메인에서 `product-spiral-orchestrator`를 적용하는 경우, 사다리의 각 실제 loop 산출물은 독립 실행 가능한 완제품 후보여야 한다. 이때 사다리는 후보가 검증하는 성숙도와 질문을 정의할 뿐, 문서-only cycle을 허용하는 근거가 아니다.
- `C1` 같은 이름이 큰 Session/Phase라면 그 안의 각 loop를 `C1-1`, `C1-2`처럼 분리한다. N회 loop를 돌면 N개의 완제품 후보가 있어야 한다.

- **매 사이클 종료 시점에 *다음 사이클의 결과물 형식*을 명시한다** — 안 명시되면 사이클 종료 못 함. 이게 *긍정형 정지 신호*다(거부 신호 안 걸림 같은 부정형이 아니다).
- **다음 사이클 결과물 형식은 사다리에서 *지금보다 위 단계*여야 한다.** 같은 단계로 다시 가려면 명시 사유 + 횟수 카운트 (같은 단계 2회 연속 시 자동 상승 강제).
- **사이클 상한 N과 조기 종료 조건은 Cycle 1 시작 전에 기록한다.** "일단 돌려보고 판단" 금지. 매 사이클 기록에는 `n of N used`와 stop/continue verdict가 있어야 한다. 상한 도달 후에도 미달이면 더 많은 반복이 아니라 *외부 검증·운영 계약·데이터/사람 손 부족* 중 무엇인지 분류한다.
- **일괄 라운드 지시가 있어도 verdict 생략 금지.** 사용자가 "R10까지", "N번 반복"처럼 수를 지정해도 각 cycle은 독립 intent-lock → 산출물 → verdict → 다음 cycle 승인 순서를 거친다. 여러 cycle record를 한 번에 채워 넣는 것은 Spiral Loop가 아니라 문서 생성이므로 금지. 단, 사용자가 명시적으로 *시뮬레이션/브레인스토밍*을 요청한 경우에는 실제 Spiral이 아니라 "simulation"으로 표시하고 제품 대표 산출물로 승격하지 않는다.
- **자가 점검에 긍정형 통과 기준 3개 박는다**:
  1. *Forward Momentum* — 다음 단계로 갈 *코드 단위·사용자 표면·데이터 항목* 중 1개 이상이 결과물에서 식별되었는가
  2. *자산 기여* — 도메인 자산 체계의 카테고리 1개에 *WHO·WHY 한 줄 갱신*을 포함한 기여 1조각이 더해졌는가. 사이클 시작 시 intent-lock에서 박은 자산 카테고리·기여 형태가 실제로 일어났는지 양방향 점검.
  3. *제품 계약 발전* — 사용자 약속이 추가·수정·검증·반증 중 하나로 1조각 발전했는가. 자산 기여(공급 측)와 짝인 *수요 측* 통과 기준 — *세 번 폐기 공통 함정(약속 휘발) 차단*. 이 발전이 `primary_user_task`에 닿으면 core, pitch·onboarding·pricing·copy 등 판매 표면이면 surface(표면/본질 판정 규칙 적용). surface만 누적되고 core 발전이 0이면 통과 아님.
- 부정형 거부 신호만으로 통과 판단 금지.
- **사이클 결과물이 사다리 단계와 어긋나거나(예: 종이 단계인데 문장 다듬기만 했다), 자산 기여 없이 코드만 누적되거나, 제품 계약 발전 0이면 사이클 부분 폐기.**

### Spiral Loop — 모니터링 피드백 회수

서브에이전트·외부 리뷰어·자가 리뷰를 루프 감시에 썼다면, 피드백은 *제품 개선*과 *프로세스 개선*으로 분류해 둘 다 회수한다. 제품만 고치고 프로세스를 그대로 두면 같은 이탈이 다음 도메인에서 반복된다.

**필수 분류**
- *제품 산출물 피드백* — 이번 도메인의 화면·코드·데이터·콘텐츠에 반영.
- *프로세스 피드백* — 도메인 AGENTS.md, SKILL, acceptance gate, cycle record template 중 하나에 반영.
- *베이스 후보 피드백* — 여러 도메인에 반복될 LLM 이탈 패턴이면 이 `refinement-loop` 또는 관련 skill 갱신 후보로 회수. 원리 본문 변경은 Ask first.

**모니터 관점 최소 세트** (도메인에 맞춰 이름은 바꿔도 됨)
- *사용자/수요 관점* — target user가 약속을 실제로 이해·사용하는가.
- *표면/형식 관점* — 새 사이클이 이전 산출물의 껍데기 변경이 아니라 다른 사용자 표면·구조·시각 문법·상호작용 가설을 검증하는가.
- *데이터/운영 관점* — 정기 갱신, 시간 변화, 미래 상태, 자동화 같은 운영 약속이 있다면 출처·시점·갱신·상태 구분 계약이 있는가.
- *루프 품질 관점* — 상한 N, stop/continue 기준, 폐기 항목, 다음 결과물 형식이 기록되었는가.

**회수 규칙**
- 모니터 피드백이 "프로세스가 느슨하다"는 종류라면 그 사이클은 제품 산출물이 좋아도 완료 아님. process asset 또는 skill/gate에 1조각 반영해야 종료 가능.
- 모니터 피드백은 별도 누적 문서에만 남기지 않는다. 다음 사이클 record template, acceptance check, 데이터 계약, 도메인 AGENTS.md, SKILL 중 실제 작동 위치로 이동한다.
- 같은 문제를 두 모니터 이상이 지적하면 다음 사이클 의도에 직접 반영한다. 반영하지 않으려면 Refuse First 사유를 기록한다.
- 제품 loop에서 process repair가 필요해도, 다음 제품 loop의 산출물은 여전히 완제품 후보여야 한다. 문서-only repair는 제품 loop가 아니라 별도 maintenance step으로 표시하고, 그 뒤 제품 loop를 다시 시작한다.

### Spiral Loop — 실시간 서브에이전트 모니터링 모드

사용자가 명시적으로 요청하거나, 메타 의도가 크고 사이클이 2회 이상 예정된 경우에는 서브에이전트 모니터링을 *사후 리뷰*가 아니라 *진행 중 감시 루프*로 운영할 수 있다. 목적은 산출물 품질만 올리는 것이 아니라 **프로세스가 이탈하는 순간 즉시 절차를 고치는 것**이다.

**진입 조건**
- 사용자 명시 요청: "서브에이전트로 모니터링", "프로세스를 개선하며 반복" 등.
- 또는 자율 Spiral에서 같은 종류의 실패가 2회 반복됨.
- 또는 정기 업데이트·미래 예측·투자·의료·법률처럼 운영/신뢰 리스크가 큰 도메인.

**모니터 배치**
- 기본 3~4개. 더 늘리려면 병렬 trunk 또는 독립 검증 질문이 있어야 한다.
- 각 모니터는 서로 다른 관점 1개만 맡는다. 예: 사용자 적합성, 표면/시각 문법, 데이터/운영 계약, 루프 품질.
- **Intent Guardian은 필수 모니터.** Spiral Loop에서 서브에이전트 모니터를 쓰는 경우 첫 모니터는 항상 원 의도 보존 담당이다. 다른 모니터가 유용한 좁힘을 제안해도 Intent Guardian이 original ask 대체라고 판정하면 해당 좁힘은 primary promise로 승격 금지.
- **Process Improvement Monitor도 필수 모니터.** Spiral Loop가 2회 이상 지속될 제품이라면, 제품 산출물과 별도로 *프로세스가 이번 cycle에서 무엇을 배웠고 다음 cycle gate/template/SKILL에 무엇을 고칠지* 감시하는 모니터를 둔다. 이 모니터는 제품 UI를 평가하는 대신 루프 품질, gate 누락, 검증 부재, 모니터 역할 충돌, 자산 회수 실패를 본다.
- **Asset Steward Monitor도 필수 모니터.** 새 제품을 계속 반복해 만들거나 판매 가능한 수준까지 끌어올리는 Spiral에서는, 별도 모니터가 *자산 체계가 실제로 자라고 있는지*만 본다. 이 모니터는 화면 완성도나 코드 품질을 직접 평가하지 않고, 제품 계약·제품별 스킬/플레이북·엔지니어링 규약·리서치/데이터·화면 디자인/시각화·비즈니스 로직·프로세스 개선 자산이 이번 사이클에서 어떤 파일/규약/템플릿으로 갱신됐는지 확인한다. 자산이 markdown ledger에만 쌓이고 다음 사이클 입력으로 작동하지 않으면 `repair-before-next`.
- 모니터에게 코드 수정을 시키지 않는다. 코드 작업자는 별도 worker로 분리한다. 모니터는 `process_risk`, `product_risk`, `required_gate_change`, `stop_or_continue`를 낸다.
- 모니터 prompt에는 베이스 어휘만 쓰지 말고 도메인 외부 표면 어휘를 최소 1개 넣는다. 같은 베이스 어휘 안에서 메인과 모니터가 공진하는 것을 막는다.

**체크포인트**
1. *Cycle Start* — 사이클 의도, 상한 N, acceptance check, 표면 가설을 모니터가 비판한다.
2. *Mid-cycle* — 구현/산출물이 이전 사이클의 껍데기 변경으로 퇴행하는지 확인한다.
3. *Pre-verdict* — stop/continue 판정 전에 제품 리스크와 프로세스 리스크를 분리해 받는다.
4. *Recovery* — 모니터가 지적한 프로세스 리스크 중 채택한 항목을 실제 작동 위치(SKILL, AGENTS, gate, cycle template, data contract)에 반영한다.

**Intent Guardian 출력 필수 필드**
- original_ask:
- current_cycle_promise:
- preserved:
- narrowed:
- drift_risk: low / medium / high
- verdict: preserve / restore / reject-cycle

**Process Improvement Monitor 출력 필수 필드**
- process_learning:
- missing_gate:
- template_change:
- skill_change_candidate:
- mechanical_verdict_gap:
- next_cycle_process_rule:
- verdict: keep / repair-before-next / escalate-to-base

**Asset Steward Monitor 출력 필수 필드**
- asset_map_present:
- asset_categories_checked:
- skill_assets_checked:
- skill_receipts_required:
- cycle_contributions:
- contribution_surface_or_core: (각 기여가 `primary_user_task`를 바꿨으면 core, pitch·onboarding·pricing·copy면 surface — 표면/본질 판정 규칙 적용)
- missing_or_stale_assets:
- next_cycle_asset_rule:
- verdict: keep / repair-before-next / reject-cycle

필수 모니터의 placeholder만 만드는 것은 compliance가 아니다. required monitor는 verdict 전 실제 출력이 있어야 하며, `pending`이면 cycle 미종료다.

**실시간 차단 규칙**
- 두 모니터 이상이 같은 프로세스 리스크를 지적하면 다음 사이클로 진행하기 전에 gate 또는 record template을 먼저 고친다.
- Intent Guardian이 `restore` 또는 `reject-cycle`을 내면 다른 모니터 verdict와 무관하게 restoration cycle로 전환한다.
- Process Improvement Monitor가 `repair-before-next`를 내면 다음 제품 cycle 전에 도메인 template/gate를 먼저 고친다. `escalate-to-base`를 내면 `refinement-loop` 또는 관련 skill 변경 후보로 회수하되, 원리 본문 변경은 Ask first.
- Asset Steward Monitor가 `repair-before-next`를 내면 다음 제품 cycle 전에 자산 파일/규약/템플릿을 먼저 고친다. `reject-cycle`이면 제품 산출물은 대표 산출물로 승격 금지.
- Asset Steward Monitor가 필요한 제품별 스킬/플레이북이 없거나 receipt 없이 쓰였다고 판정하면 다음 cycle은 제품 기능이 아니라 스킬 자산화/기계 gate repair로 전환한다.
- 위 repair는 제품 후보 원칙을 대체하지 않는다. repair만 수행하면 maintenance step이고, 제품 loop는 별도 완제품 후보가 만들어질 때 닫힌다.
- 모니터가 "중심 표면이 약속을 구현하지 않는다"를 지적하면 산출물은 partial discard 후보이며, 설명 문구 추가만으로 통과 금지.
- 모니터가 "운영 계약 없음"을 지적하면 다음 사이클은 디자인이 아니라 thin path 운영 계약으로 전환한다.
- 모니터 피드백을 반영하지 않기로 하면 Refuse First 사유를 cycle record에 적는다.

**종료 규칙**
- 모니터는 사이클 종료 후 닫는다. 열린 모니터를 다음 사이클에 관성으로 끌고 가지 않는다.
- 모니터링 결과 요약은 제품 자산과 프로세스 자산에 나뉘어 회수한다.
- Asset Steward Monitor 결과는 Asset Map의 `last_cycle_contribution`으로 회수한다. 회수 위치가 없으면 Asset Map 자체를 먼저 만든다.
- 제품별 스킬/플레이북은 Asset Map에 등록하고, cycle record에는 실제 호출 receipt를 남긴다. receipt 없이 "스킬을 따랐다"고 쓰는 것은 미통과다.
- 모니터링이 새 산출물 생성을 지연시키기만 하고 gate 변화가 0이면 다음 사이클에서 모니터 수를 줄인다.

### Spiral Loop — 표면 가설 다양화 게이트

반복이 "더 예쁘게", "더 깔끔하게", "카피를 정리"로 수렴하면 루프가 아니라 국소 최적화다. 특히 시각화·UX·콘텐츠 제품은 각 사이클 시작 시 **표면 가설**을 한 줄로 잠근다.

**필수 질문**
- 이번 사이클이 검증하는 사용자 표면 가설은 무엇인가?
- 이전 사이클과 다른 구조·동선·시각 문법·데이터 단위는 무엇인가?
- 이번 산출물이 좋아졌다는 판단을 사용자가 어떤 행동/답변으로 증명하는가?
- 이전 후보의 어떤 교훈·판정·자산을 이어받았고, 어떤 것은 의도적으로 버렸는가?

**거부 신호**
- 새 사이클이 이전 산출물의 색·간격·문구만 바꾼다.
- 코드 이름은 바뀌었지만 사용자가 보는 정보 구조는 같다.
- 중심 약속이 side panel이나 설명 문구에만 있고 primary surface에는 없다.
- 정량 표현(크기·색·위치·두께)이 실제 metric, 산식, 또는 명시된 예시 데이터와 연결되지 않는다.
- 판매·온보딩·가격·카피를 "새 사용자 가치"로 주장한다 (자동 surface인데 core로 승격 시도).

**표면/본질 판정 (필수)**

매 사이클 다음 필드를 채운다.
- `primary_user_task` — 사용자가 실제로 수행하는 핵심 task. **product contract의 잠긴 primary promise에서 도출한다 (에이전트가 임의로 정하지 않는다).**
- `changed_user_outcome` — 이번 사이클이 그 task의 무엇을 바꿨나
- `surface_or_core` — core / surface

판정 규칙:
- 기본값 = surface. pitch·onboarding·pricing·copy·설명·demo framing은 자동 surface.
- core 인정 = `primary_user_task`의 입력·판단·행동·결과 중 하나가 실제로 달라졌을 때만.
- **`surface_or_core` 판정은 Asset Steward 단독이 아니라 Intent Guardian이 교차 확인한다. 둘이 불일치하면 surface로 본다(보수적 기본값).**
- 단일 사이클 surface-only는 허용하되 표시한다. **local_ready 또는 대표 후보 승격 직전 마지막 유효 사이클은 core 기여 1개 이상 필수.** 연속 사이클이 surface만 누적하고 core가 0이면 사이클 부분 폐기.
- **`core` 주장은 산출물 diff로 기계 검증한다(원리 1 Mechanical Verdict 최소 항목).** `primary_user_task`의 산출물 fingerprint가 직전 사이클 대비 실제로 변했을 때만 core 인정. 자기보고 필드만으로 core 통과 금지.
- **새 전달 가치(경험) 탐색도 core의 한 형태다.** 기존 가치의 산출물 심화뿐 아니라, primary promise 아래 새 value story를 추가해 그 산출물을 만들면 core. primary promise와 무관한 가치는 surface(정체성 이탈). 단일 가치만 반복하고 새 가치 탐색이 0인 사이클은 [intent-lock 전달 가치 탐색] 게이트에서 차단된다.
- **새 가치의 core 인정 조건 (기계 점검)**: 새 산출물은 fingerprint가 null→non-null로 변한 것만으로 부족하다. (a) primary promise의 핵심 명사를 실제로 포함하고 (b) 잠긴 primary 산출물(예: stages)을 참조해야 core. 둘 다 아니면 surface — "새 데이터 배열이 생겼다"만으로 core 금지(novelty inflation·표면을 데이터로 위장하는 우회 차단).

### Spiral Loop — 원 의도 앵커 게이트

루프가 진행될수록 모니터 피드백, 데이터 계약, 안전 장치가 원래 사용자의 제품 요구를 과도하게 좁히거나 다른 제품으로 바꿀 수 있다. 따라서 매 사이클 시작과 verdict 전에 **원 의도 앵커**를 대조한다.

**필수 기록**
- original user ask 한 줄
- 이번 cycle promise 한 줄
- primary surface가 original ask를 직접 구현하는지 여부
- 좁힘(narrowing)이 필요한 경우, 원 의도에서 무엇을 보존하고 무엇만 임시로 줄였는지
- original ask의 핵심 명사 2~5개와 이번 산출물의 핵심 명사 2~5개. 핵심 명사가 대부분 교체되면 drift 후보.

**차단 규칙**
- 원래 요구가 "거시 맵"인데 사이클 결과가 종목 카드/리스트/리서치 툴로 바뀌면 intent drift. 제품 산출물은 partial discard.
- 모니터가 특정 관점을 강하게 밀어도, 그 관점이 original ask를 대체하면 수용 금지. 보조 gate로만 회수한다.
- thin path는 운영 계약 검증용 보조 산출물이지, 사용자가 요구한 primary surface를 대체할 수 없다.
- verdict 전에 "original ask를 30초 안에 사용자가 알아볼 수 있는가"를 통과하지 못하면 stop이 아니라 restoration cycle로 전환한다.

### Spiral Loop — 최소 기계 판정

product-weaver 베이스는 무거운 CLI를 두지 않지만, 도메인 Spiral은 최소 기계 판정을 가져야 한다. 없으면 `Mechanical Verdict 방식 후보`가 아니라 `Mechanical Verdict 부재`로 기록하고 release/대표 산출물 승격을 막는다.

최소 판정 예:
- 필수 cycle record 필드 존재 확인
- Skill Load Receipt 존재 확인
- original ask 키워드가 대표 산출물 또는 cycle record에 남아 있는지 확인
- observed/scenario 등 운영 계약 필드 존재 확인
- 정적 파일이면 HTTP 200 또는 문법 검사
- required monitor verdict가 `pending`이 아닌지 확인

판정 결과는 `pass / fail / unknown` 중 하나다. `unknown`은 대표 산출물 승격 차단이다.

### Spiral Loop — 운영 계약 게이트

제품 약속에 정기 업데이트, 시간 변화, 미래 스냅샷, 자동 판단, 예측, 추천, 감사 가능성이 포함되면 **운영 계약**이 없이는 수렴 판정 금지. 이는 UI 문제가 아니라 Intent-Evidence Chain의 데이터/운영 종착 문제다.

최소 운영 계약:
- `as_of` — 값이 말하는 기준 시점
- `collected_at` / `applied_at` — 수집·반영 시점
- observed / inferred / scenario / forecast 구분
- provenance 또는 source id
- correction / late arrival 처리 방식
- future scenario라면 base snapshot, horizon, assumptions, status

운영 계약이 비어 있으면 다음 사이클은 새 디자인이 아니라 *thin path 데이터/운영 계약*으로 올라간다. 전체를 계약화하지 말고 가장 중요한 경로 1개를 잡아 entity, relationship, metric, update event, future scenario를 1건씩 잠근다.

**자기 종료 회피 감지 (자율 모드 자가 점검 자리)**

자율 모드에서 메인이 *자연 종료* / *최종 종료* / *진짜 한계 도달* 선언 시 — 다음 자가 점검 라운드에서 *진짜 한계 증거*와 *자기 회피 가능성* 양쪽 점검 강제. 진짜 한계는 다음 중 1개 이상 증거가 있어야:

1. *시간 척도 비대칭* — 다음 자리가 *주마다/월마다* 진행되는 운영 사이클이라 자율 모드 한 세션과 시간 척도 안 맞음 (증거: 갱신 빈도 명시).
2. *외부 사람 손 필수* — 다음 자리가 *외부 인적 자원·외부 데이터·외부 도구 사용 허가* 등 LLM이 못 가짐 (증거: 어떤 사람 손이 왜 필요한가 한 줄).
3. *상한 N 도달* — Spiral Loop 명시 상한에 도달 (도메인이 명시한 N).

증거 없는 종료 선언은 *자기 회피 회로*로 간주. N+1 사이클 강제. 종료 선언 자리에서 *진짜 한계 증거 vs 회피 가능성* 양쪽을 동시에 적어 자가 평가 흔적을 남긴다.

### 자산 체계 누적 — *루프 반복으로 발전*

Spiral Loop 본질이 *결과물 폐기 가능, 배움 누적*인데 *배움이 어디에 누적되는가*의 답이 **도메인 자산 체계**. 매 사이클 = 한 자산 카테고리에 한 기여 → 사이클이 누적될수록 spec·design·code-fragments·skills·vocab가 함께 자란다. 다음 사이클은 *지난 사이클의 자산을 입력으로* 출발 → zero에서 시작하되 *자산 위에서* zero.

자산의 목적은 제품 성숙도에 따라 달라진다.

- **초기 Discovery**: 자산은 무엇이 핵심축인지 찾기 위한 판정 장치다. 기존 자산 카테고리는 격하·폐기될 수 있고, 새 핵심축 후보가 발견될 수 있다.
- **중기 Convergence**: 자산은 후보 간 교훈을 결합해 제품 구조를 수렴시키는 장치다. 축 간 연결, 데이터-시각화-사용자 행동의 맞물림, 반복되는 디자인/운영 규칙을 키운다.
- **후기 Readiness**: 자산은 대표 후보 승격과 외부 검증을 위한 보증 장치다. 출처, 운영 계약, 법적 경계, 수요 검증 패키지, 기계 판정을 강화한다.

자산은 **코드와 같은 저장소에 산다** — 별도 ledger 아니라 *제품의 일부*. clone 받은 사람이 자산 폴더를 *바로 본다*. 자산 카테고리·파일 구조·lifecycle은 도메인 결정 (위 "도메인이 결정하는 것" 참조).

**막는 LLM 이탈 패턴 (Asset System이 직접 막는 것)**:
- 코드만 누적되고 *제품 세부명세·디자인·도메인 스킬*은 자라지 않아 N 사이클 후 *기능 더미*가 됨 ("누가 왜 쓰는가" 비어있음)
- 자산이 별도 텍스트 ledger로 누적되어 *git history의 약한 사본*이 됨
- 다음 사이클이 *지난 사이클의 자산을 못 읽고* zero에서 재발명
- **명세 trunk만 자라고 콘텐츠 trunk가 0** — 약속·구조·acceptance check 같은 *명세 자산*만 자라면 N 사이클 후 *논문 아카이브*가 됨 (서비스 아님). 명세 trunk와 짝으로 **콘텐츠 trunk**(실 데이터 큐레이션·시각 디자인·UX 동선·실 사용자 콘텐츠 중 1개 이상)가 *함께* 자라야 한다. 콘텐츠 trunk 0인 사이클이 *N≥3 연속*이면 *콘텐츠 폐기 사이클* 강제 — 그 다음 사이클은 *명세 변경 0 + 콘텐츠 1조각*만 잠근다.

**막는 LLM 이탈 패턴 (Forward Momentum이 직접 막는 것)**
- 서브에이전트 리뷰·자가 점검이 *의도를 더 다듬는* 방향으로만 동작해 결과물이 같은 단계에 무한 반복
- 명제·의도 한 줄을 두 사이클 이상 정밀화하면서 *코드 단위 식별 0개*인 채 사이클 종료
- "거부 신호 안 걸렸다 → 통과"의 부정형 정지로 사이클이 형식상 닫히지만 *전진 없는* 상태

**도메인이 결정하는 것 (추가)**
- 사다리 단계 정의 자체 — 위 베이스 권고를 그대로 쓸 수도, 도메인 종착(코드·문서·정책·교육 콘텐츠 등)에 맞춰 자기 사다리를 정의할 수도 있음
- 같은 단계 머무름 허용 횟수 (베이스 권고: 1회 — 2회 연속 시 자동 상승)
- 사다리 단계와 사이클 의도의 매핑 방식

**4원리와의 닮은꼴**
- 매 사이클 = Atomic Step (한 단위)
- learnings ledger = Gap Ledger (append-only)
- 외부 검증 = Mechanical Verdict
- 매 사이클 zero 시작 + 종료 조건 = Refuse First
- 사이클 형식 사다리 (Forward Momentum) = Intent-Evidence Chain의 시간 축 진행 (의도가 코드까지 도달하는 본 경로를 사이클 단위로 절단)

**도메인이 결정하는 것**
- **자산 체계 발견·정의** — 자산 카테고리 목록 + 카테고리별 파일·폴더 구조 + 카테고리별 lifecycle.
  - **베이스는 카테고리 예시를 강제하지 않는다.** 다른 도메인이 채택한 목록을 그대로 수용하면 *모방 비대화*. 도메인이 *제품이 작동하려면 무엇이 함께 자라야 하는가*를 스스로 묻고 답한다 (질문 절차는 `intent-lock` SKILL Workflow 3 "자산 기여" 항목 참조).
  - 처음에는 *최소 1-2개*로 시작 (가장 본질). 사이클 진행하며 빈자리 발견 시 추가. 모방 의심 시 폐기.
  - 자산이 *평행 trunk*로 진행되는 도메인(예: 제품 코드 + 데이터 수집 + 운영)도 있다 — trunk 구조 자체도 도메인 결정. 단일 trunk 가정하지 않는다.
  - **multi-trunk 병렬 서브에이전트 패턴** — 단일 trunk 자율 모드는 N 사이클 후 *자기 폐쇄* 위험(수렴 회피 prompt도 한계). multi-trunk 가능 도메인은 trunk별 서브에이전트 + 자산 파일/worktree 격리 + 메인 오케스트레이션 패턴 적용. 메인은 *통합 합의*만, 각 trunk는 자기 sub-spiral loop로 자율 진행.
  - 채택된 카테고리·trunk는 도메인 AGENTS.md에 *채택 사유와 함께* 명시. 사유 없이 등재되면 *모방 신호*.
  - 자산 체계 없는 도메인은 Spiral Loop 적용 부적합.
- 외부 검증 신호 (사람·에이전트·기계)
- 상한 N과 조기 종료 조건
- "사이클" 단위의 크기
- 사다리 단계 정의 (위 "사이클 형식 사다리" 섹션 참조)

베이스는 패턴을 *옵션으로* 제공하며 강제하지 않는다. Spiral Loop 적용 여부는 도메인이 결정한다. **단 Spiral Loop를 적용하기로 한 도메인은 (a) Forward Momentum 규칙(사다리 명시 + 매 사이클 다음 단계 명시), (b) 자산 체계 누적 원칙(카테고리 정의 + 매 사이클 자산 기여 1조각), (c) 긍정형 통과 기준 2개(Forward Momentum + 자산 기여)를 함께 적용한다.**
