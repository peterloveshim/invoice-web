// 로딩 스피너 공통 컴포넌트
// size prop에 따라 스피너 크기를 조절한다
import { cn } from '@/lib/utils'

// size별 클래스 매핑
const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
} as const

type SpinnerSize = keyof typeof sizeClasses

interface LoadingSpinnerProps {
  size?: SpinnerSize
  className?: string
}

export function LoadingSpinner({
  size = 'md',
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="로딩 중"
      className={cn(
        'text-primary animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  )
}
