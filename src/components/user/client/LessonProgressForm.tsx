"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/common/button";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/common/select";
import { updateLessonProgress } from "@/app/user/courses/_actions/lesson.query";
import { Form } from "@/components/ui/common/form";


type Progress = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

type LessonProgressFormValues = {
    progress: Progress;
};

export function LessonProgressForm({ userId, lessonId, progress }: { userId: string; lessonId: string; progress: Progress }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const form = useForm<LessonProgressFormValues>({
        defaultValues: { progress }
    });

    const handleSubmit = async (data: LessonProgressFormValues) => {

        startTransition(async () => {
            const res = await updateLessonProgress(userId, lessonId, data.progress);
            if (res.success) {
                toast.success("Progress updated successfully !");
                router.push(res.fallback);
                router.refresh();
            } else {
                toast.error("Failed to update progress..");
            }
        });
    };

    return (
        <Form form={form} onSubmit={handleSubmit} className="flex flex-row justify-between items-center w-full gap-4">
            <div className="flex-1 flex justify-start">
                <Controller
                    name="progress"
                    control={form.control}
                    defaultValue={progress}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Progress" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className="flex-1 flex justify-end">
                <Button type="submit" disabled={isPending}>
                    Save progress 💪
                </Button>
            </div>
        </Form>
    );
}