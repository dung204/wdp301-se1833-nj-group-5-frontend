import { Suspense } from 'react';

import { discountsSearchParamsSchema } from '@/modules/discount';
import { ManagerDiscountsPage } from '@/modules/discount/pages/manager-discounts.page';

type PageProps = {
  searchParams: Promise<unknown>;
};

export default async function Page({ searchParams }: PageProps) {
  const validatedSearchParams = discountsSearchParamsSchema.parse(await searchParams);

  return (
    <Suspense>
      <ManagerDiscountsPage searchParams={validatedSearchParams} />
    </Suspense>
  );
}
