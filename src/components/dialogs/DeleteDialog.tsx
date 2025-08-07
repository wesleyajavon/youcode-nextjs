import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/common/alert-dialog";
import { Button } from "@/components/ui/common/button";
import { Typography } from "@/components/ui/common/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/common/avatar";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  itemName?: string;
  image?: string;
  description?: string;
  isPending?: boolean;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
};

export function DeleteDialog({
  open,
  onOpenChange,
  title = "Are you sure you want to delete this item?",
  itemName,
  description = "This action cannot be undone. All related data will be permanently deleted.",
  isPending = false,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Delete",
  image,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl shadow-lg">
        <AlertDialogHeader className="items-center text-center">
          <Avatar className="mx-auto mb-3 h-15 w-15">
            <AvatarFallback>{itemName?.[0] ?? "?"}</AvatarFallback>
            {image && <AvatarImage src={image} alt={itemName ?? ""} />}
          </Avatar>
          <AlertDialogTitle className="text-xl font-bold">
            🗑️ {title}
          </AlertDialogTitle>
          {itemName && (
            <AlertDialogTitle>
              <span className="text-primary">{itemName}</span>
            </AlertDialogTitle>
          )}
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-2 justify-center mt-6">
          <AlertDialogCancel asChild>
            <Button aria-label="Cancel changes" variant="outline">{cancelText}</Button>
          </AlertDialogCancel>
          <Button aria-label="Confirm deletion" variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Deleting...' : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}