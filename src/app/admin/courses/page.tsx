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

import { PlusIcon, } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { AdminCoursesTableUI } from "./AdminCoursesTableUI";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/skeleton";
import { AdminCoursesTableServer } from "./AdminCoursesTableServer";

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
                </Suspense>
            </LayoutContent>
        </Layout>
    )
}