import { getCourseInfo } from "../_actions/course.query";
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/LayoutTemp";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/common/button";
import Breadcrumbs from "@/components/ui/common/breadcrumbs";
import { redirect } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { CoursePageContentSkeleton } from "@/components/ui/common/skeleton";
import { Suspense } from "react";
import CoursePageWrapper from "@/components/common/server/CoursePageWrapper";
import { BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/common/avatar";


export default async function CoursePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const course = await getCourseInfo(params.id);

    if (!course) {
        redirect('/admin/courses');
    }

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                label: 'Courses Hub',
                                href: '/admin/courses',
                                icon: <BookOpen className="inline-block mr-1 h-4 w-4 text-primary" />
                            },
                            {
                                label: course.name || 'Course',
                                href: `/admin/courses/${course.id}`,
                                active: true,
                                icon:
                                    <Avatar className="rounded h-5 w-5">
                                        <AvatarFallback>{course.name[0]}</AvatarFallback>
                                        {course.image && <AvatarImage src={course.image} alt={course.name} />}
                                    </Avatar>
                            }
                        ]} />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>
                <Link
                    aria-label="Edit course"
                    href={`/admin/courses/${course.id}/edit`}
                    className={buttonVariants({
                        variant: 'outline',
                    })}>
                    <PencilSquareIcon className="h-5 w-5" />
                </Link>
            </LayoutActions>
            <LayoutContent>
                <Suspense fallback={<CoursePageContentSkeleton />}>
                    <CoursePageWrapper params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout >
    )

}