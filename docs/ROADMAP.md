# 노션 기반 견적서 관리 시스템 개발 로드맵

> 마지막 업데이트: 2026-03-19 | 버전: v2.2

---

## 개요

노션 데이터베이스를 백엔드로 활용하여 견적서를 관리하고, 클라이언트가 고유 URL로 견적서를 조회 및 PDF 다운로드할 수 있는 경량 웹 시스템입니다. MVP(Phase 1~5)를 완료하고 Vercel 프로덕션 배포까지 마쳤으며, Phase 6 다크모드, Phase 7 관리자 견적서 목록, Phase 8 클라이언트 링크 복사 기능까지 전 Phase 구현을 완료했습니다.

- **견적서 웹 렌더링**: 노션 데이터 기반 고유 URL 견적서 조회 및 반응형 UI
- **PDF 다운로드**: 한글 폰트 내장 PDF 즉시 생성 및 다운로드
- **관리자 대시보드**: 견적서 목록 조회, 필터/검색, 클라이언트 링크 복사
- **다크모드**: 라이트/다크/시스템 테마 전환 지원

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 완료로 표시

---

## 전체 타임라인

| 단계                                    | 기간    | 핵심 목표                                             | 상태 |
| --------------------------------------- | ------- | ----------------------------------------------------- | ---- |
| Phase 1: 환경 설정 및 기반 구축         | 1주차   | 프로젝트 초기 설정, Notion API 연동 기반              | 완료 |
| Phase 2: 공통 모듈 및 컴포넌트 구축     | 2주차   | 공유 유틸, 타입, shadcn/ui 설치, 공통 컴포넌트        | 완료 |
| Phase 3: 견적서 조회 기능 구현          | 3주차   | 견적서 페이지 렌더링, 유효성 검증, 반응형 UI          | 완료 |
| Phase 4: PDF 다운로드 기능 구현         | 4주차   | PDF 생성 API 및 다운로드 플로우 완성                  | 완료 |
| Phase 5: 품질 개선 및 배포              | 5주차   | 성능 최적화, 에러 처리 강화, Vercel 배포              | 완료 |
| Phase 6: 다크모드 기능 추가             | 6주차   | 라이트/다크/시스템 테마 전환, shadcn/ui 다크모드 연동 | 완료 |
| Phase 7: 관리자 레이아웃 및 견적서 목록 | 7~8주차 | 관리자 전용 레이아웃, 견적서 목록/필터/검색           | 완료 |
| Phase 8: 클라이언트 링크 복사 기능      | 8주차   | 견적서 공유 링크 클립보드 복사, 토스트 알림           | 완료 |

---

## MVP 완료 단계 (Phase 1~5)

### Phase 1: 환경 설정 및 기반 구축 (1주차) ✅

프로젝트 초기 설정, Notion API 클라이언트 연동, 타입 정의 및 디렉토리 구조 설계를 완료했습니다.
See: `/docs/roadmaps/ROADMAP_v1.md` Phase 1 참조

### Phase 2: 공통 모듈 및 컴포넌트 구축 (2주차) ✅

공통 유틸리티 함수, shadcn/ui 컴포넌트(Button, Badge, Table, Skeleton, Sonner) 설치, 공통 UI 컴포넌트(LoadingSpinner, ErrorMessage, InvoiceSkeleton, InvoiceLayout)를 구축했습니다.
See: `/docs/roadmaps/ROADMAP_v1.md` Phase 2 참조

### Phase 3: 견적서 조회 기능 구현 (3주차) ✅

`/invoice/[notionPageId]` 경로의 견적서 조회 페이지를 Server Component로 구현하고, 반응형 레이아웃 및 에러 처리(not-found, error)를 완성했습니다.
See: `/docs/roadmaps/ROADMAP_v1.md` Phase 3 참조

### Phase 4: PDF 다운로드 기능 구현 (4주차) ✅

`@react-pdf/renderer` 기반 PDF 생성 API Route, 한글 폰트(Noto Sans KR) 내장, 다운로드 버튼 Client Component를 구현했습니다.
See: `/docs/roadmaps/ROADMAP_v1.md` Phase 4 참조

### Phase 5: 품질 개선 및 배포 (5주차) ✅

`unstable_cache` 캐싱, 스켈레톤 UI, 에러 처리 강화, 접근성 개선, Vercel 프로덕션 배포(서울 리전 icn1)를 완료했습니다.
See: `/docs/roadmaps/ROADMAP_v1.md` Phase 5 참조

---

