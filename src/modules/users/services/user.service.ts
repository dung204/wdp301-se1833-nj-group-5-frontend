import { HttpClient } from '@/base/lib';
import { CommonSearchParams, SuccessResponse } from '@/base/types';

import { CreateUserSchema, UpdateUserSchema, User } from '../types';

class UserService extends HttpClient {
  constructor() {
    super();
  }

  public getUserProfile() {
    return this.get<SuccessResponse<User>>('/users/profile', {
      isPrivateRoute: true,
    });
  }

  public getAllUsers(params?: CommonSearchParams) {
    return this.get<SuccessResponse<User[]>>('/users', {
      params,
    });
  }

  public getAllDeletedUsers(params?: CommonSearchParams) {
    return this.get<SuccessResponse<User[]>>('/users/deleted', {
      params,
    });
  }

  public getUserById(id: string) {
    return this.get<SuccessResponse<User>>(`/users/${id}`);
  }

  public createNewUser(payload: CreateUserSchema) {
    return this.post<SuccessResponse<User>>('/users', payload);
  }

  public updateUser(id: string) {
    return (payload: UpdateUserSchema) =>
      this.patch<SuccessResponse<User>>(`/users/${id}`, payload);
  }

  public softDeleteUser(id: string) {
    return this.delete(`/users/${id}`);
  }

  public restoreUser(id: string) {
    return this.patch<SuccessResponse<User>>(`/users/restore/${id}`);
  }
}

export const userService = new UserService();
