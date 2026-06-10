# c1-1 Cycle Record (append-only — 판정을 덮어쓰지 않는다)

> 잠금자: 메인-서브 합의 — **자율 모드** (사용자 위임 발화: "스스로 판단해서 끝까지 진행하라", 2026-06-10)

```text
Skill Load Receipt
- skill: shared-skills/product-spiral-orchestrator/SKILL.md
- loaded_at_step: cycle-start (c1-1)
- candidate_id: c1-1
- previous_candidate_disposition: 없음 (첫 후보)
- required_gates: Fresh Start / Project Control Assets / Candidate Completeness / Monitor 3종 / Mechanical Verdict / Stop Permission / Asset Recovery
- blocked_until: preflight 산출물(데이터 계약 CONTRACT.md + 출처 목록 sources.md) 존재 — 충족

Skill Load Receipt
- skill: shared-skills/intent-lock/SKILL.md
- loaded_at_step: cycle-start (사이클 의도 잠금, 자율 모드)
- required_gates: 코드 도달 단위 / 제품 계약 발전 / 전달 가치 탐색 / 자산 기여 WHO·WHY
- blocked_until: 아래 의도 잠금 항목 전부 기재 — 충족
```

## 사이클 의도 잠금

- **축 (Discovery 가설)**: 핵심 동사 — `have` vertical slice. 가설: *"감각 선택형 문항으로 have의 영역-위치 감각이 사용자 표면에서 훈련 가능하다."*
- **코드 도달 단위**: `candidates/c1-1/` 독립 실행 웹 앱 — 이번 사이클 안.
- **제품 계약 발전**: V1(감각 훈련)이 [검증됨/반증됨]으로 판정된다 — 감각 선택형 형식의 작동 여부.
- **전달 가치 탐색**: V2(성장 가시화) 첫 구현 (추가) — 정답률·전이 결과 표면.
- **자산 기여 (WHO·WHY)**: 콘텐츠 코퍼스 trunk에 have 콘텐츠 + 데이터 계약 스키마(이번 preflight). WHO: 한국인 영어 학습자(첫 사용자 본인). WHY: have를 "가지다" 번역으로 처리하는 습관을 영역-위치 감각으로 교정 — 코드가 누구의 무엇을 위한지 잠금.
- **n_of_N**: 1 of **3** — N=5→3 재조정. 사유: 후보 1개 = 독립 웹 앱 + 출처 묶인 콘텐츠 + 검증 배선으로 콘텐츠 비용이 높아, 5개의 "진지하게 서로 다른" 후보는 비현실(적대적 리뷰 defer-4 회수). 자율 모드 단독 결정 — **미승인**, approve-1에 병합.
- **cap_reached_disposition**: `product/contract.md` 상한 섹션 참조.

## 콘텐츠 합의 기록 (c1-1b, 2026-06-11)

- 생성: opus 서브에이전트 (have.json — sense 2, training 10, transfer 5)
- 적대적 검수: 독립 opus 서브에이전트. **blocking 2건 + minor 4건** 식별, 전건 회수:
  - B1 출처-그림 불일치: event sense의 동적 image("통과")가 정적 위치 도식 출처를 넘어섬 → image·why_ko를 정적 "자리함/겪음"으로 교정
  - B2 진행형 경계 소실: 단일 "영역" 도식이 stative have(*is having a sister ×) vs 사건성 have(are having lunch ○) 차이를 지움 → `boundary_ko` 필드 신설(데이터 계약 갱신)하여 두 sense에 경계 단서 잠금
  - M2 신체부위 위치 도식 헐거움 → "영역에 속한 특징"으로 교정 / M3 problem을 정적 sense로 재분류 / M4 x4 표면 변형 전이 → have a rest로 교체 / M1 langacker 전용 금지 — 메모
- 기각된 의심: heine 위치 도식 자체, 어휘 난도, 정답 중의성, x1·x2·x3 전이 타당성
- validation: `subagent-consensus / weak` — 사람 리뷰(approve-4 출처 승인) 전 strong 승격 불가
