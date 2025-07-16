/* eslint-disable @next/next/no-img-element */
import {
    Layout,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getRequiredAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { CourseForm } from './CourseForm';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Typography } from '@/components/ui/typography';

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
                <Card className="flex-[2] mb-6">
                    <CardHeader>
                        <Typography variant="large">Edit Course</Typography>
                        <Typography variant="small" className="mt-2">
                            Fill in the details below to edit the course.
                        </Typography>

                    </CardHeader>
                    <CardContent className="mt-6">
                        <CourseForm defaultValue={course} />
                    </CardContent>
                </Card>
            </LayoutContent>
        </Layout>
    );
}