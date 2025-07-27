import { getRequiredAuthSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { redirect } from "next/navigation";
import { getCourse } from "@/app/admin/courses/_actions/course.query";
import { JoinCourseButton } from "../client/JoinCourseButton";
import { LeaveCourseButton } from "../client/LeaveCourseButton";

export async function JoinCourseUI(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const session = await getRequiredAuthSession();
    const course = await getCourse(params.id);
    // await new Promise(res => setTimeout(res, 5000));

    if (!course) {
        redirect('/user/courses');
    }

    // Vérifie si l'utilisateur est déjà inscrit
    const alreadyJoined = course.users.some(
        (u: any) => u.user.id === session.user.id
    );

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
