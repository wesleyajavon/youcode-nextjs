'use server';

import { authActionClient } from '@/lib/action';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { LessonFormSchema } from '../../validations/lesson.schema';

const LessonActionEditProps = z.object({
    lessonId: z.string(),
    data: LessonFormSchema,
});

// ...existing code...
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
        return {
            message: 'Lesson updated successfully',
            updated: true,
            lesson
        };
    });
// ...existing code...

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
        return {
            message: 'Lesson successfully created!',
            lesson,
        };
    });;