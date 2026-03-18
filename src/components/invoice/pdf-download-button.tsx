'use client'

// PDF 다운로드 버튼 클라이언트 컴포넌트
// 버튼 클릭 시 /api/invoice/[notionPageId]/pdf 엔드포인트를 호출하여 PDF를 다운로드한다
import { useState } from 'react'
import { toast } from 'sonner'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/loading-spinner'

/**
 * PDF 다운로드 버튼 컴포넌트 Props
 */
interface PdfDownloadButtonProps {
  notionPageId: string
  invoiceNumber: string
}

/**
 * 견적서 PDF 다운로드 버튼 컴포넌트
 * 클릭 시 RESTful API를 호출하여 PDF를 생성하고 파일로 다운로드한다.
 * 다운로드 진행 중 버튼 비활성화 및 로딩 스피너를 표시한다.
 */
export function PdfDownloadButton({
  notionPageId,
  invoiceNumber,
}: PdfDownloadButtonProps) {
  // 다운로드 진행 상태
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      // PDF 생성 API 호출
      const res = await fetch(`/api/invoice/${notionPageId}/pdf`)

      if (!res.ok) {
        toast.error('PDF 다운로드에 실패했습니다.')
        return
      }

      // Blob으로 변환 후 파일 다운로드 트리거
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoiceNumber}.pdf`
      a.click()

      // 메모리 누수 방지를 위해 Object URL 해제
      URL.revokeObjectURL(url)
    } catch {
      toast.error('PDF 다운로드 중 오류가 발생했습니다.')
    } finally {
      // 다운로드 완료 후 버튼 활성화 복원
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      variant="outline"
      className="rounded-none gap-2"
    >
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      PDF 다운로드
    </Button>
  )
}
