// 견적서 페이지 조합 컴포넌트
// InvoiceHeader, InvoiceParties, InvoiceItemsTable, InvoiceSummary를 조합하여
// 완성된 견적서 뷰를 구성한다
import type { Invoice } from '@/lib/notion'
import { InvoiceLayout } from '@/components/layout/invoice-layout'
import { Card, CardContent } from '@/components/ui/card'
import { InvoiceHeader } from '@/components/invoice/invoice-header'
import { InvoiceParties } from '@/components/invoice/invoice-parties'
import { InvoiceItemsTable } from '@/components/invoice/invoice-items-table'
import { InvoiceSummary } from '@/components/invoice/invoice-summary'

/**
 * 견적서 페이지 컴포넌트 Props
 */
interface InvoicePageProps {
  invoice: Invoice
}

/**
 * 견적서 페이지 컴포넌트
 * 모든 견적서 섹션을 조합하여 완성된 견적서 화면을 렌더링합니다.
 * InvoiceLayout으로 전체 레이아웃을 감쌉니다.
 */
export function InvoicePage({ invoice }: InvoicePageProps) {
  return (
    <InvoiceLayout>
      <div className="space-y-6">
        {/* 견적서 헤더: 제목, 번호, 상태, 날짜 */}
        <InvoiceHeader
          invoiceNumber={invoice.invoiceNumber}
          issueDate={invoice.issueDate}
          dueDate={invoice.dueDate}
          status={invoice.status}
        />

        {/* 당사자 정보 카드: 발급처, 수신처 */}
        <Card className="rounded-none border border-neutral-200 shadow-none">
          <CardContent>
            <InvoiceParties
              clientName={invoice.clientName}
              clientEmail={invoice.clientEmail}
            />
          </CardContent>
        </Card>

        {/* 견적 항목 및 합계 카드 */}
        <Card className="rounded-none border border-neutral-200 shadow-none">
          <CardContent className="space-y-6">
            {/* 견적 항목 테이블 */}
            <InvoiceItemsTable items={invoice.items} />

            {/* 합계 요약 */}
            <InvoiceSummary
              subtotal={invoice.subtotal}
              tax={invoice.tax}
              total={invoice.total}
              notes={invoice.notes}
            />
          </CardContent>
        </Card>
      </div>
    </InvoiceLayout>
  )
}
