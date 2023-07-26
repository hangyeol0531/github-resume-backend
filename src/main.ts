import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CLIENT_URL,
    methods: ['GET'],
    credentials: true,
  });
  useSwagger(app);
  await app.listen(3000);
}
bootstrap();
