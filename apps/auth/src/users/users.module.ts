import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from 'apps/auth/src/users/users.service';
import { DatabaseModule } from '@app/common/database';
import { UserDocument, UserSchema } from '@app/common/models/user.schema';
import { LoggerModule } from '@app/common/logger/logger.module';
import { UsersRepository } from 'apps/auth/src/users/users.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: UserDocument.name,
        schema: UserSchema,
      },
    ]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
