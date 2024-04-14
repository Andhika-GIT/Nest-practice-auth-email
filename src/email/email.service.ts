import { MailerService } from '@nestjs-modules/mailer';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ResetPasswordEmailDto } from './dto/reset-password-email';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPassword(
    reset: ResetPasswordEmailDto,
  ): Promise<string | null> {
    try {
      await this.mailerService.sendMail({
        to: reset.recipientEmail,
        from: 'noreply@nestjs.com',
        subject: reset.subject,
        template: 'reset',
        context: {
          name: reset.recipientName,
          url: reset.URL,
        },
      });

      return 'sucessfully send reset email';
    } catch (err) {
      console.log(err);
      throw new BadGatewayException('something went wrong');
    }
  }
}
