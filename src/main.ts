import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // TODO cors 임시 전체 허용
  app.enableCors();
  useSwagger(app);
  await app.listen(3000);
}
bootstrap();
