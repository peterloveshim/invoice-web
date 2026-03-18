// 견적서 합계 요약 컴포넌트
// 소계, 세금, 합계 금액을 우측 정렬로 표시하고, 비고가 있으면 하단에 표시한다
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils/format'

/**
 * 견적서 합계 요약 컴포넌트 Props
 */
interface InvoiceSummaryProps {
  subtotal: number
  tax: number
  total: number
  notes?: string
}

/**
 * 견적서 합계 요약 컴포넌트
 * 소계, 세금(VAT), 합계를 우측 정렬 레이아웃으로 표시하며,
 * 비고가 있을 경우 하단에 별도 섹션으로 표시합니다.
 */
export function InvoiceSummary({
  subtotal,
  tax,
  total,
  notes,
}: InvoiceSummaryProps) {
  return (
    <div className="space-y-4">
      {/* 합계 요약 영역 - 우측 정렬 */}
      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-2">
          {/* 소계 행 */}
          <div className="flex justify-between text-sm text-neutral-500">
            <span>소계</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          {/* 세금 행 */}
          <div className="flex justify-between text-sm text-neutral-500">
            <span>세금 (VAT)</span>
            <span>{formatCurrency(tax)}</span>
          </div>

          {/* 구분선 */}
          <Separator />

          {/* 합계 행 */}
          <div className="flex justify-between text-lg font-black text-neutral-900">
            <span>합계</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* 비고 섹션 - notes가 있을 경우에만 표시 */}
      {notes && (
        <div className="rounded-none border border-neutral-200 bg-neutral-50 p-4">
          <h3 className="text-xs uppercase tracking-widest text-neutral-500">비고</h3>
          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
            {notes}
          </p>
        </div>
      )}
    </div>
  )
}
