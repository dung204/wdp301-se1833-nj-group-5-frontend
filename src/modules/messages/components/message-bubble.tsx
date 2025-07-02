import { format } from 'date-fns';
import { Check, CheckCheck, MoreVertical, Trash2, User } from 'lucide-react';
import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/base/components/ui/avatar';
import { Badge } from '@/base/components/ui/badge';
import { Button } from '@/base/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/base/components/ui/dropdown-menu';
import { cn } from '@/base/lib';

import { Message, MessageType } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  onMarkAsRead?: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  onMarkAsRead,
  onDelete,
  canDelete = false,
}: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm');
    } catch {
      return 'Invalid time';
    }
  };

  const handleMarkAsRead = () => {
    if (!message.isRead && onMarkAsRead) {
      onMarkAsRead();
    }
  };

  return (
    <div className={cn('flex max-w-[80%] gap-3', isOwn && 'ml-auto flex-row-reverse')}>
      {showAvatar && (
        <Avatar className="mt-1 h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn('flex flex-col gap-1', isOwn && 'items-end')}>
        <div
          className={cn(
            'relative max-w-xs rounded-lg px-3 py-2 lg:max-w-md',
            isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted',
          )}
        >
          {/* Message content */}
          {message.messageType === MessageType.TEXT && (
            <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
          )}

          {message.messageType === MessageType.IMAGE && message.attachmentUrl && (
            <div className="space-y-2">
              <div className="relative h-48 w-full max-w-sm">
                <Image
                  src={message.attachmentUrl}
                  alt="Message attachment"
                  fill
                  className="rounded object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {message.content && (
                <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          )}

          {message.messageType === MessageType.FILE && message.attachmentUrl && (
            <div className="space-y-2">
              <a
                href={message.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background/10 hover:bg-background/20 flex items-center gap-2 rounded p-2 transition-colors"
              >
                <div className="bg-background/20 flex h-8 w-8 items-center justify-center rounded">
                  📄
                </div>
                <span className="text-sm font-medium">View File</span>
              </a>
              {message.content && (
                <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          )}

          {/* Message actions */}
          {(canDelete || (!message.isRead && !isOwn)) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'absolute -top-2 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100',
                    isOwn ? '-left-8' : '-right-8',
                  )}
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {!message.isRead && !isOwn && (
                  <DropdownMenuItem onClick={handleMarkAsRead}>
                    <Check className="mr-2 h-3 w-3" />
                    Mark as read
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-3 w-3" />
                    Delete message
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Message metadata */}
        <div
          className={cn(
            'text-muted-foreground flex items-center gap-2 text-xs',
            isOwn && 'flex-row-reverse',
          )}
        >
          <span>{formatTime(message.createTimestamp)}</span>

          {/* Sender type badge */}
          <Badge variant="outline" className="text-xs">
            {message.senderType === 'HOTEL_OWNER' ? 'Hotel' : 'Customer'}
          </Badge>

          {/* Read status for own messages */}
          {isOwn && (
            <div className="flex items-center">
              {message.isRead ? (
                <CheckCheck className="h-3 w-3 text-blue-500" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
