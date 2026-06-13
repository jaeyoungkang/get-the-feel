# c4-1 Cycle Record (append-only)

> 단계: **C4 — 출시 후 진화 (Post-launch evolution)**. 재진입 트리거: **첫 실사용자(오너) 기능 피드백 4건** = 계약이 허용한 "새 외부 증거"(local terminal 이후 추가 사이클 조건). 2026-06-13.

```text
Skill Load Receipt
- skill: shared-skills/product-spiral-orchestrator/SKILL.md
- loaded_at_step: cycle-start (c4-1, C4 첫 후보)
- candidate_id: c4-1
- previous_candidate_disposition: c2-3 = promoted (대표 후보, 배포 라이브 — 패치 금지, fresh start)
- required_gates: Fresh Start / Candidate Completeness / Monitor 3종 / Mechanical Verdict / Stop Permission / Asset Recovery
- blocked_until: get+pp 콘텐츠 content-consensus 합의 + 사용자 결정(주제선택·통계 한 후보, 작문 별 후보) 반영 — 진행

Skill Load Receipt
- skill: shared-skills/intent-lock/SKILL.md
- loaded_at_step: cycle-start
- required_gates: 코드 도달 단위 / 제품 계약 발전 / 전달 가치 탐색 / 자산 기여 WHO·WHY

Skill Load Receipt
- skill: skills/content-consensus/SKILL.md
- loaded_at_step: cycle-start (get+pp 신규 콘텐츠)
- required_gates: 생성≠검수≠수정 권한 분리 / 검수 5관점 / receipt in cycle-record
```

## 사이클 의도 잠금 (c4-1)

- **사용자 피드백 회수 (3건 묶음, 사용자 결정 "한 후보에 모두")**:
  - #1 주제 선택: 일일공급(R6)을 **기본 유지** + 사용자가 특정 항목/축을 골라 집중하는 **선택 모드** 추가.
  - #2 get+과거분사: "get started/dressed/married/lost/ready" — get-state-change(get+형용사)의 인접 구문이나 미커버. 콘텐츠 확장.
  - #3 숙련도 통계: V2 심화 — 이미 있는 sense별 추적을 "어떤 감각이 늘고 있는지"가 보이는 추이·강약점 화면으로.
- **코드 도달 단위**: `candidates/c4-1/` 독립 웹앱 — 시작 화면에 주제 선택(전체/특정 항목), get+pp 문항 포함, 진척 화면에 감각별 추이·강약점. 이번 사이클 안.
- **제품 계약 발전**: V1 확장(주제 선택 = 학습 경로 선택권) + V2 심화(성장 가시화 구체화). 검증.
- **전달 가치 탐색**: V2 심화 (성장의 *방향*이 보임 — "무엇이 늘고 무엇이 약한지") + 새 가치 V4(학습 경로 선택권) 탐색.
- **자산 기여 (WHO·WHY)**: 코퍼스에 get+pp, UX 문법에 주제선택·통계 패턴. WHO: 한국인 학습자. WHY: 약한 감각만 골라 집중하고 싶은데 일일 랜덤은 그걸 못 줌 + 내가 어디서 느는지 안 보이면 동기 약함 (페르소나 "동사 고르기에서 계속 찍는 느낌이면 지친다").
- **n_of_N**: C4 1 of 3.

## 콘텐츠 합의 기록 (c4-1a — get+pp 신규 sense, 2026-06-13)

> 사용자 피드백 #2 회수: "get started 표현도 연습에 들어가나?" — 코퍼스에 get+과거분사 구문 부재 확인. get.json에 **추가만** (기존 2 sense·22문항 무수정).

