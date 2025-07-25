'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import type * as React from 'react';

import { Card, CardContent } from '@/base/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/base/components/ui/carousel';
import { Skeleton } from '@/base/components/ui/skeleton';
import { provincesService } from '@/modules/provinces';

export function Destination() {
  const { data: provinces } = useSuspenseQuery({
    queryKey: ['provinces', 'all'],
    queryFn: () => provincesService.getAllProvinces(),
  });

  return (
    <section className="container mx-auto mt-8 px-4 py-8">
      <h2 className="text-2xl font-bold">Các điểm đến thu hút nhất Việt Nam</h2>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {provinces.map((province, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 pl-2 md:basis-1/3 md:pl-4 lg:basis-1/4 xl:basis-1/5"
            >
              <Link
                href={`/hotels?searchTerm=${province.name.replaceAll(/(Thành phố|Tỉnh)/g, '').trim()}`}
              >
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0">
                    <div className="overflow-hidden rounded-lg">
                      <Image
                        src={'/flag-vn.jpg'}
                        alt={province.name}
                        width={200}
                        height={150}
                        className="h-[150px] w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <h3 className="font-medium text-gray-900">
                        {province.name.replaceAll(/(Thành phố|Tỉnh)/g, '').trim()}
                      </h3>
                      {/* <p className="mt-1 text-sm text-gray-500">{destination.count}</p> */}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}

export function DestinationSkeleton() {
  return (
    <section className="container mx-auto mt-8 px-4 py-8">
      <h2 className="text-2xl font-bold">Các điểm đến thu hút nhất Việt Nam</h2>
      <div className="flex gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card
            key={`destination-skeleton-${index}`}
            className="basis-1/2 border-0 pl-2 shadow-none md:basis-1/3 md:pl-4 lg:basis-1/4 xl:basis-1/5"
          >
            <CardContent className="p-0">
              <div className="h-[150px] overflow-hidden rounded-lg">
                <Skeleton className="size-full" />
              </div>
              <div className="mt-3 text-center">
                <div className="flex justify-center font-medium text-gray-900">
                  <Skeleton className="h-[1lh] w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
