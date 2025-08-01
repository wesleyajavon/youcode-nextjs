import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { redirect } from 'next/navigation';
import { getLesson, getLessonContent } from '@/app/admin/courses/_actions/lesson.query';
import remarkGfm from 'remark-gfm';


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
                <CardTitle>
                    <Typography variant={'h2'}>
                        {lesson?.course?.name || 'Course'}
                    </Typography>
                    <Typography variant={'muted' }>
                        {lesson?.name || 'Lesson'}
                    </Typography>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {markdown}
                    </ReactMarkdown>
                </div>
            </CardContent>
        </Card>
    )
}