### 생성 (generator)
- 신규 sense `get-into-state` — **get + 과거분사**: 주어가 '어떤 동작이 가해진 결과 상태'로 들어가 닿음. get-state-change(get+형용사, '상태 자리로 이동')와의 차이 = 과거분사라 *동작의 결과 상태로 진입* + 재귀·중간태(스스로 그 상태가 됨) 뉘앙스. boundary_ko: be married(상태)/get married(진입), get+pp는 진행 가능(He is getting dressed).
- 출처: `langacker-1987`(inchoative/change-of-state — 기존 get-state-change claim이 이미 '형용사·과거분사' 포함) + `lakoff-1993`(STATES ARE LOCATIONS) + `oald`(T2 용법 자연성). **미확인 표기**: get-passive의 mediopassive/역사적 재귀 기원 *라벨*은 일반 언어학 문헌 주장으로, 본 T1 출처가 그 라벨까지 직접 보증하는지는 미확인 — image의 '재귀·중간태 뉘앙스'는 교육용 단순화로만 사용(원전 라벨 귀속 아님). validation: `subagent-consensus`/`weak` (strong 승격은 사람 approve 대기).
- 문항 8 추가: training 5(get-t11~t15) + transfer 3(get-x6~x8). 유형: sense-choice 5 + verb-choice 3(get/be 대비). **get started 문항 포함(get-t11, 사용자 명시 요청)**.

### 적대적 검수 (reviewer, 5관점)
- **B1 (R11, blocking)**: 신규 sense-choice 5문항 전부 정답이 최장 보기 → 현우 "글빨 찍기"(R11) 재발 위험. **회수**: 오답을 정답과 비슷한 길이·구체성으로 보강(거리 1~6자 클러스터), 정답-최장 비율 5/5→1/5, 일부 문항은 오답이 더 길게(longest-picking을 역으로 오답으로 유도). 수정 후 길이 재측정 통과.
- 관점1 (출처-주장 정합 R5): mediopassive 라벨 과귀속 위험 → 미확인 표기로 차단(원전에 없는 라벨 조어 귀속 금지 규칙 준수). inchoative 핵심은 기존 get-state-change와 동일 T1 계열 — 정합.
- 관점2 (정답 유일성, verb-choice): t14 got/was/had·t15 was/got/kept·x8 was/had/got — 전 보기 문법 성립 여부 점검. `was married`/`was lost`/`was broken`은 be-수동/정적 독해로 *그럴듯한 근접 오개념*(R2)이나, 단일 시점 부사(the summer after / on the way / during the storm)가 진입 사건을 못박아 got을 유일 자연 선택으로 함 — why_ko가 be(상태 머묾)/get(진입) 대비로 해소. `kept lost`·`had broken`(능동 완료)은 비문/불일치 distractor.
- 관점3 (오개념): misconceptions.md "be vs get 상태"(got dark=변화/was dark=상태) 계열 정조준. boundary_ko가 진행형 경계(is getting dressed) 보존.
- 관점4 (전이 거리 R4): 전이 주어 = the meeting(추상 사건)·I(마음 상태)·the old window(무생물) — 훈련 주어(we/children/they 행위자)와 다른 칸 + 다른 동사(delayed/confused/broken vs started/dressed/married/lost). 어휘 치환 아님.
- 관점5 (기계 재검증): 신규 8문장 전 코퍼스 128문장 중복 0(정규화, 빈칸 채운 형태 포함 검증). answer_index 분산 0:3/1:2/2:3. type·subject_label·object_label·sentence_ko 전 문항 존재.

### 기각된 의심
- get-into-state를 get-state-change에 흡수(분할 작위성?) → 기각: 형용사 vs 과거분사는 문법 행동(진행·재귀·수동 경계)이 갈려 boundary_ko가 별 sense를 정당화. 사용자가 명시 요청한 구문군.
- get-t14 distractor `had married`를 빼고 다른 동사로 → 유지: have(완료)와의 대비가 get/be/have 3중 대비를 만들어 교육 가치 있음(why_ko가 해소).

