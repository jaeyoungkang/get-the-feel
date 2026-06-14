# get-the-feel

**한국인 영어 학습자가 영어의 게르만 토박이 층위 감각을 문장·해설·퀴즈·산출로 체화하는 트레이닝 웹 앱.**

영어 어휘에는 두 층이 있다. have, get, take, up, out 같은 토박이 층은 일상 영어의 뼈대이고, receive, obtain, acquire 같은 라틴/로망스 차용 층은 사전 정의로 붙기 쉽다. 한국인 학습자는 토박이 층을 한국어 뜻으로 바꾸다가 영어 문장이 그리는 위치·방향·상태·힘의 감각을 놓친다. get-the-feel은 그 감각을 문장 안에서 알아보고, 같은 감각을 새 문장과 제한된 산출로 다시 확인하게 한다.

## 진입

- `AGENTS.md` — 에이전트 운영 지침
- `docs/contracts/story-chain/` — 제품 경험·순간·약속·측면·증거 원장
- `docs/contracts/feature-specs.md` — Acceptance Check 인덱스
- `docs/project-structure.md` — 코드/문서 구조
- `product/` — Story Chain 기반 제품 계약 요약과 수요 검증 계획
- `assets/` — 콘텐츠·훈련·UX 정본
- `fix_plan.md` — 작업 큐

현재 저장소는 Story Chain + Mission Control 기반의 정식 제품 프로젝트다. 새 제품 개발은 Story Chain 계약을 따른다.

## 상태

2026-06-14 기준:

- 배포: https://jaeyoung2026.github.io/get-the-feel/
- 앱: Next.js App Router shell
- 제품 표면: `/` 기존 트레이너 디자인 기준선, `/explain` 문장 해설→연습
- 코퍼스: 11파일, 24 sense, 173문항
- Story Chain: `npm run mc:status` release ready

## 검증

```bash
npm run quality:check
npm run pages:check
npm run ui:check
npm run content:check
npm run quality:contracts
npm run mc:status
```
