import React, { Suspense } from 'react';
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { redirect } from 'next/navigation';
import { getLesson } from '@/app/admin/courses/_actions/lesson.query';
import { CardSkeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { PublicLessonPageContentUI } from '@/components/public/server/PublicLessonPageContentUI';

// This page is used to display the content of a lesson in markdown format
// It fetches the lesson content from the database and renders it using ReactMarkdown
// The lessonId is passed as a parameter in the URL
// Example URL: /user/courses/[id]/lessons/[lessonId]

// ...existing imports...
// ...autres imports...

export default async function PublicLessonPage(props: { params: Promise<{ lessonId: string }> }) {
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);

    if (!lesson) {
        redirect(`/public`);
    }

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                label: 'Public Teaching Center',
                                href: '/public',
                                icon: <DocumentTextIcon className="inline-block mr-1 h-4 w-4 text-primary" />,

                            },
                            {
                                label: lesson?.name || 'Lesson',
                                href: `/public/lessons/${lesson?.id}`,
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
            
            <LayoutContent className="flex flex-col gap-2 ">
                <Suspense fallback={<CardSkeleton />}>
                    <PublicLessonPageContentUI params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}