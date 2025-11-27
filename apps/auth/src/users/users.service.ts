import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'apps/auth/src/users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from 'apps/auth/src/users/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
