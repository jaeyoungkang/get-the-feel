# 신뢰 출처 목록 (잠정 — approve-4 미승인)

> 잠금자: 메인-서브 합의 — 자율 모드. 사람 승인 전까지 모든 출처는 잠정이며, 이 목록에 근거한 감각 설명의 `validation.strength`는 `weak`를 넘지 못한다.

## Tier 1 — 학술 (감각 설명의 *주장*은 T1 근거 필수)

| ID | 출처 | 쓰임 |
|---|---|---|
| `heine-1997` | Heine, B. (1997). *Possession: Cognitive Sources, Forces, and Grammaticalization*. Cambridge UP. | have류 소유 구문의 인지적 원천 (위치·영역 도식) |
| `langacker-1987` | Langacker, R. (1987/1991). *Foundations of Cognitive Grammar* I·II. Stanford UP. | 동사 의미의 도식(trajector/landmark), 정적 관계 감각 |
| `tyler-evans-2003` | Tyler, A. & Evans, V. (2003). *The Semantics of English Prepositions*. Cambridge UP. | 전치사·불변화사의 공간 감각(proto-scene) |
| `lindner-1981` | Lindner, S. (1981). *A Lexico-Semantic Analysis of English Verb Particle Constructions with OUT and UP*. UCSD 박사논문. | up/out 불변화사 의미망 |
| `lakoff-johnson-1980` | Lakoff, G. & Johnson, M. (1980). *Metaphors We Live By*. U Chicago P. | 공간 은유의 체계성 |
| `talmy-2000` | Talmy, L. (2000). *Toward a Cognitive Semantics*. MIT Press. | 위성틀(satellite-framed) 언어로서의 영어 — 게르만 층위의 유형론 근거 |

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
