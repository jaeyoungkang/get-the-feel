# c4-3 Cycle Record (append-only)

> 단계: C4 진화. 콘텐츠 확장 후보 — c4-2(대표·동결)의 검증된 앱을 계승하되 신규 동사 3개(be·go·come)를 노출. 기능 동일, 콘텐츠만 확장.

```text
Skill Load Receipt
- skill: shared-skills/product-spiral-orchestrator/SKILL.md
- loaded_at_step: cycle-start (c4-3)
- candidate_id: c4-3
- previous_candidate_disposition: c4-2 = promoted (대표 후보·배포, 동결·패치 금지)
- required_gates: Inheritance(검증된 앱 계승) / Candidate Completeness / Content-immutability / Mechanical Verdict(회귀 0) / jsdom Smoke / Stop Permission
- blocked_until: 신규 6 sense 메타포 잠금(기존 어휘 재사용·연장) — 진행
```

## 사이클 의도 잠금 (c4-3)

- **가설 (콘텐츠 확장)**: *"검증된 앱(c4-2)을 손대지 않고 신규 동사 3개(be·go·come, 각 2 sense)를 코퍼스에 더하면, 핵심 동사 축이 5→8로 넓어지며 deixis(go↔come)·계사(be) 같은 한국인 함정 감각까지 한 화면 메타포로 잡힌다."*
- **계승 (기능 동일)**: c4-2의 app.js·styles.css·index.html을 *출발점으로 계승*. 인식/산출 3단/통계/주제선택(이제 8동사 칩)·G11~G17 전부 그대로. 콘텐츠 확장이라 기능 변경 없음.
- **변경점**: ① data.js = 11파일 verbatim 임베드(window.CONTENT_ALL 11키). ② STORE_PREFIX `gtf-c4-3-` / PREV_PREFIX `gtf-c4-2-`(이전 기록 이어받기 — c2-3 패턴). ③ ITEM_ORDER에 be·go·come 추가. ④ 색·라벨·sense 맵에 be·go·come + 6 신규 sense 항목. ⑤ renderViz(svgForSense)에 신규 sense 6개 그림 추가(기존 어휘 G1/G7/G9/G16 재사용·연장).
- **신규 메타포 6종 (정체성=감각 그림)**:
  - `be-exist-locate`: 영역 원 없이 *그냥 그 자리에 존재/위치*한 칩(have의 도메인 원과 대비). 화살표 없음.
  - `be-state`: 상태 박스 안에 칩이 *정적으로 머묾*(get의 진입 화살표 없음).
  - `go-away`: 기준점(here)에서 *바깥으로 멀어지는* 화살표.
  - `go-become`: 정상 자리를 떠나 (흔히 나쁜) 상태로 옮겨가는 화살표.
  - `come-toward`: 기준점(here)으로 *다가오는* 화살표(go-away의 반대 방향).
  - `come-emerge`: 가려진 것이 드러나 나타남(out-reveal 어휘 연장하되 동사 주도).
  - 누락 sense는 안전한 기본 그림(svgHave)으로라도 렌더 — 절대 빈/에러 금지 (G10 교훈).
