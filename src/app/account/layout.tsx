import LayoutClient from '@/components/common/client/LayoutClient';
import { getRequiredAuthSession } from '@/lib/auth'
import { Role } from '@prisma/client';


export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequiredAuthSession()

  return <LayoutClient role={session.user.role as Role}>{children}</LayoutClient>
}