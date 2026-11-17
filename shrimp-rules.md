# Development Guidelines (AI Agent 전용)

> 이 문서는 AI 에이전트가 이 저장소에서 작업할 때 따르는 프로젝트 고유 규칙이다. 일반 개발 지식은 적지 않는다.
> 작업 전 `AGENTS.md`(Next.js 16 주의 문구)와 `CLAUDE.md`(PRD, ROADMAP 참조)도 함께 확인한다.

## 1. 프로젝트 개요

- 이름: `claude-nextjs-starterkit` (package.json), 사이트 이름은 `config/site.ts`의 `siteConfig.name`.
- 스택: Next.js 16.4.2 (App Router, `cacheComponents: true`), React 19.3.0, TypeScript(strict), Tailwind CSS 4, shadcn/ui (`base-nova` 스타일, `@base-ui/react` 기반), next-themes, lucide-react, sonner.
- 현재 상태: 스타터킷 상태. 예제 페이지(`/`, `/about`, `/contact`)와 헤더·푸터 레이아웃이 있다.
- 장기 목표: `docs/PRD.md`, `docs/ROADMAP.md` 기준의 Notion CMS 기반 음식점 리뷰 블로그. 해당 기능을 구현할 때만 두 문서를 읽는다.

## 2. 프로젝트 구조

```
app/
  layout.tsx          루트 레이아웃 (lang="ko", ThemeProvider, SiteHeader, SiteFooter, Toaster)
  page.tsx            홈 예제
  about/page.tsx      소개 페이지
  contact/page.tsx    문의 페이지 (ContactForm 사용)
  loading.tsx         전역 로딩 스켈레톤
  not-found.tsx       404
  globals.css         Tailwind 4 + shadcn 테마 변수 (:root / .dark)
components/
  ui/                 shadcn/ui 원본 컴포넌트 (CLI 생성물)
  layout/             site-header, site-footer, nav-links, mobile-nav
  theme-provider.tsx, theme-toggle.tsx
  contact-form.tsx    클라이언트 컴포넌트 ("use client")
config/site.ts        사이트 이름, 설명, nav 배열 (NavItem 타입)
lib/utils.ts          cn 유틸 (cn 패키지 재export)
docs/                 PRD.md, ROADMAP.md
.claude/              에이전트 설정, 커맨드(new-page, git:commit), 리뷰 에이전트
```

- `@/*` 경로 alias는 저장소 루트를 가리킨다 (`@/components/ui/button`, `@/config/site`).
- `components/layout/`에는 `app/` 페이지에서 쓰는 레이아웃 조각만 둔다.
- 존재하지 않는 경로를 만들지 말고 위 구조에 맞춘다. `app/components/`는 없다. shadcn 컴포넌트는 `components/ui/`에 둔다.

## 3. 필수 선행 작업

- **Next.js 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 관련 가이드를 먼저 읽는다.** 학습 데이터의 Next.js API를 그대로 믿지 않는다.
- Next.js 파일 규칙(`page`, `layout`, `loading`, `not-found`, `error`, `generateMetadata` 등)과 API는 이 버전 기준으로 확인한다.
- deprecation 경고를 무시하지 않는다.

## 4. 코드 표준

- 들여쓰기: **2칸** (전역 규칙).
- 변수명, 함수명, 타입명: 영어. 주석: **한국어**. 커밋 메시지: 한국어.
- **`any` 타입 사용 금지.** 불명확하면 `unknown` 후 좁히거나 명시 타입을 쓴다. `as any`, `// @ts-ignore`도 금지.
- 스타일: **Tailwind CSS 클래스만 사용.** 인라인 `style` 속성과 CSS 모듈을 새로 만들지 않는다. 색상은 `globals.css`의 토큰(`bg-background`, `text-foreground`, `bg-primary` 등)을 사용하고 하드코딩 색상을 피한다.
- **반응형 필수.** 모든 UI는 모바일 우선으로 작성하고 `sm:`, `md:`, `lg:` 브레이크포인트로 확장한다. 360px 너비에서 가로 스크롤이 생기면 안 된다.
  - 올바른 예: `className="flex flex-col gap-4 md:flex-row"`
  - 잘못된 예: `className="flex flex-row"` (모바일 분기 없이 고정 가로 배치), `w-[800px]` 고정 폭
