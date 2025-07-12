/* eslint-disable @next/next/no-img-element */
import {
    Layout,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';
import { Card, CardContent } from '@/components/ui/card';
import { getRequiredAuthSession } from '@/lib/auth';
import { CourseForm } from '../[id]/edit/CourseForm';
import Breadcrumbs from '@/components/ui/breadcrumbs';

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
                    <CardContent className="mt-6">
                        <CourseForm />
                    </CardContent>
                </Card>
            </LayoutContent>
        </Layout>
    );
}