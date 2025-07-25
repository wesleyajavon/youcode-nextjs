import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CourseForm } from '../../../../components/admin/client/CourseForm';
import { Typography } from '@/components/ui/typography';

export async function AdminCoursesCreateUI() {

    // await new Promise(res => setTimeout(res, 5000));

    return (
        <Card className="flex-[2]">
            <CardHeader>
                <Typography variant="h2">New Course</Typography>
                <Typography variant="small" className="mt-2">
                    Fill in the details below to create a new course.
                </Typography>
                <Typography variant="muted" className="mt-2">
                    Ensure all fields are filled out correctly before submitting.
                </Typography>
            </CardHeader>
            <CardContent className="mt-2">
                <CourseForm />
            </CardContent>
        </Card>
    )
}
