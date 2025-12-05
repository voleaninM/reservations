import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'apps/auth/src/decorators/user.decorator';
import { JwtAuthGuard } from 'apps/auth/src/guards/jwt-auth.guard';
import { CreateUserDto } from 'apps/auth/src/users/dto/create-user.dto';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';
import { UsersService } from 'apps/auth/src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUser(@User() user: UserDocument) {
    return user;
  }
}
