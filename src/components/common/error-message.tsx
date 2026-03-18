// 에러 메시지 공통 컴포넌트
// 에러 아이콘과 메시지를 표시하며, 재시도 버튼을 선택적으로 렌더링한다
import { AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      {/* 에러 아이콘 및 메시지 영역 */}
      <div className="text-destructive flex items-center gap-2">
        <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        <p className="text-sm font-medium">{message}</p>
      </div>

      {/* 재시도 버튼: onRetry가 있을 경우에만 렌더링 */}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  )
}
