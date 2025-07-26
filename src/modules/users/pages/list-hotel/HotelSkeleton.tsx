import { Card, CardContent } from '@/base/components/ui/card';
import { Skeleton } from '@/base/components/ui/skeleton';

export function HotelSkeleton() {
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
