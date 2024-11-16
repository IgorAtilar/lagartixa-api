import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:4321',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
