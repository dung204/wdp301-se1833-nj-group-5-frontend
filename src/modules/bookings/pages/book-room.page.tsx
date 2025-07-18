'use client';

import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowRightIcon, DoorOpenIcon, MailIcon, OctagonX, UserRoundIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ComponentProps, useState } from 'react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/base/components/ui/alert-dialog';
import { Button } from '@/base/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/base/components/ui/card';
import { Label } from '@/base/components/ui/label';
import { LoadingIndicator } from '@/base/components/ui/loading-indicator';
import { RadioGroup, RadioGroupItem } from '@/base/components/ui/radio-group';
import { Separator } from '@/base/components/ui/separator';
import { PaymentMethod, paymentsService } from '@/modules/payments';
import { userService } from '@/modules/users';

import { CheckInCheckOutCard } from '../components/check-in-check-out-card';
import { DiscountsCard } from '../components/discounts-card';
import { HotelAndRoomInfoCard } from '../components/hotel-and-room-info-card';
import { TotalPriceCard } from '../components/total-price-card';
import { bookingsService } from '../services/bookings.service';
import { CreateBookingSchema } from '../types';

interface BookRoomPageProps {
  currentBooking: CreateBookingSchema;
}

export function BookRoomPage({ currentBooking }: BookRoomPageProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);

  const { mutate: triggerCreateBooking, isPending: isCreatingBooking } = useMutation({
    mutationFn: () =>
      bookingsService.createBooking({
        ...currentBooking,
        paymentMethod,
      }),
    onSuccess: async ({ data: createdBooking }) => {
      await axios.delete('/api/book/delete');

      if (paymentMethod === PaymentMethod.PAYMENT_GATEWAY) {
        window.location.href = createdBooking.paymentLink!;
        return;
      }

      router.push(`/book/success?id=${createdBooking.id}`);
    },
  });

  const {
    data: { data: user },
  } = useSuspenseQuery({
    queryKey: ['users', 'profile'],
    queryFn: () => userService.getUserProfile(),
  });

  return (
    <>
      <section className="relative mx-auto grid max-w-7xl grid-cols-3 gap-6 py-6">
        <div className="col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Thông tin khách chính</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 rounded-md bg-[#eff4fc] p-4">
                <div className="flex items-center gap-2">
                  <UserRoundIcon />
                  <p className="font-medium">{user?.fullName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MailIcon />
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Hình thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                className="grid grid-cols-2"
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={PaymentMethod.COD} id={PaymentMethod.COD} />
                  <Label htmlFor={PaymentMethod.COD} className="text-base">
                    Thanh toán tại nơi ở
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value={PaymentMethod.PAYMENT_GATEWAY}
                    id={PaymentMethod.PAYMENT_GATEWAY}
                  />
                  <Label htmlFor={PaymentMethod.PAYMENT_GATEWAY} className="text-base">
                    Chuyển khoản qua mã QR
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-2">
              <Button
                loading={isCreatingBooking}
                className="w-full bg-blue-500 text-center text-white uppercase shadow-xs hover:bg-blue-500/90 focus-visible:ring-blue-500/20"
                onClick={() => triggerCreateBooking()}
              >
                Kế tiếp: Bước cuối cùng
              </Button>
              <p className="text-success text-center font-medium">
                {paymentMethod === PaymentMethod.COD
                  ? 'Có liền xác nhận đặt phòng'
                  : 'Bạn sẽ được điều hướng đến trang thanh toán để hoàn tất đặt phòng. Vui lòng kiểm tra kỹ thông tin trước khi thanh toán.'}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1 flex flex-col gap-6">
          <CheckInCheckOutCard currentBooking={currentBooking} />
          <HotelAndRoomInfoCard currentBooking={currentBooking} />
          <DiscountsCard currentBooking={currentBooking} />
          <TotalPriceCard currentBooking={currentBooking} />
        </div>
      </section>
      <BookingDialog open={isCreatingBooking} />
    </>
  );
}

type BookRoomSuccessPageProps = {
  bookingId: string;
  orderCode?: string;
};

