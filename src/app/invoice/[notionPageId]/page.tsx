import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCachedInvoiceByPageId } from '@/lib/notion'
import { InvoicePage as InvoicePageComponent } from '@/components/invoice/invoice-page'

/**
 * 견적서 조회 페이지 Props 타입
 */
interface InvoicePageProps {
  params: Promise<{
    notionPageId: string
  }>
}

/**
 * 동적 메타데이터 생성
 * 견적서 정보를 기반으로 페이지 제목을 설정합니다.
 */
export async function generateMetadata({
  params,
}: InvoicePageProps): Promise<Metadata> {
  const { notionPageId } = await params
  const invoice = await getCachedInvoiceByPageId(notionPageId)

  if (!invoice) {
    return {
      title: '견적서를 찾을 수 없습니다',
    }
  }

  return {
    title: `견적서 ${invoice.invoiceNumber} - ${invoice.clientName}`,
    description: `${invoice.clientName}님의 견적서입니다. 발행일: ${invoice.issueDate}`,
  }
}

/**
 * 견적서 상세 조회 페이지
 * Notion 페이지 ID를 기반으로 견적서 데이터를 조회하여 표시합니다.
 *
 * @param params.notionPageId - Notion 페이지 ID
 */
export default async function Page({ params }: InvoicePageProps) {
  const { notionPageId } = await params

  // Notion API에서 견적서 데이터 조회
  const invoice = await getCachedInvoiceByPageId(notionPageId)

  // 견적서가 없으면 404 페이지 표시
  if (!invoice) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <InvoicePageComponent invoice={invoice} />
    </main>
  )
}
