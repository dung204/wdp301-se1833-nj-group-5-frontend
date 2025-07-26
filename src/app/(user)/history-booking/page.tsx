import { getQueryClient } from '@/base/lib';
import { bookingsSearchParamsSchema } from '@/modules/bookings';
import { HistoryBookingPage } from '@/modules/bookings/pages/history-booking.page';
import { bookingsService } from '@/modules/bookings/services/bookings.service';

type PageProps = {
  searchParams: Promise<unknown>;
};
export default async function HistoryBooking({ searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams;
  const validatedSearchParams = bookingsSearchParamsSchema.parse(awaitedSearchParams);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['bookings', 'all', validatedSearchParams],
    queryFn: () => bookingsService.getAllBookings(validatedSearchParams),
  });
  return (
    <div>
      <HistoryBookingPage searchParams={validatedSearchParams} />
    </div>
  );
}
