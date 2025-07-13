import { getCourse } from "../_actions/course.query";
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
import { PencilSquareIcon } from "@heroicons/react/24/outline";


export default async function CoursePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const course = await getCourse(params.id);

    if (!course) {
        redirect('/admin/courses');
    }

    return (

        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'Courses', href: '/admin/courses' },
                            {
                                label: course.name,
                                href: '/admin/courses/' + course.id,
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
                    <Card className="h-fit flex flex-col ">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle>Presentation</CardTitle>
                            <Link href={`/admin/courses/${course.id}/edit`}>
                                <PencilSquareIcon className="h-5 w-5" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <Typography variant="base">
                                {course.presentation || "No presentation available."}
                            </Typography>
                        </CardContent>
                    </Card>
                    {/* Infos du cours et actions */}
                    <Card className="h-fit flex flex-col">
                        <CardHeader className="flex items-end justify-between gap-6">

                            <CardTitle>Course Info</CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-3 flex-1">
                            <Badge className="w-fit">{course.state}</Badge>
                            <Typography variant={'base'}>{course.users?.length} users</Typography>
                            <Typography variant={'base'}>Created: {course.createdAt.toLocaleDateString()}</Typography>
                            <div className="flex-1" />
                            <Link
                                href={`/admin/courses/${course.id}/lessons`}
                                className={buttonVariants({
                                    variant: 'outline',
                                })}
                            >
                                See lessons
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Colonne droite : Liste des utilisateurs */}
                <Card className="order-2 lg:order-2 lg:col-span-2">
                    <CardHeader className="flex items-end justify-between gap-6">
                        <CardTitle>{course.name}</CardTitle>

                        <Avatar className="rounded h-5 w-5">
                            <AvatarFallback>{course.name?.[0]}</AvatarFallback>
                            {course.image && (
                                <AvatarImage src={course.image} alt={course.name ?? ''} />
                            )}
                        </Avatar>
                    </CardHeader>
                    <CardContent className="mt-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
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