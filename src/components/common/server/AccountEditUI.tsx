import { getRequiredAuthSession } from '@/lib/auth'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/common/card'
import { Typography } from '@/components/ui/common/typography'
import { Role } from '@prisma/client'
import { EditRoleForm } from '@/components/common/client/RoleForm'

// This component is used as a wrapper for the account edit form.
// It fetches the user's session to get their role and renders the EditRoleForm component.
// The form allows the user to update their role (e.g., from student to teacher).
// The default role is set to 'USER' if the session does not provide a specific role
export async function AccountEditUI() {
  const session = await getRequiredAuthSession()

  const role = (session.user as { role?: Role }).role ?? 'USER'

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Typography variant="h2">Are you a Teacher or a Student ? 🤔</Typography>
                </CardTitle>
                <CardDescription>Update your role here 👇</CardDescription>
            </CardHeader>
            <EditRoleForm id={session.user.id} role={role} />
        </Card>
    )
}
