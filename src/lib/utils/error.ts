/**
 * Notion API 에러 유틸리티 함수
 * 에러 타입 판별 및 사용자 친화적 메시지 변환을 담당합니다.
 */

/**
 * Notion API에서 페이지를 찾을 수 없는 에러인지 확인합니다.
 * HTTP 400/404 상태 코드 또는 에러 메시지 패턴으로 판별합니다.
 */
export function isNotionNotFound(error: unknown): boolean {
  const apiError = error as { status?: number }
  if (apiError.status === 404 || apiError.status === 400) return true

  if (error instanceof Error) {
    const msg = error.message
    return (
      msg.includes('Could not find page') ||
      msg.includes('object_not_found') ||
      msg.includes('unauthorized') ||
      msg.includes('validation_error') ||
      msg.includes('Invalid') ||
      msg.includes('path could not be resolved')
    )
  }

  return false
}

/**
 * Notion API 에러를 사용자 친화적 한국어 메시지로 변환합니다.
 */
export function parseNotionError(error: unknown): string {
  if (error instanceof Error && error.message === 'TIMEOUT') {
    return '요청 시간이 초과되었습니다. 다시 시도해주세요.'
  }
  if (isNotionNotFound(error)) {
    return '견적서를 찾을 수 없습니다.'
  }
  return '데이터를 불러오는 중 오류가 발생했습니다.'
}
