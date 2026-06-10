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
      "source_refs": [
        { "source_id": "sources.md의 ID", "locator": "장·절·표제어", "claim": "출처가 실제로 뒷받침하는 주장 한 줄" }
      ],
      "validation": { "method": "human | subagent-consensus", "strength": "strong | weak", "date": "YYYY-MM-DD" }
    }
  ],
  "training_items": [
    {
      "id": "have-t1",
      "sense_id": "have-domain-location",
      "sentence": "She has the window seat.",
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
2. **출처 타당성 리뷰**: `validation` 필수. 자율 모드의 `subagent-consensus`는 `strength: weak` — 사람 리뷰 전까지 strong 승격 불가. **출처 필드 존재(기계)와 출처가 주장을 실제 뒷받침함(리뷰)은 별개 게이트다** — "출처 붙은 오개념"이 1순위 위험.
3. **훈련/전이 분리**: `training_items`와 `transfer_items`의 `sentence`는 전 코퍼스에서 중복 금지 (대소문자·공백 정규화 후 비교). 전이 문항은 훈련에 노출되지 않은 새 문장이어야 한다.
4. **감각 선택형 형식**: `prompt`는 감각·그림을 묻는다. 뜻 암기형("have의 뜻은?")·단순 빈칸은 금지 — 거부 신호(계약 참조).
5. **카운트 최소선** (Discovery vertical slice): sense ≥ 1, training ≥ 8, transfer ≥ 4. 미달이면 후보에 싣지 않는다.
6. **모든 `*_items[*].sense_id`는 같은 파일의 `senses[*].id`에 존재**해야 한다 (고아 문항 금지).
