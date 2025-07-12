/* eslint-disable @next/next/no-img-element */
import {
    Layout,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';
import { Card, CardContent } from '@/components/ui/card';
import { getRequiredAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { CourseForm } from './CourseForm';
import Breadcrumbs from '@/components/ui/breadcrumbs';

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
            image: true,
            name: true,
            presentation: true,
            state: true,
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
                            { label: 'Courses', href: '/admin/courses' },
                            {
                                label: course.name,
                                href: '/admin/courses/' + course.id,
                            },
                            {
                                label: 'Edit',
                                href: '/admin/courses/' + course.id + '/edit',
                                active: true,
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutContent>
                <Card className="flex-[2]">
                    <CardContent className="mt-6">
                        <CourseForm defaultValue={course} />
                    </CardContent>
                </Card>
            </LayoutContent>
        </Layout>
    );
}