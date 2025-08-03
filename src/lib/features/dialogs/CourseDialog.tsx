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
import { LeaveCourseButton } from "@/components/ui/user/LeaveCourseButton";

type CourseDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: { id: string; name: string; image?: string; userId: string };
    join?: boolean;
};

export function CourseDialog({
    open,
    onOpenChange,
    course,
    join

}: CourseDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-xl shadow-lg">
                <AlertDialogHeader className="items-center text-center">
                    <Avatar className="mx-auto mb-3 h-12 w-12">
                        <AvatarFallback>?</AvatarFallback>
                        <AvatarImage src={course.image} alt={course.name ?? ""} />
                    </Avatar>
                    { /* Conditional rendering based on join prop */ }
                    {join === true && (
                        <>
                            <AlertDialogTitle className="text-xl font-bold">
                                👋🏻 Join <span className="text-primary">{course.name}</span> ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                By joining, you will have access to all course materials and can track your progress.
                            </AlertDialogDescription>
                        </>
                    )}

                    { /* Conditional rendering based on join prop */ }
                    {join === false && (
                        <>
                            <AlertDialogTitle className="text-xl font-bold">
                                👋🏻 Leave <span className="text-primary">{course.name}</span> ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                If you leave, the course content will be locked and your progress will be reset.
                            </AlertDialogDescription>
                        </>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row gap-2 justify-center mt-6">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    { /* Conditional rendering based on join prop */ }
                    {join === true && (
                        <JoinCourseButton courseId={course.id} userId={course.userId} />
                    )}
                    { /* Conditional rendering based on join prop */ }
                    {join === false && (
                        <LeaveCourseButton courseId={course.id} userId={course.userId} />
                    )}

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}