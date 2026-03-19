// 견적서 목록 로딩 페이지
import { InvoiceListSkeleton } from '@/components/admin/invoice-list-skeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="bg-muted h-8 w-40 animate-pulse rounded" />
        <div className="bg-muted h-4 w-60 animate-pulse rounded" />
      </div>
      <InvoiceListSkeleton />
    </div>
  )
}
