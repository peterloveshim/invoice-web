# Development Guidelines

## Project Overview

- Notion 데이터베이스를 백엔드로 사용하는 견적서 조회/PDF 다운로드 웹 시스템
- 스택: Next.js 15.5.3 (App Router) + React 19 + TypeScript + TailwindCSS v4 + shadcn/ui
- 외부 의존: `@notionhq/client` v5, `@react-pdf/renderer` v4
- 진입점: `/invoice/[id]` (Notion 페이지 ID 기반 공개 URL)

---

## Project Architecture

```
src/
├── app/
│   ├── invoice/[id]/page.tsx        # 견적서 조회 페이지 (Server Component)
│   ├── api/generate-pdf/route.ts    # PDF 생성 API Route
│   ├── not-found.tsx                # 전역 404 페이지
│   └── layout.tsx                   # 루트 레이아웃
├── components/
│   ├── invoice/
│   │   ├── invoice-view.tsx         # 견적서 웹 렌더 (Client Component)
│   │   └── invoice-pdf.tsx          # PDF 문서 컴포넌트 (서버사이드 전용)
│   └── ui/                          # shadcn/ui 컴포넌트 (수동 편집 금지)
└── lib/
    ├── notion.ts                    # Invoice 타입 + Notion API 함수 (단일 진실의 원천)
    └── env.ts                       # 환경변수 Zod 검증
```

---

## Code Standards

### 네이밍

- 파일명: `kebab-case.tsx`
- 컴포넌트명: `PascalCase`
- 함수/변수: `camelCase`
- `any` 타입 사용 금지 — 반드시 명시적 타입 또는 `unknown` 사용

### Import 순서

1. 외부 라이브러리 (`react`, `next`, `@notionhq/client`)
2. 내부 모듈 (`@/lib/...`, `@/components/...`)
3. 상대 경로

### Path Aliases

- 상대 경로(`../`) 사용 금지 — 반드시 `@/` 별칭 사용

---

## Key File Interaction Rules

### Invoice 타입 변경 시 동시 수정 필수

- `src/lib/notion.ts` — `Invoice` / `InvoiceItem` 인터페이스 정의 (원본)
- `src/components/invoice/invoice-view.tsx` — 웹 렌더링에서 타입 사용
- `src/components/invoice/invoice-pdf.tsx` — PDF 렌더링에서 타입 사용
- `src/app/invoice/[id]/page.tsx` — `generateMetadata`에서 필드 참조

### Notion 필드명 추가/변경 시 수정 위치

- `src/lib/notion.ts`의 `getInvoiceByPageId` 함수 내 `extractText/extractNumber/extractDate/extractSelect` 호출부
- 한국어 필드명 + 영어 fallback 패턴 유지: `properties['한국어'] ?? properties['English']`

### 환경변수 추가 시 동시 수정 필수

- `src/lib/env.ts` — Zod 스키마에 추가
- `.env.example` — 키 이름 추가 (값 없이)

---

## Notion API Integration

### 현재 Notion 필드 매핑

| Invoice 필드    | Notion 프로퍼티 키 (한국어) | Notion 프로퍼티 키 (영어 fallback) | 타입      |
| --------------- | --------------------------- | ---------------------------------- | --------- |
| `invoiceNumber` | `견적번호`                  | `Invoice Number`                   | title     |
| `clientName`    | `고객명`                    | `Client Name`                      | rich_text |
| `clientEmail`   | `고객이메일`                | `Client Email`                     | rich_text |
| `issueDate`     | `발행일`                    | `Issue Date`                       | date      |
| `dueDate`       | `만료일`                    | `Due Date`                         | date      |
| `subtotal`      | `소계`                      | `Subtotal`                         | number    |
| `tax`           | `세금`                      | `Tax`                              | number    |
| `status`        | `상태`                      | `Status`                           | select    |
| `notes`         | `비고`                      | `Notes`                            | rich_text |

### Invoice.status 허용값

- `'draft' | 'sent' | 'paid' | 'cancelled'`
- Notion select 값이 이 목록에 없으면 `'draft'`로 fallback

### Notion 오류 처리

- `Could not find page`, `object_not_found`, `unauthorized` 메시지 → `null` 반환 (404 처리)
- 그 외 오류 → `throw` (에러 페이지 표시)

---

## Component Rules

### Server vs Client Component

| 파일                                      | 타입                              | 이유                                         |
| ----------------------------------------- | --------------------------------- | -------------------------------------------- |
| `src/app/invoice/[id]/page.tsx`           | Server Component                  | Notion API 호출                              |
| `src/app/api/generate-pdf/route.ts`       | API Route                         | 서버사이드 PDF 생성                          |
| `src/components/invoice/invoice-view.tsx` | Client Component (`'use client'`) | PDF 다운로드 fetch, DOM 조작                 |
| `src/components/invoice/invoice-pdf.tsx`  | Server-side only                  | `@react-pdf/renderer` (브라우저 import 금지) |

- `invoice-pdf.tsx`를 Client Component에서 import 금지 — 반드시 API Route에서만 사용
- 새 컴포넌트 추가 시: 브라우저 API 사용 여부로 Server/Client 결정

