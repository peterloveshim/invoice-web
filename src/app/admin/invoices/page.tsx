// 관리자 견적서 목록 페이지
import { Suspense } from 'react'
import { InvoiceListContent } from '@/components/admin/invoice-list-content'
import { InvoiceListSkeleton } from '@/components/admin/invoice-list-skeleton'

export const metadata = {
  title: '견적서 목록 | 관리자',
  description: '견적서 목록을 조회하고 관리합니다.',
}

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          견적서 목록
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          견적서를 조회하고 클라이언트 링크를 복사합니다.
        </p>
      </div>

      <Suspense fallback={<InvoiceListSkeleton />}>
        <InvoiceListContent />
      </Suspense>
    </div>
  )
}
