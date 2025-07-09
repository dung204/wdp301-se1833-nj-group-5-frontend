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

export function Famous() {
  const destinations = [
    { name: 'Hà Nội', image: '/hanoi.jpg', count: '10,744 chỗ ở' },
    { name: 'Hà Nội', image: '/hanoi.jpg', count: '10,744 chỗ ở' },
    { name: 'Hà Nội', image: '/flag-vn.jpg', count: '10,744 chỗ ở' },
    { name: 'Hà Nội', image: '/hanoi.jpg', count: '10,744 chỗ ở' },
    { name: 'Hà Nội', image: '/flag-vn.jpg', count: '10,744 chỗ ở' },
    { name: 'Hà Nội', image: '/hanoi.jpg', count: '10,744 chỗ ở' },
    { name: 'Hà Nội', image: '/hanoi.jpg', count: '10,744 chỗ ở' },
  ];

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">Các điểm đến nổi tiếng nhất Việt Nam</h2>

      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {destinations.map((destination, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 pl-2 md:basis-1/3 md:pl-4 lg:basis-1/4 xl:basis-1/5"
            >
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={destination.image || '/placeholder.svg'}
                      alt={destination.name}
                      width={200}
                      height={150}
                      className="h-[150px] w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <h3 className="font-medium text-gray-900">{destination.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{destination.count}</p>
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
