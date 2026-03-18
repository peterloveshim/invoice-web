'use client'

import type { Invoice } from '@/lib/notion'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Download } from 'lucide-react'

/**
 * 견적서 상태별 뱃지 색상 매핑
 */
const statusConfig: Record<
  Invoice['status'],
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
> = {
  draft: { label: '초안', variant: 'secondary' },
  sent: { label: '발송됨', variant: 'default' },
  paid: { label: '결제완료', variant: 'default' },
  cancelled: { label: '취소됨', variant: 'destructive' },
}

/**
 * 견적서 뷰 컴포넌트 Props
 */
interface InvoiceViewProps {
  invoice: Invoice
}

/**
 * 견적서 상세 내용을 표시하는 컴포넌트
 * PDF 다운로드 기능을 포함합니다.
 */
export function InvoiceView({ invoice }: InvoiceViewProps) {
  const status = statusConfig[invoice.status] ?? {
    label: invoice.status,
    variant: 'secondary' as const,
  }

  /**
   * PDF 다운로드 핸들러
   * API Route를 통해 PDF를 생성하고 다운로드합니다.
   */
  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(`/api/generate-pdf?invoiceId=${invoice.id}`)
      if (!response.ok) {
        throw new Error('PDF 생성에 실패했습니다.')
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `견적서_${invoice.invoiceNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF 다운로드 오류:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 영역 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">견적서</h1>
          <p className="mt-1 text-lg text-gray-500">#{invoice.invoiceNumber}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={status.variant}>{status.label}</Badge>
          <Button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            PDF 다운로드
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* 발급처 정보 */}
            <div>
              <h2 className="text-sm font-medium text-gray-500">발급처</h2>
              <p className="mt-1 text-base font-semibold text-gray-900">귀하</p>
            </div>

            {/* 수신처 정보 */}
            <div>
              <h2 className="text-sm font-medium text-gray-500">수신처</h2>
              <p className="mt-1 text-base font-semibold text-gray-900">
                {invoice.clientName}
              </p>
              {invoice.clientEmail && (
                <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
              )}
            </div>

            {/* 발행일 */}
            <div>
              <h2 className="text-sm font-medium text-gray-500">발행일</h2>
              <p className="mt-1 text-base text-gray-900">
                {formatDate(invoice.issueDate)}
              </p>
            </div>

            {/* 만료일 */}
            <div>
              <h2 className="text-sm font-medium text-gray-500">유효기간</h2>
              <p className="mt-1 text-base text-gray-900">
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>
        </CardHeader>

        <Separator />

        {/* 견적 항목 테이블 */}
        <CardContent className="pt-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            견적 내역
          </h2>

          {invoice.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left font-medium text-gray-500">
                      항목
                    </th>
                    <th className="pb-3 text-right font-medium text-gray-500">
                      수량
                    </th>
                    <th className="pb-3 text-right font-medium text-gray-500">
                      단가
                    </th>
                    <th className="pb-3 text-right font-medium text-gray-500">
                      금액
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3 text-gray-900">{item.description}</td>
                      <td className="py-3 text-right text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right text-gray-600">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-3 text-right font-medium text-gray-900">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">
              견적 항목이 없습니다.
            </p>
          )}

          {/* 합계 영역 */}
          <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>소계</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>세금 (VAT)</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>합계</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>

          {/* 비고 */}
          {invoice.notes && (
            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700">비고</h3>
              <p className="mt-1 text-sm whitespace-pre-wrap text-gray-600">
                {invoice.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
