# get-the-feel

**한국인 영어 학습자가 영어의 게르만 토박이 층위 감각을 문장·퀴즈로 체화하는 트레이닝 웹 앱.**

영어 어휘에는 두 층이 있다 — 게르만 토박이 층(have, get, take, up, out, off…)과 라틴/로망스 차용 층(receive, obtain, acquire…). 한국인 학습자에게 라틴계 어휘는 사전 정의로 붙지만, 일상 영어의 뼈대인 토박이 동사·불변화사는 "정의"가 아니라 "감각"으로 작동해서 생소하다. 이 제품은 그 감각을 훈련시킨다.

이름의 유래: **get**(핵심 동사) + **feel**(게르만 토박이어) — 이름 자체가 제품이 가르치는 감각의 시연. "감을 잡다."

## 진입

- `AGENTS.md` — 에이전트 navigation + Harness Case
- `product/contract.md` — 제품 계약 정본
- `product/asset-map.md` — 자산 지도
- `product/project-elevation-plan.md` — 프로토타입 정리 + 정식 프로젝트 고도화 계획
- `docs/project-structure.md` — 본격 제품 개발용 코드/문서 구조
- `docs/contracts/story-chain/` — 정식 제품 경험·약속·측면·증거 ledger
- `docs/verification-gates.md` — 주요 검증장치 체계
- `docs/agent-skills.md` — 설치된 agent skill suite 안내
- `fix_plan.md` — 작업 큐

product-weaver 도메인 인스턴스에서 출발했으며, 현재는 lighthouse/agentic-base 계열 Story Chain·Mission Control·engineering assurance 프로세스를 갖춘 제품 프로젝트다. 베이스 원칙은 `docs/principles.md`, 실행 스킬 source는 `shared-skills/`, 생성된 agent skill target은 `.agents/skills/`와 `.claude/skills/`.

## 상태

2026-06-14: C1→C2→C3(local_ready)→C4 진화. 대표 후보 **c4-3** 배포 라이브 https://jaeyoung2026.github.io/get-the-feel/ — 11파일 24 sense 173문항(핵심동사 8·불변화사 2·구동사), 인식+산출 모드. 사용자 피드백 4건 반영. 정식 프로젝트 승급 계획은 `product/project-elevation-plan.md`.

제품 개발 기준선은 Next.js App Router shell + typed `src/content/` + `public/legacy/c4-3/` 호환 표면이다. 프로토타입 후보는 `candidates/`에 보존하고, 새 제품 개발은 Story Chain 계약을 따라 `app/`·`src/`에서 진행한다.

## 검증

```bash
npm run quality:check       # app/build + prototype verdict + Story Chain/contract gates
npm run quality:contracts   # skill sync + project knowledge + contract maps + mission-control
npm run skills:sync         # shared-skills -> .agents/.claude 동기화
```
