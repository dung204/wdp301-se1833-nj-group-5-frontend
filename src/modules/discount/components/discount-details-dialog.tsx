import { Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps } from 'react';

import { Badge } from '@/base/components/ui/badge';
import { Button } from '@/base/components/ui/button';
import { Card } from '@/base/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/base/components/ui/dialog';

import { Discount, discountStates } from '../types';

interface DiscountDetailsDialogProps extends ComponentProps<typeof Dialog> {
  discount: Discount | undefined;
}

export function DiscountDetailsDialog({ discount, ...props }: DiscountDetailsDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="max-h-[95vh] max-w-3xl overflow-y-auto p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <DialogHeader className="rounded-t-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="rounded-full bg-white/20 p-2">
                <Eye className="h-5 w-5" />
              </div>
              Thông tin chi tiết mã giảm giá
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {discount && (
              <div className="space-y-6">
                {/* Mức giảm giá & trạng thái */}
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                      <span className="line-clamp-1">{discount.title}</span>
                      <Badge className="bg-red-500 px-2 py-1 text-sm font-bold text-white">
                        -{discount.amount}%
                      </Badge>
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Hạn sử dụng:{' '}
                      <span className="font-medium text-red-600">
                        {new Date(discount.expiredTimestamp).toLocaleDateString('vi-VN')}
                      </span>
                    </p>
                  </div>
                  <Badge
                    className={
                      discount.state === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-600'
                    }
                  >
                    {discountStates[discount.state]}
                  </Badge>
                </div>

                {/* Số lượng sử dụng và giới hạn */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Card className="p-4 text-center">
                    <div className="text-sm text-gray-500">Số lượng còn lại</div>
                    <div className="text-2xl font-bold text-blue-600">{discount.usageCount}</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-sm text-gray-500">Giới hạn/người</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {discount.maxQuantityPerUser}
                    </div>
                  </Card>
                </div>

                {/* Danh sách khách sạn áp dụng */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Áp dụng cho khách sạn
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {discount.applicableHotels.length > 0 ? (
                      discount.applicableHotels.map((hotel) => (
                        <Link href={`/hotels/${hotel.id}`} key={hotel.id} className="rounded-lg">
                          <li className="flex items-start gap-3 bg-gray-50 p-3">
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={hotel?.images[0].url}
                                alt={hotel.name}
                                fill
                                className="object-cover object-center"
                              />
                            </div>
                            <div>
                              <p className="line-clamp-1 font-semibold text-gray-900">
                                {hotel.name}
                              </p>
                              <p className="line-clamp-1 text-sm text-gray-500">
                                {hotel.address}, {hotel.commune}, {hotel.province}
                              </p>
                            </div>
                          </li>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">Không áp dụng cho khách sạn nào</p>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="border-t bg-gray-50 p-6">
            <div className="flex w-full justify-end">
              <DialogClose asChild>
                <Button variant="outline">Đóng</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