- 레이아웃 최대 폭은 기존 패턴 `mx-auto w-full max-w-6xl px-4 sm:px-6`을 따른다.
- 이미지와 아이콘: 아이콘은 `lucide-react`만 사용한다. 이미지는 `alt`를 반드시 제공한다.
- 라우트 파일은 default export 함수로 작성한다. 기존 `app/about/page.tsx`의 제목·여백 패턴을 따른다.
- 클라이언트 상태나 이벤트 핸들러가 필요한 컴포넌트에만 `"use client"`를 붙인다. 서버 전용 코드는 클라이언트 컴포넌트에서 import하지 않는다.

## 5. 기능 추가·수정 규칙

### 5.1 새 페이지 추가
1. `node_modules/next/dist/docs/`에서 App Router 가이드를 확인한다 (§3).
2. `app/<경로>/page.tsx`를 만든다. 경로 세그먼트는 소문자 kebab-case.
3. 페이지별 메타데이터가 필요하면 `export const metadata` 또는 `generateMetadata`를 사용한다.
4. 내비게이션에 노출할 페이지면 `config/site.ts`의 `siteConfig.nav`에 항목을 추가한다 (**함께 수정**: 헤더 메뉴와 모바일 메뉴가 같은 배열을 쓴다 — `nav-links.tsx`, `mobile-nav.tsx`에서 읽는지 먼저 확인).
5. 로딩이 필요하면 해당 폴더에 `loading.tsx`, 잘못된 경로 처리는 `not-found.tsx`를 둔다. `error.tsx`는 실제로 필요할 때만 만든다.

### 5.2 shadcn/ui 컴포넌트 추가
- 명령: `npx shadcn@latest add <name>`. 생성 위치는 `components/ui/`다.
- `components/ui/*.tsx`는 CLI 생성물이다. 기능 변경이 필요하면 직접 수정할 수 있지만, 가능하면 래퍼 컴포넌트를 `components/`에 새로 만든다.
- 새 컴포넌트 추가 시 `components.json`의 `style: base-nova`, `iconLibrary: lucide`를 유지한다.

### 5.3 테마 변경
- 색상 변경은 `app/globals.css`의 `:root`와 `.dark` 변수에서만 한다. 컴포넌트 안에 색상 값을 직접 넣지 않는다.
- 테마 토글과 Provider는 `theme-toggle.tsx`, `theme-provider.tsx`를 통해서만 다룬다. `attribute="class"`, `defaultTheme="system"` 설정을 바꾸지 않는다.

### 5.4 사이트 정보 변경
- 사이트 이름, 설명, 메뉴는 `config/site.ts`에서만 바꾼다. 헤더·푸터·`layout.tsx`의 metadata에 문자열을 중복하지 않는다.

### 5.5 폼
- 현재 폼은 `components/contact-form.tsx`(클라이언트)이다. 입력 검증과 결과 표시는 `sonner` 토스트(`@/components/ui/sonner`의 `Toaster`는 이미 `layout.tsx`에 있다)를 사용한다.
- 실제 서버 전송 로직을 추가할 때는 Server Action 또는 Route Handler를 사용하고, 클라이언트에 비밀 값을 넣지 않는다.

## 6. 함께 수정해야 하는 파일 (다중 파일 조정)

| 변경 | 같이 확인·수정할 파일 |
| --- | --- |
| 페이지 추가 | `app/<경로>/page.tsx`, 필요 시 `config/site.ts`(nav), `README.md` 폴더 구조 |
| nav 항목 추가·삭제 | `config/site.ts`, `components/layout/nav-links.tsx`, `components/layout/mobile-nav.tsx` 동작 확인 |
| 사이트 이름·설명 변경 | `config/site.ts` 하나로 끝낸다. 다른 파일에 하드코딩된 문자열이 있으면 `siteConfig`로 교체 |
| shadcn 컴포넌트 추가 | `components/ui/<name>.tsx` 생성 확인, `components.json` 변경하지 않음 |
| 색상 테마 수정 | `app/globals.css` (라이트/다크 변수 쌍 모두) |
| 의존성 추가 | `package.json`과 `package-lock.json`을 함께 커밋. 수동 편집 금지 (`npm install <pkg>`로 설치) |
| 폴더 구조 변경 | `README.md`의 "폴더 구조" 섹션 갱신 |
| 프로젝트 목표가 바뀐 경우 | `docs/PRD.md`, `docs/ROADMAP.md`의 체크박스·상태 표 갱신 (해당 작업 완료 시) |

