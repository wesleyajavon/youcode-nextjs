import { LessonForm } from '@/components/admin/client/LessonForm';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

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
