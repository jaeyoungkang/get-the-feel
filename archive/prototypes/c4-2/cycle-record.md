# c4-2 Cycle Record (append-only)

> 단계: C4 진화. #4 작문(제약형 산출, 사용자 결정 2026-06-13) = V3 산출 훈련 — 페르소나·계약이 줄곧 가리킨 "고를 줄 알지만 쓸 줄 모른다" 미해결 가치.

```text
Skill Load Receipt
- skill: shared-skills/product-spiral-orchestrator/SKILL.md
- loaded_at_step: cycle-start (c4-2)
- candidate_id: c4-2
- previous_candidate_disposition: c4-1 = promoted (대표 후보·배포, 동결·패치 금지)
- required_gates: Fresh Start / Candidate Completeness / Monitor / Mechanical Verdict / Stop Permission / Asset Recovery
- blocked_until: 산출 설계(파생 방식·자가채점 정직 라벨) 잠금 — 진행

Skill Load Receipt
- skill: shared-skills/intent-lock/SKILL.md
- loaded_at_step: cycle-start
- required_gates: 코드 도달 단위 / 제품 계약 발전 / 전달 가치 탐색 / 자산 기여 WHO·WHY
```

## 사이클 의도 잠금 (c4-2)

- **가설 (V3 산출)**: *"인식(고르기)을 넘어 산출(쓰기)로 반보 더 가면, 감각 체화가 '알아보는 힘'에서 '꺼내 쓰는 힘'으로 한 단계 오른다. 서버 없이도 제약형 산출로 검증 가능하다."*
- **설계 (서버 불요·정체성 유지)**: 기존 코퍼스 128문장 재사용해 산출 과제 파생. 난이도 3단:
  - **빈칸 타이핑 (쉬움)**: verb-choice/cloze 문항의 ___에 단어를 *고르지 않고 직접 타이핑*. 정규화 문자열 일치로 자동 채점. (고르기→인출의 반보)
  - **어순 재배열 (중간)**: 문장 토큰을 섞어 제시 → 올바른 순서로 배열. 자동 채점(원문 일치). 어순축(4축 중 ④) 산출.
  - **전문 쓰기 (어려움)**: sentence_ko(한국어)를 prompt로 영어 문장 작성 → 모범문(원문) + 자가채점 rubric(① 그 감각을 썼나 ② 어순 ③ 동사형) 제시, 스스로 표기. **자가채점 = 약한 verdict, 정직 라벨**.
- **정체성 유지**: 모든 산출 과제는 *그 감각 문장*을 만든다 (자유 작문 아님 — 거부 신호 "범용 학습앱" 차단). 피드백에 감각 그림 재노출로 산출을 감각에 묶음.
- **인식≠산출 분리**: 산출 자가점수를 인식("알아보는 힘") 통계와 합치지 않는다. 별도 "꺼내 쓰는 힘" 표기. 현우 "입 안 열린다"의 그 갭을 정직하게 다룸.
- **코드 도달 단위**: candidates/c4-2/ 독립 웹앱 — 시작 화면에 "써보기(산출)" 모드 추가, 3난이도, 자가채점 정직 라벨. 이번 사이클 안.
- **제품 계약 발전**: V3(산출 훈련) draft→구현·검증.
- **전달 가치 탐색**: 새 가치 V3 — "꺼내 쓰는 힘". 인식 가치(V1)와 짝.
- **자산 기여 (WHO·WHY)**: training-design에 산출 파생·자가채점 규칙, ux-grammar에 산출 UX. WHO: 한국인 학습자. WHY: 고르기만으론 입이 안 열린다(페르소나 3/3·계약 R7) — 제약형 산출로 인출 연습.
- **n_of_N**: C4 2 of 3.

## 적대적 검수 (append-only · 빌드 후 검증 기록)

> 위 "사이클 의도 잠금" 본문은 동결(수정 금지). 이 섹션은 헤더 선언대로 *append-only*로 추가된 빌드 후 검증 기록이다 — 잠긴 의도는 한 글자도 바꾸지 않았다.

