import { IsEmail, IsString } from 'class-validator';

export class NotifyEmail {
  @IsEmail()
  email: string;

  @IsString()
  text: string;
}
