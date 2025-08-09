import { getRequiredAuthSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/common/card";
import { Typography } from "@/components/ui/common/typography";
import { redirect } from "next/navigation";
import { getCourse } from "@/lib/queries/admin/course.query";
import { LeaveCourseButton } from "@/components/ui/user/LeaveCourseButton";
import { JoinCourseButton } from "@/components/ui/user/JoinCourseButton";
import { getCourseOnUser } from "@/lib/queries/user/course/course.query";

// This component is used to display the UI for joining or leaving a course.
// It fetches the course data based on the course ID from the URL parameters.
// If the course does not exist, it redirects to the courses list page.
// The component checks if the user is already enrolled in the course and displays appropriate buttons
// for joining or leaving the course.
export async function JoinCourseUI(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const session = await getRequiredAuthSession();
    const course = await getCourse(params.id);

    if (!course) {
        redirect('/user/courses');
    }

    const alreadyJoined = await getCourseOnUser(session.user.id, course.id);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Typography variant="h2">{course.name}</Typography>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {alreadyJoined ? (
                    <>
                        <Typography variant="base">
                            You are about to leave the course: <strong>{course.name}</strong>
                        </Typography>
                        <LeaveCourseButton courseId={course.id} userId={session.user.id} />
                    </>
                ) : (
                    <>
                        <Typography variant="base">
                            You are about to join the course: <strong>{course.name}</strong>
                        </Typography>
                        <JoinCourseButton courseId={course.id} userId={session.user.id} />
                    </>
                )}
            </CardContent>
        </Card>
    )
}
