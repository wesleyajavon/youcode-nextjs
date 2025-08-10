import { getRequiredAuthSession } from '@/lib/auth';
import React, { Suspense } from 'react';
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/LayoutTemp';
import Breadcrumbs from '@/components/ui/common/breadcrumbs';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/common/button';
import { redirect } from 'next/navigation';
import { getLesson, getLessonInfo } from '@/lib/queries/admin/lesson.query';
import { CardSkeleton } from '@/components/ui/common/skeleton';
import { JoinLessonButton } from '@/components/ui/user/JoinLessonButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';
import { getCourseInfo } from '@/lib/queries/admin/course.query';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { LessonContentWrapper } from '@/components/common/server/LessonContentWrapper';
import { prisma } from '@/lib/prisma';
import { getLessonOnUser } from '@/lib/queries/user/lesson/lesson.query';

// This page is used to display the content of a lesson in markdown format
// It fetches the lesson content from the database and renders it using ReactMarkdown
// The lessonId is passed as a parameter in the URL
// Example URL: /user/courses/[id]/lessons/[lessonId]

// ...existing imports...
// ...autres imports...

export default async function LessonPage(props: { params: Promise<{ id: string, lessonId: string }> }) {


    const session = await getRequiredAuthSession();
    const [course, lesson] = await Promise.all([
        props.params.then(params => getCourseInfo(params.id)),
        props.params.then(params => getLessonInfo(params.lessonId))
    ]);

    if (!course) {
        redirect(`/user/courses`);
    }

    if (!lesson) {
        redirect(`/user/courses/${course.id}/lessons`);
    }

    // Check if the user has already joined the lesson
    const alreadyJoined = await getLessonOnUser(session.user.id, lesson.id);


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
                        href={`/user/courses/${lesson.courseId}/lessons/${lesson.id}/join`}
                        className={buttonVariants({
                            variant: 'destructive',
                        })}
                    >
                        Leave this lesson
                    </Link>

                ) : (
                    <JoinLessonButton
                        lessonId={lesson.id}
                        courseId={lesson.courseId}
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