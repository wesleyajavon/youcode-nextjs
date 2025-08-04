import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/common/card';
import { Typography } from '@/components/ui/common/typography';
import { redirect } from 'next/navigation';
import { getLesson, getLessonContent } from '@/app/admin/courses/_actions/lesson.query';
import remarkGfm from 'remark-gfm';
import { getCourseInfo } from '@/app/admin/courses/_actions/course.query';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';

// This component is used to display the content of a lesson in the admin panel.
// It fetches the lesson data and course information based on the IDs from the URL parameters.
// The lesson content is rendered using ReactMarkdown to support Markdown formatting.
// If the lesson does not exist, it redirects to the lessons list page for the corresponding course.
// The header includes the course name and lesson name, along with an avatar for the course image.

export default async function AdminLessonPageContentUI(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);
    const course = await getCourseInfo(params.id);
    const markdown = await getLessonContent(params.lessonId);

    if (!lesson) {
        redirect(`/admin/courses/${params.id}/lessons`);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <span className="inline-flex items-center gap-2 mb-2">
                        <Avatar>
                            <AvatarFallback>{course?.name[0]}</AvatarFallback>
                            <AvatarImage className="rounded h-10 w-10" src={course?.image} alt={course?.name} />
                        </Avatar>
                        <Typography variant={'h2'}>
                            {lesson?.course?.name || 'Course'}
                        </Typography>
                    </span>
                    <Typography variant={'muted'}>
                        {lesson?.name || 'Lesson'}
                    </Typography>
                </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
                <div className="prose">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {markdown}
                    </ReactMarkdown>
                </div>
            </CardContent>
        </Card>
    )
}
