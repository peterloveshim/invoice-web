'use client'

// 클라이언트 링크 복사 버튼 컴포넌트
// 견적서 URL을 클립보드에 복사하고 성공/실패 피드백을 제공한다
import { useState } from 'react'
import { Link, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { copyInvoiceLink } from '@/lib/utils/clipboard'

interface CopyLinkButtonProps {
  notionPageId: string
}

export function CopyLinkButton({ notionPageId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleClick() {
    const success = await copyInvoiceLink(notionPageId)

    if (success) {
      setCopied(true)
      toast.success('링크가 복사되었습니다')
      // 1.5초 후 아이콘 원복
      setTimeout(() => setCopied(false), 1500)
    } else {
      toast.error('링크 복사에 실패했습니다')
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            aria-label="클라이언트 링크 복사"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Link className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>클라이언트 링크 복사</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
