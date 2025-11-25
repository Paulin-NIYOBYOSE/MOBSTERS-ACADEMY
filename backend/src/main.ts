import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Set global API prefix
  app.setGlobalPrefix('api');
  
  // Configure CORS for production
  const allowedOrigins = [
    'http://localhost:8080', // Local development
    'https://mobsters-academy.vercel.app', // Production frontend
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Raw body for Stripe webhook
  app.use('/api/payment/webhook', (req, res, next) => {
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

  // Serve uploaded files with /uploads prefix
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();