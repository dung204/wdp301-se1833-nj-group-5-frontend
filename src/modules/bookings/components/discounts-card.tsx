import { TicketIcon } from 'lucide-react';

import { Button } from '@/base/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/base/components/ui/card';

import { CreateBookingSchema } from '../types';

interface DiscountsCardProps {
  currentBooking: CreateBookingSchema;
}

export function DiscountsCard({}: DiscountsCardProps) {
  return (
    <Card>
      <CardHeader className="grid-cols-2 items-center">
        <CardTitle className="flex items-center gap-2.5">
          <div className="bg-success flex size-8 items-center justify-center rounded-full">
            <TicketIcon className="text-success fill-white" />
          </div>
          <span className="text-lg">Phiếu giảm giá</span>
        </CardTitle>
        <Button variant="link" size="link" className="justify-self-end text-blue-500">
          Xem tất cả
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2">
        <p className="text-lg font-bold">Bạn chưa áp dụng phiếu giảm giá nào</p>
        <p>
          Nhấn{' '}
          <Button
            variant="link"
            size="link"
            className="text-base font-normal text-blue-500 underline"
          >
            vào đây
          </Button>{' '}
          để chọn phiếu giảm giá
        </p>
      </CardContent>
    </Card>
  );
}
