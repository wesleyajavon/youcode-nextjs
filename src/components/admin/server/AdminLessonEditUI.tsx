import { LessonForm } from '@/components/admin/client/LessonForm';
import { Card, CardContent, CardHeader } from '@/components/ui/common/card';
import { Typography } from '@/components/ui/common/typography';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { redirect } from 'next/navigation';

// This component is used to edit an existing lesson in the admin panel.
// It fetches the lesson data based on the ID from the URL parameters and renders a form
// for editing the lesson details. If the lesson does not exist, it redirects to the lessons
// list page for the corresponding course.
// It also includes a header with instructions for editing the lesson.

export default async function AdminLessonEditUI(props: { params: Promise<{ id: string, lessonId: string }> }) {
    const params = await props.params;
    const lesson = await prisma.lesson.findUnique({
        where: {
            id: params.lessonId,
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
        redirect(`/admin/courses/${params.id}/lessons`);
    }

    // Clear the cached lesson content in Redis to ensure the latest content is fetched
    // This is important to avoid displaying stale content after editing.
    await redis.del(`lesson-content:${params.lessonId}`);

    return (
        <Card>
            <CardHeader>
                <Typography variant="h2">Customize your lesson with AI ✨</Typography>
                <Typography variant="muted" className="mt-2">
                    Ready to make changes? Use the new AI Lesson Generator. 👇🏻
                </Typography>
            </CardHeader>
            <CardContent>
                <LessonForm defaultValue={lesson} />
            </CardContent>
        </Card>
    )
}
