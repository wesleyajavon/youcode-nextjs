import React, { Suspense } from 'react';
import { getLesson } from '../../../_actions/lesson.query';
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { DocumentTextIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardSkeleton } from '@/components/ui/skeleton';
import { getCourse } from '../../../_actions/course.query';
import AdminLessonPageContentUI from '@/components/admin/server/AdminLessonPageContentUI';

// This page is used to display the content of a lesson in markdown format
// It fetches the lesson content from the database and renders it using ReactMarkdown
// The lessonId is passed as a parameter in the URL
// Example URL: /admin/courses/[id]/lessons/[lessonId]

export default async function LessonPage(props: { params: Promise<{ id: string, lessonId: string }> }) {
  const params = await props.params;
  const course = await getCourse(params.id);
  const lesson = await getLesson(params.lessonId);

  if (!lesson) {
    redirect(`/admin/courses/${params.id}/lessons`);
  }


  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>
          <Breadcrumbs
            breadcrumbs={[
              {
                href: `/admin/courses/${lesson?.courseId}`,
                icon:
                  <Avatar className="rounded h-5 w-5">
                    <AvatarFallback>{course?.name[0]}</AvatarFallback>
                    {course?.image && <AvatarImage src={course.image} alt={course.name} />}
                  </Avatar>
              },
              {
                label: 'Teaching Center',
                href: '/admin/courses/' + lesson?.courseId + '/lessons',
                icon: <DocumentTextIcon className="inline-block mr-1 h-4 w-4 text-primary" />,

              },
              {
                label: lesson?.name || 'Lesson',
                href: '/admin/courses/' + lesson?.courseId + '/lessons' + '/' + lesson?.id,
                active: true,
                icon:
                  <Avatar className="rounded h-5 w-5">
                    <AvatarFallback>{lesson.name[0]}</AvatarFallback>
                  </Avatar>
              },
            ]}
          />
        </LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <Link
          href={`/admin/courses/${lesson?.courseId}/lessons/${lesson?.id}/edit`}
          className={buttonVariants({
            variant: 'outline',
          })}
        >
          <PencilSquareIcon className="h-5 w-5" />
        </Link>
      </LayoutActions>
      <LayoutContent className="flex flex-col gap-2 ">
        <Suspense fallback={<CardSkeleton />}>
          <AdminLessonPageContentUI params={props.params} />
        </Suspense>
      </LayoutContent>
    </Layout>
  );
}