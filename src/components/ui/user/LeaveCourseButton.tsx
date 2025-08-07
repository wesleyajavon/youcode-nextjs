"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/common/button";
import { useRouter } from "next/navigation";
import { leaveCourseAction } from "@/lib/queries/user/course/join.query";

export function LeaveCourseButton({ courseId, userId }: { courseId: string; userId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLeave = () => {
    startTransition(async () => {
      const res = await leaveCourseAction(courseId, userId);
      if (res.success) {
        toast.success(`You left the course: ${res.courseName} !`);
        router.push(`/user/courses/`);
      } else {
        toast.error("Failed to leave the course.");
      }
    });
  };

  return (
    <Button aria-label="Leave course" onClick={handleLeave} disabled={isPending} variant={"destructive"}>
      Leave
    </Button>
  );
}