import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * 404 Not Found 페이지
 * 존재하지 않는 견적서 또는 잘못된 URL 접근 시 표시됩니다.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          견적서를 찾을 수 없습니다
        </h2>
        <p className="mt-2 text-gray-500">
          요청하신 견적서가 존재하지 않거나 삭제되었습니다.
          <br />
          올바른 URL인지 확인하거나 담당자에게 문의해 주세요.
        </p>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/">홈으로 이동</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
