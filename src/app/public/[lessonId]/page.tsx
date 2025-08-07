import React, { Suspense } from 'react';
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/LayoutTemp';
import Breadcrumbs from '@/components/ui/common/breadcrumbs';
import { redirect } from 'next/navigation';
import { getLesson } from '@/app/admin/courses/_actions/lesson.query';
import { CardSkeleton } from '@/components/ui/common/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { LessonContentWrapper } from '@/components/common/server/LessonContentWrapper';


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
                    <LessonContentWrapper params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}