// 견적서 로딩 페이지
// 견적서 데이터를 불러오는 동안 스켈레톤 UI를 표시한다
import { InvoiceLayout } from '@/components/layout/invoice-layout'
import { InvoiceSkeleton } from '@/components/common/invoice-skeleton'

/**
 * 견적서 로딩 페이지
 * Next.js Suspense 기반으로 데이터 로딩 중 자동으로 표시됩니다.
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <InvoiceLayout>
        <InvoiceSkeleton />
      </InvoiceLayout>
    </main>
  )
}
