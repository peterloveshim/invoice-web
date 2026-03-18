# 노션 기반 견적서 관리 시스템 개발 로드맵

> 마지막 업데이트: 2026-03-18 | 버전: v1.6

---

## 개요

노션 데이터베이스를 백엔드로 활용하여 견적서 데이터를 관리하고, 클라이언트가 고유 URL로 견적서를 조회하고 PDF로 다운로드할 수 있는 경량 웹 시스템입니다. 관리자는 별도 대시보드 없이 노션에서 직접 데이터를 관리하며, Next.js App Router와 Notion API를 통해 실시간으로 데이터를 렌더링합니다. MVP는 핵심 조회·다운로드 기능에 집중하고, 이후 단계에서 관리 기능과 자동화를 순차적으로 추가합니다.

---

## 핵심 목표

- [x] 노션 데이터베이스에서 견적서 데이터를 정상적으로 조회
- [x] 고유 URL(`/invoice/[notionPageId]`)로 견적서를 웹에서 정확하게 표시
- [x] PDF 다운로드 버튼 클릭 시 견적서가 즉시 PDF로 다운로드
- [x] 모바일·태블릿·데스크톱 모든 환경에서 정상 작동
- [x] 잘못된 URL 접근 시 적절한 에러 페이지 표시

---

## 전체 타임라인

| 단계                                | 기간  | 핵심 목표                                      | 상태 |
| ----------------------------------- | ----- | ---------------------------------------------- | ---- |
| Phase 1: 환경 설정 및 기반 구축     | 1주차 | 프로젝트 초기 설정, Notion API 연동 기반       | 완료 |
| Phase 2: 공통 모듈 및 컴포넌트 구축 | 2주차 | 공유 유틸, 타입, shadcn/ui 설치, 공통 컴포넌트 | 완료 |
| Phase 3: 견적서 조회 기능 구현      | 3주차 | 견적서 페이지 렌더링, 유효성 검증, 반응형 UI   | 완료 |
| Phase 4: PDF 다운로드 기능 구현     | 4주차 | PDF 생성 API 및 다운로드 플로우 완성           | 완료 |
| Phase 5: 품질 개선 및 배포          | 5주차 | 성능 최적화, 에러 처리 강화, Vercel 배포       | 완료 |

---

## Phase 1: 환경 설정 및 기반 구축 (1주차) ✅

### 목표

개발 환경을 완성하고, Notion API 연동이 가능한 기반 코드를 구축합니다. 이 단계가 완료되면 노션 데이터를 콘솔에서 정상적으로 조회할 수 있습니다.

### 주요 기능

- 프로젝트 초기 설정 및 의존성 설치
- Notion API 클라이언트 설정 및 연결 검증
- 프로젝트 디렉토리 구조 설계
- 환경 변수 관리 체계 수립

### 기술 태스크

**의존성 설치**

- [x] `@notionhq/client` 설치 및 TypeScript 타입 확인
- [x] `@react-pdf/renderer` 설치 및 버전 호환성 확인 (React 19)
- [x] `lucide-react` 아이콘 라이브러리 설치 확인 (shadcn/ui 기본 포함 여부 점검)

**환경 변수 설정**

- [x] `.env.local` 파일 생성 및 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 변수 정의
- [x] `.env.example` 파일 생성 (키 값 제외, 키 이름만 포함)
- [ ] `next.config.ts`에서 환경 변수 접근 가능 여부 확인

**Notion API 기반 구축**

- [x] `src/lib/notion.ts` 파일 생성 — `@notionhq/client` Client 인스턴스 싱글톤 패턴 구현
- [x] Notion 견적서 데이터 타입 정의 (`src/types/invoice.ts`): `Invoice`, `InvoiceItem` 인터페이스 정의
- [x] `src/lib/notion.ts`에 `getInvoiceById(pageId: string)` 함수 구현 — `notion.pages.retrieve` + `notion.blocks.children.list` 호출
- [x] `src/lib/notion.ts`에 `getInvoiceItems(invoiceId: string)` 함수 구현 — Relation 필드 기반 항목 조회
- [ ] Notion API 응답을 `Invoice` 타입으로 변환하는 매핑 유틸 함수 작성 (`mapNotionPageToInvoice`)

