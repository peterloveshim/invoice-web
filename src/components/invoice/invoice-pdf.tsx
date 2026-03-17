import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Invoice } from '@/lib/notion'

/**
 * PDF 스타일 정의
 * @react-pdf/renderer 스타일 시스템을 사용합니다.
 */
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f3f4f6',
    fontSize: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  sectionValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  sectionSubValue: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  colDescription: {
    flex: 3,
    color: '#666666',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  colQuantity: {
    flex: 1,
    textAlign: 'right',
    color: '#666666',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  colUnitPrice: {
    flex: 2,
    textAlign: 'right',
    color: '#666666',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  colAmount: {
    flex: 2,
    textAlign: 'right',
    color: '#666666',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  colDescriptionValue: {
    flex: 3,
    fontSize: 10,
  },
  colQuantityValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 10,
    color: '#4b5563',
  },
  colUnitPriceValue: {
    flex: 2,
    textAlign: 'right',
    fontSize: 10,
    color: '#4b5563',
  },
  colAmountValue: {
    flex: 2,
    textAlign: 'right',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  totalsSection: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: '#4b5563',
    width: 80,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 10,
    color: '#4b5563',
    width: 100,
    textAlign: 'right',
  },
  grandTotalRow: {
    flexDirection: 'row',
    gap: 40,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    width: 80,
    textAlign: 'right',
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    width: 100,
    textAlign: 'right',
  },
  notesSection: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    color: '#374151',
  },
  notesText: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.5,
  },
  emptyItems: {
    padding: 20,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 10,
  },
})

/**
 * 금액 포맷팅 헬퍼 함수 (PDF용 - Intl 사용 불가)
 */
function formatCurrencyPdf(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`
}

/**
 * 날짜 포맷팅 헬퍼 함수 (PDF용)
 */
function formatDatePdf(dateStr: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

/**
 * 견적서 상태 한국어 매핑
 */
const statusLabels: Record<Invoice['status'], string> = {
  draft: '초안',
  sent: '발송됨',
  paid: '결제완료',
  cancelled: '취소됨',
}

/**
 * PDF 문서 컴포넌트 Props
 */
interface InvoicePdfDocumentProps {
  invoice: Invoice
}

/**
 * @react-pdf/renderer를 사용한 견적서 PDF 문서 컴포넌트
 * 서버 사이드에서 렌더링됩니다.
 */
export function InvoicePdfDocument({ invoice }: InvoicePdfDocumentProps) {
  return (
    <Document title={`견적서 ${invoice.invoiceNumber}`} author="Invoice System">
      <Page size="A4" style={styles.page}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>견적서</Text>
            <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
          </View>
          <View>
            <Text style={styles.statusBadge}>
              {statusLabels[invoice.status] ?? invoice.status}
            </Text>
          </View>
        </View>

        {/* 발급처 / 수신처 정보 */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.sectionTitle}>수신처</Text>
            <Text style={styles.sectionValue}>{invoice.clientName || '-'}</Text>
            {invoice.clientEmail && (
              <Text style={styles.sectionSubValue}>{invoice.clientEmail}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.sectionTitle}>발행일</Text>
            <Text style={styles.sectionValue}>
              {formatDatePdf(invoice.issueDate)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.sectionTitle}>유효기간</Text>
            <Text style={styles.sectionValue}>
              {formatDatePdf(invoice.dueDate)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 견적 항목 테이블 */}
        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDescription}>항목</Text>
            <Text style={styles.colQuantity}>수량</Text>
            <Text style={styles.colUnitPrice}>단가</Text>
            <Text style={styles.colAmount}>금액</Text>
          </View>

          {invoice.items.length > 0 ? (
            invoice.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.colDescriptionValue}>
                  {item.description}
                </Text>
                <Text style={styles.colQuantityValue}>{item.quantity}</Text>
                <Text style={styles.colUnitPriceValue}>
                  {formatCurrencyPdf(item.unitPrice)}
                </Text>
                <Text style={styles.colAmountValue}>
                  {formatCurrencyPdf(item.amount)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyItems}>견적 항목이 없습니다.</Text>
          )}
        </View>

        {/* 합계 */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>소계</Text>
            <Text style={styles.totalValue}>
              {formatCurrencyPdf(invoice.subtotal)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>세금 (VAT)</Text>
            <Text style={styles.totalValue}>
              {formatCurrencyPdf(invoice.tax)}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>합계</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrencyPdf(invoice.total)}
            </Text>
          </View>
        </View>

        {/* 비고 */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>비고</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
