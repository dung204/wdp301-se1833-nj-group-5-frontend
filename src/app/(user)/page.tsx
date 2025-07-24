import { Metadata } from 'next';

import { HotelSearchBox } from '@/modules/hotels';
import { Destination } from '@/modules/users/pages/home/destinations/page';
import { Discount } from '@/modules/users/pages/home/discount/page';

export const metadata: Metadata = {
  title: 'Trang chủ',
};

export default function UserHomePage() {
  return (
    <div>
      <HotelSearchBox />
      <div className="flex justify-center px-16">
        <div className="w-full max-w-7xl">
          <Destination />
          <Discount />
        </div>
      </div>
    </div>
  );
}
