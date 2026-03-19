import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCachedInvoiceList } from '@/lib/notion'
import type { InvoiceStatus } from '@/types/invoice'

// 쿼리 파라미터 검증 스키마
const querySchema = z.object({
  status: z.enum(['all', '대기', '승인', '거절']).optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  cursor: z.string().optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
})

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const parsed = querySchema.safeParse({
    status: searchParams.get('status') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    startDate: searchParams.get('startDate') ?? undefined,
    endDate: searchParams.get('endDate') ?? undefined,
    cursor: searchParams.get('cursor') ?? undefined,
    pageSize: searchParams.get('pageSize') ?? undefined,
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: '잘못된 요청 파라미터입니다.', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { status, search, startDate, endDate, cursor, pageSize } = parsed.data

  try {
    const data = await getCachedInvoiceList(
      {
        status: status as InvoiceStatus | 'all' | undefined,
        search,
        startDate,
        endDate,
      },
      cursor,
      pageSize
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('견적서 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '견적서 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
