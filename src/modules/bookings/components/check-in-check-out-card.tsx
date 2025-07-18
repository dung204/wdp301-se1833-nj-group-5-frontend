import { differenceInDays } from 'date-fns';
import { ArrowRightIcon } from 'lucide-react';

import { Card, CardContent } from '@/base/components/ui/card';

import { Booking, CreateBookingSchema } from '../types';

interface CheckInCheckOutCardProps {
  currentBooking: CreateBookingSchema | Booking;
}

export function CheckInCheckOutCard({ currentBooking }: CheckInCheckOutCardProps) {
  const nightsToStay = differenceInDays(
    new Date(currentBooking.checkOut),
    new Date(currentBooking.checkIn),
  );

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-muted-foreground text-sm">Nhận phòng</p>
          <p className="text-lg font-semibold">
            {new Date(currentBooking.checkIn).toLocaleDateString('vi-VN', {
              weekday: 'narrow',
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
            })}
          </p>
        </div>
        <ArrowRightIcon />
        <div className="flex flex-col">
          <p className="text-muted-foreground text-sm">Trả phòng</p>
          <p className="text-lg font-semibold">
            {new Date(currentBooking.checkOut).toLocaleDateString('vi-VN', {
              weekday: 'narrow',
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
            })}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold">{nightsToStay}</p>
          <p className="text-muted-foreground text-sm">đêm</p>
        </div>
      </CardContent>
    </Card>
  );
}
