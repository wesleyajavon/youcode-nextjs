import { getRequiredAuthSession } from "@/lib/auth";
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/layout";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { redirect } from "next/navigation";
import { getCourse } from "@/app/admin/courses/_actions/course.query";
import { CoursePageContentSkeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import CoursePageContentGeneric from "@/components/common/CoursePageContentGeneric";


export default async function CoursePage(props: { params: Promise<{ id: string }> }) {
    const session = await getRequiredAuthSession();
    const params = await props.params;
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
                            {
                                label: course.name,
                                href: '/user/courses/' + course.id,
                                active: true,
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutContent>
                <Suspense fallback={<CoursePageContentSkeleton />}>
                    <CoursePageContentGeneric params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    )

}