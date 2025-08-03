import { getRequiredAuthSession } from "@/lib/auth";
import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/layout";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getLesson } from "@/app/admin/courses/_actions/lesson.query";
import { redirect } from "next/navigation";
import { JoinLessonButton } from "../client/JoinLessonButton";
import { LeaveLessonButton } from "../client/LeaveLessonButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCourseInfo } from "@/app/admin/courses/_actions/course.query";

export async function JoinLessonUI(props: { params: Promise<{ id: string, lessonId: string }> }) {

    const session = await getRequiredAuthSession();
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);
    const course = await getCourseInfo(params.id);

    // await new Promise(res => setTimeout(res, 5000));


    if (!lesson) {
        redirect(`/user/courses/${params.id}/lessons`);
    }

    // Vérifie si l'utilisateur a déjà rejoint la leçon
    const alreadyJoined = await prisma.lessonOnUser.findFirst({
        where: {
            userId: session.user.id,
            lessonId: lesson.id,
        },
    });


    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <span className="inline-flex items-center gap-2 mb-2">
                        <Avatar className="rounded h-10 w-10 mr-4">
                            <AvatarFallback>{course?.name[0]}</AvatarFallback>
                            <AvatarImage src={course?.image} alt={course?.name} />
                        </Avatar>
                        <Typography variant={'h2'}>
                            {course?.name || 'Course'}
                        </Typography>
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {alreadyJoined ? (
                    <>
                        <Typography variant="base">
                            You are about to leave the lesson: <strong>{lesson.name}</strong>
                        </Typography>
                        <LeaveLessonButton courseId={lesson.courseId} lessonId={lesson.id} userId={session.user.id} />
                    </>
                ) : (
                    <>
                        <Typography variant="base">
                            You are about to join the lesson: <strong>{lesson.name}</strong>
                        </Typography>
                        <JoinLessonButton courseId={lesson.courseId} lessonId={lesson.id} userId={session.user.id} />
                    </>

                )}
            </CardContent>
        </Card>
    )
}
