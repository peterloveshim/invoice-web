import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

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
    const page = await notion.pages.retrieve({ page_id: pageId })

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
    // Notion API 오류 처리 (페이지 없음, 권한 없음, 잘못된 ID 형식 등)
    if (error instanceof Error) {
      const msg = error.message
      if (
        msg.includes('Could not find page') ||
        msg.includes('object_not_found') ||
        msg.includes('unauthorized') ||
        msg.includes('validation_error') ||
        msg.includes('Invalid') ||
        msg.includes('path could not be resolved')
      ) {
        return null
      }
    }
    // APIResponseError의 status 코드로도 처리 (400, 404)
    const apiError = error as { status?: number }
    if (apiError.status === 400 || apiError.status === 404) {
      return null
    }
    throw error
  }
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
