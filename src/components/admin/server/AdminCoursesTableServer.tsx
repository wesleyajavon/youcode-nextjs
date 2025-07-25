import { prisma } from "@/lib/prisma";
import { getRequiredAuthSession } from "@/lib/auth";
import { AdminCoursesTableUI } from "../client/AdminCoursesTableUI";

export async function AdminCoursesTableServer() {
  const session = await getRequiredAuthSession();
  const courses = await prisma.course.findMany({
    where: { creatorId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
    // await new Promise(res => setTimeout(res, 5000));


  return <AdminCoursesTableUI coursesProp={courses} />;
}