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
import { CardSkeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon';
import { BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AdminCourseEditUI from '@/components/admin/server/AdminCourseEditUI';

export default async function CourseEditPage(props: { params: Promise<{ id: string }> }) {
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
            image: true,
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
                            {
                                label: 'Courses Hub',
                                href: '/admin/courses',
                                icon: <BookOpen className="inline-block mr-1 h-4 w-4 text-primary" />,
                            },
                            {
                                label: course.name,
                                href: '/admin/courses/' + course.id,
                                icon: <Avatar className="rounded h-5 w-5">
                                    <AvatarFallback>{course.name[0]}</AvatarFallback>
                                    {course.image && <AvatarImage src={course.image} alt={course.name} />}
                                </Avatar>

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