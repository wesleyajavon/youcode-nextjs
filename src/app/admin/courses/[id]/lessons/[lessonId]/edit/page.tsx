/* eslint-disable @next/next/no-img-element */
import {
    Layout,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/LayoutTemp';

import { redirect } from 'next/navigation';
import Breadcrumbs from '@/components/ui/common/breadcrumbs';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/common/skeleton';
import AdminLessonEditUI from '@/components/admin/server/AdminLessonEditUI';
import { DocumentTextIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';
import { getCourseInfo } from '@/lib/queries/admin/course.query';
import { getLessonInfo } from '@/lib/queries/admin/lesson.query';

export default async function LessonPage(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const params = await props.params;

    const lesson = await getLessonInfo(params.lessonId);
    const course = await getCourseInfo(params.id);

    if (!lesson) {
        redirect(`/admin/courses/${params.id}/lessons`);
    }

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                href: `/admin/courses/${params.id}`,
                                icon:
                                    <Avatar className="rounded h-5 w-5">
                                        <AvatarFallback>{course?.name[0]}</AvatarFallback>
                                        {course?.image && <AvatarImage src={course.image} alt={course.name} />}
                                    </Avatar>
                            },
                            {
                                label: 'Teaching Center',
                                href: `/admin/courses/${lesson.courseId}/lessons/`,
                                icon: <DocumentTextIcon className="inline-block mr-1 h-4 w-4 text-primary" />,
                            },
                            {
                                label: lesson.name,
                                href: `/admin/courses/${lesson.courseId}/lessons/${lesson.id}`,
                                icon:
                                    <Avatar className="rounded h-5 w-5">
                                        <AvatarFallback>{lesson.name[0]}</AvatarFallback>
                                    </Avatar>
                            },
                            {
                                href: `/admin/courses/${lesson.courseId}/lessons/${lesson.id}/edit`,
                                active: true,
                                icon: <PencilSquareIcon className="inline-block h-5 w-5 text-primary" />,
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