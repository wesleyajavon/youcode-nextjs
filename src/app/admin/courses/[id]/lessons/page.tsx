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
import { getCourse } from "../../_actions/course.query";
import { getLessons } from "../../_actions/lesson.query";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";


export default async function CoursePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const course = await getCourse(params.id)
    let lessons = await getLessons(params.id);
    if (!course) {
        redirect('/admin/courses');
    }

    // Trier les leçons par ordre croissant de rank (en supposant que rank est un nombre ou une chaîne numérique)
    lessons = lessons?.slice().sort((a, b) => Number(a.rank) - Number(b.rank)) || null;

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
                            },
                            {
                                label: 'Lessons',
                                href: '/admin/courses/' + course.id + '/lessons',
                                active: true,
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>
                <Link
                    href={`/admin/courses/${course.id}/lessons/new`}
                    className={buttonVariants({
                        variant: 'secondary',
                    })}
                >

                    <PlusIcon className="h-5 w-5" />
                </Link>
            </LayoutActions>
            <LayoutContent className="flex flex-col gap-4 lg:flex-row">
                <Card className="flex-[2]">
                    <CardHeader className="flex items-baseline justify-between gap-2">
                        <Typography variant="large" className="mb-6">
                            Admin Lessons Dashboard
                        </Typography>
                        <div className="flex items-baseline gap-5">
                            <CardTitle>
                                <Typography variant="small" className="mb-6">
                                    {course.name}                        
                                </Typography>
                            </CardTitle>

                            <Avatar className="rounded h-4 w-4">
                                <AvatarFallback>{course.name?.[0]}</AvatarFallback>
                                {course.image && (
                                    <AvatarImage src={course.image} alt={course.name ?? ''} />
                                )}
                            </Avatar>
                        </div>
                    </CardHeader>
                    <CardContent className="mt-0">
                        <Typography variant="small" className="mb-6">
                            Here you can manage all lessons for the course. Click on a lesson to view or edit its details.
                        </Typography>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Content</TableHead>
                                    <TableHead>State</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lessons && lessons.map((lesson) => (
                                    <TableRow key={lesson.id}>
                                        <TableCell>
                                            <Typography
                                                as={Link}
                                                href={`/admin/courses/${course.id}/lessons/${lesson.id}`}
                                                variant="large"
                                                className="font-semibold"
                                            >
                                                {lesson.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="large"
                                                className="font-semibold"
                                            >
                                                {lesson.rank}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="small"
                                                className="font-normal"
                                            >
                                                {lesson.content.slice(0, 15)}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="w-fit">{lesson.state}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/admin/courses/${course.id}/lessons/${lesson.id}/edit`}>
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                {/* <Card className="flex-1">
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
                        <Link
                            href={`/admin/courses/${course.id}/lessons`}
                            className={buttonVariants({
                                variant: 'secondary',
                            })}
                        >
                            {course.lessons?.length} lessons
                        </Link>{' '}
                        <Link
                            href={`/admin/courses/${course.id}/edit`}
                            className={buttonVariants({
                                variant: 'outline',
                            })}
                        >
                            Edit course
                        </Link>{' '}
                    </CardContent>
                </Card> */}
            </LayoutContent>
        </Layout>
    )

}