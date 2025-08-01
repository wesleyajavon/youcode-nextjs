import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { CourseForm } from '../client/CourseForm';

export async function AdminCoursesCreateUI() {

    // await new Promise(res => setTimeout(res, 5000));

    return (
        <Card className="flex-[2]">
            <CardHeader>
                <Typography variant="h2">Ready to create your next course? 👨🏾‍💻</Typography>
                <Typography variant="small" className="mt-2">
                    ✅ Students can enroll in your course once it's published.
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
