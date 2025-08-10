import { redirect } from "next/navigation";
import {
    Layout,
    LayoutActions,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/LayoutTemp';
import Breadcrumbs from '@/components/ui/common/breadcrumbs';
import { buttonVariants } from '@/components/ui/common/button';
import { DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/common/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/common/avatar";
import { LessonTableServer } from "@/components/common/server/LessonTable";
import { getCourseInfo } from "@/lib/queries/admin/course.query";

export default async function LessonsPage(props: { params: Promise<{ id: string }> }) {
    // Optimisation: simultaneous execution of asynchronous calls
    const [course] = await Promise.all([
        props.params.then(params => getCourseInfo(params.id))
    ]);


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
                                label: course.name || 'Course',
                                href: `/admin/courses/${course.id}`,
                                icon:
                                    <Avatar className="rounded h-5 w-5">
                                        <AvatarFallback>{course.name[0]}</AvatarFallback>
                                        {course.image && <AvatarImage src={course.image} alt={course.name} />}
                                    </Avatar>
                            },
                            { label: 'Teaching Center', href: `/admin/courses/${course.id}/lessons`, active: true, icon: <DocumentTextIcon className="inline-block mr-1 h-4 w-4 text-primary" /> },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>
                <Link
                    aria-label="Create new lesson"
                    href={`/admin/courses/${course.id}/lessons/new`}
                    className={buttonVariants({
                        variant: 'default',
                    })}
                >
                    <PlusIcon className="h-5 w-5" />
                </Link>
            </LayoutActions>
            <LayoutContent className='flex flex-col gap-4'>
                <Suspense fallback={<CardSkeleton />}>
                    <LessonTableServer params={props.params} />
                </Suspense>
                
            </LayoutContent>
        </Layout>
    )
}