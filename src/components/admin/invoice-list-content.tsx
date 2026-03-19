'use client'

// 견적서 목록 콘텐츠 컴포넌트
// 필터, 테이블, 페이지네이션을 조합한 클라이언트 컴포넌트
import { useQueryState } from 'nuqs'
import { useInvoiceList } from '@/hooks/use-invoice-list'
import { InvoiceListFilters } from '@/components/admin/invoice-list-filters'
import { InvoiceListTable } from '@/components/admin/invoice-list-table'
import { InvoiceListPagination } from '@/components/admin/invoice-list-pagination'
import { InvoiceListSkeleton } from '@/components/admin/invoice-list-skeleton'
import type { InvoiceStatus } from '@/types/invoice'

export function InvoiceListContent() {
  const [status] = useQueryState('status', { defaultValue: 'all' })
  const [search] = useQueryState('search', { defaultValue: '' })
  const [cursor] = useQueryState('cursor', { defaultValue: '' })

  const { data, isLoading, isError } = useInvoiceList({
    status: (status as InvoiceStatus | 'all') || 'all',
    search: search || undefined,
    cursor: cursor || undefined,
  })

  if (isLoading) {
    return <InvoiceListSkeleton />
  }

  if (isError) {
    return (
      <div className="text-destructive py-12 text-center text-sm">
        견적서 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <InvoiceListFilters />
      <InvoiceListTable items={data?.items ?? []} />
      <InvoiceListPagination
        hasMore={data?.hasMore ?? false}
        nextCursor={data?.nextCursor ?? null}
      />
    </div>
  )
}
