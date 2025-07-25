import { Edit, Plus } from 'lucide-react';
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
import { HotelUtils } from '@/modules/hotels/utils/hotel.utils';

import { Discount, DiscountState, createDiscountSchema, discountStates } from '../types';

interface AddEditDiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formMode: 'add' | 'edit';
  onSubmit: (values: z.infer<typeof createDiscountSchema>) => void;
  isPending: boolean;
  discount?: Discount;
}

export function AddEditDiscountDialog({
  open,
  onOpenChange,
  formMode,
  discount,
  onSubmit,
  isPending,
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
          loading={isPending}
          defaultValues={{
            amount: discount?.amount,
            expiredTimestamp: discount?.expiredTimestamp
              ? new Date(discount.expiredTimestamp)
              : undefined,
            applicableHotels: discount?.applicableHotels.map((h) => h.id) || [],
            maxQuantityPerUser: discount?.maxQuantityPerUser,
            usageCount: discount?.usageCount,
            state: discount?.state || DiscountState.ACTIVE,
          }}
          className="gap-6"
          fields={[
            {
              name: 'title',
              type: 'text',
              label: 'Tiêu đề mã giảm giá',
              placeholder: 'Nhập tiêu đề mã giảm giá',
              disabled: isPending,
            },
            {
              name: 'amount',
              type: 'text',
              label: 'Phần trăm giảm giá (%)',
              placeholder: 'Nhập phần trăm (ví dụ: 10)',
              disabled: isPending,
            },
            {
              name: 'expiredTimestamp',
              type: 'datetime',
              label: 'Thời gian hết hạn',
              placeholder: 'Chọn thời gian hết hạn',
              disabled: isPending,
            },
            {
              name: 'applicableHotels',
              type: 'select',
              async: true,
              ...HotelUtils.getHotelsByAdminAsyncSelectOptions('name'),
              label: 'Khách sạn áp dụng',
              placeholder: 'Chọn khách sạn...',
              multiple: true,
              disabled: isPending,
            },
            {
              name: 'maxQuantityPerUser',
              type: 'text',
              label: 'Số lượt tối đa/người',
              placeholder: 'Ví dụ: 1, 2...',
              disabled: isPending,
            },
            {
              name: 'usageCount',
              type: 'text',
              label: 'Tổng số lượt sử dụng',
              placeholder: 'Ví dụ: 100',
              disabled: isPending,
            },
            {
              name: 'state',
              type: 'select',
              label: 'Trạng thái',
              placeholder: 'Chọn trạng thái',
              clearable: false,
              searchable: false,
              options: Object.entries(discountStates).map(([value, label]) => ({ value, label })),
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
                {formMode === 'add' ? 'Thêm mã' : 'Lưu thay đổi'}
              </SubmitButton>
            </DialogFooter>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}
