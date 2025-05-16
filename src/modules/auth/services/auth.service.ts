import { HttpClient } from '@/base/lib';
import { LoginSchema, LoginSuccessResponse } from '@/modules/auth/types';

class AuthService extends HttpClient {
  constructor() {
    super();
  }

  public register(payload: LoginSchema) {
    return this.post<LoginSuccessResponse>('/auth/register', payload);
  }

  public login(payload: LoginSchema) {
    return this.post<LoginSuccessResponse>('/auth/login', payload);
  }

  public logout() {
    return this.delete<LoginSuccessResponse>('/auth/logout', {
      isPrivateRoute: true,
    });
  }
}

export const authService = new AuthService();
