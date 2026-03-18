// 견적서 헤더 컴포넌트
// 견적서 번호, 상태 뱃지, 발행일, 유효기간을 표시한다
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils/format'
import type { Invoice } from '@/lib/notion'

/**
 * 견적서 상태별 뱃지 설정 매핑
 */
const statusConfig: Record<
  Invoice['status'],
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
> = {
  draft: { label: '초안', variant: 'secondary' },
  sent: { label: '발송됨', variant: 'default' },
  paid: { label: '결제완료', variant: 'default' },
  cancelled: { label: '취소됨', variant: 'destructive' },
}

/**
 * 견적서 헤더 컴포넌트 Props
 */
interface InvoiceHeaderProps {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  status: Invoice['status']
}

/**
 * 견적서 헤더 컴포넌트
 * 좌측에 견적서 제목과 번호, 우측에 상태 뱃지 및 날짜 정보를 표시합니다.
 */
export function InvoiceHeader({
  invoiceNumber,
  issueDate,
  dueDate,
  status,
}: InvoiceHeaderProps) {
  const currentStatus = statusConfig[status]

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* 좌측: 견적서 제목 및 번호 */}
      <div>
        <h1 className="text-4xl font-black tracking-tight text-neutral-900">
          견적서
        </h1>
        <p className="mt-2 font-mono text-sm tracking-widest text-neutral-400 uppercase">
          #{invoiceNumber}
        </p>
      </div>

      {/* 우측: 상태 뱃지 및 날짜 정보 */}
      <div className="flex flex-col items-start gap-3 sm:items-end">
        {/* 상태 뱃지 */}
        <Badge
          variant={currentStatus.variant}
          className="rounded-none text-xs tracking-wider uppercase"
        >
          {currentStatus.label}
        </Badge>

        {/* 날짜 정보 목록 */}
        <dl className="space-y-1 text-sm">
          {/* 발행일 */}
          <div className="flex gap-2 sm:justify-end">
            <dt className="text-xs tracking-widest text-neutral-400 uppercase">
              발행일
            </dt>
            <dd className="font-medium text-neutral-700">
              {formatDate(issueDate)}
            </dd>
          </div>

          {/* 유효기간 */}
          <div className="flex gap-2 sm:justify-end">
            <dt className="text-xs tracking-widest text-neutral-400 uppercase">
              유효기간
            </dt>
            <dd className="font-medium text-neutral-700">
              {formatDate(dueDate)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
