import { z } from 'zod';

export const LESSON_STATE = ['PUBLIC', 'PUBLISHED', 'HIDDEN'] as const;

export const LessonFormSchema = z.object({
  name: z.string().min(3).max(40),
  content: z.string(),
  state: z.enum(LESSON_STATE),
  courseId: z.string() 
});

export type LessonFormSchema = z.infer<typeof LessonFormSchema>;