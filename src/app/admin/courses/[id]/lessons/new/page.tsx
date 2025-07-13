import { getRequiredAuthSession } from '@/lib/auth';
import React from 'react';
import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { LessonForm } from '../[lessonId]/edit/LessonForm'; // adapte le chemin si besoin


interface PageProps {
  params: { id: string }
}

export default async function NewLessonPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>
          <Breadcrumbs
            breadcrumbs={[
              { label: 'Courses', href: '/admin/courses' },
              { label: 'Lessons', href: `/admin/courses/${params.id}/lessons` },
              { label: 'New', href: `/admin/courses/${params.id}/lessons/new`, active: true },
            ]}
          />
        </LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <Typography variant="h2">Create a new lesson</Typography>
            </CardTitle>
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