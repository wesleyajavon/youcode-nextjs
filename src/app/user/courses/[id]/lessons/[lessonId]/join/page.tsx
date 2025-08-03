import { getRequiredAuthSession } from "@/lib/auth";
import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from "@/components/layout/Layout";
import Breadcrumbs from "@/components/ui/common/breadcrumbs";
import { prisma } from "@/lib/prisma";
import { getLesson } from "@/app/admin/courses/_actions/lesson.query";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/common/skeleton";
import { JoinLessonUI } from "@/components/user/server/JoinLessonUI";
import { BookOpen } from "lucide-react";
import { DocumentTextIcon, UserMinusIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Avatar, AvatarFallback } from "@/components/ui/common/avatar";

export default async function JoinLessonPage(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const session = await getRequiredAuthSession();
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);

    if (!lesson) {
        redirect(`/user/courses/${params.id}/lessons`);
    }

    // Vérifie si l'utilisateur a déjà rejoint la leçon
    const alreadyJoined = await prisma.lessonOnUser.findFirst({
        where: {
            userId: session.user.id,
            lessonId: lesson.id,
        },
    });

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
                                href: `/user/courses/${params.id}/lessons`,
                                icon: <DocumentTextIcon className="inline-block mr-1 h-4 w-4 text-primary" />,

                            },
                            {
                                label: lesson?.name || 'Lesson',
                                href: `/user/courses/${params.id}/lessons/${lesson?.id}`,
                                icon:
                                    <Avatar className="rounded h-5 w-5">
                                        <AvatarFallback>{lesson.name[0]}</AvatarFallback>
                                    </Avatar>
                            },
                            {
                                label: alreadyJoined ? 'Leave' : 'Join',
                                href: `/user/courses/${params.id}/lessons/${lesson?.id}/join`,
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
