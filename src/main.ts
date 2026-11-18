import 'temporal-polyfill/global';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina silenciosamente propiedades que no estén en el DTO (seguridad extra)
      forbidNonWhitelisted: true, // Lanza un error HTTP 400 si intentan inyectar campos no permitidos
      transform: true, // Convierte los tipos automáticamente (ej. strings a números si el DTO lo requiere)
    }),
  );

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);



}
await bootstrap();
