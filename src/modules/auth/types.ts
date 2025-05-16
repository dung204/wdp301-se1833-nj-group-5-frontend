import { z } from 'zod';

import { SuccessResponse } from '@/base/types';

export const loginSchema = z.object({
  email: z.string().nonempty().email(),
  password: z.string().min(8),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export type LoginSuccessResponse = SuccessResponse<{
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullName: string;
    avatar: string | null;
    description: string | null;
  };
}>;

export type RefreshTokenSuccessResponse = LoginSuccessResponse;

export const registerSchema = z.object({
  email: z.string().nonempty().email(),
  password: z.string().min(8),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
