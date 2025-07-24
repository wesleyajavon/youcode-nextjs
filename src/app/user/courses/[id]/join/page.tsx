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
import { CourseJoinUI } from "../../../../../components/user/CourseJoin";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/skeleton";

export default async function JoinCoursePage(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const session = await getRequiredAuthSession();
    const course = await getCourse(params.id);

    if (!course) {
        redirect('/user/courses');
    }

    // Vérifie si l'utilisateur est déjà inscrit
    const alreadyJoined = course.users.some(
        (u: any) => u.user.id === session.user.id
    );


    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'Courses', href: '/user/courses' },
                            { label: course.name, href: `/user/courses/${course.id}` },
                            { label: alreadyJoined ? 'Leave' : 'Join', href: `/user/courses/${params.id}/join`, active: true },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <CourseJoinUI params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}