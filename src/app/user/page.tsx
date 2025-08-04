/* eslint-disable @next/next/no-img-element */

import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/LayoutTemp';
import Breadcrumbs from '@/components/ui/common/breadcrumbs';
import { buttonVariants } from '@/components/ui/common/button';
import { getRequiredAuthSession } from '@/lib/auth';
import { BookOpenIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { getCoursesNumberAsUser } from './courses/_actions/course.query';
import { getLessonsNumberAsUser } from './courses/_actions/lesson.query';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/common/skeleton';
import { DashboardCard } from '@/components/common/server/DashboardCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';


export default async function UserDashboardPage() {

    const session = await getRequiredAuthSession();
    const coursesCount = await getCoursesNumberAsUser(session.user.id);
    const lessonsCount = await getLessonsNumberAsUser(session.user.id);

    const stats = [
        {
            icon: <RectangleStackIcon className="h-5 w-5 text-white-foreground inline-block" />,
            label: 'You are subscribed to',
            value: coursesCount + ' courses.'
        },
        {
            icon: <BookOpenIcon className="h-5 w-5 text-white-foreground inline-block" />,
            label: 'You are currently following',
            value: lessonsCount + ' lessons.'
        }
    ];

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                label: 'Student',
                                href: '/user/',
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
                    href="/user/courses/"
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