## 고도화 단계 (Phase 6~8)

### Phase 6: 다크모드 기능 추가 (6주차) ✅

#### 목표

`next-themes` 라이브러리를 활용하여 라이트/다크/시스템 테마 전환 기능을 추가합니다. shadcn/ui 컴포넌트와 TailwindCSS v4의 `dark:` 클래스를 연동하여 전체 애플리케이션에 일관된 다크모드를 적용합니다.

#### 선행 조건

- Phase 5 완료 (MVP 배포 상태)

#### 주요 기능

- 라이트 / 다크 / 시스템 3가지 테마 모드 전환
- 헤더 영역에 테마 토글 버튼 배치
- 견적서 조회 페이지 전체 다크모드 대응
- PDF 다운로드 화면은 항상 라이트 모드 유지 (인쇄 최적화)
- 사용자 테마 선택값 localStorage 자동 저장

#### 기술 태스크

**next-themes 설정**

- [x] `next-themes` 패키지 설치
- [x] `src/components/providers/theme-provider.tsx` 생성 -- `ThemeProvider` 래퍼 컴포넌트 구현 (`attribute="class"`, `defaultTheme="system"`, `enableSystem` 설정)
- [x] `src/app/layout.tsx`에 `ThemeProvider` 적용 -- `<body>` 태그를 감싸는 형태로 구성
- [x] `suppressHydrationWarning` 속성을 `<html>` 태그에 추가하여 서버/클라이언트 불일치 방지

**테마 토글 컴포넌트**

- [x] `src/components/common/theme-toggle.tsx` Client Component 구현 -- `useTheme` 훅 활용, `mounted` 상태로 SSR hydration 불일치 방지
- [x] shadcn/ui `DropdownMenu` 컴포넌트 설치 (`npx shadcn@latest add dropdown-menu`)
- [x] 드롭다운 메뉴로 라이트/다크/시스템 3가지 옵션 제공 (Lucide `Sun`, `Moon`, `Monitor` 아이콘)
- [x] 견적서 페이지 헤더 또는 `InvoiceLayout` 상단에 테마 토글 버튼 배치

**TailwindCSS v4 다크모드 설정**

- [x] `src/app/globals.css`에서 TailwindCSS v4 다크모드 변수 확인 및 조정 -- shadcn/ui의 CSS 변수(`--background`, `--foreground` 등)가 다크 테마에서 올바르게 전환되는지 검증
- [x] 커스텀 스타일이 적용된 컴포넌트에 `dark:` prefix 클래스 추가

**기존 컴포넌트 다크모드 대응**

- [x] `src/components/invoice/invoice-page.tsx` -- 배경색, 텍스트 색상, 테두리 등 다크모드 클래스 적용
- [x] `src/components/invoice/invoice-header.tsx` -- 상태 배지(Badge) 다크모드 색상 확인
- [x] `src/components/invoice/invoice-items-table.tsx` -- 테이블 행 배경, 테두리 다크모드 대응
- [x] `src/components/invoice/invoice-summary.tsx` -- 합계 섹션 배경 및 강조색 다크모드 대응
- [x] `src/components/invoice/invoice-parties.tsx` -- 발행자/클라이언트 섹션 다크모드 대응
- [x] `src/components/common/error-message.tsx` -- 에러 메시지 컴포넌트 다크모드 대응
- [x] `src/app/not-found.tsx` -- 404 페이지 다크모드 대응
- [x] `src/components/invoice/pdf-download-button.tsx` -- 버튼 스타일 다크모드 확인 (shadcn/ui Button은 기본 지원)

**인쇄 및 PDF 영역 제외 처리**

- [x] `@media print` 스타일에서 다크모드 비활성화 -- 인쇄 시 항상 라이트 모드로 출력
- [x] PDF 생성 컴포넌트(`invoice-pdf.tsx`)는 `@react-pdf/renderer` 자체 스타일이므로 다크모드 영향 없음 확인

#### 테스트 계획

**Playwright MCP 테스트 시나리오**

