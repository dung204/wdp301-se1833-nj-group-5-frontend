import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { TokenManager } from '@/base/lib';

interface User {
  id: string;
  fullName: string;
  avatar: string | null;
  description: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = TokenManager.isAuthenticated();
      const currentUser = TokenManager.getUser();

      setIsAuthenticated(authenticated);
      setUser(currentUser);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData: User, accessToken: string, refreshToken: string) => {
    TokenManager.setTokens(accessToken, refreshToken);
    TokenManager.setUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    TokenManager.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    requireAuth,
  };
}
