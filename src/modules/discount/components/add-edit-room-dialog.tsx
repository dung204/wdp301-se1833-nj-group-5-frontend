import { Edit, Loader2, Plus } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/base/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/base/components/ui/dialog';
import { Form } from '@/base/components/ui/form';
import { createDiscountSchema } from '@/modules/manager/services/discount.service';

interface AddEditDiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formMode: 'add' | 'edit';
  defaultValues: z.infer<typeof createDiscountSchema>;
  onSubmit: (values: z.infer<typeof createDiscountSchema>) => void;
  isPending: boolean;
  hotels: { id: string; name: string }[];
}

export function AddEditDiscountDialog({
  open,
  onOpenChange,
  formMode,
  defaultValues,
  onSubmit,
  isPending,
  hotels,
}: AddEditDiscountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formMode === 'add' ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            {formMode === 'add' ? 'Thêm mã giảm giá' : 'Chỉnh sửa mã giảm giá'}
          </DialogTitle>
        </DialogHeader>

        <Form
          schema={createDiscountSchema}
          defaultValues={defaultValues}
          className="space-y-4"
          fields={[
            {
              name: 'amount',
              type: 'text',
              label: 'Phần trăm giảm giá (%) *',
              placeholder: 'Nhập phần trăm (ví dụ: 10)',
              disabled: isPending,
            },
            {
              name: 'expiredTimestamp',
              type: 'date',
              label: 'Ngày hết hạn *',
              placeholder: 'Chọn ngày hết hạn',
              disabled: isPending,
            },
            {
              name: 'applicableHotels',
              type: 'select',
              label: 'Khách sạn áp dụng *',
              placeholder: 'Chọn khách sạn',
              options: hotels.map((h) => ({ label: h.name, value: h.id })),
              multiple: true,
              disabled: isPending,
            },
            {
              name: 'maxQualityPerUser',
              type: 'text',
              label: 'Số lượt tối đa/người *',
              placeholder: 'Ví dụ: 1, 2...',
              disabled: isPending,
            },
            {
              name: 'usageCount',
              type: 'text',
              label: 'Tổng số lượt sử dụng *',
              placeholder: 'Ví dụ: 100',
              disabled: isPending,
            },
            {
              name: 'state',
              type: 'select',
              label: 'Trạng thái *',
              placeholder: 'Chọn trạng thái',
              options: [
                { label: 'Đang hoạt động', value: 'ACTIVE' },
                { label: 'Không hoạt động', value: 'INACTIVE' },
              ],
              disabled: isPending,
            },
          ]}
          onSuccessSubmit={onSubmit}
          renderSubmitButton={(SubmitButton) => (
            <DialogFooter className="mt-4 gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Hủy
              </Button>
              <SubmitButton className="bg-blue-600 hover:bg-blue-700" aria-disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : formMode === 'add' ? (
                  'Thêm mã'
                ) : (
                  'Lưu thay đổi'
                )}
              </SubmitButton>
            </DialogFooter>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}