- [x] **Happy Path**: 테마 토글 버튼 클릭 시 드롭다운 메뉴에 라이트/다크/시스템 3가지 옵션이 표시되는지 확인
- [x] **Happy Path**: 다크 모드 선택 시 `<html>` 태그에 `class="dark"`가 추가되고 배경색이 어두운 색상으로 전환되는지 확인
- [x] **Happy Path**: 라이트 모드 선택 시 `<html>` 태그에서 `dark` 클래스가 제거되고 밝은 배경으로 전환되는지 확인
- [x] **Happy Path**: 시스템 모드 선택 시 OS 설정에 따라 테마가 자동 적용되는지 확인
- [x] **Happy Path**: 견적서 조회 페이지(`/invoice/[id]`)에서 다크모드 전환 시 텍스트, 테이블, 배지 등 모든 요소가 정상 표시되는지 확인
- [x] **Edge Case**: 페이지 새로고침 후에도 선택한 테마가 유지되는지 확인 (localStorage 기반)
- [x] **Edge Case**: 다크모드 상태에서 PDF 다운로드 실행 시 정상 동작하는지 확인
- [x] **검증 항목**: 모바일(375px) 뷰포트에서 테마 토글 버튼이 정상 표시되고 동작하는지 확인

#### 완료 기준 (Definition of Done)

- [x] `next-themes` 기반 라이트/다크/시스템 테마 전환이 정상 동작
- [x] 테마 토글 버튼이 헤더 영역에 배치되고 반응형으로 동작
- [x] 견적서 페이지 전체 컴포넌트가 다크모드에서 정상 렌더링 (텍스트 가독성, 색상 대비 확보)
- [x] 페이지 새로고침 후에도 선택한 테마가 유지됨
- [x] PDF 다운로드 기능이 다크모드에서도 정상 동작
- [x] `npm run check-all` 및 `npm run build` 모두 통과
- [x] 테스트 계획의 Playwright MCP 시나리오 전항목 통과

#### 예상 기간

3일 (6주차)

---

### Phase 7: 관리자 레이아웃 및 견적서 목록 (7~8주차) ✅

#### 목표

관리자 전용 레이아웃(`/admin` 경로)을 구성하고, 노션 데이터베이스에서 전체 견적서 목록을 조회하는 대시보드를 구현합니다. 페이지네이션, 상태 필터, 클라이언트명/날짜 기반 검색 기능을 제공합니다.

#### 선행 조건

- Phase 6 완료 (다크모드 적용 -- 관리자 페이지에도 다크모드 일관 적용을 위해)

#### 주요 기능

- `/admin` 경로의 관리자 전용 레이아웃 (사이드바 또는 헤더 네비게이션)
- 노션 데이터베이스에서 전체 견적서 목록 조회 (`notion.databases.query()`)
- 견적서 목록 테이블 (견적서 번호, 클라이언트명, 발행일, 상태, 총액)
- 견적서 상태 필터 (전체/대기/승인/거절)
- 클라이언트명, 날짜 범위 기반 검색
- 페이지네이션 (서버 사이드 커서 기반)

#### 기술 태스크

**관리자 라우트 및 레이아웃 구조**

- [x] `src/app/admin/layout.tsx` 생성 -- 관리자 전용 레이아웃 (헤더 + 사이드바 + 콘텐츠 영역)
- [x] `src/app/admin/page.tsx` 생성 -- 관리자 메인 페이지 (견적서 목록으로 리다이렉트 또는 대시보드)
- [x] `src/app/admin/invoices/page.tsx` 생성 -- 견적서 목록 페이지
- [x] `src/app/admin/invoices/loading.tsx` 생성 -- 견적서 목록 로딩 스켈레톤
- [x] `src/components/admin/admin-header.tsx` 구현 -- 관리자 헤더 (로고, 네비게이션, 테마 토글)
- [x] `src/components/admin/admin-sidebar.tsx` 구현 -- 헤더 네비게이션으로 대체 (Phase 8 이후 확장 대비)

**타입 정의 확장**

- [x] `src/types/invoice.ts`에 목록 조회용 타입 추가 -- `InvoiceListItem` (목록 테이블에 표시할 최소 필드), `InvoiceStatus` (대기/승인/거절 유니온 타입)
- [x] `src/types/invoice.ts`에 필터/검색 타입 추가 -- `InvoiceFilter` (상태, 클라이언트명, 날짜 범위), `InvoiceListResponse` (목록 + 페이지네이션 커서)

**Notion API 목록 조회 함수**

- [x] `src/lib/notion.ts`에 `getInvoiceList()` 함수 추가 -- SDK v5 호환: `dataSources.query()` 사용 (database → data_source ID 자동 변환)
- [x] Notion API 필터 조건 빌더 유틸 구현 -- 상태 필터(`status` Select 필드), 클라이언트명 검색(`client_name` 텍스트 포함), 날짜 범위(`issue_date` 범위 조건)
- [x] Notion 커서 기반 페이지네이션 처리 -- `start_cursor`, `has_more` 응답 필드 활용
- [x] Notion API 응답을 `InvoiceListItem[]`으로 변환하는 매핑 함수 구현

