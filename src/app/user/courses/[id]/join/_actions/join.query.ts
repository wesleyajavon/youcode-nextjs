"use server";
import { prisma } from "@/lib/prisma";

export async function joinCourseAction(courseId: string, userId: string) {
  try {
    await prisma.courseOnUser.create({
      data: { userId, courseId },
    });
    return { success: true };
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
    return { success: true };
  } catch {
    return { success: false };
  }
}


