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
import { EditRoleForm } from '@/components/common/RoleForm'

export default async function EditAccountPage() {
  const session = await getAuthSession()

  if (!session?.user) {
    redirect('/login')
  }

  const { id } = session.user
  // If 'role' might not exist, provide a fallback or fetch it separately
  const role = (session.user as { role?: Role }).role ?? 'USER'

  return (
    <div className="flex items-center justify-center py-20">
      <Card>
        <CardHeader>
          <CardTitle>
            <Typography variant="h2">Edit Role</Typography>
          </CardTitle>
          <CardDescription>Update your user role</CardDescription>
        </CardHeader>
        <EditRoleForm id={id ?? ''} role={role} />
      </Card>
    </div>
  )
}