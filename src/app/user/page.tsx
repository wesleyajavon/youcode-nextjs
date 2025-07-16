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

export default async function AdminPage() {

    // Simulating fetching data, replace with actual data fetching logic
    const session = await getRequiredAuthSession()
    const coursesCount = getCoursesNumberAsUser(session.user.id);
    const lessonsCount = getLessonsNumberAsUser(session.user.id);
    const usersCount = getUsersCountForUserCourses(session.user.id);

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
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Typography variant="h2">Dashboard</Typography>
                        </CardTitle>
                        <CardDescription>Quick Stats</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {/* <Typography variant={"small"}>
                            <UserIcon className="h-5 w-5 text-gray-100 inline-block"/>
                            <span className="ml-2">Number of users that joined your courses: {usersCount}</span>
                        </Typography> */}
                        <Typography variant={"small"}>
                            <RectangleStackIcon className="h-5 w-5 text-gray-100 inline-block" />
                            <span className="ml-2">You are subscribed to {coursesCount} courses.</span>
                        </Typography>
                        <Typography variant={"small"}>
                            <BookOpenIcon className="h-5 w-5 text-gray-100 inline-block" />
                            <span className="ml-2">You are currently following {lessonsCount} lessons.</span>
                        </Typography>

                    </CardContent>
                </Card>
            </LayoutContent>
        </Layout>
    );
}