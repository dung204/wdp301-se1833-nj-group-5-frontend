'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Banknote, Eye, FilterIcon, MapPin, User, UsersRound } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

import { Pagination } from '@/base/components/layout/pagination';
import { Button } from '@/base/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/base/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/base/components/ui/dialog';
import { Form } from '@/base/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/base/components/ui/table';
import { StringUtils } from '@/base/utils';
import { HotelUtils } from '@/modules/hotels/utils/hotel.utils';

import { bookingsService } from '../services/bookings.service';
import { Booking, BookingsSearchParams } from '../types';
import { BookingUtils } from '../utils/booking.utils';

type BookingsPageProps = {
  searchParams: BookingsSearchParams;
};
const bookingFilterSchema = z.object({
  hotelId: z.string().optional(),
  price: z.tuple([
    z.coerce.number().min(HotelUtils.DEFAULT_MIN_PRICE),
    z.coerce.number().max(HotelUtils.DEFAULT_MAX_PRICE),
  ]),
});
export function ManagerBookingsPage({ searchParams }: BookingsPageProps) {
  const router = useRouter();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const {
    data: {
      data: bookings,
      metadata: { pagination },
    },
  } = useSuspenseQuery({
    queryKey: ['bookings', 'all', searchParams],
    queryFn: () => bookingsService.getAllBookings(searchParams),
  });
  const handleApplyFilters = (payload: z.infer<typeof bookingFilterSchema>) => {
    const {
      hotelId,
      price: [minPrice, maxPrice],
    } = payload;

    const url = new URL(window.location.href);

    url.searchParams.set('minPrice', minPrice.toString());
    url.searchParams.set('maxPrice', maxPrice.toString());

    if (hotelId) {
      url.searchParams.set('hotelId', hotelId);
    } else {
      url.searchParams.delete('hotelId');
    }

    router.push(url.href);
  };

  return (
    <div>
      <div>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danh sách booking</h1>
            <p className="text-gray-600">Xem danh sách khách sạn được booking</p>
          </div>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              <div className="h-6 w-1 rounded-full bg-blue-500"></div>
              Bộ lọc tìm kiếm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form
              className="grid grid-cols-1 gap-8 lg:grid-cols-3"
              schema={bookingFilterSchema}
              defaultValues={{
                hotelId: searchParams.hotelId,
                price: [searchParams.minPrice, searchParams.maxPrice],
              }}
              fields={[
                {
                  name: 'hotelId',
                  type: 'select',
                  async: true,
                  ...HotelUtils.getHotelsByAdminAsyncSelectOptions('name'),
                  multiple: false,
                  clearable: true,
                  className: 'self-baseline',
                  render: ({ Label, Control }) => (
                    <>
                      <Label className="text-base font-semibold text-gray-700" />
                      <Control />
                    </>
                  ),
                },
                {
                  name: 'price',
                  type: 'slider',
                  label: 'Khoảng giá',
                  required: false,
                  range: true,
                  min: BookingUtils.DEFAULT_MIN_PRICE,
                  max: BookingUtils.DEFAULT_MAX_PRICE,
                  step: BookingUtils.PRICE_RANGE,
                  className: 'space-y-4',
                  numberFormat: (value) => StringUtils.formatCurrency(value.toString()),
                  render: ({ Label, Control }) => (
                    <>
                      <Label className="text-base font-semibold text-gray-700" />
                      <Control />
                    </>
                  ),
                },
              ]}
              renderSubmitButton={(Button) => (
                <div className="col-span-3 flex items-center justify-center">
                  <Button>
                    <FilterIcon />
                    Áp dụng bộ lọc
                  </Button>
                </div>
              )}
              onSuccessSubmit={handleApplyFilters}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Danh sách phòng</CardTitle>
            {/* <Select
                  triggerClassName="w-48"
                  options={[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'true', label: 'Đang hoạt động' },
                    { value: 'false', label: 'Ngừng hoạt động' },
                  ]}
                  clearable={false}
                  searchable={false}
                  value={searchParams.isActive}
                  onChange={handleFilterActive}
                /> */}
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              {bookings.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <Image src="/result-not-found.svg" alt="not found" width={200} height={200} />
                  <p>Không có booking.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      {[
                        'Tên phòng',
                        'Khách sạn',
                        'Chủ sở hữu',
                        'Giá một đêm',
                        'Số lượng người',
                        'Số phòng tối đa',
                        'Hành động',
                      ].map((header, index) => (
                        <TableHead key={index} className="font-semibold">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium text-gray-900">{booking.room.name}</div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="mr-1 h-4 w-4" />
                            <span className="max-w-[200px] truncate">{booking.hotel?.name}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center text-gray-600">
                            <User className="mr-1 h-4 w-4" />
                            {booking.hotel?.owner?.fullName}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center text-gray-600">
                            <Banknote className="mr-1 h-4 w-4" />
                            <span className="text-sm">
                              {booking.totalPrice.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              })}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center text-gray-600">
                            <UsersRound className="mr-1 h-4 w-4" />
                            <span className="text-sm">{booking.minOccupancy}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center text-gray-600">
                            <UsersRound className="mr-1 h-4 w-4" />
                            <span className="text-sm">{booking.quantity}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            className="flex items-center gap-2 rounded-md bg-green-500 px-3 py-1 text-sm text-white transition-all duration-150 hover:bg-green-600"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            <span>Chi tiết</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="mt-4">
              <Pagination pagination={pagination} />
            </div>
          </CardContent>
        </Card>
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-h-[95vh] max-w-3xl overflow-y-auto p-0">
            <div className="flex h-full flex-col">
              {/* Header */}
              <DialogHeader className="rounded-t-lg bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
                <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="rounded-full bg-white/20 p-2">
                    <Eye className="h-5 w-5" />
                  </div>
                  Thông tin chi tiết đặt phòng
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6">
                {selectedBooking && (
                  <div className="space-y-6 text-sm text-gray-700">
                    {/* Booking basic info */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-gray-500">Khách hàng</p>
                        <p className="font-semibold">{selectedBooking.user?.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Khách sạn</p>
                        <p className="font-semibold">{selectedBooking.hotel?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phòng</p>
                        <p className="font-semibold">{selectedBooking.room?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Số lượng phòng đặt</p>
                        <p className="font-semibold">{selectedBooking.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Số người tối thiểu</p>
                        <p className="font-semibold">{selectedBooking.minOccupancy}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phương thức thanh toán</p>
                        <p className="font-semibold">{selectedBooking.paymentMethod}</p>
                      </div>
                    </div>

                    {/* Check-in / Check-out */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500">Ngày nhận phòng</p>
                        <p className="font-semibold">
                          {new Date(selectedBooking.checkIn).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Ngày trả phòng</p>
                        <p className="font-semibold">
                          {selectedBooking.checkOut
                            ? new Date(selectedBooking.checkOut).toLocaleDateString('vi-VN')
                            : 'Chưa xác định'}
                        </p>
                      </div>
                    </div>

                    {/* Total price and status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500">Tổng giá</p>
                        <p className="font-semibold text-green-600">
                          {selectedBooking.totalPrice.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Trạng thái</p>

                        <div className="">{selectedBooking.status}</div>
                      </div>
                    </div>

                    {/* Cancellation Info */}
                    {/* {selectedBooking.status === 'CANCELLED' && (
                    <div className="rounded-lg bg-red-50 p-4 text-red-700">
                      <p className="font-semibold">Đã huỷ đơn</p>
                      {selectedBooking.cancellationReason && (
                        <p className="mt-1 text-sm italic">Lý do: {selectedBooking.cancellationReason}</p>
                      )}
                      {selectedBooking.cancelledAt && (
                        <p className="text-sm">Thời gian huỷ: {new Date(selectedBooking.cancelledAt).toLocaleString('vi-VN')}</p>
                      )}
                      {selectedBooking.refundAmount !== undefined && (
                        <p className="text-sm">Số tiền hoàn: {selectedBooking.refundAmount.toLocaleString('vi-VN')} VND</p>
                      )}
                    </div>
                  )} */}
                  </div>
                )}
              </div>

              {/* Footer */}
              <DialogFooter className="border-t bg-gray-50 p-6">
                <div className="flex w-full justify-end">
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                    Đóng
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
