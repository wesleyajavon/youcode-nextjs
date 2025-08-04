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

// This component is used to edit the user's account settings.
// It allows the user to update their role (Teacher or Student) in the account settings.
// The component fetches the user's session to determine their current role and provides a form to update it.
// If the user is not authenticated, it redirects them to the login page.

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
