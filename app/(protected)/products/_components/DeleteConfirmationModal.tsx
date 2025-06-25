import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteConfirmationModal({ open, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Do you really want to delete this product
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}