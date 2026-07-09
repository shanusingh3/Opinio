import { IsMobilePhone, IsNotEmpty, Length } from "class-validator";


export class VerifyOtpDto {
    @IsNotEmpty()
    @IsMobilePhone('en-IN')
    phone: string;

    @IsNotEmpty()
    @Length(6, 6)
    otp: string;
}
