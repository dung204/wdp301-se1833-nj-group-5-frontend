import { useSuspenseQuery } from '@tanstack/react-query';
import { differenceInDays } from 'date-fns';

import { Card, CardContent, CardFooter } from '@/base/components/ui/card';
import { cn } from '@/base/lib';
import { StringUtils } from '@/base/utils';
import { Discount, discountService } from '@/modules/discount';
import { roomsService } from '@/modules/rooms';

import { Booking, CreateBookingSchema } from '../types';

interface TotalPriceCardProps {
  currentBooking: CreateBookingSchema | Booking;
}

export function TotalPriceCard({ currentBooking }: TotalPriceCardProps) {
  const {
    data: { data: rooms },
  } = useSuspenseQuery({
    queryKey: ['rooms', 'all', { id: currentBooking.room }],
    queryFn: () => {
      if (typeof currentBooking.room === 'string') {
        return roomsService.getAllRooms({ id: currentBooking.room });
      }
      return {
        data: [currentBooking.room],
      };
    },
  });
  const {
    data: { data: discounts },
  } = useSuspenseQuery({
    queryKey: ['discounts', 'all', { id: currentBooking.discount }],
    queryFn: async () => {
      if (!currentBooking.discount) {
        return {
          data: [] as Discount[],
        };
      }
      return discountService.getAllDiscounts({ id: currentBooking.discount });
    },
  });

  const room = typeof currentBooking.room === 'string' ? rooms[0] : currentBooking.room;

  const nightsToStay = differenceInDays(
    new Date(currentBooking.checkOut),
    new Date(currentBooking.checkIn),
  );

  const originalPrice = room.rate * currentBooking.quantity * nightsToStay;
  const discount = discounts[0];
  const totalDiscountPrice = (originalPrice * (discount?.amount || 0)) / 100;

  return (
    <Card className="gap-0 p-0">
      <CardContent className="bg-accent grid grid-cols-3 gap-2 p-6">
        <p className="col-span-2">
          Giá phòng ({currentBooking.quantity} phòng x {nightsToStay} đêm)
        </p>
        <p
          className={cn('col-span-1 justify-self-end', {
            'line-through': !!discount,
          })}
        >
          {StringUtils.formatCurrency(originalPrice.toString())}
        </p>
        {discount && (
          <>
            <p className="text-success col-span-2">Phiếu giảm giá</p>
            <p className={cn('text-success col-span-1 justify-self-end', {})}>
              -{StringUtils.formatCurrency(totalDiscountPrice.toString())}
            </p>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch border-t pb-6">
        <div className="grid grid-cols-3">
          <p className="col-span-2 text-lg font-semibold">Giá cuối cùng</p>
          <p className="col-span-1 justify-self-end text-lg font-semibold">
            {StringUtils.formatCurrency((originalPrice - totalDiscountPrice).toString())}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
