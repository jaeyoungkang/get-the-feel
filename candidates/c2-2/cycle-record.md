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
