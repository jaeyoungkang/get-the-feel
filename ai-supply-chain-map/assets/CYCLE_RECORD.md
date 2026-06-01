# Cycle Record — c1-macro-map

## Skill Load Receipt

- skill: `shared-skills/intent-lock/SKILL.md`
- loaded_at_step: fresh cycle-start
- required_gates: Refuse First, code reach unit, product contract development, original user ask
- blocked_until: primary surface is macro AI supply-chain map

- skill: `shared-skills/refinement-loop/SKILL.md`
- loaded_at_step: fresh cycle-start
- required_gates: Intent Guardian, original intent anchor, minimum mechanical verdict, no bulk rounds
- blocked_until: macro-to-micro map verifies locally

- skill: `ai-supply-chain-map/skills/supply-chain-map-cycle/SKILL.md`
- loaded_at_step: asset-repair
- required_gates: Asset Preflight, product-specific skill receipt, sellability gate, Asset Steward Monitor, mechanical asset gate
- blocked_until: reusable product assets exist and `node scripts/check-assets.mjs` passes

- skill: `ai-supply-chain-map/skills/engineering-harness/SKILL.md`
- agentic_base_repo: `https://github.com/jaeyoungkang/agentic-base.git`
- agentic_base_reference_checked: `cc4b26b36ff06de6b7bb37a855aa966fed0070d8`
- loaded_at_step: engineering-asset-repair
- required_gates: agentic-base reference gate, engineering quality ladder, quality:check
- blocked_until: engineering decisions reference agentic-base and quality ladder is mechanically checked

## Original Intent Anchor

- original user ask: 일반 주식투자자가 AI 공급망 현황을 쉽게 이해하고, 수급 병목을 직관적으로 포착하며, 거시 뷰에서 미시 뷰로 전환하고, 시간 변화와 미래 스냅샷을 볼 수 있는 웹페이지.
- original keywords: `거시 맵`, `AI 공급망`, `수급 병목`, `미시 전환`, `시간 변화`, `미래 스냅샷`
- current cycle promise: 첫 화면을 거시 공급망 맵으로 만들고, 선택 노드의 미시 정보와 시간 스냅샷을 보조 패널로 제공한다.
- current artifact keywords: `macro map`, `bottleneck edge`, `timeline`, `micro detail`, `scenario`
- primary surface implements original ask?: yes
- preserved: 거시 맵, 병목 전파, 미시 전환, 시간/미래 스냅샷
- narrowed: 첫 버전은 예시 병목 점수와 공식 출처 링크만 사용하고 자동 갱신 파이프라인은 만들지 않는다.
- drift verdict: preserve

## Intent Guardian

- original_ask: ordinary stock investors need an easy visual web page for AI supply-chain status, bottlenecks, macro-to-micro switching, regular updates, time changes, and future snapshots.
- current_cycle_promise: AI supply-chain status visualization, not stock picker or company-card dashboard.
- preserved: macro map, bottleneck view, micro details, time/future snapshots.
- narrowed: strengthen the supply-chain bottleneck map only.
- drift_risk: low after this cycle definition.
- verdict: preserve

## Process Improvement Monitor

- status: completed
- process_learning: 원 의도 보존과 최소 검증은 개선됐지만, Process Improvement Monitor를 처음에는 pending placeholder로 둔 채 cycle close처럼 처리했다.
- missing_gate: Process Improvement Monitor verdict가 완료되기 전 cycle close를 막는 hard gate가 없었다. 데이터/source contract도 다음 cycle acceptance shape가 약했다.
- template_change: Process Improvement Monitor section은 `Minimum Mechanical Verdict`보다 앞에 있고 `status: completed`여야 한다. pending이면 cycle not closed.
- skill_change_candidate: required monitor placeholder는 compliance가 아니며, verdict 전 실제 출력이 필요하다는 규칙을 refinement-loop에 반영.
- mechanical_verdict_gap: 현재 mechanical checks는 JS/HTTP/keyword 중심이다. snapshot 값의 source/date/status contract, scenario/observed 일관성, macro-to-micro 브라우저 상호작용은 아직 검증하지 않는다.
- next_cycle_process_rule: 다음 cycle 전에 모든 표시 점수/스냅샷은 `source_status`, `as_of`, `observed_or_scenario`, `calculation_status`를 선언해야 한다. unknown 값은 observed 표시를 막는다.
- verdict: repair-before-next

