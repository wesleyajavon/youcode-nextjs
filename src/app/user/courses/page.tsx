/* eslint-disable @next/next/no-img-element */
import {
    Layout,
    LayoutActions,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CardSkeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';
import { getRequiredAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
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