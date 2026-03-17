'use client'

import { Toaster as Sonner, type ToasterProps } from 'sonner'

/**
 * 알림 토스트 컴포넌트
 * next-themes 없이 라이트 테마 고정으로 사용합니다.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
