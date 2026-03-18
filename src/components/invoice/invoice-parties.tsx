// 견적서 당사자 정보 컴포넌트
// 발급처(귀하)와 수신처(클라이언트) 정보를 2열 그리드로 표시한다

/**
 * 견적서 당사자 정보 컴포넌트 Props
 */
interface InvoicePartiesProps {
  clientName: string
  clientEmail?: string
}

/**
 * 견적서 발급처 및 수신처 정보 컴포넌트
 * 반응형 2열 그리드 레이아웃으로 발급처와 수신처 정보를 나란히 표시합니다.
 */
export function InvoiceParties({ clientName, clientEmail }: InvoicePartiesProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* 발급처 정보 */}
      <div>
        <h2 className="text-sm font-medium text-gray-500">발급처</h2>
        <p className="mt-1 text-base font-semibold text-gray-900">귀하</p>
      </div>

      {/* 수신처 정보 */}
      <div>
        <h2 className="text-sm font-medium text-gray-500">수신처</h2>
        <p className="mt-1 text-base font-semibold text-gray-900">
          {clientName}
        </p>
        {/* 이메일이 있을 경우에만 표시 */}
        {clientEmail && (
          <p className="text-sm text-gray-600">{clientEmail}</p>
        )}
      </div>
    </div>
  )
}
