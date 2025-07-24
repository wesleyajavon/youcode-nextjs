/* eslint-disable @next/next/no-img-element */

import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { buttonVariants } from '@/components/ui/button';
import { getRequiredAuthSession } from '@/lib/auth';
import { BookOpenIcon, RectangleStackIcon } from '@heroicons/react/24/outline';

import Link from 'next/link';
import { getCoursesNumberAsUser } from './courses/_actions/course.query';
import { getLessonsNumberAsUser } from './courses/_actions/lesson.query';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/skeleton';
import { DashboardCard } from '@/components/common/DashboardCard';

export default async function UserDashboardPage() {

    const stats = [
        { icon: <RectangleStackIcon className="h-5 w-5 text-white-foreground inline-block" />, label: 'You are subscribed to', value: (await getCoursesNumberAsUser(await getRequiredAuthSession().then(session => session.user.id))) + ' courses.' },
        { icon: <BookOpenIcon className="h-5 w-5 text-white-foreground inline-block" />, label: 'You are currently following', value: (await getLessonsNumberAsUser(await getRequiredAuthSession().then(session => session.user.id))) + ' lessons.' }
    ];

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'User', href: '/user/', active: true },]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>
                <Link
                    href="/user/courses/"
                    className={buttonVariants({
                        variant: 'secondary',
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