import { getAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import { Role } from '@prisma/client'
import { EditRoleForm } from '@/components/common/client/RoleForm'

export async function AccountEditUI() {
  const session = await getAuthSession()

    // await new Promise(res => setTimeout(res, 5000));

  if (!session?.user) {
    redirect('/login')
  }

  const { id } = session.user
  // If 'role' might not exist, provide a fallback or fetch it separately
  const role = (session.user as { role?: Role }).role ?? 'USER'

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Typography variant="h2">Are you a Teacher or a Student ? 🤔</Typography>
                </CardTitle>
                <CardDescription>Update your role here 👇</CardDescription>
            </CardHeader>
            <EditRoleForm id={id ?? ''} role={role} />
        </Card>
    )
}
