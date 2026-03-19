// 견적서 목록 테이블 컴포넌트
// 견적서 목록을 테이블 형태로 표시하며 링크 복사 기능을 포함한다
import { CopyLinkButton } from '@/components/admin/copy-link-button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import type { InvoiceListItem, InvoiceStatus } from '@/types/invoice'

interface InvoiceListTableProps {
  items: InvoiceListItem[]
}

/** 상태별 Badge 클래스 매핑 */
const statusClassMap: Record<InvoiceStatus, string> = {
  대기: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  승인: 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700',
  거절: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
}

export function InvoiceListTable({ items }: InvoiceListTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table aria-label="견적서 목록 테이블">
        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground min-w-[120px] text-xs font-medium tracking-widest uppercase">
              견적번호
            </TableHead>
            <TableHead className="text-muted-foreground min-w-[140px] text-xs font-medium tracking-widest uppercase">
              클라이언트명
            </TableHead>
            <TableHead className="text-muted-foreground min-w-[120px] text-xs font-medium tracking-widest uppercase">
              발행일
            </TableHead>
            <TableHead className="text-muted-foreground min-w-[80px] text-xs font-medium tracking-widest uppercase">
              상태
            </TableHead>
            <TableHead className="text-muted-foreground min-w-[120px] text-right text-xs font-medium tracking-widest uppercase">
              총액
            </TableHead>
            <TableHead className="w-12 text-xs font-medium tracking-widest uppercase">
              링크
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.length > 0 ? (
            items.map(item => (
              <TableRow
                key={item.id}
                className="border-border hover:bg-muted/50 border-b transition-colors"
              >
                <TableCell className="text-foreground text-sm font-medium">
                  {item.invoiceNumber || '-'}
                </TableCell>
                <TableCell className="text-foreground text-sm">
                  {item.clientName || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(item.issueDate)}
                </TableCell>
                <TableCell>
                  <Badge className={statusClassMap[item.status]}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground text-right text-sm font-semibold">
                  {formatCurrency(item.total)}
                </TableCell>
                <TableCell>
                  <CopyLinkButton notionPageId={item.id} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-muted-foreground py-12 text-center text-sm"
              >
                견적서가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
