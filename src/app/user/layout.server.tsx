import { redirect } from 'next/navigation'
import { getRequiredAuthSession } from '@/lib/auth'
import UserLayoutClient from './layout'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequiredAuthSession()

  if (!session || session.user.role !== 'USER') {
    redirect('/')
  }

  // Passe les children au composant client
  return <UserLayoutClient children={children} />
}