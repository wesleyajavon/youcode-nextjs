import { getRequiredAuthSession } from '@/lib/auth';
import React, { Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import { getLesson, getLessonContent } from '../../../_actions/lesson.query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Typography } from '@/components/ui/typography';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCourse } from '../../../_actions/course.query';
import AdminLessonPageContentUI from './AdminLessonPageContentUI';
import { CardSkeleton } from '@/components/ui/skeleton';

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
                label: course?.name.slice(0, 10) || 'Course',
                href: `/admin/courses/${lesson?.courseId}`,
              },
              {
                label: 'Lessons',
                href: '/admin/courses/' + lesson?.courseId + '/lessons',
              },
              {
                label: lesson?.name.slice(0, 25) || 'Lesson',
                href: '/admin/courses/' + lesson?.courseId + '/lessons' + '/' + lesson?.id,
                active: true,
              },
            ]}
          />
        </LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <Link
          href={`/admin/courses/${lesson?.courseId}/lessons/${lesson?.id}/edit`}
          className={buttonVariants({
            variant: 'secondary',
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