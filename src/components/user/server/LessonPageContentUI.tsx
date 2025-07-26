import { getRequiredAuthSession } from '@/lib/auth';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { redirect } from 'next/navigation';
import { getLesson, getLessonContent } from '@/app/admin/courses/_actions/lesson.query';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { Progress } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export async function LessonPageContentUI(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);
    const markdown = await getLessonContent(params.lessonId);
    const session = await getRequiredAuthSession();


    // await new Promise(res => setTimeout(res, 5000));

    if (!lesson) {
        redirect(`/user/courses/${params.id}/lessons`);
    }

    const alreadyJoined = lesson.users.some(
        (u: any) => u.user.id === session.user.id
    );

    // Handler pour changer le progrès (server action)
    async function handleProgressChange(formData: FormData) {
        "use server";
        if (!lesson) {
            redirect(`/user/courses/${params.id}/lessons`);
        }

        // Import the Progress enum from Prisma client
        const newProgress = formData.get("progress") as Progress;
        await prisma.lessonOnUser.update({
            where: {
                userId_lessonId: {
                    userId: session.user.id,
                    lessonId: lesson.id,
                },
            },
            data: {
                progress: newProgress,
            },
        });
        redirect(`/user/courses/${lesson.courseId}/lessons/`);
    }

    const lessonOnUser = await prisma.lessonOnUser.findFirst({
        where: {
            userId: session.user.id,
            lessonId: lesson.id,
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    <Typography variant={'h2'}>
                        {lesson?.course?.name || 'Course'}
                    </Typography>
                    <Typography variant={'h3'}>
                        {lesson?.name || 'Lesson'}
                    </Typography>
                </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
                <ReactMarkdown>{markdown}</ReactMarkdown>
                {alreadyJoined && (
                    <form
                        action={handleProgressChange}
                        className="mt-8 flex items-end justify-between"
                    >
                        <Select name="progress" defaultValue={lessonOnUser?.progress}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Progress" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* <SelectItem value="NOT_STARTED">Not started</SelectItem> */}
                                <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit">
                            Save
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    )
}
