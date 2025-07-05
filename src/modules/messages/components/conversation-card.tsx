import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/base/components/ui/avatar';
import { Badge } from '@/base/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/base/components/ui/card';
import { cn } from '@/base/lib';

import { Conversation } from '../types';
import { formatBookingDisplay } from '../utils';

interface ConversationCardProps {
  conversation: Conversation;
  isSelected?: boolean;
  onClick: () => void;
}

export function ConversationCard({ conversation, isSelected, onClick }: ConversationCardProps) {
  const { booking, customer, hotelOwner, lastMessage, messageCount, unreadCount } = conversation;

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  const otherParticipant = lastMessage.sender.id === customer.id ? hotelOwner : customer;
  const isCustomerSender = lastMessage.sender.id === customer.id;

  // Get formatted booking display
  const { hotelName, roomInfo } = formatBookingDisplay(booking.hotel, booking.room);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20',
        isSelected && 'ring-primary ring-2 ring-offset-2',
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="truncate text-sm font-semibold">
                  {otherParticipant.firstName} {otherParticipant.lastName}
                </h3>
                <Badge variant={isCustomerSender ? 'default' : 'secondary'} className="text-xs">
                  {isCustomerSender ? 'Customer' : 'Hotel Owner'}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {hotelName} - {roomInfo}
              </p>
              <p className="text-muted-foreground text-xs">
                Booking ID: {booking.id?.substring(0, 8) || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {unreadCount > 0 && (
              <Badge variant="danger" className="px-1.5 py-0.5 text-xs">
                {unreadCount}
              </Badge>
            )}
            <span className="text-muted-foreground text-xs">
              {formatDate(lastMessage.createTimestamp)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground truncate text-sm">{lastMessage.content}</p>
          </div>
          <div className="ml-2 flex items-center space-x-2">
            <MessageSquare className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-xs">{messageCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
