import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://tu-frontend.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
