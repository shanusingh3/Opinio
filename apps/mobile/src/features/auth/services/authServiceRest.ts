import { apiClient } from '@/services/api/apiClient';

import {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  RefreshTokenResponse,
} from '../api/authApi';
import { IAuthService } from './authService';

class AuthServiceRest implements IAuthService {
  private static instance: AuthServiceRest;
  private readonly basePath = '/auth';

  private constructor() {}

  public static getInstance(): AuthServiceRest {
    if (!AuthServiceRest.instance) {
      AuthServiceRest.instance = new AuthServiceRest();
    }
    return AuthServiceRest.instance;
  }

  public async sendOtp(request: SendOtpRequest): Promise<SendOtpResponse> {
    return apiClient.post<SendOtpResponse>(
      `${this.basePath}/send-otp`,
      request,
    );
  }

  public async verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    return apiClient.post<VerifyOtpResponse>(
      `${this.basePath}/verify-otp`,
      request,
    );
  }

  public async refreshToken(): Promise<RefreshTokenResponse> {
    return apiClient.post<RefreshTokenResponse>(`${this.basePath}/refresh`);
  }

  public async logout(): Promise<void> {
    return apiClient.post(`${this.basePath}/logout`);
  }
}

export const authServiceRest = AuthServiceRest.getInstance();
