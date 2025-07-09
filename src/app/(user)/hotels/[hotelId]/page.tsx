import { Suspense } from 'react';

import { RoomsPage } from '@/modules/hotels/pages/rooms.page';
import { roomSearchParamsSchema } from '@/modules/rooms';

type PageProps = {
  searchParams: Promise<unknown>;
  params: Promise<{ hotelId: string }>;
};

export default async function Page({ searchParams, params }: PageProps) {
  const awaitedSearchParams = await searchParams;
  const { hotelId } = await params;
  const validatedSearchParams = roomSearchParamsSchema.parse(awaitedSearchParams);
  return (
    // HydrationBoundary: các data đã fetch được sẽ được dehydrate
    <Suspense
    //  fallback={<HotelsPageSkeleton />}
    >
      <RoomsPage
        key={JSON.stringify(validatedSearchParams)}
        searchParams={validatedSearchParams}
        hotelId={hotelId}
      />
    </Suspense>
  );
}
