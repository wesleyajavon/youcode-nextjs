import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getRequiredAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { CourseForm } from '../client/CourseForm';
import { Typography } from '@/components/ui/typography';

export default async function AdminCourseEditUI(props: { params: Promise<{ id: string }> }) {
    const session = await getRequiredAuthSession();
    const params = await props.params;

    const course = await prisma.course.findUnique({
        where: {
            id: params.id,
            creatorId: session.user.id,
        },
        select: {
            id: true,
            image: true,
            name: true,
            presentation: true,
            state: true,
        },
    });

    if (!course) {
        redirect(`/admin/courses/`);
    }

    // await new Promise(res => setTimeout(res, 5000));


    return (
        <Card>
            <CardHeader>
                <Typography variant="h2">Edit Course</Typography>
                <Typography variant="muted" className="mt-2">
                    Fill in the details below to edit the course.
                </Typography>

            </CardHeader>
            <CardContent>
                <CourseForm defaultValue={course} />
            </CardContent>
        </Card>
    )
}
