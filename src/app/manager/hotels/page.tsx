import { HotelManagement } from '@/modules/manager/pages/hotel/hotel.page';
import type { HotelSearchParams } from '@/modules/users/services/hotel.service';

interface ManageHotelsPageProps {
  searchParams: HotelSearchParams;
}

export default function ManageHotelsPage({ searchParams }: ManageHotelsPageProps) {
  return (
    <div>
      <HotelManagement searchParams={searchParams} />
    </div>
  );
}
