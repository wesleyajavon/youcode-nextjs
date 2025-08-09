import { getRequiredAuthSession } from "@/lib/auth";
import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/LayoutTemp";
import Breadcrumbs from "@/components/ui/common/breadcrumbs";
import { redirect } from "next/navigation";
import { getCourse } from "@/lib/queries/admin/course.query";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/common/skeleton";
import { JoinCourseUI } from "@/components/user/server/JoinCourseUI";
import { getCourseOnUser } from "@/lib/queries/user/course/course.query";

export default async function JoinCoursePage(props: { params: Promise<{ id: string }> }) {
    
    const session = await getRequiredAuthSession();
    const params = await props.params;
    const course = await getCourse(params.id);

    if (!course) {
        redirect('/user/courses');
    }

    // Vérifie si l'utilisateur est déjà inscrit
    const alreadyJoined = await getCourseOnUser(session.user.id, course.id);


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
                    <JoinCourseUI params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}