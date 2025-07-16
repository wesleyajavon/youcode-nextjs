// CoursesTable.tsx (dans le même dossier)
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export async function CoursesTable() {
    const session = await getRequiredAuthSession();

    // await new Promise(res => setTimeout(res, 5000));

    const courses = await prisma.course.findMany(
        {
            include: {
                users: {
                    select: {
                        user: true,
                    },
                },
            },
        }
    );

    return (
        <Card>
            <CardContent className="">
                <Typography variant="h2" className="mb-6">
                    Courses Dashboard
                </Typography>
                <Typography variant="small" className="mb-6">
                    Here you can find all your courses. Click on a course to view its details.
                </Typography>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead> </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Presentation</TableHead>
                            <TableHead>Joined?</TableHead>

                        </TableRow>

                    </TableHeader>
                    <TableBody>
                        {courses && courses.map((course) => {

                            const alreadyJoined = course.users.some(
                                (u: any) => u.user.id === session.user.id
                            );
                            return (

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
                                    <TableCell>
                                        {alreadyJoined ? (
                                            <CheckIcon className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <Link
                                                href={`/user/courses/${course.id}/join`}
                                                className={buttonVariants({
                                                    variant: 'secondary',
                                                })}
                                            >
                                                Join
                                            </Link>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}