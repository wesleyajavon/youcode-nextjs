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
import { AdminCoursesCreateUI } from '../../../../components/admin/server/AdminCourseCreateUI';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/skeleton';
import { PlusCircle } from "lucide-react";
import HomeIcon from '@heroicons/react/24/outline/HomeIcon';
import { BookOpenIcon } from '@heroicons/react/24/outline';

export default async function CoursePage() {
    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                label: 'Dashboard',
                                href: '/admin/',
                                icon: <HomeIcon className="inline-block mr-1 h-4 w-4 text-primary" />

                            },
                            {
                                label: 'Courses Hub', 
                                href: '/admin/courses',
                                icon: <BookOpenIcon className="inline-block mr-1 h-4 w-4 text-primary" />
                            },
                            {
                                href: '/admin/courses/new',
                                active: true,
                                icon: <PlusCircle className="inline-block mr-1 h-4 w-4 text-primary" />
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