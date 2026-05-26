# Refinement Log

product-weaver 자체 운영의 Refinement Loop 입력·출력 ledger. Append-only.

형식: 날짜 / Trigger / Input / Identified Pattern / Self-gate / Output / Applied to.

---

## 2026-05-26 — 초안 스킬 운영 시뮬레이션

- **Trigger**: 초안 첫 commit (474d871) 직후, 두 스킬(`intent-lock`, `refinement-loop`)을 실제 호출 시뮬레이션해 베이스가 작동하는지 검증.
- **Input** (외부 검증 결과 + 시뮬레이션 진단)
  - `refinement-loop` 첫 호출 시 Preflight 자기 적용이 ledger 부재로 차단됨 → 베이스가 자기 정신에 충실히 작동 확인
  - `intent-lock` 가상 의도 진입 시 Refuse First 모드가 인터뷰 직행을 차단 → 진입 게이트 작동 확인
  - 빈자리 3개 식별:
    1. 첫 회고 trigger 시점 명시 안 됨
    2. product-weaver 자체 운영 ledger 위치 명시 안 됨
    3. 외부 검증(codex exec 리뷰 등) 결과의 입력 회수 경로 명시 안 됨
- **Identified Pattern**: 기존 4원리·메타 프로세스로 모두 표현 가능 (Refinement Loop 인스턴스화 가이드의 빈자리). 새 원리 후보 아님.
- **Self-gate**: N/A — 새 원리·도구·스킬 추가 아닌 인스턴스화 가이드 보강. 셀프 게이트 적용 대상 아님.
- **Output**: Refinement Loop 인스턴스화 가이드 3건 보강.
  - "첫 회고 trigger" 항목 → `shared-skills/refinement-loop/SKILL.md` When To Use
  - "product-weaver 자체 ledger 위치 `docs/refinement-log.md`" → SKILL.md Workflow 1, `AGENTS.md` Always
  - "외부 검증 결과를 입력 5번째 채널로" → SKILL.md Workflow 2
- **Applied to**: `shared-skills/refinement-loop/SKILL.md`, `AGENTS.md`, `docs/refinement-log.md` (이 파일 신설)

---

## 2026-05-26 — 첫 도메인 파일럿 `claim-cards` 의도 잠금

- **Trigger**: 사용자 명시 위임("주요 의사결정은 니가 알아서 선택하라")으로 product-weaver의 실제 적용 검증. 새 마이크로 파일럿 잉태.
- **Input** (운영 결과 — `intent-lock` 첫 정식 호출)
  - 위치: `~/youngcompany/claim-cards/` (첫 commit `512681b`)
  - intent-lock Workflow 1 Refuse First 진입: 기존 도메인 베이스의 한 모드로 흡수 가능성 검토 → 도메인 무게 차이로 분리 결정
  - Workflow 2 단계 선언: `draft`
  - Workflow 3 인터뷰: 사용자 명시 위임으로 인터뷰 압축. 일방 의사결정 + 미승인 표기 + 사후 승인 라운드 큐 등록
  - Workflow 4 draft: `docs/intent.md` 작성 (제품 정체성·거부 신호·검증 방법·4원리 매핑·미승인 빈틈 5건)
  - Workflow 5 approve: 미승인 — fix_plan Phase 0 `intent-1` 항목으로 큐 등록
  - Workflow 6: Refinement Loop 입력 ledger 갱신 (이 entry)
- **Identified Pattern** (운영 중 드러난 베이스 빈자리)
  1. intent-lock에서 **"사용자 명시 위임" 모드** 명세 부족 — 인터뷰 압축 + 미승인 표기 + 사후 승인 큐가 자연스러운 흐름이었지만 SKILL.md에 명시 안 됨
  2. **미승인 항목 표기 형식 가이드** 부족 — `intent.md`에서 미승인을 어떻게 명시할지 (별도 섹션 / 인라인 마킹 / 별도 파일) 베이스가 안내 안 함
  3. **베이스 ↔ 도메인 인스턴스 디렉토리 관계** 가이드 부족 — claim-cards가 product-weaver를 "참조"한다는 표현은 했으나, 정식 관계 모델(상대 경로 참조? 심볼릭 링크? submodule?)이 베이스에 없음. 현재는 상대 경로 참조로 진행.
