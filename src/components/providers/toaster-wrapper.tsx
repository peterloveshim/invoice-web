// 테마 연동 Toaster 래퍼 컴포넌트
// 현재 테마(라이트/다크/시스템)에 따라 Toaster 스타일을 자동으로 변경한다
'use client'

import { useTheme } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'

export function ToasterWrapper() {
  const { theme } = useTheme()
  return <Toaster theme={theme as 'light' | 'dark' | 'system'} />
}
