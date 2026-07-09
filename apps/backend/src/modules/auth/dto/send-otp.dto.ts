import { IsMobilePhone, IsNotEmpty } from "class-validator";

export class SendOtpDto {
  @IsNotEmpty()
  @IsMobilePhone('en-IN')
  phone: string;
}