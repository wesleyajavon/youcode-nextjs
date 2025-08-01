import { redirect } from 'next/navigation'
import { getRequiredAuthSession } from '@/lib/auth'
import UserLayoutClient from '../user/layout'
import AdminLayoutClient from '../admin/layout'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {


  // Passe les children au composant client
  return (children)
}