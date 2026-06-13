# 수요 검증 패키지 (draft — C3 Readiness에서 확정, local_ready 전제)

> orchestrator 요구: 각 항목은 한 줄 라벨이 아니라 **구체값**이어야 pass. 빈 값·라벨-only는 fail.

| 항목 | 구체값 (draft) |
|---|---|
| `target_user` | 한국에서 중·고교 영어를 마친 B1 수준 성인 학습자 — 독해는 되지만 have/get/take 같은 기본 동사를 쓸 때 번역(가지다/얻다)을 거쳐서 멈칫하는 사람. 첫 표본: 제작자 지인 1~3명 |
| `실제_task` | https://jaeyoung2026.github.io/get-the-feel/ 에서 안내 없이 한 세션 완주 (훈련 15 + 새 문장 5, 약 10분) — blind task (handoff/blind-task-guide.md 절차) |
| `최소_artifact` | 배포된 c2-3 (8감각 120문장, 해석 피드백, Day 추적) + blind task 안내문 |
| `반증_질문` | ① 참가자가 이 도구를 "단어 암기/퀴즈 앱"으로만 서술하면 → 감각 전달(차별점) 가설 기각 ② 특정 문항을 지목한 "새로 느낀 것"이 0이면 → 훈련 가치 가설 기각 ③ 이유 있는 "내일 안 연다"가 다수면 → 재방문 구조(R6) 기각 |
| `금지_claim` | "학습 효과 검증됨" 주장 금지 (N<10, 효과 연구 아님) / 페르소나·본인 기록을 수요 근거로 승격 금지 / "출처 기반"은 감각 설명의 귀속을 의미하며 교육 효과 보증이 아님 |
| `검증_위치` | 타인 blind task 결과 → `candidates/<대표>/cycle-record.md` append (덮어쓰기 금지) / 본인 기록 → 세션 export JSON |

## 미확정 (C3에서)

- 표본 수와 모집 경로 (지인 외 확장 여부)
- demand_status 판정 임계 (몇 명 중 몇 명이 어떤 신호면 demand_validated/rejected/pivot_required)
- 가격 제안 표면 도달 여부 (local_ready 정의의 한 항목 — C3에서 결정)
