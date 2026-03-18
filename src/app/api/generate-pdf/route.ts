import { NextRequest, NextResponse } from 'next/server'
import { getInvoiceByPageId } from '@/lib/notion'
import { generateInvoicePdf } from '@/lib/pdf'

/**
 * PDF 생성 API Route (레거시 경로 유지)
 * GET /api/generate-pdf?invoiceId={notionPageId}
 *
 * 신규 RESTful 경로: GET /api/invoice/[notionPageId]/pdf
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const invoiceId = searchParams.get('invoiceId')

  // invoiceId 파라미터 검증
  if (!invoiceId) {
    return NextResponse.json(
      { error: 'invoiceId 파라미터가 필요합니다.' },
      { status: 400 }
    )
  }

  try {
    // Notion API에서 견적서 데이터 조회
    const invoice = await getInvoiceByPageId(invoiceId)

    if (!invoice) {
      return NextResponse.json(
        { error: '견적서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 공통 유틸 함수로 PDF 버퍼 생성
    const pdfBuffer = await generateInvoicePdf(invoice)

    // PDF 파일을 응답으로 반환
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
