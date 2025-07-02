import { zodResolver } from '@hookform/resolvers/zod';
import { Paperclip, Send, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/base/components/ui/button';
import { Input } from '@/base/components/ui/input';
import { Textarea } from '@/base/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/base/components/ui/tooltip';
import { cn } from '@/base/lib';

import { MessageType, createMessageSchema } from '../types';

interface CreateMessageData {
  booking: string;
  receiver: string;
  content: string;
  messageType?: MessageType;
  attachmentUrl?: string;
}

interface MessageInputProps {
  bookingId: string;
  receiverId: string;
  onSend: (data: CreateMessageData) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  bookingId,
  receiverId,
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
}: MessageInputProps) {
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateMessageData>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      booking: bookingId,
      receiver: receiverId,
      content: '',
      messageType: MessageType.TEXT,
      attachmentUrl: '',
    },
  });

  const content = watch('content');

  const onSubmit = async (data: CreateMessageData) => {
    try {
      const messageData = {
        ...data,
        attachmentUrl: attachmentUrl || undefined,
        messageType: attachmentUrl ? MessageType.IMAGE : MessageType.TEXT,
      };

      await onSend(messageData);

      // Reset form after successful send
      reset({
        booking: bookingId,
        receiver: receiverId,
        content: '',
        messageType: MessageType.TEXT,
        attachmentUrl: '',
      });
      setAttachmentUrl('');
      setShowAttachmentInput(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const handleAttachmentAdd = () => {
    setShowAttachmentInput(true);
  };

  const handleAttachmentRemove = () => {
    setAttachmentUrl('');
    setShowAttachmentInput(false);
    setValue('attachmentUrl', '');
  };

  const canSend = content.trim().length > 0 && !isSubmitting;

  return (
    <div className="bg-background border-t p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Attachment input */}
        {showAttachmentInput && (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter image URL..."
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="sm" onClick={handleAttachmentRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Attachment preview */}
        {attachmentUrl && (
          <div className="bg-muted rounded-lg border p-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Image attachment</span>
              <Button type="button" variant="ghost" size="sm" onClick={handleAttachmentRemove}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Message input */}
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1">
            <Textarea
              {...register('content')}
              placeholder={placeholder}
              disabled={disabled}
              onKeyDown={handleKeyPress}
              className={cn(
                'max-h-32 min-h-[60px] resize-none',
                errors.content && 'border-destructive',
              )}
              rows={2}
            />
            {errors.content && <p className="text-destructive text-xs">{errors.content.message}</p>}
          </div>

          <div className="flex items-center gap-1">
            {/* Attachment button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAttachmentAdd}
                    disabled={disabled || showAttachmentInput}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add image attachment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Send button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" size="sm" disabled={!canSend || disabled} className="px-3">
                    <Send className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message (Enter)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Hidden inputs */}
        <input type="hidden" {...register('booking')} />
        <input type="hidden" {...register('receiver')} />
        <input type="hidden" {...register('messageType')} />
        <input type="hidden" {...register('attachmentUrl')} value={attachmentUrl} />
      </form>
    </div>
  );
}
