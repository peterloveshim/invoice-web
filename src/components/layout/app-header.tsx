// 공통 앱 헤더 컴포넌트
// 테마 토글 버튼을 포함하며, 인쇄 시 숨겨진다
import { ThemeToggle } from '@/components/common/theme-toggle'

export function AppHeader() {
  return (
    <header
      className="border-border flex justify-end border-b px-4 py-2"
      data-print-hide
    >
      <ThemeToggle />
    </header>
  )
}
