/* eslint-disable @next/next/no-img-element */
import {
    Layout,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';
import { Card, CardContent } from '@/components/ui/card';
import { getRequiredAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { LessonForm } from './LessonForm';
import Breadcrumbs from '@/components/ui/breadcrumbs';

export default async function LessonPage(props: { params: Promise<{ lessonId: string }> }) {
    const session = await getRequiredAuthSession();
    const params = await props.params;

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: params.lessonId,
            // creatorId: session.user.id,
        },
        select: {
            id: true,
            name: true,
            state: true,
            content: true,
            courseId: true,
        },
    });

    if (!lesson) {
        notFound();
    }

    return (
        <Layout>
            <LayoutHeader>
                <LayoutTitle>
                    <Breadcrumbs
                        breadcrumbs={[
                            { label: 'Lessons', href: `/admin/courses/${lesson.courseId}/lessons/` },
                            {
                                label: lesson.name,
                                href: `/admin/courses/${lesson.courseId}/lessons/` + lesson.id,
                            },
                            {
                                label: 'Edit',
                                href: `/admin/courses/${lesson.courseId}/lessons/` + lesson.id + '/edit',
                                active: true,
                            },
                        ]}
                    />
                </LayoutTitle>
            </LayoutHeader>
            <LayoutContent>
                <Card className="flex-[2]">
                    <CardContent className="mt-6">
                        <LessonForm defaultValue={lesson} />
                    </CardContent>
                </Card>
            </LayoutContent>
        </Layout>
    );
}