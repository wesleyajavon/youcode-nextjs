import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredAuthSession } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {

  const session = await getRequiredAuthSession()

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { courseId } = await params;
    await prisma.course.delete({
      where: { id: courseId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getRequiredAuthSession();

  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

const url = new URL(req.url);
const match = url.pathname.match(/\/api\/admin\/courses\/([^/]+)/);
const courseId = match?.[1];

if (!courseId) {
  return new NextResponse('Missing courseId', { status: 400 });
}

  try {

    // Infos du cours (hors users)
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        name: true,
        presentation: true,
        image: true,
        createdAt: true,
        state: true,
      },
    });

    // Compte le nombre d'utilisateurs inscrits à ce cours
    const totalUsers = await prisma.courseOnUser.count({
      where: { courseId },
    });

    return NextResponse.json({
      course: { ...course, totalUsers },
    });
  } catch (error) {
    console.error('[ADMIN_COURSE_USERS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
