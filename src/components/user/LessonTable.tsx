import { getRequiredAuthSession } from "@/lib/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { getCourse } from "@/app/admin/courses/_actions/course.query";
import { getLessons } from "@/app/admin/courses/_actions/lesson.query";
import { getLessonProgress } from "../../app/user/courses/_actions/lesson.query";


export async function LessonsTable(props: { params: Promise<{ id: string }> }) {
    const session = await getRequiredAuthSession();
    const user = session.user;
    const params = await props.params;
    const course = await getCourse(params.id)
    let lessons = await getLessons(params.id);

    // Trier les leçons par ordre croissant de rank (en supposant que rank est un nombre ou une chaîne numérique)
    lessons = lessons ? lessons.slice().sort((a, b) => Number(a.rank) - Number(b.rank)) : null;

    // await new Promise(res => setTimeout(res, 5000));


    // Ensure the user is authenticated
    // If not, redirect to the login page
    // need to implement login page
    if (!session || !user) {
        redirect('/');
    }

    if (!course) {
        redirect('/user/courses');
    }

    return (
        <div className="flex flex-col gap-4 lg:flex-row">

            <Card className="flex-[2]">
                <CardHeader className="flex items-end justify-between gap-6">
                    <CardTitle>
                        <Typography variant="h2">Lessons Dashboard</Typography>
                    </CardTitle>
                    <div className="flex items-baseline gap-3">
                        <Typography variant="muted" className="">
                            {course?.name}
                        </Typography>

                        <Avatar className="rounded h-4 w-4">
                            <AvatarFallback>{course?.name?.[0]}</AvatarFallback>
                            {course?.image && (
                                <AvatarImage src={course?.image} alt={course?.name ?? ''} />
                            )}
                        </Avatar>
                    </div>
                </CardHeader>
                <CardContent className="">

                    <Typography variant="small" className="mb-6">
                        Here you can find all the lessons for this course. Click on a lesson to view its details and update your progress.
                    </Typography>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead> </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Rank</TableHead>
                                <TableHead>Content</TableHead>
                                {/* <TableHead>State</TableHead> */}
                                <TableHead className="flex items-center justify-end">Progress</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lessons && lessons.map(async (lesson) => (
                                <TableRow key={lesson.id}>
                                    <TableCell>
                                        <Avatar className="rounded h-5 w-5">
                                            <AvatarFallback>{lesson.name[0]}</AvatarFallback>
                                            {/* Ajoute une image si tu en as une pour la leçon */}
                                        </Avatar>
                                    </TableCell>
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
                                            {lesson.content.slice(0, 60)}..
                                        </Typography>
                                    </TableCell>

                                    {/* <TableCell>
                                            <Badge className="w-fit">{lesson.state}</Badge>
                                        </TableCell> */}

                                    <TableCell className="flex items-center justify-end">
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
        </div>

    )
}