import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/common/alert-dialog";
import { Button } from "@/components/ui/common/button";
import { Typography } from "@/components/ui/common/typography";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  itemName?: string;
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
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {itemName && <AlertDialogTitle>{itemName}</AlertDialogTitle>}
          <Typography variant="small" className="text-muted-foreground">
            {description}
          </Typography>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary">{cancelText}</Button>
          </AlertDialogCancel>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Deleting...' : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}