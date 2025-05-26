export type VIPTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface VIPRequirements {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
}

export interface VIPBenefits {
  bestPriceGuarantee: boolean;
  insiderDeals: boolean;
  vipDiscountPercentage: number;
  freeBreakfast: boolean;
  otherPerks: string[];
}

export interface UserLoyaltyStatus {
  id: string;
  fullName: string;
  currentTier: VIPTier;
  bookingsCompleted: number;
  bookingsInLastTwoYears: number;
  totalBookings: number;
}

export interface LoyaltyProgramInfo {
  vipRequirements: VIPRequirements;
  tierBenefits: Record<VIPTier, VIPBenefits>;
  programDescription: string;
  newFeatures: string[];
}
