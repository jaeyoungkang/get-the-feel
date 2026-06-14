# Design Assets

디자인도 제품 자산이다. get-the-feel의 차별점은 콘텐츠 설명만이 아니라
감각을 그림으로 느끼게 하는 화면 문법, 카드 리듬, 색, 버튼 위치, 피드백
위계, SVG 메타포까지 포함한다. 따라서 디자인은 임시 UI가 아니라 유지관리
대상 정본으로 다룬다.

## Current Design Baseline

현재 기준선은 배포판 트레이너 화면이다.

| Asset | Current file |
| --- | --- |
| Trainer screen | `public/legacy/c4-3/index.html` |
| Trainer behavior | `public/legacy/c4-3/app.js` |
| Trainer data embed | `public/legacy/c4-3/data.js` |
| Visual style and SVG grammar | `public/legacy/c4-3/styles.css` |
| React explanation visual reuse | `app/sense-visual.tsx` |
| Design rules | `assets/ux-grammar.md`, `assets/training-design.md` |

`legacy` 경로명은 과거 산출물에서 온 이름일 뿐, 현재 디자인 기준선의 지위를
낮추지 않는다. 이 자산은 새 React 구현이 완전한 parity를 얻기 전까지 현재
제품 표면의 기준이다.

Story Chain에서는 이 규칙을 `aspect:design-baseline-preservation`으로 관리한다.

## What Must Be Preserved

- 따뜻한 종이색 배경, 흰 카드, 720px 안팎의 모바일 우선 단일 컬럼.
- 파란색 인식 모드와 보라색 산출 모드의 분리.
- 첫 화면에서 바로 학습 행동이 보이는 카드형 시작 경험.
- 정답 후에만 한국어 해석, item label, sense label, 감각 그림이 나오는 단서 차단.
- `svgHave`, `svgGet`, `svgTake`, `svgMake`, `svgKeep`, `svgBe*`, `svgGo*`, `svgCome*`, `svgUp*`, `svgOut*` 계열의 기존 SVG 메타포.
- `keep ↔ have`, `get + pp ↔ be`, 구동사 합성, 관용 자물쇠 같은 보강 그림.
- 피드백에서 그림이 먼저 보이고, 긴 해설은 접히는 정보 위계.

## Change Protocol

디자인 변경은 기능 변경과 같은 수준으로 관리한다.

1. 변경 전에 기존 기준선에서 무엇을 유지·변경·폐기하는지 적는다.
2. `assets/ux-grammar.md` 또는 `assets/training-design.md`의 규칙을 먼저 갱신한다.
3. 화면 변경은 Story Chain acceptance check나 evidence ledger에 연결한다.
4. 기존 디자인 자산을 대체할 때는 같은 sense, 같은 문항, 같은 모바일 폭에서 parity를 확인한다.
5. parity 없는 React 재작성은 금지한다. 새 구현은 기존 화면을 이긴다는 증거가 있을 때만 기준선이 된다.

## Parity Checklist

새 화면이 기존 디자인 자산을 대체하려면 최소한 아래를 통과해야 한다.

- 첫 화면이 기존 배포판과 같은 학습 시작점을 제공한다.
- 정답 전 단서가 새지 않는다.
- 정답 후 SVG 그림, 한국어 해석, why, boundary가 기존 정보 위계를 따른다.
- keep/get+pp/compose/opaque 보강 그림이 빠지지 않는다.
- 모바일 폭에서 버튼, 카드, SVG 라벨이 겹치지 않는다.
- `npm run quality:check`가 통과한다.

## Evolution Path

- 단기: `/`는 기존 트레이너 디자인 자산을 그대로 사용한다.
- 중기: `/explain` 같은 새 React 표면은 기존 SVG 메타포와 스타일 문법을 재사용한다.
- 장기: React trainer가 기존 화면을 기능·디자인·검증 면에서 모두 대체할 때만
  기준선을 `app/` 구현으로 승격한다.
