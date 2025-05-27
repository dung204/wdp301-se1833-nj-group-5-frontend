'use client';

import { useEffect, useState } from 'react';

import { AppHeader } from '@/base/components/layouts/app-header';

import { ProgramEnhancementBanner } from '../components/program-enhancement-banner';
import { VipBenefitsTable } from '../components/vip-benefits-table';
import { VipDealsCta } from '../components/vip-deals-cta';
import { VIPStatusCard } from '../components/vip-status-card';
import { VipSystemExplanation } from '../components/vip-system-explanation';
import { loyaltyService } from '../services/loyalty.service';
import { LoyaltyProgramInfo, UserLoyaltyStatus } from '../types';

export function LoyaltyProgramPage() {
  const [userStatus, setUserStatus] = useState<UserLoyaltyStatus | null>(null);
  const [programInfo, setProgramInfo] = useState<LoyaltyProgramInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userStatusData, programInfoData] = await Promise.all([
          loyaltyService.getUserLoyaltyStatus(),
          loyaltyService.getLoyaltyProgramInfo(),
        ]);

        setUserStatus(userStatusData);
        setProgramInfo(programInfoData);
      } catch (error) {
        console.error('Failed to load loyalty data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading your VIP status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userStatus || !programInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">
            Failed to load loyalty program data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Header with Theme Toggle */}
      <AppHeader
        title="VIP Loyalty Program"
        description="Welcome to our exclusive VIP program. Track your progress, discover benefits, and unlock amazing perks as you advance through our tier system."
        className="mb-8"
      />

      {/* VIP Status Card */}
      <VIPStatusCard userStatus={userStatus} vipRequirements={programInfo.vipRequirements} />

      {/* Program Enhancement Banner */}
      <ProgramEnhancementBanner />

      {/* VIP System Explanation */}
      <VipSystemExplanation />

      {/* VIP Benefits Table */}
      <VipBenefitsTable programInfo={programInfo} />

      {/* Call to Action */}
      <VipDealsCta />
    </div>
  );
}
