'use server';

import { authActionClient } from '@/lib/action';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { LessonFormSchema } from '../../validations/lesson.schema';
import { UpstashCacheManager } from '@/lib/cache-upstash';

const LessonActionEditProps = z.object({
    lessonId: z.string(),
    data: LessonFormSchema,
});

export const lessonActionEdit = authActionClient
    .metadata({ actionName: "editLesson" })
    .inputSchema(LessonActionEditProps)
    .action(async ({ parsedInput, ctx: { userId } }) => {
        const { lessonId, data } = parsedInput;

        const lesson = await prisma.lesson.update({
            where: {
                id: lessonId,
            },
            data
        });

        if (!lesson) {
            throw new Error('Lesson not found or you do not have permission to edit it.');
        }

        // ✅ Invalider le cache après mise à jour
        await UpstashCacheManager.invalidateLessonCache(lessonId);
        await UpstashCacheManager.invalidateCourseCache(lesson.courseId);

        return {
            message: 'Lesson updated successfully',
            updated: true,
            lesson
        };
    });

export const lessonActionCreate = authActionClient
    // We can pass the action name inside `metadata()`.
    .metadata({ actionName: "createLesson" })
    // Here we pass the input schema.
    .inputSchema(LessonFormSchema)
    // Here we get `userId` from the middleware defined in `authActionClient`.
    .action(async ({ parsedInput, ctx: { userId } }) => {

        const course = await prisma.course.findFirst({
            where: {
                id: parsedInput.courseId,
            },
            include: {
                lessons: {
                    select: {
                        rank: true,
                    },
                }
            }
        });

        const lesson = await prisma.lesson.create({
            data: {
                name: parsedInput.name,
                content: parsedInput.content,
                state: parsedInput.state,
                courseId: parsedInput.courseId,
                rank: String(Number(course?.lessons?.at(-1)?.rank ?? 0) + 1), // Default to "1" if no lessons exist
            },
        });

        // ✅ Invalider le cache après création
        await UpstashCacheManager.invalidateLessonCache(lesson.id);
        await UpstashCacheManager.invalidateCourseCache(parsedInput.courseId);

        return {
            message: 'Lesson successfully created!',
            lesson,
        };
    });