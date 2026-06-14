# c1-2 Cycle Record (append-only)

> 잠금자: 메인-서브 합의 — **자율 모드** (사용자 위임 지속)

```text
Skill Load Receipt
- skill: shared-skills/product-spiral-orchestrator/SKILL.md
- loaded_at_step: cycle-start (c1-2)
- candidate_id: c1-2
- previous_candidate_disposition: c1-1 = asset-only (배움 회수 완료: R1~R8, G1~G6, CONTRACT 7·8)
- required_gates: Fresh Start(c1-1 패치 금지) / Candidate Completeness / Monitor 3종 / Mechanical Verdict(셔플·라벨 검사 추가) / Stop Permission / Asset Recovery
- blocked_until: c1-1 교훈·자산을 입력으로 읽음 — 충족 (training-design.md, ux-grammar.md, CONTRACT.md)

Skill Load Receipt
- skill: shared-skills/intent-lock/SKILL.md
- loaded_at_step: cycle-start (사이클 의도 잠금, 자율 모드)
- required_gates: 코드 도달 단위 / 제품 계약 발전 / 전달 가치 탐색 / 자산 기여 WHO·WHY
- blocked_until: 아래 의도 잠금 — 충족
```

## 사이클 의도 잠금

- **축 (Discovery 가설)**: 불변화사 — `up` vertical slice. 가설: *"불변화사의 공간 감각(수직 이동 + 완료·증가 확장)은 공간 메타포 시각화로 훈련 가능하며, 이 축에서 시각 차별점이 핵심 동사 축보다 강하게 작동한다."*
- **코드 도달 단위**: `candidates/c1-2/` 독립 실행 웹 앱 — 이번 사이클 안.
- **제품 계약 발전**: V1(감각 훈련) 구체화 — c1-1 반증(정답 위치 패턴)을 R1·R2로 교정한 형식이 실제로 패턴 풀이를 막는지 검증.
- **전달 가치 탐색**: V1 심화 (새 축에서) + G5 적용 — 사용자 표면 어휘 전환(학술→생활 어휘)이 첫 화면 30초 이해를 개선하는지.
- **자산 기여 (WHO·WHY)**: 콘텐츠 코퍼스에 up 콘텐츠 + 메타포 어휘(G1)에 수직·완료 도식 추가. WHO: 한국인 영어 학습자. WHY: up을 "위"라는 번역 하나로 처리해 eat up / time's up / fill up이 각각 암기가 되는 문제 — 수직과 완료·증가가 한 감각임을 체화.
- **n_of_N**: 2 of 3.

## 콘텐츠 합의 기록 (c1-2b, 2026-06-11)

- 생성: opus 서브에이전트 (up.json — sense 2, training 10, transfer 5, 라벨 필드 전수, answer_index 분산)
- 적대적 검수: 독립 opus 서브에이전트. **blocking 2건 + minor 4건**, 전건 회수:
  - B1 sense 오분류: x3(prices go up)는 완료가 아니라 증가(MORE IS UP) — 2-sense 계약을 깨는 제3 의미망 밀반입 → wrap up(명확한 완료) 문항으로 교체
  - B2 출처 오인용: MORE IS UP(증가)을 완료 근거로 인용 + 원전에 없는 라벨 조어 → lakoff-johnson ref를 completion sense에서 제거 (lindner 단독)
  - M1 boundary_ko에 slow/calm down(감소·진정 = 별개 도식) 단서 추가 / M2 x1 표면 변형 전이 → 길의 가상 이동(fictive motion)으로 교체 / M3 t10 오답 문구 교정 / M4 t9 오답을 근접 오개념(시계 바늘 12시)으로 강화
- 기각된 의심: answer_index 균등 분포(R1은 앱 셔플 의무라 무관), burn up/down 대비 정확성, vertical 문항 정답 유일성
- validation: subagent-consensus / weak

## 평가 기록 (c1-2d, 2026-06-11)

### Mechanical Verdict
`node tools/verdict/check.mjs c1-2` — 8검사군 **ALL PASS** (기존 6 + choice-shuffle + label-fields). c1-1 회귀 0.

### 페르소나 blind task (약한 verdict, append-only)
- **현우 (회의론자 — c1-1을 깨뜨린 동일 페르소나의 재검증)**: 완주. 훈련 9/10, 전이 4/5.
  - **c1-1 혹평 1 (정답 위치 패턴): 교정 확인** — 위치 찍기 33점 수준으로 무력화, 보기 길이·어휘 단서 꼼수도 차단. "영어 문장을 안 읽으면 둘 중 뭘 골라야 할지 알 수 없다."
  - **사이클 가설 검증**: burn up 오답 → 그릇 차오름 메타포로 교정 경험. "텍스트로 100번 읽어도 안 박히던 게 그릇 그림 하나로 박혔다. 이건 진짜다." — 시각 차별점이 불변화사 축에서 강하게 작동.
  - **혹평 2 (산출 부재): 여전 — 단 정직해짐** (G5 적용 인정). **혹평 3 (콘텐츠 1일치): 여전 — "이번엔 그 1일치가 알맹이가 있다"** (R6 과제 유지).
  - G5 검증: "학원 광고 냄새 빠졌다."

### 모니터 3종
- **Intent Guardian: pass** — 의도 3축·거부 신호·G5 정직성 보존. 이월 메모: 인트로의 2-sense 예고는 승격 기준 1에서.
- **Asset Steward: repair-before-next → 본 사이클에서 회수 완료**: ① G4>G3 우선순위 규칙(ux-grammar 갱신 + 코드 교정 `(fatigued && correct)`) ② no-gamification의 SVG points= 오탐 제외(check.mjs) ③ label-fields 휴리스틱 한계를 asset-map에 명문화.
- **Data/Sellability: pass** — weak 정직 표기, 증가 의미망 배제 정합, ⓘ 패널은 숨김이 아니라 접힘.

### Stop Permission
- `local_candidate_status`: pass
- `representative_status`: not-promoted (현재 최선 후보 — 승격은 기준 3 깊이·기준 5 재사용 동력 미충족)
- `primary_user_task`: up 감각 훈련 세션 완주 — 산출물: candidates/c1-2 앱 + up.json + verdict 확장
- `core_contribution_this_cycle`: 2 — ① V1 가설 검증 (R1·R2 교정이 패턴 풀이를 실제 차단 + 시각 메타포가 불변화사 축에서 작동, 페르소나 실수행 증거) ② 자산: up 코퍼스, 메타포 2종(G1 확장), G4>G3 규칙, verdict 2검사
- `core_evidence`: 산출물 diff (commit 132fd88, 0b8047d, 본 commit) + 동일 페르소나 재검증 기록
- `n_of_N`: 2 of 3
- `local_ready`: no (수요 검증 패키지 미완 — Discovery 졸업으로 충분, local_ready는 Readiness 단계 과제)
- `demand_status`: demand_unknown
- `next_action`: **C1 Discovery Session 졸업선 충족 — Session 종료, 단계 전환(중기 Convergence)은 사람 결정** (orchestrator: Session 경계 = human authority)
- `allowed_to_stop`: yes (Session 경계 도달 — local spiral 종료가 아니라 Session 종료)

### Disposition
**asset-only + 현재 대표 후보 후보(가칭)** — c1-2가 두 후보 중 최선. 파일 보존, 배움 회수 완료. 다음 후보(중기)는 fresh start로 c1-1·c1-2 교훈 전부를 입력.