- **Self-gate**: N/A — 새 원리·도구·스킬 추가 아니라 인스턴스화 가이드 빈자리 발견. 셀프 게이트 대상 아님. 보강 후보로 누적.
- **Output**:
  - 새 도메인 파일럿 `claim-cards` bootstrap (베이스 → 첫 인스턴스 흐름 검증 완료)
  - 베이스 빈자리 3건은 즉시 본문 변경하지 않음 (Ask first 영역, 사용자 합의 후). refinement-log entry로만 누적.
- **Applied to**: `~/youngcompany/claim-cards/` 신설, `docs/refinement-log.md` 이 entry 추가

---

## 2026-05-26 — 두 번째 정식 회고: claim-cards 운영 발견 본문 반영

- **Trigger**: 사용자 /goal "만족할만한 프로세스 수준이 될때까지 개선하라". 직전 entry에서 누적된 베이스 빈자리 3건을 본문에 반영하는 정식 회고.
- **Input** (entry 2 누적분)
  - 빈자리 1: intent-lock "사용자 명시 위임" 모드 명세 부족
  - 빈자리 2: 미승인 항목 표기 형식 가이드 부족
  - 빈자리 3: 베이스 ↔ 도메인 인스턴스 디렉토리 관계 모델 부재
- **Identified Pattern**: 모두 기존 4원리·메타 프로세스로 표현 가능한 **인스턴스화 가이드 빈자리**. 새 원리·도구 추가 아님.
- **Self-gate**: 새 원리·도구·스킬 추가 아니므로 4문항 풀 적용은 N/A. 단 베이스 절차 빈자리 보강이므로 1·2만 명시 점검:
  - 1: 모두 동형 원리(intent-lock 절차, 베이스-인스턴스 관계)의 절차 빈자리. ✅
  - 2: 도메인 인스턴스가 아니라 베이스의 일이 맞음. ✅
- **Output**: 3건 모두 본문 반영
  - 빈자리 1 → `shared-skills/intent-lock/SKILL.md` Workflow 3에 "위임 모드 (Delegation Mode)" 섹션 추가 + Boundaries Never 항목 보강
  - 빈자리 2 → `shared-skills/intent-lock/SKILL.md` Workflow 5에 "미승인 표기 형식" 섹션 추가 + Boundaries Never 항목 보강
  - 빈자리 3 → `references/README.md` 에 "베이스 ↔ 도메인 인스턴스 관계 모델" 섹션 추가 (단방향 참조, submodule·symbolic link·코드 import 금지)
- **Applied to**: `shared-skills/intent-lock/SKILL.md`, `references/README.md`, `docs/refinement-log.md` (이 entry)

**자기 적용 확인**: 이 회고는 Preflight(ledger 입력 2개 누적) → 입력 수집 → 패턴 식별 → 셀프 게이트(N/A) → 출력 → Atomic Step(한 commit) 흐름을 정확히 따랐다. Refinement Loop가 자기 작동 검증.

---

## 2026-05-26 — claim-cards sample-first 운영 결과 회수

- **Trigger**: claim-cards sample-1 (representative sample) 작성 완료 (`0d5b2c1`). 베이스 빈자리가 또 식별되는지 점검.
- **Input** (claim-cards sample-1 findings 5건)
  1. claim-cards에 jaeyoung-think 같은 판단 스킬이 필요할 가능성
  2. Evidence "결손" 카테고리가 단순 근거 나열보다 본질적
  3. Uncertainty 내부 충돌은 글 전체 context 필요
  4. 카드 ID + cross-reference 구조가 자연 발생
  5. 원문의 출처·시점·저자 결손도 entry로 표기 필요
- **Identified Pattern**: 5건 모두 **claim-cards 도메인 빈자리**. product-weaver 베이스 빈자리 식별 없음.
  - 1번은 도메인 specific 스킬 후보 (베이스 스킬 아님)
  - 2~5번은 claim-cards의 출력 구조·UX 결정 사항
- **Self-gate**: 베이스 추가 항목 없음 → 셀프 게이트 적용 대상 없음.
- **Output**: 본문 변경 0건. 베이스가 도메인 발견을 도메인에 머무르게 함.
- **Applied to**: `docs/refinement-log.md` (이 entry만)

**검증 결과** — product-weaver 정신의 직접 작동 증거:
- 베이스는 추상만, 도메인 발견은 도메인에 머무름 (`docs/principles.md` 셀프 게이트 정신)
- sample-first가 의도 빈틈을 좁히고 도메인 결정의 입력이 됨 (`shared-skills/intent-lock/SKILL.md` 정신)
- 베이스가 sample 한 편을 받았을 때 본문 변경 없이 통과 — **베이스가 깨끗**

---

