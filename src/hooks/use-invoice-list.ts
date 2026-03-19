'use client'

// 견적서 목록 데이터 조회 훅
// TanStack Query로 /api/admin/invoices를 조회한다
import { useQuery } from '@tanstack/react-query'
import type { InvoiceFilter, InvoiceListResponse } from '@/types/invoice'

interface UseInvoiceListParams extends InvoiceFilter {
  cursor?: string
  pageSize?: number
}

async function fetchInvoiceList(
  params: UseInvoiceListParams
): Promise<InvoiceListResponse> {
  const searchParams = new URLSearchParams()

  if (params.status && params.status !== 'all') {
    searchParams.set('status', params.status)
  }
  if (params.search) {
    searchParams.set('search', params.search)
  }
  if (params.startDate) {
    searchParams.set('startDate', params.startDate)
  }
  if (params.endDate) {
    searchParams.set('endDate', params.endDate)
  }
  if (params.cursor) {
    searchParams.set('cursor', params.cursor)
  }
  if (params.pageSize) {
    searchParams.set('pageSize', String(params.pageSize))
  }

  const query = searchParams.toString()
  const res = await fetch(`/api/admin/invoices${query ? `?${query}` : ''}`)

  if (!res.ok) {
    throw new Error('견적서 목록을 불러오는데 실패했습니다.')
  }

  return res.json() as Promise<InvoiceListResponse>
}

export function useInvoiceList(params: UseInvoiceListParams = {}) {
  return useQuery({
    queryKey: ['admin-invoices', params],
    queryFn: () => fetchInvoiceList(params),
  })
}
