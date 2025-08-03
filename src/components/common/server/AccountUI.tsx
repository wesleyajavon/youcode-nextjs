import { getRequiredAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/common/card'
import Link from 'next/link'
import SignOutButton from '@/lib/features/auth/SignOutButton'
import { Typography } from '@/components/ui/common/typography'
import { prisma } from '@/lib/prisma'

export async function AccountUI() {
    const session = await getRequiredAuthSession()
    if (!session?.user) {
        redirect('/')
    }

    // await new Promise(res => setTimeout(res, 5000));


    const { name, image, role } = session.user
    const email = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true }
    }).then(user => user?.email);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Typography variant="h2">Account ⚙️</Typography>
                </CardTitle>
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
                    {role === 'ADMIN' && (
                        <p>Teacher</p>
                    )}
                    {role === 'USER' && (
                        <p>Student</p>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                
                {/*  Conditional rendering based on user role */}
                {session.user.role === 'ADMIN' && (<Link
                    href="/admin"
                    className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                    Teacher
                </Link>)}
                {session.user.role === 'USER' && (<Link
                    href="/user"
                    className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                    Student
                </Link>)}

                <Link
                    href="/account/edit"
                    className="rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                    Update Profile
                </Link>
                <SignOutButton />
            </CardFooter>
        </Card>
    )
}
