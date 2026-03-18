// 견적서 404 Not Found 페이지
// 견적서를 찾을 수 없을 때 표시되는 페이지
import { FileSearch } from 'lucide-react'

/**
 * 견적서 Not Found 페이지
 * 유효하지 않은 견적서 ID로 접근했을 때 표시됩니다.
 */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* 아이콘 */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center bg-neutral-100">
          <FileSearch className="h-8 w-8 text-neutral-400" aria-hidden="true" />
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-black tracking-tight text-neutral-900">
          견적서를 찾을 수 없습니다
        </h1>

        {/* 안내 메시지 */}
        <p className="mt-2 text-base text-neutral-400">
          올바른 URL인지 확인하거나 담당자에게 문의해 주세요.
        </p>
      </div>
    </main>
  )
}
