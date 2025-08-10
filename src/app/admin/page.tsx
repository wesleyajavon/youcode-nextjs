/* eslint-disable @next/next/no-img-element */

import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/LayoutTemp';
import Breadcrumbs from '@/components/ui/common/breadcrumbs';
import { buttonVariants } from '@/components/ui/common/button';
import Link from 'next/link';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/common/skeleton';
import { getRequiredAuthSession } from '@/lib/auth';
import { getCoursesNumber, getCoursesWithUserCountByCreator, getUsersCountForUserCourses } from '@/lib/queries/admin/course.query';
import { getLessonsNumber } from '@/lib/queries/admin/lesson.query';
import { BookOpenIcon, UserIcon } from 'lucide-react';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { DashboardCard } from '@/components/common/server/DashboardCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';
import { StatChartServer } from '@/components/analytics/server/StatChartServer';
import { MyBarChart } from '@/components/analytics/customCharts/MyBarChart';

// This is the main dashboard page for the admin section
// It displays an overview of the admin's statistics, including courses, lessons, and users.
// The page is server-rendered and includes a session check to ensure the user is authenticated.
// It also includes a chart that visualizes the number of users enrolled in courses created by the
export default async function AdminDashboardPage() {

    const session = await getRequiredAuthSession();
    
    // Optimisation: simultaneous execution of asynchronous calls
    const [
        coursesCount,
        lessonsCount,
        usersCount,
        coursesAndTheirUsersCount
    ] = await Promise.all([
        getCoursesNumber(session.user.id),
        getLessonsNumber(session.user.id),
        getUsersCountForUserCourses(session.user.id),
        getCoursesWithUserCountByCreator(session.user.id)
    ]);

    // await new Promise(res => setTimeout(res, 5000));

    const stats = [
        { icon: <UserIcon className="h-5 w-5 text-white-foreground inline-block" />, label: 'Students enrolled', value: usersCount },
        { icon: <RectangleStackIcon className="h-5 w-5 text-white-foreground inline-block" />, label: 'Courses in Your Library', value: coursesCount },
        { icon: <BookOpenIcon className="h-5 w-5 text-white-foreground inline-block" />, label: 'Published Lessons', value: lessonsCount }
    ];

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                label: 'Teacher',
                                href: '/admin/',
                                active: true,
                                icon: <Avatar className="h-8 w-8 mr-2">
                                    <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                                    {session.user.image && (
                                        <AvatarImage
                                            src={session.user.image}
                                            alt={session.user.name ?? "user picture"}
                                        />
                                    )}
                                </Avatar>
                            },]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>
                <Link
                    aria-label='Go to courses hub'
                    href="/admin/courses/"
                    className={buttonVariants({
                        variant: 'outline',
                    })}
                >
                    Courses
                </Link>
            </LayoutActions>
            <LayoutContent className='flex flex-col gap-4'>
                <Suspense fallback={<CardSkeleton />}>
                    <DashboardCard stats={stats} />
                </Suspense>
                <Suspense fallback={<CardSkeleton />}>
                    <StatChartServer
                        data={coursesAndTheirUsersCount}
                        ChartComponent={MyBarChart}
                        cardDescription="Analysis of your courses performance"
                        subDescription1="See the Impact of Your Courses at a Glance! 🥸"
                        subDescription2="🤩 Track your course engagement and discover what drives your learners!"
                        chartProps={{}}
                    />
                </Suspense>
            </LayoutContent>
        </Layout >
    );
}