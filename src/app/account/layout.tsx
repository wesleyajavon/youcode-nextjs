import LayoutClient from '@/components/common/client/LayoutClient';
import { getRequiredAuthSession } from '@/lib/auth'


export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  console.log('AccountLayout rendering...');
  
  const session = await getRequiredAuthSession()
  console.log('Session:', session);

  return <LayoutClient session={session}>{children}</LayoutClient>
}