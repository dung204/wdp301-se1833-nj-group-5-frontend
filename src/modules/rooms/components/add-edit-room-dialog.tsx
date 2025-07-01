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
import { createRoomSchema } from '@/modules/manager/services/room.service';

interface AddEditRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formMode: 'add' | 'edit';
  defaultValues: z.infer<typeof createRoomSchema>;
  onSubmit: (values: z.infer<typeof createRoomSchema>) => void;
  isPending: boolean;
  hotels: { id: string; name: string }[];
}

const AVAILABLE_SERVICES = [
  'WiFi',
  'Minibar',
  'TV',
  'Điều hòa',
  'Máy sấy tóc',
  'Bồn tắm',
  'Bàn làm việc',
];

export function AddEditRoomDialog({
  open,
  onOpenChange,
  formMode,
  defaultValues,
  onSubmit,
  isPending,
  hotels,
}: AddEditRoomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formMode === 'add' ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            {formMode === 'add' ? 'Thêm phòng mới' : 'Chỉnh sửa phòng'}
          </DialogTitle>
        </DialogHeader>

        <Form
          schema={createRoomSchema}
          defaultValues={defaultValues}
          className="space-y-4"
          fields={[
            {
              name: 'hotel',
              type: 'select',
              label: 'Khách sạn *',
              placeholder: 'Chọn khách sạn',
              options: [
                { label: 'Chọn khách sạn', value: '' },
                ...hotels.map((h) => ({ label: h.name, value: h.id })),
              ],
              disabled: isPending,
            },
            {
              name: 'name',
              type: 'text',
              label: 'Tên phòng *',
              placeholder: 'Nhập tên phòng',
              disabled: isPending,
            },
            {
              name: 'rate',
              type: 'text',
              label: 'Giá phòng *',
              placeholder: 'Nhập giá phòng',
              disabled: isPending,
            },
            {
              name: 'size',
              type: 'text',
              label: 'Diện tích (m²) *',
              placeholder: 'Nhập diện tích',
              disabled: isPending,
            },
            {
              name: 'occupancy',
              type: 'text',
              label: 'Số người tối đa *',
              placeholder: 'Nhập số người tối đa',
              disabled: isPending,
            },
            {
              name: 'maxQuantity',
              type: 'text',
              label: 'Số lượng phòng *',
              placeholder: 'Nhập số lượng phòng',
              disabled: isPending,
            },
            {
              name: 'services',
              type: 'select',
              label: 'Dịch vụ *',
              placeholder: 'Chọn dịch vụ',
              options: AVAILABLE_SERVICES.map((s) => ({ label: s, value: s })),
              multiple: true,
              disabled: isPending,
            },
            {
              name: 'images',
              type: 'text',
              label: 'Ảnh (URL, phân cách bởi dấu phẩy)',
              placeholder: 'https://example.com/room1.jpg, https://example.com/room2.jpg',
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
                  'Thêm phòng'
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
