"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/common/button";
import { useRouter } from "next/navigation";
import { joinLessonAction } from "@/lib/queries/user/lesson/join.query";

export function JoinLessonButton({ courseId, lessonId, userId }: { courseId: string; lessonId: string; userId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleJoin = () => {
    startTransition(async () => {
      const res = await joinLessonAction(lessonId, userId);
      if (res.success) {
        toast.success(`You started the lesson: ${res.lessonName} !`);
        router.push(`/user/courses/${courseId}/lessons/${lessonId}`);
      } else {
        toast.error("Failed to start the lesson.");
      }
    });
  };

  return (
    <Button aria-label="Start lesson" onClick={handleJoin} disabled={isPending} variant={"default"}>
      Start
    </Button>
  );
}