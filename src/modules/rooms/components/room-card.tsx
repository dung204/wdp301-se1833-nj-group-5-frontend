'use client';

import axios from 'axios';
import { CheckCircle, CreditCard, Maximize, Users, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { Badge } from '@/base/components/ui/badge';
import { Button } from '@/base/components/ui/button';
import { Card } from '@/base/components/ui/card';
import { Skeleton } from '@/base/components/ui/skeleton';
import { createBookingSchema } from '@/modules/bookings';

import { Room } from '../types';

type RoomCardProps = {
  room: Room;
};

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateToBooking = async () => {
    const id = crypto.randomUUID();
    const searchParamsObj = Object.fromEntries(searchParams.entries());
    const validatedSearchParams = createBookingSchema.parse({
      ...Object.fromEntries(searchParams.entries()),
      id,
      hotel: room.hotel.id,
      room: room.id,
      quantity: searchParamsObj.rooms,
    });

    await axios.post('/api/book/set', validatedSearchParams);
    router.push(`/book?id=${id}`);
  };

  return (
    <Card className="group overflow-hidden border-0 bg-white/80 p-0 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      <div className="lg:flex">
        {/* Room Image */}
        <div className="relative h-64 overflow-hidden lg:h-auto lg:w-96">
          <Image
            src={room.images[0].url}
            alt={room.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {room.isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 font-semibold text-white">
                <XCircle className="h-4 w-4" />
                Hết phòng
              </div>
            </div>
          )}
          {!room.isSoldOut && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-green-500 text-white hover:bg-green-600">
                <CheckCircle className="mr-1 h-3 w-3" />
                Còn phòng
              </Badge>
            </div>
          )}
        </div>

        {/* Room Details */}
        <div className="flex-1 p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">{room.name}</h3>
              <div className="mb-4 flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Maximize className="h-4 w-4" />
                  <span className="text-sm">{room.size} m²</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Tối đa {room.maxQuantity} người</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="mb-1 text-3xl font-bold text-blue-600">
                {room.rate?.toLocaleString('vi-VN')}₫
              </div>
              <div className="text-sm text-gray-500">/ đêm</div>
            </div>
          </div>

          {/* Room Amenities */}
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-gray-900">Tiện nghi phòng</h4>
            <div className="flex flex-wrap gap-2">
              {room.services?.map((amenity: string, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-gray-200 bg-gray-50 px-3 py-1 hover:bg-gray-100"
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {!room.isSoldOut && (
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-gray-50 p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{room.availability.total}</div>
                <div className="text-sm text-gray-600">Tổng số phòng</div>
              </div>
              <div className="rounded-xl bg-orange-50 p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{room.availability.booked}</div>
                <div className="text-sm text-gray-600">Đã đặt</div>
              </div>
              <div
                className={`rounded-xl p-4 text-center ${+room.availability.available === 0 ? 'bg-red-50' : 'bg-green-50'}`}
              >
                <div
                  className={`text-2xl font-bold ${+room.availability.available === 0 ? 'text-red-600' : 'text-green-600'}`}
                >
                  {room.availability.available}
                </div>
                <div className="text-sm text-gray-600">Còn lại</div>
              </div>
            </div>
          )}
          {/* Availability Info */}

          {/* Booking Button */}
          <div className="flex justify-center">
            <Button
              className={`rounded-xl px-8 py-3 text-base font-semibold transition-all duration-300 ${
                room.isSoldOut
                  ? 'cursor-not-allowed bg-gray-300 hover:bg-gray-300'
                  : 'transform bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
              }`}
              disabled={room.isSoldOut}
              onClick={navigateToBooking}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              {room.isSoldOut ? 'Hết phòng' : 'Đặt phòng ngay'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function RoomCardSkeleton() {
  return (
    <Card className="group overflow-hidden border-0 bg-white/80 p-0 backdrop-blur-sm duration-300">
      <div className="lg:flex">
        {/* Room Image */}
        <div className="relative h-64 overflow-hidden lg:h-auto lg:w-96">
          <Skeleton className="size-full rounded-r-none" />
        </div>

        {/* Room Details */}
        <div className="flex-1 p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                <Skeleton className="h-[1lh] w-3/4" />
              </h3>
              <div className="mb-4 flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="text-sm">
                    <Skeleton className="h-[1lh] w-[5ch]" />
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">
                    <Skeleton className="h-[1lh] w-[15ch]" />
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="mb-1 text-3xl font-bold text-blue-600">
                <Skeleton className="h-[1lh] w-[8ch]" />
              </div>
              <div className="text-sm text-gray-500">
                <Skeleton className="h-[1lh] w-[5ch]" />
              </div>
            </div>
          </div>

          {/* Room Amenities */}
          <div className="mb-6">
            <h4 className="mb-3 text-lg font-semibold text-gray-900">
              <Skeleton className="h-[1lh] w-[10ch]" />
            </h4>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20" />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="h-20">
              <Skeleton className="size-full" />
            </div>
            <div className="h-20">
              <Skeleton className="size-full" />
            </div>
            <div className="h-20">
              <Skeleton className="size-full" />
            </div>
          </div>
          {/* Availability Info */}

          {/* Booking Button */}
          <div className="flex justify-center">
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    </Card>
  );
}
