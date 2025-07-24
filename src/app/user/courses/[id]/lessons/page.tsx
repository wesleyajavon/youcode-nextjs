import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/layout";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { redirect } from "next/navigation";
import { getCourse } from "@/app/admin/courses/_actions/course.query";
import { LessonsTable } from "../../../../../components/user/LessonTable";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/skeleton";


export default async function LessonsPage(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const course = await getCourse(params.id)

    if (!course) {
        redirect('/user/courses');
    }


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
                            },
                            {
                                label: 'Lessons',
                                href: '/user/courses/' + course.id + '/lessons',
                                active: true,
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>

            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <LessonsTable params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    )

}