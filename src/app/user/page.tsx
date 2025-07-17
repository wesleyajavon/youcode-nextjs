/* eslint-disable @next/next/no-img-element */

import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { getRequiredAuthSession } from '@/lib/auth';
import { BookOpenIcon, UserIcon, RectangleStackIcon } from '@heroicons/react/24/outline';

import Link from 'next/link';
import { getCoursesNumber, getUsersCountForUserCourses } from '../admin/courses/_actions/course.query';
import { getLessonsNumber } from '../admin/courses/_actions/lesson.query';
import { getCoursesNumberAsUser } from './courses/_actions/course.query';
import { getLessonsNumberAsUser } from './courses/_actions/lesson.query';
import { UserDashboardUI } from './UserDashboardUI';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/skeleton';

export default async function AdminPage() {
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
                    <UserDashboardUI />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}