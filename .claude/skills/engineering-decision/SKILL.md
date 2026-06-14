---
name: engineering-decision
description: 제품 인스턴스가 커지면서 lint, dead-code, dependency, duplication, pure-function, tests, CI 같은 엔지니어링 제약을 언제 켤지 판단한다. 제약을 처음부터 front-load하지 않고, 코드 규모·변경 빈도·운영 리스크 trigger가 생겼을 때 agentic-base를 참조해 단계적으로 올린다.
compatibility: Domain-neutral. 도메인 인스턴스가 자기 코드베이스, 언어, 프레임워크, 위험도에 맞춰 품질 사다리를 인스턴스화한다.
---

# Goal

엔지니어링 제약은 제품을 지키기 위한 장치지만, 너무 일찍 켜면 제품 탐색을 굳힌다. 이 스킬은 **제약을 켤 시점과 강도를 결정**한다.

원칙:
- 작은 탐색 단계에서는 의도·제품 계약·자산 회수가 먼저다.
- 코드가 커지거나 반복 변경이 생기면 품질 제약을 점진적으로 켠다.
- 의사결정이 애매하면 `agentic-base`를 참조하되, product-weaver 안으로 가져오지 않는다.

## Reference Source

- `agentic-base`: `https://github.com/jaeyoungkang/agentic-base.git`

참조 방식:
- git remote, clone, 웹 문서, 또는 이미 내려받은 사본 중 가능한 방식으로 확인한다.
- 참조한 commit 또는 접근 실패를 receipt에 남긴다.
- agentic-base의 도구·문서·스킬을 product-weaver 베이스에 복제하지 않는다. 도메인 인스턴스가 필요하다고 판단한 부분만 자기 자산으로 인스턴스화한다.

## When To Use

- 새 제품 인스턴스에서 엔지니어링 규약 또는 품질 gate를 만들 때
- lint, format, dependency check, knip, duplication, pure-function, tests, coverage, build, CI 중 무엇을 켤지 판단할 때
- 같은 종류의 코드 결함, 중복, 죽은 코드, 의존성 혼선, 상태 변이, 회귀가 반복될 때
- 판매 가능 제품으로 올리기 전 운영 리스크를 줄여야 할 때

## Workflow

0. **Skill Load Receipt** — 이 파일을 실제로 읽었음을 산출물 또는 진행 메시지에 남긴다.
   - `skill: shared-skills/engineering-decision/SKILL.md`
   - `loaded_at_step`
   - `agentic_base_ref`: commit hash 또는 접근 실패 사유
   - `engineering_trigger`: 이번에 제약 판단이 필요한 이유
   - `blocked_until`: trigger와 선택 rung이 기록될 때까지 품질 도구 추가 금지

1. **Refuse First** — 지금 품질 제약을 추가하지 않을 사유부터 검토한다.
   - 코드가 아직 버릴 수 있는 prototype인가?
   - 제품 계약·데이터 계약·표면 가설이 아직 바뀌는 중인가?
   - 새 도구가 문제를 막는가, 아니면 탐색 속도만 낮추는가?
   - 기존 언어/프레임워크의 기본 검사로 충분한가?

2. **Trigger 분류** — 제약을 켤 이유를 하나 이상 명시한다.
   - `size`: 파일·라인·컴포넌트 수가 수동 파악 한계를 넘음
   - `change_frequency`: 같은 영역을 반복 수정함
   - `defect`: 회귀·런타임 오류·상태 꼬임이 실제 발생함
   - `dependency_risk`: 패키지·import·dead code가 판단을 흐림
   - `duplication_risk`: 같은 로직이 두 곳 이상 갈라짐
   - `purity_risk`: 계산 로직이 DOM, IO, 시간, 전역 상태와 섞임
   - `operational_risk`: 정기 업데이트, 데이터 출처, 결제, 고객 노출, 법무/투자/의료 리스크가 있음
   - `release_risk`: 판매·배포·CI 전에 재현 가능한 검증이 필요함

3. **품질 사다리 선택** — 한 번에 한 rung만 올린다.
   - `L0`: syntax, smoke, asset-map check. 초기 prototype 기본값.
   - `L1`: lint, format, basic dependency check. 파일 수와 반복 수정이 늘 때.
   - `L2`: dead-code/knip, duplication check, module boundary check. 구조가 커질 때.
   - `L3`: pure-function boundary, unit tests for business/data logic, coverage target. 계산·데이터 계약이 중요해질 때.
   - `L4`: build, integration/e2e, CI, release checklist. 외부 사용자·판매·운영 노출 전.

4. **agentic-base 참조** — 선택 rung이 L1 이상이거나 판단이 애매하면 agentic-base를 확인한다.
   - 이 도메인에 맞는 engineering profile, quality gate, skill, CLI 패턴이 있는지 본다.
   - 참조 결과는 `adopt`, `adapt`, `reject` 중 하나로 기록한다.
   - agentic-base의 무거운 도구를 그대로 들여오려면 도메인 인스턴스의 비용·유지보수 근거가 있어야 한다.

5. **도메인 자산 회수** — 결정은 도메인 인스턴스의 작동 위치에 남긴다.
   - AGENTS.md, 제품별 skill/playbook, package scripts, CI, test files, architecture note 중 하나.
   - “나중에 lint 하자” 같은 메모만 있으면 미통과.
   - 단, L0 유지 결정도 유효하다. 이 경우 왜 아직 front-load하지 않는지와 다음 trigger를 적는다.

6. **Mechanical Verdict** — 선택한 rung의 최소 명령 또는 리뷰 기준을 기록한다.
   - 실행 가능한 명령이 있으면 실제로 실행한다.
   - 아직 명령을 만들지 않는 L0/L1 이전 상태라면 사람/코드 리뷰 기준과 다음 trigger를 기록한다.

## Output

- Skill Load Receipt
- `engineering_trigger`
- 선택 rung과 거부한 rung
- agentic-base 참조 결과
- 도메인 자산 반영 위치
- mechanical verdict 또는 다음 trigger

## Boundaries

- **Never**
  - 새 제품 첫 사이클에 lint/knip/CI 같은 제약을 관성으로 추가
  - trigger 없이 도구를 추가
  - agentic-base를 submodule, symlink, import로 product-weaver에 묶기
  - 도구 추가를 품질 개선으로 착각하고 제품 계약·데이터 계약 실패를 통과시키기
- **Ask first**
  - product-weaver 베이스에 새 엔지니어링 도구나 CLI를 직접 추가하려 할 때
  - agentic-base의 일부를 베이스 파일로 복제하려 할 때
- **Always**
  - 제약은 trigger 기반으로 단계적 적용
  - L1 이상 결정 전 agentic-base 참조 또는 접근 실패 기록
  - 도메인 자산에 `why now`, `chosen rung`, `next trigger`를 남김
  - 같은 결함이 반복되면 다음 cycle에서 rung 상승을 검토
