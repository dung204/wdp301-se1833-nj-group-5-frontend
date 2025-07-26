import { getQueryClient } from '@/base/lib';
import { roomSearchParamsSchema } from '@/modules/rooms';
import { ManagerRoomsPage } from '@/modules/rooms/pages/manager-rooms.page';
import { roomsService } from '@/modules/rooms/services/rooms.service';

type PageProps = {
  searchParams: Promise<unknown>;
};

export default async function Page({ searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams;
  const validatedSearchParams = roomSearchParamsSchema.parse(awaitedSearchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['rooms', 'all', validatedSearchParams],
    queryFn: () => roomsService.getAllRooms(validatedSearchParams),
  });

  return (
    <div>
      <ManagerRoomsPage searchParams={validatedSearchParams} />
    </div>
  );
}
