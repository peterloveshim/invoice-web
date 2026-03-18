/** API 공통 응답 래퍼 */
export interface ApiResponse<T> {
  data: T
  error?: string
}

/** API 에러 타입 */
export interface ApiError {
  message: string
  status: number
}
