'use server';

import { authActionClient } from '@/lib/action';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { CourseFormSchema } from './course.schema';

const CourseActionEditProps = z.object({
    courseId: z.string(),
    data: CourseFormSchema,
});

// ...existing code...
export const courseActionEdit = authActionClient
    .metadata({ actionName: "editCourse" })
    .inputSchema(CourseActionEditProps)
    .action(async ({ parsedInput, ctx: { userId } }) => {
        const { courseId, data } = parsedInput;

        const course = await prisma.course.update({
            where: {
                id: courseId,
                creatorId: userId,
            },
            data,
        });

        if (!course) {
            throw new Error('Course not found or you do not have permission to edit it.');
        }
        return {
            message: 'Course updated successfully',
            updated: true,
            course
        };
    });
// ...existing code...

export const courseActionCreate = authActionClient
    // We can pass the action name inside `metadata()`.
    .metadata({ actionName: "createCourse" })
    // Here we pass the input schema.
    .inputSchema(CourseFormSchema)
    // Here we get `userId` from the middleware defined in `authActionClient`.
    .action(async ({ parsedInput, ctx: { userId } }) => {

        const course = await prisma.course.create({
            data: {
                ...parsedInput,
                creatorId: userId,
            },
        });
        return {
            message: 'Course created successfully',
            course,
        };
    });;