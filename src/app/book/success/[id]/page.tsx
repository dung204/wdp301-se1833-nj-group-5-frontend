import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

import { getQueryClient } from '@/base/lib';
import { BookRoomSuccessPage } from '@/modules/bookings';
import { bookingsService } from '@/modules/bookings/services/bookings.service';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ id: string; orderCode?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { id: bookingId } = await params;
  const { orderCode } = await searchParams;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['bookings', 'all', { id: bookingId }],

    // @ts-expect-error id here is enough for the query
    queryFn: () => bookingsService.getAllBookings({ id: bookingId }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <BookRoomSuccessPage bookingId={bookingId} orderCode={orderCode} />
      </Suspense>
    </HydrationBoundary>
  );
}
