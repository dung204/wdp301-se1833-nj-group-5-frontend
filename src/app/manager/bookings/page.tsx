import { getQueryClient } from '@/base/lib';
import { bookingsSearchParamsSchema } from '@/modules/bookings';
import { ManagerBookingsPage } from '@/modules/bookings/pages/manager-booking.page';
import { bookingsService } from '@/modules/bookings/services/bookings.service';

type PageProps = {
  searchParams: Promise<unknown>;
};

export default async function Page({ searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams;
  const validatedSearchParams = bookingsSearchParamsSchema.parse(awaitedSearchParams);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['bookings', 'all', validatedSearchParams],
    queryFn: () => bookingsService.getAllBookings(validatedSearchParams),
  });

  return (
    <div>
      <ManagerBookingsPage searchParams={validatedSearchParams} />
    </div>
  );
}
