import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'apps/auth/src/decorators/user.decorator';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';
import { Response } from 'express';
import { LocalAuthGuard } from 'apps/auth/src/guards/local-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from 'apps/auth/src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @User() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.authService.login(user, response);
    response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    console.log(data, 'data');
    return data;
  }
}
