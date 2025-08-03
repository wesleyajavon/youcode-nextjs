import { redirect } from 'next/navigation'
import { getRequiredAuthSession } from '@/lib/auth'
import AdminLayoutClient from './layout'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequiredAuthSession()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }




  // Passe les children au composant client
  return <AdminLayoutClient children={children} />;
}