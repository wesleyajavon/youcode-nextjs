import { CourseFormSchema } from "@/lib/validations/course.schema"

export type Course = {
    id: string
    name: string
    image?: string 
    presentation?: string
    alreadyJoined?: boolean
}

export type CoursesResponse = {
    data: Course[]
    page: number
    limit: number
    total: number
}

export type CourseFormProps = {
  defaultValue?: CourseFormSchema & {
    id: string;
  };
};