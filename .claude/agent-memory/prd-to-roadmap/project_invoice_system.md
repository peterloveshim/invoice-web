---
name: 노션 기반 견적서 관리 시스템 프로젝트 정보
description: invoice-web 프로젝트의 핵심 비즈니스 도메인, 기능 우선순위, 아키텍처 결정 사항
type: project
---

노션 데이터베이스를 백엔드로 활용하는 견적서 조회/다운로드 MVP 시스템.

**핵심 도메인 용어**

- Invoice(견적서): 노션 페이지 1개 = 견적서 1개
- InvoiceItem(견적 항목): 별도 노션 데이터베이스, Invoice와 Relation으로 연결
- notionPageId: 견적서의 고유 식별자 (URL 파라미터로 사용)

**기능 우선순위 (MoSCoW)**

- Must Have: F001(노션 연동), F002(견적서 조회), F003(PDF 다운로드), F011(유효성 검증), F012(반응형)
- MVP 이후: 관리자 대시보드, 상태 관리, 이메일 자동 발송, 전자 서명

**아키텍처 결정 사항**

- 별도 DB 없이 Notion API를 직접 데이터 소스로 사용 (MVP 범위)
- PDF 생성: @react-pdf/renderer 우선 채택, React 19 호환성 이슈 시 Puppeteer로 대안
- 인증 없는 공개 URL 구조 (URL 알면 누구나 접근 가능 — MVP 타협점)
- 환경 변수: NOTION_API_KEY, NOTION_DATABASE_ID 2개 필수

**로드맵 구성 (4 Phase, 총 4주)**

- Phase 1 (1주): 환경 설정 + Notion API 기반 구축
- Phase 2 (2주): 견적서 조회 페이지 렌더링 + 반응형 + 에러 처리
- Phase 3 (3주): PDF 생성 API Route + 다운로드 버튼 + 한글 폰트
- Phase 4 (4주): 성능 최적화 + 캐싱 + Vercel 배포

**주요 리스크**

- @react-pdf/renderer React 19 호환성 (Phase 3 초반 즉시 검증 필요)
- PDF 내 한글 폰트 깨짐 (public/fonts/ 정적 호스팅 + Font.register 처리)
- Notion API Rate Limit (초당 3회) — Next.js unstable_cache로 대응

**Why:** MVP 빠른 출시 후 사용자 피드백 기반 개선 전략.
**How to apply:** 로드맵 업데이트 시 이 결정들을 기준점으로 활용. 기능 추가 제안 시 "MVP 이후 Backlog"인지 현재 Phase 포함인지 명확히 구분.
