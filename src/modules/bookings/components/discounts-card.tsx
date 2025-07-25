'use client';

import { useMutation, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TicketIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ComponentProps, Suspense, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Button } from '@/base/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/base/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/base/components/ui/dialog';
import { discountService } from '@/modules/discount';
import { DiscountCard, DiscountCardSkeleton } from '@/modules/discount/components/discount-card';

import { CreateBookingSchema } from '../types';

interface DiscountsCardProps {
  currentBooking: CreateBookingSchema;
}

export function DiscountsCard({ currentBooking }: DiscountsCardProps) {
  const [discountsDialogOpen, setDiscountsDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="grid-cols-2 items-center">
          <CardTitle className="flex items-center gap-2.5">
            <div className="bg-success flex size-8 items-center justify-center rounded-full">
              <TicketIcon className="text-success fill-white" />
            </div>
            <span className="text-lg">Phiếu giảm giá</span>
          </CardTitle>
          <Button
            variant="link"
            size="link"
            className="justify-self-end text-blue-500"
            onClick={() => setDiscountsDialogOpen(true)}
          >
            Xem tất cả
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <p className="text-lg font-bold">
            {currentBooking.discounts?.length > 0
              ? `Bạn đã ${currentBooking.discounts.length} áp dụng phiếu giảm giá`
              : 'Bạn chưa áp dụng phiếu giảm giá nào'}
          </p>
          <p>
            Nhấn{' '}
            <Button
              variant="link"
              size="link"
              className="text-base font-normal text-blue-500 underline"
              onClick={() => setDiscountsDialogOpen(true)}
            >
              vào đây
            </Button>{' '}
            để chọn phiếu giảm giá
          </p>
        </CardContent>
      </Card>
      <DiscountsDialog
        currentBooking={currentBooking}
        open={discountsDialogOpen}
        onOpenChange={setDiscountsDialogOpen}
      />
    </>
  );
}

interface DiscountsDialogProps extends ComponentProps<typeof Dialog> {
  currentBooking: CreateBookingSchema;
}

function DiscountsDialog({ currentBooking, ...props }: DiscountsDialogProps) {
  const router = useRouter();
  const [discounts, setDiscounts] = useState<string[]>(currentBooking.discounts || []);
  const { mutate: triggerApplyDiscounts, isPending } = useMutation({
    mutationFn: () => axios.post('/api/book/set', { ...currentBooking, discounts }),
    onSuccess: () => {
      router.refresh();
      props.onOpenChange?.(false);
    },
  });

  return (
    <Dialog {...props}>
      <DialogContent className="flex h-[80vh] flex-col sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Mã giảm giá</DialogTitle>
          <DialogDescription>
            Hiện tại bạn có thể áp dụng các mã giảm giá sau cho đơn đặt phòng của mình.
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={<DiscountsListSkeleton />}>
          <DiscountsList
            selectedDiscounts={discounts}
            currentBooking={currentBooking}
            onSelectedDiscountsChange={setDiscounts}
          />
        </Suspense>
        <DialogFooter className="items-end">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setDiscounts(currentBooking.discounts || [])}
            >
              Đóng
            </Button>
          </DialogClose>
          <Button onClick={() => triggerApplyDiscounts()} loading={isPending}>
            Áp dụng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DiscountsListProps = {
  currentBooking: CreateBookingSchema;
  selectedDiscounts: string[];
  onSelectedDiscountsChange?: (discounts: string[]) => void;
};

function DiscountsList({
  currentBooking,
  selectedDiscounts,
  onSelectedDiscountsChange,
}: DiscountsListProps) {
  const { ref, inView } = useInView();
  const {
    data: { pages },
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ['discounts', 'all', { hotelId: currentBooking.hotel }],
    queryFn: ({ pageParam }) =>
      discountService.getAllDiscounts({
        hotelId: currentBooking.hotel,
        page: pageParam,
        pageSize: 5,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metadata.pagination.hasNextPage
        ? lastPage.metadata.pagination.currentPage + 1
        : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const discounts = pages.flatMap((page) => page.data);

  return (
    <div className="grow space-y-4 overflow-y-auto">
      {discounts.map((discount) => (
        <DiscountCard
          key={discount.id}
          discount={discount}
          withCheckbox
          checked={selectedDiscounts.includes(discount.id)}
          onCheckChange={(checked) => {
            const newDiscounts = checked
              ? [...selectedDiscounts, discount.id]
              : selectedDiscounts.filter((id) => id !== discount.id);
            onSelectedDiscountsChange?.(newDiscounts);
          }}
        />
      ))}
      {hasNextPage && (
        <div ref={ref}>
          <DiscountCardSkeleton />
        </div>
      )}
    </div>
  );
}

function DiscountsListSkeleton() {
  return (
    <div className="grow space-y-4 overflow-y-auto">
      {Array.from({ length: 5 }).map((_, index) => (
        <DiscountCardSkeleton key={index} />
      ))}
    </div>
  );
}
