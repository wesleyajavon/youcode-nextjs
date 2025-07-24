import { prisma } from "@/lib/prisma";
import { getRequiredAuthSession } from "@/lib/auth";
import { getCourse } from "../../app/admin/courses/_actions/course.query";
import { notFound } from "next/navigation";
import { AdminLessonsTableUI } from "./AdminLessonsTableUI";

export async function AdminLessonsTableServer(props: { params: Promise<{ id: string }> }) {
    const session = await getRequiredAuthSession();
    const params = await props.params
    const courseId = params.id;
    const course = await getCourse(courseId);
    if (!course) {
        notFound()
    }


    // On récupère les leçons du cours, triées par rank
    const lessons = await prisma.lesson.findMany({
        where: {
            courseId,
            course: {
                creatorId: session.user.id,
            },
        },
        orderBy: {
            rank: "asc",
        },
    });
    // await new Promise(res => setTimeout(res, 5000));


    return <AdminLessonsTableUI
        lessonProps={lessons}
        courseId={courseId}
    />
}