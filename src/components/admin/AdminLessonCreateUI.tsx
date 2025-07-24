import { getRequiredAuthSession } from '@/lib/auth';
import React from 'react';
import { Layout, LayoutContent, LayoutHeader, LayoutTitle } from '@/components/layout/layout';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { LessonForm } from '../../app/admin/courses/[id]/lessons/[lessonId]/edit/LessonForm'; // adapte le chemin si besoin
import { getCourseName } from '../../app/admin/courses/_actions/course.query';



export async function AdminLessonCreateUI(params: { courseId: string }) {

    return (
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
                        courseId: params.courseId,
                        id: ''
                    }}
                />
            </CardContent>
        </Card>
    )
}
