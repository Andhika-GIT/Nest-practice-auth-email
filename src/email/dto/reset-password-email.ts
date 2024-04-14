import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class ResetPasswordEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  recipientEmail: string;

  @IsNotEmpty()
  @IsString()
  recipientName: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  URL: string;
}
