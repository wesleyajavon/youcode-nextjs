import {
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialog,
} from "@/components/ui/common/alert-dialog";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/common/button";
import { Loader } from "@/components/ui/common/loader";


export function LogoutDialog({ open, setOpen, isPending, onConfirm }: {
  open: boolean;
  setOpen: (v: boolean) => void;
  isPending: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogPortal>
        <AlertDialogOverlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
        <AlertDialogContent aria-description="Logout confirmation dialog" >
          <AlertDialogHeader className="items-center text-center">
            <LogOut className="mx-auto mb-2 h-8 w-8 text-destructive" />
            <AlertDialogTitle className="text-lg font-bold">
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the homepage and will need to log in again to access your courses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 justify-center mt-4">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={onConfirm}
            >
              {isPending ? (
                <Loader className="mr-2" size={16} />
              ) : (
                <LogOut className="mr-2" size={16} />
              )}
              Log out
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}