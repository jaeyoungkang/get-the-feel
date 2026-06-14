# get-the-feel — Product Contract

> 현재 정본: Story Chain. 이 문서는 `docs/contracts/story-chain/`을 읽기 쉽게
> 요약한 제품 계약이다.

## Primary Promise

한국인 영어 학습자가 영어의 게르만 토박이 층위 감각을 문장 안에서 보고,
해설과 퀴즈와 제한된 산출로 같은 감각을 다시 연습하게 한다.

토박이 층위 감각은 have, get, take, make, keep, be, go, come 같은 기본
동사와 up, out 같은 불변화사, 그리고 그 결합인 구동사가 그리는 위치·방향·
상태·힘의 그림을 뜻한다. 독일어가 아니라 영어의 앵글로색슨 토박이
층위를 말한다.

## Target User

- 한국인 영어 학습자.
- 라틴계 차용어(receive, obtain, acquire)는 사전 뜻으로 이해하지만,
  get, have, up, out 같은 일상 영어의 기본 단어가 문장 안에서 왜 그렇게
  쓰이는지 감각으로 잡지 못하는 사용자.
- 첫 검증 사용자는 저자 본인이지만, 수요 판정은 반드시 본인 외 target user
  3~5명의 blind task로 본다.

## Product Shape

현재 제품은 두 진입을 가진다.

1. **훈련 세션** — 제품이 제공하는 문장을 풀며 감각을 고르고, 정답 후
   한국어 해석·감각 그림·경계 설명을 본다.
2. **문장 해설 → 연습** — 사용자가 영어 문장을 넣으면 현재 코퍼스가
   보증하는 target word를 탐지하고, 해당 감각 해설과 같은 감각의 퀴즈로
   연결한다.

현재 Story Chain promises:

| Promise | 사용자가 기대하는 것 | 정본 |
| --- | --- | --- |
| `promise:sense-training-surface` | 문장 단위 감각 훈련을 바로 시작한다 | `docs/contracts/story-chain/promises/sense-training-surface.md` |
| `promise:sentence-explanation-to-practice` | 가져온 문장을 감각 해설과 연습으로 연결한다 | `docs/contracts/story-chain/promises/sentence-explanation-to-practice.md` |
| `promise:constrained-production` | 알아본 감각을 제한된 쓰기로 꺼내 본다 | `docs/contracts/story-chain/promises/constrained-production.md` |
| `promise:weakness-guided-focus` | 약한 감각을 보고 같은 감각을 집중 연습한다 | `docs/contracts/story-chain/promises/weakness-guided-focus.md` |

## Four Axes

제품 정체성은 네 축으로 유지한다.

1. 핵심 동사 감각: have, get, take, make, keep, be, go, come.
2. 불변화사·전치사 감각: 현재 up, out. 다음 확장 대상은 down/off/in.
3. 구동사 감각: 현재 V+up. 동사 감각과 불변화사 감각의 합성으로 설명한다.
4. 어순·구문 감각: 아직 제품 정체성의 빈 칸이다. 새 기능으로 다룰 때는
   별도 Story Chain promise와 콘텐츠 계약이 필요하다.

## Refuse First

- 게이미피케이션 중심 제품으로 만들지 않는다. 점수·스트릭·배지는 감각
  체화를 보조할 때만 허용된다.
- 범용 영어 학습 앱으로 넓히지 않는다. 회화, 리스닝, 시험 대비, 문법 교정
  전체는 현재 scope가 아니다.
- 출처 없는 감각 설명을 훈련하거나 해설하지 않는다.
- weak sense를 사람 승인 없이 strong으로 올리지 않는다.
- 선택형 정답률, 본인 사용 기록, 페르소나 평가는 demand나 학습 효과 증거로
  승격하지 않는다.
- 말하기 실력 향상을 주장하지 않는다. 현재 산출은 쓰기 중심이다.

## Content Contract

LLM이 문장·퀴즈 초안을 만들 수는 있다. 그러나 sense 설명은 신뢰 출처와
검수 상태에 묶인다. 정본 스키마는 `assets/content/CONTRACT.md`다.

필수 원칙:

- 각 sense는 `source_refs`와 `validation`을 가진다.
- training item과 transfer item은 분리된다.
- 정답 전 한국어 해석과 감각 단서가 노출되지 않는다.
- 보기 오답은 비문이 아니라 가까운 오개념이어야 한다.
- 콘텐츠 변경은 `skills/content-consensus/SKILL.md`를 거친다.

## Design Contract

디자인은 별도 장식이 아니라 제품 약속의 일부다. 감각 그림, 카드형 진행,
피드백 위계, 색 분리, 모바일 우선 흐름은 현재 트레이너 디자인 기준선으로
보존한다. 정본과 변경 절차는 `docs/design-assets.md`다.

필수 원칙:

- 기존 배포판 트레이너 화면은 React parity 전까지 현재 디자인 기준선이다.
- SVG 감각 그림과 보강 그림은 기능과 같은 수준의 자산으로 관리한다.
- 새 화면은 기존 화면보다 낫다는 parity evidence 없이 기준선을 대체하지 않는다.

## Evidence And Claims

현재 release 판단은 `docs/contracts/story-chain/evidence-ledgers/current-build.ledger.md`
와 `npm run quality:check`가 닫는다.

| Claim | 현재 상태 |
| --- | --- |
| 현재 제품 표면이 동작한다 | `npm run quality:check`로 검증 |
| GitHub Pages 배포 경로가 맞다 | `npm run pages:check`로 검증 |
| 코퍼스가 데이터 계약을 지킨다 | `npm run content:check`로 검증 (`public/legacy/c4-3/data.js` 동등성 포함) |
| 문장 해설이 코퍼스 기반으로 연습에 연결된다 | `/explain` route, `src/content/explanation-index.ts`, `npm run ui:check`로 검증 |
| 수요가 있다 | 아직 `demand_unknown` |
| 학습 효과가 있다 | 아직 미검증. 현재 지표는 근사 evidence |
| 말하기에 도움된다 | 미검증. claim 금지 |

## Next Product Decisions

1. `demand-1`: 실제 target user 3~5명 blind task.
2. `word-order`: 4축 정체성의 빈 칸인 어순·구문 감각.
3. `particles`: down/off/in 및 해당 구동사 확장.
4. `source-review`: weak sense의 사람 출처 리뷰.

새 결정은 `product/contract.md`에 직접 쌓기보다, Story Chain의 Experience,
Moment, Promise, Aspect, Evidence Ledger로 먼저 반영한다.