### 수정 (fixer) + 재검증
- 수정자 적용: B1 길이 재균형만(새 해석 추가 없음). verdict 재실행: **content-contract PASS** (128문장 중복 0, get.json senses=3/training=15/transfer=8, 고아 0), sentence-ko PASS(128문항), smoke/label/separation/question-cue PASS.
- **알려진 FAIL — data-sync (c2-3)**: c2-3 data.js는 *닫힌/승격된 대표 후보*의 frozen verbatim 임베드(2 sense get.json). 라이브 get.json에 3번째 sense 추가 → drift FAIL. 이는 c2-2b 운영 결정(닫힌 후보 drift = 결함 아님)이 다루는 사례로, c2-3을 `CLOSED_CANDIDATES`에 등재하거나 c4-1 자체 data.js 빌드 시 해소됨. **본 작업 범위(get.json 추가만)에서 다른 파일 수정 금지 — c4-1 빌드/게이트 정리 단계로 이월.**

### 산출물 diff
- `assets/content/get.json`만 변경 — git diff 순증(insertions only), 기존 라인 삭제·수정 0(아래 보고 참조).

## 콘텐츠 합의 기록 (get+pp, content-consensus)
- 생성: opus (get-into-state sense + get-t11~t15·x6~x8 8문항, get started 포함). 자체 R11 회수.
- 독립 적대 검수: 별도 opus (권한 분리). **blocking 0**. 핵심 판정: get-into-state vs get-state-change **과분할 아님 — 오개념-표면(수동 혼동) 기준 분할로 정당, 병합 기각**. R11 독립 재확인(정답 최장 1/5), 중복 0, get/be 대비 정답 유일(시점 부사가 진입/상태 가름 — 감각 대비). minor 2: M1(두 sense 변별 위해 get+pp 보기에 수동/재귀 경계 한 줄), M2(married 수동 미끼 보강) — 출제 설계 메모.
- validation: subagent-consensus/weak (strong은 사람 approve 시).

## 평가 + 수리 + 자산 회수 (c4-1d, 2026-06-13)

### Mechanical Verdict + 스모크
11검사 ALL PASS, jsdom 스모크(기본·집중·통계 빈/채움·약점→집중) 런타임 0. 6후보 회귀 0.

### 페르소나 (민지, 배포 URL 실구동)
신기능 3개 작동 확인: 주제 선택(get 집중 시 get 문장만), get+pp(got married/started/tired 그림으로 묶임 — "get started 궁금증 풀림"), 약점→집중 링크·Day2 추이 실재. **결함 4건 적발** → 전건 수리:
- [HIGH] 통계 "기록 없음" 함정(사후 테스트까지 마쳐야 저장) → 빈 상태 안내 + 요약 CTA "테스트로 마무리" + 미완료 중 통계 링크 비노출
- [HIGH] 랜딩 무게(첫 버튼 1.8화면 아래) → 모드 선택·버튼을 산문 위로, 설명 details 접기 (G14 연장)
- [MED] 통계 16줄 과밀 → 푼 감각(t≥2)만 노출, 나머지 접기
- [MED] get+pp 라벨 잘림 → fitText + 칸 폭 확대 (G13)

### 모니터 3종
- Intent Guardian: **pass** (R6 보존 — 집중은 선택, 거부신호 0, 통계 정직)
- Asset Steward: **repair-before-next → 회수 완료**: V4 계약 등재, G15(주제선택·통계)·G16(get+pp) 신설, R12(get+pp 출제), misconceptions(be↔get+pp 수동혼동 + 승격 trigger), asset-map c4-1 갱신
- Data/Sellability: **pass** (get-into-state weak 정합, N=1 정직, 집중 소진 정직)

### Stop Permission
- local_candidate_status: pass / representative_status: **promoted (c4-1 = 새 대표 후보, c2-3 승계·동결)**
- primary_user_task: 감각 훈련 세션(주제 선택 + 9 sense 128문장 + 통계 추이)
- core_contribution_this_cycle: 2 — V4(학습 경로 선택권) 신 가치 + get+pp 콘텐츠. 산출물 diff 실재
- n_of_N: C4 1 of 3
- next_action: c4-2 (#4 제약형 산출 V3) — 사용자 결정대로. 또는 출시 후 수요 검증(demand-1) 계속
- allowed_to_stop: yes (c4-1 종료, 자산 회수 완료)

### Disposition
**c4-1 = 새 대표 후보** (배포 라이브). c2-3 → asset-only(동결). 배움 회수 완료.
