import { Edit, Plus } from 'lucide-react';

import { Button } from '@/base/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/base/components/ui/dialog';
import { Hotel } from '@/modules/manager/services/hotel.service';

import { HotelForm } from './hotel-form';

interface AddEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formMode: 'add' | 'edit';
  hotelFormData: Hotel;
  setHotelFormData: (data: Hotel) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function AddEditDialog({ open, onOpenChange, formMode, isPending }: AddEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formMode === 'add' ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            {formMode === 'add' ? 'Thêm khách sạn mới' : 'Chỉnh sửa khách sạn'}
          </DialogTitle>
        </DialogHeader>

        <HotelForm
          onSuccessSubmit={() => {}}
          loading={isPending}
          renderSubmitButton={(SubmitButton) => (
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <SubmitButton className="bg-blue-600 hover:bg-blue-700">
                {formMode === 'add' ? 'Thêm khách sạn' : 'Lưu thay đổi'}
              </SubmitButton>
            </DialogFooter>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}
