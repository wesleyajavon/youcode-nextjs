import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCourse } from '@/app/admin/courses/_actions/course.query';
import { getLesson, getLessonContent } from '@/app/admin/courses/_actions/lesson.query';

export default async function AdminLessonPageContentUI(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const params = await props.params;
    const course = await getCourse(params.id);
    const lesson = await getLesson(params.lessonId);
    const markdown = await getLessonContent(params.lessonId);

    if (!lesson) {
        redirect(`/admin/courses/${params.id}/lessons`);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                    <Typography variant="h2" className="">
                        {lesson.name.slice(0, 30) || 'Lesson'}
                    </Typography>
                    <div className="flex items-baseline gap-3">
                        <Typography variant="muted" className="">
                            {course?.name.slice(0, 25) || 'Course'}
                        </Typography>

                        <Avatar className="rounded h-4 w-4">
                            <AvatarFallback>{course?.name?.[0]}</AvatarFallback>
                            {course?.image && (
                                <AvatarImage src={course?.image} alt={course?.name ?? ''} />
                            )}
                        </Avatar>
                    </div>
                </CardTitle>

            </CardHeader>
            <CardContent className="prose max-w-none">
                <ReactMarkdown>{markdown}</ReactMarkdown>
            </CardContent>
        </Card>
    )
}
