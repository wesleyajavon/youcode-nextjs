import React, { Suspense } from 'react';
import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { getCourseName } from '../../../_actions/course.query';
import { AdminLessonCreateUI } from './AdminLessonCreateUI';
import { CardSkeleton } from '@/components/ui/skeleton';

export default async function NewLessonPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const course = await getCourseName(params.id);

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>
          <Breadcrumbs
            breadcrumbs={[
              { label: 'Courses', href: '/admin/courses' },
              { label: course?.name.slice(0, 15) || 'Course', href: `/admin/courses/${params.id}` },
              { label: 'Lessons', href: `/admin/courses/${params.id}/lessons` },
              { label: 'New', href: `/admin/courses/${params.id}/lessons/new`, active: true },
            ]}
          />
        </LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4">
        <Suspense fallback={<CardSkeleton />}>
          <AdminLessonCreateUI courseId={params.id} />
        </Suspense>
      </LayoutContent>
    </Layout>
  );
}