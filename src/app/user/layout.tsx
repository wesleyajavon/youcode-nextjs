// app/admin/layout.tsx
import { redirect } from 'next/navigation'
import { getRequiredAuthSession } from '@/lib/auth'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequiredAuthSession()

  if (!session || !session.user) {
    redirect('/')
  }

  return <>{children}</>
}
