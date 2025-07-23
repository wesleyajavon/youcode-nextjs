import { getCourse } from "../_actions/course.query";
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/layout";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { redirect } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import AdminCoursePageContentUI from "./AdminCoursePageContentUI";
import { CoursePageContentSkeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import CoursePageContentGeneric from "@/components/youcode/CoursePageContentGeneric";


export default async function CoursePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const course = await getCourse(params.id);

    if (!course) {
        redirect('/admin/courses');
    }

    return (

        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'Courses', href: '/admin/courses' },
                            {
                                label: course.name.slice(0, 30) || 'Course',
                                href: '/admin/courses/' + course.id,
                                active: true,
                            },
                        ]} />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>
                <Link href={`/admin/courses/${course.id}/edit`}
                    className={buttonVariants({
                        variant: 'secondary',
                    })}>
                    <PencilSquareIcon className="h-5 w-5" />
                </Link>
            </LayoutActions>
            <LayoutContent>
                <Suspense fallback={<CoursePageContentSkeleton />}>
                    {/* <AdminCoursePageContentUI params={props.params} /> */}
                    <CoursePageContentGeneric params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout >
    )

}