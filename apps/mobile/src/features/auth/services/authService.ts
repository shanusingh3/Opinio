import {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  RefreshTokenResponse,
} from '../api/authApi';

export interface IAuthService {
  sendOtp(request: SendOtpRequest): Promise<SendOtpResponse>;
  verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpResponse>;
  refreshToken(): Promise<RefreshTokenResponse>;
  logout(): Promise<void>;
}
