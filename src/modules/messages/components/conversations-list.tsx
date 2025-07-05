import { Search } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/base/components/ui/input';
import { LoadingIndicator } from '@/base/components/ui/loading-indicator';
import { ScrollArea } from '@/base/components/ui/scroll-area';

import { useConversations } from '../hooks';
import { Conversation } from '../types';
import { formatBookingDisplay } from '../utils';
import { ConversationCard } from './conversation-card';

interface ConversationsListProps {
  selectedConversation?: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  className?: string;
}

export function ConversationsList({
  selectedConversation,
  onSelectConversation,
  className,
}: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: conversations = [],
    isLoading,
    error,
  } = useConversations({
    search: searchQuery || undefined,
  });

  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const customerName =
      `${conversation.customer.firstName} ${conversation.customer.lastName}`.toLowerCase();

    // Use the formatBookingDisplay utility to get hotel name
    const { hotelName } = formatBookingDisplay(
      conversation.booking.hotel,
      conversation.booking.room,
    );
    const hotelNameLower = hotelName.toLowerCase();

    const orderCode = conversation.booking.orderCode?.toLowerCase() || '';
    const lastMessageContent = conversation.lastMessage.content.toLowerCase();

    return (
      customerName.includes(query) ||
      hotelNameLower.includes(query) ||
      orderCode.includes(query) ||
      lastMessageContent.includes(query)
    );
  });

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
        <p>Failed to load conversations. Please try again.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Search */}
      <div className="border-b p-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations list */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 p-4">
          {filteredConversations.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              {searchQuery ? (
                <p>No conversations found matching &ldquo;{searchQuery}&rdquo;</p>
              ) : (
                <p>No conversations yet</p>
              )}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation.booking.id}
                conversation={conversation}
                isSelected={selectedConversation?.booking.id === conversation.booking.id}
                onClick={() => onSelectConversation(conversation)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