## Asset Steward Monitor

- asset_map_present: yes, `assets/ASSET_MAP.md`
- asset_categories_checked: product contract, product-specific skills/playbooks, engineering rules, research/data operations, visualization/UX, business logic/sellability, process/monitor recovery
- skill_assets_checked: `skills/supply-chain-map-cycle/SKILL.md`
- skill_receipts_required: base `intent-lock`, base `refinement-loop`, product `supply-chain-map-cycle`
- cycle_contributions:
  - product-specific skill asset added
  - engineering-harness skill added with agentic-base repo reference
  - asset map gate added
  - engineering, data, design, business, and process assets initialized
  - mechanical asset check added
- missing_or_stale_assets: sellability and data operations are skeletons; representative/sellable promotion remains blocked until thin-path operating data is real
- next_cycle_asset_rule: 다음 cycle은 화면 기능 확장이 아니라 `HBM -> advanced packaging -> cloud capacity` thin path의 데이터 계약과 판매성 게이트를 실제 값/출처/갱신 규칙으로 채운다.
- verdict: repair-before-next

## Sellability Gate

- buyer: 일반 주식투자자
- paid_job: AI 공급망 병목을 빠르게 이해해 실적/뉴스/설비투자 정보를 읽는 시간을 줄인다.
- pricing_hypothesis: 미승인. 실제 데이터 업데이트 비용과 경쟁 대안 확인 전 가격 확정 금지.
- freshness_promise: 미승인. 최소 월간 갱신 후보이나 source workflow 없음.
- update_owner: 미정. 자동/수동 수집 책임자와 검수 절차 필요.
- data_cost_or_manual_work: 미정. 공식 출처 수집, 큐레이션, 지표 산식 운영 비용 확인 필요.
- release_blockers: example score, source pipeline 없음, observed/example 혼합, 법적/투자자문 경계 검토 필요.
- sales_risk_verdict: fail for sellable release; continue only as repair cycle.

## Data Contract Gate For Next Cycle

이번 cycle에서 모든 표시 점수와 스냅샷은 아래 필드를 갖도록 보강했다.

- `source_status`: official / curated / example / unknown
- `as_of`: 기준 날짜 또는 `unknown`
- `observed_or_scenario`: observed / scenario
- `calculation_status`: measured / modeled / example / unknown

`unknown`은 observed로 표시할 수 없고, 대표 산출물 승격을 막는다.

## Cycle 2 Data Contract Repair

- node score contract: added
- edge pressure contract: added
- snapshot contract: added
- visible contract panel: added
- unknown observed labels: none

## Product Contract

사용자는 30초 안에 현재 병목 압력이 가장 큰 공급망 구간과 그 압력이 다음 구간으로 전파되는 경로를 말할 수 있다.

## Refuse First

- 종목 추천, 매수/매도 신호, 목표가를 제공하지 않는다.
- 단일 종목 카드나 리서치 대시보드로 축소하지 않는다.
- 미래 스냅샷을 관측 사실처럼 표시하지 않는다.
- 데이터 출처 없는 점수를 실제 현황처럼 단정하지 않는다.

## Code Reach Unit

`ai-supply-chain-map/index.html`, `styles.css`, `app.js`: SVG 기반 macro supply-chain map, micro detail panel, snapshot controls, scenario labels.

## Asset Contribution

- category: product contract + prototype surface
- WHO/WHY: 일반 주식투자자가 AI 공급망 뉴스와 기업 실적을 볼 때 어디가 막히는지 먼저 이해하기 위해
- contribution: macro-map-first UI and intent-safe cycle record

## Minimum Mechanical Verdict

- Skill Load Receipt exists: pass
- original keywords present in cycle record: pass
- primary surface contains SVG macro map: pass
- static JS syntax check: pass
- HTTP 200 check: pass
- Process Improvement Monitor completed: pass
- Asset Map exists: pass
- product-specific skill exists: pass
- asset mechanical check: pass (`node ai-supply-chain-map/scripts/check-assets.mjs`)
- agentic-base repo reachable: pass (`git ls-remote https://github.com/jaeyoungkang/agentic-base.git HEAD`)
- engineering harness skill exists: pass
- engineering quality ladder exists: pass
- quality check: pass (`npm run quality:check`)
- displayed score data contract: fail, next-cycle blocking

## Next Cycle

If c1 passes, next cycle should improve real data/source contract and update cadence, not replace macro map with single-stock flow.
