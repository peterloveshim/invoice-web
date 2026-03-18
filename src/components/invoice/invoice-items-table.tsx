// 견적서 항목 테이블 컴포넌트
// 견적 항목 목록을 테이블 형태로 표시하며, 모바일에서는 가로 스크롤을 지원한다
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils/format'
import type { InvoiceItem } from '@/lib/notion'

/**
 * 견적서 항목 테이블 컴포넌트 Props
 */
interface InvoiceItemsTableProps {
  items: InvoiceItem[]
}

/**
 * 견적서 항목 테이블 컴포넌트
 * 항목명, 수량, 단가, 금액을 표시하며 항목이 없을 경우 빈 상태 메시지를 표시합니다.
 */
export function InvoiceItemsTable({ items }: InvoiceItemsTableProps) {
  return (
    /* 모바일 가로 스크롤 래퍼 */
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">항목</TableHead>
            <TableHead className="text-right">수량</TableHead>
            <TableHead className="text-right">단가</TableHead>
            <TableHead className="text-right">금액</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.length > 0 ? (
            // 항목이 있는 경우 각 행 렌더링
            items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-gray-900">
                  {item.description}
                </TableCell>
                <TableCell className="text-right text-gray-600">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-right text-gray-600">
                  {formatCurrency(item.unitPrice)}
                </TableCell>
                <TableCell className="text-right font-medium text-gray-900">
                  {formatCurrency(item.amount)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            // 항목이 없는 경우 빈 상태 메시지 표시
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-8 text-center text-gray-500"
              >
                견적 항목이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
