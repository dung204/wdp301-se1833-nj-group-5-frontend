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

  // Helper method to refresh user data after role upgrade
  public async refreshUserAfterApproval(requestId: string) {
    try {
      // Fetch the updated request to get the user info
      const updatedRequest = await this.getRequestById(requestId);
      if (updatedRequest.data && updatedRequest.data.status === 'APPROVED') {
        // The user's role should be updated in the database
        // Force a page reload to refresh all server components with new cookie data
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to refresh user data after approval:', error);
    }
  }
}

export const roleUpgradeRequestService = new RoleUpgradeRequestService();
