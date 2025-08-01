import { getRequiredAuthSession } from '@/lib/auth';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { redirect } from 'next/navigation';
import { getLesson, getLessonContent } from '@/app/admin/courses/_actions/lesson.query';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { Progress } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LockClosedIcon } from '@heroicons/react/24/outline';
import remarkGfm from 'remark-gfm';


export async function PublicLessonPageContentUI(props: { params: Promise<{ lessonId: string }> }) {
    const params = await props.params;
    const lesson = await getLesson(params.lessonId);
    const markdown = await getLessonContent(params.lessonId);

    // await new Promise(res => setTimeout(res, 5000));

    if (!lesson) {
        redirect(`public`);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Typography variant={'h2'}>
                        {lesson?.course?.name || 'Course'}
                    </Typography>
                    <Typography variant={'muted'}>
                        {lesson?.name || 'Lesson'}
                    </Typography>
                </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {markdown}
                    </ReactMarkdown>
            </CardContent>
        </Card>
    )
}
