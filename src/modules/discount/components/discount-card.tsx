import { Badge } from '@/base/components/ui/badge';
import { Card, CardContent } from '@/base/components/ui/card';
import { Skeleton } from '@/base/components/ui/skeleton';
import { cn } from '@/base/lib';
import { StringUtils } from '@/base/utils';

import { Discount } from '../types';

type DiscountCardProps = {
  discount: Discount;
  className?: string;
};

export function DiscountCard({ discount, className }: DiscountCardProps) {
  return (
    <Card
      className={cn(
        'group grid grid-cols-3 gap-0 overflow-hidden border-0 bg-white p-0 transition-all duration-300',
        className,
      )}
    >
      <div className="relative col-span-1">
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 font-bold text-white">
            -{discount.amount}%
          </Badge>
        </div>
        <div className="relative h-30 overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
      </div>

      <CardContent className="col-span-2 space-y-2 py-4">
        <h3 className="line-clamp-1 text-lg font-semibold">{discount.title}</h3>
        <p className="text-muted-foreground line-clamp-1 text-sm">
          Hạn sử dụng: {StringUtils.formatDate(discount.expiredTimestamp)}
        </p>
        <p className="text-muted-foreground line-clamp-1 text-sm">
          Số lượng còn lại: {discount.usageCount}
        </p>
      </CardContent>
    </Card>
  );
}

export function DiscountCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        'group grid grid-cols-3 gap-0 overflow-hidden border-0 bg-white p-0 transition-all duration-300',
        className,
      )}
    >
      <div className="relative col-span-1">
        <Skeleton className="size-full rounded-r-none" />
      </div>

      <CardContent className="col-span-2 space-y-2 py-4">
        <h3 className="line-clamp-1 text-lg font-semibold">
          <Skeleton className="h-[1lh] w-2/3" />
        </h3>
        <p className="text-muted-foreground line-clamp-1 text-sm">
          <Skeleton className="h-[1lh] w-1/2" />
        </p>
        <p className="text-muted-foreground line-clamp-1 text-sm">
          <Skeleton className="h-[1lh] w-1/3" />
        </p>
      </CardContent>
    </Card>
  );
}
