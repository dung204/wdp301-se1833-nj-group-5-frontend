import { Suspense } from 'react';

import { getQueryClient } from '@/base/lib';
import { hotelsService, managerHotelSearchParamsSchema } from '@/modules/hotels';
import { ManagerHotelsPage } from '@/modules/hotels/pages/manager-hotels.page';

type PageProps = {
  searchParams: Promise<unknown>;
};

export default async function Page({ searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams;
  const validatedSearchParams = managerHotelSearchParamsSchema.parse(awaitedSearchParams);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['hotels', 'all', validatedSearchParams],
    queryFn: () => hotelsService.getAllHotels(validatedSearchParams),
  });

  return (
    <Suspense>
      <ManagerHotelsPage searchParams={validatedSearchParams} />
    </Suspense>
  );
}
