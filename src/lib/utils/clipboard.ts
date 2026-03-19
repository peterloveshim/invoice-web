/**
 * execCommand fallback 방식으로 클립보드 복사
 * @param text - 복사할 텍스트
 * @returns 성공 여부
 */
function fallbackCopy(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.cssText = 'position:fixed;opacity:0;'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  try {
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  } catch {
    document.body.removeChild(textarea)
    return false
  }
}

/**
 * 견적서 클라이언트 링크를 클립보드에 복사합니다.
 * @param notionPageId - Notion 페이지 ID
 * @returns 성공 여부
 */
export async function copyInvoiceLink(notionPageId: string): Promise<boolean> {
  const url = `${window.location.origin}/invoice/${notionPageId}`

  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    return fallbackCopy(url)
  }
}
