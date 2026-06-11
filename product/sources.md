# 신뢰 출처 목록 (웹 검증 완료 — approve-4 사람 승인 대기)

> 잠금자: 메인-서브 합의 — 자율 모드. 사람 승인 전까지 모든 출처는 잠정이며, 이 목록에 근거한 감각 설명의 `validation.strength`는 `weak`를 넘지 못한다.
>
> **웹 검증 (2026-06-11)**: 9건 전부 실재·서지 확인 완료. 발견된 귀속 오류 2건(STATES ARE LOCATIONS의 1980 오귀속 → lakoff-1993 신설, Langacker keep 미확인 → Talmy 재귀속)과 locator 정정은 콘텐츠에 반영됨. **사람 리뷰는 아래 표 + 콘텐츠 claim 표본 확인 후 승인만 하면 됩니다** (조사 불요).

## Tier 1 — 학술 (감각 설명의 *주장*은 T1 근거 필수)

| ID | 출처 | 쓰임 |
|---|---|---|
| `heine-1997` | Heine, B. (1997). *Possession: Cognitive Sources, Forces, and Grammaticalization*. Cambridge Studies in Linguistics 83. | 소유 술어의 8개 event schema (Location·Action·Goal 등 — **Action과 Goal은 별개 도식**: 능동 획득 vs 수령) |
| `langacker-1987` | Langacker, R. (1987/1991). *Foundations of Cognitive Grammar* I·II. Stanford UP. | have류 정적 관계(trajector/landmark — 확인됨). **keep 사례는 미확인 → 콘텐츠에서 Talmy로 재귀속 완료 (2026-06-11)** |
| `tyler-evans-2003` | Tyler, A. & Evans, V. (2003). *The Semantics of English Prepositions: Spatial Scenes, Embodied Meaning and Cognition*. Cambridge UP. | proto-scene — 수직축은 Ch.5, out 계열은 Ch.7 (전치사 전용 아님 — particle 포함 확인) |
| `lindner-1981` | Lindner, S. (1981). *A Lexico-Semantic Analysis of English Verb Particle Constructions with OUT and UP*. UCSD 박사논문 (원제 어순: OUT and UP). | up/out 불변화사 의미망 + VPC 합성/관용 구분 |
| `lakoff-johnson-1980` | Lakoff, G. & Johnson, M. (1980). *Metaphors We Live By*. U Chicago P. | 방위 은유 (MORE IS UP — Ch.4 실재 확인). **주의: STATES ARE LOCATIONS는 이 책에 없음 — lakoff-1993으로** |
| `lakoff-1993` | Lakoff, G. (1993). "The Contemporary Theory of Metaphor". In Ortony (ed.), *Metaphor and Thought* (2nd ed.). Cambridge UP. | Event Structure Metaphor (STATES ARE LOCATIONS, CHANGE IS MOTION) — get 상태 변화 감각의 정확한 출전 (검증에서 신설) |
| `talmy-2000` | Talmy, L. (2000). *Toward a Cognitive Semantics* (2권). MIT Press. | **권 분리 주의**: force dynamics(keep/let/make) = Vol.I Part4 Ch.7 (pp.409–470) / 위성틀 유형론 = Vol.II Part1 Ch.1 "Lexicalization Patterns" |

## Tier 2 — 사전·코퍼스 (예문의 *자연성*·용법 확인)

| ID | 출처 | 쓰임 |
|---|---|---|
| `oed` | Oxford English Dictionary (etymology·sense history) | 토박이/차용 층위 판별, 의미 이력 |
| `oald` | Oxford Advanced Learner's Dictionary | 학습자용 용법·예문 패턴 |
| `coca` | Corpus of Contemporary American English | 문장 자연성·빈도 확인 |

## 규칙

- 감각 설명의 핵심 주장 → T1 `source_refs` 필수. 예문 자연성 → T2로 확인.
- 출처 추가는 이 파일에 ID 등록 후에만 콘텐츠에서 참조 가능.
- T1 출처라도 "한국인 학습자용 한 줄"로 압축하는 순간 LLM 해석이 끼어든다 — 압축문이 출처 주장을 넘어서는지의 리뷰가 `validation` 게이트의 본 목적.