**견적서 목록 API Route**

- [x] `src/app/api/admin/invoices/route.ts` 생성 -- GET 요청으로 견적서 목록 반환
- [x] 쿼리 파라미터 파싱: `status`, `search`, `startDate`, `endDate`, `cursor`, `pageSize`
- [x] Zod 스키마로 쿼리 파라미터 유효성 검증
- [x] `unstable_cache` 적용 (1분 캐시, 태그 기반 무효화)

**견적서 목록 UI 컴포넌트**

- [x] `src/components/admin/invoice-list-table.tsx` 구현 -- shadcn/ui `Table` 컴포넌트 활용, 견적서 번호/클라이언트명/발행일/상태(Badge)/총액 열 구성
- [x] `src/components/admin/invoice-list-filters.tsx` 구현 -- 상태 필터 (shadcn/ui `Select`), 클라이언트명 검색 입력 (300ms debounce)
- [x] `src/components/admin/invoice-list-pagination.tsx` 구현 -- 이전/다음 페이지 버튼 (커서 기반)
- [x] `src/components/admin/invoice-list-skeleton.tsx` 구현 -- 목록 테이블 스켈레톤 UI (shadcn/ui Skeleton 활용)

**URL 상태 관리 (nuqs)**

- [x] `nuqs` 패키지 설치 및 설정
- [x] `src/app/admin/invoices/` 페이지에서 `nuqs`로 필터/검색 상태를 URL 쿼리 파라미터로 관리 -- `?status=대기&search=홍길동&cursor=xxx`
- [x] 브라우저 뒤로가기/앞으로가기 시 필터 상태 복원 지원
- [x] `src/app/admin/layout.tsx`에 `NuqsAdapter` 프로바이더 적용

**데이터 페칭 (TanStack Query)**

- [x] `@tanstack/react-query` 패키지 설치
- [x] `src/components/providers/query-provider.tsx` 생성 -- `QueryClientProvider` 래퍼
- [x] `src/hooks/use-invoice-list.ts` 커스텀 훅 구현 -- `useQuery`로 견적서 목록 API 호출, nuqs 파라미터를 쿼리 키에 포함
- [x] 필터/검색 변경 시 자동 리페칭 구현
- [x] 빈 상태 UI 처리 -- "견적서가 없습니다" 메시지

**반응형 디자인**

- [x] 모바일(375px): 테이블 가로 스크롤 (`overflow-x-auto`) 적용
- [x] 태블릿(768px): 테이블 표시
- [x] 데스크톱(1024px+): 전체 테이블 레이아웃 (헤더 네비게이션)

#### 테스트 계획

**Playwright MCP 테스트 시나리오**

- [x] **Happy Path**: `/admin/invoices` 접근 시 견적서 목록 테이블이 정상 렌더링되고 데이터가 표시되는지 확인
- [x] **Happy Path**: 상태 필터에서 "대기" 선택 시 대기 상태 견적서만 테이블에 표시되는지 확인
- [x] **Happy Path**: 클라이언트명 검색 입력 시 해당 클라이언트의 견적서만 필터링되는지 확인
- [x] **Happy Path**: 페이지네이션 "다음" 버튼 클릭 시 다음 페이지 데이터가 로드되는지 확인
- [x] **Happy Path**: 필터 변경 시 URL 쿼리 파라미터가 업데이트되는지 확인 (nuqs 연동)
- [x] **Edge Case**: 견적서가 없는 상태에서 빈 상태 메시지가 표시되는지 확인
- [x] **Edge Case**: 검색 결과가 없을 때 "견적서가 없습니다" 메시지가 표시되는지 확인
- [x] **Edge Case**: Notion API 에러 발생 시 에러 메시지가 적절히 표시되는지 확인
- [x] **검증 항목**: 모바일(375px) 뷰포트에서 관리자 레이아웃이 반응형으로 정상 동작하는지 확인
- [x] **검증 항목**: 다크모드에서 관리자 페이지 전체가 정상 렌더링되는지 확인

#### 완료 기준 (Definition of Done)

