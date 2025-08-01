import {
    Layout,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Suspense } from "react";
import { CardSkeleton } from "@/components/ui/skeleton";
import { PublicLessonsTableServer } from "@/components/public/server/PublicLessonsTableServer";
import { getAuthSession } from '@/lib/auth';

export default async function PublicLessonsPage() {

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'Public Teaching Center', href: `/public/`, active: true, icon: <DocumentTextIcon className="inline-block mr-1 h-4 w-4 text-primary" /> },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
 
            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <PublicLessonsTableServer />
                </Suspense>
            </LayoutContent>
        </Layout>
    )
}