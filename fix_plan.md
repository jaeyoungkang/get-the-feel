# fix_plan — 작업 큐

**규율**: 한 turn = 한 항목 = 한 commit (`docs/principles.md` Atomic Step).

식별자: `<카테고리>-<번호>`.

---

## 대기 중 (Pending)

- [ ] **c1-1** 첫 후보 완제품 — Discovery, 축은 후보 시작 시 에이전트 선택(핵심 동사 유력). preflight: 신뢰 출처 목록 제안(approve-4) + 콘텐츠 데이터 계약 스키마 + orchestrator receipt. 시작 시 세부 단위로 분해. **적대적 리뷰 회수 사항 포함**:
  - Discovery 후보의 콘텐츠 깊이는 승격 기준 3(동사 5개 풀)이 아니라 **1동사 vertical slice**로 — 단계별 기준 분리를 receipt에서 결정, N=5 상한도 콘텐츠 비용 재추정 후 N=3 검토
  - 데이터 계약에 **출처 타당성 게이트** 설계 — 출처 *유무*(기계)와 별개로 출처가 그 감각 설명을 실제로 뒷받침하는지의 사람 리뷰 단계. "출처 붙은 오개념" 차단이 1순위 위험
  - mechanical verdict는 **단일 검증 스크립트 1개**로 시작 (표본 lighthouse 교훈: 게이트는 좁게 시작, 설정 파일 비대화 금지)
- [ ] **retro-1** 첫 회고 (입력 누적 후) — 적대적 리뷰 defer 회수: ① asset-map trunk 재검토(1·5번은 방법론 메타 자산 — 도메인 고유 후보 "학습자 오개념 카탈로그", "감각-한국어 대조 레퍼런스" 승격 평가) ② 차별점(감각 선택형·UX 문법)을 승격 게이트에 연결할지 검토(approve-1과 함께) ③ 빈틈 6(체화 추론 한계) 처리

## 진행 중 (In Progress)

없음.

## 완료 (Done)

- [x] **bootstrap-1** 도메인 부트스트랩 — 제품 계약 잠금 + Asset Map + Harness Case + 작업 큐 (2026-06-10)

---

## 사후 승인 큐 (Proposals — 사용자 승인 필요, 에이전트 단독 잠금 금지)

- [ ] **approve-1** Spiral 도달 기준 전체(대표 후보 승격 5기준 + 자산 효과성 기준 + N=5) — 위임 결정, `product/contract.md` Spiral 목표 섹션
- [ ] **approve-2** 단어 암기형·문법 설명형 거부 여부 — 잠정: 감각 체화에 종속될 때만 허용. trigger: 첫 회고
- [ ] **approve-3** 정답률 데이터 저장 방식 — 잠정: 로컬 저장. trigger: c1-1 engineering-decision
- [ ] **approve-4** 신뢰 출처 목록 — c1-1 preflight에서 제안 후 승인
- [ ] **approve-5** 배포 형태 — 잠정: 로컬 실행. trigger: 타인 사용자 발생 시
