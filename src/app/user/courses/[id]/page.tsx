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
            <LayoutContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne gauche : Présentation + Infos du cours */}
                <div className="flex flex-col gap-6 order-1 lg:order-1 lg:col-span-1">
                    {/* Présentation du cours */}
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>Presentation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Typography variant="base">
                                {course.presentation || "No presentation available."}
                            </Typography>
                        </CardContent>
                    </Card>
                    {/* Infos du cours et actions */}
                    <Card className="flex-1 flex flex-col">
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <Avatar className="rounded">
                                <AvatarFallback>{course.name?.[0]}</AvatarFallback>
                                {course.image && (
                                    <AvatarImage src={course.image} alt={course.name ?? ''} />
                                )}
                            </Avatar>
                            <CardTitle>{course.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 flex-1">
                            {/* <Typography variant={'base'}>Created: {course.createdAt.toLocaleDateString()}</Typography> */}
                            {/* <Badge className="w-fit">{course.state}</Badge> */}
                            {/* <Typography variant={'base'}>{course.users?.length} users</Typography> */}

                            {alreadyJoined && (
                                <Link
                                    href={`/user/courses/${course.id}/lessons`}
                                    className={buttonVariants({
                                        variant: 'outline',
                                    })}
                                >
                                    See lessons
                                </Link>
                            )}

                            <div className="flex-1" /> {/* Espaceur pour pousser le bouton en bas */}

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
                </div>

                {/* Colonne droite : Liste des utilisateurs */}
                <Card className="order-2 lg:order-2 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Participants</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Avatar</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {course.users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Avatar className="rounded">
                                                <AvatarFallback>
                                                    {user.user.name?.[0] ?? "?"}
                                                </AvatarFallback>
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
                                                variant="small"
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
            </LayoutContent>

        </Layout >
    )

}