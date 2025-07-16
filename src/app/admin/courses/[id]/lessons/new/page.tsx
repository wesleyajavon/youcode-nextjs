import { getRequiredAuthSession } from '@/lib/auth';
import React from 'react';
import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { LessonForm } from '../[lessonId]/edit/LessonForm'; // adapte le chemin si besoin
import { getCourseName } from '../../../_actions/course.query';


interface PageProps {
  params: { id: string }
}

export default async function NewLessonPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const course =  await getCourseName(params.id);

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
        <Card>
          <CardHeader>
            <Typography variant="h2">New Lesson</Typography>
            <Typography variant="small" className="mt-2">
              Fill in the details below to create a new lesson.
            </Typography>
            <Typography variant="muted" className="mt-2">
              Ensure all fields are filled out correctly before submitting.
            </Typography>
            
          </CardHeader>
          <CardContent>
            <LessonForm
              defaultValue={{
                name: '',
                state: 'HIDDEN',
                content: '',
                courseId: params.id,
                id: ''
              }}
            />
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
}