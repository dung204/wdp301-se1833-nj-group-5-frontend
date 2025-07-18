import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { BookRoomPage, InvalidBookingPage, createBookingSchema } from '@/modules/bookings';

type PageProps = {
  searchParams: Promise<{ id: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { id: bookingId } = await searchParams;
  const cookieStore = await cookies();
  const createBookingPayload = createBookingSchema.safeParse(
    JSON.parse(decodeURIComponent(cookieStore.get('booking')?.value || '{}')),
  ).data;

  if (createBookingPayload?.id === bookingId) {
    return (
      <Suspense>
        <BookRoomPage currentBooking={createBookingPayload} />
      </Suspense>
    );
  }

  return <InvalidBookingPage />;
}
