'use client';

import { MapPin, Plane } from 'lucide-react';

import { Badge } from '@/base/components/ui/badge';
import { Card } from '@/base/components/ui/card';

export function ProgramEnhancementBanner() {
  return (
    <Card className="border-blue-200 bg-blue-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">
            New
          </Badge>
        </div>

        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Plane className="h-5 w-5 text-blue-600" />
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Book Flights and Activities</h3>
          </div>

          <p className="text-blue-800">
            Now also contribute to upgrading your VIP level faster! Earn status points beyond just
            accommodation bookings and unlock exclusive deals sooner.
          </p>
        </div>
      </div>
    </Card>
  );
}
