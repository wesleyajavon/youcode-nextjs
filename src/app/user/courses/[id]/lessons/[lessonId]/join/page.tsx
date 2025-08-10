import { getRequiredAuthSession } from "@/lib/auth";
import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/LayoutTemp";
import Breadcrumbs from "@/components/ui/common/breadcrumbs";
import { getLessonInfo } from "@/lib/queries/admin/lesson.query";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/common/skeleton";
import { JoinLessonUI } from "@/components/user/server/JoinLessonUI";
import { BookOpen } from "lucide-react";
import { DocumentTextIcon, UserMinusIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback } from "@/components/ui/common/avatar";
import { getLessonOnUser } from "@/lib/queries/user/lesson/lesson.query";

export default async function JoinLessonPage(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const session = await getRequiredAuthSession();
    const [lesson] = await Promise.all([
        props.params.then(params => getLessonInfo(params.lessonId))
    ]);

    if (!lesson) {
        redirect(`/user/courses/`);
    }

    // Vérifie si l'utilisateur a déjà rejoint la leçon
    const alreadyJoined = await getLessonOnUser(session.user.id, lesson.id);

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
                                label: 'Teaching Center',
                                href: `/user/courses/${lesson.courseId}/lessons`,
                                icon: <DocumentTextIcon className="inline-block mr-1 h-4 w-4 text-primary" />,

                            },
                            {
                                label: lesson?.name || 'Lesson',
                                href: `/user/courses/${lesson.courseId}/lessons/${lesson.id}`,
                                icon:
                                    <Avatar className="rounded h-5 w-5">
                                        <AvatarFallback>{lesson.name[0]}</AvatarFallback>
                                    </Avatar>
                            },
                            {
                                label: alreadyJoined ? 'Leave' : 'Join',
                                href: `/user/courses/${lesson.courseId}/lessons/${lesson.id}/join`,
                                active: true,
                                icon: alreadyJoined ? <UserMinusIcon className="inline-block mr-1 h-4 w-4 text-primary" /> : <UserPlusIcon className="inline-block mr-1 h-4 w-4 text-primary" />
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <JoinLessonUI params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}
