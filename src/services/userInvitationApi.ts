import { apiService } from './api';

export interface UserInvitationRequest {
  email: string;
  expiration_days?: number;
}

export interface UserInvitationResponse {
  success: boolean;
  message: string;
  invitation_link: string;
  email_sent: boolean;
  expires_at: string;
}

class UserInvitationApiService {
  async createInvitation(email: string, expirationDays: number = 3): Promise<UserInvitationResponse> {
    return await apiService.authenticatedRequest<UserInvitationResponse>('/api/v1/auth/invite', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        expiration_days: expirationDays 
      })
    });
  }
}

export const userInvitationApiService = new UserInvitationApiService();
