import { MessageSquare, Users } from 'lucide-react';
import { useState } from 'react';

import { Card } from '@/base/components/ui/card';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/base/components/ui/resizable';
import { ThemeToggler } from '@/base/components/ui/theme-toggler';
import { cn } from '@/base/lib';

import { Conversation } from '../types';
import { ConversationsList } from './conversations-list';
import { MessageThread } from './message-thread';

interface MessagesPageProps {
  currentUserId: string;
  className?: string;
}

export function MessagesPage({ currentUserId, className }: MessagesPageProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsMobileView(true); // Show message thread on mobile
  };

  const handleBackToConversations = () => {
    setIsMobileView(false);
    setSelectedConversation(null);
  };

  return (
    <div className={cn('flex h-screen flex-col', className)}>
      {/* Header */}
      <div className="bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <h1 className="text-lg font-semibold">Messages</h1>
          </div>
          <ThemeToggler />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop view */}
        <div className="hidden h-full md:block">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Conversations panel */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
              <ConversationsList
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
                className="flex h-full flex-col"
              />
            </ResizablePanel>

            <ResizableHandle />

            {/* Message thread panel */}
            <ResizablePanel defaultSize={65}>
              {selectedConversation ? (
                <MessageThread
                  conversation={selectedConversation}
                  currentUserId={currentUserId}
                  className="flex h-full flex-col"
                />
              ) : (
                <Card className="flex h-full items-center justify-center">
                  <div className="space-y-4 text-center">
                    <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                      <Users className="text-muted-foreground h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Select a conversation</h3>
                      <p className="text-muted-foreground max-w-sm text-sm">
                        Choose a conversation from the list to start messaging with customers or
                        hotel owners.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile view */}
        <div className="h-full md:hidden">
          {!isMobileView || !selectedConversation ? (
            <ConversationsList
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
              className="flex h-full flex-col"
            />
          ) : (
            <MessageThread
              conversation={selectedConversation}
              currentUserId={currentUserId}
              onBack={handleBackToConversations}
              className="flex h-full flex-col"
            />
          )}
        </div>
      </div>

      {/* Empty state */}
      {!selectedConversation && (
        <div className="p-4 md:hidden">
          <Card className="space-y-4 p-6 text-center">
            <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full">
              <MessageSquare className="text-muted-foreground h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">No conversations selected</h3>
              <p className="text-muted-foreground text-sm">
                Select a conversation to start messaging.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
