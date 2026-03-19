// 견적서 페이지 레이아웃 컴포넌트
// 헤더(테마 토글)와 메인 콘텐츠 영역으로 구성된다
// 인쇄 시 헤더는 숨겨지고 콘텐츠만 출력된다
import { ThemeToggle } from '@/components/common/theme-toggle'

interface InvoiceLayoutProps {
  children: React.ReactNode
}

export function InvoiceLayout({ children }: InvoiceLayoutProps) {
  return (
    <div className="bg-background min-h-screen">
      {/* 헤더: 테마 토글 버튼 배치, 인쇄 시 숨김 */}
      <header
        className="border-border flex justify-end border-b px-4 py-2"
        data-print-hide
      >
        <ThemeToggle />
      </header>
      {/* 메인 콘텐츠 */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
