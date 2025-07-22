import Image from 'next/image';
import type * as React from 'react';

import { Card, CardContent } from '@/base/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/base/components/ui/carousel';

export function Discount() {
  const discounts = [
    { image: '/discount.jpg', alt: 'Cityhouse' },
    { image: '/discount.jpg', alt: 'Cityhouse' },
    { image: '/discount.jpg', alt: 'Cityhouse' },
    { image: '/discount.jpg', alt: 'Cityhouse' },
    { image: '/discount.jpg', alt: 'Cityhouse' },
    { image: '/discount.jpg', alt: 'Cityhouse' },
  ];

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chương trình khuyến mãi chỗ ở</h2>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          Xem tất cả
        </a>
      </div>

      <Carousel opts={{ align: 'start' }} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {discounts.map((item, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3 xl:basis-1/3"
            >
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.alt}
                      width={300}
                      height={150}
                      className="h-[150px] w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
