import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/LayoutTemp";
import Breadcrumbs from "@/components/ui/common/breadcrumbs";
import { redirect } from "next/navigation";
import { getCourseInfo } from "@/app/admin/courses/_actions/course.query";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/common/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/common/avatar";
import DocumentTextIcon from "@heroicons/react/24/outline/DocumentTextIcon";
import { LessonTableServer } from "@/components/common/server/LessonTable";


export default async function LessonsPage(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const course = await getCourseInfo(params.id)

    if (!course) {
        redirect('/user/courses');
    }

    return (

        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                label: course.name || 'Course',
                                href: `/user/courses/${params.id}`,
                                icon:
                                    <Avatar className="rounded h-5 w-5">
                                        <AvatarFallback>{course.name[0]}</AvatarFallback>
                                        {course.image && <AvatarImage src={course.image} alt={course.name} />}
                                    </Avatar>
                            },
                            {
                                label: 'Teaching Center',
                                href: `/user/courses/${params.id}/lessons`,
                                active: true,
                                icon: <DocumentTextIcon className="inline-block mr-1 h-4 w-4 text-primary" />
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>

            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <LessonTableServer params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    )

}