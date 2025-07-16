// app/admin/layout.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import { AdminSideNav } from '@/components/layout/AdminSideNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="flex flex-1">
      <AdminSideNav />
      <main className="flex-1">{children}</main>
    </div>
  )
}
