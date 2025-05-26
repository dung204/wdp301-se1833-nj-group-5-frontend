import { LoyaltyProgramInfo, UserLoyaltyStatus } from '../types';

// Mock service - call API later
export const loyaltyService = {
  async getUserLoyaltyStatus(): Promise<UserLoyaltyStatus> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'user-123',
          fullName: 'Hotel Guest',
          currentTier: 'bronze',
          bookingsCompleted: 0,
          bookingsInLastTwoYears: 0,
          totalBookings: 0,
        });
      }, 300);
    });
  },

  async getLoyaltyProgramInfo(): Promise<LoyaltyProgramInfo> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          vipRequirements: {
            bronze: 0,
            silver: 2,
            gold: 5,
            platinum: 8,
          },
          tierBenefits: {
            bronze: {
              bestPriceGuarantee: true,
              insiderDeals: false,
              vipDiscountPercentage: 0,
              freeBreakfast: false,
              otherPerks: [],
            },
            silver: {
              bestPriceGuarantee: true,
              insiderDeals: true,
              vipDiscountPercentage: 12,
              freeBreakfast: false,
              otherPerks: ['Priority support'],
            },
            gold: {
              bestPriceGuarantee: true,
              insiderDeals: true,
              vipDiscountPercentage: 18,
              freeBreakfast: true,
              otherPerks: ['Priority support', 'Late checkout'],
            },
            platinum: {
              bestPriceGuarantee: true,
              insiderDeals: true,
              vipDiscountPercentage: 25,
              freeBreakfast: true,
              otherPerks: [
                'Priority support',
                'Late checkout',
                'Room upgrades',
                'Concierge service',
              ],
            },
          },
          programDescription:
            'A loyalty program rewarding customers with deals, with automatic enrollment upon qualification.',
          newFeatures: [
            'Book Flights and Activities now contribute to upgrading your VIP level faster',
          ],
        });
      }, 300);
    });
  },
};
