import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/common/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/common/avatar";
import { Button } from "@/components/ui/common/button";
import { JoinCourseButton } from "@/components/ui/user/JoinCourseButton";

type JoinCourseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: { id: string; name: string; image: string };
  userId: string;
};

export function JoinCourseDialog({
  open,
  onOpenChange,
  course,
  userId,
}: JoinCourseDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center text-center">

          <Avatar className="mx-auto mb-2 h-12 w-12">
            <AvatarFallback>{course?.name[0]}</AvatarFallback>
            <AvatarImage src={course?.image} alt={course?.name} />
          </Avatar>

          <AlertDialogTitle className="text-xl font-bold">
            Join <span className="text-primary">{course?.name}</span> ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            By joining, you’ll unlock all course content and resources.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-2 justify-center mt-4">
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          {course && (
            <JoinCourseButton courseId={course.id} userId={userId} />
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}