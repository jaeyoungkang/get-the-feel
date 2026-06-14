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

## 평가 기록 (c1-1d, 2026-06-11)

### Mechanical Verdict
`node tools/verdict/check.mjs c1-1` — 6검사군 **ALL PASS** (content-contract / candidate-files / data-sync / separation-surface / no-gamification / smoke)

### 페르소나 blind task (약한 verdict — 베이스 모르는 학습자 시뮬레이션, append-only)
- **민지 (B1 직장인, 중립)**: 완주. 훈련 9/10, 전이 4~5/5. 감각 설명이 "가지다"와 실제로 다르게 작동한 지점: t2(번호), t8(problem — 진행형 표지로 해소, "제일 많이 배운 지점"). 시각 메타포 처음 2-3회 실효 → 후반 장식화. **결함**: SVG 라벨 파싱 깨짐("We usually"가 주어), 표면 어휘 학술적(체화·V2·weak·후보), 진척 첫날 빈 화면. 재방문: "아마 안 연다" — 콘텐츠 1일치.
- **현우 (회의론자, 듀오 380일 이탈)**: 완주. 훈련 10/10, 전이 5/5 — **단, 패턴 매칭으로**: 전 문항 정답이 (b) 위치 고정 + 보기 미셔플 → 3문항 만에 문장 안 읽고 풀림. "감각 선택형이라는 포장지 안의 설명은 진짜지만 훈련 방식은 가짜." 인정 2: 단일 공간 감각 통일 관점("따로 외웠던 머릿속을 정리해줬다"), 자기 한계 정직 표기. 산출 갭 지적: "고를 줄 알게 됐지만 입은 한 번도 안 연다."

### 모니터 3종
- **Intent Guardian: pass** — 약속·거부 신호 보존, scope creep 0. (선택 수리: 오답 시 SVG 미정착 긴장)
- **Asset Steward: repair-before-next** — ux-grammar.md·training-design.md 미생성(차별점이 app.js에만 삶), deriveLabels 파서 결함의 회수처 부재 → **본 사이클에서 즉시 회수 완료** (assets/ 2파일 신설 + CONTRACT 라벨 필드)
- **Data/Sellability: pass** — weak 표기·honesty 문구 정직. (선택: 진척 N=1 라벨)

### Stop Permission
- `local_candidate_status`: pass (mechanical ALL PASS, 완제품으로 완주 가능)
- `representative_status`: not-promoted
- `primary_user_task`: have 감각 훈련 세션 완주 (훈련 10 → 전이 5 → 진척) — 산출물: candidates/c1-1 앱 + assets/content/have.json
- `core_contribution_this_cycle`: 2 — ① V1 검증 결과: **부분 검증 + 핵심 반증 1건** (감각 선택형 *설명·메타포*는 작동 — 두 페르소나 모두 인정; *훈련 방식*은 정답 위치 고정으로 패턴 매칭에 오염 — 반증). ② 자산 신설: 콘텐츠 코퍼스 + 데이터 계약 + verdict 도구 + 훈련 설계 규칙 R1-R8 + UX 문법 G1-G6
- `core_evidence`: 산출물 diff — 신규 파일 9개 (commit 2a417ad, dd889aa, 본 commit), 페르소나 blind task 기록 2건
- `n_of_N`: 1 of 3
- `local_ready`: no (Discovery 진행 중, 수요 검증 패키지 미완)
- `demand_status`: demand_unknown
- `next_action`: c1-2 — 다른 축(불변화사·전치사 유력) + R1·R2·G2·G5 적용
- `allowed_to_stop`: no

### Disposition
**asset-only** — 후보 파일은 보존(패치 금지), 배움은 assets/·CONTRACT·계약으로 회수 완료. c1-2는 fresh start.
