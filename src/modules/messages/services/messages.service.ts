import { httpClient } from '@/base/lib';

import {
  ConversationsResponse,
  CreateMessageDto,
  MessageQueryDto,
  MessageResponse,
  MessagesResponse,
} from '../types';

export class MessagesService {
  private readonly baseUrl = 'messages';

  async sendMessage(data: CreateMessageDto): Promise<MessageResponse> {
    return httpClient.post<MessageResponse>(`${this.baseUrl}`, data);
  }

  async getMessages(params?: MessageQueryDto): Promise<MessagesResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    return httpClient.get<MessagesResponse>(url);
  }

  async getConversations(params?: Partial<MessageQueryDto>): Promise<ConversationsResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString
      ? `${this.baseUrl}/conversations?${queryString}`
      : `${this.baseUrl}/conversations`;

    return httpClient.get<ConversationsResponse>(url);
  }

  async getConversationMessages(
    bookingId: string,
    params?: MessageQueryDto,
  ): Promise<MessagesResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString
      ? `${this.baseUrl}/conversations/${bookingId}?${queryString}`
      : `${this.baseUrl}/conversations/${bookingId}`;

    return httpClient.get<MessagesResponse>(url);
  }

  async markAsRead(messageId: string): Promise<MessageResponse> {
    return httpClient.patch<MessageResponse>(`${this.baseUrl}/${messageId}/read`);
  }

  async deleteMessage(messageId: string): Promise<void> {
    return httpClient.delete(`${this.baseUrl}/${messageId}`);
  }
}

export const messagesService = new MessagesService();
