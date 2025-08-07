import { getRequiredAuthSession } from '@/lib/auth';
import React, { Suspense } from 'react';
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/LayoutTemp';
import Breadcrumbs from '@/components/ui/common/breadcrumbs';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/common/button';
import { redirect } from 'next/navigation';
import { getLesson } from '@/lib/queries/admin/lesson.query';
import { CardSkeleton } from '@/components/ui/common/skeleton';
import { JoinLessonButton } from '@/components/ui/user/JoinLessonButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';
import { getCourseInfo } from '@/lib/queries/admin/course.query';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { LessonContentWrapper } from '@/components/common/server/LessonContentWrapper';

// This page is used to display the content of a lesson in markdown format
// It fetches the lesson content from the database and renders it using ReactMarkdown
// The lessonId is passed as a parameter in the URL
// Example URL: /user/courses/[id]/lessons/[lessonId]

// ...existing imports...
// ...autres imports...

export default async function LessonPage(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);
    const course = await getCourseInfo(params.id);
    const session = await getRequiredAuthSession();


    if (!lesson) {
        redirect(`/user/courses/${params.id}/lessons`);
    }

    const alreadyJoined = lesson.users.some(
        (u: any) => u.user.id === session.user.id
    );

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                href: `/user/courses/${lesson?.courseId}`,
                                icon:
                                    <Avatar className="rounded h-5 w-5">
                                        <AvatarFallback>{course?.name[0]}</AvatarFallback>
                                        {course?.image && <AvatarImage src={course.image} alt={course.name} />}
                                    </Avatar>
                            },
                            {
                                label: 'Teaching Center',
                                href: `/user/courses/${lesson?.courseId}/lessons`,
                                icon: <DocumentTextIcon className="inline-block mr-1 h-4 w-4 text-primary" />,

                            },
                            {
                                label: lesson?.name || 'Lesson',
                                href: `/user/courses/${lesson?.courseId}/lessons/${lesson?.id}`,
                                active: true,
                                icon:
                                    <Avatar className="rounded h-5 w-5">
                                        <AvatarFallback>{lesson.name[0]}</AvatarFallback>
                                    </Avatar>
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>

                {alreadyJoined ? (
                    <Link
                        aria-label="Leave lesson"
                        href={`/user/courses/${lesson.course.id}/lessons/${lesson.id}/join`}
                        className={buttonVariants({
                            variant: 'destructive',
                        })}
                    >
                        Leave this lesson
                    </Link>
                    
                ) : (
                    <JoinLessonButton
                        lessonId={lesson.id}
                        courseId={lesson.course.id}
                        userId={session.user.id} 
                    />
                )}

            </LayoutActions>
            <LayoutContent className="flex flex-col gap-2">
                <Suspense fallback={<CardSkeleton />}>
                    <LessonContentWrapper params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}