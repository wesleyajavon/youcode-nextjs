import { LessonForm } from '@/components/admin/client/LessonForm';
import { Card, CardContent } from '@/components/ui/card';
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
        <Card className="flex-[2]">
            <CardContent className="mt-6 mb-6">
                <LessonForm defaultValue={lesson} />
            </CardContent>
        </Card>
    )
}
