// 견적서 목록 스켈레톤 UI
// 로딩 중 테이블 형태의 스켈레톤을 표시한다
import { Skeleton } from '@/components/ui/skeleton'

export function InvoiceListSkeleton() {
  return (
    <div className="space-y-4">
      {/* 필터 영역 스켈레톤 */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-48" />
      </div>

      {/* 테이블 영역 스켈레톤 */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px] space-y-0">
          {/* 헤더 */}
          <div className="grid grid-cols-6 gap-4 border-b px-4 py-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          {/* 행 */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 border-b px-4 py-4">
              {Array.from({ length: 6 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 페이지네이션 스켈레톤 */}
      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>
  )
}
