import { isNotionNotFound } from '@/lib/utils/error'
import type {
  InvoiceFilter,
  InvoiceListItem,
  InvoiceListResponse,
  InvoiceStatus,
} from '@/types/invoice'
import { Client } from '@notionhq/client'
import type {
  PageObjectResponse,
  QueryDataSourceParameters,
} from '@notionhq/client/build/src/api-endpoints'
import { unstable_cache } from 'next/cache'

/**
 * 견적서 항목 타입 정의
 */
export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

/**
 * 견적서 데이터 타입 정의
 */
export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  issueDate: string
  dueDate: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  notes: string
  status: 'draft' | 'sent' | 'paid' | 'cancelled'
}

/**
 * Notion 페이지 프로퍼티 타입 가드
 * 전체 페이지 객체인지 확인합니다.
 */
function isFullPage(page: { object: string }): page is PageObjectResponse {
  return page.object === 'page'
}

/**
 * Notion 클라이언트 인스턴스 생성
 * 서버 사이드에서만 호출됩니다.
 */
function createNotionClient(): Client {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) {
    throw new Error('NOTION_API_KEY 환경변수가 설정되지 않았습니다.')
  }
  return new Client({ auth: apiKey })
}

/**
 * 텍스트 프로퍼티 추출 헬퍼 함수
 */
function extractText(
  prop: PageObjectResponse['properties'][string] | undefined
): string {
  if (!prop) return ''
  if (prop.type === 'title') {
    return prop.title.map(t => t.plain_text).join('')
  }
  if (prop.type === 'rich_text') {
    return prop.rich_text.map(t => t.plain_text).join('')
  }
  return ''
}

/**
 * 날짜 프로퍼티 추출 헬퍼 함수
 */
function extractDate(
  prop: PageObjectResponse['properties'][string] | undefined
): string {
  if (!prop) return ''
  if (prop.type === 'date' && prop.date) {
    return prop.date.start
  }
  return ''
}

/**
 * 숫자 프로퍼티 추출 헬퍼 함수
 */
function extractNumber(
  prop: PageObjectResponse['properties'][string] | undefined
): number {
  if (!prop) return 0
  if (prop.type === 'number' && prop.number !== null) {
    return prop.number
  }
  return 0
}

/**
 * 선택 프로퍼티 추출 헬퍼 함수
 */
function extractSelect(
  prop: PageObjectResponse['properties'][string] | undefined
): string {
  if (!prop) return ''
  if (prop.type === 'select' && prop.select) {
    return prop.select.name
  }
  // Notion의 Status 필드 타입 처리 (select와 별도 타입)
  if (prop.type === 'status' && prop.status) {
    return prop.status.name
  }
  return ''
}

/**
 * Relation 프로퍼티로 연결된 견적 항목 페이지들을 조회합니다.
 * @param relationPageIds - 항목 페이지 ID 배열
 * @returns 견적 항목 배열
 */
async function getInvoiceItems(
  relationPageIds: string[]
): Promise<InvoiceItem[]> {
  if (relationPageIds.length === 0) return []

  const notion = createNotionClient()

  const results = await Promise.all(
    relationPageIds.map(async id => {
      try {
        const page = await notion.pages.retrieve({ page_id: id })
        if (!isFullPage(page)) return null

        const props = page.properties
        const description = extractText(
          props['항목명'] ?? props['Description'] ?? props['Name']
        )
        const quantity = extractNumber(props['수량'] ?? props['Quantity'])
        const unitPrice = extractNumber(props['단가'] ?? props['Unit Price'])
        const amount = quantity * unitPrice

        return {
          description,
          quantity,
          unitPrice,
          amount,
        } satisfies InvoiceItem
      } catch {
        // 개별 항목 조회 실패 시 skip
        return null
      }
    })
  )

  return results.filter((item): item is InvoiceItem => item !== null)
}

/**
 * Notion 페이지 ID로 견적서 데이터를 조회합니다.
 * @param pageId - Notion 페이지 ID
 * @returns 견적서 데이터 또는 null (페이지가 없을 경우)
 */
export async function getInvoiceByPageId(
  pageId: string
): Promise<Invoice | null> {
  const notion = createNotionClient()

  try {
    // 10초 타임아웃 적용
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 10000)
    )
    const page = await Promise.race([
      notion.pages.retrieve({ page_id: pageId }),
      timeoutPromise,
    ])

    if (!isFullPage(page)) {
      return null
    }

    const properties = page.properties
    const subtotal = extractNumber(properties['소계'] ?? properties['Subtotal'])
    const tax = extractNumber(properties['세금'] ?? properties['Tax'])

    const statusRaw = extractSelect(properties['상태'] ?? properties['Status'])
    const validStatuses: Invoice['status'][] = [
      'draft',
      'sent',
      'paid',
      'cancelled',
    ]
    const status: Invoice['status'] = validStatuses.includes(
      statusRaw as Invoice['status']
    )
      ? (statusRaw as Invoice['status'])
      : 'draft'

    const invoice: Invoice = {
      id: page.id,
      invoiceNumber: extractText(
        properties['견적번호'] ?? properties['Invoice Number']
      ),
      clientName: extractText(
        properties['고객명'] ?? properties['Client Name']
      ),
      clientEmail: extractText(
        properties['고객이메일'] ?? properties['Client Email']
      ),
      issueDate: extractDate(properties['발행일'] ?? properties['Issue Date']),
      dueDate: extractDate(properties['만료일'] ?? properties['Due Date']),
      items: await (async () => {
        const relationProp = properties['항목'] ?? properties['Items']
        if (relationProp?.type === 'relation') {
          return getInvoiceItems(relationProp.relation.map(r => r.id))
        }
        return []
      })(),
      subtotal,
      tax,
      total: subtotal + tax,
      notes: extractText(properties['비고'] ?? properties['Notes']),
      status,
    }

    return invoice
  } catch (error) {
    // 페이지 없음 / 권한 없음 / 잘못된 ID 등의 에러는 null 반환
    if (isNotionNotFound(error)) {
      return null
    }
    throw error
  }
}

