import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotifyEmail } from 'apps/notifications/src/dto/notify-email.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('SMTP_USER'),
        clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
        clientSecret: this.configService.get('GOOGLE_OAUTH_SECRET_ID'),
        refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
      },
    });
  }

  notifyEmail(data: NotifyEmail) {
    console.log(data, 'data');

    return this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: data.email,
      subject: 'project notification',
      text: data.text,
    });
  }
}