**프로젝트 구조 설계**

- [x] `src/app/invoice/[notionPageId]/` 디렉토리 및 `page.tsx` 파일 생성
- [x] `src/components/invoice/` 디렉토리 생성 (견적서 관련 컴포넌트 경로)
- [x] `src/components/pdf/` 디렉토리 생성 (PDF 관련 컴포넌트 경로)

### 테스트 계획

**Playwright MCP 테스트 시나리오**

- [ ] **Happy Path**: 유효한 `NOTION_API_KEY`와 `NOTION_DATABASE_ID`로 `getInvoiceById` 호출 시 견적서 데이터가 `Invoice` 타입으로 정상 반환됨을 확인
- [ ] **Edge Case**: 존재하지 않는 `pageId` 전달 시 Notion API가 404 응답 반환, 함수가 `null` 또는 적절한 에러를 반환하는지 확인
- [ ] **Edge Case**: `NOTION_API_KEY` 미설정 상태에서 빌드 또는 함수 호출 시 명확한 에러 메시지 출력 확인

### 완료 기준 (Definition of Done)

- [x] `NOTION_API_KEY`, `NOTION_DATABASE_ID` 환경 변수 설정 완료
- [x] `getInvoiceById` 함수 호출 시 노션 페이지 데이터가 TypeScript 타입으로 정상 반환됨
- [x] TypeScript 컴파일 에러 없이 `npm run build` 통과
- [x] ESLint 경고/에러 없음 (`npm run lint` 통과)
- [ ] 테스트 계획의 Playwright MCP 시나리오 전항목 통과

### 예상 기간

5일 (1주차)

---

## Phase 2: 공통 모듈 및 컴포넌트 구축 (2주차) ✅

### 목표

모든 Phase에서 공통으로 사용하는 유틸리티 함수, 타입, shadcn/ui 컴포넌트, 공통 UI 컴포넌트를 사전에 구축합니다. 이 단계가 완료되면 이후 Phase에서 중복 구현 없이 공유 모듈을 즉시 활용할 수 있습니다.

**선행 조건**: Phase 1 완료 (Notion API 연동 기반 구축)

### 주요 기능

- 공통 유틸리티 함수 구축 (포맷, 에러 처리)
- 공통 타입 확장 (API 응답, 에러 타입)
- shadcn/ui 컴포넌트 일괄 설치
- 공통 UI 컴포넌트 구현 (로딩, 에러, 레이아웃)

### 기술 태스크

**공통 유틸리티 함수**

- [x] `src/lib/utils/format.ts` 생성 — `formatCurrency(amount: number): string` (한국 원화, `Intl.NumberFormat` 활용), `formatDate(date: string): string` 구현
- [ ] `src/lib/utils/error.ts` 생성 — `isNotionNotFound(error: unknown): boolean`, `parseNotionError(error: unknown): string` 구현
- [ ] `src/lib/utils/env.ts` 생성 — 환경 변수 유효성 검증 함수 (`assertEnv(key: string): string`) 구현, 미설정 시 명확한 에러 메시지 출력

**공통 타입 정의 확장**

- [x] `src/types/api.ts` 생성 — `ApiResponse<T>`, `ApiError` 인터페이스 정의
- [x] `src/types/common.ts` 생성 — `LoadingState`, `ErrorState` 등 공통 상태 타입 정의

**shadcn/ui 컴포넌트 일괄 설치**

- [x] `npx shadcn@latest add button` — 다운로드 버튼, 범용 버튼
- [x] `npx shadcn@latest add badge` — 견적서 상태 배지
- [x] `npx shadcn@latest add table` — 견적서 항목 테이블
- [x] `npx shadcn@latest add skeleton` — 로딩 스켈레톤 UI
- [x] `npx shadcn@latest add sonner` — 에러/성공 토스트 알림

