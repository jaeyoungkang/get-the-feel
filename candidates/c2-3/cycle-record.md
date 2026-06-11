# c2-3 Cycle Record (append-only)

> 잠금자: 사용자 지시("시작하라") + 세부 메인-서브 합의

```text
Skill Load Receipt
- skill: shared-skills/product-spiral-orchestrator/SKILL.md
- loaded_at_step: cycle-start (c2-3)
- candidate_id: c2-3
- previous_candidate_disposition: c2-2 = asset-only + 대표 후보 (사용자 기준 4 측정 진행 중 — 무결성 hotfix 1건 기록)
- required_gates: Fresh Start / Candidate Completeness / Monitor / Mechanical Verdict(+sentence_ko 검사) / Stop Permission / Asset Recovery
- blocked_until: c2-2 교훈 입력 (G11·G12, CONTRACT 9, 대비축 수렴 메모) — 충족

Skill Load Receipt
- skill: shared-skills/intent-lock/SKILL.md
- loaded_at_step: cycle-start
- required_gates: 코드 도달 단위 / 제품 계약 발전 / 전달 가치 탐색 / 자산 기여 WHO·WHY
- blocked_until: 아래 의도 잠금 — 충족
```

## 사이클 의도 잠금

- **목적**: C2 졸업선의 에이전트 몫 마감 — 기준 2 완성(동사 5/5) + 기준 3 마감(verb-choice 오답 대비축 수렴) + 운영 피드백 회수(sentence_ko 해석, 정답 후 표시).
- **새 콘텐츠**: 핵심 동사 `keep` — "힘으로 붙들어 영역 안에 유지"의 동적 유지 감각. have(그냥 있음, 힘 없음)와의 force 대비가 본질 (Talmy force dynamics). keep/have/get 3중 대비가 verb-choice의 본진 강화.
- **코드 도달 단위**: `candidates/c2-3/` 독립 웹 앱 — 8파일 120문장, 정답 후 한국어 해석(G12), G11 적용, **c2-2 사용 기록 이어받기**(gtf-c2-2- 읽기 전용 import — 사용자의 기준 4 Day 카운트 연속, 닫힌 후보 패치 아님).
- **제품 계약 발전**: V1 구체화 — 기준 2·3 충족으로 C2 졸업의 에이전트 측 조건 완성. 사용자 피드백 2건(정답 누설·해석)이 같은 사이클에 회수됨을 검증.
- **전달 가치 탐색**: V1 심화 (해석 피드백 — 이해 확인) + V2 유지 (Day 연속성).
- **자산 기여 (WHO·WHY)**: 코퍼스 8파일 120문장 + 전 문항 해석. WHO: 한국인 영어 학습자. WHY: keep을 "유지하다" 번역으로 외워 have와의 힘(force) 차이를 못 느끼는 문제 + 영어 문장 이해 불안(해석 부재)을 정답 후 해석으로 해소.
- **n_of_N**: 3 of 5.
