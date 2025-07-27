import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ courseId: string, lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    await prisma.lesson.delete({
      where: { id: lessonId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 });
  }
}

