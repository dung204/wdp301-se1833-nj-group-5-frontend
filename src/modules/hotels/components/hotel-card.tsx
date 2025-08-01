'use client';

import { format } from 'date-fns';
import { MapPinIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/base/components/ui/button';
import { Card, CardContent } from '@/base/components/ui/card';
import { Skeleton } from '@/base/components/ui/skeleton';

import { Hotel, hotelSearchParamsSchema } from '../types';

type HotelCardProps = {
  hotel: Hotel;
};

export function HotelCard({ hotel }: HotelCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkIn, checkOut, minOccupancy, rooms } = hotelSearchParamsSchema
    .pick({ checkIn: true, checkOut: true, minOccupancy: true, rooms: true })
    .parse(Object.fromEntries(searchParams.entries()));

  const navigateToHotelDetails = () => {
    const url = new URL(`/hotels/${hotel.id}`, window.location.origin);

    url.searchParams.set('searchTerm', hotel.name);
    url.searchParams.set('checkIn', format(checkIn, 'yyyy-MM-dd'));
    url.searchParams.set('checkOut', format(checkOut, 'yyyy-MM-dd'));
    url.searchParams.set('minOccupancy', minOccupancy.toString());
    url.searchParams.set('rooms', rooms.toString());

    router.push(url.href);
  };

  return (
    <Card className="overflow-hidden p-0 transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Left side - Image */}
          <div className="relative w-full flex-shrink-0 sm:w-64">
            {hotel?.images && (Array.isArray(hotel.images) ? hotel.images[0] : hotel.images) ? (
              <Image
                src={Array.isArray(hotel.images) ? hotel.images[0].url : hotel.images}
                alt={hotel.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
                Không có ảnh
              </div>
            )}
          </div>

          {/* Right side - Content */}
          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              {/* Hotel details */}
              <div className="space-y-2">
                <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{hotel.name}</h3>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="mr-1 h-4 w-4 flex-shrink-0" />
                  <span className="line-clamp-1 text-sm">
                    {hotel.address}, {hotel.commune}, {hotel.province}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-blue-600">{hotel.rating.toFixed(1)}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarIcon
                        key={i}
                        size={16}
                        className={
                          hotel.rating >= i
                            ? 'fill-yellow-400 text-yellow-400'
                            : hotel.rating >= i - 0.5
                              ? 'fill-yellow-400 text-yellow-400 opacity-50'
                              : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="line-clamp-2 h-[2lh] text-sm text-gray-600">{hotel.description}</p>
              </div>

              {/* Check-in/out times */}
              <div className="flex flex-col justify-between space-y-2 rounded-lg lg:min-w-[200px]">
                <div className="text-right">
                  <div className="mb-1 text-3xl font-bold text-blue-600">
                    {hotel.priceHotel?.toLocaleString('vi-VN')}₫
                  </div>
                  <div className="text-sm text-gray-500">/ đêm</div>
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="w-20 text-sm text-gray-600">Check-in:</span>
                    <span className="text-sm font-medium">
                      {new Date(hotel.checkinTime.from).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      -
                      {new Date(hotel.checkinTime.to).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 text-sm text-gray-600">Check-out:</span>
                    <span className="text-sm font-medium">
                      {new Date(hotel.checkoutTime).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="mt-4">
              <div className="flex h-[1lh] flex-wrap items-center gap-1 text-sm">
                {hotel.services && hotel.services.length > 0 && (
                  <>
                    <span className="text-sm font-medium text-gray-700">Dịch vụ:</span>
                    <div className="flex flex-wrap gap-1">
                      {hotel.services.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex items-center justify-between pt-4">
              {/* Price section - uncomment if needed */}
              {/* <div className="flex flex-col">
                    {hotel.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {hotel.originalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}/đêm
                      </span>
                    )}
                    <span className="text-lg font-bold text-blue-600">
                      {hotel.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}/đêm
                    </span>
                  </div> */}

              <div className="ml-auto flex gap-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigateToHotelDetails()}
                >
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function HotelCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Image skeleton */}
          <div className="relative h-48 w-full flex-shrink-0 sm:w-64">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Content skeleton */}
          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              {/* Hotel details skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-16 w-full" />
              </div>

              {/* Check-in/out times skeleton */}
              <div className="space-y-2 rounded-lg bg-gray-50 p-3 lg:min-w-[200px]">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>

            {/* Services skeleton */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>

            {/* Actions skeleton */}
            <div className="mt-auto flex justify-end gap-2 pt-4">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
