import { getCourse } from "../_actions/course.query";
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/layout";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { redirect } from "next/navigation";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { CoursePageContentSkeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import CoursePageContentGeneric from "@/components/common/server/CoursePageContentGeneric";
import { BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


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
                            { label: 'Courses Hub', href: '/admin/courses' },
                            {
                                label: course.name || 'Course',
                                href: '/admin/courses/' + course.id,
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
                <Link href={`/admin/courses/${course.id}/edit`}
                    className={buttonVariants({
                        variant: 'outline',
                    })}>
                    <PencilSquareIcon className="h-5 w-5" />
                </Link>
            </LayoutActions>
            <LayoutContent>
                <Suspense fallback={<CoursePageContentSkeleton />}>
                    <CoursePageContentGeneric params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout >
    )

}