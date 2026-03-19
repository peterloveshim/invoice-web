// 관리자 헤더 컴포넌트
// 로고, 네비게이션, 테마 토글을 포함한다
import Link from 'next/link'
import { ThemeToggle } from '@/components/common/theme-toggle'

export function AdminHeader() {
  return (
    <header className="border-border bg-background sticky top-0 z-10 border-b">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* 로고 */}
        <Link
          href="/admin/invoices"
          className="text-foreground text-sm font-semibold tracking-tight hover:opacity-80"
        >
          견적서 관리
        </Link>

        {/* 네비게이션 + 테마 토글 */}
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1">
            <Link
              href="/admin/invoices"
              className="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors"
            >
              견적서 목록
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
