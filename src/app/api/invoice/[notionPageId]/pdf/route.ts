import { NextResponse } from 'next/server'
import { getInvoiceByPageId } from '@/lib/notion'
import { generateInvoicePdf } from '@/lib/pdf'

/**
 * PDF 다운로드 API Route
 * GET /api/invoice/[notionPageId]/pdf
 *
 * Notion 페이지 ID를 경로 파라미터로 받아 견적서 PDF를 생성하여 반환합니다.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ notionPageId: string }> }
) {
  const { notionPageId } = await params

  try {
    // Notion API에서 견적서 데이터 조회
    const invoice = await getInvoiceByPageId(notionPageId)

    if (!invoice) {
      return NextResponse.json(
        { error: '견적서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 공통 유틸 함수로 PDF 버퍼 생성
    const pdfBuffer = await generateInvoicePdf(invoice)

    // PDF 파일 응답 반환
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('PDF 생성 오류:', error)
    return NextResponse.json(
      { error: 'PDF 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
