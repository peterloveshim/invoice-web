'use client'

// 견적서 목록 페이지네이션 컴포넌트
// 이전/다음 커서 기반 페이지네이션을 URL 쿼리 파라미터로 관리한다
import { useQueryState } from 'nuqs'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface InvoiceListPaginationProps {
  hasMore: boolean
  nextCursor: string | null
}

export function InvoiceListPagination({
  hasMore,
  nextCursor,
}: InvoiceListPaginationProps) {
  const [cursor, setCursor] = useQueryState('cursor', {
    defaultValue: '',
    shallow: false,
  })
  const [prevCursors, setPrevCursors] = useQueryState('prevCursors', {
    defaultValue: '',
    shallow: false,
  })

  // 이전 커서 스택 파싱
  const prevStack = prevCursors ? prevCursors.split(',').filter(Boolean) : []

  function handleNext() {
    if (!nextCursor) return
    const newStack = cursor ? [...prevStack, cursor] : prevStack
    void setPrevCursors(newStack.length > 0 ? newStack.join(',') : null)
    void setCursor(nextCursor)
  }

  function handlePrev() {
    const newStack = [...prevStack]
    const prevCursor = newStack.pop() ?? ''
    void setPrevCursors(newStack.length > 0 ? newStack.join(',') : null)
    void setCursor(prevCursor || null)
  }

  const hasPrev = prevStack.length > 0 || !!cursor

  if (!hasPrev && !hasMore) return null

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrev}
        disabled={!hasPrev}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        이전
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={!hasMore}
      >
        다음
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  )
}
