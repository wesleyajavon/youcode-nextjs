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
import { getRequiredAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CoursesTableGeneric } from '@/components/youcode/CoursesTable';
import { CheckIcon, Link } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export default async function CoursePage() {

    const session = await getRequiredAuthSession();
    const courses = await prisma.course.findMany({
        include: { users: { select: { user: true } } },
    });

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
                    {/* <CoursesTableGeneric
                        courses={courses}
                        title="Courses Dashboard"
                        description="Here you can find all your courses. Click on a course to view its details."
                        renderActions={(course) => {
                            const alreadyJoined = course.users?.some(
                                (u: any) => u.user.id === session.user.id
                            );
                            return alreadyJoined ? (
                                <CheckIcon className="h-5 w-5 text-green-500" />
                            ) : (
                                <Link
                                    href={`/user/courses/${course.id}/join`}
                                    className={buttonVariants({ variant: 'secondary' })}
                                >
                                    Join
                                </Link>
                            );
                        }}/> */}
                    
                </Suspense>

            </LayoutContent>
        </Layout>
    );
}