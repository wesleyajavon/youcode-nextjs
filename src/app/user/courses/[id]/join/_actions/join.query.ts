"use server";
import { prisma } from "@/lib/prisma";

export async function joinCourseAction(courseId: string, userId: string) {
  try {
    await prisma.courseOnUser.create({
      data: { userId, courseId },
    });
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { name: true },
    });
    return { success: true, courseName: course?.name };
  } catch {
    return { success: false };
  }
}

export async function leaveCourseAction(courseId: string, userId: string) {
  try {
    await prisma.courseOnUser.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { name: true },
    });
    return { success: true, courseName: course?.name };
  } catch {
    return { success: false };
  }
}


