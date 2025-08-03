import { getRequiredAuthSession } from '@/lib/auth';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { redirect } from 'next/navigation';
import { getLesson, getLessonContent } from '@/app/admin/courses/_actions/lesson.query';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCourseInfo } from '@/app/admin/courses/_actions/course.query';
import { LessonProgressForm } from '../client/LessonProgressForm';
import { getLessonOnUser } from '@/app/user/courses/_actions/lesson.query';


export async function LessonPageContentUI(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);
    const markdown = await getLessonContent(params.lessonId);
    const course = await getCourseInfo(params.id);
    const session = await getRequiredAuthSession();
    const lessonOnUser = await getLessonOnUser(session.user.id, params.lessonId);

    // await new Promise(res => setTimeout(res, 5000));

    if (!lesson ) {
        redirect(`/user/courses/${params.id}/lessons`);
    }

    const alreadyJoined = lesson?.users.some(
        (u: any) => u.user.id === session.user.id
    );

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
                            {lesson?.course?.name || 'Course'}
                        </Typography>
                    </span>
                    <Typography variant={'muted'}>
                        {lesson?.name || 'Lesson'}
                    </Typography>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[500px] overflow-y-auto">

                {alreadyJoined ? (
                    <>
                        <div className="prose flex-1 overflow-y-auto py-4">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {markdown}
                            </ReactMarkdown>
                        </div>

                        <LessonProgressForm
                            userId={session.user.id}
                            lessonId={lesson.id}
                            progress={lessonOnUser?.progress || 'IN_PROGRESS'}
                        />

                    </>
                ) : (
                    <div className="flex flex-col items-center">
                        <LockClosedIcon className="h-10 w-10 text-muted-foreground" />
                        <Typography variant="muted" className="text-center">
                            Start the lesson and update your progress 💪🏽
                        </Typography>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
