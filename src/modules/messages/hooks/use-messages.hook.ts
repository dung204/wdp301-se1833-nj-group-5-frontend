import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { messagesService } from '../services';
import { CreateMessageDto, Message, MessageQueryDto } from '../types';

// Query keys
export const messageKeys = {
  all: ['messages'] as const,
  conversations: (params?: Partial<MessageQueryDto>) =>
    [...messageKeys.all, 'conversations', params] as const,
  conversationMessages: (bookingId: string, params?: MessageQueryDto) =>
    [...messageKeys.all, 'conversation', bookingId, params] as const,
  messages: (params?: MessageQueryDto) => [...messageKeys.all, 'list', params] as const,
};

// Conversations hook
export function useConversations(params?: Partial<MessageQueryDto>) {
  return useQuery({
    queryKey: messageKeys.conversations(params),
    queryFn: () => messagesService.getConversations(params),
    select: (data) => data.data,
  });
}

// Conversation messages hook
export function useConversationMessages(
  bookingId: string,
  params?: MessageQueryDto,
  enabled = true,
) {
  return useQuery({
    queryKey: messageKeys.conversationMessages(bookingId, params),
    queryFn: () => messagesService.getConversationMessages(bookingId, params),
    select: (data) => data.data,
    enabled: enabled && !!bookingId,
  });
}

// Messages hook
export function useMessages(params?: MessageQueryDto) {
  return useQuery({
    queryKey: messageKeys.messages(params),
    queryFn: () => messagesService.getMessages(params),
    select: (data) => data.data,
  });
}

// Send message mutation
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMessageDto) => messagesService.sendMessage(data),
    onSuccess: (response, variables) => {
      // Invalidate conversations
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });

      // Invalidate specific conversation messages
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversationMessages(variables.booking),
      });

      // Add the new message to the cache optimistically
      const newMessage = response.data;
      queryClient.setQueryData(
        messageKeys.conversationMessages(variables.booking),
        (old: Message[] | undefined) => {
          if (!old) return [newMessage];
          return [...old, newMessage];
        },
      );

      toast.success('Message sent successfully');
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    },
  });
}

// Mark as read mutation
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => messagesService.markAsRead(messageId),
    onSuccess: (response) => {
      const updatedMessage = response.data;

      // Update the message in all relevant queries
      queryClient.setQueriesData({ queryKey: messageKeys.all }, (old: Message[] | undefined) => {
        if (!old) return old;

        if (Array.isArray(old)) {
          return old.map((msg: Message) => (msg.id === updatedMessage.id ? updatedMessage : msg));
        }

        return old;
      });

      // Invalidate conversations to update unread count
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
    },
    onError: (error) => {
      console.error('Failed to mark message as read:', error);
      toast.error('Failed to mark message as read');
    },
  });
}

// Delete message mutation
export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => messagesService.deleteMessage(messageId),
    onSuccess: (_, messageId) => {
      // Remove the message from all relevant queries
      queryClient.setQueriesData({ queryKey: messageKeys.all }, (old: Message[] | undefined) => {
        if (!old) return old;

        if (Array.isArray(old)) {
          return old.filter((msg: Message) => msg.id !== messageId);
        }

        return old;
      });

      // Invalidate conversations
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });

      toast.success('Message deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    },
  });
}

// Bulk mark as read for conversation
export function useBulkMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageIds: string[]) => {
      const promises = messageIds.map((id) => messagesService.markAsRead(id));
      return Promise.all(promises);
    },
    onSuccess: () => {
      // Invalidate all message-related queries
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
      toast.success('Messages marked as read');
    },
    onError: (error) => {
      console.error('Failed to mark messages as read:', error);
      toast.error('Failed to mark messages as read');
    },
  });
}
