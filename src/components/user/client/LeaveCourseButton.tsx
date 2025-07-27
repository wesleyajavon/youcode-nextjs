"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { leaveCourseAction } from "@/app/user/courses/[id]/join/_actions/join.query";

export function LeaveCourseButton({ courseId, userId }: { courseId: string; userId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLeave = () => {
    startTransition(async () => {
      const res = await leaveCourseAction(courseId, userId);
      if (res.success) {
        toast.success("You left the course!");
        router.push(`/user/courses/`);
      } else {
        toast.error("Failed to leave the course.");
      }
    });
  };

  return (
    <Button onClick={handleLeave} disabled={isPending} className="mt-6">
      Leave this course
    </Button>
  );
}