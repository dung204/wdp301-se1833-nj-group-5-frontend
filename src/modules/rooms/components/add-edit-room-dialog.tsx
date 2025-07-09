import { Edit, Plus } from 'lucide-react';

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

import { CreateRoomSchema, Room, createRoomSchema } from '../types';

interface AddEditRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formMode: 'add' | 'edit';
  onSubmit: (values: CreateRoomSchema) => void;
  isPending: boolean;
  room?: Room;
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
  room,
  onSubmit,
  isPending,
}: AddEditRoomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formMode === 'add' ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            {formMode === 'add' ? 'Thêm phòng mới' : 'Chỉnh sửa phòng'}
          </DialogTitle>
        </DialogHeader>

        <Form
          schema={createRoomSchema}
          defaultValues={{
            hotel: room?.hotel.id,
            name: room?.name,
            rate: room?.rate,
            size: room?.size,
            occupancy: room?.occupancy,
            maxQuantity: room?.maxQuantity,
            services: room?.services,
            images: {
              newImages: !room
                ? []
                : room.images.map((image) => ({
                    file: null,
                    fileName: image.fileName,
                    previewUrl: image.url,
                  })),
              imagesToDelete: [],
            },
          }}
          fields={[
            {
              name: 'hotel',
              type: 'select',
              async: true,
              ...HotelUtils.getHotelsByAdminAsyncSelectOptions('name'),
              clearable: false,
            },
            {
              name: 'name',
              type: 'text',
              label: 'Tên phòng',
              placeholder: 'Nhập tên phòng',
              disabled: isPending,
            },
            {
              name: 'rate',
              type: 'text',
              label: 'Giá phòng',
              placeholder: 'Nhập giá phòng',
              disabled: isPending,
            },
            {
              name: 'size',
              type: 'text',
              label: 'Diện tích (m²)',
              placeholder: 'Nhập diện tích',
              disabled: isPending,
            },
            {
              name: 'occupancy',
              type: 'text',
              label: 'Số người tối đa',
              placeholder: 'Nhập số người tối đa',
              disabled: isPending,
            },
            {
              name: 'maxQuantity',
              type: 'text',
              label: 'Số lượng phòng',
              placeholder: 'Nhập số lượng phòng',
              disabled: isPending,
            },
            {
              name: 'services',
              type: 'select',
              label: 'Dịch vụ',
              required: false,
              placeholder: 'Chọn dịch vụ',
              options: AVAILABLE_SERVICES.map((s) => ({ label: s, value: s })),
              multiple: true,
              disabled: isPending,
            },
            {
              name: 'images',
              type: 'image',
              label: 'Ảnh',
              disabled: isPending,
              render: ({ Label, Control, Message }) => (
                <>
                  <Label />
                  <Control />
                  <Message />
                </>
              ),
            },
          ]}
          onSuccessSubmit={onSubmit}
          renderSubmitButton={(SubmitButton) => (
            <DialogFooter className="mt-4 gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Hủy
              </Button>
              <SubmitButton className="bg-blue-600 hover:bg-blue-700" aria-disabled={isPending}>
                {formMode === 'add' ? 'Thêm phòng' : 'Lưu thay đổi'}
              </SubmitButton>
            </DialogFooter>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}
