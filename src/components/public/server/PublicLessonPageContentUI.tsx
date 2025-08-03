import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/common/card';
import { Typography } from '@/components/ui/common/typography';
import { redirect } from 'next/navigation';
import { getLesson, getLessonContent } from '@/app/admin/courses/_actions/lesson.query';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';
import { getCourseInfo } from '@/app/admin/courses/_actions/course.query';


export async function PublicLessonPageContentUI(props: { params: Promise<{ lessonId: string }> }) {
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);
    const course = await getCourseInfo(lesson?.courseId || '');
    const markdown = await getLessonContent(params.lessonId);

    // await new Promise(res => setTimeout(res, 5000));

    if (!lesson) {
        redirect(`public`);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <span className="inline-flex items-center gap-2 mb-2">
                        <Avatar className="rounded h-10 w-10 mr-4">
                            <AvatarFallback>{course?.name[0]}</AvatarFallback>
                            <AvatarImage src={course?.image} alt={course?.name} />
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
