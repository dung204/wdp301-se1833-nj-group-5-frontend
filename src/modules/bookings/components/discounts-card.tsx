'use client';

import { useMutation, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Ticket, TicketIcon } from 'lucide-react';
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
import { cn } from '@/base/lib';
import { Discount, DiscountState, discountService } from '@/modules/discount';
import { DiscountCard, DiscountCardSkeleton } from '@/modules/discount/components/discount-card';

import { CreateBookingSchema } from '../types';

interface DiscountsCardProps {
  currentBooking: CreateBookingSchema;
}

export function DiscountsCard({ currentBooking }: DiscountsCardProps) {
  const [discountsDialogOpen, setDiscountsDialogOpen] = useState(false);
  const {
    data: { data: discounts },
  } = useSuspenseQuery({
    queryKey: ['discounts', 'all', { id: currentBooking.discount }],
    queryFn: async () => {
      if (!currentBooking.discount) {
        return {
          data: [] as Discount[],
        };
      }
      return discountService.getAllDiscounts({ id: currentBooking.discount });
    },
  });

  const discount = discounts[0];

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
        {!currentBooking.discount ? (
          <CardContent className="flex flex-col items-center gap-2">
            <p className="text-lg font-bold">Bạn chưa áp dụng phiếu giảm giá nào</p>
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
        ) : (
          <div className="px-6" onClick={() => setDiscountsDialogOpen(true)}>
            <DiscountCard discount={discount} className="cursor-pointer" />
          </div>
        )}
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
  const [discount, setDiscount] = useState(currentBooking.discount);
  const { mutate: triggerApplyDiscounts, isPending } = useMutation({
    mutationFn: () => axios.post('/api/book/set', { ...currentBooking, discount }),
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
            selectedDiscount={discount}
            currentBooking={currentBooking}
            onSelectedDiscountChange={setDiscount}
          />
        </Suspense>
        <DialogFooter className="items-end">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setDiscount(currentBooking.discount)}
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
  selectedDiscount: string | undefined;
  onSelectedDiscountChange?: (discount: string | undefined) => void;
};

function DiscountsList({
  currentBooking,
  selectedDiscount,
  onSelectedDiscountChange,
}: DiscountsListProps) {
  const { ref, inView } = useInView();
  const {
    data: { pages },
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ['discounts', 'all', { hotelId: currentBooking.hotel, state: DiscountState.ACTIVE }],
    queryFn: ({ pageParam }) =>
      discountService.getAllDiscounts({
        hotelId: currentBooking.hotel,
        page: pageParam,
        pageSize: 5,
        state: DiscountState.ACTIVE,
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
    <div
      className={cn('grow space-y-4 overflow-y-auto', {
        'flex items-center justify-center': discounts.length === 0 && !isFetchingNextPage,
      })}
    >
      {discounts.length === 0 ? (
        <div className="text-center">
          <div className="mx-auto max-w-md rounded-2xl bg-white/80 p-12 backdrop-blur-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Ticket className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Không có mã giảm giá nào</h3>
            <p className="mb-6 text-gray-600">
              Hiện tại không có mã giảm giá nào cho khách sạn này. Hãy kiểm tra lại sau hoặc liên hệ
              với khách sạn để biết thêm thông tin.
            </p>
          </div>
        </div>
      ) : (
        discounts.map((discount) => (
          <div
            key={discount.id}
            className="cursor-pointer"
            onClick={() =>
              onSelectedDiscountChange?.(selectedDiscount === discount.id ? undefined : discount.id)
            }
          >
            <DiscountCard
              key={discount.id}
              discount={discount}
              className={cn({ 'bg-success [&_*]:text-white': selectedDiscount === discount.id })}
            />
          </div>
        ))
      )}
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
