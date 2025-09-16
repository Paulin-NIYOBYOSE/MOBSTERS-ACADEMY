import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001', // Frontend origin
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Raw body for Stripe webhook
  app.use('/payment/webhook', (req, res, next) => {
    if (req.headers['content-type'] === 'application/json') {
      req.rawBody = '';
      req.on('data', chunk => { req.rawBody += chunk; });
      req.on('end', () => {
        try {
          req.body = JSON.parse(req.rawBody);
        } catch (e) {
          req.body = {};
        }
        next();
      });
    } else {
      next();
    }
  });

  await app.listen(3000);
}
bootstrap();