import { Card, CardContent, CardHeader } from '@/components/ui/common/card';
import { getRequiredAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { CourseForm } from '../client/CourseForm';
import { Typography } from '@/components/ui/common/typography';

// This component is used as a wrapper for the course editing form.
// It fetches the course data based on the ID from the URL parameters and renders the CourseForm component.
// The form allows the user to edit an existing course with all necessary details.
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
                <Typography variant="h2">Customize your course 🔧 </Typography>
                <Typography variant="muted">
                    Ready to make edits? Update your course below. 👇🏾 
                </Typography>
            </CardHeader>
            <CardContent>
                <CourseForm defaultValue={course} />
            </CardContent>
        </Card>
    )
}
