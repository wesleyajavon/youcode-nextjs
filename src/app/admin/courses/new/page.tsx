import {
    Layout,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/LayoutTemp';
import Breadcrumbs from '@/components/ui/common/breadcrumbs';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/common/skeleton';
import { PlusCircle } from "lucide-react";
import HomeIcon from '@heroicons/react/24/outline/HomeIcon';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { AdminCoursesCreateUI } from '@/components/admin/server/AdminCourseCreateUI';

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