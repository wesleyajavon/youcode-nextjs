import { getRequiredAuthSession } from '@/lib/auth';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/common/card';
import { Typography } from '@/components/ui/common/typography';
import { redirect } from 'next/navigation';
import { getLesson, getLessonContentWithRedis } from '@/app/admin/courses/_actions/lesson.query';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';
import { getCourseInfo } from '@/app/admin/courses/_actions/course.query';
import { getLessonOnUser } from '@/app/user/courses/_actions/lesson.query';
import { LessonProgressForm } from '../client/LessonProgressForm';

// Incremental Static Regeneration (ISR) allows the page to be rebuilt every 60 seconds
// This is useful for keeping the lesson content up-to-date without requiring a full rebuild of the site.
export const revalidate = 60; 

// This component is used to display the content of a lesson for a user.
// It fetches the lesson data and course information based on the IDs from the URL parameters.
// The lesson content is rendered using ReactMarkdown to support Markdown formatting.
// If the lesson does not exist, it redirects to the lessons list page for the corresponding course.
// The header includes the course name and lesson name, along with an avatar for the course image.
// The component also checks if the user has joined the lesson and displays the content or a lock icon
// if the user has not joined. If the user has joined, it displays the lesson content and a form
// to update the lesson progress.

export async function LessonPageContentUI(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);
    // const markdown = await getLessonContent(params.lessonId);
    const course = await getCourseInfo(params.id);
    const session = await getRequiredAuthSession();
    const lessonOnUser = await getLessonOnUser(session.user.id, params.lessonId);
    const markdown = await getLessonContentWithRedis(params.lessonId);

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
