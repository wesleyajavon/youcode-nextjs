/* eslint-disable @next/next/no-img-element */
import {
    Layout,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';
import { getRequiredAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import AdminCourseEditUI from '../../../../../components/admin/server/AdminCourseEditUI';
import { CardSkeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon';

export default async function CoursePage(props: { params: Promise<{ id: string }> }) {
    const session = await getRequiredAuthSession();
    const params = await props.params;

    const course = await prisma.course.findUnique({
        where: {
            id: params.id,
            creatorId: session.user.id,
        },
        select: {
            id: true,
            name: true,
        },
    });

    if (!course) {
        redirect(`/admin/courses/`);
    }

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'Courses Hub', href: '/admin/courses' },
                            {
                                label: course.name,
                                href: '/admin/courses/' + course.id,
                            },
                            {
                                href: '/admin/courses/' + course.id + '/edit',
                                active: true,
                                icon: <PencilSquareIcon className="inline-block mr-1 h-4 w-4 text-primary" />,

                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <AdminCourseEditUI params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}