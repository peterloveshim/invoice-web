// 테마 전환 토글 컴포넌트
// 라이트/다크/시스템 3가지 테마를 드롭다운으로 전환한다
'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // 클라이언트 마운트 여부 추적 -- SSR hydration 불일치 방지
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 마운트 전에는 고정 아이콘(Monitor)으로 렌더링하여 SSR과 일치시킴
  const Icon = !mounted
    ? Monitor
    : theme === 'light'
      ? Sun
      : theme === 'dark'
        ? Moon
        : Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="테마 변경">
          <Icon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* 라이트 모드 선택 */}
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          라이트
        </DropdownMenuItem>
        {/* 다크 모드 선택 */}
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          다크
        </DropdownMenuItem>
        {/* 시스템 설정 따르기 */}
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          시스템
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
