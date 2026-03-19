/** 견적서 상태 타입 (Notion DB 실제 값) */
export type InvoiceStatus = '대기' | '승인' | '거절'

/** 견적서 목록 항목 */
export interface InvoiceListItem {
  id: string
  invoiceNumber: string
  clientName: string
  issueDate: string
  status: InvoiceStatus
  total: number
}

/** 견적서 목록 필터 */
export interface InvoiceFilter {
  status?: InvoiceStatus | 'all'
  search?: string
  startDate?: string
  endDate?: string
}

/** 견적서 목록 응답 */
export interface InvoiceListResponse {
  items: InvoiceListItem[]
  nextCursor: string | null
  hasMore: boolean
}
