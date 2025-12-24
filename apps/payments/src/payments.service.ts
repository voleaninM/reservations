import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from 'apps/payments/src/dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  constructor(
    private readonly configService: ConfigService,
    @Inject('STRIPE_API_KEY')
    private readonly apiKey: string,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createCharge({ email, amount }: PaymentsCreateChargeDto) {
    // For testing: Use Stripe test payment method token instead of raw card data
    // In production, card data should be tokenized on the frontend using Stripe.js
    const paymentMethod = 'pm_card_visa'; // Stripe test token that simulates a successful Visa payment

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100, // convert to cents
      currency: 'usd',
      payment_method: paymentMethod,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    this.notificationsService.emit('notify_email', {
      email,
      text: `Payment of $${amount} has completed successfully.`,
    });
    return paymentIntent;
  }
}