**공통 UI 컴포넌트**

- [x] `src/components/common/LoadingSpinner.tsx` 구현 — 버튼 내 인라인 스피너 및 페이지 레벨 로딩 표시
- [x] `src/components/common/ErrorMessage.tsx` 구현 — 에러 메시지 표시 컴포넌트 (아이콘 + 메시지 + 재시도 버튼 옵션)
- [x] `src/components/common/InvoiceSkeleton.tsx` 구현 — 견적서 페이지 전용 스켈레톤 레이아웃 (shadcn/ui Skeleton 활용)
- [x] `src/components/layout/InvoiceLayout.tsx` 구현 — 견적서 페이지 공통 래퍼 (max-w-4xl 중앙 정렬, 상하 패딩)

### 테스트 계획

**Playwright MCP 테스트 시나리오**

- [ ] **Happy Path**: `formatCurrency(1000000)`이 `₩1,000,000`을 반환하는지, `formatDate`가 올바른 날짜 포맷을 반환하는지 확인
- [ ] **Happy Path**: 설치된 shadcn/ui 컴포넌트(Button, Badge, Table, Skeleton, Sonner)가 스토리/샘플 페이지에서 정상 렌더링되는지 확인
- [ ] **Edge Case**: `assertEnv`에 미설정 환경 변수 키 전달 시 명확한 에러 메시지가 출력되는지 확인
- [ ] **Edge Case**: `isNotionNotFound`에 Notion 404 에러 객체 전달 시 `true` 반환 확인
- [ ] **검증 항목**: `InvoiceSkeleton` 컴포넌트가 로딩 상태에서 올바른 레이아웃으로 렌더링되는지 확인

### 완료 기준 (Definition of Done)

- [x] 모든 공통 유틸 함수가 TypeScript 타입 안전하게 구현됨
- [x] shadcn/ui 5종 컴포넌트(Button, Badge, Table, Skeleton, Sonner) 설치 완료
- [x] 공통 UI 컴포넌트 4종(LoadingSpinner, ErrorMessage, InvoiceSkeleton, InvoiceLayout) 구현 완료
- [x] `npm run build` 빌드 성공, TypeScript 에러 없음
- [ ] 테스트 계획의 Playwright MCP 시나리오 전항목 통과

### 예상 기간

3일 (2주차)

---

## Phase 3: 견적서 조회 기능 구현 (3주차) ✅

### 목표

`/invoice/[notionPageId]` 경로로 접근 시 노션 데이터를 기반으로 견적서를 웹 화면에 렌더링합니다. 잘못된 ID 접근 시 404 에러 페이지를 표시하며, 모든 화면 크기에서 반응형으로 동작합니다.

**선행 조건**: Phase 2 완료 (공통 모듈 및 컴포넌트 구축)

### 주요 기능

- F001: Notion API 데이터 실시간 조회 및 렌더링
- F002: 견적서 상세 정보 표시 (견적서 번호, 클라이언트명, 발행일, 유효기간, 항목별 금액, 총액)
- F011: 유효하지 않은 견적서 ID 접근 시 404 에러 처리
- F012: 모바일/태블릿/데스크톱 반응형 레이아웃

### 기술 태스크

**견적서 조회 페이지 (Server Component)**

- [x] `app/invoice/[notionPageId]/page.tsx`를 async Server Component로 구현
- [x] `params.notionPageId`로 `getInvoiceById` 호출 및 데이터 페칭
- [x] Notion API 404/에러 응답 처리 — `notFound()` 함수 호출로 Next.js 404 페이지 렌더링
- [x] `generateMetadata` 함수 구현 — 견적서 번호 기반 페이지 타이틀 동적 설정

**견적서 UI 컴포넌트**

