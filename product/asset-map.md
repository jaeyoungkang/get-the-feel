# get-the-feel — Asset Map

첫 사이클 전 Asset Map Gate 산출물. 카테고리는 이 도메인의 발견 질문 — *"감각 체화 제품이 제대로 작동하려면 코드 외에 무엇이 함께 자라야 하는가?"* — 의 답이며, 다른 도메인 목록의 모방이 아니다. 다섯 trunk는 평행하게 자란다.

자산 평가의 공통 질문: **이 자산 갱신이 다음 후보의 약속 전달력을 올리는가?** (더 빨리가 아니라 더 효과적으로)

## 1. 제품 계약

- `asset_path`: `product/contract.md`
- `why_it_must_grow`: 약속과 전달 가치가 사이클마다 검증·반증으로 갱신되지 않으면 후보가 정체성에서 이탈한다 (약속 휘발 함정).
- `how_to_update`: 사이클 의도 잠금 시 "제품 계약 발전" 한 줄(추가/구체화/검증/반증) 명시 → 후보 종료 시 반영.
- `mechanical_or_review_gate`: Intent Guardian 모니터 + 사이클 시작 차단 규칙(계약 발전 명시 없으면 차단).
- `last_cycle_contribution`: c1-2 — V1 검증 완료(c1-1 반증 회수), Discovery 졸업선 충족.

## 2. 감각 콘텐츠 코퍼스 + 데이터 계약 (핵심 자산)

- `asset_path`: `assets/content/` (스키마 정본: `assets/content/CONTRACT.md`)
- `why_it_must_grow`: 이 도메인의 본체. 출처 묶인 감각 설명·훈련 문장 풀·전이 세트가 자라야 후보가 훈련 과정을 지탱할 두께를 갖는다. 후보는 버려져도 코퍼스는 남는다.
- `how_to_update`: LLM 생성 + 출처 근거 제약. 출처 없는 감각 설명은 승격 불가. 후보 종료 시 검증된 콘텐츠를 코퍼스로 회수.
- `mechanical_or_review_gate`: 데이터 계약 스키마 검사(출처 필드 필수) + 훈련/전이 분리 검사 — `tools/verdict/check.mjs`.
- `last_cycle_contribution`: c1-2 — up.json (수직/완료 sense 2, 문항 15, 라벨 필드 전수) + 증가 의미망 명시 배제.

## 3. 훈련 설계 규칙

- `asset_path`: `assets/training-design.md`
- `why_it_must_grow`: 퀴즈 형식·난이도 설계·전이 세트 분리 규칙이 자산화되지 않으면 매 후보가 훈련 설계를 처음부터 다시 발명한다.
- `how_to_update`: 후보의 퀴즈 정답률·전이 결과에서 배운 설계 교훈을 규칙으로 회수.
- `mechanical_or_review_gate`: 훈련/전이 중복 금지 기계 검사 + Asset Steward 모니터.
- `last_cycle_contribution`: c1-1 — R1~R8 신설 / c1-2 — R1·R2·R3·R4·R8 적용 검증 (페르소나 재검증으로 작동 확인).

## 4. UX 문법 (감각 전달 디자인)

- `asset_path`: `assets/ux-grammar.md`
- `why_it_must_grow`: "감각"은 텍스트 정의가 아니라 화면 경험으로 전달된다. 공간 메타포·이미지·인터랙션의 판단이 누적되지 않으면 후보마다 전달력이 리셋된다.
- `how_to_update`: 후보 종료 시 작동한/실패한 화면 표현을 규칙으로 회수.
- `mechanical_or_review_gate`: Intent Guardian + 페르소나 blind task 리뷰 (베이스 어휘 모르는 일반 학습자 가정).
- `last_cycle_contribution`: c1-2 — G1 확장(수직 화살표/한계선 그릇), G4>G3 우선순위 규칙, G5 적용 검증("학원 광고 냄새 빠졌다").

## 5. 검증 도구 (Mechanical Verdict)

- `asset_path`: `tools/verdict/check.mjs`
- `why_it_must_grow`: 자기보고가 아닌 산출물 사실로 판정하려면 검사 스크립트가 후보와 함께 자라야 한다. unknown은 승격 차단.
- `how_to_update`: 새 검증 공백이 발견될 때마다 검사 추가 — 단 같은 공백의 반복이 확인될 때만 (1회 특수 케이스는 승격 금지).
- `mechanical_or_review_gate`: 후보별 verdict 실행 결과를 `candidates/<id>/cycle-record.md`에 기록. 빈 출력·unknown은 fail.
- `last_cycle_contribution`: c1-2 — choice-shuffle·label-fields 검사 추가(교훈 회수 전 후보는 명시 분기), 후보별 콘텐츠 매핑, SVG 좌표 속성 오탐 제외.
- **알려진 한계**: label-fields 검사는 알려진 파싱 패턴의 부재만 증명한다(휴리스틱) — 본 보증은 명시 필드 사용의 양성 확인. 같은 공백이 한 번 더 확인되면 검사 보강 (1회는 기록만 — 위 how_to_update 규칙).

## 명시 거부 / 유예 (Refuse First)

- **도메인 스킬/플레이북**: 현재 없음. 같은 실행 지식이 후보 2회 이상 반복될 때 `skills/`로 회수 — 그때 `when_to_use`·`required_receipt`·`mechanical_enforcement` 필수. 선제 신설은 비대화로 거부.
- **엔지니어링 규약**: 초기 front-load 거부. 코드 규모·변경 빈도·운영 리스크 trigger 발생 시 `shared-skills/engineering-decision/SKILL.md` 경유로 단계 상승.
- **비즈니스·가격·판매 가능성**: Discovery 단계 유예. `local_ready`의 수요 검증 패키지(계약 참조)가 선행 산출물이며, 가격·판매 판단은 handoff 이후. 유예이지 삭제가 아님.
