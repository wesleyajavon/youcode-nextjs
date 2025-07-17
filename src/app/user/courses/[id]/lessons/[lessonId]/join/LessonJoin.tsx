import { getRequiredAuthSession } from "@/lib/auth";
import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/layout";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getLesson } from "@/app/admin/courses/_actions/lesson.query";
import { redirect } from "next/navigation";

export async function LessonJoinUI(props: { params: Promise<{ id: string, lessonId: string }> }) {

    const session = await getRequiredAuthSession();
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);
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

    async function handleJoinLesson() {
        "use server";
        if (!lesson) {
            redirect(`/user/courses/${params.id}/lessons`);
        }

        await prisma.lessonOnUser.create({
            data: {
                userId: session.user.id,
                lessonId: lesson.id,
                progress: "IN_PROGRESS", // Default progress when joining
            },
        });
        redirect(`/user/courses/${lesson.courseId}/lessons/${lesson.id}`);
    }

    async function handleUnjoinLesson() {
        "use server";
        if (!lesson) {
            redirect(`/user/courses/${params.id}/lessons`);
        }

        await prisma.lessonOnUser.delete({
            where: {
                userId_lessonId: {
                    userId: session.user.id,
                    lessonId: lesson.id,
                },
            },
        });
        redirect(`/user/courses/${lesson.courseId}/lessons/${lesson.id}`);
    }



    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Typography variant="h2">{lesson.course.name}</Typography>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {alreadyJoined ? (
                    <>
                        <Typography variant="base">
                            You are about to leave the lesson: <strong>{lesson.name}</strong>
                        </Typography>
                        <form action={handleUnjoinLesson}>
                            <Button type="submit" variant="destructive" className="mt-2">
                                Leave this lesson
                            </Button>
                        </form>
                    </>
                ) : (
                    <form action={handleJoinLesson}>
                        <Typography variant="base">
                            You are about to join the lesson: <strong>{lesson.name}</strong>
                        </Typography>
                        <Button type="submit" className="mt-6">
                            Join this lesson
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    )
}
