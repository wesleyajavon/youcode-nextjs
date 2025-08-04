import { Card, CardContent, CardHeader } from '@/components/ui/common/card';
import { getRequiredAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { CourseForm } from '../client/CourseForm';
import { Typography } from '@/components/ui/common/typography';

// This component is used to edit an existing course in the admin panel.
// It fetches the course data based on the ID from the URL parameters and renders a form
// for editing the course details. If the course does not exist or the user is not authorized,
// it redirects to the courses list page.
// It also includes a header with instructions for editing the course.
// The course form allows the user to update the course name, image, and presentation.
// If the course is successfully updated, it redirects to the course details page and refreshes the page.

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
                    👇🏾 Ready to make edits? Update your course below. 
                </Typography>
            </CardHeader>
            <CardContent>
                <CourseForm defaultValue={course} />
            </CardContent>
        </Card>
    )
}