/**
 * 캐시가 적용된 견적서 조회 함수
 * 동일 페이지 요청 시 5분간 캐시된 결과를 반환합니다.
 * @param pageId - Notion 페이지 ID
 */
export async function getCachedInvoiceByPageId(
  pageId: string
): Promise<Invoice | null> {
  const cachedFn = unstable_cache(getInvoiceByPageId, ['invoice', pageId], {
    tags: [`invoice-${pageId}`],
    revalidate: 300,
  })
  return cachedFn(pageId)
}

/**
 * 데이터베이스 ID에서 첫 번째 데이터 소스 ID를 조회합니다.
 * Notion SDK v5에서는 databases.query 대신 dataSources.query를 사용합니다.
 */
async function getDataSourceId(
  notion: Client,
  databaseId: string
): Promise<string> {
  const db = await notion.databases.retrieve({ database_id: databaseId })
  if (db.object !== 'database') {
    throw new Error(`데이터베이스 ${databaseId}를 찾을 수 없습니다.`)
  }
  const fullDb = db as typeof db & {
    data_sources?: Array<{ id: string; name: string }>
  }
  if (!fullDb.data_sources?.length) {
    throw new Error(`데이터베이스 ${databaseId}에 데이터 소스가 없습니다.`)
  }
  return fullDb.data_sources[0].id
}

/**
 * Notion 데이터베이스에서 견적서 목록을 조회합니다.
 * @param filter - 필터 조건 (상태, 검색어, 날짜 범위)
 * @param cursor - 페이지네이션 커서
 * @param pageSize - 페이지 크기 (기본 10)
 * @returns 견적서 목록 응답
 */
export async function getInvoiceList(
  filter: InvoiceFilter = {},
  cursor?: string,
  pageSize = 10
): Promise<InvoiceListResponse> {
  const notion = createNotionClient()
  const databaseId = process.env.NOTION_DATABASE_ID

  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.')
  }

  // Notion 필터 조건 조합
  const filterConditions: object[] = []

  if (filter.status && filter.status !== 'all') {
    filterConditions.push({
      property: '상태',
      status: { equals: filter.status },
    })
  }

  if (filter.search) {
    filterConditions.push({
      property: '고객명',
      title: { contains: filter.search },
    })
  }

  if (filter.startDate) {
    filterConditions.push({
      property: '발행일',
      date: { on_or_after: filter.startDate },
    })
  }

  if (filter.endDate) {
    filterConditions.push({
      property: '발행일',
      date: { on_or_before: filter.endDate },
    })
  }

  const queryFilter =
    filterConditions.length === 1
      ? filterConditions[0]
      : filterConditions.length > 1
        ? { and: filterConditions }
        : undefined

  // databases.query가 제거된 SDK v5에서는 dataSources.query를 사용
  const dataSourceId = await getDataSourceId(notion, databaseId)

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: queryFilter as QueryDataSourceParameters['filter'],
    sorts: [{ property: '발행일', direction: 'descending' }],
    start_cursor: cursor,
    page_size: pageSize,
  })

  // 유효한 상태 값 목록
  const validStatuses: InvoiceStatus[] = ['대기', '승인', '거절']

  const items: InvoiceListItem[] = response.results
    .filter(isFullPage)
    .map((page: PageObjectResponse) => {
      const props = page.properties
      const statusRaw = extractSelect(props['상태'] ?? props['Status'])
      const status: InvoiceStatus = validStatuses.includes(
        statusRaw as InvoiceStatus
      )
        ? (statusRaw as InvoiceStatus)
        : '대기'

      const subtotal = extractNumber(props['소계'] ?? props['Subtotal'])
      const tax = extractNumber(props['세금'] ?? props['Tax'])

      return {
        id: page.id,
        invoiceNumber: extractText(
          props['견적번호'] ?? props['Invoice Number']
        ),
        clientName: extractText(props['고객명'] ?? props['Client Name']),
        issueDate: extractDate(props['발행일'] ?? props['Issue Date']),
        status,
        total: subtotal + tax,
      } satisfies InvoiceListItem
    })

  return {
    items,
    nextCursor: response.next_cursor,
    hasMore: response.has_more,
  }
}

/**
 * 캐시가 적용된 견적서 목록 조회 함수 (60초 TTL)
 */
export async function getCachedInvoiceList(
  filter: InvoiceFilter = {},
  cursor?: string,
  pageSize = 10
): Promise<InvoiceListResponse> {
  const cacheKey = JSON.stringify({ filter, cursor, pageSize })
  const cachedFn = unstable_cache(
    () => getInvoiceList(filter, cursor, pageSize),
    ['admin-invoices', cacheKey],
    { tags: ['admin-invoices'], revalidate: 60 }
  )
  return cachedFn()
}

/**
 * Notion 데이터베이스에서 모든 견적서 페이지 ID를 조회합니다.
 * @returns 페이지 ID 목록
 */
export async function getInvoiceIds(): Promise<string[]> {
  const notion = createNotionClient()
  const databaseId = process.env.NOTION_DATABASE_ID

  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.')
  }

  // Notion v5 SDK에서는 search API를 통해 데이터베이스 항목을 조회합니다.
  const response = await notion.search({
    filter: {
      value: 'page',
      property: 'object',
    },
  })

  return response.results
    .filter(result => isFullPage(result as { object: string }))
    .map(result => result.id)
}
