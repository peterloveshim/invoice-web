import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import type { Invoice } from '@/lib/notion'
import { InvoicePdfDocument } from '@/components/invoice/invoice-pdf'

/**
 * 견적서 Invoice 데이터를 PDF Buffer로 변환하는 공통 유틸 함수
 * API Route에서 공유하여 중복 구현을 방지합니다.
 *
 * @param invoice - 견적서 데이터
 * @returns PDF 바이너리 Buffer
 */
export async function generateInvoicePdf(invoice: Invoice): Promise<Buffer> {
  const element = createElement(InvoicePdfDocument, { invoice })
  const buffer = await renderToBuffer(
    element as Parameters<typeof renderToBuffer>[0]
  )
  return Buffer.from(buffer)
}
