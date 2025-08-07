/* eslint-disable @next/next/no-img-element */
import {
    Layout,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/LayoutTemp';
import Breadcrumbs from '@/components/ui/common/breadcrumbs';
import { CardSkeleton } from '@/components/ui/common/skeleton';
import { Suspense } from 'react';
import { CourseTableServer } from '@/components/common/server/CourseTable';
import HomeIcon from '@heroicons/react/24/outline/HomeIcon';
import { BookOpen } from 'lucide-react';


export default async function UserCoursesPage() {

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'Dashboard', 
                                href: '/user/',
                                icon: <HomeIcon className="inline-block mr-1 h-4 w-4 text-primary" />
                            },
                            { label: 'Courses Hub', href: '/user/courses', active: true, icon: <BookOpen className="inline-block mr-1 h-4 w-4 text-primary" /> },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutContent>
                <Suspense fallback={<CardSkeleton />}>
                    <CourseTableServer />
                </Suspense>
            </LayoutContent>
        </Layout>
    );
}