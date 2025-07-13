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

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";
import { getCourse } from "@/app/admin/courses/_actions/course.query";
import { getLessons } from "@/app/admin/courses/_actions/lesson.query";
import { getLessonProgress } from "../../_actions/lesson.query";


export default async function CoursePage(props: { params: Promise<{ id: string }> }) {
    const session = await getRequiredAuthSession();
    const user = session.user;
    const params = await props.params;
    const course = await getCourse(params.id)
    let lessons = await getLessons(params.id);

    // Trier les leçons par ordre croissant de rank (en supposant que rank est un nombre ou une chaîne numérique)
    lessons = lessons ? lessons.slice().sort((a, b) => Number(a.rank) - Number(b.rank)) : null;


    // Ensure the user is authenticated
    // If not, redirect to the login page
    // need to implement login page
    if (!session || !user) {
        redirect('/login');
    }

    if (!course) {
        redirect('/user/courses');
    }

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
                            },
                            {
                                label: 'Lessons',
                                href: '/user/courses/' + course.id + '/lessons',
                                active: true,
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>

            <LayoutContent className="flex flex-col gap-4 lg:flex-row">
                <Card className="flex-[2]">
                    <CardHeader className="flex items-center justify-left">
                        <Avatar className="rounded">
                            <AvatarFallback>{course.name?.[0]}</AvatarFallback>
                            {course.image && (
                                <AvatarImage src={course.image} alt={course.name ?? ''} />
                            )}      
                        </Avatar>
                        <CardTitle>{course.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <Typography variant="large" className="mb-10">
                            Lessons Dashboard
                        </Typography>
                        <Typography variant="small" className="mb-6">
                            Here you can find all the lessons for this course. Click on a lesson to view its details.
                        </Typography>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Content</TableHead>
                                    {/* <TableHead>State</TableHead> */}
                                    <TableHead>Progress</TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lessons && lessons.map(async (lesson) => (
                                    <TableRow key={lesson.id}>
                                        <TableCell>
                                            <Typography
                                                as={Link}
                                                href={`/user/courses/${course.id}/lessons/${lesson.id}`}
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

                                        {/* <TableCell>
                                            <Badge className="w-fit">{lesson.state}</Badge>
                                        </TableCell> */}

                                        <TableCell>
                                            {(async () => {
                                                const progress = await getLessonProgress(session.user.id, lesson.id);
                                                let color = "bg-gray-200 text-black"; // default

                                                if (progress === "Not started") color = "bg-red-500 text-white";
                                                else if (progress === "In progress") color = "bg-yellow-500 text-white";
                                                else if (progress === "Completed") color = "bg-green-500 text-white";

                                                return (
                                                    <Badge className={`w-fit ${color}`}>
                                                        {progress}
                                                    </Badge>
                                                );
                                            })()}
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
                            href={`/user/courses/${course.id}/lessons`}
                            className={buttonVariants({
                                variant: 'secondary',
                            })}
                        >
                            {course.lessons?.length} lessons
                        </Link>{' '}
                        <Link
                            href={`/user/courses/${course.id}/edit`}
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