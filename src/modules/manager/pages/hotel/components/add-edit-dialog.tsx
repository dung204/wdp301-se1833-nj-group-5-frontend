import { format } from 'date-fns';
import { Edit, Loader2, Plus } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@/base/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/base/components/ui/dialog';
import { Input } from '@/base/components/ui/input';
import { Label } from '@/base/components/ui/label';
import { Textarea } from '@/base/components/ui/textarea';
import { Hotel } from '@/modules/manager/services/hotel.service';

interface AddEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formMode: 'add' | 'edit';
  hotelFormData: Hotel;
  setHotelFormData: (data: Hotel) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export function AddEditDialog({
  open,
  onOpenChange,
  formMode,
  hotelFormData,
  setHotelFormData,
  onSubmit,
  isPending,
}: AddEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formMode === 'add' ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            {formMode === 'add' ? 'Thêm khách sạn mới' : 'Chỉnh sửa khách sạn'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên khách sạn *</Label>
            <Input
              id="name"
              value={hotelFormData.name}
              onChange={(e) => setHotelFormData({ ...hotelFormData, name: e.target.value })}
              placeholder="Nhập tên khách sạn"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ *</Label>
            <Input
              id="address"
              value={hotelFormData.address}
              onChange={(e) => setHotelFormData({ ...hotelFormData, address: e.target.value })}
              placeholder="Nhập địa chỉ khách sạn"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Phone number</Label>
            <Input
              id="phoneNumber"
              value={hotelFormData.phoneNumber}
              onChange={(e) => setHotelFormData({ ...hotelFormData, phoneNumber: e.target.value })}
              placeholder="Nhập địa chỉ khách sạn"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Price Hotel</Label>
            <Input
              id="priceHotel"
              value={hotelFormData.priceHotel}
              onChange={(e) => setHotelFormData({ ...hotelFormData, priceHotel: e.target.value })}
              placeholder="Nhập giá của khách sạn"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={hotelFormData.description}
              onChange={(e) => setHotelFormData({ ...hotelFormData, description: e.target.value })}
              placeholder="Mô tả về khách sạn..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cancelPolicy">Chính sách hủy</Label>
            <select
              id="cancelPolicy"
              value={hotelFormData.cancelPolicy}
              onChange={(e) =>
                setHotelFormData({
                  ...hotelFormData,
                  cancelPolicy: e.target.value as Hotel['cancelPolicy'],
                })
              }
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="NO_REFUND">Không hoàn tiền</option>
              <option value="REFUND_BEFORE_1_DAY">Hoàn trước 1 ngày</option>
              <option value="REFUND_BEFORE_3_DAYS">Hoàn trước 3 ngày</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Ảnh đại diện (Avatar)</Label>
            <Input
              id="avatar"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (!files) return;

                const avatarsArray = Array.from(files).map((file) => URL.createObjectURL(file));

                setHotelFormData({
                  ...hotelFormData,
                  avatar: avatarsArray,
                });
              }}
            />

            {hotelFormData.avatar.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {hotelFormData.avatar.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    alt={`avatar-${index}`}
                    className="h-20 w-20 rounded-md border object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkin-from">Giờ check-in (từ)</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={format(hotelFormData.checkinTime.from, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  date.setHours(hotelFormData.checkinTime.from.getHours());
                  date.setMinutes(hotelFormData.checkinTime.from.getMinutes());

                  if (date >= hotelFormData.checkinTime.to) {
                    toast.error('Giờ check-in (từ) phải nhỏ hơn giờ check-in (đến)');
                    return;
                  }

                  setHotelFormData({
                    ...hotelFormData,
                    checkinTime: {
                      ...hotelFormData.checkinTime,
                      from: date,
                    },
                  });
                }}
              />
              <Input
                id="checkin-from"
                type="time"
                value={new Date(hotelFormData.checkinTime.from).toLocaleTimeString('en-US', {
                  hour12: false,
                })}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const newFrom = new Date(hotelFormData.checkinTime.from);
                  newFrom.setHours(hours);
                  newFrom.setMinutes(minutes);

                  if (newFrom >= hotelFormData.checkinTime.to) {
                    toast.error('Giờ check-in (từ) phải nhỏ hơn giờ check-in (đến)');
                    return;
                  }

                  setHotelFormData({
                    ...hotelFormData,
                    checkinTime: {
                      ...hotelFormData.checkinTime,
                      from: newFrom,
                    },
                  });
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkin-to">Giờ check-in (đến)</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={format(hotelFormData.checkinTime.to, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  date.setHours(hotelFormData.checkinTime.to.getHours());
                  date.setMinutes(hotelFormData.checkinTime.to.getMinutes());

                  if (date <= hotelFormData.checkinTime.from) {
                    toast.error('Giờ check-in (đến) phải lớn hơn giờ check-in (từ)');
                    return;
                  }

                  setHotelFormData({
                    ...hotelFormData,
                    checkinTime: {
                      ...hotelFormData.checkinTime,
                      to: date,
                    },
                  });
                }}
              />
              <Input
                id="checkin-to"
                type="time"
                value={new Date(hotelFormData.checkinTime.to).toLocaleTimeString('en-US', {
                  hour12: false,
                })}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const newTo = new Date(hotelFormData.checkinTime.to);
                  newTo.setHours(hours);
                  newTo.setMinutes(minutes);

                  if (newTo <= hotelFormData.checkinTime.from) {
                    toast.error('Giờ check-in (đến) phải lớn hơn giờ check-in (từ)');
                    return;
                  }

                  setHotelFormData({
                    ...hotelFormData,
                    checkinTime: {
                      ...hotelFormData.checkinTime,
                      to: newTo,
                    },
                  });
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkout">Giờ check-out</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={format(hotelFormData.checkoutTime, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  date.setHours(hotelFormData.checkoutTime.getHours());
                  date.setMinutes(hotelFormData.checkoutTime.getMinutes());

                  if (
                    date <= hotelFormData.checkinTime.to ||
                    date <= hotelFormData.checkinTime.from
                  ) {
                    toast.error('Giờ check-out phải lớn hơn giờ check-in');
                    return;
                  }

                  setHotelFormData({
                    ...hotelFormData,
                    checkoutTime: date,
                  });
                }}
              />
              <Input
                id="checkout"
                type="time"
                value={new Date(hotelFormData.checkoutTime).toLocaleTimeString('en-US', {
                  hour12: false,
                })}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const newCheckout = new Date(hotelFormData.checkoutTime);
                  newCheckout.setHours(hours);
                  newCheckout.setMinutes(minutes);

                  if (
                    newCheckout <= hotelFormData.checkinTime.to ||
                    newCheckout <= hotelFormData.checkinTime.from
                  ) {
                    toast.error('Giờ check-out phải lớn hơn giờ check-in');
                    return;
                  }

                  setHotelFormData({
                    ...hotelFormData,
                    checkoutTime: newCheckout,
                  });
                }}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSubmit} disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : formMode === 'add' ? (
              'Thêm khách sạn'
            ) : (
              'Lưu thay đổi'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
