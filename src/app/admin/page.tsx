/* eslint-disable @next/next/no-img-element */
import {
    Layout,
    LayoutActions,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/Layout';
import { buttonVariants } from '@/components/ui/button';

import Link from 'next/link';

export default async function CoursesPage() {
    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>Courses</LayoutTitle>
            </LayoutHeader>
            
            <LayoutContent>
                <Link href={'/admin/courses'}>Courses</Link>
            </LayoutContent>
        </Layout>
    );
}