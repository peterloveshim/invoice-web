// 관리자 레이아웃
// AdminHeader를 포함하고 nuqs URL 상태 관리를 제공한다
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { AdminHeader } from '@/components/admin/admin-header'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <NuqsAdapter>
      <div className="bg-background min-h-screen">
        <AdminHeader />
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      </div>
    </NuqsAdapter>
  )
}
