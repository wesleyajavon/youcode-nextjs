import React, { Suspense } from 'react';
import { getLessonInfo, getLessonUsersProgress } from '../../../../../../lib/queries/admin/lesson.query';
import { Layout, LayoutActions, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/LayoutTemp';
import Breadcrumbs from '@/components/ui/common/breadcrumbs';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/common/button';
import { redirect } from 'next/navigation';
import { DocumentTextIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';
import { CardSkeleton } from '@/components/ui/common/skeleton';
import { getCourseInfo } from '../../../../../../lib/queries/admin/course.query';
import { StatChartServer } from '@/components/analytics/server/StatChartServer';
import UserProgressChart from '@/components/analytics/customCharts/UserProgressChart';
import { LessonContentWrapper } from '@/components/common/server/LessonContentWrapper';

// This page is used to display the content of a lesson in markdown format
// It fetches the lesson content from the database and renders it using ReactMarkdown
// The lessonId is passed as a parameter in the URL
// Example URL: /admin/courses/[id]/lessons/[lessonId]

export default async function LessonPage(props: { params: Promise<{ id: string, lessonId: string }> }) {
  const params = await props.params;
  const course = await getCourseInfo(params.id);
  const lesson = await getLessonInfo(params.lessonId);
  const data = await getLessonUsersProgress(params.lessonId);

  if (!course) {
    redirect('/admin/courses');
  }

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
                href: `/admin/courses/${lesson?.courseId}/lessons`,
                icon: <DocumentTextIcon className="inline-block mr-1 h-4 w-4 text-primary" />,

              },
              {
                label: lesson?.name || 'Lesson',
                href: `/admin/courses/${lesson?.courseId}/lessons/${lesson?.id}`,
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
          aria-label="Edit lesson"
          href={`/admin/courses/${lesson?.courseId}/lessons/${lesson?.id}/edit`}
          className={buttonVariants({
            variant: 'outline',
          })}
        >
          <PencilSquareIcon className="h-5 w-5" />
        </Link>
      </LayoutActions>
      <LayoutContent className="flex flex-col gap-4"> 
        <Suspense fallback={<CardSkeleton />}>
          <LessonContentWrapper params={props.params} />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <StatChartServer
            data={data}
            ChartComponent={UserProgressChart}
            cardDescription={lesson.name + " - Student Progress Overview"}
            subDescription1="How are students progressing through this lesson?"
            subDescription2="Hint: 0% means the student has not started the lesson yet. 50% the student is halfway through the lesson. 100% the student has completed the lesson."
            chartProps={{}}
          />
        </Suspense>
      </LayoutContent>
    </Layout>
  );
}