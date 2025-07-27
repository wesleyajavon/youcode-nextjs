/* eslint-disable @next/next/no-img-element */
import {
    Layout,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';

import { prisma } from '@/lib/prisma';
import {  redirect } from 'next/navigation';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/skeleton';
import AdminLessonEditUI from '@/components/admin/server/AdminLessonEditUI';

export default async function LessonPage(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const params = await props.params;

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: params.lessonId,
        },
        select: {
            id: true,
            name: true,
            state: true,
            content: true,
            courseId: true,
        },
    });

    if (!lesson) {
        redirect(`/admin/courses/${params.id}/lessons`);
    }

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'Lessons', href: `/admin/courses/${lesson.courseId}/lessons/` },
                            {
                                label: lesson.name,
                                href: `/admin/courses/${lesson.courseId}/lessons/` + lesson.id,
                            },
                            {
                                label: 'Edit',
                                href: `/admin/courses/${lesson.courseId}/lessons/` + lesson.id + '/edit',
                                active: true,
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <AdminLessonEditUI params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}