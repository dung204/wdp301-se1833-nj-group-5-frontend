import { z } from 'zod';

import { SuccessResponse } from '@/base/types';

// Enums
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
}

export enum SenderType {
  CUSTOMER = 'CUSTOMER',
  HOTEL_OWNER = 'HOTEL_OWNER',
}

// User profile type
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Booking type
export interface BookingInfo {
  id: string;
  hotel:
    | {
        id: string;
        name: string;
        address?: string;
      }
    | string
    | null;
  room:
    | {
        id: string;
        roomNumber: string;
        roomType: string;
      }
    | string
    | null;
  checkIn: string;
  checkOut: string;
  status: string;
  orderCode: string | null;
}

// Message type
export interface Message {
  id: string;
  booking: BookingInfo;
  sender: UserProfile;
  receiver: UserProfile;
  senderType: SenderType;
  content: string;
  messageType: MessageType;
  isRead: boolean;
  readAt?: string;
  attachmentUrl?: string;
  createTimestamp: string;
  updateTimestamp: string;
}

// Conversation type
export interface Conversation {
  booking: BookingInfo;
  customer: UserProfile;
  hotelOwner: UserProfile;
  lastMessage: Message;
  messageCount: number;
  unreadCount: number;
}

// Create message schema and type
export const createMessageSchema = z.object({
  booking: z.string().min(1, 'Booking ID is required'),
  receiver: z.string().min(1, 'Receiver ID is required'),
  content: z.string().min(1, 'Message content is required').max(1000, 'Message too long'),
  messageType: z.nativeEnum(MessageType).optional().default(MessageType.TEXT),
  attachmentUrl: z.string().url().optional().or(z.literal('')),
});

export type CreateMessageDto = z.infer<typeof createMessageSchema>;

// Message query schema and type
export const messageQuerySchema = z.object({
  booking: z.string().optional(),
  sender: z.string().optional(),
  receiver: z.string().optional(),
  senderType: z.nativeEnum(SenderType).optional(),
  messageType: z.nativeEnum(MessageType).optional(),
  isRead: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
  sortBy: z.string().optional().default('createTimestamp'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type MessageQueryDto = z.infer<typeof messageQuerySchema>;

// API response types
export type MessagesResponse = SuccessResponse<Message[]>;
export type MessageResponse = SuccessResponse<Message>;
export type ConversationsResponse = SuccessResponse<Conversation[]>;

// Frontend-specific types
export interface MessageFormData {
  content: string;
  attachmentUrl?: string;
  messageType?: MessageType;
}

export interface ConversationState {
  selectedConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  hasMore: boolean;
  page: number;
}

export interface MessageFilters {
  search?: string;
  messageType?: MessageType;
  isRead?: boolean;
}
