# 수요 검증 패키지 (C4 대표 후보 기준 — local_ready 전제)

> orchestrator 요구: 각 항목은 한 줄 라벨이 아니라 **구체값**이어야 pass. 빈 값·라벨-only는 fail.
> 이 패키지는 *출시 후 수요 검증*의 설계도다. local_ready는 패키지의 **완성**을 보고, demand_status는 출시 후 채워진다(루프 밖).
> 현재 기준선: 대표 프로토타입 증거 `archive/prototypes/c4-3/`, 배포 URL https://jaeyoung2026.github.io/get-the-feel/ , 11파일 24 sense 173문항.

| 항목 | 구체값 |
|---|---|
| `target_user` | 한국에서 중·고교 영어를 마친 B1 수준 성인 학습자 — 독해는 되지만 have/get/take 같은 기본 동사를 쓸 때 번역(가지다/얻다)을 거쳐 멈칫하는 사람. 영영사전 용례를 봐도 "감이 안 잡힌다"고 느끼는 층 |
| `실제_task` | https://jaeyoung2026.github.io/get-the-feel/ 에서 안내 없이 한 세션 완주 (훈련 15 + 새 문장 5, 약 10분) — blind task (`handoff/blind-task-guide.md`) |
| `최소_artifact` | 배포된 c4-3 (11파일 24 sense 173문항, 핵심 동사 8·불변화사 2·구동사 1, 인식+산출 모드, 감각별 통계, 해석 피드백, 로컬 기록) + blind task 안내문 4질문 |
| `반증_질문` | ① "단어 암기/퀴즈 앱"으로만 서술 → 차별점(감각 전달) 기각 ② 지목한 "새로 느낀 것" 0 → 훈련 가치 기각 ③ 이유 있는 "내일 안 연다" 다수 → 재방문 구조(R6) 기각 ④ 보기 안 읽고 풀린다는 반응 → R11(보기 길이 누설) 미회수 신호 |
| `금지_claim` | "학습 효과 검증됨" 금지(N<10, 효과 연구 아님) / 페르소나·본인·시뮬 기록을 수요 근거로 승격 금지(약한 verdict) / "출처 기반"은 감각 설명의 *귀속*이지 교육 효과 보증 아님 / "영어가 입에서 나온다" 금지 — 앱이 "알아보는 힘일 뿐"이라 자백한 선 유지 |
| `검증_위치` | 타인 blind 결과 → `archive/prototypes/c4-3/cycle-record.md` append(덮어쓰기 금지) / 본인 기록 → localStorage export 또는 수동 기록 / 집계 → 이 파일 하단 결과 섹션 |

## 표본·판정 임계 (확정)

- **표본**: 1차 지인 3~5명 (target_user 적합자). 2차 확장(SNS·커뮤니티)은 1차가 demand_unknown 아닌 신호를 줄 때만.
- **판정 임계** (출시 후 채움):
  - `demand_validated`: 표본의 과반이 (반증질문 ①②를 통과 = 차별·훈련가치 둘 다 살아있음) + 1명 이상 자발 재방문(요청 없이 2회차)
  - `demand_rejected`: 과반이 반증질문 ① 또는 ②에 걸림 → 다음 제품 가설로 pivot
  - `pivot_required`: 차별(①)은 살았으나 재방문(③) 전원 부정 → 제품 핵심은 맞고 *전달 형식* 재설계 (V3 산출 훈련 등)
- **가격 표면**: Readiness 범위 밖 — 무료 배포로 수요 신호 먼저. 가격 제안은 demand_validated 후 별 사이클.

## 운영 계약 (thin path — "매일 새 문장 공급" 약속)

이 제품의 유일한 운영 약속은 *콘텐츠 공급*이다 (실시간 데이터·예측 없음 — 정적 앱). 최소 계약:
- `as_of`: 콘텐츠는 대표 후보 c4-3(11파일 24 sense 173문항, 2026-06-13 배포) 기준 고정. 갱신 시 버전 표기.
- `provenance`: 전 sense `source_refs` + `validation` 필드 존재. 현재 strong 17 sense + weak 7 sense(`get-into-state`, `be`, `go`, `come` 계열 사람 리뷰 대기). weak→strong 승격은 별도 사람 승인 전까지 금지.
- `상태 구분`: "새 문장 N개 남음"은 *이 브라우저 localStorage 출제 이력* 기준 (서버 없음 — 기기·브라우저별 독립). ⓘ에 명시됨.
- `소진 처리`: 173문항 출제 완료 시 "한 바퀴 완주 → 복습 모드"로 정직 전환 (빈 화면 금지). 진짜 "매일 새 문장"의 지속은 코퍼스 확장(다음 동사·불변화사·어순 축)에 의존 — 이건 출시 후 운영 약속이며, 현재는 7일치 이상을 보장.
- `correction`: 콘텐츠 오류 발견 시 코퍼스 수정 → content-consensus 재검수 → 재배포. 닫힌 후보는 마감 시점 고정(CLOSED_CANDIDATES).

## 결과 기록 (append-only)

아직 없음 — `demand_status: demand_unknown`.
