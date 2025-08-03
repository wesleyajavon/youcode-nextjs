import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredAuthSession } from "@/lib/auth";


export async function GET(req: Request) {
  const session = await getRequiredAuthSession();

  if (!session || session.user.role !== 'USER') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const url = new URL(req.url);
  const match = url.pathname.match(/\/api\/user\/courses\/([^/]+)/);
  const courseId = match?.[1];

  if (!courseId) {
    return new NextResponse('Missing courseId', { status: 400 });
  }

  try {

    // await new Promise(res => setTimeout(res, 10000))
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        name: true,
        presentation: true,
        image: true,
      },
    });

    // Count the total number of users enrolled in the course
    const totalUsers = await prisma.courseOnUser.count({
      where: { courseId },
    });

    return NextResponse.json({
      course: { ...course, totalUsers },
    });
  } catch (error) {
    console.error('[USER_COURSE_USERS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}