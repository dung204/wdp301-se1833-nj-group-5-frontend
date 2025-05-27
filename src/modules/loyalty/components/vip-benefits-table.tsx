'use client';

import { Check, X } from 'lucide-react';

import { Badge } from '@/base/components/ui/badge';
import { Card } from '@/base/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/base/components/ui/table';

import { LoyaltyProgramInfo, VIPTier } from '../types';

interface VipBenefitsTableProps {
  programInfo: LoyaltyProgramInfo;
}

export function VipBenefitsTable({ programInfo }: VipBenefitsTableProps) {
  const tierOrder: VIPTier[] = ['bronze', 'silver', 'gold', 'platinum'];

  const getTierBadgeColor = (tier: VIPTier) => {
    switch (tier) {
      case 'bronze':
        return 'bg-amber-100 text-amber-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
    }
  };

  const benefitRows = [
    {
      name: 'Best Price Guarantee',
      getValue: (tier: VIPTier) => programInfo.tierBenefits[tier].bestPriceGuarantee,
    },
    {
      name: 'Insider Deals',
      getValue: (tier: VIPTier) => programInfo.tierBenefits[tier].insiderDeals,
    },
    {
      name: 'VIP Discount',
      getValue: (tier: VIPTier) => {
        const percentage = programInfo.tierBenefits[tier].vipDiscountPercentage;
        return percentage > 0 ? `${percentage}%` : false;
      },
    },
    {
      name: 'Free Breakfast',
      getValue: (tier: VIPTier) => programInfo.tierBenefits[tier].freeBreakfast,
    },
    {
      name: 'Priority Support',
      getValue: (tier: VIPTier) =>
        programInfo.tierBenefits[tier].otherPerks.includes('Priority support'),
    },
    {
      name: 'Late Checkout',
      getValue: (tier: VIPTier) =>
        programInfo.tierBenefits[tier].otherPerks.includes('Late checkout'),
    },
    {
      name: 'Room Upgrades',
      getValue: (tier: VIPTier) =>
        programInfo.tierBenefits[tier].otherPerks.includes('Room upgrades'),
    },
    {
      name: 'Concierge Service',
      getValue: (tier: VIPTier) =>
        programInfo.tierBenefits[tier].otherPerks.includes('Concierge service'),
    },
  ];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">VIP Benefits Comparison</h2>
        <p className="text-muted-foreground">
          Compare the exclusive benefits available at each VIP tier level.
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Benefits</TableHead>
              {tierOrder.map((tier) => (
                <TableHead key={tier} className="text-center">
                  <Badge variant="secondary" className={getTierBadgeColor(tier)}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </Badge>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {benefitRows.map((benefit, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{benefit.name}</TableCell>
                {tierOrder.map((tier) => {
                  const value = benefit.getValue(tier);
                  return (
                    <TableCell key={tier} className="text-center">
                      {typeof value === 'string' ? (
                        <span className="font-medium text-green-600">{value}</span>
                      ) : value ? (
                        <Check className="mx-auto h-5 w-5 text-green-600" />
                      ) : (
                        <X className="mx-auto h-5 w-5 text-gray-400" />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-muted/50 mt-6 rounded-lg p-4">
        <h3 className="mb-2 font-semibold">Tier Requirements</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {tierOrder.map((tier) => (
            <div key={tier} className="text-center">
              <Badge variant="outline" className={getTierBadgeColor(tier)}>
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </Badge>
              <p className="text-muted-foreground mt-1 text-sm">
                {programInfo.vipRequirements[tier]} bookings
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
