'use server';

import { authActionClient } from '@/lib/action';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { CourseFormSchema } from '@/lib/validations/course.schema';
import { UpstashCacheManager } from '@/lib/cache-upstash';

const CourseActionEditProps = z.object({
    courseId: z.string(),
    data: CourseFormSchema,
});

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

        // ✅ Invalider le cache des cours admin après modification
        await UpstashCacheManager.invalidateCourseCache(courseId);
        
        return {
            message: 'Course updated successfully',
            updated: true,
            course
        };
    });

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

        // ✅ Invalider le cache des cours admin après création
        await UpstashCacheManager.invalidateCourseCache(course.id);
        
        return {
            message: 'Course successfully created!',
            course,
        };
    });