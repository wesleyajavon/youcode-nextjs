import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredAuthSession } from "@/lib/auth";


export async function GET(req: Request) {
  const session = await getRequiredAuthSession();

  if (!session || session.user.role !== 'USER') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const search = searchParams.get('search') || '';
  const courseId = searchParams.get('courseId') || '';
  const skip = (page - 1) * limit;

  try {
    // Total des utilisateurs filtrés pour ce cours
    const total = await prisma.courseOnUser.count({
      where: {
        courseId,
        user: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
    });

    // Utilisateurs paginés et filtrés pour ce cours
    const users = await prisma.courseOnUser.findMany({
      where: {
        courseId,
        user: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        user: { name: 'asc' },
      },
    });

    // Infos du cours (hors users)
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        name: true,
        presentation: true,
        image: true,
      },
    });

    return NextResponse.json({
      course,
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[USER_COURSE_USERS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}