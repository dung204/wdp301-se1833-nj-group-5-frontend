'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/base/components/ui/carousel';
import { DiscountState, discountService } from '@/modules/discount';
import { DiscountCard, DiscountCardSkeleton } from '@/modules/discount/components/discount-card';

export function Discount() {
  const [api, setApi] = useState<CarouselApi>();
  const {
    data: { pages },
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ['discounts', 'all', { state: DiscountState.ACTIVE }],
    queryFn: ({ pageParam }) =>
      discountService.getAllDiscounts({
        page: pageParam,
        pageSize: 3,
        state: DiscountState.ACTIVE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metadata.pagination.hasNextPage
        ? lastPage.metadata.pagination.currentPage + 1
        : undefined,
  });

  const discounts = pages.flatMap((page) => page.data);

  useEffect(() => {
    if (!api) return;

    api.on('scroll', async () => {
      const lastSlide = api?.slideNodes().length - 1;
      const lastSlideInView = api?.slidesInView().includes(lastSlide);

      if (lastSlideInView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
  }, [api, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="container mx-auto space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chương trình khuyến mãi chỗ ở</h2>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          duration: 20,
        }}
      >
        <CarouselContent>
          {discounts.map((discount) => (
            <CarouselItem key={discount.id} className="basis-1/3">
              <DiscountCard discount={discount} />
            </CarouselItem>
          ))}
          {hasNextPage && (
            <CarouselItem className="basis-1/3">
              <DiscountCardSkeleton />
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}

export function DiscountSkeleton() {
  return (
    <section className="container mx-auto space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chương trình khuyến mãi chỗ ở</h2>
      </div>

      <div className="flex gap-4">
        <DiscountCardSkeleton className="basis-1/3" />
        <DiscountCardSkeleton className="basis-1/3" />
        <DiscountCardSkeleton className="basis-1/3" />
      </div>
    </section>
  );
}
