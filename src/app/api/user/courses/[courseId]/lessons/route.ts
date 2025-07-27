import { getRequiredAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { courseId: string } }) {
  const session = await getRequiredAuthSession();

  if (!session || session.user.role !== 'USER') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  // Query Params
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const search = searchParams.get('search') || '';
  const { courseId } = params;

  const skip = (page - 1) * limit;

  try {
    const [lessons, total, course] = await Promise.all([
      prisma.lesson.findMany({
        where: {
          courseId,
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          name: true,
          rank: true,
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.lesson.count({
        where: {
          courseId,
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
      prisma.course.findUnique({
        where: { id: courseId },
        select: { image: true, name: true },
      }),
    ]);

    const userId = session.user.id;
    const lessonsWithProgress = await Promise.all(
      lessons.map(async (lesson) => {
        const lessonOnUser = await prisma.lessonOnUser.findFirst({
          where: {
            userId,
            lessonId: lesson.id,
          },
          select: {
            progress: true,
          },
        });

        return {
          ...lesson,
          progress: lessonOnUser?.progress ?? "NOT_STARTED",
        };
      })
    );

    return NextResponse.json({
      data: lessonsWithProgress,
      total,
      course,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[USER_LESSONS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}