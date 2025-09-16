import { Controller, Post, Body, Headers, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';
import { Request } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number; userId: number; program: string },
  ) {
    const paymentIntent = await this.paymentService.createPaymentIntent(body.amount, {
      userId: body.userId, // ✅ keep as number
      program: body.program,
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request, // ✅ use raw request
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const payload = req.body; // ⚠️ should be raw body (string | Buffer)

    let event: Stripe.Event;

    try {
      event = Stripe.webhooks.constructEvent(
        payload, // ✅ raw payload
        signature,
        webhookSecret,
      );
    } catch (err) {
      console.error(`❌ Webhook signature verification failed.`, err.message);
      throw err;
    }

    await this.paymentService.handleWebhook(event);
    return { received: true };
  }
}
