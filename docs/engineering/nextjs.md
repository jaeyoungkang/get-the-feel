# Next.js 스택 — 에이전트 운영 원칙

> 전체 맥락은 `principles.md` 참조. 이 문서는 Next.js(App Router) 기반 프로젝트에 **추가로 적용되는** 원칙만 담는다.

## 공식 문서 우선 (ALWAYS)

에이전트의 학습 데이터는 낡았다. Next.js 동작을 만질 때는 반드시 **현재 설치된 버전의 공식 문서를 먼저 읽는다**.

```
node_modules/next/dist/docs/
```

이 경로가 로컬에 있다면 거기가 source of truth. 없다면 공식 사이트에서 **설치된 major.minor 버전**을 명시해 검색.

이유: Next.js는 버전마다 App Router / Pages Router / RSC / Server Actions / 캐시 모델이 바뀌어 왔다. 에이전트의 기본 지식이 오답을 생성하는 대표 영역.

## App Router 기본 규칙

### Server Component가 디폴트

- `"use client"`는 **상호작용, 브라우저 API, 로컬 상태**가 필요한 곳에만
- 이유 없이 `"use client"`를 붙이지 않는다. 클라이언트 번들 증가 + 하이드레이션 비용
- Server Component는 async 허용. Client Component는 async 금지

### 경계 규칙

| 주제 | 규칙 |
|---|---|
| Server → Client props | 직렬화 가능한 값만 (함수·Date 객체·Map·Set 금지) |
| Route Handler 위치 | `app/**/route.ts` — 같은 세그먼트의 `page.tsx`와 공존 금지 |
| 데이터 페칭 | RSC에서 fetch/ORM 직접 호출이 기본. 상태가 필요하면 Client로 내려 SWR/React Query |
| 환경 변수 | `NEXT_PUBLIC_*`만 클라이언트 노출. 나머지는 서버 전용 |

### 파일 규칙

- `layout.tsx` / `page.tsx` / `route.ts` / `loading.tsx` / `error.tsx` / `not-found.tsx` / `template.tsx` — App Router 예약 파일명. 이름을 지키면 Next.js가 자동 배선.
- Route groups: `(name)/` 폴더는 URL에 포함되지 않음. 섹션별 레이아웃 분리에 사용.

## TypeScript 설정

- `strict: true` 필수
- 경로별칭 `@/*` → 저장소 루트 (`tsconfig.json`의 `paths`)
- `noEmit: true` — `tsc --noEmit`로 타입만 검증 (빌드는 Next.js가 담당)
- `next typegen` 또는 자동 생성된 `.next/types/` 를 typecheck에 포함

## 스타일 시스템

- **Tailwind CSS 4** + PostCSS 권장
- `app/globals.css`에 `@import "tailwindcss";` + 디자인 토큰 정의
- `@custom-variant dark (&:where(.dark, .dark *));` 같은 v4 문법 사용
- CSS Modules는 쓰지 않음 (혼재 금지)
- Prettier 플러그인 `prettier-plugin-tailwindcss`로 클래스 자동 정렬

## 빌드·배포

- **SSG 우선** 콘텐츠가 주기적 배치면 빌드 시점 정적 생성
- 동적 데이터는 **ISR 또는 Route Handler**로 분리
- Vercel 배포가 기본 — 다른 호스팅이면 Next.js 버전과 Node 버전을 배포 플랫폼 문서로 확인

## 검증 명령 세트

| 명령 | 역할 |
|---|---|
| `npm run lint` | ESLint (Next.js 플러그인 포함) |
| `npm run typecheck` | `next typegen && tsc --noEmit -p tsconfig.typecheck.json` |
| `npm run test` | Vitest (jsdom) |
| `npm run test:coverage` | 커버리지 포함 |
| `npm run build` | Next.js 빌드 (타입 + 정적 분석 포함) |

빌드 실패는 타입 에러만이 아니다. 페이지의 RSC/Client 혼용 위반, 환경 변수 누락, use client 위치 오류 등이 모두 빌드 시점에 드러난다. CI 체인에 **build를 반드시 포함**한다.

## `next.config.ts` 주의점

- `serverExternalPackages`: 서버 전용 native dep (예: pdf-parse). 클라이언트 번들에 포함되면 빌드 실패.
- `rewrites`/`redirects`: 외부 프록시·리다이렉트. 설정이 SEO·분석과 상호작용.
- `skipTrailingSlashRedirect`: URL 정책. 팀에서 명시 합의 후 변경.

## 에이전트가 만드는 Next.js 코드의 흔한 오류

1. **`"use client"` 과다 선언** — Server Component면 될 것을 Client로 올림
2. **RSC에서 클라이언트 전용 API 사용** — `useState`/`useEffect`를 Server Component에 넣음 → 빌드 실패
3. **직렬화 불가능한 props 전달** — Server→Client에 함수·클래스 인스턴스
4. **환경 변수 노출 실수** — 서버 전용 키를 Client에서 `process.env.X`로 접근
5. **Route Handler와 page.tsx 혼재** — 같은 세그먼트에 둘 다 두고 의도대로 동작하지 않음
6. **Hydration mismatch** — Server에서 렌더한 HTML과 Client 초기 렌더가 다름 (Date, Math.random, 브라우저 API)

위 6개는 **빌드 또는 런타임 에러**로 드러나므로 `npm run build` 를 CI에 포함하면 방어된다.

## 참고 레퍼런스

- `principles.md` — 진입점
- `boundaries.md` — 탈출구 차단 공통 규칙
- `quality-gates.md` — 검증 체인 · mc CLI · 커버리지 기준선
- Next.js 공식: `node_modules/next/dist/docs/` (설치된 버전)
