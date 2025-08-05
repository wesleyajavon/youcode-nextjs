import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/common/card';
import { Typography } from '@/components/ui/common/typography';
import { redirect } from 'next/navigation';
import { getLesson, getLessonContentWithRedis } from '@/app/admin/courses/_actions/lesson.query';
import remarkGfm from 'remark-gfm';
import { getCourseInfo } from '@/app/admin/courses/_actions/course.query';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';

// Incremental Static Regeneration (ISR) allows the page to be rebuilt every 60 seconds
// This is useful for keeping the lesson content up-to-date without requiring a full rebuild of the site.
export const revalidate = 60; 

// This component is used to display the content of a lesson in the admin panel.
// It fetches the lesson data and course information based on the IDs from the URL parameters.
// The lesson content is rendered using ReactMarkdown to support Markdown formatting.
// If the lesson does not exist, it redirects to the lessons list page for the corresponding course.
// The header includes the course name and lesson name, along with an avatar for the course image.

export default async function AdminLessonPageContentUI(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);
    const course = await getCourseInfo(params.id);
    // Fetch the lesson content using Redis caching
    const markdown = await getLessonContentWithRedis(params.lessonId);
    // const markdown = await getLessonContent(params.lessonId);


    if (!lesson) {
        redirect(`/admin/courses/${params.id}/lessons`);
    }

    return (
        <Card className="w-full max-w-full sm:max-w-3xl mx-auto rounded-xl shadow-sm">
            <CardHeader>
                <CardTitle>
                    <span className="flex flex-col sm:flex-row items-center gap-2 mb-2 text-center sm:text-left">
                        <Avatar>
                            <AvatarFallback>{course?.name[0]}</AvatarFallback>
                            <AvatarImage className="rounded h-10 w-10" src={course?.image} alt={course?.name} />
                        </Avatar>
                        <Typography variant={'h2'} className="text-base sm:text-xl break-words max-w-[90vw] sm:max-w-none">
                            {lesson?.course?.name || 'Course'}
                        </Typography>
                    </span>
                    <Typography variant={'muted'} className="text-sm sm:text-base break-words max-w-[90vw] sm:max-w-none">
                        {lesson?.name || 'Lesson'}
                    </Typography>
                </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[60vh] max-w-[90vw] lg:max-h-[60vh] sm:max-h-[500px] overflow-y-auto px-2 sm:px-6">
                <div className="prose prose-sm sm:prose max-w-full break-words">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {markdown}
                    </ReactMarkdown>
                </div>
            </CardContent>
        </Card>
    )
}
