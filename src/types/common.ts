/** 비동기 로딩 상태 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/** UI 에러 상태 */
export type ErrorState = { message: string; code?: string } | null
