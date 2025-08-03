import { getRequiredAuthSession } from '@/lib/auth'
import UserLayoutClient from '../user/layout'
import AdminLayoutClient from '../admin/layout'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequiredAuthSession()

  if (session.user.role === 'ADMIN') {
      return <AdminLayoutClient>{children}</AdminLayoutClient>
  } else if (session.user.role === 'USER') {
    return <UserLayoutClient>{children}</UserLayoutClient>
  }

  // Passe les children au composant client
}