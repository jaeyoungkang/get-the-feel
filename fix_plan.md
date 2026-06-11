# fix_plan — 작업 큐

**규율**: 한 turn = 한 항목 = 한 commit (`docs/principles.md` Atomic Step).

식별자: `<카테고리>-<번호>`.

---

## 대기 중 (Pending)

- [ ] **C2 Session 계획** (졸업선: contract.md C2 Convergence 6기준, N=5) — 승인 대기 (approve-6):
  - ~~**c2-1**~~ ✅ 완료 (2026-06-11) — 결합 가설 검증, 기준 1 카운트 충족·기준 3 거의 충족. 신규 반증: 합성 과신 → R10
  - ~~**c2-2**~~ ✅ 완료 (2026-06-11) — 코퍼스 105문장(동사 4/5·불변화사 2), 일일 공급, R10 자연 주입 검증, handoff 패키지(기준 6). 치명 사고 1건(미정의 헬퍼 — verdict 실행 스모크 공백, 페르소나가 적발) 수리·회수
  - ~~**c2-3**~~ ✅ 완료 (2026-06-11) — keep(동사 5/5), 대비축 수렴, sentence_ko 120, 해석 피드백. **기준 1·2·3·6 충족 — C2 졸업은 기준 4·5(사용자) 대기**. c2-3가 새 대표 후보 (Day 이어받기)
  - **사용자 대기**: 기준 4(본인 c2-2 실사용 ≥7세션 — 다른 날) · 기준 5(approve-4 출처 리뷰 → strong)
  - **c2-4** 성장 증거 + 타인 검증 패키지 (기준 4·6) — 본인 7세션은 달력 시간 필요, 이 사이클과 병행 시작
  - **retro-1**은 c2-1과 c2-2 사이 (제품 루프 횟수에 미산입)
- [ ] ~~**c1-1**~~ ~~**c1-2**~~ (완료 — Done 참조) 첫 후보 완제품 — Discovery, 축은 후보 시작 시 에이전트 선택(핵심 동사 유력). preflight: 신뢰 출처 목록 제안(approve-4) + 콘텐츠 데이터 계약 스키마 + orchestrator receipt. 시작 시 세부 단위로 분해. **적대적 리뷰 회수 사항 포함**:
  - Discovery 후보의 콘텐츠 깊이는 승격 기준 3(동사 5개 풀)이 아니라 **1동사 vertical slice**로 — 단계별 기준 분리를 receipt에서 결정, N=5 상한도 콘텐츠 비용 재추정 후 N=3 검토
  - 데이터 계약에 **출처 타당성 게이트** 설계 — 출처 *유무*(기계)와 별개로 출처가 그 감각 설명을 실제로 뒷받침하는지의 사람 리뷰 단계. "출처 붙은 오개념" 차단이 1순위 위험
  - mechanical verdict는 **단일 검증 스크립트 1개**로 시작 (표본 lighthouse 교훈: 게이트는 좁게 시작, 설정 파일 비대화 금지)
- [x] **retro-1~3** ✅ 완료 (2026-06-11) — ① content-consensus 도메인 스킬 승격 ② 오개념 카탈로그 신설(+대조 레퍼런스 거부) ③ R4 합격선 체크리스트. 거부 기록: 빈틈 6 한정 문구 4곳 축약 안 함(레이어별 독자가 다름 — 계약/화면/규칙), choice-shuffle 분포 실측은 재발 시. 빈틈 6 본 처리는 V3 결정 시(C3)

## 진행 중 (In Progress)

없음.

## 완료 (Done)

- [x] **bootstrap-1** 도메인 부트스트랩 — 제품 계약 잠금 + Asset Map + Harness Case + 작업 큐 (2026-06-10)
- [x] **c1-1** 첫 후보 완제품 (have vertical slice) — mechanical ALL PASS, 페르소나 2 + 모니터 3 평가, disposition: asset-only. V1 부분 검증 + 반증 1건(정답 위치 고정) → R1~R8·G1~G6 자산 회수 (2026-06-11)
- [x] **c1-2** 둘째 후보 완제품 (up vertical slice) — mechanical 8검사 ALL PASS, 동일 회의 페르소나 재검증 + 모니터 3. V1 가설 검증(패턴 차단 + 메타포 작동), repair 3건 즉시 회수. **C1 Discovery 졸업선 충족** (2026-06-11)

---

## 사후 승인 큐 (Proposals — 사용자 승인 필요, 에이전트 단독 잠금 금지)

- [x] **approve-1** ✅ 일괄 승인 (2026-06-11) + 승격 6번 기준(차별 실재) 추가
- [x] **approve-2** ✅ 잠정안 승인 (감각 체화 종속 시 허용)
- [x] **approve-3** ✅ 로컬 저장 유지 승인
- [ ] **approve-4** 신뢰 출처 목록 — c1-1 preflight에서 제안 후 승인
- [x] **approve-5** ✅ 재결정 (2026-06-11): 외부 배포 — GitHub Pages (jaeyoung2026.github.io/get-the-feel, 배포 산출물만 공개). 재배포: tools/deploy/deploy-pages.sh
- [x] **approve-6** ✅ 승인 (2026-06-11) — C1 종료, C2 Convergence 진입. C2 졸업선 6기준 + N=5 함께 잠금 (contract.md)
