'use client';

import { Star } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/base/components/ui/avatar';
import { Badge } from '@/base/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/base/components/ui/card';
import { cn } from '@/base/lib';

import { UserLoyaltyStatus, VIPRequirements, VIPTier } from '../types';

interface VIPStatusCardProps {
  userStatus: UserLoyaltyStatus;
  vipRequirements: VIPRequirements;
  className?: string;
}

const tierColors: Record<VIPTier, string> = {
  bronze: 'bg-amber-100 text-amber-800 border-amber-200',
  silver: 'bg-gray-100 text-gray-800 border-gray-200',
  gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  platinum: 'bg-purple-100 text-purple-800 border-purple-200',
};

const tierLabels: Record<VIPTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

export function VIPStatusCard({ userStatus, vipRequirements, className }: VIPStatusCardProps) {
  const { fullName, currentTier, bookingsCompleted, bookingsInLastTwoYears } = userStatus;

  // Cho 8 làm max để chia progress bar
  const maxRequirement = vipRequirements.platinum;

  // Chia bar làm 8 khúc
  const totalSegments = 8;
  const filledSegments = Math.floor((bookingsCompleted / maxRequirement) * totalSegments);

  const tierPositions = {
    bronze: 0, // 0%
    silver: (vipRequirements.silver / maxRequirement) * 100, // 25%
    gold: (vipRequirements.gold / maxRequirement) * 100, // 62.5%
    platinum: 100, // 100%
  };

  // Lấy chữ cái đầu tiên của người dùng cho avatar :) Không biết có setup avatar như nào
  const userInitial = fullName.charAt(0).toUpperCase();

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Hi {fullName}</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-muted-foreground">Your status</span>
              <Badge variant="outline" className={cn('border', tierColors[currentTier])}>
                <Star className="mr-1 h-3 w-3" />
                VIP {tierLabels[currentTier]}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Số bookings trong 2 năm */}
        <div>
          <p className="text-muted-foreground text-sm">
            Bookings in last 2 years:{' '}
            <span className="text-foreground font-medium">{bookingsInLastTwoYears} completed</span>
          </p>
        </div>

        {/* VIP Progress */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">VIP Progress</span>
            <span className="text-muted-foreground">
              {bookingsCompleted}/{maxRequirement} bookings completed
            </span>
          </div>

          {/* Progress Bar 8 đoạn */}
          <div className="space-y-2">
            <div className="flex gap-1">
              {Array.from({ length: totalSegments }, (_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-3 flex-1 rounded-sm border',
                    index < filledSegments
                      ? 'bg-primary border-primary'
                      : 'bg-muted border-muted-foreground/20',
                  )}
                />
              ))}
            </div>

            {/* Tier markers bên dưới thanh */}
            <div className="relative">
              {/* Bronze - 0 bookings*/}
              <div className="absolute left-0 flex flex-col items-start">
                <div
                  className={cn(
                    'mb-1 h-2 w-2 rounded-full border',
                    bookingsCompleted >= vipRequirements.bronze
                      ? 'bg-primary border-primary'
                      : 'bg-background border-muted-foreground',
                  )}
                />
                <div className="text-left whitespace-nowrap">
                  <div className="font-medium text-amber-600">Bronze</div>
                </div>
              </div>

              {/* Silver - 2 bookings (25%) */}
              <div
                className="absolute flex flex-col items-center"
                style={{ left: `${tierPositions.silver}%`, transform: 'translateX(-50%)' }}
              >
                <div
                  className={cn(
                    'mb-1 h-2 w-2 rounded-full border',
                    bookingsCompleted >= vipRequirements.silver
                      ? 'bg-primary border-primary'
                      : 'bg-background border-muted-foreground',
                  )}
                />
                <div className="text-center whitespace-nowrap">
                  <div className="font-medium text-gray-600">Silver</div>
                  <div className="text-muted-foreground text-xs">
                    {vipRequirements.silver} bookings
                  </div>
                </div>
              </div>

              {/* Gold - 5 bookings (62.5%) */}
              <div
                className="absolute flex flex-col items-center"
                style={{ left: `${tierPositions.gold}%`, transform: 'translateX(-50%)' }}
              >
                <div
                  className={cn(
                    'mb-1 h-2 w-2 rounded-full border',
                    bookingsCompleted >= vipRequirements.gold
                      ? 'bg-primary border-primary'
                      : 'bg-background border-muted-foreground',
                  )}
                />
                <div className="text-center whitespace-nowrap">
                  <div className="font-medium text-yellow-600">Gold</div>
                  <div className="text-muted-foreground text-xs">
                    {vipRequirements.gold} bookings
                  </div>
                </div>
              </div>

              {/* Platinum - 8 bookings */}
              <div className="absolute right-0 flex flex-col items-end">
                <div
                  className={cn(
                    'mb-1 h-2 w-2 rounded-full border',
                    bookingsCompleted >= vipRequirements.platinum
                      ? 'bg-primary border-primary'
                      : 'bg-background border-muted-foreground',
                  )}
                />
                <div className="text-right whitespace-nowrap">
                  <div className="font-medium text-purple-600">Platinum</div>
                  <div className="text-muted-foreground text-xs">
                    {vipRequirements.platinum} bookings
                  </div>
                </div>
              </div>

              {/* Khoảng cách */}
              <div className="h-12"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