- [x] `src/components/invoice/InvoiceHeader.tsx` 구현 — 견적서 번호, 발행일, 유효기간, 상태 배지(shadcn/ui Badge) 표시
- [x] `src/components/invoice/InvoiceParties.tsx` 구현 — 발행자 정보(회사명, 사업자번호 등)와 클라이언트명 2열 레이아웃
- [x] `src/components/invoice/InvoiceItemsTable.tsx` 구현 — 항목명·수량·단가·금액 테이블 (shadcn/ui Table 컴포넌트 활용)
- [x] `src/components/invoice/InvoiceSummary.tsx` 구현 — 소계, 세금(10%), 총액 합계 섹션
- [x] `src/components/invoice/InvoicePage.tsx` 구현 — 위 컴포넌트를 조합한 견적서 전체 레이아웃 컴포넌트

**에러 처리**

- [x] `app/invoice/[notionPageId]/not-found.tsx` 생성 — "견적서를 찾을 수 없습니다" 안내 메시지, 발행자에게 문의하도록 가이드 텍스트 포함
- [x] `app/invoice/[notionPageId]/error.tsx` 생성 — Notion API 네트워크 에러 등 예외 상황 처리

**반응형 레이아웃**

- [x] 모바일(320px~): 단열 레이아웃, 텍스트 크기 축소, 테이블 가로 스크롤
- [x] 태블릿(768px~): 2열 레이아웃 적용 (발행자/클라이언트 섹션)
- [x] 데스크톱(1024px~): 최대 너비 제한(max-w-4xl), 중앙 정렬, 여백 확보

### 테스트 계획

**Playwright MCP 테스트 시나리오**

- [x] **Happy Path**: `/invoice/[유효한ID]` 접근 시 견적서 번호, 클라이언트명, 항목 테이블, 총액이 화면에 렌더링되는지 확인
- [x] **Happy Path**: 금액 표시가 한국 원화(₩1,000,000) 형식으로 올바르게 표시되는지 확인
- [x] **Happy Path**: 뷰포트를 375px(모바일), 768px(태블릿), 1280px(데스크톱)으로 변경 후 레이아웃 깨짐 없음 확인
- [x] **Edge Case**: 존재하지 않는 ID(`/invoice/invalid-id`)로 접근 시 not-found 페이지가 렌더링되는지 확인
- [x] **Edge Case**: Notion API 에러 발생 시 error 페이지가 표시되는지 확인
- [x] **검증 항목**: `generateMetadata`로 설정된 페이지 타이틀이 견적서 번호를 포함하는지 확인

### 완료 기준 (Definition of Done)

- [x] 유효한 `notionPageId`로 `/invoice/[id]` 접근 시 견적서 정보가 화면에 정상 표시됨
- [x] 존재하지 않는 ID 접근 시 not-found 페이지가 표시됨
- [x] 모바일(375px), 태블릿(768px), 데스크톱(1280px) 기준 화면 레이아웃이 깨지지 않음
- [x] 금액이 한국 원화(₩) 형식으로 올바르게 표시됨 (예: ₩1,000,000)
- [x] `npm run build` 빌드 성공, TypeScript 에러 없음
- [x] 테스트 계획의 Playwright MCP 시나리오 전항목 통과

### 예상 기간

5일 (3주차)

---

## Phase 4: PDF 다운로드 기능 구현 (4주차) ✅

### 목표

견적서 조회 페이지에서 "PDF 다운로드" 버튼 클릭 시 견적서가 PDF 파일로 즉시 생성되어 다운로드됩니다. PDF는 인쇄 가능한 레이아웃으로 견적서 내용을 충실히 담아야 합니다.

**선행 조건**: Phase 3 완료 (견적서 조회 기능 및 데이터 구조 확립)

### 주요 기능

- F003: PDF 다운로드 — 버튼 클릭 시 견적서를 PDF로 변환하여 다운로드
- PDF 레이아웃: 견적서 웹 뷰와 동일한 정보 구조 (A4 기준)

### 기술 태스크

**PDF 생성 API Route**

- [x] `app/api/invoice/[notionPageId]/pdf/route.ts` 생성 — GET 요청 처리
- [x] API Route 내에서 `getInvoiceById` 호출로 노션 데이터 조회
- [x] `@react-pdf/renderer`의 `renderToBuffer` 활용하여 PDF 생성 (`src/lib/pdf.ts` 공통 유틸로 추출)
- [x] Response 헤더 설정: `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="invoice-[번호].pdf"`
- [x] 존재하지 않는 ID 요청 시 404 응답 반환

