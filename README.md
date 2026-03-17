# 노션 기반 견적서 관리 시스템

노션(Notion)을 데이터베이스로 활용하여 견적서를 관리하고, 클라이언트가 웹에서 조회 및 PDF 다운로드할 수 있는 시스템입니다.

## 기술 스택

- **Framework**: Next.js 15.5.3 (App Router + Turbopack)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS v4 + shadcn/ui
- **Notion 연동**: @notionhq/client
- **PDF 생성**: @react-pdf/renderer
- **배포**: Vercel

## 핵심 기능

- `F001`: 노션 API를 통한 견적서 데이터 조회
- `F002`: 고유 URL(`/invoice/[notionPageId]`)로 견적서 조회
- `F003`: PDF 다운로드
- `F011`: 견적서 유효성 검증 (404 처리)
- `F012`: 반응형 레이아웃

## 시작하기

### 1. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열고 다음 값을 설정하세요:

```env
# Notion 통합 토큰 (https://www.notion.so/my-integrations)
NOTION_API_KEY=secret_xxx...

# 견적서 데이터베이스 ID
NOTION_DATABASE_ID=xxx...
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000/invoice/{노션페이지ID}` 로 접속하세요.

## Notion 데이터베이스 설정

견적서 데이터베이스에는 다음 속성이 필요합니다:

| 속성명     | 타입   | 설명                            |
| ---------- | ------ | ------------------------------- |
| 견적번호   | 제목   | 견적서 고유 번호                |
| 고객명     | 텍스트 | 고객 이름                       |
| 고객이메일 | 텍스트 | 고객 이메일                     |
| 발행일     | 날짜   | 견적서 발행일                   |
| 만료일     | 날짜   | 견적서 유효기간                 |
| 소계       | 숫자   | 세금 전 금액                    |
| 세금       | 숫자   | 부가가치세                      |
| 상태       | 선택   | draft / sent / paid / cancelled |
| 비고       | 텍스트 | 추가 메모                       |

## 페이지 구조

```
/invoice/[id]   - 견적서 조회 페이지 (공개 URL)
/not-found      - 404 에러 페이지
```

## API

```
GET /api/generate-pdf?invoiceId={notionPageId}
```

견적서 PDF를 생성하여 다운로드합니다.

## 개발 명령어

```bash
npm run dev          # 개발 서버 실행 (Turbopack)
npm run build        # 프로덕션 빌드
npm run check-all    # 타입체크 + 린트 + 포맷 검사
```

## 배포

Vercel에 배포 시 환경변수를 프로젝트 설정에 추가해야 합니다:

- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`
