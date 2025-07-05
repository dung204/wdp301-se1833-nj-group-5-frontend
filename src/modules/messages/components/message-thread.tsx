import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/base/components/ui/button';
import { LoadingIndicator } from '@/base/components/ui/loading-indicator';
import { ScrollArea } from '@/base/components/ui/scroll-area';

import { useConversationMessages, useDeleteMessage, useMarkAsRead, useSendMessage } from '../hooks';
import { Conversation, MessageType } from '../types';
import { formatBookingDisplay } from '../utils';
import { MessageBubble } from './message-bubble';
import { MessageInput } from './message-input';

interface MessageThreadProps {
  conversation: Conversation;
  currentUserId: string;
  onBack?: () => void;
  className?: string;
}

export function MessageThread({
  conversation,
  currentUserId,
  onBack,
  className,
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const {
    data: messages = [],
    isLoading,
    error,
    refetch,
  } = useConversationMessages(conversation.booking.id);

  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const deleteMessageMutation = useDeleteMessage();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // Mark unread messages as read when conversation is viewed
  useEffect(() => {
    const unreadMessages = messages.filter(
      (msg) => !msg.isRead && msg.receiver.id === currentUserId,
    );

    if (unreadMessages.length > 0) {
      // Mark messages as read after a short delay
      const timer = setTimeout(() => {
        unreadMessages.forEach((msg) => {
          markAsReadMutation.mutate(msg.id);
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [messages, currentUserId, markAsReadMutation]);

  const handleSendMessage = async (data: {
    booking: string;
    receiver: string;
    content: string;
    messageType?: string;
    attachmentUrl?: string;
  }) => {
    // Convert the data to match the expected type
    const messageData = {
      booking: data.booking,
      receiver: data.receiver,
      content: data.content,
      messageType: (data.messageType as MessageType) || MessageType.TEXT,
      attachmentUrl: data.attachmentUrl,
    };

    await sendMessageMutation.mutateAsync(messageData);
    setAutoScroll(true);
    refetch();
  };

  const handleMarkAsRead = (messageId: string) => {
    markAsReadMutation.mutate(messageId);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessageMutation.mutate(messageId);
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollHeight - scrollTop === clientHeight;
    setAutoScroll(isAtBottom);
  };

  // Determine the other participant
  const otherParticipant =
    conversation.customer.id === currentUserId ? conversation.hotelOwner : conversation.customer;

  // Get formatted booking display
  const { hotelName, roomInfo } = formatBookingDisplay(
    conversation.booking.hotel,
    conversation.booking.room,
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center">
        <p>Failed to load messages. Please try again.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="bg-background border-b p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex-1">
            <h2 className="font-semibold">
              {otherParticipant.firstName} {otherParticipant.lastName}
            </h2>
            <p className="text-muted-foreground text-sm">
              {hotelName} - {roomInfo}
            </p>
            <p className="text-muted-foreground text-xs">
              Booking ID: {conversation.booking.id?.substring(0, 8) || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" onScrollCapture={handleScroll}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.sender.id === currentUserId;
              const previousMessage = index > 0 ? messages[index - 1] : null;
              const showAvatar =
                !previousMessage || previousMessage.sender.id !== message.sender.id;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  onMarkAsRead={() => handleMarkAsRead(message.id)}
                  onDelete={() => handleDeleteMessage(message.id)}
                  canDelete={isOwn}
                />
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <MessageInput
        bookingId={conversation.booking.id}
        receiverId={otherParticipant.id}
        onSend={handleSendMessage}
        disabled={sendMessageMutation.isPending}
        placeholder={`Message ${otherParticipant.firstName}...`}
      />
    </div>
  );
}