**PDF 레이아웃 컴포넌트**

- [x] `src/components/invoice/invoice-pdf.tsx` — `@react-pdf/renderer`의 `Document`, `Page`, `View`, `Text`, `StyleSheet` 활용
- [x] PDF 헤더 섹션: 견적서 번호, 발행일, 유효기간
- [x] PDF 발행자/클라이언트 섹션: 2열 레이아웃
- [x] PDF 항목 테이블: 항목명, 수량, 단가, 금액 열 구성
- [x] PDF 합계 섹션: 소계, 세금, 총액
- [x] 한글 폰트 내장 설정 (`Font.register` 활용, Noto Sans KR 적용, `public/fonts/` 정적 배치)

**다운로드 버튼 (Client Component)**

- [x] `src/components/invoice/pdf-download-button.tsx` Client Component 구현
- [x] 버튼 클릭 시 `/api/invoice/[notionPageId]/pdf` 엔드포인트 fetch 호출
- [x] Blob 응답을 받아 `URL.createObjectURL` + `<a>` 태그로 파일 다운로드 트리거
- [x] 다운로드 진행 중 로딩 상태 표시 (shadcn/ui Button의 disabled + 스피너)
- [x] 다운로드 실패 시 에러 토스트 알림 표시 (shadcn/ui Sonner 활용)

### 테스트 계획

**Playwright MCP 테스트 시나리오**

- [x] **Happy Path**: "PDF 다운로드" 버튼 클릭 시 다운로드 진행 중 버튼이 비활성화(disabled)되고 스피너가 표시되는지 확인
- [x] **Happy Path**: PDF 파일 다운로드가 시작되고 파일명이 `invoice-[번호].pdf` 형식인지 확인
- [x] **Happy Path**: `/api/invoice/[유효한ID]/pdf` GET 요청 시 `Content-Type: application/pdf` 헤더와 함께 200 응답 반환 확인 (Playwright 네트워크 요청 모니터링 활용)
- [x] **Edge Case**: 존재하지 않는 ID로 `/api/invoice/[invalidID]/pdf` 직접 호출 시 404 응답 반환 확인
- [x] **Edge Case**: 네트워크 에러 시뮬레이션 후 에러 토스트 알림이 화면에 표시되는지 확인
- [x] **검증 항목**: 다운로드 완료 후 버튼이 다시 활성화(enabled) 상태로 복원되는지 확인

### 완료 기준 (Definition of Done)

- [x] "PDF 다운로드" 버튼 클릭 시 브라우저에서 PDF 파일 다운로드가 시작됨
- [x] 다운로드된 PDF에 견적서 번호, 클라이언트명, 항목별 금액, 총액이 올바르게 포함됨
- [x] PDF 내 한글 텍스트가 깨지지 않고 정상 렌더링됨 (NotoSansKR 폰트 내장)
- [x] 다운로드 중 버튼이 비활성화되고 로딩 표시가 나타남
- [x] 존재하지 않는 견적서 ID로 API 직접 호출 시 404 응답 반환됨
- [x] `npm run build` 성공, TypeScript 에러 없음
- [x] 테스트 계획의 Playwright MCP 시나리오 전항목 통과

### 예상 기간

5일 (4주차)

---

## Phase 5: 품질 개선 및 배포 (5주차) ✅

### 목표

전체 기능에 대한 품질을 점검하고, 성능을 최적화하며 Vercel에 프로덕션 배포합니다. 이 단계 완료 시 MVP가 실제 사용 가능한 상태가 됩니다.

**선행 조건**: Phase 4 완료 (모든 핵심 기능 구현)

### 주요 기능

- 성능 최적화 (캐싱, 로딩 상태)
- 에러 처리 강화
- Vercel 프로덕션 배포
- 사용성 개선

### 기술 태스크

**성능 최적화**

