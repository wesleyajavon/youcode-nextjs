/* eslint-disable @next/next/no-img-element */

import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/skeleton';
import { getRequiredAuthSession } from '@/lib/auth';
import { getCoursesNumber, getUsersCountForUserCourses } from './courses/_actions/course.query';
import { getLessonsNumber } from './courses/_actions/lesson.query';
import { BookOpenIcon, UserIcon } from 'lucide-react';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { DashboardCard } from '@/components/common/DashboardCard';

export default async function AdminDashboardPage() {

        const session = await getRequiredAuthSession();
        const coursesCount = await getCoursesNumber(session.user.id);
        const lessonsCount = await getLessonsNumber(session.user.id);
        const usersCount = await getUsersCountForUserCourses(session.user.id);

            // await new Promise(res => setTimeout(res, 5000));

        const stats = [
            { icon: <UserIcon className="h-5 w-5 text-gray-100 inline-block" />, label: 'Number of users that joined your courses', value: usersCount },
            { icon: <BookOpenIcon className="h-5 w-5 text-gray-100 inline-block" />, label: 'Total Lessons', value: lessonsCount },
            { icon: <RectangleStackIcon className="h-5 w-5 text-gray-100 inline-block" />, label: 'Total Courses', value: coursesCount }
        ];

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'Admin', href: '/admin/', active: true },]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>
                <Link
                    href="/admin/courses/"
                    className={buttonVariants({
                        variant: 'secondary',
                    })}
                >
                    Courses
                </Link>
            </LayoutActions>
            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    {/* <AdminDashboardUI /> */}
                    <DashboardCard stats={stats} />

                </Suspense>
            </LayoutContent>
        </Layout>
    );
}