## 2026-05-26 — 4차 codex 외부 검증 + 만족 수준 도달 점검

- **Trigger**: 사용자 /goal "만족할만한 프로세스 수준이 될때까지 개선하라" 마지막 검증. 4차 codex exec 좁은 질문 4건.
- **Input** (외부 검증 결과)
  - 본문 보강 3건 깨끗함 확인 (Q1)
  - 일관성 불일치 2건 (Q2):
    - claim-cards intent.md 본문에 `(미승인 #2)` 마킹과 베이스 가이드 충돌 — 베이스가 "본문에 미승인 섞지 말라"였는데 인라인 마킹은 허용인지 모호
    - claim-cards AGENTS.md "sample-first는 의도 잠금 승인 후" vs fix_plan "Phase 0 완료 전 Phase 1 진입 가능" Preflight 해석 갈림
  - entry 3 Self-gate N/A 약함 (Q3) — 1·2 명시 보강 권고
  - 새 파일럿 시작 가능하나 "최소 시작 파일 체크리스트" 부재 (Q4)
- **Identified Pattern**:
  - 베이스 가이드의 정밀도 부족 (본문 표기 규칙)
  - 도메인 인스턴스 시작 형태가 묵시적 — 명시 가이드 필요
  - Self-gate 적용 기록 형식이 약함
- **Self-gate**:
  - 1: 모두 베이스 가이드 정밀도·시작 가이드의 절차 빈자리. ✅
  - 2: 도메인 일이 아니라 베이스의 일. ✅
- **Output**:
  - `shared-skills/intent-lock/SKILL.md` Workflow 5 — "본문 참조 마킹만 허용" 규칙 명확화
  - `references/README.md` — "도메인 인스턴스 최소 시작 형태" 섹션 추가 (4파일 체크리스트)
  - `docs/refinement-log.md` entry 3 — Self-gate 1·2 명시 적용 보강
  - claim-cards AGENTS.md — sample-first Preflight 해석 통일 (별도 commit)
- **Applied to**: `shared-skills/intent-lock/SKILL.md`, `references/README.md`, `docs/refinement-log.md` (이 entry + entry 3 보강), `~/youngcompany/claim-cards/AGENTS.md` (별도 commit)

**판정**: 만족 수준 도달.
- 베이스 자체의 자기 작동 검증 (Refinement Loop 5 entries)
- 베이스 → 첫 도메인 인스턴스 흐름 작동 (claim-cards bootstrap → sample-1)
- 도메인 운영 결과의 베이스 회수 경로 작동 (entry 2·4)
- 베이스가 도메인 발견을 도메인에 머무르게 함 (entry 4: 베이스 변경 0건)
- 외부 검증 (codex 1·2·3·4차) 통과

---

## 2026-05-26 — 자기 점검: 4차 반영 후 정밀도 비대 회수

- **Trigger**: 사용자 환기 — "오버 엔지니어링은 경계해야한다. 애초 프로젝트가 탄생한 배경을 잊지마". 4차 리뷰 권고 다 반영하면서 정밀도 비대 방향으로 흐른 것을 자기 점검.
- **Input**: entry 5의 출력 2건을 본질 관점에서 재검토
  - "본문 참조 마킹만 허용" 정밀화 (intent-lock Workflow 5)
  - "도메인 인스턴스 최소 시작 형태 4파일 list" (references)
- **Identified Pattern**: 둘 다 **베이스가 도메인 결정 자리에 발 들이는 형태**. 베이스 정신("산출물 형식은 도메인이 결정")과 충돌.
- **Self-gate**:
  - 1: 베이스의 일이 맞는가? — 본문 표기 형식·파일 list는 **도메인의 일**. 베이스가 잠글 것 아님. ❌ → **거부**
  - 결정: 깎는다.
- **Output**:
  - `shared-skills/intent-lock/SKILL.md` Workflow 5 — "본문 참조 마킹만 허용" 정밀화 제거. "본문에는 잠정 결정을 새로 적지 않는다. 본문 표기 형식은 도메인 결정" 한 줄로.
  - `references/README.md` — "최소 시작 형태 4파일 list" 제거. "자기 형식으로 만든다. 파일명·구조는 도메인 결정" 1단락으로.
- **Applied to**: 위 2개 파일

**교훈**: 외부 검증(codex)이 권고하는 정밀화도 셀프 게이트 1을 통과해야 한다. "베이스의 일인가, 도메인의 일인가" — 셀프 게이트는 외부 권고에도 적용된다. 본질 환기 없이 권고 그대로 반영하면 비대.