- **콘텐츠 변경 범위**: c4-2는 c4-1 코퍼스 8파일(have/get/take/make/keep/up/out/phrasal-up)을 **verbatim 재사용**한다. **신규 sense 0 · 변경 sense 0**. data.js는 `assets/content/*.json`과 의미적으로 동일(verdict `data-sync` PASS로 기계 확인).
- **검수 판정 (blocking)**: 신규·변경 sense가 없으므로 새로 검수해야 할 "출처 붙은 오개념" 위험 표면이 없다. 탑재 콘텐츠의 sense별 적대적 검수(blocking 판정 포함)는 동결 대표 후보 c4-1의 cycle-record에서 이미 통과했고, c4-2는 그 검수 결과를 그대로 계승한다. **본 후보에서 blocking으로 막아야 할 콘텐츠 결함은 발견되지 않음** — 코퍼스가 불변이므로 c4-1의 검수가 정본.
- **산출 모드 파생의 정직성 검수 (신규 표면)**: 산출 과제는 *그 감각 문장*만 만든다(자유 작문 아님 — 거부 신호 "범용 학습앱" 차단). 빈칸 타이핑·어순 재배열은 자동 채점(정규화 일치). 전문 쓰기 자가채점은 **약한 verdict**로 화면·기록·통계 전반에 정직 라벨이 박혀 있고, 인식 통계(days)와 산출 통계(produce)는 저장소·집계가 분리되어 인식 점수에 섞이지 않는다(코드로 강제). 산출은 새 콘텐츠를 만들지 않으므로 콘텐츠 검수 대상 아님.

## 평가 + 수리 + 자산 회수 (c4-2c, 2026-06-13)

### 페르소나 (현우, 회의론자 4번째 방문 — 산출은 그의 핵심 불만의 답)
배포 URL 실구동. 3난이도 다 수행 + 쓰레기 문장 100% 자가채점 시도(반증). 판정: **"이번엔 진짜로 입 쪽으로 한 발 갔다 — 3번 불만(고르기≠말하기)이 정면으로 풀렸다."**
- 빈칸 타이핑: 보기 없이 직접 인출, 틀린 인출이 감각 그림으로 회수. 굴절형 허용.
- 어순 재배열: 토큰 탭 배열, 인출 강도 높음.
- 전문 쓰기 자가채점: 쓰레기 100% 시도 → 앱이 "약한 점수" 끝까지 라벨 + 인식 통계 비합산 + selfGraded 영구 표시. "자기위안 사기" 의심 **반박됨** — "위안은 가능하나 사기는 아니다".
- 인식/산출 분리: 별 키·별 섹션, 구조적으로 안 섞임 확인.
- 남은 불만: 쓰기지 말하기 아님(발화 2할) — 정직 한계. "계속 따라간다."

### 모니터 3종
- Intent Guardian: **pass** (정체성·인식≠산출 분리 코드 강제·약한 verdict 정직 — 통과)
- Asset Steward: **repair-before-next → 회수 완료**: V3 계약 등재, R13(산출 파생)·R14(자가채점), G17(산출 UX), asset-map c4-2
- Data/Sellability: **repair-before-next → 회수 완료**: **어순 재배열 단일 모범문 함정** — 분리형 구동사("pick the pen up")를 오답 처리(제품 핵심 축에서 거짓 학습). `isRigidOrder` 필터로 이동 가능 문장 제외(rigid 37문장 잔존, 충분), R13에 규칙 회수.

### Stop Permission
- local_candidate_status: pass / representative_status: **promoted (c4-2 = 새 대표, c4-1 동결)**
- core_contribution_this_cycle: 2 — V3(산출, 새 가치) 구현 + reorder 정직성 수리. 산출물 diff 실재
- n_of_N: C4 2 of 3 / allowed_to_stop: yes
- next_action: **실사용자 4 요청 전부 반영 완료** → 출시 후 수요 검증(demand-1) 계속, 또는 발화(말하기) 가치는 차기 가설

### Disposition
**c4-2 = 새 대표 후보** (배포 라이브). c4-1 동결. 사용자 피드백 4건(#1 주제선택·#2 get+pp·#3 통계·#4 산출) 전부 제품에 반영·검증.