## 7. 환경변수와 보안

- `.env*`는 `.gitignore`에 있다. 환경 파일을 커밋하거나 `.env.example` 외의 실제 값을 파일에 적지 않는다.
- Notion 전용 값(`NOTION_API_KEY`, `NOTION_DATABASE_ID`)을 쓰려면 **서버 코드에서만** 읽는다 (`process.env.X`). `"use client"` 파일과 `NEXT_PUBLIC_` 접두사에 넣지 않는다.
- 사용자 입력을 HTML로 렌더링할 때 `dangerouslySetInnerHTML`을 쓰지 않는다.

## 8. 검증 절차

작업을 끝내기 전에 아래를 실행하고 결과를 보고한다.

1. `npx tsc --noEmit` — 타입 오류 0건
2. `npm run lint` — ESLint 오류 0건
3. 레이아웃을 바꿨다면 `npm run build` (실패 시 원인과 로그를 보고, 성공을 가정하지 않는다)

- 명령이 실패하면 "통과했다"고 쓰지 않는다. 실패 출력을 그대로 보고한다.
- 빌드 산출물(`.next/`, `next-env.d.ts`)은 커밋하지 않는다 (`.gitignore`에 있음).

## 9. 의사결정 기준

| 상황 | 행동 |
| --- | --- |
| Next.js API가 기억과 다름 | `node_modules/next/dist/docs/` 확인을 우선한다. 추측으로 작성하지 않는다. |
| 요청이 모호함 (예: "페이지 만들어줘") | 경로와 설명이 있으면 진행한다. 경로가 없으면 가장 짧은 의미의 경로(`app/<이름>/page.tsx`)를 제안하고 근거를 밝힌다. |
| 스타일 선택지가 여럿 | 기존 컴포넌트(`components/ui/`)와 기존 페이지 패턴을 따른다. |
| 새 라이브러리 필요 | 기존 의존성(shadcn, lucide, sonner, next-themes)으로 가능한지 먼저 확인한다. 불가하면 추가 이유를 보고한다. |
| 규칙 충돌 | 전역 `~/.claude/CLAUDE.md` > 이 문서 > `AGENTS.md` 순서로 판단하되, Next.js 버전 관련 내용은 `AGENTS.md`와 `node_modules/next/dist/docs/`를 우선한다. |
| PRD/ROADMAP 범위 밖 요청 (검색, 댓글, 다크 모드 추가 등) | 사용자가 명시적으로 요청했을 때만 구현한다. 요청이 없으면 범위 밖임을 알리고 진행 여부를 묻는다. |

## 10. 금지 사항

- ❌ `any` 타입, `as any`, `@ts-ignore`
- ❌ 인라인 `style`, CSS 모듈, 새 전역 CSS 파일 (`globals.css` 외)
- ❌ 고정 픽셀 폭으로 모바일 레이아웃을 깨는 클래스 (`w-[800px]` 등)
- ❌ 컴포넌트 안의 하드코딩 색상 값 (`#fff`, `bg-[#...]`)
- ❌ 한국어가 아닌 주석, 영어 커밋 메시지
- ❌ 들여쓰기 4칸 또는 탭
- ❌ `node_modules/next/dist/docs/` 확인 없이 Next.js 코드 작성
- ❌ `NEXT_PUBLIC_`로 API 키 노출, 클라이언트 컴포넌트에서 Notion 키 사용
- ❌ `.env*` 실제 값 커밋
- ❌ `package-lock.json` 수동 편집
- ❌ `components/ui/` 파일을 여러 개 동시에 다시 생성해 기존 커스터마이즈를 덮어쓰기
- ❌ 검증 실패를 숨기고 완료로 보고

## 11. 알려진 불일치 (수정 전까지 이 기준을 우선)

- `README.md`는 `app/components/page.tsx`와 `app/error.tsx`를 언급하지만 실제로는 없다. 새로 만들지 않는다. 필요 시 README를 실제 구조에 맞춘다.
- `.claude/commands/new-page.md`는 `app/components/ui`를 언급하지만 실제 위치는 `components/ui/`다. 이 문서를 우선한다.
- `app/layout.tsx`의 `metadata`는 `siteConfig`를 쓰지만, 페이지별 `description`/Open Graph는 아직 없다 (PRD §8 SEO 요구사항, 구현 시 추가).
