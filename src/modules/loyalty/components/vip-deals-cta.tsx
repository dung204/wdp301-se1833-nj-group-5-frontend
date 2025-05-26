'use client';

import { MapPin, Search, Star } from 'lucide-react';

import { Button } from '@/base/components/ui/button';
import { Card } from '@/base/components/ui/card';

export function VipDealsCta() {
  const handleStartSearch = () => {
    // Navigate to search/booking page
    window.location.href = '/';
  };

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Star className="h-8 w-8 text-yellow-300" />
          <h2 className="text-2xl font-bold">Ready to Unlock VIP Benefits?</h2>
        </div>

        <p className="mb-6 text-blue-100">
          Start your journey to exclusive deals, room upgrades, and premium perks. Every booking
          brings you closer to the next VIP tier.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            variant="secondary"
            onClick={handleStartSearch}
            className="bg-white px-8 font-semibold text-blue-600 hover:bg-gray-100"
          >
            <Search className="mr-2 h-5 w-5" />
            Start a New Search
          </Button>

          <div className="flex items-center gap-2 text-blue-100">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Find your perfect stay</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-200">
            Join thousands of satisfied guests who enjoy exclusive VIP benefits
          </p>
        </div>
      </div>
    </Card>
  );
}
