---
name: content-consensus
description: 감각 콘텐츠(sense·문항)를 생성할 때 생성자-검수자-수정자 3자 합의를 강제하는 도메인 스킬. 5사이클 연속 운영에서 blocking 12건을 commit 전 적발한 절차의 정본화 (retro-1 승격, 2026-06-11).
when_to_use: assets/content/ 에 sense 또는 문항을 신규 작성·변경할 때 — 예외 없음. 라벨·해석 등 비의미 필드만 추가하는 백필은 표본 검수로 축소 가능.
required_receipt: 해당 후보 cycle-record에 "콘텐츠 합의 기록" 섹션 — 생성·검수(blocking 판정 포함)·수정 3자 + 기각된 의심 명시.
mechanical_enforcement: tools/verdict/check.mjs `adversarial-review` 검사 — cycle-record에 적대적 검수 기록(blocking 판정 포함) 없으면 후보 탑재 차단.
---

# Goal

"출처 붙은 오개념"과 "정답 유일성 붕괴"는 기계 검사가 못 잡는다 (형식은 맞고 내용이 틀림). 이 스킬은 생성과 검증의 **권한 분리**로 그 클래스를 차단한다.

# Workflow

1. **생성자** (독립 컨텍스트): CONTRACT.md 규칙 전부 + training-design R규칙 준수해 콘텐츠 작성. 자기 점검 보고 필수 — 단 자기보고는 신뢰하지 않는다.
2. **검수자** (생성자와 독립, 반증이 임무): 아래 5관점 체크리스트로 전수 검수. [blocking / minor / 기각된 의심] 분류 + blocking 수정안.
3. **수정자** (제3자 또는 메인): 검수 수정안을 **새 해석 추가 없이** 적용. verdict 재실행.

# 검수 5관점 (운영 12건에서 도출 — 각 관점에 실제 적발 사례)

1. **출처-주장 정합 (R5)**: claim이 출처의 실제 주장 범위 안인가. **원전에 없는 라벨 조어 귀속 검사** (적발: "KNOWING/VISIBLE IS OUT", "HIGH STATUS-COMPLETION"). 정적 출처에 동적 그림 얹기 검사 (적발: 영역-위치 도식에 "통과", STATES ARE LOCATIONS 방향 역전).
2. **정답 유일성 + 오답 슬롯 적합 (R15)**: 오답이 문법·화용적으로 정답이 되는 곳 — **영어 관용 동등 표현 검사** (적발: Can I have a glass, have a seat, was dark, have the idea). **그리고 그 역도**: verb-choice 오답이 빈칸에 *문법적으로 들어가지도 못하는 비문*이면 안 된다 (적발: There has a crack, make a cake의 does, have sick — 실사용자 "선택지가 문제와 무관" 신고). 전 보기가 슬롯 문법 성립 + 감각만 갈려야. why_ko에 "비문" 자백 = 위반 신호. **그리고 오답이 그 문항의 동사가 아닌 *다른 동사*를 명명하면 안 된다**(적발: get up 오답에 "마시다"(drink) 복붙 — compose 오답은 *같은 verb_label 유지 + 틀린 입자감각*이어야). 각 오답·해설의 동사명을 verb_label과 1:1 대조.
3. **오개념 위험**: 이 설명을 체화한 학습자가 틀린 영어를 만드는 경로 (적발: 진행형 경계 소실, 합성 과신 — give up은 반례로도 부적합). assets/misconceptions.md 대조.
4. **전이 패턴 거리 (R4)**: 전이가 훈련의 어휘 치환·구동사 재탕이 아닌가 (적발: quick chat→long talk, climb up 재탕).
5. **기계 재검증**: 생성자 자기보고 불신 — 중복·분포·라벨·카운트를 독립 스크립트로 재계산.

# Boundaries

- **Never**: 검수 없이 콘텐츠 commit / 검수자가 직접 파일 수정(권한 분리) / blocking 미회수 상태로 후보 탑재
- **Always**: 기각된 의심도 기록 (미래 재식별 자료) / 수정 후 verdict 재실행 / receipt를 cycle-record에
