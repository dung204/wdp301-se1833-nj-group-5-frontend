import { Metadata } from 'next';
import { Suspense } from 'react';

import { HotelSearchBox } from '@/modules/hotels';
import { Destination, DestinationSkeleton } from '@/modules/users/pages/home/destinations/page';
import { Discount, DiscountSkeleton } from '@/modules/users/pages/home/discount/page';

export const metadata: Metadata = {
  title: 'Trang chủ',
};

export default function UserHomePage() {
  return (
    <div>
      <HotelSearchBox />
      <div className="flex justify-center px-16">
        <div className="w-full max-w-7xl">
          <Suspense fallback={<DestinationSkeleton />}>
            <Destination />
          </Suspense>
          <Suspense fallback={<DiscountSkeleton />}>
            <Discount />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
