import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20', 
    });
  }

  async createPaymentIntent(
    amount: number,
    metadata: { userId: number; program: string },
  ) {
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        userId: String(metadata.userId), 
        program: metadata.program,
      },
    });
  }

  async handleWebhook(event: Stripe.Event) {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { userId, program } = paymentIntent.metadata;

      await this.prisma.pendingRoleRequest.upsert({
        where: { userId_program: { userId: +userId, program } },
        update: { status: 'paid' },
        create: { userId: +userId, program, status: 'paid' },
      });
    }
  }
}