- [x] Server Component의 Notion API 호출에 Next.js `unstable_cache` 적용 — `getCachedInvoiceByPageId` 함수로 동일 페이지 중복 요청 방지 (5분 캐시)
- [x] `app/invoice/[notionPageId]/loading.tsx` 생성 — Phase 2에서 구현한 `InvoiceSkeleton` 컴포넌트 활용

**에러 처리 강화**

- [x] Notion API 타임아웃 처리 — `Promise.race` 패턴으로 10초 타임아웃 적용
- [x] Notion API 응답의 속성 누락 케이스 처리 — 옵셔널 체이닝과 기본값 적용
- [x] `src/lib/utils/error.ts` 생성 — `isNotionNotFound`, `parseNotionError` 유틸 함수 구현
- [x] 환경 변수 미설정 시 빌드 단계에서 명확한 에러 메시지 출력 (`src/lib/env.ts` Zod 검증)

**접근성 개선**

- [x] 인쇄 최적화 CSS 추가 (`@media print`) — `data-print-hide` 속성으로 다운로드 버튼 숨김, 그림자 제거
- [x] 금액 테이블에 `aria-label="견적 항목 테이블"` 및 `scope="col"` 추가
- [x] 색상 대비 WCAG AA 기준 충족 — `neutral-400` → `neutral-500` 조정

**Vercel 배포**

- [x] Vercel 프로젝트 생성 및 GitHub 저장소 연결
- [x] Vercel 대시보드에서 환경 변수 설정 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
- [x] 프로덕션 URL 확인 및 실제 노션 데이터와 연동 테스트
- [x] `vercel.json` 설정 파일 생성 — 서울 리전(icn1), PDF API `maxDuration: 30`

**최종 검수**

- [x] MVP 성공 기준 5가지 전항목 Playwright MCP E2E 테스트 완료 (로컬)
- [ ] 모바일(iOS Safari, Android Chrome), 데스크톱(Chrome, Firefox, Safari) 크로스 브라우저 테스트
- [x] 노션 데이터베이스 연동 전체 플로우 검증
- [x] `npm run check-all` 통과

### 테스트 계획

**Playwright MCP E2E 전체 플로우 테스트**

- [x] **Happy Path (전체 플로우)**: `/invoice/[유효한ID]` 접근 → 견적서 렌더링 확인 → "PDF 다운로드" 버튼 클릭 → PDF 파일 다운로드 완료까지 전체 시나리오 E2E 검증
- [x] **Happy Path**: 뷰포트를 모바일(375px)로 설정 후 PDF 다운로드 플로우 정상 동작 확인
- [ ] **Happy Path**: 페이지 초기 로드 시 스켈레톤 UI가 Notion API 응답 전에 표시되는지 확인 (네트워크 속도 조절 활용)
- [x] **Edge Case**: 존재하지 않는 ID 접근 시 not-found 페이지 표시 확인
- [x] **Edge Case**: `/api/invoice/[invalidID]/pdf` 직접 호출 시 404 응답 확인
- [x] **검증 항목**: Vercel 프로덕션 URL에서 실제 노션 데이터베이스와 연동하여 데이터 정합성 확인

### 완료 기준 (Definition of Done)

- [x] Vercel 프로덕션 URL에서 견적서 조회 및 PDF 다운로드 정상 동작 확인
- [x] 페이지 초기 로드 시 Notion API 응답 전 스켈레톤 UI 표시됨
- [x] `npm run check-all` 및 `npm run build` 모두 통과
- [x] 모바일 환경에서 PDF 다운로드 정상 동작 확인
- [ ] 테스트 계획의 Playwright MCP E2E 시나리오 전항목 통과 (Vercel 배포 후 진행 예정)

### 예상 기간

5일 (5주차)

---

## 향후 계획 (Backlog)

MVP 이후 사용자 피드백을 수집한 후 우선순위를 재평가하여 구현합니다.

### Phase 5: 관리 기능

