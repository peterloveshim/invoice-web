// 견적서 페이지 레이아웃 컴포넌트
// 콘텐츠를 최대 너비와 적절한 패딩으로 중앙 정렬한다
interface InvoiceLayoutProps {
  children: React.ReactNode
}

export function InvoiceLayout({ children }: InvoiceLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </div>
  )
}
