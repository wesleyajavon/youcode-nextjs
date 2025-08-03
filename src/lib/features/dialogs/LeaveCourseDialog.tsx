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
import { LeaveCourseButton } from "@/components/ui/user/LeaveCourseButton";

type LeaveCourseDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: { name?: string; image?: string };
    courseId: string;
    userId: string;
};

export function LeaveCourseDialog({
    open,
    onOpenChange,
    course,
    courseId,
    userId,
}: LeaveCourseDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-xl shadow-lg">
                <AlertDialogHeader className="items-center text-center">
                    <Avatar className="mx-auto mb-3 h-12 w-12">
                        <AvatarFallback>?</AvatarFallback>
                        <AvatarImage src={course.image} alt={course.name ?? ""} />
                    </Avatar>
                    <AlertDialogTitle className="text-xl font-bold">
                        👋🏻 Leave <span className="text-primary">{course.name}</span> ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        If you leave, the course content will be locked and your progress will be reset.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row gap-2 justify-center mt-6">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    {courseId && userId && (
                        <LeaveCourseButton courseId={courseId} userId={userId} />
                    )}

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}