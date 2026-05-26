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
  - intent-lock Workflow 1 Refuse First 진입: lighthouse 모드로 흡수 가능성 검토 → 도메인 무게 차이로 분리 결정
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
