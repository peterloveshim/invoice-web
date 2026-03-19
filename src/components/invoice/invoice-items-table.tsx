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
      <Table aria-label="견적 항목 테이블">
        <TableHeader>
          <TableRow>
            <TableHead
              scope="col"
              className="py-3 text-left text-xs font-medium tracking-widest text-neutral-500 uppercase dark:text-neutral-400"
            >
              항목
            </TableHead>
            <TableHead
              scope="col"
              className="py-3 text-right text-xs font-medium tracking-widest text-neutral-500 uppercase dark:text-neutral-400"
            >
              수량
            </TableHead>
            <TableHead
              scope="col"
              className="py-3 text-right text-xs font-medium tracking-widest text-neutral-500 uppercase dark:text-neutral-400"
            >
              단가
            </TableHead>
            <TableHead
              scope="col"
              className="py-3 text-right text-xs font-medium tracking-widest text-neutral-500 uppercase dark:text-neutral-400"
            >
              금액
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.length > 0 ? (
            // 항목이 있는 경우 각 행 렌더링
            items.map((item, index) => (
              <TableRow
                key={index}
                className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                <TableCell className="py-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {item.description}
                </TableCell>
                <TableCell className="py-4 text-right text-sm text-neutral-500 dark:text-neutral-400">
                  {item.quantity}
                </TableCell>
                <TableCell className="py-4 text-right text-sm text-neutral-500 dark:text-neutral-400">
                  {formatCurrency(item.unitPrice)}
                </TableCell>
                <TableCell className="py-4 text-right text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(item.amount)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            // 항목이 없는 경우 빈 상태 메시지 표시
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-8 text-center text-sm text-neutral-400 dark:text-neutral-500"
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