- **코드 도달 단위**: candidates/c4-3/ 독립 웹앱 — 위 변경점만, 이번 사이클 안.
- **콘텐츠·계약 수정 금지**: assets/content/*.json 과 CONTRACT.md 는 손대지 않는다. be·go·come 콘텐츠는 사이클 외부에서 이미 저작·검수된 자산을 verbatim 임베드만 한다.
- **n_of_N**: C4 3 of 3.

## 적대적 검수 (append-only · 빌드 후 검증 기록)

> 위 "사이클 의도 잠금" 본문은 동결(수정 금지). 이 섹션은 헤더 선언대로 *append-only* 빌드 후 검증 기록이다.

- **콘텐츠 변경 범위**: c4-3는 c4-2 코퍼스 8파일을 verbatim 재사용 + **신규 동사 3파일(be·go·come) 추가**. 신규 sense 6개. data.js는 `assets/content/*.json` 11파일과 의미적으로 동일(verdict `data-sync` PASS로 기계 확인).
- **검수 판정 (blocking)**: be·go·come 콘텐츠의 sense별 출처·정직성 적대적 검수(blocking 판정 포함)는 *콘텐츠 저작 사이클*에서 이미 통과한 자산을 계승한다 — c4-3는 그 자산을 코드에 임베드만 하고 콘텐츠를 저작·변경하지 않는다. 본 후보는 verdict `content-contract`(source_refs·sentence_ko·라벨 필드·문장 중복 0)로 11파일 전부를 기계 재검증했고, **blocking으로 막아야 할 콘텐츠 결함은 발견되지 않음**. 신규 콘텐츠의 의미적 정확성(예: go-become의 일탈성, come-toward의 deixis 함정)은 boundary_ko로 화면에 정직하게 노출된다.
- **메타포 정직성 검수 (신규 표면 6종)**: 신규 그림은 모두 기존 메타포 어휘(G1 정적 위치·G7 도달 화살표·G9 reveal·G16 상태 자리)를 *재사용·연장*해 통암기가 아닌 감각 도식으로 그렸다. 정체성(감각 그림) 유지. svgForSense의 default가 svgHave로 안전 렌더하므로 미등록 sense라도 빈/에러 화면이 나오지 않는다(G10).

## 평가 (c4-3, 2026-06-13)

### 기계 verdict + jsdom 스모크
- `node tools/verdict/check.mjs c4-3` → ALL PASS. 회귀: c4-2 CLOSED(닫힌 후보 — 마감 시점 PASS 정본) 확인, 신규 검사·매핑 변경 0.
- jsdom 스모크: 인식(기본·be/go/come 집중)·산출(빈칸·재배열·쓰기)·통계 화면 렌더. 신규 동사 문항 렌더 시 메타포 6종 에러 0, 런타임 예외 0.

### 자가 한계
- 신규 메타포 6종의 *첫 독해 가독성*은 N=0(실사용 검증 전) — 특히 go-become의 "정상→나쁜 상태" 2박스가 작은 화면에서 라벨 충돌 가능성. 실사용 검증 대상.
- be-state와 get-into-state 그림이 "상태 자리" 은유를 공유해, 변별(머묾 vs 진입)이 그림만으로 충분히 갈리는지는 boundary_ko 텍스트에 의존 — 페르소나 검증 필요.

## 실사용자 버그 검수·수리 (2026-06-13)

**신고(첫 실제 사용)**: "문제의 선택지가 문제와 전혀 관계없는 것들이 있다."
- 전 문항(173) 전수 검수: *완전 무관한 서술*은 0건. 진짜 원인 = **verb-choice 오답에 빈칸에 들어갈 수 없는 비문 동사**(There ___ a crack의 has/makes, make a cake의 does, you ___ sick의 have…) — 발문 "보기 모두 문법 가능"과 모순 + "못 들어가는 단어 = 무관한 선택지"로 체감.
- 수리 12건: 오답 교체 8(슬롯에 서는 감각 대비 동사로 — buys/fell/stayed/took/feel 등), sense-choice 전환 4(there-존재·방향부사라 대비 동사 없음 — be-t8/x5, come-t9, go-x4).
- 재발 방지: **R15**(verb-choice 오답 슬롯 문법 성립 의무) 신설 + content-consensus 검수 관점2에 "오답 슬롯 적합 + why_ko '비문' 자백=위반 신호" 추가.
- verdict ALL PASS, 재배포. **실사용자 검증이 페르소나·기계·검수 3중 게이트가 놓친 클래스를 또 잡음** — 실제 사용이 최강 검증 채널임을 재확인(정답 누설·해석·레이아웃에 이어 4번째).
