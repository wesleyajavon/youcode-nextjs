/* eslint-disable @next/next/no-img-element */
import {
    Layout,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getRequiredAuthSession } from '@/lib/auth';
import { CourseForm } from '../[id]/edit/CourseForm';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Typography } from '@/components/ui/typography';

export default async function CoursePage() {
    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                label: 'Admin',
                                href: '/admin/'
                            },
                            {
                                label: 'Courses', href: '/admin/courses'
                            },
                            {
                                label: 'New Course', href: '/admin/courses/new', active: true,
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutContent>
                <Card className="flex-[2]">
                    <CardHeader>
                        <Typography variant="large">New Course</Typography>
                        <Typography variant="small" className="mt-2">
                            Fill in the details below to create a new course.
                        </Typography>
                        <Typography variant="muted" className="mt-2">
                            Ensure all fields are filled out correctly before submitting.
                        </Typography>
                    </CardHeader>
                    <CardContent className="mt-2">
                        <CourseForm />
                    </CardContent>
                </Card>
            </LayoutContent>
        </Layout>
    );
}