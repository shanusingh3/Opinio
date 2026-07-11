import { SecureStorage } from '@/services/storage/secureStorage';

import { IAuthService } from '../services/authService';
import { authServiceRest } from '../services/authServiceRest';
import { IAuthDataSource, AuthCredentials } from './authDataSource';

export class AuthDataSourceImpl implements IAuthDataSource {
  private static instance: AuthDataSourceImpl;
  private authService: IAuthService;

  private constructor(authService: IAuthService) {
    this.authService = authService;
  }

  public static getInstance(
    authService: IAuthService = authServiceRest,
  ): AuthDataSourceImpl {
    if (!AuthDataSourceImpl.instance) {
      AuthDataSourceImpl.instance = new AuthDataSourceImpl(authService);
    }
    return AuthDataSourceImpl.instance;
  }

  public async sendOtp(phone: string): Promise<void> {
    await this.authService.sendOtp({ phone });
  }

  public async verifyOtp(phone: string, otp: string): Promise<AuthCredentials> {
    const response = await this.authService.verifyOtp({ phone, otp });
    return {
      token: response.accessToken,
      user: {
        id: response.user.id,
        phone: response.user.phone,
        createdAt: response.user.createdAt,
      },
    };
  }

  public async getStoredCredentials(): Promise<AuthCredentials | null> {
    const credentials = await SecureStorage.getCredentials();
    if (!credentials) {
      return null;
    }
    return {
      token: credentials.token,
      user: credentials.user,
    };
  }

  public async storeCredentials(credentials: AuthCredentials): Promise<void> {
    await SecureStorage.setCredentials(credentials.token, credentials.user);
  }

  public async clearCredentials(): Promise<void> {
    await SecureStorage.clearCredentials();
  }

  public async hasStoredCredentials(): Promise<boolean> {
    return SecureStorage.hasCredentials();
  }
}

export const authDataSource = AuthDataSourceImpl.getInstance();
