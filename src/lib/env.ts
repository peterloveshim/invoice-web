import { z } from 'zod'

/**
 * 서버 환경변수 스키마 정의
 * Notion API 연동에 필요한 환경변수를 검증합니다.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  // Notion API 인증 키
  NOTION_API_KEY: z.string().min(1, 'NOTION_API_KEY is required'),
  // Notion 데이터베이스 ID
  NOTION_DATABASE_ID: z.string().min(1, 'NOTION_DATABASE_ID is required'),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
})

export type Env = z.infer<typeof envSchema>