export function BookRoomSuccessPage({ bookingId, orderCode }: BookRoomSuccessPageProps) {
  const {
    data: { data: bookings },
  } = useSuspenseQuery({
    queryKey: ['bookings', 'all', { id: bookingId }],
    queryFn: () => bookingsService.getAllBookings({ id: bookingId }),
    refetchOnWindowFocus: false,
  });

  const {
    data: { data: isPaid },
  } = useSuspenseQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['payments', 'isPaid', { orderCode }],
    queryFn: () => {
      if (
        bookings.length === 0 ||
        bookings[0].paymentMethod !== PaymentMethod.PAYMENT_GATEWAY ||
        !orderCode
      ) {
        return {
          data: false,
        };
      }

      return paymentsService.checkPaymentPaid(orderCode);
    },
    refetchOnWindowFocus: false,
  });

  if (bookings.length === 0) {
    return <InvalidBookingPage />;
  }

  const currentBooking = bookings[0];

  if (currentBooking.paymentMethod === PaymentMethod.PAYMENT_GATEWAY && !isPaid) {
    return <BookingPaymentFailedPage />;
  }

  return (
    <section className="relative mx-auto grid max-w-7xl grid-cols-3 gap-6 py-6">
      <div className="col-span-2 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Đơn đặt phòng của quý khách <span className="text-success">đã xác nhận</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="flex gap-4 rounded-2xl border">
              <div className="flex h-full flex-col rounded-2xl bg-[#eff4fc] p-4">
                <span>Mã đặt phòng</span>
                <span className="w-[15ch] truncate text-lg font-semibold" title={currentBooking.id}>
                  {currentBooking.id}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-full flex-col justify-center">
                  <span className="text-muted-foreground">Nhận phòng</span>
                  <span className="text-lg font-semibold">
                    {new Date(currentBooking.checkIn).toLocaleDateString('vi-VN', {
                      weekday: 'narrow',
                      year: '2-digit',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </span>
                </div>
                <ArrowRightIcon />
                <div className="flex h-full flex-col justify-center">
                  <span className="text-muted-foreground">Trả phòng</span>
                  <span className="text-lg font-semibold">
                    {new Date(currentBooking.checkOut).toLocaleDateString('vi-VN', {
                      weekday: 'narrow',
                      year: '2-digit',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              <Separator orientation="vertical" />
              <div className="flex h-full flex-col items-center justify-center border-l p-4">
                <span className="text-muted-foreground">Số phòng</span>
                <span className="flex gap-2 text-lg font-semibold">
                  {currentBooking.quantity} <DoorOpenIcon />{' '}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-4">
            <Button className="bg-blue-500 text-center text-white shadow-xs hover:bg-blue-500/90 focus-visible:ring-blue-500/20">
              Xem chi tiết đơn đặt phòng
            </Button>
            <Link href="/">
              <Button variant="outline">Về trang chủ</Button>
            </Link>
          </CardFooter>
        </Card>
        <TotalPriceCard currentBooking={currentBooking} />
      </div>
      <div className="col-span-1 flex flex-col gap-6">
        <CheckInCheckOutCard currentBooking={currentBooking} />
        <HotelAndRoomInfoCard currentBooking={currentBooking} />
      </div>
    </section>
  );
}

export function InvalidBookingPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-6">
      <OctagonX className="text-danger size-60" />
      <span className="text-center text-lg">
        Thông tin đặt phòng không hợp lệ hoặc đã hết hạn.
        <br /> Vui lòng quay lại{' '}
        <Link href="/" className="text-blue-500 underline">
          trang chủ
        </Link>{' '}
        để tìm kiếm khách sạn khác.
      </span>
    </section>
  );
}

export function BookingPaymentFailedPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-6">
      <OctagonX className="text-danger size-60" />
      <span className="text-center text-lg">
        Thanh toán không thành công.
        <br /> Vui lòng quay lại{' '}
        <Link href="/" className="text-blue-500 underline">
          trang chủ
        </Link>{' '}
        để thử lại.
      </span>
    </section>
  );
}

function BookingDialog(props: ComponentProps<typeof AlertDialog>) {
  return (
    <AlertDialog {...props}>
      <AlertDialogContent className="items-center justify-center">
        <AlertDialogHeader>
          <AlertDialogTitle>Đang tiến hành đặt phòng...</AlertDialogTitle>
        </AlertDialogHeader>
        <LoadingIndicator className="size-14 justify-self-center" />
      </AlertDialogContent>
    </AlertDialog>
  );
}
