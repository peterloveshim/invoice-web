// 견적서 페이지 레이아웃 컴포넌트
// 공통 헤더(AppHeader)와 메인 콘텐츠 영역으로 구성된다
// 인쇄 시 헤더는 숨겨지고 콘텐츠만 출력된다
import { AppHeader } from '@/components/layout/app-header'

interface InvoiceLayoutProps {
  children: React.ReactNode
}

export function InvoiceLayout({ children }: InvoiceLayoutProps) {
  return (
    <div className="bg-background min-h-screen">
      <AppHeader />
      {/* 메인 콘텐츠 */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
