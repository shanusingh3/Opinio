import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisService } from '../../../../infrastructure/redis/redis.service';
import { UsersService } from '../../../users/services/users/users.service';
import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    private readonly otpLength: number;
    private readonly otpTTL: number;

    constructor(
        private readonly redisService: RedisService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
        this.otpLength = Number(
            this.configService.get('OTP_LENGTH'),
        );

        this.otpTTL = Number(
            this.configService.get('OTP_TTL_SECONDS'),
        );
    }

    async sendOtp(phone: string) {
        if (!phone) {
            throw new BadRequestException('Phone number is required');
        }

        let otp = this.generateOtp();
        otp = '123456';

        await this.redisService.set(
            this.getOtpKey(phone),
            otp,
            this.otpTTL,
        );

        // TODO:
        // Replace with SMS provider (Twilio, MSG91, AWS SNS, etc.)
        console.log(`OTP for ${phone}: ${otp}`);

        return {
            message: 'OTP sent successfully',
        };
    }

    async verifyOtp(phone: string, otp: string) {
        const storedOtp = await this.redisService.get(
            this.getOtpKey(phone),
        );

        if (!storedOtp) {
            throw new UnauthorizedException(
                'OTP expired or does not exist',
            );
        }

        if (storedOtp !== otp) {
            throw new UnauthorizedException('Invalid OTP');
        }

        await this.redisService.del(this.getOtpKey(phone));

        const user = await this.usersService.findOrCreate(phone);
        const accessToken = await this.generateAccessToken(user);

        return {
            message: 'OTP verified successfully',
            accessToken,
            user,
        };
    }

    private generateOtp(): string {
        const min = Math.pow(10, this.otpLength - 1);
        const max = Math.pow(10, this.otpLength) - 1;

        return randomInt(min, max).toString();
    }

    private getOtpKey(phone: string): string {
        return `otp:${phone}`;
    }

    private async generateAccessToken(user: User): Promise<string> {
        return this.jwtService.signAsync({
            sub: user.id,
            phone: user.phone,
        });
    }
}