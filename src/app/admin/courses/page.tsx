// page.tsx (server)
import { getRequiredAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    Layout,
    LayoutActions,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/Layout';
import Breadcrumbs from '@/components/ui/common/breadcrumbs';
import { buttonVariants } from '@/components/ui/common/button';

import { HomeIcon, PlusIcon, } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/common/skeleton";
import { AdminCoursesTableServer } from "@/components/admin/server/AdminCoursesTableServer";
import { BookOpen } from "lucide-react";

export default async function AdminCoursesPage() {
    const session = await getRequiredAuthSession();

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'Dashboard', 
                                href: '/admin/',
                                icon: <HomeIcon className="inline-block mr-1 h-4 w-4 text-primary" />
                            },
                            { label: 'Courses Hub', href: '/admin/courses', active: true, icon: <BookOpen className="inline-block mr-1 h-4 w-4 text-primary" /> },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutActions>
                <Link
                    href={`/admin/courses/new`}
                    className={buttonVariants({
                        variant: 'default',
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