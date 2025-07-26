import { Loader2, Trash2 } from 'lucide-react';

import { Button } from '@/base/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/base/components/ui/dialog';

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotelName: string;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteDialog({
  open,
  onOpenChange,
  hotelName,
  onConfirm,
  isPending,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Xác nhận xóa
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa khách sạn <span className="font-semibold">{hotelName}</span>?
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              'Xóa khách sạn'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
