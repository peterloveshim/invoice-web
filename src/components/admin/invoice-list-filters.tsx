'use client'

// 견적서 목록 필터 컴포넌트
// URL 쿼리 파라미터 기반으로 상태 필터와 검색 기능을 제공한다
import { useEffect, useState } from 'react'
import { useQueryState } from 'nuqs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export function InvoiceListFilters() {
  const [status, setStatus] = useQueryState('status', {
    defaultValue: 'all',
    shallow: false,
  })
  const [search, setSearch] = useQueryState('search', {
    defaultValue: '',
    shallow: false,
  })

  // 검색 debounce 처리 (300ms)
  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    const timer = setTimeout(() => {
      void setSearch(searchInput || null)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, setSearch])

  return (
    <div className="flex flex-wrap gap-3">
      {/* 상태 필터 */}
      <Select
        value={status}
        onValueChange={value => void setStatus(value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="전체" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="대기">대기</SelectItem>
          <SelectItem value="승인">승인</SelectItem>
          <SelectItem value="거절">거절</SelectItem>
        </SelectContent>
      </Select>

      {/* 클라이언트명 검색 */}
      <Input
        placeholder="클라이언트명 검색..."
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
        className="w-48"
      />
    </div>
  )
}
