import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

import { PrivatePage } from '@/modules/auth';
import { userService } from '@/modules/users';

export default async function Private() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['users', 'profile'],
    queryFn: userService.getUserProfile,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-4">
        <Suspense fallback={<p>Loading...</p>}>
          <PrivatePage />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
