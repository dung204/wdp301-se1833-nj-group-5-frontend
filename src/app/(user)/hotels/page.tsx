import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

import { getQueryClient } from '@/base/lib';
import {
  HotelsPage,
  HotelsPageSkeleton,
  hotelSearchParamsSchema,
  hotelsService,
} from '@/modules/hotels';

type PageProps = {
  searchParams: Promise<unknown>;
};

export default async function Page({ searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams;
  const validatedSearchParams = hotelSearchParamsSchema.parse(awaitedSearchParams);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['hotels', 'all', validatedSearchParams],
    queryFn: () => hotelsService.getAllHotels(validatedSearchParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<HotelsPageSkeleton />}>
        <HotelsPage
          key={JSON.stringify(validatedSearchParams)}
          searchParams={validatedSearchParams}
        />
      </Suspense>
    </HydrationBoundary>
  );
}
