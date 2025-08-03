import { getRequiredAuthSession } from "@/lib/auth";
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/Layout";
import Breadcrumbs from "@/components/ui/common/breadcrumbs";
import { redirect } from "next/navigation";
import { getCourse } from "@/app/admin/courses/_actions/course.query";
import { CoursePageContentSkeleton } from "@/components/ui/common/skeleton";
import { Suspense } from "react";
import CoursePageContentGeneric from "@/components/common/server/CoursePageContentGeneric";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/common/avatar";
import { BookOpen } from "lucide-react";


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
                            {
                                label: 'Courses Hub',
                                href: '/user/courses',
                                icon: <BookOpen className="inline-block mr-1 h-4 w-4 text-primary" />
                            },
                            {
                                label: course.name || 'Course',
                                href: '/user/courses/' + course.id,
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
            <LayoutContent>
                <Suspense fallback={<CoursePageContentSkeleton />}>
                    <CoursePageContentGeneric params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    )

}