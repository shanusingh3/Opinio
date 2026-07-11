import { IAuthDataSource, AuthCredentials } from '../data/authDataSource';
import { authDataSource } from '../data/authDataSourceImpl';

export interface IAuthRepository {
  sendOtp(phone: string): Promise<void>;
  verifyOtp(phone: string, otp: string): Promise<AuthCredentials>;
  getStoredCredentials(): Promise<AuthCredentials | null>;
  storeCredentials(credentials: AuthCredentials): Promise<void>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}

class AuthRepository implements IAuthRepository {
  private static instance: AuthRepository;
  private dataSource: IAuthDataSource;

  private constructor(dataSource: IAuthDataSource) {
    this.dataSource = dataSource;
  }

  public static getInstance(
    dataSource: IAuthDataSource = authDataSource,
  ): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository(dataSource);
    }
    return AuthRepository.instance;
  }

  public async sendOtp(phone: string): Promise<void> {
    await this.dataSource.sendOtp(phone);
  }

  public async verifyOtp(phone: string, otp: string): Promise<AuthCredentials> {
    const credentials = await this.dataSource.verifyOtp(phone, otp);
    await this.dataSource.storeCredentials(credentials);
    return credentials;
  }

  public async getStoredCredentials(): Promise<AuthCredentials | null> {
    return this.dataSource.getStoredCredentials();
  }

  public async storeCredentials(credentials: AuthCredentials): Promise<void> {
    await this.dataSource.storeCredentials(credentials);
  }

  public async logout(): Promise<void> {
    await this.dataSource.clearCredentials();
  }

  public async isAuthenticated(): Promise<boolean> {
    return this.dataSource.hasStoredCredentials();
  }
}

export const authRepository = AuthRepository.getInstance();
