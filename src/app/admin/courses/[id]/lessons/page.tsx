import { getRequiredAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { AdminLessonsTableUI } from "./AdminLessonsTableUI";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/skeleton";
import { AdminLessonsTableServer } from "./AdminLessonsTableServer";

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
                            { label: course.name.slice(0, 30) || 'Course', href: `/admin/courses/${courseId}` },
                            { label: 'Lessons', href: `/admin/courses/${courseId}/lessons`, active: true },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>
                <Link
                    href={`/admin/courses/${courseId}/lessons/new`}
                    className={buttonVariants({
                        variant: 'secondary',
                    })}
                >
                    <PlusIcon className="h-5 w-5" />
                </Link>
            </LayoutActions>
            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <AdminLessonsTableServer
                        params={props.params}
                    />
                </Suspense>
            </LayoutContent>

        </Layout>
    )
}