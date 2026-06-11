# 감각 콘텐츠 데이터 계약 (정본)

콘텐츠 코퍼스의 스키마와 승격 규칙. 위반 콘텐츠는 후보에 실을 수 없다 (`tools/verdict/`가 기계 검사).

## 파일 형식

`assets/content/<item>.json` — 감각 단위(동사·불변화사 등) 하나당 한 파일.

```json
{
  "axis": "core-verbs | particles | phrasal-verbs | word-order",
  "item": "have",
  "senses": [
    {
      "id": "have-domain-location",
      "ko": "감각 설명 (한국인 학습자용 한 줄)",
      "image": "그림으로 떠올릴 한 줄 (공간·신체 감각)",
      "boundary_ko": "선택 — 이 감각이 지우면 안 되는 문법 경계 한 줄 (예: 진행형 가부). 단일 도식이 문법 행동 차이를 가리는 것을 막는다",
      "source_refs": [
        { "source_id": "sources.md의 ID", "locator": "장·절·표제어", "claim": "출처가 실제로 뒷받침하는 주장 한 줄 — claim이 sense의 image까지 보증하는지 검수 대상" }
      ],
      "validation": { "method": "human | subagent-consensus", "strength": "strong | weak", "date": "YYYY-MM-DD" }
    }
  ],
  "training_items": [
    {
      "id": "have-t1",
      "sense_id": "have-domain-location",
      "sentence": "She has the window seat.",
      "subject_label": "She",
      "object_label": "the window seat",
      "prompt": "이 have가 그리는 그림은?",
      "choices": ["...", "...", "..."],
      "answer_index": 1,
      "why_ko": "정답 해설 — sense의 감각으로 환원"
    }
  ],
  "transfer_items": [ "training_items와 같은 형식" ]
}
```

## 승격 규칙 (기계 검사 대상)

1. **출처 필수**: 모든 `senses[*]`는 `source_refs` ≥ 1. `source_id`는 `product/sources.md`에 존재해야 한다. 빈 `claim`·`locator`는 fail.
2. **출처 타당성 리뷰 — 게이트**: `validation` 필수. 자율 모드의 `subagent-consensus`는 `strength: weak` — 사람 리뷰 전까지 strong 승격 불가. **출처 필드 존재(기계)와 출처가 주장을 실제 뒷받침함(리뷰)은 별개 게이트다** — "출처 붙은 오개념"이 1순위 위험. **신규·변경 sense는 생성자와 독립된 적대적 검수 기록(blocking 판정 포함)이 해당 후보 cycle-record에 있어야 후보에 탑재할 수 있다** — c1-1 B1·c1-2 B2로 같은 오류가 2회 반복되어 게이트로 승격 (`tools/verdict` `adversarial-review` 검사가 기록 존재를 기계 확인).
3. **훈련/전이 분리**: `training_items`와 `transfer_items`의 `sentence`는 전 코퍼스에서 중복 금지 (대소문자·공백 정규화 후 비교). 전이 문항은 훈련에 노출되지 않은 새 문장이어야 한다.
4. **감각 기반 형식 + 유형 다양화**: 문항은 `type` 필드를 **가져야 한다 (c2-1부터 필수; 기존 코퍼스는 필드 없음 = `sense-choice`로 간주)** — `sense-choice`(기본값, 그림 고르기) / `verb-choice`(빈칸 동사 선택, 보기는 감각이 갈리는 동사들) / `sense-cloze`(빈칸 불변화사 선택). 빈칸 유형(`verb-choice`·`sense-cloze`)의 `sentence`는 `___` 마커를 포함하고 `choices`는 단어, `why_ko`는 정답·오답 단어의 감각 대비를 설명한다. **뜻 암기형("have의 뜻은?")과 감각 근거 없는 빈칸은 여전히 금지** — 거부 신호(계약 참조). 한 세션 출제는 유형 2개 이상 혼합 (training-design R9).
5. **카운트 최소선** (Discovery vertical slice): sense ≥ 1, training ≥ 8, transfer ≥ 4. 미달이면 후보에 싣지 않는다.
6. **모든 `*_items[*].sense_id`는 같은 파일의 `senses[*].id`에 존재**해야 한다 (고아 문항 금지).
7. **시각화 라벨은 명시 필드로** — baseline 주의: 구 사이클 콘텐츠가 신규 결합 후보의 출제 풀에 합류하는 순간 후속 규칙 미준수가 처음 노출된다 (c2-2에서 have.json 라벨 15건 소급 수리). 코퍼스 파일은 규칙 개정 시 소급 적용이 원칙.
7-1. **(원문)**: 문항의 `subject_label`/`object_label`은 c1-2부터 필수. 앱이 문장에서 파싱 추출하는 것 금지 (UX 문법 G2 — c1-1에서 부사·도치 문장의 라벨 깨짐 확인).
8. **정답 위치**: 앱은 보기 표시 순서를 문항마다 셔플해야 한다 (훈련 설계 R1). 데이터의 `answer_index` 고정 위치가 화면에 그대로 노출되면 fail — verdict가 후보 코드의 셔플 존재를 검사 (c1-2부터).
