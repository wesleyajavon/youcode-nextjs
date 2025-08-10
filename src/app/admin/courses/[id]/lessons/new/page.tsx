import React, { Suspense } from 'react';
import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/LayoutTemp';
import Breadcrumbs from '@/components/ui/common/breadcrumbs';
import { CardSkeleton } from '@/components/ui/common/skeleton';
import { PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';
import { AdminLessonCreateUI } from '@/components/admin/server/AdminLessonCreateUI';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { getCourseInfo } from '@/lib/queries/admin/course.query';
import { redirect } from 'next/navigation';

export default async function NewLessonPage(props: { params: Promise<{ id: string }> }) {
  // Optimisation: simultaneous execution of asynchronous calls
  const [course] = await Promise.all([
    props.params.then(params => getCourseInfo(params.id))
  ]);

  if (!course) {
    redirect(`/admin/courses/`);
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
              {
                label: 'Teaching Center',
                href: `/admin/courses/${course.id}/lessons`,
                icon: <DocumentTextIcon className="inline-block mr-1 h-4 w-4 text-primary" />,
              },
              {
                href: `/admin/courses/${course.id}/lessons/new`,
                active: true,
                icon: <PlusCircle className="inline-block mr-1 h-4 w-4 text-primary" />
              },
            ]}
          />
        </LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4">
        <Suspense fallback={<CardSkeleton />}>
          <AdminLessonCreateUI courseId={course.id} />
        </Suspense>
      </LayoutContent>
    </Layout>
  );
}