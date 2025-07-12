import { getRequiredAuthSession } from "@/lib/auth";
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/layout";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { redirect } from "next/navigation";
import { getCourse } from "@/app/admin/courses/_actions/course.query";


export default async function CoursePage(props: { params: Promise<{ id: string }> }) {
    const session = await getRequiredAuthSession();
    const params = await props.params;
    const course = await getCourse(params.id);

    if (!course) {
        redirect('/user/courses');
    }

    // Vérifie si l'utilisateur est déjà inscrit
    const alreadyJoined = course.users.some(
        (u: any) => u.user.id === session.user.id
    );

    return (

        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'Courses', href: '/user/courses' },
                            {
                                label: course.name,
                                href: '/user/courses/' + course.id,
                                active: true,
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutContent className="flex flex-col gap-4 lg:flex-row">
                <Card className="flex-[2]">
                    <CardContent className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Users</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {course.users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Avatar className="rounded">
                                                <AvatarFallback>{user.user.name}</AvatarFallback>
                                                {user.user.image && (
                                                    <AvatarImage src={user.user.image} alt={user.user.id} />
                                                )}
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="large"
                                                className="font-semibold"
                                            >
                                                {user.user.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="large"
                                                className="font-semibold"
                                            >
                                                {user.user.email}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader className="flex-row items-center gap-4 space-y-0">
                        <Avatar className="rounded">
                            <AvatarFallback>{course.name?.[0]}</AvatarFallback>
                            {course.image && (
                                <AvatarImage src={course.image} alt={course.name ?? ''} />
                            )}
                        </Avatar>
                        <CardTitle>{course.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Badge className="w-fit">{course.state}</Badge>
                        <Typography variant={'base'}>{course.users?.length} users</Typography>

                        <Typography variant={'lead'}>Created: {course.createdAt.toLocaleDateString()}</Typography>
                        {alreadyJoined && (
                            <Link
                                href={`/user/courses/${course.id}/lessons`}
                                className={buttonVariants({
                                    variant: 'outline',
                                })}
                            >
                                {course.lessons?.length} lessons
                            </Link>) }
                        {alreadyJoined ? (
                            <Link
                                href={`/user/courses/${course.id}/join`}
                                className={buttonVariants({
                                    variant: 'destructive',
                                })}
                            >
                                Leave this course
                            </Link>
                        ) : (
                            <Link
                                href={`/user/courses/${course.id}/join`}
                                className={buttonVariants({
                                    variant: 'default',
                                })}
                            >
                                Join this course
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </LayoutContent>
        </Layout >
    )

}