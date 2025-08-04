import { LessonFormSchema } from "@/app/admin/courses/[id]/lessons/[lessonId]/edit/lesson.schema"

enum Progress {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
}


export type LessonInfo = {
    id: string
    name: string
    rank: string
    progress: Progress
}

export type LessonsInfoResponse = {
    data: LessonInfo[]
    page: number
    limit: number
    total: number
}

export type Lesson = {
    id: string;
    name: string;
    content?: string;
    state?: 'PUBLIC' | 'HIDDEN' | 'PUBLISHED';
}

export type LessonsResponse = {
    data: Lesson[];
    page: number;
    limit: number;
    total: number;
};

export type GenerateLessonModalProps = {
    courseId?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onResult: (content: string) => void;
};

export type GeneratePresentationModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onResult: (content: string) => void;
};


export type LessonFormProps = {
    defaultValue?: LessonFormSchema & {
        id: string;
    };
};