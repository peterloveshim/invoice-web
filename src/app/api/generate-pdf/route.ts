import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { getInvoiceByPageId } from '@/lib/notion'
import { InvoicePdfDocument } from '@/components/invoice/invoice-pdf'

/**
 * PDF 생성 API Route
 * GET /api/generate-pdf?invoiceId={notionPageId}
 *
 * Notion 페이지 ID를 기반으로 견적서 PDF를 생성하여 반환합니다.
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

    // @react-pdf/renderer로 PDF 버퍼 생성
    const element = createElement(InvoicePdfDocument, { invoice })
    // renderToBuffer는 Uint8Array 또는 Buffer를 반환합니다.
    const pdfBuffer = await renderToBuffer(
      element as Parameters<typeof renderToBuffer>[0]
    )

    // PDF 파일을 응답으로 반환
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="estimate_${invoice.invoiceNumber}.pdf"`,
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
