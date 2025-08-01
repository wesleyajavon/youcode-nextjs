import { getCourse } from "../../_actions/course.query";
import { notFound } from "next/navigation";
import {
    Layout,
    LayoutActions,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { buttonVariants } from '@/components/ui/button';

import { DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/skeleton";
import { AdminLessonsTableServer } from "@/components/admin/server/AdminLessonsTableServer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function LessonsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const courseId = params.id;
    const course = await getCourse(courseId);
    if (!course) {
        notFound()
    }

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                label: course.name || 'Course',
                                href: `/admin/courses/${courseId}`,
                                icon:
                                    <Avatar className="rounded h-5 w-5">
                                        <AvatarFallback>{course.name[0]}</AvatarFallback>
                                        {course.image && <AvatarImage src={course.image} alt={course.name} />}
                                    </Avatar>
                            },
                            { label: 'Teaching Center', href: `/admin/courses/${courseId}/lessons`, active: true, icon: <DocumentTextIcon className="inline-block mr-1 h-4 w-4 text-primary" /> },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>
                <Link
                    href={`/admin/courses/${courseId}/lessons/new`}
                    className={buttonVariants({
                        variant: 'default',
                    })}
                >
                    <PlusIcon className="h-5 w-5" />
                </Link>
            </LayoutActions>
            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <AdminLessonsTableServer params={props.params} />
                </Suspense>
            </LayoutContent>
        </Layout>
    )
}