---
name: invoice-web 프로젝트 초기화
description: 노션 기반 견적서 관리 시스템 MVP - 스타터 템플릿 정리 및 핵심 구조 생성 기록
type: project
---

노션 기반 견적서 관리 시스템 MVP 초기화 완료 (2026-03-16).

**제거된 스타터 템플릿 파일:**

- `src/app/login/`, `src/app/signup/` - 데모 인증 페이지
- `src/components/sections/` - hero, features, cta 데모 섹션
- `src/components/navigation/` - main-nav, mobile-nav 데모 내비게이션
- `src/components/layout/` - header, footer 데모 레이아웃
- `src/components/providers/theme-provider.tsx` - 테마 프로바이더 (next-themes 의존)
- `src/components/login-form.tsx`, `signup-form.tsx`, `theme-toggle.tsx`
- `src/components/ui/navigation-menu.tsx`, `avatar.tsx`, `progress.tsx`, `sheet.tsx`
- `public/` SVG 파일들 (globe, next, vercel, window)

**제거된 패키지:**

- `next-themes` - 다크모드 테마 (이 프로젝트 불필요)
- `@radix-ui/react-avatar`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-progress`
- `usehooks-ts`

**설치된 패키지:**

- `@notionhq/client` v5.13.0 - Notion API 클라이언트
- `@react-pdf/renderer` - PDF 생성

**생성된 핵심 파일:**

- `src/lib/notion.ts` - Notion API 서비스 레이어 (getInvoiceByPageId, getInvoiceIds)
- `src/lib/env.ts` - NOTION_API_KEY, NOTION_DATABASE_ID 환경변수 검증
- `src/app/invoice/[id]/page.tsx` - 견적서 조회 동적 페이지
- `src/app/api/generate-pdf/route.ts` - PDF 생성 API Route
- `src/components/invoice/invoice-view.tsx` - 웹 견적서 뷰 컴포넌트
- `src/components/invoice/invoice-pdf.tsx` - @react-pdf/renderer PDF 문서 컴포넌트
- `src/app/not-found.tsx` - 404 페이지
- `.env.example` - 환경변수 템플릿

**주요 기술 결정:**

- @notionhq/client v5.x는 `databases.query` 제거됨 → `notion.search()` 사용
- `sonner.tsx`에서 `next-themes` 의존성 제거 → `theme="light"` 고정
- PDF API Route는 서버 사이드에서만 실행 → webpack canvas alias 불필요
- `src/app/page.tsx` → `/not-found`로 redirect (직접 접근 방지)

**Why:** PRD에 따라 `/invoice/[id]` 단일 공개 URL만 필요하며, 인증/대시보드 기능 불필요.

**How to apply:** 향후 기능 추가 시 `src/components/invoice/` 디렉토리에 컴포넌트 추가, Notion 데이터베이스 속성명은 한국어(견적번호, 고객명 등) 우선, 영어 폴백 지원.
