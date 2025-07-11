import { getRequiredAuthSession } from '@/lib/auth';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { getLesson, getLessonContent } from '../../../_actions/lesson.query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Typography } from '@/components/ui/typography';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

// This page is used to display the content of a lesson in markdown format
// It fetches the lesson content from the database and renders it using ReactMarkdown
// The lessonId is passed as a parameter in the URL
// Example URL: /admin/courses/[id]/lessons/[lessonId]

export default async function LessonPage(props: { params: Promise<{ lessonId: string }> }) {
  const session = await getRequiredAuthSession();
  const params = await props.params;
  const lesson = await getLesson(params.lessonId);

  const markdown = await getLessonContent(params.lessonId);

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>
          <Breadcrumbs
            breadcrumbs={[
              {
                label: 'Lessons',
                href: '/admin/courses/' + lesson?.courseId + '/lessons',
              },
              {
                label: lesson?.name || 'Lesson',
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
          Edit
        </Link>
      </LayoutActions>
      <LayoutContent className="flex flex-col gap-2 ">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              <Typography variant={'h2'}>
                {lesson?.course?.name || 'Course'} - {lesson?.name || 'Lesson'}
              </Typography>
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
}