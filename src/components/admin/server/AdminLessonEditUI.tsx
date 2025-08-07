import { LessonForm } from '@/components/admin/client/LessonForm';
import { Card, CardContent, CardHeader } from '@/components/ui/common/card';
import { Typography } from '@/components/ui/common/typography';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { redirect } from 'next/navigation';

// This component is used as a wrapper for the lesson editing form.
// It fetches the lesson data based on the lesson ID from the URL parameters and renders the LessonForm component.
// The form allows the user to edit an existing lesson with all necessary details.
// If the lesson does not exist, it redirects to the lessons list page for the corresponding course.
// The component also clears the cached lesson content in Redis to ensure the latest content is fetched.
// This is important to avoid displaying stale content after editing.
// The form includes a header with instructions for editing the lesson.
// The lesson form allows the user to update the lesson name, content, and state.
// If the lesson is successfully updated, it redirects to the lesson details page and refreshes the
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
            <CardContent className="max-h-[500px] overflow-y-auto">
                <LessonForm defaultValue={lesson} />
            </CardContent>
        </Card>
    )
}
