import { getRequiredAuthSession } from "@/lib/auth";
import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/layout";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { getCourse } from "@/app/admin/courses/_actions/course.query";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export async function CourseJoinUI(props: { params: Promise<{ id: string }> }) {

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

    async function handleJoin() {
        "use server";
        if (!course) {
            redirect('/user/courses');
        }
        await prisma.courseOnUser.create({
            data: {
                userId: session.user.id,
                courseId: course.id,
            },
        });
        redirect(`/user/courses/${course.id}`);
    }

    async function handleUnjoin() {
        "use server";
        if (!course) {
            redirect('/user/courses');
        }
        await prisma.courseOnUser.delete({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: course.id,
                },
            },
        });
        redirect(`/user/courses/${course.id}`);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Typography variant="h2">{course.name}</Typography>
                </CardTitle>
                {/* <Badge className="w-fit">{course.state}</Badge> */}
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Typography variant="lead">
                    {course.presentation}
                </Typography>
                {alreadyJoined ? (
                    <>
                        <Typography variant="base">
                            You are about to leave the course: <strong>{course.name}</strong>
                        </Typography>
                        <form action={handleUnjoin}>
                            <Button type="submit" variant="destructive" className="mt-2">
                                Leave this course
                            </Button>
                        </form>
                    </>
                ) : (
                    <form action={handleJoin}>
                        <Typography variant="base">
                            You are about to join the course: <strong>{course.name}</strong>
                        </Typography>
                        <Button type="submit" className="mt-6">
                            Join this course
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    )
}
