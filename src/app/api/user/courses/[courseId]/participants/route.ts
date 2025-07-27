import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequiredAuthSession } from "@/lib/auth";


export async function GET(req: Request) {
  const session = await getRequiredAuthSession();

  if (!session || session.user.role !== 'USER') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const search = searchParams.get('search') || '';
  const skip = (page - 1) * limit;

    // Récupère courseId depuis l'URL (et non les query params)
  const match = url.pathname.match(/\/api\/user\/courses\/([^/]+)\/participants/);
  const courseId = match?.[1];

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

    return NextResponse.json({
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