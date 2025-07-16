'use client';

import { CheckIcon, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/base/lib';

export function BookingSteps() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="text-muted-foreground flex flex-col items-center justify-center gap-1">
        <div
          className={cn(
            'flex size-6 items-center justify-center rounded-full border-2 text-sm font-semibold',
            {
              'border-blue-500 bg-blue-500 text-white': pathname === '/book',
              'border-success bg-success text-white': pathname !== '/book',
            },
          )}
        >
          {pathname !== '/book' ? <CheckIcon className="size-4" /> : 1}
        </div>
        <span
          className={cn({
            'text-blue-500': pathname === '/book',
            'text-success': pathname !== '/book',
            'font-medium': pathname !== '/book',
          })}
        >
          Thông tin khách hàng & thanh toán
        </span>
      </div>
      <ChevronRight className="text-muted-foreground" />
      <div className="text-muted-foreground flex flex-col items-center justify-center gap-1">
        <div
          className={cn(
            'flex size-6 items-center justify-center rounded-full border-2 text-sm font-semibold',
            {
              'border-blue-500 bg-blue-500 text-white': pathname === '/book/success',
            },
          )}
        >
          2
        </div>
        <span
          className={cn({
            'text-blue-500': pathname === '/book/success',
          })}
        >
          Đã xác nhận đặt phòng!
        </span>
      </div>
    </div>
  );
}
