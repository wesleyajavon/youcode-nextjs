import { getRequiredAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminLessonsTable } from "./client/AdminLessonsTable";
import { get } from "http";
import { getCourse } from "../../_actions/course.query";
import { notFound } from "next/navigation";

export default async function LessonsPage(props: { params: Promise<{ id: string }> }) {
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

    return <AdminLessonsTable initialLessons={lessons} courseId={courseId} courseName={course.name} />;
}