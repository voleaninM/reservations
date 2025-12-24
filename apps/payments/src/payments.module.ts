import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from '@app/common/constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        TCP_PORT: Joi.number().required(),
        NOTIFICATIONS_PORT: Joi.number().required(),
        NOTIFICATIONS_HOST: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
      }),
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATIONS_HOST'),
            port: configService.get('NOTIFICATIONS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: 'STRIPE_API_KEY',
      useFactory: async (configService: ConfigService) =>
        configService.get('STRIPE_SECRET_KEY'),
      inject: [ConfigService],
    },
  ],
})
export class PaymentsModule {}
