'use client';

import { Crown, Gift, Star, TrendingUp } from 'lucide-react';

import { Card } from '@/base/components/ui/card';

export function VipSystemExplanation() {
  return (
    <Card className="p-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            How the VIP System Works
          </h2>
        </div>
        <p className="mx-auto max-w-2xl text-gray-600">
          Our VIP program rewards loyal customers with exclusive benefits and upgrades. The more you
          travel with us, the higher your status and the better your rewards.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="mb-2 font-semibold text-yellow-400 drop-shadow-md">Book & Earn</h3>
          <p className="text-sm text-gray-600">
            Every hotel booking earns you VIP points. The more you book, the faster you advance.
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <Star className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="mb-2 font-semibold text-yellow-400 drop-shadow-md">Level Up</h3>
          <p className="text-sm text-gray-600">
            Progress through Bronze, Silver, Gold, and Platinum tiers to unlock premium benefits.
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Gift className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="mb-2 font-semibold text-yellow-400 drop-shadow-md">Enjoy Benefits</h3>
          <p className="text-sm text-gray-600">
            Access exclusive perks like room upgrades, priority support, and special discounts.
          </p>
        </div>
      </div>
    </Card>
  );
}
