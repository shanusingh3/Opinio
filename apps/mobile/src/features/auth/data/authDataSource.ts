import { User } from '../state/authTypes';

export interface AuthCredentials {
  token: string;
  user: User;
}

export interface IAuthDataSource {
  sendOtp(phone: string): Promise<void>;
  verifyOtp(phone: string, otp: string): Promise<AuthCredentials>;
  getStoredCredentials(): Promise<AuthCredentials | null>;
  storeCredentials(credentials: AuthCredentials): Promise<void>;
  clearCredentials(): Promise<void>;
  hasStoredCredentials(): Promise<boolean>;
}
