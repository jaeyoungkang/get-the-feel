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
