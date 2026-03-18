// 견적서 스켈레톤 로딩 컴포넌트
// 견적서 레이아웃 형태의 스켈레톤을 표시한다
import { Skeleton } from '@/components/ui/skeleton'

export function InvoiceSkeleton() {
  return (
    <div className="space-y-6">
      {/* 헤더 영역: 견적서 번호, 날짜 */}
      <div className="flex items-start justify-between">
        <Skeleton className="h-8 w-40 rounded-none" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded-none" />
          <Skeleton className="h-4 w-28 rounded-none" />
        </div>
      </div>

      {/* 발행자 / 클라이언트 2열 영역 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 발행자 정보 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16 rounded-none" />
          <Skeleton className="h-5 w-32 rounded-none" />
          <Skeleton className="h-4 w-40 rounded-none" />
          <Skeleton className="h-4 w-36 rounded-none" />
        </div>
        {/* 클라이언트 정보 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded-none" />
          <Skeleton className="h-5 w-36 rounded-none" />
          <Skeleton className="h-4 w-44 rounded-none" />
          <Skeleton className="h-4 w-32 rounded-none" />
        </div>
      </div>

      {/* 항목 테이블 영역 */}
      <div className="space-y-2">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-4 w-full rounded-none" />
          <Skeleton className="h-4 w-full rounded-none" />
          <Skeleton className="h-4 w-full rounded-none" />
          <Skeleton className="h-4 w-full rounded-none" />
        </div>
        {/* 테이블 행 3~4개 */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4">
            <Skeleton className="h-8 w-full rounded-none" />
            <Skeleton className="h-8 w-full rounded-none" />
            <Skeleton className="h-8 w-full rounded-none" />
            <Skeleton className="h-8 w-full rounded-none" />
          </div>
        ))}
      </div>

      {/* 합계 영역 */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex w-48 items-center justify-between gap-4">
          <Skeleton className="h-4 w-16 rounded-none" />
          <Skeleton className="h-4 w-20 rounded-none" />
        </div>
        <div className="flex w-48 items-center justify-between gap-4">
          <Skeleton className="h-4 w-12 rounded-none" />
          <Skeleton className="h-4 w-20 rounded-none" />
        </div>
        <div className="flex w-48 items-center justify-between gap-4">
          <Skeleton className="h-5 w-16 rounded-none" />
          <Skeleton className="h-5 w-24 rounded-none" />
        </div>
      </div>
    </div>
  )
}
