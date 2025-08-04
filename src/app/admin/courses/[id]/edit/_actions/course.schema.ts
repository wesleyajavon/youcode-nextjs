import { z } from 'zod';

export const COURSE_STATE = ['DRAFT', 'PUBLISHED'] as const;

export const CourseFormSchema = z.object({
  name: z.string().min(3).max(40, { message: 'Name must be between 3 and 40 characters' }),
  image: z.string().url(),
  presentation: z.string().min(1, { message: 'Presentation is required' }).max(300, { message: 'Presentation must be less than 300 characters' }),
  state: z.enum(COURSE_STATE),
});

export type CourseFormSchema = z.infer<typeof CourseFormSchema>;