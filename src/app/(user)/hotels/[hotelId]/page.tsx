import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

import { getQueryClient } from '@/base/lib';
import { RoomsPage, roomSearchParamsSchema, roomsService } from '@/modules/rooms';

type PageProps = {
  searchParams: Promise<unknown>;
  params: Promise<{ hotelId: string }>;
};

export default async function Page({ searchParams, params }: PageProps) {
  const awaitedSearchParams = await searchParams;
  const { hotelId } = await params;
  const validatedSearchParams = roomSearchParamsSchema.parse(awaitedSearchParams);
  const queryClient = getQueryClient();

  // prefetchQuery: fetch truowcs khi cais page xuaat hieenj thi api dã dc goi 1 làn
  await queryClient.prefetchQuery({
    queryKey: ['rooms', 'all', validatedSearchParams],
    queryFn: () => roomsService.getAllRooms(validatedSearchParams),
  });

  return (
    // HydrationBoundary: các data đã fetch được sẽ được dehydrate
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
      //  fallback={<HotelsPageSkeleton />}
      >
        <RoomsPage
          key={JSON.stringify(validatedSearchParams)}
          searchParams={validatedSearchParams}
          hotelId={hotelId}
        />
      </Suspense>
    </HydrationBoundary>
  );
}
