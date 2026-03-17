/**
 * 루트 페이지 - 견적서 시스템 소개
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-4 text-3xl font-bold">견적서 시스템</h1>
      <p className="text-muted-foreground mb-6">
        견적서를 조회하려면 발급받은 링크를 통해 접속해주세요.
      </p>
      <code className="bg-muted text-muted-foreground rounded px-4 py-2 text-sm">
        /invoice/[견적서 ID]
      </code>
    </main>
  )
}
