import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { redirect } from 'next/navigation';
import { getCourse } from '@/app/admin/courses/_actions/course.query';
import { getLesson, getLessonContent } from '@/app/admin/courses/_actions/lesson.query';

export default async function AdminLessonPageContentUI(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);
    const markdown = await getLessonContent(params.lessonId);

    if (!lesson) {
        redirect(`/admin/courses/${params.id}/lessons`);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    <Typography variant={'h2'}>
                        {lesson?.course?.name || 'Course'}
                    </Typography>
                    <Typography variant={'h3'}>
                        {lesson?.name || 'Lesson'}
                    </Typography>
                </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
                <ReactMarkdown>{markdown}</ReactMarkdown>
            </CardContent>
        </Card>
    )
}
