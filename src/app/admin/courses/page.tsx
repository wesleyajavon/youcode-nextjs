// page.tsx (server)
import { getRequiredAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminCoursesTable } from "./client/AdminCoursesTable";

export default async function AdminPage() {
    const session = await getRequiredAuthSession();
    const courses = await prisma.course.findMany({ 
        where: {
            creatorId: session.user.id
        },
        orderBy: { createdAt: "asc" },
     });
    return <AdminCoursesTable initialCourses={courses} />;
}