/* eslint-disable @next/next/no-img-element */
import {
    Layout,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { CardSkeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { CoursesTable } from './CourseTable';

export default async function CoursePage() {

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                label: 'User',
                                href: '/user/'
                            },
                            {
                                label: 'Courses', href: '/user/courses', active: true,
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <CoursesTable />
                </Suspense>

            </LayoutContent>
        </Layout>
    );
}