// 루트 페이지 - 견적서 시스템 소개
import { AppHeader } from '@/components/layout/app-header'

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <AppHeader />
      <main className="flex flex-col items-center justify-center p-8 text-center">
        <h1 className="mb-4 text-3xl font-bold">견적서 시스템</h1>
        <p className="text-muted-foreground mb-6">
          견적서를 조회하려면 발급받은 링크를 통해 접속해주세요.
        </p>
        <code className="bg-muted text-muted-foreground rounded px-4 py-2 text-sm">
          /invoice/[견적서 ID]
        </code>
      </main>
    </div>
  )
}
