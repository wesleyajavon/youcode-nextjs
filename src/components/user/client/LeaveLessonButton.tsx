"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { leaveLessonAction } from "@/app/user/courses/[id]/lessons/[lessonId]/join/_actions/join.query";

export function LeaveLessonButton({ courseId, lessonId, userId }: { courseId: string; lessonId: string; userId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLeave = () => {
    startTransition(async () => {
      const res = await leaveLessonAction(lessonId, userId);
      if (res.success) {
        toast.success("You left the lesson!");
        router.push(`/user/courses/${courseId}/lessons`);
      } else {
        toast.error("Failed to leave the lesson.");
      }
    });
  };

  return (
    <Button onClick={handleLeave} disabled={isPending} className="mt-6">
      Leave this course
    </Button>
  );
}