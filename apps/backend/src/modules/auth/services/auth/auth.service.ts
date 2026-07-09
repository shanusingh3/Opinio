import { Injectable } from '@nestjs/common';
import { SendOtpDto } from '../../dto/send-otp.dto';
import { VerifyOtpDto } from '../../dto/verify-otp.dto';

@Injectable()
export class AuthService {
    async sendOtp(dto: SendOtpDto) {
        console.log('Sending OTP...');
        return {
            message: 'OTP sent successfully',
        };
    }

    async verifyOtp(dto: VerifyOtpDto) {
        console.log('Verifying OTP...');
        return {
            message: 'OTP verified successfully',
        };
    }
}
