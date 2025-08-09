import { getRequiredAuthSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/common/card";
import { Typography } from "@/components/ui/common/typography";
import { prisma } from "@/lib/prisma";
import { getLesson } from "@/lib/queries/admin/lesson.query";
import { redirect } from "next/navigation";
import { JoinLessonButton } from "@/components/ui/user/JoinLessonButton";
import { LeaveLessonButton } from "@/components/ui/user/LeaveLessonButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/common/avatar";
import { getCourseInfo } from "@/lib/queries/admin/course.query";


// This component is used to display the UI for joining or leaving a lesson.
// It fetches the lesson data based on the lesson ID from the URL parameters.
// If the lesson does not exist, it redirects to the lessons list page for the corresponding course.
// The component checks if the user has already joined the lesson and displays appropriate buttons
// for joining or leaving the lesson.

export async function JoinLessonUI(props: { params: Promise<{ id: string, lessonId: string }> }) {

    const session = await getRequiredAuthSession();
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);
    const course = await getCourseInfo(params.id);

    if (!course) {
        redirect(`/user/courses`);
    }

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
