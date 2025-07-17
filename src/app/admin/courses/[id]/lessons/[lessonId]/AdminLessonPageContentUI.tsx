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
import { redirect } from 'next/navigation';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCourse } from '../../../_actions/course.query';

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
                        {lesson.name.slice(0, 20) || 'Lesson'}
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
