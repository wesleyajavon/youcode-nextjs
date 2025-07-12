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

export default async function CoursePage() {
    const courses = await prisma.course.findMany();

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
                <Card>
                    <CardContent className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Presentation</TableHead>
                                </TableRow>

                            </TableHeader>
                            <TableBody>
                                {courses && courses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell>
                                            <Avatar className="rounded">
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
                                                href={`/user/courses/${course.id}`}
                                            >
                                                {course.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                as={Link}
                                                href={`/user/courses/${course.id}`}
                                                variant="small"
                                            >
                                                {course.presentation}
                                            </Typography>
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