// page.tsx (server)
import { getRequiredAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    Layout,
    LayoutActions,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { buttonVariants } from '@/components/ui/button';

import { PencilSquareIcon, PlusIcon, } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { AdminCoursesTableUI } from "./AdminCoursesTableUI";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/skeleton";
import { AdminCoursesTableServer } from "./AdminCoursesTableServer";
import { CoursesTableGeneric } from "@/components/youcode/CoursesTable";

export default async function AdminPage() {
    const session = await getRequiredAuthSession();
    const courses = await prisma.course.findMany({
        where: {
            creatorId: session.user.id
        },
        orderBy: { createdAt: "asc" },
    });

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'Admin', href: '/admin/' },
                            { label: 'Courses', href: '/admin/courses', active: true },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>
                <Link
                    href={`/admin/courses/new`}
                    className={buttonVariants({
                        variant: 'secondary',
                    })}
                >
                    <PlusIcon className="h-5 w-5" />
                </Link>
            </LayoutActions>
            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <AdminCoursesTableServer />

                    {/* I need to find a way to make my table more generic so that it can be reused in different contexts. */}
                    {/* For now, I will keep using the AdminCoursesTableServer component. */}

                    {/* <CoursesTableGeneric
                        courses={courses}
                        title="Admin Courses"
                        description="Here you can manage all your courses. Click on a course to edit or delete it."
                        renderActions={(course) => (
                            <Link href={`/admin/courses/${course.id}/edit`}>
                                <PencilSquareIcon className="h-5 w-5" />
                            </Link>
                        )}  />*/}
                   
                </Suspense>
            </LayoutContent>
        </Layout>
    )
}