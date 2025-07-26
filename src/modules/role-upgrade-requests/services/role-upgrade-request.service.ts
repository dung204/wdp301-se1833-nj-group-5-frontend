import { HttpClient } from '@/base/lib';
import { SuccessResponse } from '@/base/types';

import {
  CreateRoleUpgradeRequestSchema,
  RoleUpgradeRequest,
  RoleUpgradeRequestSearchParams,
  UpdateRoleUpgradeRequestSchema,
} from '../types';

class RoleUpgradeRequestService extends HttpClient {
  constructor() {
    super();
  }

  public createRequest(payload: CreateRoleUpgradeRequestSchema) {
    return this.post<SuccessResponse<RoleUpgradeRequest>>('/role-upgrade-requests', payload, {
      isPrivateRoute: true,
    });
  }

  public getCurrentUserRequest() {
    return this.get<SuccessResponse<RoleUpgradeRequest | null>>(
      '/role-upgrade-requests/my-request',
      {
        isPrivateRoute: true,
      },
    );
  }

  public getAllRequests(params?: RoleUpgradeRequestSearchParams) {
    return this.get<SuccessResponse<RoleUpgradeRequest[]>>('/role-upgrade-requests', {
      params,
      isPrivateRoute: true,
    });
  }

  public getRequestById(id: string) {
    return this.get<SuccessResponse<RoleUpgradeRequest>>(`/role-upgrade-requests/${id}`, {
      isPrivateRoute: true,
    });
  }

  public updateRequestStatus(id: string, payload: UpdateRoleUpgradeRequestSchema) {
    return this.patch<SuccessResponse<RoleUpgradeRequest>>(
      `/role-upgrade-requests/${id}`,
      payload,
      {
        isPrivateRoute: true,
      },
    );
  }
}

export const roleUpgradeRequestService = new RoleUpgradeRequestService();
