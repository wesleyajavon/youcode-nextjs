import { getRequiredAuthSession } from "@/lib/auth";
import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/layout";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getLesson } from "@/app/admin/courses/_actions/lesson.query";
import { redirect } from "next/navigation";
import { LessonJoinUI } from "./LessonJoin";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/skeleton";

export default async function JoinLessonPage(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const session = await getRequiredAuthSession();
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);

    if (!lesson) {
        redirect(`/user/courses/${params.id}/lessons`);
    }

    // Vérifie si l'utilisateur a déjà rejoint la leçon
    const alreadyJoined = await prisma.lessonOnUser.findFirst({
        where: {
            userId: session.user.id,
            lessonId: lesson.id,
        },
    });

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'Courses', href: '/user/courses' },
                            { label: 'Lessons', href: `/user/courses/${params.id}/lessons` },
                            { label: lesson?.name || 'Lesson', href: `/user/courses/${params.id}/lessons/${lesson?.id}` },
                            { label: alreadyJoined ? 'Leave' : 'Join', href: `/user/courses/${params.id}/lessons/${lesson?.id}/join`, active: true },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <LessonJoinUI params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}
