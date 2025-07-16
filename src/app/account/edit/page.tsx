import { getAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

export default async function EditAccountPage() {
  const session = await getAuthSession()

  if (!session?.user) {
    redirect('/login')
  }

  const { id } = session.user
  // If 'role' might not exist, provide a fallback or fetch it separately
  const role = (session.user as { role?: Role }).role ?? 'USER'

  async function updateRole(formData: FormData) {
    'use server'
    const newRole = formData.get('role') as Role
    await prisma.user.update({
      where: { id },
      data: { role: newRole },
    })
    redirect('/account')
  }

  return (
    <div className="flex mx-auto mt-10 mb-10">
      <Card>
        <CardHeader>
          <CardTitle>
            <Typography variant="h2">Edit Role</Typography>
          </CardTitle>
          <CardDescription>Update your user role</CardDescription>
        </CardHeader>
        <form action={updateRole}>
          <CardContent className="flex flex-col gap-4 mb-30">
            <div>
              <Typography variant="small">Role</Typography>
              <select
                name="role"
                defaultValue={role}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 mt-4 ml-30">
            <Button type="submit">Save</Button>
            <Button asChild variant="outline">
              <a href="/account">Cancel</a>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}