'use client';

import { useEffect } from 'react';

import { useAuth } from '@/base/hooks';
import { MessagesPage } from '@/modules/messages';

export default function Messages() {
  const { user, isLoading, isAuthenticated, requireAuth } = useAuth();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto h-screen">
      <MessagesPage currentUserId={user.id} />
    </div>
  );
}
