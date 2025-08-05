/* eslint-disable @next/next/no-img-element */

import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/LayoutTemp';
import Breadcrumbs from '@/components/ui/common/breadcrumbs';
import { buttonVariants } from '@/components/ui/common/button';
import Link from 'next/link';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/common/skeleton';
import { getRequiredAuthSession } from '@/lib/auth';
import { getCoursesNumber, getUsersCountForUserCourses } from './courses/_actions/course.query';
import { getLessonsNumber } from './courses/_actions/lesson.query';
import { BookOpenIcon, UserIcon } from 'lucide-react';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { DashboardCard } from '@/components/common/server/DashboardCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';

export default async function AdminDashboardPage() {

    const session = await getRequiredAuthSession();
    const coursesCount = await getCoursesNumber(session.user.id);
    const lessonsCount = await getLessonsNumber(session.user.id);
    const usersCount = await getUsersCountForUserCourses(session.user.id);

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
            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <DashboardCard stats={stats} />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}