- [x] `/admin/invoices` 경로에서 노션 데이터베이스의 견적서 목록이 테이블로 정상 표시됨
- [x] 상태 필터(전체/대기/승인/거절) 동작 확인
- [x] 클라이언트명 검색 동작 확인
- [x] 페이지네이션(커서 기반)으로 다음/이전 페이지 이동 가능
- [x] URL 쿼리 파라미터로 필터/검색 상태가 관리되고 브라우저 히스토리와 동기화됨
- [x] 관리자 레이아웃이 모바일/태블릿/데스크톱에서 반응형 동작
- [x] 다크모드에서 관리자 페이지 전체 정상 렌더링
- [x] `npm run check-all` 및 `npm run build` 모두 통과
- [x] 테스트 계획의 Playwright MCP 시나리오 전항목 통과

#### 예상 기간

7일 (7~8주차)

---

### Phase 8: 클라이언트 링크 복사 기능 (8주차) ✅

#### 목표

관리자 견적서 목록에서 각 견적서의 클라이언트 공유 링크를 클립보드에 복사하는 기능을 구현합니다. 복사 완료 시 토스트 알림으로 사용자에게 피드백을 제공합니다.

#### 선행 조건

- Phase 7 완료 (관리자 견적서 목록 테이블 구현)

#### 주요 기능

- 견적서 목록 테이블 각 행에 "링크 복사" 버튼 추가
- 클릭 시 `https://[도메인]/invoice/[notionPageId]` 형식의 URL을 클립보드에 복사
- 복사 성공 시 shadcn/ui Sonner 토스트 알림 표시
- 복사 실패 시 (HTTPS 미지원 환경 등) 대체 동작 제공

#### 기술 태스크

**링크 복사 유틸리티**

- [x] `src/lib/utils/clipboard.ts` 생성 -- `copyInvoiceLink(notionPageId: string): Promise<boolean>` 함수 구현
- [x] `navigator.clipboard.writeText()` API 활용, 실패 시 `document.execCommand('copy')` 폴백 처리
- [x] 복사할 URL 생성 로직 -- `${window.location.origin}/invoice/${notionPageId}` 형식

**링크 복사 버튼 컴포넌트**

- [x] `src/components/admin/copy-link-button.tsx` Client Component 구현 -- `notionPageId` prop 수신
- [x] shadcn/ui `Button` (variant: `ghost`, size: `icon`) + Lucide `Link` 아이콘 활용
- [x] 복사 성공 시: 아이콘이 `Check`로 변경 (1.5초 후 원래 아이콘 복원), Sonner 토스트로 "링크가 복사되었습니다" 알림
- [x] 복사 실패 시: Sonner 토스트로 "링크 복사에 실패했습니다" 에러 알림
- [x] 버튼 호버 시 툴팁으로 "클라이언트 링크 복사" 표시 (shadcn/ui `Tooltip` 컴포넌트 활용)

**견적서 목록 테이블 통합**

- [x] `src/components/admin/invoice-list-table.tsx`에 "링크" 열 추가 -- `CopyLinkButton` 컴포넌트 배치
- [x] 테이블 열 너비 조정 -- 링크 복사 버튼 열은 고정 너비(48px)

**Sonner 토스트 설정 확인**

- [x] `src/app/layout.tsx`에 `<Toaster />` 컴포넌트 배치 확인 (Phase 2에서 설치 완료)
- [x] 다크모드에서 토스트 알림 스타일 정상 표시 확인 (`theme` prop 연동)

#### 테스트 계획

**Playwright MCP 테스트 시나리오**

- [x] **Happy Path**: 견적서 목록의 "링크 복사" 버튼 클릭 시 클립보드에 올바른 URL이 복사되는지 확인
- [x] **Happy Path**: 복사 성공 후 토스트 알림 "링크가 복사되었습니다"가 화면에 표시되는지 확인
- [x] **Happy Path**: 복사 성공 후 버튼 아이콘이 체크 표시로 변경되었다가 원래대로 복원되는지 확인
- [x] **Edge Case**: 연속으로 여러 견적서의 링크 복사 버튼을 빠르게 클릭해도 정상 동작하는지 확인
- [x] **Edge Case**: 다크모드에서 토스트 알림이 정상 표시되는지 확인
- [x] **검증 항목**: 복사된 URL 형식이 `https://[도메인]/invoice/[notionPageId]`와 일치하는지 확인
- [x] **검증 항목**: 모바일(375px) 뷰포트에서 링크 복사 버튼이 접근 가능하고 정상 동작하는지 확인

#### 완료 기준 (Definition of Done)

