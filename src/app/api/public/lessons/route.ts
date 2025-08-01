import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {

  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // Query Params
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const search = searchParams.get('search') || '';

  const skip = (page - 1) * limit;

  try {
    const [lessons, total] = await Promise.all([
      prisma.lesson.findMany({
        where: {
          state: 'PUBLIC',
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          name: true,
          state: true,
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.lesson.count({
        where: {
          state: 'PUBLIC',
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return NextResponse.json({
      data: lessons,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[PUBLIC_LESSONS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}