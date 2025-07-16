import { getRequiredAuthSession } from '@/lib/auth';
import React, { Suspense } from 'react';
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { getLesson} from '@/app/admin/courses/_actions/lesson.query';
import { LessonUI } from './LessonUI';
import { CardSkeleton } from '@/components/ui/skeleton';

// This page is used to display the content of a lesson in markdown format
// It fetches the lesson content from the database and renders it using ReactMarkdown
// The lessonId is passed as a parameter in the URL
// Example URL: /user/courses/[id]/lessons/[lessonId]

// ...existing imports...
// ...autres imports...

export default async function LessonPage(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);
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
                                label: 'Lessons',
                                href: '/user/courses/' + lesson?.courseId + '/lessons',
                            },
                            {
                                label: lesson?.name || 'Lesson',
                                href: '/user/courses/' + lesson?.courseId + '/lessons' + '/' + lesson?.id,
                                active: true,
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>

                {alreadyJoined ? (
                    <Link
                        href={`/user/courses/${lesson.course.id}/lessons/${lesson.id}/join`}
                        className={buttonVariants({
                            variant: 'destructive',
                        })}
                    >
                        Leave this lesson
                    </Link>
                ) : (
                    <Link
                        href={`/user/courses/${lesson.course.id}/lessons/${lesson.id}/join`}
                        className={buttonVariants({
                            variant: 'default',
                        })}
                    >
                        Join this lesson
                    </Link>)}

            </LayoutActions>
            <LayoutContent className="flex flex-col gap-2 ">
                <Suspense fallback={<CardSkeleton />}>
                    <LessonUI params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}