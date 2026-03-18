/**
 * 공통 포맷 유틸리티 함수 모음
 */

/**
 * 금액을 한국 원화 형식으로 포맷팅합니다.
 * @param amount - 포맷팅할 숫자 금액
 * @returns 원화 형식 문자열 (예: ₩1,000,000)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

/**
 * 날짜 문자열을 한국어 형식으로 포맷팅합니다.
 * @param dateStr - ISO 형식 날짜 문자열
 * @returns 한국어 날짜 문자열 (예: 2024년 1월 1일), 빈 문자열이면 '-' 반환
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
