import { useSuspenseQuery } from '@tanstack/react-query';
import { ExpandIcon, MapPinIcon, ShieldCheckIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/base/components/ui/badge';
import { Card, CardContent } from '@/base/components/ui/card';
import { cn } from '@/base/lib';
import { cancelPolicies, hotelsService } from '@/modules/hotels';
import { roomsService } from '@/modules/rooms';

import { Booking, CreateBookingSchema } from '../types';

interface HotelAndRoomInfoCardProps {
  currentBooking: CreateBookingSchema | Booking;
}

export function HotelAndRoomInfoCard({ currentBooking }: HotelAndRoomInfoCardProps) {
  const {
    data: { data: hotels },
  } = useSuspenseQuery({
    queryKey: ['hotels', 'all', { id: currentBooking.hotel }],
    queryFn: () => {
      if (typeof currentBooking.hotel === 'string') {
        return hotelsService.getAllHotels({ id: currentBooking.hotel });
      }
      return {
        data: [currentBooking.hotel],
      };
    },
  });

  const {
    data: { data: rooms },
  } = useSuspenseQuery({
    queryKey: ['rooms', 'all', { id: currentBooking.room }],
    queryFn: () => {
      if (typeof currentBooking.room === 'string') {
        return roomsService.getAllRooms({ id: currentBooking.room });
      }
      return {
        data: [currentBooking.room],
      };
    },
  });

  const hotel = hotels[0];
  const room = rooms[0];

  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-5 gap-3">
          <div className="relative col-span-1">
            {/* <Image
              src={hotel.images[0].url}
              alt={hotel.name}
              fill
              className="rounded-md object-cover object-center"
            /> */}
          </div>
          <div className="col-span-4 flex flex-col gap-2">
            <h3 className="line-clamp-1 text-xl font-semibold" title={hotel.name}>
              {hotel.name}
            </h3>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon
                  key={`${hotel.id}-rating-${index}`}
                  className={cn('size-4', {
                    'fill-warning text-warning': index + 1 <= hotel.rating,
                    'fill-muted-foreground text-muted-foreground': index + 1 > hotel.rating,
                  })}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <MapPinIcon className="text-muted-foreground size-4 shrink-0" />
              <p className="text-muted-foreground line-clamp-1 text-sm">{hotel.address}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <ShieldCheckIcon className="text-muted-foreground size-4 shrink-0" />
            <p className="text-muted-foreground line-clamp-1 text-sm">Chính sách hủy phòng</p>
          </div>
          <p className="text-lg font-semibold">{cancelPolicies[hotel.cancelPolicy]}</p>
        </div>
        <div className="flex flex-col gap-6 rounded-md bg-[#eff4fc] p-4">
          <div className="grid grid-cols-5 gap-3">
            <div className="relative col-span-1">
              <Image
                src={room.images[0].url}
                alt={room.name}
                fill
                className="rounded-md object-cover object-center"
              />
            </div>
            <div className="col-span-4 flex flex-col gap-2">
              <h3
                className="line-clamp-1 flex gap-[0.5ch] text-lg font-semibold"
                title={`${currentBooking.quantity} x ${room.name}`}
              >
                <span className="shrink-0">{currentBooking.quantity}</span>
                <span className="shrink-0">x</span>
                <span className="line-clamp-1">{room.name}</span>
              </h3>
              <div className="flex items-center gap-1">
                <ExpandIcon className="size-4 shrink-0" />
                <p className="line-clamp-1 text-sm">
                  {room.size} m<sup>2</sup>, tối đa {room.maxQuantity} người ở
                </p>
              </div>
              <p className="line-clamp-1 text-sm">
                Số người ở: {currentBooking.minOccupancy} người
              </p>
            </div>
          </div>
          {room.services.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="font-medium">Các dịch vụ của phòng bao gồm:</p>
              <div className="flex flex-wrap gap-2">
                {room.services?.map((service, index) => (
                  <Badge
                    variant="outline"
                    key={`${room.id}-service-${index}`}
                    className="border-success text-success"
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
