/* eslint-disable @next/next/no-img-element */
import {
    Layout,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getRequiredAuthSession } from '@/lib/auth';
import { CourseForm } from '../../../../components/admin/client/CourseForm';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Typography } from '@/components/ui/typography';
import { AdminCoursesCreateUI } from './AdminCourseCreateUI';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/skeleton';

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
                <Suspense fallback={<CardSkeleton />}>
                    <AdminCoursesCreateUI />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}