---

## PDF Generation

### PDF 다운로드 플로우

1. `InvoiceView`(Client) → `GET /api/generate-pdf?invoiceId={notionPageId}` fetch
2. API Route → `getInvoiceByPageId` 호출 → `renderToBuffer(createElement(InvoicePdfDocument, { invoice }))` → Buffer 반환
3. 클라이언트 → Blob → `URL.createObjectURL` → `<a>` 클릭으로 다운로드

### PDF API Endpoint

- **경로**: `GET /api/generate-pdf?invoiceId={notionPageId}`
- **성공**: `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="estimate_{invoiceNumber}.pdf"`
- **실패**: 404 (견적서 없음) / 400 (invoiceId 누락) / 500 (생성 오류)

### PDF 스타일 규칙

- `@react-pdf/renderer`의 `StyleSheet.create` 사용 — Tailwind CSS 사용 불가
- 폰트: 기본 `Helvetica` / 한글 텍스트는 `Font.register`로 폰트 내장 필요
- `Intl.NumberFormat` 사용 불가 — `formatCurrencyPdf` 함수(₩ + toLocaleString) 사용

---

## Environment Variables

### 필수 환경변수

| 변수명               | 용도                    |
| -------------------- | ----------------------- |
| `NOTION_API_KEY`     | Notion Integration 토큰 |
| `NOTION_DATABASE_ID` | 견적서 데이터베이스 ID  |

### 접근 규칙

- `process.env.X` 직접 접근 금지 (단, `src/lib/notion.ts` 내 `createNotionClient` 예외)
- 신규 환경변수 접근 시 반드시 `src/lib/env.ts` Zod 스키마에 추가 후 `env.X`로 접근

---

## Routing Rules

### 페이지 구조

- `/` → `src/app/page.tsx` (홈, 현재 기본 페이지)
- `/invoice/[id]` → `src/app/invoice/[id]/page.tsx` (견적서 조회)
- 존재하지 않는 견적서 → `notFound()` 호출 → `src/app/not-found.tsx`

### Next.js 15 params 접근

- `params`는 `Promise<{ id: string }>` 타입 — 반드시 `await params`로 접근
  ```typescript
  // ✅ 올바름
  const { id } = await params
  // ❌ 금지
  const { id } = params
  ```

---

## shadcn/ui Rules

- `src/components/ui/` 파일 수동 편집 금지 — `npx shadcn@latest add [component]`로만 추가
- 컴포넌트 추가 명령: `npx shadcn@latest add [component-name]`
- 현재 설치된 컴포넌트: `alert`, `badge`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `select`, `separator`, `skeleton`, `sonner`

---

## Workflow

### 기능 추가 워크플로우

1. Notion 필드 변경 필요 → `src/lib/notion.ts` 수정 (타입 + 매핑 함수)
2. UI 변경 → `src/components/invoice/invoice-view.tsx` 수정
3. PDF 변경 → `src/components/invoice/invoice-pdf.tsx` 수정
4. 새 API 엔드포인트 → `src/app/api/[경로]/route.ts` 추가

### 검증 명령어

```bash
npm run check-all   # typecheck + lint + format:check 통합 실행
npm run build       # 빌드 성공 확인
```

---

## Workflow

### 기능 구현 전 참조 문서 확인 순서

1. `docs/ROADMAP.md` — 현재 Phase 및 태스크 확인
2. `docs/guides/project-structure.md` — 파일 위치 결정
3. `docs/guides/component-patterns.md` — 컴포넌트 구현 방식
4. `docs/guides/forms-react-hook-form.md` — 폼 구현 시
5. `docs/guides/styling-guide.md` — 스타일링 시

### ROADMAP 태스크 완료 시

- `docs/ROADMAP.md`의 해당 태스크 체크박스(`- [ ]` → `- [x]`)를 반드시 업데이트

### 커밋 전 자동 실행

- `.husky/pre-commit`에 의해 `lint-staged`가 자동 실행됨
- `*.{js,jsx,ts,tsx}`: ESLint fix → Prettier write
- `*.{json,css,md}`: Prettier write
- `--no-verify` 플래그로 훅 우회 금지

---

## Prohibited Actions

- `any` 타입 사용 금지
- `src/components/ui/` 파일 직접 수정 금지
- `invoice-pdf.tsx`를 클라이언트 컴포넌트에서 import 금지
- 상대 경로(`../../`) import 금지 — `@/` 별칭 사용
- `process.env.X` 직접 접근 금지 — `src/lib/env.ts` 경유
- Next.js 15에서 `params`를 `await` 없이 직접 구조분해 금지
- `Invoice` 타입 정의를 `src/lib/notion.ts` 외 다른 파일에 중복 정의 금지
- `src/components/ui/` 외부에 shadcn/ui 컴포넌트 복사 금지
- 파일명에 `snake_case` 또는 `PascalCase` 사용 금지 (컴포넌트 함수명 제외)
- `shrimp_data/` 디렉토리 수동 수정 금지 — shrimp task manager 전용
- `.claude/agents/`, `.claude/commands/` 파일 수정 시 사용자 승인 필요
- git commit 시 `--no-verify` 사용 금지
