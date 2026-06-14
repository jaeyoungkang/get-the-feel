# c2-2 Cycle Record (append-only)

> 잠금자: 메인-서브 합의 — 자율 모드 (사용자 위임: "끝까지 진행하라", 2026-06-11)

```text
Skill Load Receipt
- skill: shared-skills/product-spiral-orchestrator/SKILL.md
- loaded_at_step: cycle-start (c2-2)
- candidate_id: c2-2
- previous_candidate_disposition: c2-1 = asset-only + 현 최선 후보 (배움 회수 완료: R10, G7·G8, verb_label)
- required_gates: Fresh Start / Candidate Completeness / Monitor 3종 / Mechanical Verdict(9검사) / Stop Permission / Asset Recovery
- blocked_until: c2-1 교훈 입력 확인 (R10 반례, verb-choice 문법 단서 축소, R8 sense별 추적 복원) — 충족

Skill Load Receipt
- skill: shared-skills/intent-lock/SKILL.md
- loaded_at_step: cycle-start
- required_gates: 코드 도달 단위 / 제품 계약 발전 / 전달 가치 탐색 / 자산 기여 WHO·WHY
- blocked_until: 아래 의도 잠금 — 충족
```

## 사이클 의도 잠금

- **가설 (Convergence)**: *"코퍼스가 두께(동사 5·불변화사 2·문항 100+)를 갖추면, 일일 공급 구조(매 세션 새 문장)가 재방문의 실제 이유가 된다 — 그리고 합성의 반례(관용 구동사)를 정면으로 가르치면 과신 없이 합성 도구를 쓸 수 있다."*
- **새 콘텐츠**: 핵심 동사 `take`(능동 점유) · `make`(형체 만들기) + 불변화사 `out`(안→밖) + phrasal-up에 **관용 반례 sense**(R10 — give up 등 합성 환원 불가 사례).
- **코드 도달 단위**: `candidates/c2-2/` 독립 웹 앱 — 전체 코퍼스(100+ 문항) 기반 일일 세션 공급(미출제 문장 우선), sense별 추적 복원(R8), R10 반례 문항 포함. 이번 사이클 안.
- **제품 계약 발전**: V1 구체화(코퍼스 두께가 훈련 과정을 지탱) + **검증 — C2 졸업 기준 2 충족 시도**. R6(콘텐츠 공급=재방문)이 구조로 구현되는지.
- **전달 가치 탐색**: V1 심화 + **V2 심화** (7일 코스 구조 — 성장 가시화가 "며칠째, 어떤 감각이 자랐나"로 구체화).
- **자산 기여 (WHO·WHY)**: 코퍼스 trunk 4배 확장. WHO: 한국인 영어 학습자. WHY: take/make/out을 "취하다/만들다/밖"으로 따로 외우는 문제 + 잘 풀리는 구동사만 보여줘 과신을 키우는 함정(R10) — 두께와 정직한 반례로 푼다.
- **n_of_N**: 2 of 5.

## 콘텐츠 합의 기록 (c2-2b, 2026-06-11)

- 생성: opus 2갈래 병렬 (A: take.json·make.json / B: out.json + phrasal-up.json opaque-idiom sense 추가). 코퍼스 7파일 105문장.
- 적대적 검수: 독립 opus. **blocking 3 + minor 3**, 전건 회수 (수정: 제3 opus):
  - B1 출처 조어 귀속: "KNOWING/VISIBLE IS OUT"은 L&J 원전에 없음 → ref 삭제, lindner 단일 근거 (출처 붙은 오개념 4번째 적발 — 게이트 일관 작동)
  - B2 정답 유일성: take a seat ≈ have a seat (관용 동등) → 능동 점유가 교체 불가능한 문장으로
  - B3 R10 반례의 역설: give up은 완료 합성 학설이 실재해 반례로는 *너무 투명* → bring up(화제 꺼내기)으로 교체 + "합성 테스트가 깔끔히 안 갈린다는 사실 자체가 신호"로 단정 완화
  - M1 take medicine 섭취 용법 정직화 / M2 make-create "형체" → "새로 생겨난 것" (make a mistake 모순 제거) / M4 take-carry vs get을 deixis로 교정
- 기각: take/get 분할(heine action vs goal 도식 정확), make force dynamics 인용, do/make 경계 문항, out 뒤집기 테스트
- 운영 결정: 닫힌 후보(c1-x, c2-1)의 data-sync는 **마감 시점 PASS가 정본** — 코퍼스 진화에 따른 이후 drift는 결함이 아님 (후보는 박제, 코퍼스는 성장)
- validation: subagent-consensus / weak

## 평가 기록 (c2-2d, 2026-06-11)

### Mechanical Verdict
9검사군 ALL PASS (4후보 전부 일관 — 닫힌 후보는 CLOSED_CANDIDATES 명시 분기).

