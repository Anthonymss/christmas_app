import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  // Increase body size limit for S3 uploads
  app.use(express.json({ limit: '1gb' }));
  app.use(express.urlencoded({ extended: true, limit: '1gb' }));

  app.enableCors({
    origin: true, // Allow all origins dynamically (helps with mobile/webview quirks)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const server = await app.listen(process.env.PORT || 3000);
  server.setTimeout(300000); // 5 minutes timeout for large uploads
}
bootstrap();
