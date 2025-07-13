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
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon';
import Link from 'next/link';

export default async function AdminPage() {
    const session = await getRequiredAuthSession();
    const courses = await prisma.course.findMany({
        where: {
            creatorId: session.user.id,
        },
    });
    // const courses = await prisma.course.findMany();

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                label: 'Admin',
                                href: '/admin/'
                            },
                            {
                                label: 'Courses', href: '/admin/courses', active: true,
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>
                <Link
                    href="/admin/courses/new"
                    className={buttonVariants({
                        variant: 'secondary',
                    })}
                >
                    New Course
                </Link>
            </LayoutActions>
            <LayoutContent>
                <Card>
                    <CardContent className="mt-0">
                        <Typography variant="large" className="mb-6">
                            Admin Courses Dashboard
                        </Typography>
                        <Typography variant="small" className="mb-6">
                            Here you can manage all courses. Click on a course to view or edit its details.
                        </Typography>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead> </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Presentation</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>

                            </TableHeader>
                            <TableBody>
                                {courses && courses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell>
                                            <Avatar className="rounded h-5 w-5">
                                                <AvatarFallback>{course.name[0]}</AvatarFallback>
                                                {course.image && (
                                                    <AvatarImage src={course.image} alt={course.name} />
                                                )}
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                as={Link}
                                                variant="large"
                                                href={`/admin/courses/${course.id}`}
                                            >
                                                {course.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                as={Link}
                                                href={`/admin/courses/${course.id}`}
                                                variant="small"
                                            >
                                                {course.presentation}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/admin/courses/${course.id}/edit`}>
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </Link>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </LayoutContent>
        </Layout>
    );
}