- [x] 견적서 목록 테이블 각 행에 링크 복사 버튼이 표시됨
- [x] 버튼 클릭 시 해당 견적서의 클라이언트 공유 URL이 클립보드에 복사됨
- [x] 복사 성공/실패 시 적절한 토스트 알림이 표시됨
- [x] 다크모드에서 버튼 및 토스트 알림이 정상 동작
- [x] `npm run check-all` 및 `npm run build` 모두 통과
- [x] 테스트 계획의 Playwright MCP 시나리오 전항목 통과

#### 예상 기간

2일 (8주차)

---

## 향후 계획 (Backlog)

고도화 Phase 완료 후 사용자 피드백을 수집하여 우선순위를 재평가하고 구현합니다.

### 관리 기능 강화

- [ ] 관리자 인증 (NextAuth.js + Google OAuth) -- 관리자 페이지 접근 제어
- [ ] 견적서 상태 관리 -- 대기/승인/거절 상태 변경 (Notion API PATCH 요청)
- [ ] 관리자 대시보드 통계 -- 월별 견적서 발행 수, 승인율 등 기본 메트릭

### 자동화

- [ ] 이메일 자동 발송 -- 견적서 링크 포함 이메일 발송 (Resend 또는 SendGrid 연동)
- [ ] 견적서 만료 알림 -- 유효기간 D-3 이메일 알림
- [ ] 클라이언트 응답 트래킹 -- 견적서 열람 횟수, 최근 열람 시각 기록

### 고급 기능

- [ ] 다중 PDF 템플릿 지원 (디자인 선택 기능)
- [ ] 다국어 견적서 (영어/일본어 지원)
- [ ] 전자 서명 기능 (클라이언트 서명 후 확정 처리)
- [ ] 견적서 버전 관리 및 수정 이력

---

## 리스크 및 의존성

| 리스크                                         | 영향도 | 대응 방안                                                                                  |
| ---------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| `@react-pdf/renderer`의 React 19 호환성 미검증 | 높음   | 설치 즉시 간단한 PDF 생성 테스트 수행; 비호환 시 Puppeteer(서버사이드 HTML->PDF) 대안 검토 |
| Notion API 응답 지연 (P99 ~2초)                | 중간   | Next.js `unstable_cache`로 응답 캐싱, `loading.tsx` 스켈레톤으로 UX 보완                   |
| Notion API 무료 플랜 Rate Limit (초당 3회)     | 중간   | 캐싱으로 중복 요청 최소화; 목록 API 호출 시 debounce 적용; 트래픽 급증 시 Redis 캐시 검토  |
| 관리자 페이지 인증 미적용 (Phase 6~8)          | 중간   | URL을 알면 누구나 접근 가능; 향후 NextAuth.js 인증 추가로 대응                             |
| next-themes SSR hydration 불일치               | 낮음   | `suppressHydrationWarning` 적용, `ThemeProvider`의 올바른 설정으로 방지                    |
| nuqs URL 상태와 서버 컴포넌트 동기화           | 낮음   | `NuqsAdapter` 프로바이더 적용, Client Component에서 상태 관리                              |

---

## 기술 부채 및 고려사항

### 알려진 기술적 타협점

1. **PDF 생성 방식**: `@react-pdf/renderer`는 복잡한 레이아웃에서 HTML 렌더링과 차이가 발생할 수 있습니다. 향후 Puppeteer(서버사이드)로 전환을 고려할 수 있습니다.

2. **노션을 데이터베이스로 직접 사용**: 별도 DB 없이 노션 API를 직접 호출합니다. 목록 조회 추가로 API 호출량이 증가하므로, 트래픽 증가 시 캐싱 레이어(Redis/Vercel KV) 추가가 필요합니다.

3. **인증 없는 관리자 페이지**: Phase 6~8에서는 인증 없이 `/admin` 경로를 구현합니다. 프로덕션 운영 시 NextAuth.js 기반 인증을 반드시 추가해야 합니다.

4. **환경 변수 단일 데이터베이스**: 현재 `NOTION_DATABASE_ID` 하나만 지원하여 다중 사용자 시나리오에 적합하지 않습니다. 멀티테넌시가 필요해지면 구조 변경이 필요합니다.

### 향후 개선 계획

- 관리자 인증 추가 후 프로덕션 관리자 페이지 배포
- PDF 다운로드 횟수, 견적서 열람 수 등 기본 메트릭 수집 도구 추가 (Vercel Analytics 또는 PostHog)
- 코드 커버리지를 위한 단위 테스트 추가 (특히 Notion 응답 매핑 유틸 함수)
- TanStack Query 캐싱 전략 최적화 (staleTime, gcTime 튜닝)
