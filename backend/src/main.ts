import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:8080', // Frontend origin
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

  // Serve uploaded files
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'));
  app.setBaseViewsDir(join(__dirname, '..', '..', 'uploads'));

  await app.listen(3000);
}
bootstrap();