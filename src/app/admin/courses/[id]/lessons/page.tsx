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
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";


export default async function CoursePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const course = await getCourse(params.id)
    const lessons = await getLessons(params.id);
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
                    New Lesson
                </Link>
            </LayoutActions>
            <LayoutContent className="flex flex-col gap-4 lg:flex-row">
                <Card className="flex-[2]">
                    <CardContent className="mt-4">
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
                                                <PencilSquareIcon className="h-5 w-5"/>
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