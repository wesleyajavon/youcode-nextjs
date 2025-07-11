import { getAuthSession, getRequiredAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import Link from 'next/link'
import SignOutButton from '@/lib/features/auth/SignOutButton'

export default async function AccountPage() {
  const session = await getRequiredAuthSession()


  if (!session?.user) {
    redirect('/login')
  }

  const { name, email, image, role } = session.user

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your profile information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {image && (
            <img
              src={image}
              alt="User avatar"
              className="w-20 h-20 rounded-full object-cover border"
            />
          )}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p>{name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <p>{role}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <SignOutButton />
          {session.user.role === 'ADMIN' && (<Link
            href="/admin"
            className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Admin
          </Link>)}
          <Link
            href="/account/edit"
            className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Update Profile
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}