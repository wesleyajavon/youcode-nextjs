"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/common/button";
import { useRouter } from "next/navigation";
import { joinCourseAction } from "@/app/user/courses/[id]/join/_actions/join.query";

export function JoinCourseButton({ courseId, userId }: { courseId: string; userId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleJoin = () => {
    startTransition(async () => {
      const res = await joinCourseAction(courseId, userId);
      if (res.success) {
        toast.success(`You joined the course: ${res.courseName} !`);
        router.push(`/user/courses/${courseId}`);
      } else {
        toast.error("Failed to join the course.");
      }
    });
  };

  return (
    <Button aria-label="Join course" onClick={handleJoin} disabled={isPending} variant={"default"}>
      Join
    </Button>
  );
}