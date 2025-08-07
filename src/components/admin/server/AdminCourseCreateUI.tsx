import { Card, CardContent, CardHeader } from '@/components/ui/common/card';
import { Typography } from '@/components/ui/common/typography';
import { CourseForm } from '@/components/admin/client/CourseForm';
export async function AdminCoursesCreateUI() {

    // This component is used as a wrapper for the course creation form.
    // It provides a header with instructions and renders the CourseForm component.
    // The form allows the user to create a new course with all necessary details.
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