### 페르소나 blind task (민지 2차 방문) — **치명 결함 적발 → 수리 → 재검증**
- 1차 시도: **0문항 — 시작 버튼 사망.** 헬퍼 5종(itemColor·itemShort·typeLabel·senseLabel·senseColor)이 호출만 있고 미정의 → ReferenceError로 렌더 전면 차단. **mechanical verdict는 실행 스모크가 없어 ALL PASS인 채로 죽은 후보를 통과시킴** — 페르소나 blind task가 게이트 공백을 적발 (검증 체계의 가장 중요한 발견).
- 수리: 헬퍼 5종 정의 + 미정의 호출 정적 스캔(오탐 제외 0건).
- 재검증 (독립 jsdom 구동): 전 단계 PASS — 인트로→훈련15→전이5→진척, 런타임 에러 0, Day2 신규 문항 13-14/15(미출제 우선 동작), 관용 자물쇠 자연 주입 16/20 세션.

### 모니터 3종
- **Intent Guardian: pass** — 일일 공급·R10·sense 추적 코드 도달, scope creep 0, CLOSED 분기는 기록된 운영 결정의 정직한 구현. 풀 소진 시 "복습 모드" 정직 전환 확인.
- **Asset Steward: repair-before-next → 회수 완료**: G9(take/make/out/자물쇠 메타포)·G10(헬퍼 사고 + verdict 실행 스모크 공백 — 1회라 기록만, 재발 시 검사 승격) 신설. baseline 소급 결함 교훈 회수(아래).
- **Data/Sellability: repair-before-next → 회수 완료**: **C2 기준 2 미달 명시 — 핵심 동사 4/5** (have/get/take/make — 5번째는 c2-3). "거의 됐다" 판정 금지 규칙에 따라 미달로 기록. 105문장·중복 0·weak 표기 정합은 확인.

### 교훈 회수 (자산 반영)
- baseline 소급 결함: 구 후보 시절 콘텐츠가 신규 결합 후보에 합류할 때 후속 CONTRACT 규칙 미준수가 처음 노출된다 — have.json 라벨 15건 정본 수리로 해소, 패턴은 CONTRACT 메모로.
- verdict 실행 스모크 공백: 죽은 후보가 ALL PASS 가능 — G10에 기록, 재발 시 검사 승격.

### Stop Permission
- `local_candidate_status`: pass (수리 후 재검증 완료)
- `representative_status`: not-promoted — **현 최선 후보** (코퍼스 7항목 105문장 + 일일 공급)
- `primary_user_task`: 일일 세션 완주 + Day2 재방문 (훈련 15 → 전이 5 → Day-N 진척)
- `core_contribution_this_cycle`: 2 — ① 기준 2의 카운트 축(문항 100+·불변화사 2) 충족, 동사 4/5 미달 명시 ② 자산: 코퍼스 4배, R10 반례 검증(자연 주입 작동), G9·G10, 일일 공급 구조, handoff 패키지(기준 6)
- `core_evidence`: 산출물 diff (commit 991c142, fd9083a, 본 commit) + jsdom 재검증 기록
- `n_of_N`: 2 of 5
- `local_ready`: no — C2 졸업 기준: 1 ✓ / 2 ✗(동사 4/5) / 3 ◐ / 4 ✗(본인 실사용 0 — 사용자 몫) / 5 ✗(weak — approve-4 사용자 몫) / 6 ✓(handoff/blind-task-guide.md)
- `demand_status`: demand_unknown
- `next_action`: c2-3 — 5번째 동사(go 또는 keep) + 기준 3 마감. 기준 4·5는 사용자 손 대기 (에이전트 압축 불가)
- `allowed_to_stop`: no (단, 자율 run은 여기서 사용자 경계에 도달 — 기준 4·5가 전제)

### Disposition
**asset-only + 현 최선 후보 (c2-1에서 승계)** — 파일 보존, 배움 회수 완료.

## 무결성 hotfix (c2-2 마감 후, 2026-06-11 — append)

- **사용자(첫 사용자) 실사용 1세션에서 적발**: 질문 우측 상단 item-pill이 verb-choice("get")·sense-cloze("up")의 정답을 누설. 페르소나·모니터·기계 검증 전부 놓침 — 실사용자가 잡음 (기준 4가 검증 게이트로도 작동한다는 증거).
- 닫힌 후보 수정 금지 원칙의 예외 적용 사유: 기준 4 측정(정답률)이 이 결함으로 오염되는 중 — 측정 무결성 hotfix만 허용, 기능 추가 없음. item-pill을 질문→피드백으로 이동.
- jsdom 재검증 통과 (Day2 신규 14/15), verdict ALL PASS.
- 자산 회수: G11(질문 단계 정답 단서 차단), G12 + CONTRACT 9(한국어 해석은 정답 후 — sentence_ko, c2-3부터). 운영 피드백 "영어 문장에 한국어 해석" → 정답 전 노출은 답 누설·번역 우회라 정답 후 표시로 설계 결정.