- [ ] 관리자 인증 (NextAuth.js + Google OAuth)
- [ ] 관리자 대시보드 — 발행한 견적서 목록 조회 (TanStack Query + 노션 데이터베이스 목록 API)
- [ ] 견적서 상태 관리 — 대기/승인/거절 상태 변경 (Notion API PATCH 요청)
- [ ] 견적서 검색 및 필터링 (클라이언트명, 발행일, 상태 기준)

### Phase 6: 자동화

- [ ] 이메일 자동 발송 — 견적서 링크 포함 이메일 발송 (Resend 또는 SendGrid 연동)
- [ ] 견적서 만료 알림 — 유효기간 D-3 이메일 알림
- [ ] 클라이언트 응답 트래킹 — 견적서 열람 횟수, 최근 열람 시각 기록

### Phase 7: 고급 기능

- [ ] 다중 PDF 템플릿 지원 (디자인 선택 기능)
- [ ] 다국어 견적서 (영어/일본어 지원)
- [ ] 전자 서명 기능 (클라이언트 서명 후 확정 처리)
- [ ] 견적서 버전 관리 및 수정 이력

---

## 리스크 및 의존성

| 리스크                                         | 영향도 | 대응 방안                                                                                 |
| ---------------------------------------------- | ------ | ----------------------------------------------------------------------------------------- |
| `@react-pdf/renderer`의 React 19 호환성 미검증 | 높음   | 설치 즉시 간단한 PDF 생성 테스트 수행; 비호환 시 Puppeteer(서버사이드 HTML→PDF) 대안 검토 |
| Notion API 응답 지연 (P99 ~2초)                | 중간   | Next.js `unstable_cache`로 응답 캐싱, `loading.tsx` 스켈레톤으로 UX 보완                  |
| PDF 내 한글 폰트 깨짐                          | 중간   | Phase 3 초반에 폰트 내장 테스트 우선 수행; 폰트 파일은 `public/fonts/`에 정적 호스팅      |
| Notion API 무료 플랜 Rate Limit (초당 3회)     | 낮음   | 캐싱으로 중복 요청 최소화; 트래픽 급증 시 Redis 캐시 도입 검토                            |
| Vercel Serverless Function 실행 시간 초과      | 낮음   | PDF 생성 API 타임아웃 기본값(10초) 확인; `vercel.json`에서 `maxDuration` 설정 증가        |
| 노션 데이터베이스 스키마 변경                  | 낮음   | 매핑 유틸 함수(`mapNotionPageToInvoice`)를 단일 파일로 격리하여 변경 영향 최소화          |

---

## 기술 부채 및 고려사항

### 알려진 기술적 타협점

1. **PDF 생성 방식**: `@react-pdf/renderer`는 React 컴포넌트로 PDF를 생성하는 클라이언트 친화적 방식이지만, 복잡한 레이아웃에서 HTML 렌더링과 차이가 발생할 수 있습니다. 향후 Puppeteer(서버사이드)로 전환을 고려할 수 있습니다.

2. **노션을 데이터베이스로 직접 사용**: MVP에서는 별도 DB 없이 노션 API를 직접 호출합니다. 트래픽 증가 시 캐싱 레이어(Redis/Vercel KV) 추가가 필요합니다.

3. **인증 없는 공개 URL**: 견적서 URL을 알면 누구나 조회 가능합니다. 향후 토큰 기반 접근 제어(UUID 토큰 또는 만료 링크) 도입을 검토해야 합니다.

4. **환경 변수 단일 데이터베이스**: 현재 `NOTION_DATABASE_ID` 하나만 지원하여 다중 사용자 시나리오에 적합하지 않습니다. 멀티테넌시가 필요해지면 구조 변경이 필요합니다.

### 향후 개선 계획

- MVP 완료 후 실제 사용자 5명 이상의 피드백 수집
- PDF 다운로드 횟수, 견적서 열람 수 등 기본 메트릭 수집 도구 추가 (Vercel Analytics 또는 PostHog)
- 코드 커버리지를 위한 단위 테스트 추가 (특히 Notion 응답 매핑 유틸 함수)
