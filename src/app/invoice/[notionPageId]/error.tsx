'use client'

// 견적서 에러 페이지 (Client Component 필수)
// Next.js 요구사항에 따라 error.tsx는 반드시 Client Component여야 한다
import { ErrorMessage } from '@/components/common/error-message'

/**
 * 견적서 에러 페이지 Props
 */
interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * 견적서 에러 페이지
 * 견적서 조회 중 오류가 발생했을 때 표시됩니다.
 * reset 함수를 통해 페이지 재시도가 가능합니다.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorMessage
          message={error.message || '견적서를 불러오는 중 오류가 발생했습니다.'}
          onRetry={reset}
        />
      </div>
    </main>
  )
}
